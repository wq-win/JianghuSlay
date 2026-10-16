import {CONVENTIONAL_GENERATED_CARD_NAMES} from './release-scope.js';
import {known_copied_card_role} from './card-identity-metadata.js';
import {ZHANGFEN_EQUIPMENT_CATALOG,zhangfen_equipment_definition} from './sgs-zhangfen-data.js';
import {zhangfen_vehicle,zhangfen_register_functional_copy,zhangfen_end_functional_copy} from './sgs-zhangfen-runtime.js';
import {sgs_forest_material_moved} from './sgs-forest-assault-skills.js';
import {WANGYUN_TRICK_CATALOG,QIBAO_RULES} from './wangyun-card-effects.js';
import {CONTENT_PACKS} from './content-packs.js';
import {ai_aoe_score} from './ai.js';
/** Historical 奸雄 host integration. CC1–CC13 are declared Jianghu policies. */
import {Card,CardType,is_sha_type,Deck,SeededRNG} from './models.js';
import {rule_hero} from './effective-hero.js';
import {CARD_HISTORY_FUNCTIONS,card_history_definition} from './game-card-history.js';
import {printed_card_fields,set_card_face,clear_card_face,card_face_record} from './card-face-projection.js';
import {card_to_dict} from './state.js';
import {DERIVED_EQUIPMENT_CATALOG} from './derived-equipment.mjs';
const CAO='yxs.adapted.base.hero.cao-cao';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const slotOf=card=>({'武器':'weapon','防具':'armor','-1马':'offensive_horse','+1马':'defensive_horse'})[card.type];
let faces;
function trustedFace(definition){
 if(!faces)faces=[...new Deck(new SeededRNG(1),null,{content_packs:CONTENT_PACKS.map(pack=>pack.id)}).draw_pile,...WANGYUN_TRICK_CATALOG.filter(card=>CONVENTIONAL_GENERATED_CARD_NAMES.includes(card.name))];
 const def=card_history_definition(definition),face=faces.find(c=>c.name===def.name&&c.type===def.type);
 if(!face)throw Error('复制功能未注册');
 return JSON.parse(JSON.stringify({...face,...def}));
}
const owns=actor=>rule_hero(actor)?.id===CAO&&!actor.dead&&!actor.skills_disabled&&!actor.disabled_skill_ids?.includes('yxs.jianxiong');
const ongoing=game=>!game.winner&&(!game.player||game.match_should_continue());
export const ninthRuntimeMethods={
 finalize_card_use_function(use_id,card){
  if(!use_id||!card)return;const record=this.card_use_history?.uses.find(r=>r.use_id===use_id);if(!record)throw Error('形成牌功能缺少已提交的用牌');
  const definition=card_history_definition(card);this.card_history_function_overrides??=[];
  const old=this.card_history_function_overrides.find(r=>r.use_id===use_id);
  if(old&&old.effective_function.rule_id!==definition.rule_id)throw Error('同次用牌不能重复形成不同功能');
  if(!old)this.card_history_function_overrides.push({use_id,effective_function:definition});
 },
 printed_card(card){return printed_card_fields(card);},
 effective_card_definition(card){return card_history_definition(card);},
 ensure_card_history_turn(actor){
  this.initialize_card_history();
  if(this.card_use_history.current_turn_id===null){const owner=this.all_players().filter(Boolean).find(p=>this.seat_of(p)===this.turn_actor)??actor;this.begin_history_turn(owner,`controlled-turn:${this.turn_event_counter}:${this.player_id(owner)}`);}
 },
 declared_card_function(actor,target,card,options={}){
  if(options.shizhi_face)return options.shizhi_face;
  if(options.as_red_tao)return new Card('桃',CardType.TAO,{suit:card.suit,color:card.color,rank:card.rank,virtual:true,materials:[card]});
  if(options.as_hand_sha&&!is_sha_type(card.type))return new Card('杀',CardType.SHA,{suit:card.suit,color:card.color,rank:card.rank,virtual:true,materials:[card]});
  return card;
 },
 copied_card_moved(card,to,recipient=null,{judgment=false,zhangfen_cause=null,move_id=null,action=null,source_skill=null}={}){
  this.record_card_location?.(card,to);
  sgs_forest_material_moved(this,card,to,recipient);
  const role=known_copied_card_role(this,card);
  // Ordinary hidden-card movement has no copied face to inspect. Locate by
  // trusted object identity before any vehicle/card-property access.
  if(!role)return;
  const vehicle=zhangfen_vehicle(this,card);
  // A transfer lease belongs to this card and active phase receipt only. Its
  // transient hand/processing moves retain the paid copy, never a nested cost.
  const cause=zhangfen_cause??role?.zhangfen_transfer_cause;
  const receipt=cause&&this.sgs_zhangfen_state?.receipts[cause.receipt_key];
  const exactTransfer=cause&&(to==='hand'&&zhangfen_cause&&move_id===`${cause.receipt_key}:gain`&&action==='give'&&this.player_id(recipient)===receipt?.recipient_id
    ||to==='processing'&&move_id===`${cause.receipt_key}:use-material`&&action==='card_use'&&role?.zone==='hand'
    ||to==='weapon'&&role?.zone==='processing'&&source_skill===cause.skill_id&&this.player_id(recipient)===receipt?.recipient_id);
  const transfer=vehicle&&!vehicle.native&&receipt?.kind==='phase'&&receipt.status==='resolving'
    &&exactTransfer&&!zhangfen_end_functional_copy(this,card,{cause});
  if(vehicle&&!vehicle.native&&!slots.includes(to)&&!transfer)zhangfen_end_functional_copy(this,card);
  const keep=transfer||to==='processing'&&(role.zone==='processing'||role.category==='delayed_trick'&&judgment)
   ||role.category==='equipment'&&slots.includes(to)
   ||role.category==='delayed_trick'&&to==='judgment';
  role.zone=to;role.owner_id=recipient?this.player_id(recipient):null;
  if(transfer&&!slots.includes(to))role.zhangfen_transfer_cause=cause;else delete role.zhangfen_transfer_cause;
  if(!keep){role.status='ended';clear_card_face(card);return;}
  const definition=role.category==='equipment'&&slots.includes(to)?zhangfen_equipment_definition(card):null;
  if(definition&&!vehicle&&this.sgs_zhangfen_state)zhangfen_register_functional_copy(this,recipient,card,definition.form,{use_id:role.history_use_id??role.virtual_id,committed:true});

 },
 activate_copied_card(actor,card,definition,{history_use_id,copied_from_use_id}={}){
  this.copied_card_roles??=[];
  for(const old of this.copied_card_roles.filter(r=>r.card===card&&r.status==='active'))old.status='replaced';
  const virtual_id=`jianxiong:${this.copied_card_counter=(this.copied_card_counter??0)+1}`;
  const face=trustedFace(definition);
  set_card_face(card,face,{virtual_id,source_skill:'奸雄'});
  const role={virtual_id,physical_id:this.card_history_material_id(card),card,template_id:definition.rule_id,category:definition.category,status:'active',zone:'processing',owner_id:null,history_use_id:history_use_id??null,copied_from_use_id};
  this.copied_card_roles.push(role);return role;
 },
 jianxiong_template(actor){
  const record=this.card_use_history?this.last_outer_card_use(actor):null;if(!record)return null;
  const definition=CARD_HISTORY_FUNCTIONS.find(d=>d.rule_id===record.effective_function.rule_id);
  return definition?{record,definition}:null;
 },
 jianxiong_used(actor){return actor.jianxiong_used_turn===this.card_use_history?.current_turn_id&&actor.jianxiong_used_turn!=null;},
 jianxiong_card(definition,material){const face=trustedFace(definition);return new Card(face.name,face.type,{...face,suit:material.suit,color:material.color,rank:material.rank,virtual:true,materials:[material]});},
 jianxiong_legal_target(actor,material,card,target){
  const after=this.actor_after_material_cost(actor,material);
  if(is_sha_type(card.type))return this.can_convert_material_to_sha(actor,target,material,{allow_allies:true});
  if(card.type===CardType.TAO)return actor.hp<rule_hero(actor).max_hp;
  if(card.type===CardType.WINE)return this.can_use_offensive_wine(actor);
  const slot=slotOf(card);if(slot)return !(actor.abolished_equipment_slots??[]).includes(slot);
  if(card.type!==CardType.SCROLL||card.name==='无懈可击')return false;
  if(this.youjian_trick_definition(card))return !!target?.alive&&!this.card_target_prohibited?.(actor,target,card)&&this.can_trick_target(after,target,card);
  if(['五谷丰登','桃园结义'].includes(card.name))return !!target?.alive&&!this.card_target_prohibited?.(actor,target,card)&&this.can_trick_target(after,target,card);
  if(card.name==='无中生有'||['万箭齐发','烽火狼烟','铁索连环'].includes(card.name))return true;
  if(['画地为牢','兵粮寸断','手捧雷'].includes(card.name))return target!==actor&&this.can_place_delayed(after,target,card);
  if(card.name==='火攻')return target?.alive&&target.hand.length>0;
  if(card.name==='借刀杀人')return target?.alive&&target!==actor&&target.weapon&&this.borrowed_victims(target).length>0;
  if(!target?.alive||target===actor||!this.can_trick_target(actor,target,card))return false;
  if(card.name==='决斗')return this.can_duel_target(actor,target,{allow_allies:true});
  if(card.name==='顺手牵羊')return this.target_has_card(target)&&!this.is_immune_to_shunshou(target)&&this.can_use_shunshou(after,target);
  if(['釜底抽薪','过河拆桥'].includes(card.name))return this.target_has_card(target);
  return true;
 },
 jianxiong_materials(actor){
  const template=this.jianxiong_template(actor);if(!template)return [];
  return this.skill_material_options(actor).filter(m=>!m.card.virtual&&this.all_players().filter(Boolean).some(t=>this.jianxiong_legal_target(actor,m,this.jianxiong_card(template.definition,m.card),t)));
 },
 jianxiong_available(actor){return !(this.response_stack?.length)&&!(this.card_history_stack?.length)&&owns(actor)&&this.is_own_play_phase(actor)&&ongoing(this)&&!this.jianxiong_used(actor)&&this.jianxiong_materials(actor).length>0;},
 jianxiong_public_state(actor){
  if(!owns(actor))return null;const template=this.jianxiong_template(actor);
  return {last_card:template?card_to_dict(this.jianxiong_card(template.definition,{suit:null,color:null,rank:null})):null,used:this.jianxiong_used(actor),history_basis:'本回合本人最近提交的最外层用牌；不含纯响应、重铸、赠予或弃牌（江湖适配）'};
 },
 async use_jianxiong(actor,{material_id=null}={}){
  if(!this.jianxiong_available(actor))return false;
  const template=this.jianxiong_template(actor),materials=this.jianxiong_materials(actor);let material;
  if(actor.is_ai&&['万箭齐发','烽火狼烟'].includes(template.definition.name)&&ai_aoe_score(this,actor,template.definition)<=0)return false;
  if(actor.is_ai&&['五谷丰登','桃园结义'].includes(template.definition.name)){const legal=this.wangyun_card_targets(actor,template.definition),score=legal.reduce((n,p)=>n+(template.definition.name==='桃园结义'&&p.hp>=rule_hero(p).max_hp?0:this.side_of(p)===this.side_of(actor)?1:-1),0);if(score<=0)return false;}
  if(actor.is_ai&&['broken_halberd','bee_robe','mobile_female_dress','inferior_horse'].includes(template.definition.trait))return false;
  if(actor.is_ai){const safe=materials.filter(m=>!(m.zone==='hand'&&m.card.type===CardType.POISON&&this.youjian_events_enabled()&&actor.hp<=1+(this.youjian_poison_armor_snapshot(actor)?1:0)));if(!safe.length)return false;material=safe.sort((a,b)=>this.material_ai_cost(a)-this.material_ai_cost(b))[0];}
  else if(material_id)material=materials.find(m=>m.id===material_id||m.zone!=='hand'&&material_id===`equip:${m.zone}`);
  else while(!material){
   const choice=await this.view.ask_line('奸雄：选择一张手牌或装备，复制前一张用牌功能',{kind:'choice',player_id:this.seat_of(actor),options:[...materials.map(m=>({id:m.id,label:m.label,zone:m.zone==='hand'?'hand':'equipment',slot:m.zone==='hand'?null:m.zone,card:card_to_dict(m.card,{owner:actor})})),{id:'cancel',label:'取消，不消耗牌或次数'}],meta:{skill_id:'yxs.jianxiong',stage:'jianxiong_material',copy_card:this.jianxiong_public_state(actor).last_card}});
   if(['cancel','0'].includes(choice))return false;material=materials.find(m=>m.id===choice);
  }
  if(!material)return false;
  const card=this.jianxiong_card(template.definition,material.card),candidates=this.all_players().filter(t=>this.jianxiong_legal_target(actor,material,card,t));
  let options;
  if(is_sha_type(card.type)||card.name==='决斗'){const target=await this.choose_card_target(actor,candidates,{card_name:`奸雄·${card.name}`,stage:'jianxiong_target'});if(!target)return false;options={target,allow_allies:true};}
  else options=await this.prepare_card_use(actor,card,this.default_foe(actor)??actor,{allow_recast:false});
  if(!options||options.recast){if(options?.recast)this.view.emit('奸雄复制用牌，不能把复制铁索改为重铸；未消耗。');return false;}
  if(!this.jianxiong_available(actor)||this.jianxiong_template(actor)?.record.use_id!==template.record.use_id||!this.skill_material_options(actor).some(m=>m.card===material.card&&m.zone===material.zone)||!this.jianxiong_legal_target(actor,material,card,options.target))return false;
  let scope=null;
  try{
   const paid=await this.consume_material(actor,material,{to:'processing',reason:'奸雄复制用牌',on_committed:()=>{
    actor.jianxiong_used_turn=this.card_use_history.current_turn_id;
    scope=this.start_card_use(actor,card,{materials:[material.card],sourceZones:[material.zone==='hand'?'hand':'equipment'],provenance:{kind:'converted',source_skill_id:'yxs.jianxiong',copied_from_use_id:template.record.use_id}});
    this.activate_copied_card(actor,material.card,template.definition,{history_use_id:scope.use_id,copied_from_use_id:template.record.use_id});
   }});
   if(!paid)return false;
   this.view.emit(`${actor.name}发动奸雄，以${this.printed_card(material.card).name}复制${card.name}；本回合次数已使用。`);
   if(actor.alive&&ongoing(this))await this.resolve_card(actor,options.target,material.card,{...options,trick_declaration_validated:true,history_use_id:scope.use_id,source_skill:'yxs.jianxiong',copied_function:true});
   return true;
  }finally{this.finish_processing_card(material.card);this.end_card_use(scope);}
 },
};
