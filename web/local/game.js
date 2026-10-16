import {validate_conventional_config} from './release-scope.js';
const activeConfirmedTargetWindows=new WeakMap();
const confirmedTargetBindings=new WeakMap();
import {sgs_bifa_turn_start} from './sgs-chenlin-skills.js';
import {liruRuntimeMethods} from './sgs-liru-runtime.js';
import {zhangfenRuntimeMethods} from './sgs-zhangfen-runtime.js';
import {zhangfenDamageMethods} from './sgs-zhangfen-skills.js';
import {normalize_zhangfen_faces} from './sgs-zhangfen-registration.js';
import {yxsModernHuashengRuntimeMethods} from './yxs-modern-huasheng-runtime.js';
import {modernRuntimeMethods} from './yxs-modern-runtime.js';
import {followupRuntimeMethods} from './sgs-followup-runtime.js';
import {yijiangFurtherRuntimeMethods} from './sgs-yijiang-further-runtime.js';
import {yijiangMoreRuntimeMethods} from './sgs-yijiang-more-runtime.js';
import {discardPhaseMethods} from './game-discard-phases.js';
import {yijiangLaterRuntimeMethods} from './sgs-yijiang-later-runtime.js';
import {yijiangNextRuntimeMethods} from './sgs-yijiang-next-runtime.js';
import {playPhaseMethods} from './game-play-phases.js';
import {yijiangFollowingRuntimeMethods} from './sgs-yijiang-following-runtime.js';
import {yijiangRuntimeMethods} from './sgs-yijiang-runtime.js';
import {generalSkillRuntimeMethods} from './general-skill-runtime.js';
import {mountainRuntimeMethods} from './sgs-mountain-runtime.js';
import {fireRuntimeMethods} from './sgs-fire-runtime.js';
import {sgs_fire_assault_turn_begin,sgs_fire_assault_turn_end} from './sgs-fire-assault-skills.js';
import {youjianStabMethods} from './youjian-stab.js';
import {youjianTrickMethods,youjian_trick_definition} from './youjian-trick-effects.js';
import {wangyunRuntimeMethods} from './wangyun-runtime.js';
import {wangyunSkillMethods,WANGYUN_RULE_ID} from './wangyun-skills.js';
import {wangyunCardMethods,WANGYUN_TRICK_BY_NAME} from './wangyun-card-effects.js';
import {followingRuntimeMethods} from './sgs-following-runtime.js';
import {cardHistoryMethods} from './game-card-history.js';
import {ninthRuntimeMethods} from './yxs-ninth-runtime.js';
import {eighthRuntimeMethods,wangyunLifecycleMethods} from './yxs-eighth-runtime.js';
import {rule_hero} from './effective-hero.js';
/** Browser-native rules, ported from game.py at e319484. Async prompts replace blocking threads. */
import {CardType, CardColor, CardSuit, Card, Player, Deck, HEROES, SeededRNG, is_sha_card, is_sha_type, is_hero_available, canonical_hero_for_source} from './models.js';
import {HERO_SKILL_HOOKS, skill_hooks_for_hero, hero_has_capability, SKILL_HOTKEYS, active_skill_by_hotkey, active_skills_for_hero} from './skills.js';
import {SCROLL_REGISTRY, SCROLL_PLAY_CHECKS} from './scrolls.js';
import {ai_choose_card, ai_choose_discard, ai_choose_target_option, ai_try_active_skill, ai_try_shixian_equipment, ai_try_zhangba} from './ai.js';
import {cardSemanticMethods} from './game-card-semantics.js';
import {combatMethods} from './game-combat.js';
import {materialMethods} from './game-materials.js';
import {trickMethods} from './game-tricks.js';
import {zoneMethods} from './game-zones.js';
import {youjianEquipmentMethods} from './youjian-equipment.mjs';
import {youjianCardEventMethods} from './youjian-card-events.js';
import {seventhRuntimeMethods} from './yxs-seventh-runtime.js';
import {create_seat_order,seat_order_players,next_seat_actor} from './seat-order.js';
import {yxs_xiadan_turn_begin,yxs_xiadan_turn_end} from './yxs-xiadan-skills.js';
import {guardRuntimeMethods} from './yxs-sixth-guard-runtime.js';
import {yxs_expire_menshen_on_turn_begin} from './yxs-sixth-guard-skills.js';
import {YOUJIAN_EQUIPMENT_PACK_ID} from './content-packs.js';
import {equipmentMethods} from './equipment.mjs';
import {derivedEquipmentMethods,LIUYE_HERO_ID} from './derived-equipment.mjs';
import {normalize_content_packs} from './content-packs.js';
const AOE_SCROLLS = new Set(['万箭齐发', '烽火狼烟']);
const SELF_ONLY_SCROLLS = new Set(['无中生有']);
const SELF_ONLY_SKILLS = new Set(['诗仙', '霸王', '驭人', '苦肉', '疏财']);
const SLOTS = ['weapon','armor','offensive_horse','defensive_horse'];
const digits = value => /^\d+$/.test(String(value));
const words = value => String(value).trim().split(/\s+/).filter(Boolean);
const pop = (array, index) => array.splice(index, 1)[0];
const findIndex = (array, test) => {const index=array.findIndex(test); return index < 0 ? null : index;};
export class Game {
  constructor(view, {seed=1,content_packs=[],zhangfen_faces=null,match_id='match'}={}) {
    this.sha_phase_use_receipts={};this.actual_turn_active=null;this.draw_phase_event_counter=0;this.sgs_forest_assault_integrated=true;this.phase_window_counter=0;this.flip_event_counter=0;this.sgs_wind_state={version:1,flips:{}};
    this.sgs_following_loss_integrated=true;this.sgs_following_judgment_integrated=true;this.hand_exchange_counter=0;this.end_phase_event_counter=0;this.recovery_event_counter=0;this.recovery_event_receipts={};this.public_card_loss_supports_on_committed=true;this.judgment_event_counter=0;this.judgment_stack=[];this.damage_stack=[];this.sha_target_stack=[];this.sha_target_observer_receipts={};
    validate_conventional_config({zhangfen_faces});this.content_packs=normalize_content_packs(content_packs);this.zhangfen_faces=null;this.match_id=match_id;
    this.view=view; this.rng=new SeededRNG(seed);
    this.deck=new Deck(this.rng,()=>this.view.emit('\n牌库已洗入弃牌堆。',{event_type:'reshuffle'}),{content_packs:this.content_packs});
    this.deck.on_card_move=(card,to)=>this.copied_card_moved(card,to);
    this.ai2=null; this.mode='1v1'; this.round_no=0; this.winner=null;
    this.turn_actor=null; this.turn_phase='setup';this.processing_cards=[];this.response_stack=[];this.damage_event_counter=0;this.dying_event_counter=0;this.card_use_counter=0;this.response_event_counter=0;this.turn_event_counter=0;this.play_phase_event_counter=0;this.dying_stack=[];this.offboard_cards=[];this.derived_event_receipts={};this.derived_equipment_initialized=false;this.card_move_counter=0;this.card_move_receipts={};this.youjian_card_event_receipts={};this.youjian_equipment_receipts={};this.equipment_entry_counter=0;this.yxs_sixth_guard_state={version:1,fanji:{},kongju:{},menshen:{},guards:{}};this.yxs_sixth_card_uses={};this.seat_order_state=null;this.turn_cursor_id=null;this.round_step=0;this.yxs_queen_state={version:1,counter:0,qiandu:{},exchanges:{},ai:{}};this.pindian_counter=0;this.pindian_receipts={};this.pindian_batch_counter=0;this.pindian_batch_receipts={};this.xiadan_turn_modifiers={};this.xiadan_effect_receipts={};this.xiadan_ai_plans={};this.hero_lifecycle_state=null;this.hero_lifecycle_effect_receipts={};this.hero_death_counter=0;this.equipment_loss_counter=0;this.yxs_eighth_state=null;
  }
  seat_of(player) {
    if(this.p1===player) return 'p1'; if(this.p2===player) return 'p2'; if(this.p3===player) return 'p3';
    if(this.player===player) return 'player'; if(this.ai2===player) return 'ai2'; if(this.ai===player) return 'ai'; return 'player';
  }
  all_players(){return [this.player,this.ai,...(this.ai2?[this.ai2]:[])];}
  turn_order(){return this.seat_order_state?seat_order_players(this):this.all_players();}
  effective_gender(player){const value=player?.gender_override??rule_hero(player)?.gender;return ({male:"male",female:"female",男:"male",女:"female"})[value]??null;}
  side_of(player){return player===this.player||player===this.p1?'player':'ai';}
  alive_enemies(actor){return this.all_players().filter(p=>p.alive&&this.side_of(p)!==this.side_of(actor));}
  alive_allies(actor){return this.all_players().filter(p=>p.alive&&p!==actor&&this.side_of(p)===this.side_of(actor));}
  default_foe(actor){return this.alive_enemies(actor)[0]??null;}
  next_living_player(current){const order=this.turn_order(),i=order.indexOf(current); if(i<0)return this.default_foe(current); for(let n=1;n<=order.length;n++){const p=order[(i+n)%order.length];if(p.alive)return p;}return null;}
  match_should_continue(){return this.player.alive&&this.all_players().some(p=>this.side_of(p)!==this.side_of(this.player)&&p.alive);}
  resolution_should_continue(){return !this.winner&&!this.player.dead&&this.all_players().some(p=>this.side_of(p)!==this.side_of(this.player)&&!p.dead);}
  card_needs_enemy_target(card){return is_sha_type(card.type)||(card.type===CardType.SCROLL&&!SELF_ONLY_SCROLLS.has(card.name)&&!AOE_SCROLLS.has(card.name));}
  async pick_enemy_target(actor,{purpose='选择目标',cancellable=false,candidates=null}={}){
    const foes=candidates??this.alive_enemies(actor); if(!foes.length)return null; if(foes.length===1||actor.is_ai)return foes.find(p=>this.side_of(p)!==this.side_of(actor))??foes[0];
    const options=foes.map(foe=>({id:this.seat_of(foe),label:`${foe.name}（${rule_hero(foe).display_name??rule_hero(foe).name} · ${foe.hp}血）`}));
    if(cancellable)options.push({id:'cancel',label:'取消发动'});
    while(true){const choice=(await this.view.ask_line(purpose,{kind:'choice',options,player_id:this.seat_of(actor)})).trim();
      if(cancellable&&(choice==='cancel'||choice==='0'))return null;
      const match=foes.find(foe=>[this.seat_of(foe),foe.name,rule_hero(foe).name,rule_hero(foe).display_name].includes(choice));if(match)return match;
      if(digits(choice)&&+choice>=1&&+choice<=foes.length)return foes[+choice-1];this.view.emit('请选择有效目标。');}
  }
  async start({player_hero=null,ai_hero=null,ai2_hero=null,player_name='你',ai_name='AI',ai2_name='AI2',ai_is_ai=true,mode='1v1'}={}){
    for(const selected of [player_hero,ai_hero,ai2_hero])if(selected&&!is_hero_available(selected))throw new Error('该英雄尚未完成来源核验与实现测试，不能开始对局。');
    const canonical=hero=>hero?(canonical_hero_for_source(hero.id)??hero):null;
    player_hero=canonical(player_hero);ai_hero=canonical(ai_hero);ai2_hero=canonical(ai2_hero);
    if(mode==='1v2'&&ai_hero&&ai2_hero&&ai_hero.id===ai2_hero.id)throw new Error('两个人机不能使用同一英雄（包括已合并的来源别名）。');
    for(const selected of [player_hero,ai_hero,ai2_hero])if(selected&&!is_hero_available(selected))throw new Error('该英雄尚未完成来源核验与实现测试，不能开始对局。');
    this.mode=['1v1','1v2'].includes(mode)?mode:'1v1';
    this.view.emit('=== 文字版英雄杀 ===');this.view.emit(this.mode==='1v2'?'模式：1 人对战 2 人机。击败两名 AI 即胜。\n':'目标：击败对手。输入牌序号出牌，输入 0 结束出牌阶段。\n');
    this.player=new Player(player_name,player_hero??await this.choose_hero({player_id:'player'}));
    // Reserve an explicitly chosen second AI hero before randomly selecting AI1.
    // Compare canonical IDs: archived source objects must never bypass uniqueness.
    const pool=HEROES.filter(h=>h.id!==rule_hero(this.player).id),aiPool=this.mode==='1v2'&&ai2_hero?pool.filter(h=>h.id!==ai2_hero.id):pool;
    this.ai=new Player(ai_name,ai_hero??this.rng.choice(aiPool.length?aiPool:pool),ai_is_ai);
    this.ai2=null;this.p1=this.player;this.p2=this.ai;this.p3=null;
    if(this.mode==='1v2'){const pool2=HEROES.filter(h=>h.id!==rule_hero(this.ai).id&&h.id!==rule_hero(this.player).id);this.ai2=new Player(ai2_name,ai2_hero??this.rng.choice(pool2.length?pool2:pool),true);this.p3=this.ai2;}
    if(this.all_players().some(p=>['yxs.adapted.base.hero.hua-mu-lan',WANGYUN_RULE_ID].includes(p.hero.id)))this.initialize_hero_lifecycle();
    if(this.all_players().some(p=>['yxs.adapted.base.hero.hua-mu-lan',WANGYUN_RULE_ID,...['liao-hua','bu-lian-shi','han-dang','wu-guo-tai','ling-tong','xu-sheng','chen-gong','zhang-he','deng-ai','jiang-wei','cai-wen-ji'].map(x=>`sgs.adapted.base.hero.${x}`)].includes(p.hero.id)))this.initialize_general_skill_ledger();
    this.seat_order_state=create_seat_order(this.all_players().map(p=>this.player_id(p)));this.turn_cursor_id=this.player_id(this.player);
    this.view.emit(`\n${this.player.name}选择了 ${rule_hero(this.player).display_name??rule_hero(this.player).name}：${rule_hero(this.player).skill_name} - ${rule_hero(this.player).skill_desc}`);
    for(const p of this.all_players().slice(1))this.view.emit(`${p.name}选择了 ${rule_hero(p).display_name??rule_hero(p).name}：${rule_hero(p).skill_name} - ${rule_hero(p).skill_desc}`);
    if(this.all_players().some(p=>rule_hero(p).id===LIUYE_HERO_ID))this.initialize_derived_equipment(Card);
    this.view.emit('');for(const p of this.all_players())await this.draw_cards(p,4);
    this.round_no=1;
    while(this.match_should_continue()){
      this.view.emit(`\n========== 第 ${this.round_no} 轮 ==========`);
      for(this.round_step=0;this.round_step<this.all_players().length;this.round_step++){
        if(!this.match_should_continue())break;
        const actor=this.all_players().find(p=>this.player_id(p)===this.turn_cursor_id);if(!actor)throw Error('当前行动人物身份不存在');
        if(actor.alive){const foe=this.default_foe(actor);if(!foe)break;await this.take_turn(actor,foe);}
        this.turn_cursor_id=next_seat_actor(this.seat_order_state,this.player_id(actor));
      }
      this.round_no++;
    }
    this.winner=this.player.alive?'player':'ai';this.turn_phase='finished';
    this.view.emit(this.player.alive?'\n你赢了！天下英雄，尽入彀中。':'\n你输了。胜败乃兵家常事，再来一局。',{event_type:'game_over'});
  }
  async choose_hero({player_id='player'}={}){
    const options=HEROES.map((hero,i)=>({id:String(i+1),label:`${hero.display_name??hero.name}  血量:${hero.max_hp}  ${hero.skill_name}: ${hero.skill_desc}`}));
    this.view.emit('请选择英雄：');for(const o of options)this.view.emit(`${o.id}. ${o.label}`);
    while(true){const choice=await this.view.ask_line('输入英雄编号：',{kind:'hero_select',options,player_id});if(digits(choice)&&+choice>=1&&+choice<=HEROES.length)return HEROES[+choice-1];this.view.emit('请输入有效编号。');}
  }
  async take_turn(actor,target){
    this.turn_actor=this.seat_of(actor);this.turn_phase='scheduled_turn';this.actual_turn_active=false;
    yxs_expire_menshen_on_turn_begin(this,actor);this.guard_state_changed();
    if(actor.face_orientation==='face_down'){
      await this.flip_general(actor,{source_skill:'scheduled_turn',event_id:`scheduled-flip:${++this.phase_window_counter}`});
      this.view.emit(`${actor.name}将武将牌翻回正面，跳过本次整个回合。`);this.turn_phase='turn_skipped';return;
    }
    this.turn_phase='turn_start';this.actual_turn_active=true;
    for(const player of this.all_players())this.equipment_reset_turn?.(player);
    actor.zuijiu_active=false;actor.yinren_active=false;actor.skip_play_stage=false;actor.skip_discard_stage=false;
    let capturedTurnId=this.turn_event_counter;
    try{
    actor.phase_skip_origins={};actor.sha_activity_in_own_play=false;actor.luoyi_active=false;actor.kurou_ai_uses=0;actor.used_sha_this_turn=false;actor.sha_count_this_turn=0;actor.sha_count_this_play_phase=0;actor.offensive_wine_uses_this_turn=0;actor.tao_count_this_turn=0;actor.bawang_stacks=0;actor.used_active_skills.clear();actor.wine_bonus=0;actor.shixian_active=false;
    this.view.emit(`\n-- ${actor.name}的回合：${rule_hero(actor).display_name??rule_hero(actor).name} --`);this.show_status();
    const turnEvent={event_id:`turn:${++this.turn_event_counter}`};capturedTurnId=this.turn_event_counter;sgs_fire_assault_turn_begin(this);yxs_xiadan_turn_begin(this,actor,turnEvent);this.begin_history_turn(actor,turnEvent.event_id);if(this.wangyun_events_enabled())this.wangyun_turn_begin(actor,turnEvent);
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_turn_begin??[])await hook(this,actor,target,turnEvent);
    if(actor.alive&&!actor.dead)await sgs_bifa_turn_start(this,actor,turnEvent);
    if(!actor.alive||!this.match_should_continue())return;
    this.turn_phase='prepare';
    const prepareEvent={phase_event_id:`prepare:${++this.phase_window_counter}`,turn_id:this.turn_event_counter,actor};
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_prepare??[])await hook(this,actor,target,prepareEvent);
    if(!actor.alive||!this.match_should_continue())return;
    this.turn_phase='before_judgment';
    const judgmentId=`judgment-attempt:${++this.phase_window_counter}`,judgmentWindow={event_id:`before-${judgmentId}`,phase_event_id:judgmentId,turn_id:capturedTurnId,closed:false,upcoming_phases:['judgment','draw']};
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_judgment_phase??[])await hook(this,actor,target,judgmentWindow);
    if(!actor.alive||!this.match_should_continue())return;
    this.turn_phase='judgment';
    if(actor.skip_judgment_stage){this.record_phase_skip(actor,{phase_event_id:judgmentId,phase:'judgment',turn_id:capturedTurnId});actor.skip_judgment_stage=false;this.view.emit(`${actor.name}跳过判定阶段，判定牌和标记保留。`);}
    else {await this.resolve_judgment_cards(actor);await this.resolve_leidian(actor,target);await this.resolve_poison_mark(actor);await this.resolve_judgment_mark(actor,target);}
    // A defeated actor cannot draw or execute another skill after a lethal judgment.
    if(!actor.alive||!this.match_should_continue())return;
    await this.resolve_draw_phase(actor,target);
    if(!actor.alive||!this.match_should_continue())return;
    await this.execute_play_phase(actor,target);
    if(!actor.alive)return;
    this.turn_phase='end';const foe=target.alive?target:this.default_foe(actor);if(foe)await this.trigger_on_turn_end(actor,foe);
    actor.prison_no_sha=false;this.turn_phase='before_discard';const discardId=`discard-attempt:${++this.phase_window_counter}`;
    if(actor.alive&&!actor.skip_discard_stage){const discardWindow={event_id:`before-${discardId}`,phase_event_id:discardId,turn_id:capturedTurnId,closed:false,upcoming_phases:['discard']};for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_discard_phase??[])await hook(this,actor,this.default_foe(actor),discardWindow);}
    if(!actor.alive)return;
    this.turn_phase='discard';if(actor.skip_discard_stage){this.record_phase_skip(actor,{phase_event_id:discardId,phase:'discard',turn_id:capturedTurnId});actor.skip_discard_stage=false;this.view.emit(`${actor.name}跳过弃牌阶段。`);}else {const phase_id=this.begin_yijiang_discard_phase(actor);await this.discard_down_to_hp(actor);await this.finish_yijiang_discard_phase(actor,phase_id);}actor.luoyi_active=false;
    this.turn_phase='end_phase';
    if(this.wangyun_events_enabled())await this.wangyun_end_phase(actor,{phase_event_id:`end-phase:${this.end_phase_event_counter+1}`});
    if(actor.alive){
      const endEvent={actor,turn_id:capturedTurnId,phase_event_id:`end-phase:${++this.end_phase_event_counter}`,stage:'start',closed:false};
      this.active_end_phase_id=endEvent.phase_event_id;
      try{
        for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_end_phase??[])await hook(this,actor,this.default_foe(actor),endEvent);
        // Active actor's intrinsic end effects precede other holders in current action order.
        for(const holder of this.action_order().filter(p=>p?.alive)){
          if(!actor.alive||!this.match_should_continue()||this.turn_event_counter!==capturedTurnId)break;
          for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_end_phase_start??[])await hook(this,holder,endEvent);
        }
      }finally{endEvent.closed=true;this.active_end_phase_id=null;}
    }
    if(actor.alive&&this.match_should_continue()){
      this.turn_phase='turn_end';const event={actor,event_id:`actual-turn-end:${capturedTurnId}:${this.player_id(actor)}`,turn_id:capturedTurnId,stage:'turn_end',closed:false};
      try{for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_actual_turn_end??[])await hook(this,actor,this.default_foe(actor),event);for(const holder of this.action_order().filter(p=>p.alive))for(const hook of skill_hooks_for_hero(rule_hero(holder))?.on_any_actual_turn_end??[])await hook(this,holder,actor,event);}finally{event.closed=true;}
    }
    }finally{
      try{try{await this.finish_yijiang_global_turn(capturedTurnId);}finally{this.finish_following_global_turn(capturedTurnId);}}
      finally{
        // Even a failed pile-cleanup callback cannot leak a completed turn's Wine.
        actor.wine_bonus=0;actor.zuijiu_active=false;this.actual_turn_active=false;this.finish_next_global_turn(capturedTurnId);
        sgs_fire_assault_turn_end(this,actor,{turn_id:capturedTurnId});
        if(this.wangyun_events_enabled()&&capturedTurnId)this.wangyun_turn_end(actor,{turn_id:capturedTurnId});
        if(this.card_use_history?.current_turn_id===`turn:${capturedTurnId}`)this.end_history_turn(`turn:${capturedTurnId}`);
        yxs_xiadan_turn_end(this,actor,{turn_id:capturedTurnId});this.equipment_reset_turn?.(actor);
      }
    }
  }
  is_own_actual_turn(actor){return this.actual_turn_active!==false&&this.turn_actor===this.seat_of(actor);}
  async flip_general(actor,options={}){const changed=this.flip_general_atomic(actor,options);await this.flush_general_state_events();return changed;}
  flip_general_atomic(actor,{source_skill=null,event_id=null}={}){
    if(!actor||actor.dead)return false;
    const id=event_id??`flip:${++this.flip_event_counter}`;this.sgs_wind_state??={version:1,flips:{}};this.sgs_wind_state.flips??={};
    const key=`${this.player_id(actor)}:${id}`;if(this.sgs_wind_state.flips[key])return false;
    const from=actor.face_orientation??'face_up',to=from==='face_up'?'face_down':'face_up';
    this.sgs_wind_state.flips[key]={event_id:id,player_id:this.player_id(actor),source_skill,from,to};actor.face_orientation=to;
    this.enqueue_general_state_changed(actor,{state_event_id:`flip-state:${key}`,kind:'flip',from,to,source_skill});
    this.view.emit(`${actor.name}的武将牌翻至${to==='face_down'?'背面（下次行动翻回并跳过回合）':'正面'}。`,{event_type:'hero_flip',player_id:this.player_id(actor),face_orientation:to,source_skill});return true;
  }
  youjian_events_enabled(){return this.content_packs.includes(YOUJIAN_EQUIPMENT_PACK_ID);}
  draw_cards(player,count){if(player.dead)return [];const drawn=this.deck.draw(count);if(!this.youjian_events_enabled()){player.hand.push(...drawn);return drawn;}this.processing_cards.push(...drawn);return this.obtain_drawn_cards(player,drawn,{reason:'摸牌'}).then(()=>drawn);}
  async try_shiquan_bonus_draw(actor){if(this.rng.random()<.25){await this.draw_cards(actor,1);this.view.emit(`${actor.name}释权额外触发，摸了1张牌。`);}}
  _phase_foe(actor,fallback){return fallback.alive&&this.alive_enemies(actor).includes(fallback)?fallback:this.default_foe(actor);}
  async player_play(actor,target){
    while(actor.alive&&this.alive_enemies(actor).length){
      const foe=this._phase_foe(actor,target);if(!foe)break;if(!this.can_continue_play_phase(actor,foe)){this.view.emit('出牌阶段结束。');break;}
      this.show_status(true);this.show_hand(actor);if(actor.shixian_active)this.show_shixian_equipment(actor);
      const choice=(await this.view.ask_line('出牌编号 / eq weapon ... / q w e r ... / sha 1 2 / 0结束：',{kind:'play_card',player_id:this.seat_of(actor)})).trim();
      const low=choice.toLowerCase(),parts=words(low);if(low==='0')break;
      if(parts.length&&SKILL_HOTKEYS.has(parts[0])){
        const skill=active_skill_by_hotkey(rule_hero(actor),parts[0]);
        const cancellable=skill&&['龙胆','武穆','反间'].includes(skill.skill_id);
        const selected=skill&&!skill.owns_target_selection&&!SELF_ONLY_SKILLS.has(skill.skill_id)?await this.pick_enemy_target(actor,{purpose:`选择「${skill.skill_id}」的目标`,cancellable}):foe;
        if(cancellable&&!selected)continue;
        const st=selected??foe;
        if(!await this.player_use_active_skill(actor,st,parts[0],words(choice).slice(1)))this.view.emit('主动技能用法不正确。');
        else if(!this.can_continue_play_phase(actor,st)){this.view.emit('出牌阶段结束。');break;}continue;
      }
      if(low.startsWith('gift:')){await this.player_give_gift(actor,low);continue;}
      if(low.startsWith('equipment ')){await this.use_equipment_action(actor,foe,low);continue;}
      if(low.startsWith('eq ')){
        const st=await this.pick_enemy_target(actor,{purpose:'选择杀的目标',candidates:this.all_players().filter(p=>this.can_sha_target(actor,p))})??foe;
        if(!await this.player_use_equipment_as_sha(actor,st,choice.slice(3).trim()))this.view.emit('装备当杀用法：eq weapon / eq armor / eq 进攻马 / eq 防御马');
        else if(!this.can_continue_play_phase(actor,st)){this.view.emit('出牌阶段结束。');break;}continue;
      }
      if(low.startsWith('sha ')){
        const st=await this.pick_enemy_target(actor,{purpose:'选择杀的目标',candidates:this.all_players().filter(p=>this.can_sha_target(actor,p))})??foe;
        if(await this.player_use_zhangba(actor,st,low)){if(!this.can_continue_play_phase(actor,st)){this.view.emit('出牌阶段结束。');break;}continue;}
        this.view.emit(`${actor.weapon?.trait==='two_as_sha'?actor.weapon.name:'两牌转杀武器'}用法：装备后输入 sha 两个手牌编号，例如 sha 1 2。`);continue;
      }
      if(!digits(choice)||+choice<1||+choice>actor.hand.length){this.view.emit('无效输入。');continue;}
      const card=actor.hand[+choice-1],useFace=this.contextual_use_face(actor,card);let pt=foe;let useOptions=null;
      if(!this.has_all_hand_as_sha(actor)&&!this.can_use_red_as_tao(actor,card)&&card.type===CardType.SCROLL&&['无懈可击','借刀杀人','铁索连环','火攻','兵粮寸断','手捧雷','画地为牢','釜底抽薪','过河拆桥','顺手牵羊','美人计','笑里藏刀','五谷丰登','桃园结义','树上开花','刮骨疗毒','推心置腹','趁火打劫'].includes(card.name)){useOptions=await this.prepare_card_use(actor,card,foe);if(!useOptions)continue;pt=useOptions.target;}
      if(!useOptions&&!this.can_use_red_as_tao(actor,card)&&this.card_needs_enemy_target(useFace)){pt=await this.pick_enemy_target(actor,{purpose:`选择「${useFace.name}」的目标`,candidates:is_sha_type(useFace.type)?this.all_players().filter(p=>this.can_sha_target(actor,p)):null});if(!pt)continue;}
      if(!this.can_play(actor,pt,card))continue;await this.play_hand_card(actor,pt,card,useOptions??{});
      if(!this.can_continue_play_phase(actor,pt.alive?pt:foe)){this.view.emit('出牌阶段结束。');break;}
    }
  }
  async ai_play(actor,target){
    this.view.emit(`${actor.name} 正在思考...`);let acted=true,count=0;
    while(acted&&actor.alive&&target.alive){
      if(++count>1000)throw new Error('AI 出牌未能收敛，请返回并恢复本地存档。');
      if(!this.can_continue_play_phase(actor,target)){this.view.emit(`${actor.name} 出牌阶段结束。`);break;}acted=false;
      if(await this.ai_give_gift(actor)){acted=true;continue;}
      const gearAction=this.equipment_ai_action?.(actor,target);if(gearAction&&await this.use_equipment_action(actor,target,gearAction)){acted=true;continue;}
      if(await ai_try_active_skill(this,actor,target)){acted=true;if(!this.can_continue_play_phase(actor,target)){this.view.emit(`${actor.name} 出牌阶段结束。`);break;}continue;}
      if(await ai_try_shixian_equipment(this,actor,target)){acted=true;if(!this.can_continue_play_phase(actor,target)){this.view.emit(`${actor.name} 出牌阶段结束。`);break;}continue;}
      const index=ai_choose_card(this,actor,target);
      if(index!==null&&index!==undefined){const card=actor.hand[index];const opts=await this.prepare_card_use(actor,card,target);if(!opts)break;this.view.emit(`${actor.name} 使用了 ${card}。`);await this.play_hand_card(actor,opts.target,card,opts);acted=true;}
      else if(await ai_try_zhangba(this,actor,target))acted=true;
      if(acted&&!this.can_continue_play_phase(actor,target)){this.view.emit(`${actor.name} 出牌阶段结束。`);break;}
    }
  }
  async player_give_gift(actor,command){
    const index=Number(command.slice(5))-1,card=actor.hand[index];
    const targets=this.gift_targets?.(actor,card)??[];if(!targets.length){this.view.emit('这张牌当前不能赠予。');return false;}
    while(true){const choice=await this.view.ask_line(`赠予${card.name}：选择另一名角色（公开失去毒将先结算体力流失）`,{kind:'choice',player_id:this.seat_of(actor),options:[...targets.map(p=>({id:this.seat_of(p),label:`${p.name} · ${rule_hero(p).display_name??rule_hero(p).name}${this.youjian_gift_blocked(p,{action:'gift',source:actor})?' · 战象使赠予失败并弃牌':''}`})),{id:'cancel',label:'取消赠予'}],meta:{stage:'gift_target',card_name:card.name,private_to:this.seat_of(actor)}});
      if(['cancel','0'].includes(choice))return false;const target=targets.find(p=>this.seat_of(p)===choice);if(target)return await this.give_gift(actor,card,target);}
  }
  async ai_give_gift(actor){
    if(!this.is_own_play_phase(actor))return false;
    const actions=this.gift_available_actions?.(actor)??[];
    for(const action of actions){const card=action.card;
      // Only own hand and public HP/equipment/sex/team data enter this policy.
      const harmful=card.type===CardType.POISON||['broken_halberd','bee_robe','mobile_female_dress','inferior_horse'].includes(card.trait);
      if(card.type===CardType.POISON&&actor.hp<=(this.youjian_poison_armor_snapshot(actor)?2:1))continue;
      const targets=action.targets.filter(p=>!this.youjian_gift_blocked(p,{action:'gift',source:actor})&&(this.side_of(p)!==this.side_of(actor))===harmful);
      const slot={[CardType.WEAPON]:'weapon',[CardType.ARMOR]:'armor',[CardType.OFFENSIVE_HORSE]:'offensive_horse',[CardType.DEFENSIVE_HORSE]:'defensive_horse'}[card.type];
      const target=targets.find(p=>harmful?(card.trait!=='mobile_female_dress'||this.effective_gender(p)==='male'):slot&&!p[slot]);
      if(target)return await this.give_gift(actor,card,target);
    }return false;
  }
  async play_hand_card(actor,target,card,options={}){
    const index=actor.hand.indexOf(card);if(index<0)return false;
    options={...options};delete options.shizhi_face;
    const shizhiFace=this.contextual_use_face(actor,card),shizhiEpoch=this.card_location_epoch(card),shizhiBinding=shizhiFace!==card?this.general_skill_binding_id(actor,'sgs.shizhi'):null;
    if(shizhiFace!==card)options.shizhi_face=shizhiFace;
    const validDeclaration=()=>!options.shizhi_face||actor.hand[index]===card&&this.card_location_epoch(card)===shizhiEpoch&&this.general_skill_binding_id(actor,'sgs.shizhi')===shizhiBinding&&this.contextual_use_face(actor,card)!==card;
    if(card.type===CardType.SHAN&&!options.shizhi_face&&!this.can_use_hand_as_sha(actor,target,card)&&!this.can_use_red_as_tao(actor,card))return false;
    const asSha=Boolean(options.shizhi_face)||!this.can_use_red_as_tao(actor,card)&&(is_sha_type(card.type)||(this.has_all_hand_as_sha(actor)&&!(card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp)));
    if(asSha&&(!this.can_use_sha(actor)||!this.can_sha_target(actor,target)||!this.in_attack_range(actor,target)))return false;
    if(!asSha&&!this.can_use_red_as_tao(actor,card)&&card.type===CardType.SCROLL&&card.name==='决斗'&&!this.can_duel_target(actor,target,options))return false;
    if(card.type===CardType.SCROLL&&!this.has_all_hand_as_sha(actor)&&!this.can_use_red_as_tao(actor,card)&&!this.can_trick_target(actor,target,card))return false;
    const offensiveWine=!asSha&&!this.can_use_red_as_tao(actor,card)&&card.type===CardType.WINE;
    if(offensiveWine&&!this.can_use_offensive_wine(actor))return false;
    options={...options,trick_declaration_validated:true,as_red_tao:this.can_use_red_as_tao(actor,card),as_hand_sha:this.can_use_hand_as_sha(actor,target,card)&&!this.should_play_normal_effect(actor,target,card)};
    let scope=null;
    try{const paid=await this.consume_material(actor,{zone:'hand',index,card},{to:'processing',reason:'使用牌',action:'card_use',validate:options.shizhi_face?validDeclaration:null,on_committed:()=>{if(offensiveWine){if(!this.commit_offensive_wine(actor))throw Error('酒的本回合次数已使用');options.wine_committed=true;}if(!options.recast){scope=this.start_card_use(actor,this.declared_card_function(actor,target,card,options),{materials:[card],sourceZones:['hand']});options.history_use_id=scope.use_id;}}});if(!paid)return false;
      if(actor.alive)await this.resolve_card(actor,target,card,options);
    }finally{this.finish_processing_card(card);this.end_card_use(scope);}return true;
  }
  async resolve_card(actor,target,card,options={}){
    const hold=()=>{if(!this.processing_cards.includes(card))this.processing_cards.push(card);};
    if(options.shizhi_face){await this.use_sha(actor,target,'矢志·闪当杀',{source_card:options.shizhi_face,source_last_hand:actor.hand.length===0,use_provenance:{kind:'converted',physical_cards:[card],source_skill:'sgs.shizhi'},history_use_id:options.history_use_id,source_skill:'sgs.shizhi'});return;}
    const discard=()=>{if(!this.finish_processing_card(card))this.deck.discard(card);};
    if(options.as_red_tao||this.can_use_red_as_tao(actor,card)){discard();await this.use_tao(actor,card,{as_red:true});return;}
    if(is_sha_type(card.type)){hold();const useView=options.copied_function?this.jianxiong_card(this.effective_card_definition(card),card):card;try{await this.use_sha(actor,target,card.name,{source_card:useView,source_last_hand:actor.hand.length===0,use_provenance:options.copied_function?{kind:'converted',physical_cards:[card],source_skill:'yxs.jianxiong'}:{kind:'physical',physical_card:card},history_use_id:options.history_use_id});}finally{this.finish_processing_card(card);}return;}
    if(this.should_play_normal_effect(actor,target,card)){
      if(card.type===CardType.TAO){await this.use_tao(actor,card);discard();return;}
      if(card.type===CardType.WINE){if(!options.wine_committed&&!this.commit_offensive_wine(actor)){this.view.emit('普通酒每个回合只能使用一次。');return false;}actor.wine_bonus=1;this.view.emit(`${actor.name}饮酒，本回合下一张杀伤害+1。`);discard();return;}
      if(card.type===CardType.SCROLL){hold();try{await this.resolve_scroll(actor,target,options.copied_function?this.jianxiong_card(this.effective_card_definition(card),card):card,options);}finally{this.finish_processing_card(card);}return;}
      const slot={[CardType.WEAPON]:'weapon',[CardType.ARMOR]:'armor',[CardType.OFFENSIVE_HORSE]:'offensive_horse',[CardType.DEFENSIVE_HORSE]:'defensive_horse'}[card.type];
      if(slot){await this.equip_card(actor,slot,card);this.view.emit(`${actor.name}装备了${{weapon:'武器',armor:'防具',offensive_horse:'进攻马',defensive_horse:'防御马'}[slot]}：${card.name}。`);return;}
    }
    if(this.can_use_hand_as_sha(actor,target,card)){hold();try{await this.use_sha(actor,target,`诗仙·${card.name}当杀`,{source_card:this.material_sha(actor,card),source_last_hand:actor.hand.length===0,history_use_id:options.history_use_id});}finally{this.finish_processing_card(card);}return;}
    this.view.emit('这张牌现在不能主动使用。');const index=this.processing_cards.indexOf(card);if(index>=0)this.processing_cards.splice(index,1);actor.hand.push(card);
  }
  /** Mixed-source H2/H4: finalized redirects/protection, before this target's
   * equipment and responses. Observers cannot rewrite the committed target. */
  async dispatch_sha_target_confirmed(context){
    if(context?.kind!=='sha'||!context.card_use_id||!context.branch_id||!context.target)throw Error('杀目标确认事件缺少稳定身份');
    const event_id=`${context.branch_id}:confirmed`,target=context.target;
    const request={card_use_id:context.card_use_id,branch_id:context.branch_id,target_id:this.player_id(target),card_user_id:this.player_id(context.card_user??context.source),source_id:context.source?this.player_id(context.source):null,public_use_face:context.damage_card_identity?{...context.damage_card_identity}:null};
    const receipts=this.sha_target_observer_receipts??={};
    let bindings=confirmedTargetBindings.get(this);if(!bindings){bindings=new Map();confirmedTargetBindings.set(this,bindings);}
    let receipt=receipts[event_id];
    if(receipt){
      if(JSON.stringify(receipt.request)!==JSON.stringify(request))throw Error('杀目标确认事件身份不一致');
      const binding=bindings.get(event_id);
      if(!binding)throw Error('杀目标观察缺少运行时身份绑定，必须从操作日志重放：REPLAY_REQUIRED');
      if(binding.card!==(context.source_card??null)||binding.source!==(context.source??null)||binding.user!==(context.card_user??context.source)||binding.target!==target)throw Error('杀目标确认事件身份不一致');
      if(receipt.status==='done'||activeConfirmedTargetWindows.get(this)?.has(event_id))return receipt;
      throw Error('杀目标观察尚未完成，必须从操作日志重放：REPLAY_REQUIRED');
    }
    let active=activeConfirmedTargetWindows.get(this);if(!active){active=new Set();activeConfirmedTargetWindows.set(this,active);}active.add(event_id);
    bindings.set(event_id,{card:context.source_card??null,source:context.source??null,user:context.card_user??context.source,target});
    receipt=receipts[event_id]={event_id,request,status:'running',owners:[]};
    try{
      for(const owner of this.action_order()){
        if(!target.alive||!this.resolution_should_continue())break;
        if(!owner.alive)continue;
        const hooks=skill_hooks_for_hero(rule_hero(owner))?.on_any_sha_target_confirmed??[];
        if(!hooks.length)continue;
        const entry={owner_id:this.player_id(owner),status:'running',hooks_completed:0};receipt.owners.push(entry);
        for(const hook of hooks){
          if(!owner.alive||!target.alive||!this.resolution_should_continue())break;
          if(!(skill_hooks_for_hero(rule_hero(owner))?.on_any_sha_target_confirmed??[]).includes(hook))continue;
          await hook(this,owner,target,{...context,target,event_id,target_window_id:context.target_window_id??event_id,target_confirmed_id:event_id,confirmed_target_id:request.target_id});
          entry.hooks_completed++;
        }
        entry.status='done';
      }
      receipt.status='done';return receipt;
    }catch(error){receipt.status='failed';receipt.error=String(error?.message??error);throw error;}finally{active.delete(event_id);}
  }
  async use_sha(actor,target,virtual_source='杀',{source_card=null,forced=false,additional_targets=[],source_last_hand=false,use_provenance={kind:'virtual'},chenyu_allowed=true,attack_chain=null,source_skill=null,parent_damage_event_id=null,dodge_blocked=false,ignore_distance=false,history_use_id=null,on_card_use_committed=null,skill_initiator=null}={}){
    if(!this.can_sha_target(actor,target,{allow_allies:true})){this.view.emit(`${target?.name??'目标'}不能成为这张杀的目标。`);return {card_use_id:`rejected-use:${++this.card_use_counter}`,damage_events:[]};}
    this.record_sha_activity(actor);if(!forced){actor.used_sha_this_turn=true;actor.sha_count_this_turn++;if(this.turn_phase==='play'&&this.active_play_phase_id===actor.play_phase_id)actor.sha_count_this_play_phase=(actor.sha_count_this_play_phase??0)+1;}
    const physical_cards=this.physical_card_materials(source_card,use_provenance);const card_use_id=`use:${++this.card_use_counter}`;const damage_events=[];
    const phase_event_id=this.active_play_phase_id??null,phase_turn_id=this.turn_event_counter,counted_in_phase_quota=!forced&&this.is_own_play_phase(actor)&&phase_event_id===actor.play_phase_id;
    this.sha_phase_use_receipts[card_use_id]={actor_id:this.player_id(actor),phase_event_id,turn_id:phase_turn_id,counted:counted_in_phase_quota,exempted:false};
    on_card_use_committed?.({card_use_id,card_user:actor,source_card});
    // Hold real conversion costs across weapon prompts, response and every target.
    for(const material of physical_cards){const i=this.deck.discard_pile.indexOf(material);if(i>=0){this.deck.discard_pile.splice(i,1);this.processing_cards.push(material);}}
    try{
    const damage=1+actor.attack_bonus+(this.equipment_sha_turn_bonus?.(actor)??actor.wine_bonus)+this.sha_damage_bonus(actor,target);actor.wine_bonus=0;
    let nature=source_card?.type===CardType.FIRE_SHA?'fire':source_card?.type===CardType.THUNDER_SHA?'thunder':'normal';
    let prepared={source:actor,card_user:actor,kind:'sha',source_card,nature,amount:damage,damage,use_provenance,physical_cards,card_use_id,source_skill,parent_damage_event_id,dodge_blocked,ignore_distance};
    prepared=await this.equipment_prepare_sha?.(actor,prepared)??prepared;
    ({source_card,nature,use_provenance}=prepared);this.finalize_card_use_function(history_use_id,source_card);
    const useFace=this.card_use_history?.uses.find(row=>row.use_id===history_use_id)?.effective_metadata;
    const damage_card_identity={type:source_card?.type??CardType.SHA,name:source_card?.name??'杀',color:useFace?useFace.color:this.effective_color(source_card,actor),suit:useFace?useFace.suit:this.effective_suit(source_card,actor)};
    const targetCap=this.sha_target_cap(actor,source_last_hand&&actor.weapon?.trait==='last_hand_targets'?3:1);
    if(targetCap>1&&!additional_targets.length){
      const available=this.all_players().filter(p=>p!==target&&p!==actor&&p.alive&&this.can_sha_target(actor,p,{allow_allies:true})&&(ignore_distance||this.in_attack_range(actor,p)));
      if(actor.is_ai)additional_targets=available.filter(p=>this.side_of(p)!==this.side_of(actor)).slice(0,targetCap-1);
      else while(additional_targets.length<targetCap-1&&available.length){
        const options=[...available.map(p=>({id:this.seat_of(p),label:`追加目标：${p.name}`})),{id:'done',label:'完成目标选择'}];
        const choice=await this.view.ask_line(`选择杀的额外目标（至多${targetCap-1}名）`,{kind:'choice',player_id:this.seat_of(actor),options,meta:{equipment:source_last_hand&&actor.weapon?.trait==='last_hand_targets'?actor.weapon.name:null,skill:this.fire_public_state(actor)?.tianyi?.wins>0?'天义':targetCap===2?'侠胆':null,skill_id:this.fire_public_state(actor)?.tianyi?.wins>0?'sgs.tianyi':null,source_skill_id:this.fire_public_state(actor)?.tianyi?.wins>0?'sgs.tianyi':null,target_cap:targetCap,stage:'extra_targets',selected_seats:[target,...additional_targets].map(p=>this.seat_of(p))}});
        if(['done','cancel','0'].includes(choice))break;const chosen=available.find(p=>this.seat_of(p)===choice);if(chosen){additional_targets.push(chosen);available.splice(available.indexOf(chosen),1);}
      }
    }
    const order=this.action_order(),finalTargets=[...new Set([target,...additional_targets])].sort((a,b)=>order.indexOf(a)-order.indexOf(b));
    const guardUse=this.guard_use_context(actor,card_use_id,'sha',finalTargets),designated=[];
    // Commit all redirects and target identities before any response/damage.
    for(let branch=0;branch<finalTargets.length;branch++){
      let current=finalTargets[branch];if(!current.alive||!this.resolution_should_continue())continue;
      let redirectEvent={source:actor,card_user:actor,target:current,kind:'sha',damage_card_identity,source_card,nature,damage,amount:damage,use_provenance,physical_cards,card_use_id,branch_id:`${card_use_id}:branch:${branch}`,chenyu_allowed,attack_chain,source_skill,parent_damage_event_id,dodge_blocked,ignore_distance};
      if(!this.can_sha_target(actor,current,{allow_allies:true}))continue;
      redirectEvent=this.guard_redirect(redirectEvent,guardUse);if(redirectEvent.cancelled||redirectEvent.replayed)continue;current=redirectEvent.target;
      let targetWindowCounter=0;
      while(current.alive){
        const priorMaterials=this.skill_material_options(current).map(m=>m.card);let transfer=null;
        const window={...redirectEvent,target_window_id:`${redirectEvent.branch_id}:target:${++targetWindowCounter}`,closed:false,sgs_skill_receipts:{}};
        this.sha_target_stack.push(window);
        try{for(const hook of skill_hooks_for_hero(rule_hero(current))?.before_sha_target_response??[]){transfer=await hook(this,current,window);if(transfer)break;}}
        finally{window.closed=true;const i=this.sha_target_stack.indexOf(window);if(i>=0)this.sha_target_stack.splice(i,1);}
        if(!transfer?.target?.alive||transfer.target===current)break;
        if(['沉鱼','流离'].includes(transfer.transfer?.skill)&&(!priorMaterials.includes(transfer.transfer.cost)||this.skill_material_options(current).some(m=>m.card===transfer.transfer.cost)))throw Error('目标转移未消耗有效实体成本，终止无进展转移。');
        current=transfer.target;redirectEvent={...redirectEvent,target:current};
      }
      redirectEvent=this.guard_finalize({...redirectEvent,target:current},guardUse);if(redirectEvent.cancelled||redirectEvent.replayed)continue;
      const context={...redirectEvent,source:actor,card_user:actor,kind:'sha',method:'direct_card_effect',current_sha_target:current,source_card,nature,amount:damage,damage,use_provenance,physical_cards,card_use_id,armor_ignored:false,committed_card_effect:true};
      context.armor_ignored=!!this.equipment_ignores_armor?.(actor,context)||this.qibao_ignores_armor(actor,context);designated.push(context);
    }
    await this.dispatch_committed_sha_use({kind:'card_use',stage:'committed',card_use_id,history_use_id,card_user:actor,turn_id:phase_turn_id,phase_event_id,phase_owner_id:this.player_id(actor),effective_face:damage_card_identity,physical_cards,physical_material_ids:physical_cards.map(c=>this.card_history_material_id(c)),counted_in_phase_quota,closed:false});
    // H6 mixed-game order: finalize redirects, then aggregate protection, then
    // per-target offensive observers and effects. A cancelled target receives none.
    const protectedTargets=await this.dispatch_modern_card_targets({card_use_id,history_use_id,card_user:actor,card:source_card??{name:'杀',type:CardType.SHA},targets:designated.map(e=>e.target)});
    for(let i=designated.length-1;i>=0;i--)if(protectedTargets.cancelled_target_ids.includes(this.player_id(designated[i].target)))designated.splice(i,1);
    const designationEvent={kind:'sha',card_use_id,source_card,target_events:designated,source_skill};
    if(actor.alive)for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_sha_targets_designated??[]){
      const result=await hook(this,actor,designated.map(event=>event.target),designationEvent);
      for(const context of designated)if(result?.dodge_blocked_branch_ids?.includes(context.branch_id)||(result?.dodge_blocked_branch_ids==null&&result?.dodge_blocked_target_ids?.includes(this.player_id(context.target))))context.dodge_blocked=true;
    }
    for(const context of designated){
      const current=context.target;if(!current.alive||!this.resolution_should_continue())continue;
      await this.dispatch_sha_target_confirmed(context);
      if(!current.alive||!this.resolution_should_continue())continue;
      this.view.emit(`${actor.name}对${current.name}使用${virtual_source}，威力 ${this.source_damage_amount(actor,current,damage,'sha',actor)}。`);
      // Dead users finish the already committed card, but cannot initiate new
      // equipment costs or personal skills after death.
      if(actor.alive){await this.equipment_before_sha?.(actor,current,context);await this.youjian_on_sha_target?.(actor,current,context);}
      if(!current.alive||!this.resolution_should_continue())continue;
      let blocked=Boolean(context.dodge_blocked);if(actor.alive)for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_sha_target??[])blocked=(await hook(this,actor,current))||blocked;
      if(!current.alive||!this.resolution_should_continue())continue;
      if(this.yijiang_card_effect_invalid(current,source_card??{type:CardType.SHA,name:'杀'},context))continue;
      const result=await this.resolve_attack(actor,current,damage,{...context,dodge_blocked:blocked});if(result?.damage>0&&result.kind==='sha'&&!result.chain_transfer)damage_events.push(result);
    }return {card_use_id,damage_events};}finally{for(const material of physical_cards)this.finish_processing_card(material);}
  }
  async player_use_zhangba(actor,target,choice){
    if(actor.weapon?.trait!=='two_as_sha')return false;const parts=words(choice);if(parts.length!==3||!digits(parts[1])||!digits(parts[2]))return false;
    const first=+parts[1]-1,second=+parts[2]-1;if(first===second||first<0||second<0||first>=actor.hand.length||second>=actor.hand.length)return false;
    if(!this.can_use_sha(actor)){this.view.emit('本回合不能再使用杀。');return true;}
    if(!this.in_attack_range(actor,target)){this.view.emit(`距离不够。当前距离 ${this.distance_between(actor,target)}，武器距离 ${actor.weapon_range}。`);return true;}
    if(!this.can_sha_target(actor,target)){this.view.emit(`${target.name}无手牌，空城生效，不能对其出杀。`);return true;}
    const costs=[actor.hand[first],actor.hand[second]];if(!await this.consume_material_batch(actor,costs.map(card=>({zone:'hand',index:actor.hand.indexOf(card),card})),{to:'processing',reason:'两牌转杀'}))return false;try{if(actor.alive)await this.use_sha(actor,target,`${actor.weapon?.name??'武器'}转化的杀`,{source_card:this.two_card_sha(actor,costs),source_last_hand:actor.hand.length===0});}finally{for(const cost of costs)this.finish_processing_card(cost);}return true;
  }
  async player_use_active_skill(actor,target,hotkey,args){const skill=active_skill_by_hotkey(rule_hero(actor),hotkey);if(!skill){this.view.emit(`快捷键 ${hotkey.toUpperCase()} 未绑定技能。`);return true;}return await skill.player(this,actor,target,args);}
  parse_hand_indexes(args,actor){if(!args.length||!args.every(digits))return[];const indexes=args.map(v=>+v-1);return new Set(indexes).size===indexes.length&&indexes.every(i=>i>=0&&i<actor.hand.length)?indexes:[];}
  pop_hand_indexes(actor,indexes){return [...indexes].sort((a,b)=>b-a).map(i=>pop(actor.hand,i)).reverse();}
  async swap_all_hands(actor,target){return this.atomic_hand_exchange(actor,target,actor.hand.map((_,i)=>i),target.hand.map((_,i)=>i));}
  async swap_hand_cards(actor,target,actor_indexes,target_indexes){return this.atomic_hand_exchange(actor,target,actor_indexes,target_indexes);}
  async player_choose_hand_indexes(owner,count,{chooser=null}={}){
    if(owner.hand.length<count)return null;chooser??=this.player;
    while(true){this.view.emit(`\n选择${owner.name}的 ${count} 张手牌（编号空格分隔）：`);for(let i=0;i<owner.hand.length;i++)this.view.emit(`${i+1}. 手牌${i+1}（未知）`);
      const choice=await this.view.ask_line('输入编号：',{kind:'select_hand',player_id:this.seat_of(chooser),min_count:count,max_count:count,meta:{owner_seat:this.seat_of(owner)}}),parts=words(choice);
      if(parts.length!==count||!parts.every(digits)){this.view.emit(`请输入 ${count} 个有效编号。`);continue;}
      const indexes=parts.map(p=>+p-1);if(new Set(indexes).size!==count){this.view.emit('编号不能重复。');continue;}
      if(indexes.some(i=>i<0||i>=owner.hand.length)){this.view.emit('编号超出范围。');continue;}return indexes;
    }
  }
  async resolve_scroll(actor,target,card){if(card.name==='决斗'&&!this.can_duel_target(actor,target)){this.view.emit('目标不能成为决斗的目标。');return;}this.view.emit(`${actor.name}使用锦囊：${card.name}。`);const handler=SCROLL_REGISTRY[card.name];if(!handler){this.view.emit('这个锦囊暂时没有效果。');return;}for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_scroll_used??[])await hook(this,actor,target,card);if(actor.alive)await handler(this,actor,target,card);}
  async remove_target_card(actor,target){return await this.take_target_card(actor,target,'弃置');}
  async take_target_card(actor,target,action){
    const options=this.target_card_options(target),move={to:action==='获得'?'hand':'discard',recipient:actor,reason:action,action:action==='获得'?'obtain':'discard'};if(!options.length)return null;
    if(actor.is_ai){
      const friendly=this.side_of(actor)===this.side_of(target);
      const choices=friendly?options.filter(o=>o[0]==='judgment'):options.filter(o=>o[0]!=='judgment');
      if(!choices.length)return null;
      return this.pop_target_option(target,ai_choose_target_option(choices,this.rng),move);
    }
    if(options.length===1){this.view.emit(`自动选择唯一目标：${options[0][2]}`);return this.pop_target_option(target,options[0],move);}
    this.view.emit(`\n${target.name}可被${action}的牌：`);const opts=options.map((o,i)=>({id:String(i+1),label:o[2]}));for(const o of opts)this.view.emit(`${o.id}. ${o.label}`);
    while(true){const choice=await this.view.ask_line(`选择要${action}的对手牌编号：`,{kind:'select_target_card',options:opts,player_id:this.seat_of(actor)});if(digits(choice)&&+choice>=1&&+choice<=options.length)return this.pop_target_option(target,options[+choice-1],move);this.view.emit('请输入有效编号。');}
  }
  target_card_options(target){const labels=['武器','防具','-1马','+1马'],options=[];SLOTS.forEach((slot,i)=>{if(target[slot])options.push([slot,0,`${labels[i]}：${target[slot]}`,target[slot]]);});target.hand.forEach((_,i)=>options.push(['hand',i,`手牌${i+1}（未知）`,target.hand[i]]));target.judgment_cards.forEach((card,i)=>options.push(['judgment',i,`判定区：${this.effective_delayed_name(target,card)}（素材：${card}）`,card]));return options;}
  pop_target_option(target,[zone,index]){if(SLOTS.includes(zone)){const card=target[zone];target[zone]=null;if(!card)throw Error('目标装备已不存在');return card;}return pop(target.hand,index);}
  target_has_card(target){return target.hand.length>0||target.judgment_cards.length>0||SLOTS.some(slot=>!!target[slot]);}
  target_has_visible_equipment(target){return SLOTS.some(s=>target[s]!==null);}
  has_all_hand_as_sha(actor){return actor.shixian_active;}
  equipment_slot_card(player,slot){return SLOTS.includes(slot)?player[slot]:null;}
  clear_equipment_slot(player,slot){if(SLOTS.includes(slot))player[slot]=null;}
  normalize_equipment_slot(name){return {weapon:'weapon','武器':'weapon',w:'weapon',armor:'armor','防具':'armor',a:'armor',offensive_horse:'offensive_horse','进攻马':'offensive_horse','-1马':'offensive_horse',o:'offensive_horse',defensive_horse:'defensive_horse','防御马':'defensive_horse','+1马':'defensive_horse',d:'defensive_horse'}[name.trim().toLowerCase()]??null;}
  can_use_equipment_as_sha(actor,target,slot){return this.has_all_hand_as_sha(actor)&&this.can_use_sha(actor)&&this.in_attack_range(actor,target)&&this.can_sha_target(actor,target)&&this.equipment_slot_card(actor,slot)!==null&&this.can_pay_materials(actor,[{zone:slot,index:0,card:this.equipment_slot_card(actor,slot)}]);}
  async use_equipment_as_sha(actor,target,slot){const card=this.equipment_slot_card(actor,slot);if(!card)return false;const paid=await this.consume_material(actor,{zone:slot,index:0,card},{to:'processing',reason:'诗仙转换'});if(!paid)return false;try{if(actor.alive)await this.use_sha(actor,target,`诗仙·${card.name}当杀`,{source_card:this.material_sha(actor,card)});return true;}finally{this.finish_processing_card(card);}}
  async player_use_equipment_as_sha(actor,target,name){
    const slot=this.normalize_equipment_slot(name);if(!slot)return false;if(!this.has_all_hand_as_sha(actor)){this.view.emit('请先发动诗仙。');return true;}
    if(!this.equipment_slot_card(actor,slot)){this.view.emit('该装备位没有牌。');return true;}if(!this.can_use_sha(actor)){this.view.emit('本回合不能再使用杀。');return true;}
    if(!this.in_attack_range(actor,target)){this.view.emit(`距离不够。当前距离 ${this.distance_between(actor,target)}，武器距离 ${actor.weapon_range}。`);return true;}
    if(!this.can_sha_target(actor,target)){this.view.emit(`${target.name}无手牌，空城生效，不能对其出杀。`);return true;}return await this.use_equipment_as_sha(actor,target,slot);
  }
  has_shixian_playable(actor,target){if(!hero_has_capability(rule_hero(actor),'shixian')||!this.can_use_sha(actor)||!this.in_attack_range(actor,target))return false;return actor.hand.some(c=>!(c.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp))||SLOTS.some(s=>this.equipment_slot_card(actor,s)!==null);}
  can_continue_play_phase(actor,target){return (this.equipment_available_actions?.(actor)??[]).some(a=>a.available)||active_skills_for_hero(rule_hero(actor)).some(skill=>skill.owns_target_selection?skill.available?.(this,actor):this.alive_enemies(actor).some(foe=>skill.available?.(this,actor,foe)))||actor.hand.length>0||(this.has_all_hand_as_sha(actor)&&SLOTS.some(s=>this.can_use_equipment_as_sha(actor,target,s)));}
  show_shixian_equipment(actor){const labels=['weapon','armor','进攻马','防御马'];const options=SLOTS.flatMap((s,i)=>actor[s]?[`eq ${labels[i]} -> ${actor[s]}`]:[]);if(options.length)this.view.emit('诗仙装备可当杀：'+options.join('；'));}
  should_play_normal_effect(actor,target,card){
    if(this.can_use_red_as_tao(actor,card))return false;if(this.has_all_hand_as_sha(actor))return card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp;
    if(card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp)return true;if(card.type===CardType.WINE)return true;
    if(card.type===CardType.SCROLL&&card.name==='无懈可击')return false;
    if(card.type===CardType.SCROLL)return SCROLL_PLAY_CHECKS[card.name]?SCROLL_PLAY_CHECKS[card.name](this,actor,target):true;
    return is_sha_type(card.type)||[CardType.WEAPON,CardType.ARMOR,CardType.OFFENSIVE_HORSE,CardType.DEFENSIVE_HORSE].includes(card.type);
  }
  can_use_hand_as_sha(actor,target,card){return this.has_all_hand_as_sha(actor)&&!(card.type===CardType.TAO&&actor.hp<rule_hero(actor).max_hp)&&this.can_use_sha(actor)&&this.in_attack_range(actor,target)&&this.can_sha_target(actor,target);}
  can_sha_target(actor,target,{allow_allies=true}={}){return !this.sha_use_prohibited(actor)&&!!target?.alive&&target!==actor&&(allow_allies||this.alive_enemies(actor).includes(target))&&(target.hand.length>0||!skill_hooks_for_hero(rule_hero(target))?.immune_to_sha_without_hand);}
  can_duel_target(actor,target,{allow_allies=false}={}){return !this.nvquan_prohibits_duel(actor,target)&&!!target?.alive&&target!==actor&&(allow_allies||this.alive_enemies(actor).includes(target))&&(target.hand.length>0||!skill_hooks_for_hero(rule_hero(target))?.immune_to_duel_without_hand);}
  can_play(actor,target,card){
    const contextual=this.contextual_use_face(actor,card);if(contextual!==card)return this.can_use_sha(actor)&&this.in_attack_range(actor,target)&&this.can_sha_target(actor,target);
    // Preserve the classic human red-SHAN gate; AI/rescue retain their prior path.
    if(card.type!==CardType.SHAN&&this.can_use_red_as_tao(actor,card))return true;
    if(card.type===CardType.SCROLL&&card.name==='借刀杀人'&&!this.has_all_hand_as_sha(actor)&&(!target?.weapon||target===actor||!target.alive||!this.borrowed_victims(target).length))return false;
    if(card.type===CardType.SCROLL&&['手捧雷','画地为牢','兵粮寸断'].includes(card.name)&&!this.has_all_hand_as_sha(actor)&&!this.can_place_delayed(actor,target,card)){this.view.emit('该延时锦囊目标不合法。');return false;}
    if(card.type===CardType.SCROLL&&['釜底抽薪','过河拆桥','顺手牵羊'].includes(card.name)&&!this.has_all_hand_as_sha(actor)&&(!target?.alive||target===actor||!this.target_has_card(target)))return false;
    if(card.type===CardType.SCROLL&&card.name==='火攻'&&!this.has_all_hand_as_sha(actor)&&!target?.hand.length)return false;
    if(card.type===CardType.SHAN&&!this.can_use_hand_as_sha(actor,target,card)){this.view.emit('闪只能在被杀攻击时使用。');return false;}
    if(this.can_use_red_as_tao(actor,card))return true;
    if(this.should_play_normal_effect(actor,target,card)){
      if(card.type===CardType.SCROLL&&!this.can_trick_target(actor,target,card)){this.view.emit('控局：该目标目前不能成为此锦囊的目标。');return false;}
      if(card.type===CardType.SCROLL&&card.name==='决斗'&&!this.can_duel_target(actor,target)){this.view.emit('目标不能成为决斗的目标。');return false;}
      if(is_sha_type(card.type)){
        if(actor.prison_no_sha){this.view.emit('画地为牢中，不能使用杀。');return false;}
        if(!this.can_use_sha(actor)){this.view.emit('本回合不能再使用杀。');return false;}
        if(!this.in_attack_range(actor,target)){this.view.emit(`距离不够。当前距离 ${this.distance_between(actor,target)}，武器距离 ${actor.weapon_range}。`);return false;}
        if(!this.can_sha_target(actor,target)){this.view.emit(`${target.name}无手牌，空城生效，不能对其出杀。`);return false;}
      }
      if(card.type===CardType.SCROLL&&SCROLL_PLAY_CHECKS[card.name]&&!SCROLL_PLAY_CHECKS[card.name](this,actor,target)){
        this.view.emit(card.name==='顺手牵羊'?(this.is_immune_to_shunshou(target)?`${target.name}免疫顺手牵羊。`:`距离不够。当前距离 ${this.distance_between(actor,target)}，顺手牵羊距离 1。`):`${card.name}现在不能使用。`);return false;
      }
      if(card.type===CardType.WINE&&!this.can_use_offensive_wine(actor)){this.view.emit('普通酒每个回合只能使用一次。');return false;}
      if(card.type===CardType.TAO&&actor.hp>=rule_hero(actor).max_hp){if(this.can_use_hand_as_sha(actor,target,card))return true;this.view.emit('血量已满，不能使用桃。');return false;}return true;
    }
    if(this.can_use_hand_as_sha(actor,target,card))return true;this.view.emit(card.type===CardType.SHAN?'闪只能在被杀攻击时使用。':card.type===CardType.TAO?'血量已满，不能使用桃。':'这张牌现在不能主动使用。');return false;
  }
  can_use_sha(actor){return !this.sha_use_prohibited(actor)&&!actor.prison_no_sha&&(actor.weapon?.trait==='unlimited_sha'||this.sha_quota_used(actor)<this.get_max_sha_per_turn(actor));}
  get_max_sha_per_turn(actor){return this.sha_total_allowance(actor,skill_hooks_for_hero(rule_hero(actor))?.max_sha_per_turn??1);}
  distance_between(actor,target,options={}){
    const fixed=this.youjian_fixed_distance?.(actor,target);if(fixed!=null)return fixed;
    const seats=this.turn_order().filter(p=>p.alive),origin=actor._distance_origin??actor;
    const a=seats.indexOf(origin),b=seats.indexOf(target),delta=Math.abs(a-b);
    const base=a>=0&&b>=0?Math.min(delta,seats.length-delta):1;
    const horsePower=(player,slot)=>!player.equipment_disabled&&!player[`${slot}_disabled`]&&(!player[slot]?.content_pack||this.content_packs.includes(player[slot].content_pack))?(player[slot]?.power??0):0;
    const hooks=skill_hooks_for_hero(rule_hero(actor));
    const outgoing=(hooks?.outgoing_distance??[]).reduce((value,hook)=>value+hook(this,actor,target,options),0);
    return Math.max(1,base+(hooks?.distance_modifier??0)+outgoing-horsePower(actor,'offensive_horse')+horsePower(target,'defensive_horse'));
  }
  actual_attack_range(actor){return actor.weapon_range;}
  in_actual_attack_range(actor,target){return this.distance_between(actor,target)<=this.actual_attack_range(actor);}
  in_attack_range(actor,target){return this.distance_between(actor,target)<=this.sha_attack_range(actor);}
  can_use_shunshou(actor,target){return this.can_trick_target(actor,target,{type:CardType.SCROLL,name:'顺手牵羊'})&&!this.is_immune_to_shunshou(target)&&(skill_hooks_for_hero(rule_hero(actor))?.shunshou_no_distance_limit||skill_hooks_for_hero(rule_hero(actor))?.scroll_no_distance_limit||this.distance_between(actor,target)<=1);}
  is_immune_to_shunshou(player){return !!skill_hooks_for_hero(rule_hero(player))?.immune_to_shunshou;}
  async resolve_draw_phase(actor,target){
    this.turn_phase='before_draw';const drawAttempt=`draw-attempt:${++this.phase_window_counter}`;
    if(!actor.skip_draw_stage&&!actor.block_turn_draw){const drawWindow={event_id:`before-${drawAttempt}`,phase_event_id:drawAttempt,turn_id:this.turn_event_counter,closed:false,upcoming_phases:['draw']};for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_draw_phase??[])await hook(this,actor,target,drawWindow);}
    if(!actor.alive)return {skipped:false,replaced:false,count:0,interrupted:true};
    this.turn_phase='draw';const skipped=Boolean(actor.skip_draw_stage),blocked=Boolean(actor.block_turn_draw);let replaced=false,event=null;
    // Phase replacement occurs only in a genuinely entered draw phase, before
    // every normal draw-count modifier. A skipped/poison-blocked phase has none.
    if(!skipped&&!blocked){
      event={phase_event_id:`draw:${++this.draw_phase_event_counter}`,turn_id:this.turn_event_counter,actor,skipped:false,replaced:false};
      // Actual entry, after all whole-phase skip decisions and before draw replacements.
      for(const hook of skill_hooks_for_hero(rule_hero(actor))?.on_draw_phase_start??[]){
        await hook(this,actor,target,event);
        if(!actor.alive||!this.match_should_continue()||this.turn_actor!==this.seat_of(actor)||this.turn_event_counter!==event.turn_id){event.closed=true;return {skipped:false,replaced:false,count:0,interrupted:true};}
      }
      for(const hook of skill_hooks_for_hero(rule_hero(actor))?.replace_draw_phase??[]){
        if(await hook(this,actor,target,event)){replaced=true;event.replaced=true;break;}
        if(!actor.alive||!this.match_should_continue())return {skipped:false,replaced:false,count:0,interrupted:true};
      }
    }
    let count=skipped||replaced?0:await this.draw_count_for_turn(actor,target);
    const normalEvent=event&&!replaced?{...event,event_id:`normal-${event.phase_event_id}`,normal_draw:true,completed:false}:null;
    const normalCommitHooks=normalEvent?[...(skill_hooks_for_hero(rule_hero(actor))?.commit_normal_draw??[])]:[];
    const normalAfterHooks=normalEvent?[...(skill_hooks_for_hero(rule_hero(actor))?.after_normal_draw??[])]:[];
    if(normalEvent)for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_normal_draw??[])count=await hook(this,actor,target,count,normalEvent);
    if(normalEvent){
      if(!actor.alive||this.turn_actor!==this.seat_of(actor)||this.turn_event_counter!==normalEvent.turn_id)return {skipped:false,replaced:false,count:0,interrupted:true};
      for(const hook of normalCommitHooks)count=await hook(this,actor,target,count,normalEvent);
      count=Math.max(0,count);
    }
    if(skipped){this.record_phase_skip(actor,{phase_event_id:drawAttempt,phase:'draw'});actor.skip_draw_stage=false;this.view.emit(`${actor.name}跳过摸牌阶段。`);}
    if(count>0){await this.draw_cards(actor,count);this.view.emit(`${actor.name}摸了 ${count} 张牌。`);}
    else if(actor.block_turn_draw){actor.block_turn_draw=false;this.view.emit(`${actor.name}本回合不能摸牌。`);}
    if(normalEvent){normalEvent.completed=true;for(const hook of normalAfterHooks)await hook(this,actor,target,normalEvent);}
    return {skipped,replaced,count,phase_event_id:event?.phase_event_id??null};
  }
  async draw_count_for_turn(actor,target,{include_prepare=true}={}){
    if(actor.block_turn_draw)return 0;
    const modifiers=include_prepare?await this.trigger_on_turn_start(actor,target):0;let base=2;
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_draw_base??[])base=await hook(this,actor,target,{ordinary_base:base,modifiers,effective_count:Math.max(0,base+modifiers)});
    let count=base+modifiers;
    for(const hook of skill_hooks_for_hero(rule_hero(actor))?.before_draw??[])count=await hook(this,actor,target,count);
    return Math.max(0,count);
  }
  is_delayed_scroll(card){return card.type===CardType.SCROLL&&['手捧雷','画地为牢','兵粮寸断'].includes(card.name);}
  card_damage_bonus(actor,target,kind,card_user=null){return actor?(skill_hooks_for_hero(rule_hero(actor))?.card_damage_bonus??[]).reduce((n,hook)=>n+hook(this,actor,target,kind,card_user),0):0;}
  source_damage_amount(actor,target,amount,kind,card_user=null){let base=1;for(const hook of skill_hooks_for_hero(rule_hero(actor))?.card_damage_base??[])base=hook(this,actor,target,kind,card_user,base);return amount+(base-1)+this.card_damage_bonus(actor,target,kind,card_user);}
  sha_damage_bonus(actor,target){return (skill_hooks_for_hero(rule_hero(actor))?.sha_damage_bonus??[]).reduce((n,handler)=>n+handler(this,actor,target),0);}
  is_sha_unavoidable(actor,target){return (skill_hooks_for_hero(rule_hero(actor))?.sha_unavoidable??[]).some(h=>h(this,actor,target));}
  shans_required_to_dodge(actor,target){return (skill_hooks_for_hero(rule_hero(actor))?.shans_required_to_dodge??[]).reduce((n,h)=>Math.max(n,h(this,actor,target)),1);}
  pending_sha_damage(actor,target,base,context={}){const amount=this.source_damage_amount(actor,target,base,'sha',actor)+(this.equipment_sha_damage_bonus?.(actor,target,context)??0)+(this.youjian_sha_branch_bonus?.(context)??0);return this.equipment_modify_damage?this.equipment_modify_damage(target,amount,context):Math.max(0,amount-target.defense_bonus);}
  preview_sha_damage(actor,target,source_card=null){const context={kind:'sha',source_card,nature:source_card?.type===CardType.FIRE_SHA?'fire':source_card?.type===CardType.THUNDER_SHA?'thunder':'normal'};context.armor_ignored=!!this.equipment_ignores_armor?.(actor,context)||this.qibao_ignores_armor(actor,context);if(this.equipment_sha_immunity?.(actor,target,context))return 0;const amount=1+actor.attack_bonus+(this.equipment_sha_turn_bonus?.(actor)??actor.wine_bonus)+this.sha_damage_bonus(actor,target);for(const hook of skill_hooks_for_hero(rule_hero(target))?.prevents_damage_preview??[]){const prevented=hook(this,target,{...context,source:actor,target,damage:amount,amount});if(prevented&&typeof prevented.then==='function')throw Error('伤害预览防止检查必须同步');if(prevented)return 0;}return this.pending_sha_damage(actor,target,amount,context);}
  tao_heal_amount(actor){return 1+(skill_hooks_for_hero(rule_hero(actor))?.tao_heal_bonus??[]).reduce((n,h)=>n+h(this,actor),0);}
  find_card(player,type){return findIndex(player.hand,c=>c.type===type);}
  find_sha_card(player){return findIndex(player.hand,is_sha_card);}
  find_response_card(player,type){if(type===CardType.SHA&&this.sha_response_prohibited?.(player))return null;const direct=type===CardType.SHA?this.find_sha_card(player):this.find_card(player,type);if(direct!==null)return direct;if(skill_hooks_for_hero(rule_hero(player))?.response_sha_shan_swap){if(type===CardType.SHA)return this.find_card(player,CardType.SHAN);if(type===CardType.SHAN)return this.find_sha_card(player);}return null;}
  find_response_card_indexes(player,type){if(type===CardType.SHA&&this.sha_response_prohibited?.(player))return [];const swap=skill_hooks_for_hero(rule_hero(player))?.response_sha_shan_swap;return player.hand.flatMap((card,i)=>((type===CardType.SHA?is_sha_card(card):card.type===type)||(swap&&((type===CardType.SHA&&card.type===CardType.SHAN)||(type===CardType.SHAN&&is_sha_card(card)))))?[i]:[]);}
  find_card_by_name(player,name){return findIndex(player.hand,c=>c.name===name);}
  find_better_equipment(player){return findIndex(player.hand,c=>(c.type===CardType.WEAPON&&(!player.weapon||this.weapon_score(c)>this.weapon_score(player.weapon)))||(c.type===CardType.ARMOR&&(!player.armor||c.power>player.armor.power))||(c.type===CardType.OFFENSIVE_HORSE&&!player.offensive_horse)||(c.type===CardType.DEFENSIVE_HORSE&&!player.defensive_horse));}
  weapon_score(weapon){return weapon.range+weapon.power+({unlimited_sha:5,two_as_sha:4,dismount:3,follow_sha:3}[weapon.trait]??0);}
  async discard_from_hand(player,count,{reason=''}={}){
    for(let i=0;i<count;i++){
      if(!player.alive||!player.hand.length)return;if(player.is_ai){const index=ai_choose_discard(player),card=player.hand[index];await this.consume_material(player,{zone:'hand',index,card},{reason:reason||'弃牌阶段',action:'discard'});this.view.emit(reason?`${player.name}触发${reason}，弃置了 ${card}。`:`AI 弃置了 ${card}。`);continue;}
      this.show_hand(player);const options=player.hand.map((c,i)=>({id:String(i+1),label:String(c)}));const choice=await this.view.ask_line(`${reason?reason+'：':''}请选择弃置的牌编号：`,{kind:'discard',options,player_id:this.seat_of(player)});
      if(digits(choice)&&+choice>=1&&+choice<=player.hand.length){const index=+choice-1,card=player.hand[index];await this.consume_material(player,{zone:'hand',index,card},{reason:'弃置手牌',action:'discard'});this.view.emit(reason?`你因${reason}弃置了 ${card}。`:`你弃置了 ${card}。`);}
      else {this.view.emit('请输入有效编号。');i--;}
    }
  }
  async discard_down_to_hp(player){for(const hook of skill_hooks_for_hero(rule_hero(player))?.before_discard??[])if(await hook(this,player))return;let limit=this.hand_limit(player),fixedLimit=false;for(const hook of skill_hooks_for_hero(rule_hero(player))?.discard_limit_override??[]){const override=await hook(this,player,limit);if(override!=null){limit=override;fixedLimit=true;}}while(player.alive&&player.hand.length>(limit=fixedLimit?limit:this.hand_limit(player))){if(player.is_ai){const index=ai_choose_discard(player),card=player.hand[index];await this.consume_material(player,{zone:'hand',index,card},{reason:'弃牌阶段',action:'discard'});this.view.emit(`AI 弃置了 ${card}。`);continue;}
    this.show_hand(player);const options=player.hand.map((c,i)=>({id:String(i+1),label:String(c)}));const choice=await this.view.ask_line(`手牌数超过血量上限 ${limit}，请选择弃牌编号：`,{kind:'discard',options,player_id:this.seat_of(player)});
    if(digits(choice)&&+choice>=1&&+choice<=player.hand.length){const index=+choice-1,card=player.hand[index];await this.consume_material(player,{zone:'hand',index,card},{reason:'弃置手牌',action:'discard'});this.view.emit(`你弃置了 ${card}。`);}else this.view.emit('请输入有效编号。');}}
  hand_limit(player){if(player.yinren_active&&!player.sha_activity_in_own_play&&this.turn_phase==='discard'&&this.turn_actor===this.seat_of(player))return 20;return Math.max(0,player.hp)+(this.equipment_hand_limit_bonus?.(player)??0)+(skill_hooks_for_hero(rule_hero(player))?.hand_limit_bonus??[]).reduce((n,h)=>n+h(this,player),0);}
  show_status(show_ai_hand_count=false){for(const p of this.all_players()){
    const eq=`${p.weapon?`${p.weapon.name}/距${p.weapon_range}`:'无武器/距1'}/${p.armor?.name??'无防具'}/${p.offensive_horse?.name??'无-1马'}/${p.defensive_horse?.name??'无+1马'}`;
    this.view.emit(`${p===this.player?'你':p.name}：${rule_hero(p).display_name??rule_hero(p).name} HP ${Math.max(p.hp,0)}/${rule_hero(p).max_hp} 装备[${eq}]${p!==this.player&&show_ai_hand_count?` 手牌:${p.hand.length}`:''}${p.alive?'':'（阵亡）'}`);
  }}
  show_hand(player){this.view.emit('\n你的手牌：');this.view.emit('0. 结束出牌');for(const skill of this.active_skill_help(player))this.view.emit(skill);player.hand.forEach((c,i)=>this.view.emit(`${i+1}. ${c} - ${c.description}`));}
  active_skill_help(player){return active_skills_for_hero(rule_hero(player)).map(s=>`[${s.hotkey}] ${s.help_text}`);}
}
Object.assign(Game.prototype,youjianStabMethods,youjianTrickMethods,cardHistoryMethods,ninthRuntimeMethods,cardSemanticMethods,combatMethods,materialMethods,zoneMethods,trickMethods,equipmentMethods,derivedEquipmentMethods,youjianEquipmentMethods,youjianCardEventMethods,guardRuntimeMethods,seventhRuntimeMethods,eighthRuntimeMethods,followingRuntimeMethods,wangyunRuntimeMethods,wangyunSkillMethods,wangyunCardMethods,wangyunLifecycleMethods,fireRuntimeMethods,mountainRuntimeMethods,generalSkillRuntimeMethods,yijiangRuntimeMethods,yijiangFollowingRuntimeMethods);

// Hero equipment-loss skills observe the already-committed move AFTER the item
// itself. Preserve synchronous legacy calls when no such hook is installed.
const baseEquipmentLeave=Game.prototype.equipment_on_leave;
Game.prototype.equipment_on_leave=function(owner,card,context={}){
 const hooks=[...(skill_hooks_for_hero(rule_hero(owner))?.on_equipment_leave??[])];
 const result=baseEquipmentLeave.call(this,owner,context.equipment_face??card,context);
 if(!hooks.length)return result;
 const equipment_loss_id=context.equipment_loss_id??`equipment-loss:${++this.equipment_loss_counter}`;
 return Promise.resolve(result).then(async value=>{for(const hook of hooks)await hook(this,owner,card,{...context,equipment_loss_id,from_zone:context.slot,committed:true});return value;});
};

// History belongs to committed uses, not response or generic card movement.
const baseStartUse=Game.prototype.start_card_use;
Game.prototype.start_card_use=function(actor,card,options={}){
 if(is_sha_type(card?.type)&&this.sha_use_prohibited(actor))throw Error('当前回合不能使用杀');
 this.ensure_card_history_turn(actor);
 if(!options.history_use_id&&!options.sourceZones){const materials=options.materials??card.materials??(card.virtual?[]:[card]);options={...options,materials,sourceZones:materials.map(c=>actor.hand.includes(c)?'hand':SLOTS.find(slot=>actor[slot]===c)??(actor.judgment_cards.includes(c)?'judgment':actor.sgs_mountain_fields?.includes(c)?'field':this.processing_cards.includes(c)?'processing':this.deck.discard_pile.includes(c)?'discard_pile':'offboard'))};}
 return baseStartUse.call(this,actor,card,options);
};
const baseShaUse=Game.prototype.use_sha;
Game.prototype.use_sha=async function(actor,target,label='杀',options={}){
 if(!this.can_sha_target(actor,target,{allow_allies:true}))return baseShaUse.call(this,actor,target,label,options);
 const card=options.source_card??new Card('杀',CardType.SHA,{virtual:true,materials:[]});
 const scope=this.start_card_use(actor,card,{history_use_id:options.history_use_id,...(options.history_use_id?{}:{materials:this.physical_card_materials(card,options.use_provenance)})});
 try{return await baseShaUse.call(this,actor,target,label,{...options,source_card:card,history_use_id:scope.use_id});}finally{this.end_card_use(scope);}
};
const baseScrollUse=Game.prototype.resolve_scroll;
Game.prototype.resolve_scroll=async function(actor,target,card,options={}){
 if(!['五谷丰登','桃园结义'].includes(card.name)&&this.card_target_prohibited(actor,target,card,options)||options.recast||card.name==='无懈可击'||(!['五谷丰登','桃园结义'].includes(card.name)&&!options.trick_declaration_validated&&!this.can_trick_target(actor,target,card))||(card.name==='决斗'&&!this.can_duel_target(actor,target,options)))return baseScrollUse.call(this,actor,target,card,options);
 const scope=this.start_card_use(actor,card,{history_use_id:options.history_use_id});
 try{return await baseScrollUse.call(this,actor,target,card,options);}finally{this.end_card_use(scope);}
};

const baseLastOuterUse=Game.prototype.last_outer_card_use;
Game.prototype.last_outer_card_use=function(actor){
 const record=baseLastOuterUse.call(this,actor);if(!record)return null;
 const formed=this.card_history_function_overrides?.find(row=>row.use_id===record.use_id);
 return formed?{...record,declared_function:record.effective_function,effective_function:formed.effective_function}:record;
};

const baseWangyunTrickTarget=Game.prototype.can_trick_target;
Game.prototype.can_trick_target=function(actor,target,card){return baseWangyunTrickTarget.call(this,actor,target,card)&&(!WANGYUN_TRICK_BY_NAME[card?.name]||this.can_wangyun_trick_target(actor,target,card));};

const baseYoujianTrickTarget=Game.prototype.can_trick_target;
Game.prototype.can_trick_target=function(actor,target,card){
 if(!baseYoujianTrickTarget.call(this,actor,target,card))return false;
 const definition=youjian_trick_definition(card);if(!definition)return true;
 if(!actor?.alive||!target?.alive)return false;
 const origin=actor._distance_origin??actor;
 if(definition.name==='树上开花')return target===origin;
 if(definition.name==='刮骨疗毒')return target.hp<rule_hero(target).max_hp;
 if(target===origin)return false;
 if(definition.name==='趁火打劫')return target.hand.length>0;
 return (this.distance_between(actor,target)===1||this.youjian_trick_distance_allowed(actor,target,card))&&this.target_has_card(target);
};
Game.prototype.youjian_trick_distance_allowed=function(actor){return !!skill_hooks_for_hero(rule_hero(actor))?.scroll_no_distance_limit;};

Object.assign(Game.prototype,playPhaseMethods,yijiangNextRuntimeMethods);

Object.assign(Game.prototype,yijiangLaterRuntimeMethods);

Object.assign(Game.prototype,discardPhaseMethods);

Object.assign(Game.prototype,yijiangMoreRuntimeMethods);

Object.assign(Game.prototype,yijiangFurtherRuntimeMethods,followupRuntimeMethods);

Object.assign(Game.prototype,modernRuntimeMethods);

Object.assign(Game.prototype,yxsModernHuashengRuntimeMethods);

Object.assign(Game.prototype,zhangfenRuntimeMethods,zhangfenDamageMethods);

Object.assign(Game.prototype,liruRuntimeMethods);
