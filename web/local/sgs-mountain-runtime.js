/** Physical special piles and legal board transfer, not card use or discard. */
import {rule_hero} from './effective-hero.js';
import {skill_hooks_for_hero} from './skills.js';
import {card_to_dict} from './state.js';
const SLOTS=['weapon','armor','offensive_horse','defensive_horse'];
const own=(a)=>a?.sgs_mountain_fields??[];
export const mountainRuntimeMethods={
  on_general_skill_lost(actor,{skill_id}){
    // Stop future general-only naked flag checks, retaining equipment state,
    // already committed event payloads and all quota / awakening receipts.
    const original=skill_id?.startsWith('jianghu.classic.hero.');
    if(original&&skill_id.includes('li-bai'))actor.shixian_active=false;
    if(original&&skill_id.includes('xiang-yu'))actor.bawang_stacks=0;
    if(skill_id==='yxs.yinren')actor.yinren_active=false;
    if(skill_id==='sgs.luoyi')actor.luoyi_active=false;
    if(skill_id==='yxs.zuijiu')actor.zuijiu_active=false;
  },
  capture_mountain_field(actor,card,{validate,on_committed,...options}={}){
    actor.sgs_mountain_fields??=[];
    const index=this.processing_cards.indexOf(card);
    if(index<0||actor.dead)return Promise.resolve({committed:false,move_id:options.move_id});
    return this.public_card_loss(null,[{zone:'processing',index,card}],{...options,to:'field',recipient:actor,visibility:'public',poison_exempt:true,validate:()=>!actor.dead&&(!validate||validate()),on_committed});
  },
  move_mountain_field(actor,card,{to='discard',validate,on_committed,...options}={}){
    if(!['discard','processing'].includes(to))throw Error('田只能移至处理区或弃牌堆');
    const index=own(actor).indexOf(card);if(index<0)return Promise.resolve({committed:false,move_id:options.move_id});
    return this.public_card_loss(actor,[{zone:'field',index,card}],{...options,to,visibility:'public',poison_exempt:true,validate,on_committed});
  },
  async clear_mountain_fields(actor,{cards=[...own(actor)],event_id=null,effect_id=null,reason='田清理'}={}){
    const materials=cards.filter(c=>own(actor).includes(c)).map(card=>({zone:'field',index:own(actor).indexOf(card),card}));
    if(!materials.length)return false;
    return (await this.public_card_loss(actor,materials,{to:'discard',visibility:'public',poison_exempt:true,reason,action:'cleanup',semantic_action:'cleanup',move_id:`field-cleanup:${this.player_id(actor)}:${event_id??effect_id??'cleanup'}`})).committed;
  },
  async move_board_card(owner,material,recipient,{validate,on_committed,...options}={}){
    const zone=material?.zone;
    if(!owner||!recipient||owner===recipient||!owner.alive||!recipient.alive||!['judgment',...SLOTS].includes(zone))return {committed:false,move_id:options.move_id};
    const delayed=zone==='judgment'?(owner.judgment_effects??[]).find(e=>e.card===material.card):null;
    const name=delayed?.name??this.effective_delayed_name?.(owner,material.card)??material.card.name;
    const legal=()=>{
      if(!owner.alive||!recipient.alive||validate&&!validate())return false;
      if(zone==='judgment')return owner.judgment_cards[material.index]===material.card&&!recipient.judgment_cards.some(c=>this.effective_delayed_name(recipient,c)===name)
        &&!this.card_target_prohibited?.(owner,recipient,{...material.card,name,type:'锦囊',effect_id:delayed?.effect_id??this.effective_delayed_effect_id?.(owner,material.card)},{judgment_transfer:true});
      return owner[zone]===material.card&&!recipient[zone]&&!(recipient.abolished_equipment_slots??[]).includes(zone)&&!recipient[`${zone}_abolished`];
    };
    if(!legal())return {committed:false,move_id:options.move_id};
    return this.public_card_loss(owner,[material],{...options,to:zone==='judgment'?'judgment':'board_equipment',recipient,destination_slot:zone,delayed_identity:delayed?{...delayed}:null,visibility:'public',action:'board_transfer',poison_exempt:true,validate:legal,on_committed});
  },
  async trigger_after_any_damage_resolved(event){
    if(!(event.damage>0))return;
    for(const holder of this.action_order()){
      if(!holder.alive)continue;
      for(const hook of skill_hooks_for_hero(rule_hero(holder))?.after_any_damage_resolved??[])await hook(this,holder,event);
    }
  },
  mountain_public_state(actor){
    if(!actor)return null;
    const g=actor.general_skill_public_state??{},f=actor.sgs_mountain_field_state,p=actor.sgs_mountain_phase_state;
    return {fields:own(actor).map(c=>card_to_dict(c,{owner:actor})),field_count:own(actor).length,
      awakened:{'sgs.zaoxian':Object.values(f?.zaoxian??{}).some(x=>x?.awakened===true),'sgs.zhiji':Object.values(p?.zhiji??{}).some(x=>x?.awakened===true)},
      granted_skill_ids:[...(g.granted_skill_ids??[])],removed_skill_ids:[...(g.removed_skill_ids??[])]};
  },
};
