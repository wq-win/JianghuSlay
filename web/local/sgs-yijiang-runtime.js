/** Y1–Y6 host transactions. Actual shared rules, not selectable placeholders. */
import {CardType,is_sha_type} from './models.js';
import {sgs_zhichi_effect_invalid,sgs_yijiang_combat_end_turn,sgs_yijiang_combat_public_state} from './sgs-yijiang-combat-skills.js';
import {sgs_yijiang_equipment_public_state} from './sgs-yijiang-equipment-skills.js';
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const TYPES={[CardType.WEAPON]:'weapon',[CardType.ARMOR]:'armor',[CardType.OFFENSIVE_HORSE]:'offensive_horse',[CardType.DEFENSIVE_HORSE]:'defensive_horse'};
const running=new WeakMap();
const state=g=>g.sgs_yijiang_runtime_state??={version:1,counter:0,exchanges:{},discard_phases:{},discard_moves:{}};
const live=p=>!!p&&!p.dead&&p.hp>0;
const slotBlocked=(p,slot)=>p[`${slot}_abolished`]===true||[p.abolished_equipment_slots,p.abolished_slots].some(v=>v instanceof Set?v.has(slot):Array.isArray(v)?v.includes(slot):v?.[slot]===true);
const pid=(g,p)=>{if(!g.all_players().includes(p))throw Error('一将事务角色不属于本对局');return g.player_id(p);};
const materialId=(g,c)=>g.card_history_material_id(c);
const physical=g=>[...g.deck.draw_pile,...g.deck.discard_pile,...g.processing_cards,...(g.offboard_cards??[]),...(g.sgs_zhangfen_removed_cards??[]),...(g.sgs_zhangfen_destroyed_cards??[]),
  ...g.all_players().flatMap(p=>[...p.hand,...p.judgment_cards,...(p.sgs_mountain_fields??[]),...(p.sgs_pojun_pile??[]),...(p.sgs_following_jieyue_pile??[]),...(p.sgs_followup_qian_pile??[]),...SLOTS.map(s=>p[s]).filter(Boolean)])];
function job(g,id,work){let jobs=running.get(g);if(!jobs)running.set(g,jobs=new Map());if(jobs.has(id))return jobs.get(id);
  const result=work().finally(()=>jobs.delete(id));jobs.set(id,result);return result;}
export const yijiangRuntimeMethods={
  yijiang_public_state(actor){
    const equipment=sgs_yijiang_equipment_public_state(actor),combat=sgs_yijiang_combat_public_state(this,actor);
    return {...combat,ganlu_used:equipment.ganlu_used_phases.includes(actor.play_phase_id)};
  },
  yijiang_card_effect_invalid(target,card,context={}){
    const blocked=sgs_zhichi_effect_invalid(this,target,card,context);
    if(blocked)this.view.emit(`${target.name}智迟：${card.name}的本次效果无效。`);
    return blocked;
  },
  validate_pojun_obligation(owner,materials,options){
    const {pile_id,turn_id,recipient,source}=options;
    if(typeof pile_id!=='string'||!pile_id||!Number.isSafeInteger(turn_id)||turn_id<1||turn_id!==this.turn_event_counter
      ||owner!==recipient||!source||!materials.length||materials.some(m=>!['hand',...SLOTS].includes(m.zone)))throw Error('破军暂置牌缺少合法回合与来源');
    pid(this,owner);pid(this,source);
    if((this.sgs_pojun_obligations??[]).some(r=>r.pile_id===pile_id))throw Error('破军暂置批次已存在');
  },
  register_pojun_obligation(owner,cards,{pile_id,turn_id,source}){
    // Called synchronously after physical destination, before ANY callback.
    (this.sgs_pojun_obligations??=[]).push({pile_id,turn_id,owner_id:pid(this,owner),source_id:pid(this,source),
      physical_ids:cards.map(c=>materialId(this,c)),status:'held'});
  },
  async settle_pojun_obligation(row,{dead=false,event_id=null}={}){
    if(row.status==='failed')throw Error('破军返还中断，请从原动作日志恢复');
    if(row.status!=='held')return;
    const owner=this.all_players().find(p=>pid(this,p)===row.owner_id);if(!owner)throw Error('破军返还所有者丢失');
    const cards=(owner.sgs_pojun_pile??[]).filter(c=>row.physical_ids.includes(materialId(this,c)));
    row.status='returning';
    try{
      if(cards.length){const result=await this.public_card_loss(owner,cards.map(card=>({zone:'pojun_pile',index:owner.sgs_pojun_pile.indexOf(card),card})),{
        to:dead||owner.dead?'discard':'hand',recipient:dead||owner.dead?null:owner,source:null,source_zone:'pojun_pile',
        action:'return_set_aside',visibility:dead||owner.dead?'public':'private',poison_exempt:true,reason:dead||owner.dead?'阵亡破军暂置牌清理':'破军回合末返还',
        source_skill:'sgs.pojun',move_id:`${row.pile_id}:return`,event_id});
        if(!result.committed)throw Error('破军返还实体牌校验失败');
      }
      row.status='done';row.destination=dead||owner.dead?'discard':'hand';
    }catch(error){row.status='failed';throw error;}
  },
  async clear_pojun_pile(actor,{event_id=null}={}){
    for(const row of this.sgs_pojun_obligations??[])if(row.owner_id===pid(this,actor))await this.settle_pojun_obligation(row,{dead:true,event_id});
  },
  async finish_yijiang_global_turn(turn_id){
    if(!Number.isSafeInteger(turn_id)||turn_id<1)return;
    // Obligations belong to the turn, not the current presence of a skill.
    try{for(const actor of this.action_order())for(const row of this.sgs_pojun_obligations??[])
      if(row.turn_id===turn_id&&row.owner_id===pid(this,actor))await this.settle_pojun_obligation(row);
    }finally{sgs_yijiang_combat_end_turn(this,turn_id);}
  },
  card_family(card){
    if(is_sha_type(card?.type)||[CardType.SHAN,CardType.TAO,CardType.WINE,CardType.POISON].includes(card?.type))return 'basic';
    if(card?.type===CardType.SCROLL)return 'trick';
    return TYPES[card?.type]?'equipment':null;
  },
  async trigger_any_dying_entry(dying,source,entry){
    for(const holder of this.action_order()){
      if(dying.dead||dying.hp>0||entry.waive_rescue)return;
      if(holder.dead)continue; // A dying holder can legitimately use 补益 on herself.
      for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_dying_entry??[])
        await hook(this,holder,{...entry,dying,source});
    }
  },
  begin_yijiang_discard_phase(actor){
    const s=state(this),id=`discard:${this.turn_event_counter}:${++s.counter}:${pid(this,actor)}`;
    s.discard_phases[id]={phase_id:id,actor_id:pid(this,actor),turn_id:this.turn_event_counter,count:0,status:'active'};
    actor.yijiang_discard_phase_id=id;return id;
  },
  record_yijiang_discard_loss(actor,event){
    const s=this.sgs_yijiang_runtime_state,id=actor?.yijiang_discard_phase_id,r=s?.discard_phases[id];
    if(!r||r.status!=='active'||this.turn_phase!=='discard'||this.turn_actor!==this.seat_of(actor)||!event?.committed
      ||event.to!=='discard'||!['discard',undefined,null].includes(event.action))return;
    const key=JSON.stringify([id,event.move_id]);if(s.discard_moves[key])return;
    const count=(event.materials??[]).filter(m=>m.zone==='hand'||SLOTS.includes(m.zone)).length;
    s.discard_moves[key]={move_id:event.move_id,phase_id:id,count};r.count+=count;
  },
  async finish_yijiang_discard_phase(actor,phase_id){
    const r=this.sgs_yijiang_runtime_state?.discard_phases[phase_id];if(!r||r.status!=='active')return;
    r.status='resolving';
    try{if(!actor.dead)for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_discard_phase_end??[])
      await hook(this,actor,{phase_id,event_id:`${phase_id}:exit`,own_discarded_cards:r.count});
      r.status='done';
    }catch(error){r.status='failed';throw error;}
  },
  atomic_equipment_exchange(first,second,{move_id,validate,on_committed,source_skill='sgs.ganlu',reason='甘露交换装备'}={}){
    if(typeof move_id!=='string'||!move_id)throw Error('甘露交换需要稳定事务ID');
    const a=pid(this,first),b=pid(this,second),s=state(this),prior=s.exchanges[move_id];
    if(prior&&(prior.first!==a||prior.second!==b||prior.source_skill!==source_skill))throw Error('装备交换重复ID对应不同请求');
    if(prior?.status==='done')return Promise.resolve({committed:prior.committed,move_id});
    if(prior&&!running.get(this)?.has(move_id))throw Error('装备交换中断，请从原动作日志恢复');
    return job(this,move_id,async()=>{
      const r=s.exchanges[move_id]={first:a,second:b,source_skill,status:'validating',committed:false};
      if(first===second||!live(first)||!live(second)||validate&&!validate()){r.status='done';return {committed:false,move_id};}
      const transfers=[[first,second],[second,first]].map(([owner,recipient])=>({owner,recipient,hand_before:owner.hand.length,
        materials:SLOTS.flatMap(zone=>owner[zone]?[{zone,index:0,card:owner[zone]}]:[])}));
      const all=physical(this);let cards=transfers.flatMap(t=>t.materials.map(m=>m.card));
      if(!cards.length||new Set(cards).size!==cards.length||cards.some(c=>c.virtual||all.filter(x=>x===c).length!==1)
        ||transfers.some(t=>t.materials.some(m=>TYPES[m.card.type]!==m.zone||slotBlocked(t.recipient,m.zone)))){r.status='done';return {committed:false,move_id};}
      const epochs=new Map(cards.map(card=>[card,this.card_location_epoch?.(card)]));
      const blocked=[];
      if(this.sgs_zhangfen_before_move)for(const t of transfers){
        const guard=await this.sgs_zhangfen_before_move(t.owner,t.materials,{move_id:`${move_id}:${pid(this,t.owner)}`,to:'equipment_exchange',recipient:t.recipient,action:'exchange',source_skill,reason});
        blocked.push(...guard.blocked_materials);t.materials=guard.allowed_materials;
      }
      cards=transfers.flatMap(t=>t.materials.map(m=>m.card));
      // A destruction callback can move an unrelated source or close the skill
      // window. Never detach an old snapshot after that awaited guard.
      if(!cards.length||!live(first)||!live(second)||validate&&!validate({transfers,blocked_materials:blocked})
        ||transfers.some(t=>t.materials.some(m=>t.owner[m.zone]!==m.card||epochs.get(m.card)!==this.card_location_epoch?.(m.card)))){
        r.status='done';return {committed:false,move_id};
      }
      r.partial=blocked.length>0;r.blocked_count=blocked.length;
      for(const t of transfers)for(const m of t.materials)m.equipment_face={...m.card};
      r.transfers=transfers.map(t=>({owner:pid(this,t.owner),recipient:pid(this,t.recipient),materials:t.materials.map(m=>({slot:m.zone,card_id:materialId(this,m.card)}))}));
      for(const t of transfers)t.action_materials=this.capture_card_action_faces?.(t.owner,t.materials,{action:'exchange',to:'equipment_exchange',move_id})??t.materials;
      // Both detachments commit before callbacks. Escrow is a real tracked zone.
      // Preserve temporary copied-equipment face until its true destination.
      for(const t of transfers)for(const m of t.materials){t.owner[m.zone]=null;this.processing_cards.push(m.card);}
      r.committed=true;r.status='loss';on_committed?.(cards,{committed:true,move_id});
      try{
        for(const t of [...transfers].sort((a,b)=>this.action_order().indexOf(a.owner)-this.action_order().indexOf(b.owner))){if(!t.materials.length)continue;
          const context={move_id:`${move_id}:${pid(this,t.owner)}`,committed:true,to:'equipment_exchange',recipient:t.recipient,
            action:'exchange',reason,source_skill,visibility:'public',hand_before:t.hand_before,hand_after:t.owner.hand.length,materials:t.action_materials,zones:t.materials.map(m=>m.zone)};
          await this.after_cards_lost?.(t.owner,context);
          for(const m of t.materials)await this.equipment_on_leave?.(t.owner,m.card,{...context,slot:m.zone,equipment_face:m.equipment_face});
          await this.equipment_after_cards_lost?.(t.owner,t.materials.map(m=>m.card),context);
        }
        r.status='install';const entered=[];
        // Revalidate all escrow identities after arbitrary nested loss effects.
        for(const t of transfers)for(const m of t.materials){const i=this.processing_cards.indexOf(m.card);if(i<0)continue;
          this.processing_cards.splice(i,1);
          if(!live(t.recipient)||slotBlocked(t.recipient,m.zone)||t.recipient[m.zone]||TYPES[m.card.type]!==m.zone||this.sgs_zhangfen_entry_replacement?.(t.recipient,m.card)?.prevented){this.copied_card_moved?.(m.card,'discard',null);this.deck.discard(m.card);continue;}
          t.recipient[m.zone]=m.card;this.copied_card_moved?.(m.card,m.zone,t.recipient);entered.push({owner:t.recipient,card:m.card,slot:m.zone});
        }
        r.status='entry';
        for(const e of entered){if(e.owner.dead||e.owner[e.slot]!==e.card)continue;
          const context={move_id,source_skill,reason,slot:e.slot,entry_id:`equipment-entry:${++this.equipment_entry_counter}`};
          await this.sgs_zhangfen_on_equipment_enter?.(e.owner,e.card,context);
          await this.equipment_on_enter?.(e.owner,e.card,context);
          if(this.youjian_events_enabled?.()&&!e.owner.dead&&e.owner[e.slot]===e.card)await this.youjian_on_enter?.(e.owner,e.card,context);
        }
        r.status='done';return {committed:true,move_id,...(r.partial?{partial:true,blocked:r.blocked_count}:{})};
      }catch(error){r.status='failed';throw error;}
    });
  },
};
