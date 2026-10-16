import {sgs_panzhangmazhong_public_state} from './sgs-panzhangmazhong-runtime.js';
import {sgs_caoang_public_state} from './sgs-caoang-runtime.js';
import {sgs_caoxiu_public_state} from './sgs-caoxiu-runtime.js';
import {sgs_chenlin_public_state} from './sgs-chenlin-runtime.js';
import {sgs_lingcao_public_state} from './sgs-lingcao-runtime.js';
import {sgs_sunru_public_state} from './sgs-sunru-runtime.js';
import {sgs_yuejin_public_state} from './sgs-yuejin-runtime.js';
import {sgs_manchong_public_state} from './sgs-manchong-runtime.js';
import {card_face_record,permanent_card_face_record} from './card-face-projection.js';
import {rule_hero} from './effective-hero.js';
import {projected_card_suit,projected_card_color} from './game-card-semantics.js';
import { rank_label } from "./models.js";
import { active_skills_for_hero } from "./skills.js";
import { active_skill_availability } from "./skill-availability.js";

export function card_to_dict(card, { hidden = false, owner = null } = {}) {
  if (hidden) return { hidden: true, name: "背面" };
  return {
    ...(card_face_record(card)?{converted:true,physical_name:card_face_record(card).printed.name,physical_type:card_face_record(card).printed.type,copy_source_skill:'奸雄',virtual_id:card_face_record(card).virtual_id}:{}),
    ...(permanent_card_face_record(card)?{permanent_identity:true,original_printed_name:permanent_card_face_record(card).printed.name,identity_source_skill:'连计'}:{}),
    hidden: false, name: card.name, type: card.type,
    ...(card.physical_id?{physical_id:card.physical_id,derived_identity:card.derived_identity??null,creator_actor_id:card.creator_actor_id??null,creator_skill_binding:card.creator_skill_binding??null,creation_ordinal:card.creation_ordinal??null}:{}),
    ...(card.compatibility_ids?{compatibility_ids:[...card.compatibility_ids],core_effect_verified:card.core_effect_verified===true,current_client_verified:card.current_client_verified===true,all_mobile_interactions_verified:card.all_mobile_interactions_verified===true,native_source_deck_complete:card.native_source_deck_complete===true,full_six_player_identity_mode:card.full_six_player_identity_mode===true}:{}), power: card.power, gift_mark:card.gift_mark===true, content_pack:card.content_pack??null,
    ...(card.id == null ? {} : {id:card.id}),
    ...(card.source_variant == null ? {} : {source_variant:card.source_variant}),
    ...(card.source_game == null ? {} : {
      source_game:card.source_game, source_version:card.source_version??card.source_variant,
      source_urls:card.source_urls, source_status:card.source_status,
      adaptation_notes:card.adaptation_notes, rule_type:card.rule_type,
      rule_timing:card.rule_timing, rule_limits:card.rule_limits,
    }),
    ...(card.nature == null ? {} : {nature:card.nature}),
    ...(card.equipment_id == null ? {} : {
      equipment_id:card.equipment_id, base_name:card.base_name, source_game:card.source_game,
      source_version:card.source_version, source_urls:card.source_urls,
      condition:card.condition, effect:card.effect, timing:card.timing, limits:card.limits,
      adaptation_notes:card.adaptation_notes,
      aliases:card.aliases??[], source_original_name:card.source_original_name??card.base_name??card.name,
      source_records:(card.source_records??[]).map(record=>({
        name:record.name??record.source_original_name, source_game:record.source_game,
        source_version:record.source_version??record.source_variant, source_urls:record.source_urls,
      })),
    }),
    description: card.description, range: card.range, trait: card.trait,
    suit: projected_card_suit(card,owner), color: projected_card_color(card,owner), physical_suit:card.suit, physical_color:card.color, rank: card.rank,
    rank_label: rank_label(card.rank), label: card.toString.call({...card,suit:projected_card_suit(card,owner)}),
  };
}

export function player_to_dict(player, { seat, reveal_hand }) {
  const equipment = {};
  for (const slot of ["weapon", "armor", "offensive_horse", "defensive_horse"]) {
    equipment[slot] = player[slot] ? card_to_dict(player[slot],{owner:player}) : null;
  }
  return {
    seat, name: player.name, is_ai: player.is_ai, alive: player.alive,
    hp: player.hp, max_hp: rule_hero(player).max_hp, face_orientation:player.face_orientation??'face_up',play_phase_id:player.play_phase_id??null,
    effective_hero:player.effective_rule_hero?{...player.effective_rule_hero,id:player.effective_rule_hero.source_hero_id??player.effective_rule_hero.id,runtime_rule_id:player.effective_rule_hero.id}:null,hero_form:player.hero_form?{...player.hero_form}:null,
    hero: { id:player.hero.id, skill_ids:player.hero.skill_ids,source_evidence_tiers:player.hero.source_evidence_tiers,source_evidence_note:player.hero.source_evidence_note,source_unknowns:player.hero.source_unknowns,current_client_hp_verified:player.hero.current_client_hp_verified,source_only_exact_for_every_edge:player.hero.source_only_exact_for_every_edge, source_date:player.hero.source_date, desktop_date:player.hero.desktop_date, hp_evidence:player.hero.hp_evidence, source_identity_context:player.hero.source_identity_context, production_integration_status:player.hero.production_integration_status, current_client_rules_verified:player.hero.current_client_rules_verified, source_variant:player.hero.source_variant, source_urls:player.hero.source_urls, source_status:player.hero.source_status, faction:player.hero.faction, gender:player.hero.gender??null, adaptation_notes:player.hero.adaptation_notes, name: player.hero.name, display_name:player.hero.display_name??player.hero.name, source_character_name:player.hero.source_character_name??player.hero.name, identity_note:player.hero.identity_note??'', portrait_path:player.hero.portrait_path, portrait_name:player.hero.portrait_name, aliases:player.hero.aliases??[], source_label:player.hero.source_label, source_coverage:player.hero.source_coverage??false, skill_name: player.hero.skill_name, source_id_aliases:player.hero.source_id_aliases??[], merged_source_records:player.hero.merged_source_records??[], skill_desc: player.hero.skill_desc },
    hand_count: player.hand.length,
    hand: player.hand.map((card) => card_to_dict(card, { hidden: !reveal_hand,owner:player })),
    equipment,
    judgment_cards: (player.judgment_cards??[]).map(card=>{const identity=(player.judgment_effects??[]).find(e=>e.card===card),dto=card_to_dict(card,{owner:player});return {...dto,...(identity?.name?{name:identity.name,type:'锦囊',physical_name:dto.physical_name??card.name,physical_type:dto.physical_type??card.type,converted:true,source_skill:identity.source_skill,effect_id:identity.effect_id}: {})};}),
    equipment_state:player.equipment_state??null,
    marks: {
      leidian: player.leidian_pending, poison: player.poison_mark_pending,
      judgment: player.judgment_mark_pending, prison: player.prison_no_sha,
      chained: Boolean(player.chained), skip_play_stage:Boolean(player.skip_play_stage), zuijiu:Boolean(player.zuijiu_active), yinren:Boolean(player.yinren_active), skip_draw_stage: Boolean(player.skip_draw_stage),
      luoyi:player.luoyi_active, sha_activity_in_own_play:player.sha_activity_in_own_play, shixian: player.shixian_active, wine_bonus: player.wine_bonus, offensive_wine_uses_this_turn:player.offensive_wine_uses_this_turn??0, sha_count_this_play_phase:player.sha_count_this_play_phase??0, bawang_stacks: player.bawang_stacks,
    },
    skills_used: Array.from(player.used_active_skills).sort(),
  };
}

export function serialize_match_state(game, { viewer_seat = "player", phase = "playing", winner = null } = {}) {
  if (!game.player) {
    return { phase, viewer_seat, winner, round: game.round_no ?? 0, players: {}, deck_count: 0, discard_count: 0, active_skills: [] };
  }
  const p1 = game.p1 ?? game.player;
  const p2 = game.p2 ?? game.ai;
  const p3 = game.p3 ?? null;
  const mode = game.mode ?? "1v1";
  let me, me_seat, foes;
  if (viewer_seat === "p1") {
    me = p1; me_seat = "p1";
    foes = [[p2, "p2"], ...(p3 !== null ? [[p3, "p3"]] : [])];
  } else if (viewer_seat === "p2") {
    me = p2; me_seat = "p2";
    foes = [[p1, "p1"], ...(p3 !== null ? [[p3, "p3"]] : [])];
  } else if (viewer_seat === "p3" && p3 !== null) {
    me = p3; me_seat = "p3";
    foes = [[p1, "p1"], [p2, "p2"]];
  } else {
    me = game.player; me_seat = "player";
    foes = [[game.ai, "ai"]];
    if (game.ai2 != null) foes.push([game.ai2, "ai2"]);
  }
  const opponent_dicts = foes.filter(([foe]) => foe != null).map(([foe, seat]) => player_to_dict(foe, { seat, reveal_hand: false }));
  const players = {
    self: player_to_dict(me, { seat: me_seat, reveal_hand: true }),
    opponents: opponent_dicts,
  };
  if (opponent_dicts.length) players.opponent = opponent_dicts[0];
  players.p1 = player_to_dict(p1, { seat: "p1", reveal_hand: ["p1", "player"].includes(viewer_seat) });
  players.p2 = player_to_dict(p2, { seat: "p2", reveal_hand: viewer_seat === "p2" });
  if (p3 !== null) players.p3 = player_to_dict(p3, { seat: "p3", reveal_hand: viewer_seat === "p3" });
  const currentSeats=game.turn_order?.()??[p1,p2,p3].filter(Boolean);
  for(const dto of [players.self,...opponent_dicts,players.p1,players.p2,players.p3].filter(Boolean)){
    const player=({p1,p2,p3,player:game.player,ai:game.ai,ai2:game.ai2})[dto.seat];
    dto.marks.all_hand_as_sha=game.has_all_hand_as_sha?.(player)??false;
    dto.marks.red_hand_as_tao=game.has_red_hand_as_tao?.(player)??false;
    dto.hand.forEach((card,i)=>{if(!card.hidden&&card.type==='酒')card.ordinary_wine_allowed=(game.can_use_offensive_wine?.(player)??true)||dto.marks.all_hand_as_sha||Boolean(game.can_use_red_as_tao?.(player,player.hand[i]));});
    dto.jianxiong=game.jianxiong_public_state?.(player)??null;
    dto.sgs_fire=game.fire_public_state?.(player)??null;
    dto.sgs_mountain=game.mountain_public_state?.(player)??null;
    dto.sgs_manchong=player.sgs_manchong_state||(rule_hero(player)?.skill_ids??[]).some(id=>['sgs.junxing','sgs.yuce'].includes(id))?sgs_manchong_public_state(player,game):null;dto.sgs_liru=game.liru_public_state?.(player)??null;
    const sourceSkills=rule_hero(player)?.skill_ids??[];dto.sgs_lingcao=player.sgs_lingcao_state||sourceSkills.includes('sgs.dujin')?sgs_lingcao_public_state(player,game):null;dto.sgs_sunru=player.sgs_sunru_state||sourceSkills.some(id=>['sgs.yingjian','sgs.shixin'].includes(id))?sgs_sunru_public_state(player,game):null;dto.sgs_yuejin=player.sgs_yuejin_state||sourceSkills.includes('sgs.xiaoguo')?sgs_yuejin_public_state(player,game):null;
    dto.sgs_panzhangmazhong=player.sgs_panzhangmazhong_state||sourceSkills.some(id=>['sgs.duodao','sgs.anjian'].includes(id))?sgs_panzhangmazhong_public_state(player):null;
    dto.sgs_caoang=player.sgs_caoang_state||sourceSkills.includes('sgs.kangkai')?sgs_caoang_public_state(player):null;
    dto.sgs_caoxiu=player.sgs_caoxiu_state||sourceSkills.some(id=>['sgs.qianju','sgs.qingxi'].includes(id))?sgs_caoxiu_public_state(player):null;
    dto.sgs_yijiang_further=game.yijiang_further_public_state?.(player)??null;dto.sgs_followup=game.followup_public_state?.(player)??null;dto.yxs_modern=game.modern_public_state?.(player)??null;
    dto.sgs_yijiang_more=game.yijiang_more_public_state?.(player)??null;
    dto.sgs_yijiang_later=game.yijiang_later_public_state?.(player)??null;
    dto.sgs_yijiang_next=game.yijiang_next_public_state?.(player)??null;
    dto.sgs_yijiang_following=game.yijiang_following_public_state?.(player)??null;
    dto.sgs_yijiang=game.yijiang_public_state?.(player)??null;
    // Eligibility to convert an unseen hand is private; public buff/ban/color
    // receipts are visible, but must not reveal whether an opponent can pay.
    if(dto.sgs_fire&&dto.seat!==me_seat){delete dto.sgs_fire.tianyi?.available;delete dto.sgs_fire.shuangxiong?.available;}
    dto.yxs_guard=game.guard_public_state?.(player)??{protects:null,protected_by:[]};
    dto.yxs_kongju=game.kongju_public_state?.(player)??null;
    dto.xiadan=game.xiadan_public_state?.(player)??null;dto.seat_position=currentSeats.indexOf(player)+1;
  }
  return {
    config:{},
    sgs_chenlin:sgs_chenlin_public_state(game,me),
    play_phase_context:game.active_play_phase_id?{...(Object.values(game.play_phase_receipts??{}).find(row=>row.phase_event_id===game.active_play_phase_id)??{})}:null,
    phase, viewer_seat, winner, round: game.round_no ?? 0, mode, players,seat_order:currentSeats.map(p=>game.seat_of?.(p)??(p===p1?'p1':p===p2?'p2':'p3')),
    deck_count: game.deck.draw_pile.length, discard_count: game.deck.discard_pile.length,
    equipment_actions:game.equipment_available_actions?.(me)??[],
    gift_actions:(game.gift_available_actions?.(me)??[]).map(action=>({id:action.id,index:action.index,name:action.card.name,available:action.available,targets:action.targets.map(p=>game.seat_of(p))})),
    active_skills: active_skills_for_hero(rule_hero(me)).map((skill) => ({ ...skill.to_client_dict(), availability: active_skill_availability(game, me, skill.skill_id) })),
  };
}
