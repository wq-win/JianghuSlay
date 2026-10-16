/** Trusted production adapters for the declared 王允 reconstruction. */
import {CardType} from './models.js';
import {rule_hero} from './effective-hero.js';
import {printed_card_fields,permanent_card_fields,permanent_card_face_record,set_permanent_card_face} from './card-face-projection.js';
import {WANGYUN_RULE_ID} from './wangyun-skills.js';
import {is_qinggang_lineage,qibao_identity_patch,QIBAO_EQUIPMENT_ID} from './wangyun-card-effects.js';
export const wangyunRuntimeMethods={
 wangyun_events_enabled(){return !!this.wangyun_state||this.all_players().some(p=>rule_hero(p)?.id===WANGYUN_RULE_ID);},
 can_use_wangyun_deck_weapon(actor,card){return !!actor?.alive&&!actor.dead&&this.deck.draw_pile.includes(card)&&!card.virtual&&card.type===CardType.WEAPON&&!(actor.abolished_equipment_slots??[]).includes('weapon')&&!this.card_use_prohibited?.(actor,card);},
 permanently_form_qibao(card,{receipt_id,skill_initiator=null}={}){
  if(typeof receipt_id!=='string'||!receipt_id)throw Error('七宝永久身份需要稳定收据');
  this.permanent_card_identities??=[];
  const old=this.permanent_card_identities.find(r=>r.card===card);
  if(old){if(old.rule_id!==QIBAO_EQUIPMENT_ID)throw Error('实体已有不同永久规则身份');return old;}
  const original=permanent_card_fields(card);if(!is_qinggang_lineage(original))return null;
  const physical_id=this.card_history_material_id(card),definition=qibao_identity_patch(original);
  const row={card,physical_id,rule_id:QIBAO_EQUIPMENT_ID,identity_id:`qibao:${physical_id}`,receipt_id,source_actor_id:skill_initiator?this.player_id(skill_initiator):null,original_printed:printed_card_fields(card),definition};
  set_permanent_card_face(card,definition,{identity_id:row.identity_id,source_skill:'sgs.mobile.wangyun.lianji'});this.permanent_card_identities.push(row);return row;
 },
 async use_wangyun_deck_weapon(actor,card,{receipt_id,skill_initiator=null,source_skill='sgs.mobile.wangyun.lianji'}={}){
  if(typeof receipt_id!=='string'||!receipt_id)throw Error('连计装备使用需要稳定收据');
  this.wangyun_weapon_uses??={};const key=JSON.stringify(receipt_id),owner_id=this.player_id(actor),prior=this.wangyun_weapon_uses[key];
  if(prior){if(prior.card!==card||prior.owner_id!==owner_id)throw Error('连计装备收据身份冲突');return prior;}
  if(!this.can_use_wangyun_deck_weapon(actor,card))return {committed:false};
  const receipt={receipt_id,owner_id,card,stage:'committed',committed:true,physical_id:this.card_history_material_id(card)};this.wangyun_weapon_uses[key]=receipt;
  this.permanently_form_qibao(card,{receipt_id,skill_initiator});
  const scope=this.start_card_use(actor,card,{materials:[card],sourceZones:['draw_pile'],provenance:{kind:'physical',source_skill,source_rule_id:WANGYUN_RULE_ID}});receipt.history_use_id=scope.use_id;
  // Direct use from the real draw pile: no hand gain and no invented draw event.
  const index=this.deck.draw_pile.indexOf(card);if(index<0)throw Error('已确认连计武器离开牌堆');
  this.deck.draw_pile.splice(index,1);this.processing_cards.push(card);this.copied_card_moved?.(card,'processing',actor);
  try{receipt.stage='equip';await this.equip_card(actor,'weapon',card,{source_skill,skill_initiator,history_use_id:scope.use_id});receipt.stage='ended';this.view.emit(`${actor.name}因连计直接使用牌堆武器：${card.name}。`);return receipt;}
  finally{this.finish_processing_card(card);this.end_card_use(scope);}
 },
};
