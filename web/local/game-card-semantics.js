/** Owner-scoped views. Physical print is immutable; committed action faces are
 * captured before hand exit and never change a later owner's printed cards. */
import {Card,CardType,CardColor,CardSuit} from './models.js';
import {rule_hero} from './effective-hero.js';
import {yxs_effective_suit,YXS_NEXT_DAMAGE_RULE_IDS} from './yxs-next-damage-skills.js';
import {sgs_hongyan_suit} from './sgs-next-transfer-recovery.js';
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const hongyan=p=>(p?.effective_skill_ids??rule_hero(p)?.skill_ids??[]).includes('sgs.hongyan');
const colorOf=(suit,fallback)=>suit===CardSuit.HEART||suit===CardSuit.DIAMOND?CardColor.RED:suit===CardSuit.SPADE||suit===CardSuit.CLUB?CardColor.BLACK:fallback;
export const projected_card_suit=(card,owner,context={})=>card?.fixed_judgment_result?card.suit:hongyan(context.judged_actor??context.judgment_actor??owner)?sgs_hongyan_suit(card,owner,context):yxs_effective_suit(card,owner,context);
export const projected_card_color=(card,owner,context={})=>colorOf(projected_card_suit(card,owner,context),card?.color);
export const cardSemanticMethods={
  damage_card_snapshot(card){
    if(!card||typeof card.name!=='string'||typeof card.type!=='string')return null;
    return Object.freeze({name:card.name,type:card.type,card_family:this.card_family(card),
      suit:card.suit??null,color:card.color??null,rank:card.rank??null,nature:card.nature??null});
  },
  capture_card_action_faces(owner,materials,{action='discard',to=null,move_id=null}={}){
    if(!owner)return [];
    this.card_action_origins??=[];
    const projected=hongyan(owner)||rule_hero(owner)?.id===YXS_NEXT_DAMAGE_RULE_IDS.li;
    return materials.map(m=>{
      const old=this.card_action_origins.findIndex(r=>r.card===m.card);if(old>=0)this.card_action_origins.splice(old,1);
      // Ordinary blind hand transfers need no face read. Invalidate any former
      // owner's projection using object identity, without inspecting hidden data.
      if(!projected)return {...m};
      const face={suit:this.effective_suit(m.card,owner,{zone:m.zone,action}),color:this.effective_color(m.card,owner,{zone:m.zone,action}),rank:m.card.rank??null};
      const row={card:m.card,owner_id:this.player_id(owner),from_zone:m.zone,to,move_id,action,face};
      this.card_action_origins.push(row);return {...m,effective_face:{...face}};
    });
  },
  effective_suit(card,owner,context={}){
    if(card?.fixed_judgment_result)return card.suit;
    if(context.effective_face)return context.effective_face.suit;
    // An active processing card keeps its hand-origin action face even if its
    // owner loses Hongyan mid-resolution. Equipment/other owners do not inherit it.
    if(!context.judged_actor&&!context.judgment_actor&&card&&!card.virtual&&owner&&!owner.hand?.includes(card)&&!slots.some(s=>owner[s]===card)&&this.processing_cards?.includes(card)){
      const row=this.card_action_origins?.find(r=>r.card===card&&r.owner_id===this.player_id(owner));
      if(row?.from_zone==='hand'&&row.to==='processing')return row.face.suit;
    }
    return projected_card_suit(card,owner,context);
  },
  effective_color(card,owner,context={}){return colorOf(this.effective_suit(card,owner,context),card?.color);},
  effective_card(card,owner,context={}){
    if(!card)return card;
    return new Card(card.name,card.type,{...card,suit:this.effective_suit(card,owner,context),color:this.effective_color(card,owner,context)});
  },
  physical_card_materials(card,provenance={}){
    const explicit=provenance.physical_cards??provenance.physical_materials??card?.materials;
    const cards=explicit??(provenance.physical_card?[provenance.physical_card]:card&&!card.virtual?[card]:[]);
    return [...new Set(cards)].filter(c=>c&&!c.virtual);
  },
  material_sha(actor,card,cards=[card]){
    return new Card('杀',CardType.SHA,{suit:this.effective_suit(card,actor),color:this.effective_color(card,actor),rank:card.rank,virtual:true,materials:[...cards]});
  },
};
