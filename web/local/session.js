import {validate_conventional_config} from './release-scope.js';
/** Local single-player transport. Saves are deterministic input journals, not redacted view DTOs.
 * The seed plus every acknowledged prompt reconstructs full hidden hands, deck, RNG and
 * suspended async call stack. Each replay prompt and final boundary is verified.
 */
import {Game} from './game.js';
import {normalize_content_packs} from './content-packs.js';
import {HEROES,hero_by_id,canonical_hero_for_source} from './models.js';
import {serialize_match_state,card_to_dict} from './state.js';
export const SAVE_KEY='jh_browser_save_v2';
export const PREVIOUS_SAVE_KEY='jh_browser_save_v1';
export const ENGINE_VERSION='jianghu-browser-conventional-scope-1';
export const CONTENT_VERSION='jianghu-conventional-2026-10-16-a';
const clone=value=>JSON.parse(JSON.stringify(value));
function fingerprint(value){const string=JSON.stringify(value);let hash=2166136261;for(let i=0;i<string.length;i++){hash^=string.charCodeAt(i);hash=Math.imul(hash,16777619);}return (hash>>>0).toString(16).padStart(8,'0');}
function randomSeed(){const v=new Uint32Array(1);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(v);else v[0]=Date.now()>>>0;return v[0];}
const validHeroIndex=value=>value===null||(Number.isInteger(value)&&value>=0&&value<HEROES.length);
let createdMatchCounter=0;
const canonicalId=id=>id==null?null:(canonical_hero_for_source(id)?.id??id);
const indexOfId=id=>id==null?null:HEROES.findIndex(hero=>hero.id===canonicalId(id));
const matchConfig=config=>{
  validate_conventional_config(config);
  const hero_id=canonicalId(config.hero_id??HEROES[config.hero_index]?.id);
  const ai_hero_id=canonicalId(config.ai_hero_id??(config.ai_hero_index==null?null:HEROES[config.ai_hero_index]?.id));
  const ai2_hero_id=config.mode==='ai2'?canonicalId(config.ai2_hero_id??(config.ai2_hero_index==null?null:HEROES[config.ai2_hero_index]?.id)):null;
  return {content_packs:normalize_content_packs(config.content_packs??[]),hero_index:indexOfId(hero_id),hero_id,mode:config.mode,ai_hero_index:indexOfId(ai_hero_id),ai_hero_id,ai2_hero_index:indexOfId(ai2_hero_id),ai2_hero_id};
};
class Cancelled extends Error {}
export class LocalMatch {
  static isCurrentSave(save){return save?.version===2&&save?.engine_version===ENGINE_VERSION&&save?.content_version===CONTENT_VERSION;}
  static heroes(){return HEROES.map((h,index)=>({index,...h}));}
  constructor({onMessage=()=>{},onError=()=>{},storage=null}={}){
    this.onMessage=onMessage;this.onError=onError;this._storage=storage;this._epoch=0;this._waiters=[];this.pending=null;this.game=null;this._save=null;this._running=false;this.storageWarning=null;
  }
  _store(){return this._storage??globalThis.localStorage;}
  _notify(message){this.onMessage(message);}
  _warn(error){const message=error instanceof Error?error.message:String(error);this.onError(message);this._notify({type:'error',message});}
  hasSave(){try{return !!(this._store()?.getItem(SAVE_KEY)||this._store()?.getItem(PREVIOUS_SAVE_KEY));}catch{return !!this._save;}}
  clearSave(){this.close();this._save=null;try{this._store()?.removeItem(SAVE_KEY);}catch(error){this._warn('浏览器无法删除存档：'+error.message);return false;}return true;}
  exportSave(){return this._save?clone(this._save):null;}
  _validate(data){
    if(!data||data.version!==2||data.engine_version!==ENGINE_VERSION||data.content_version!==CONTENT_VERSION)throw new Error('版本已更新，请重新开局。旧存档未被删除。');
    if(!data.config||!canonical_hero_for_source(data.config.hero_id)||!['ai_hero_id','ai2_hero_id'].every(key=>data.config[key]===null||!!canonical_hero_for_source(data.config[key])))throw new Error('存档中的英雄标识无效，请重新开局。');
    const resolved=matchConfig(data.config);
    if(resolved.mode==='ai2'&&resolved.ai_hero_id!==null&&resolved.ai_hero_id===resolved.ai2_hero_id)throw new Error('1v2 的两个人机不能选择同一英雄，请重新开局。原存档已保留。');
    for(const key of ['hero_index','ai_hero_index','ai2_hero_index'])if(data.config[key]!==resolved[key])throw new Error('存档中的英雄标识与座位不一致，请重新开局。');
    if(!Number.isInteger(data.seed)||data.seed<0||data.seed>0xffffffff||!data.config||!Number.isInteger(data.config.hero_index)||data.config.hero_index<0||data.config.hero_index>=HEROES.length||!['ai','ai2'].includes(data.config.mode)||typeof data.game_id!=='string'||data.game_id.length>100||!Array.isArray(data.actions)||data.actions.length>100000)throw new Error('本地存档内容损坏，无法安全恢复。原存档已保留。');
    if(!validHeroIndex(data.config.ai_hero_index??null)||!validHeroIndex(data.config.ai2_hero_index??null))throw new Error('存档中的人机英雄配置无效，原存档已保留。');
    if(data.actions.some(a=>!a||typeof a.prompt_id!=='string'||typeof a.signature!=='string'||typeof a.value!=='string'||a.value.length>4096))throw new Error('本地存档操作记录损坏，原存档已保留。');
    if(data.checkpoint!==null&&data.checkpoint!==undefined&&typeof data.checkpoint!=='string')throw new Error('本地存档校验信息损坏。');
    return {...data,config:resolved};
  }
  async importSave(data){
    // Replay imported data in isolated storage before replacing a known-good save.
    const candidate=clone(this._validate(data)),items=new Map();
    const storage={getItem:key=>items.get(key)??null,setItem:(key,value)=>items.set(key,value),removeItem:key=>items.delete(key)};
    const staging=new LocalMatch({storage});staging._save=candidate;
    try{await staging._launch();}catch(error){staging.close();throw error;}
    const verified=staging.exportSave();staging.close();this.close();this._save=verified;this._persist();return await this._launch();
  }
  async create({hero_index=0,hero_id=undefined,mode='ai',ai_hero_index=null,ai_hero_id=undefined,ai2_hero_index=null,ai2_hero_id=undefined,content_packs=[],zhangfen_faces=null,seed=randomSeed()}={}){
    if(hero_id!==undefined)hero_index=indexOfId(hero_id);
    if(ai_hero_id!==undefined)ai_hero_index=indexOfId(ai_hero_id);
    if(ai2_hero_id!==undefined)ai2_hero_index=indexOfId(ai2_hero_id);
    if(!Number.isInteger(hero_index)||hero_index<0||hero_index>=HEROES.length)throw new Error('请选择有效英雄。');
    if(!['ai','ai2'].includes(mode))throw new Error('请选择 1v1 或 1v2 模式。');
    if(!validHeroIndex(ai_hero_index)||!validHeroIndex(ai2_hero_index))throw new Error('请选择有效的人机英雄，或选择随机。');
    content_packs=normalize_content_packs(content_packs);validate_conventional_config({zhangfen_faces});
    if(mode==='ai2'&&ai_hero_index!==null&&ai_hero_index===ai2_hero_index)throw new Error('1v2 的两个人机不能选择同一英雄，请选择不同英雄或随机。');
    this.close();this._save={version:2,engine_version:ENGINE_VERSION,content_version:CONTENT_VERSION,game_id:`local-${Date.now().toString(36)}-${(seed>>>0).toString(36)}-${(++createdMatchCounter).toString(36)}`,seed:seed>>>0,config:matchConfig({hero_index,mode,ai_hero_index,ai2_hero_index,content_packs}),actions:[],checkpoint:null,updated_at:new Date().toISOString()};
    this._persist();return await this._launch();
  }
  async resume(){
    this.close();let raw;
    try{raw=this._store()?.getItem(SAVE_KEY);}catch(error){this._warn('浏览器暂时无法读取存档：'+error.message);return false;}
    if(!raw){try{if(this._store()?.getItem(PREVIOUS_SAVE_KEY))this._warn('版本已更新，请重新开局。旧存档未被删除。');}catch{}return false;}
    try{this._save=this._validate(JSON.parse(raw));}catch(error){this._warn(error);return false;}
    try{await this._launch();return true;}catch{return false;}
  }
  _persist(){
    if(!this._save)return;
    this._save.updated_at=new Date().toISOString();
    try{const storage=this._store();if(!storage)throw new Error('当前环境不支持本地存储');storage.setItem(SAVE_KEY,JSON.stringify(this._save));this.storageWarning=null;}
    catch(error){const message='自动存档失败，请暂时不要刷新或关闭页面。浏览器可能禁用了存储或空间已满。';if(this.storageWarning!==message){this.storageWarning=message;this._warn(message);}}
  }
  _wait(){return new Promise((resolve,reject)=>this._waiters.push({resolve,reject}));}
  _boundary(error=null){for(const waiter of this._waiters.splice(0)){if(error)waiter.reject(error);else waiter.resolve(true);}}
  _state(){return {...serialize_match_state(this.game,{phase:this.game.winner?'finished':'playing',winner:this.game.winner}),turn_actor:this.game.turn_actor,turn_phase:this.game.turn_phase,recent_cards:this.game.deck.discard_pile.slice(-3).map(card=>card_to_dict(card)),config:matchConfig(this._save.config),save_status:this.storageWarning?'unavailable':'saved'};}
  snapshot(){
    if(!this.game)return null;const g=this.game;
    return clone({card_transaction_receipts:g.card_transaction_receipts,sgs_chenlin_state:g.sgs_chenlin_state,sgs_zhangfen_state:g.sgs_zhangfen_state,sgs_zhangfen_removed_cards:g.sgs_zhangfen_removed_cards,sgs_zhangfen_destroyed_cards:g.sgs_zhangfen_destroyed_cards,modern_target_events:g.modern_target_events,phase_skip_ledger:g.phase_skip_ledger,discard_category_history:g.discard_category_history,general_state_events:g.general_state_events,chain_event_counter:g.chain_event_counter,judgment_material_receipts:g.judgment_material_receipts,virtual_wine_receipts:g.virtual_wine_receipts,mandatory_discard_counter:g.mandatory_discard_counter,mandatory_discard_receipts:g.mandatory_discard_receipts,sha_phase_use_receipts:g.sha_phase_use_receipts,card_location_epochs:g.card_location_epochs,play_phase_receipts:g.play_phase_receipts,active_play_phase_id:g.active_play_phase_id,following_response_counter:g.following_response_counter,sgs_yijiang_runtime_state:g.sgs_yijiang_runtime_state,sgs_pojun_obligations:g.sgs_pojun_obligations,general_skill_effect_receipts:g.general_skill_effect_receipts,general_skill_cleanup_receipts:g.general_skill_cleanup_receipts,general_skill_ledger_state:g.general_skill_ledger_state,mountain_death_counter:g.mountain_death_counter,sgs_fire_assault_state:g.sgs_fire_assault_state,sgs_forest_aoe_state:g.sgs_forest_aoe_state,draw_phase_event_counter:g.draw_phase_event_counter,youjian_trick_state:g.youjian_trick_state,youjian_stab_state:g.youjian_stab_state,wangyun_state:g.wangyun_state,wangyun_card_state:g.wangyun_card_state,wangyun_weapon_uses:g.wangyun_weapon_uses,permanent_card_identities:g.permanent_card_identities,card_action_origins:g.card_action_origins,sgs_next_transfer_recovery_state:g.sgs_next_transfer_recovery_state,sgs_next_discard_assault_state:g.sgs_next_discard_assault_state,actual_turn_active:g.actual_turn_active,phase_window_counter:g.phase_window_counter,flip_event_counter:g.flip_event_counter,sgs_wind_state:g.sgs_wind_state,engine_version:ENGINE_VERSION,content_version:CONTENT_VERSION,content_packs:g.content_packs,end_phase_event_counter:g.end_phase_event_counter,active_end_phase_id:g.active_end_phase_id??null,recovery_event_counter:g.recovery_event_counter,recovery_event_receipts:g.recovery_event_receipts,hand_exchange_counter:g.hand_exchange_counter,sanjian_state:g.sanjian_state,judgment_event_counter:g.judgment_event_counter,judgment_stack:g.judgment_stack,damage_stack:g.damage_stack,sha_target_stack:g.sha_target_stack,sha_target_observer_receipts:g.sha_target_observer_receipts,card_use_history:g.card_use_history,card_history_use_counter:g.card_history_use_counter,card_history_material_counter:g.card_history_material_counter,card_history_materials:g.card_history_materials,card_history_stack:g.card_history_stack,card_history_native_uses:g.card_history_native_uses,card_history_function_overrides:g.card_history_function_overrides,copied_card_roles:g.copied_card_roles,copied_card_counter:g.copied_card_counter,rng_state:g.rng.state,card_move_counter:g.card_move_counter,card_move_receipts:g.card_move_receipts,youjian_card_event_receipts:g.youjian_card_event_receipts,youjian_equipment_receipts:g.youjian_equipment_receipts,equipment_entry_counter:g.equipment_entry_counter,yxs_sixth_guard_state:g.yxs_sixth_guard_state,yxs_sixth_card_uses:g.yxs_sixth_card_uses,seat_order_state:g.seat_order_state,turn_cursor_id:g.turn_cursor_id,round_step:g.round_step,yxs_queen_state:g.yxs_queen_state,pindian_counter:g.pindian_counter,pindian_receipts:g.pindian_receipts,pindian_batch_counter:g.pindian_batch_counter,pindian_batch_receipts:g.pindian_batch_receipts,xiadan_turn_modifiers:g.xiadan_turn_modifiers,xiadan_effect_receipts:g.xiadan_effect_receipts,xiadan_ai_plans:g.xiadan_ai_plans,hero_lifecycle_state:g.hero_lifecycle_state,hero_lifecycle_effect_receipts:g.hero_lifecycle_effect_receipts,hero_death_counter:g.hero_death_counter,equipment_loss_counter:g.equipment_loss_counter,yxs_eighth_state:g.yxs_eighth_state,mode:g.mode,round_no:g.round_no,damage_event_counter:g.damage_event_counter,dying_event_counter:g.dying_event_counter,card_use_counter:g.card_use_counter,response_event_counter:g.response_event_counter,turn_event_counter:g.turn_event_counter,play_phase_event_counter:g.play_phase_event_counter,offboard_cards:g.offboard_cards,derived_event_receipts:g.derived_event_receipts,derived_equipment_initialized:g.derived_equipment_initialized,dying_stack:g.dying_stack,winner:g.winner,turn_actor:g.turn_actor,turn_phase:g.turn_phase,players:g.player?g.all_players().map(p=>({...p,used_active_skills:[...p.used_active_skills].sort()})):[],draw_pile:g.deck.draw_pile,discard_pile:g.deck.discard_pile,processing_cards:g.processing_cards??[],response_stack:g.response_stack??[],prompt:this.pending?.prompt??null});
  }
  _checkpoint(prompt){const snap=this.snapshot();snap.prompt=prompt;return fingerprint(snap);}
  async _launch(){
    const epoch=++this._epoch,save=this._save;this._running=true;this._replayIndex=0;this._promptCount=0;this._replaying=save.actions.length>0||save.checkpoint!==null;this._expectedCheckpoint=save.checkpoint;this.events=[];this.pending=null;
    const check=()=>{if(epoch!==this._epoch)throw new Cancelled('已暂停');};
    const view={
      emit:(message,{event_type='log',...payload}={})=>{
        check();const event={type:event_type,message:String(message),payload};this.events.push(event);if(this.events.length>500)this.events.shift();
        if(!this._replaying)this._notify({type:'event',event});
      },
      ask_line:async(message,{kind='line',options=[],player_id='player',min_count=0,max_count=1,meta={}}={})=>{
        check();const prompt={prompt_id:`${save.game_id}:${++this._promptCount}`,kind,message,options:options.map((o,i)=>typeof o==='string'?{id:String(i+1),label:o}:o),player_id,min_count,max_count,meta};
        const signature=fingerprint({...prompt,prompt_id:undefined});
        if(this._replaying&&this._replayIndex<save.actions.length){
          const action=save.actions[this._replayIndex++];if(action.prompt_id!==prompt.prompt_id||action.signature!==signature)throw new Error('本地存档与当前规则不一致，恢复已停止，原存档已保留。');return action.value;
        }
        const checkpoint=this._checkpoint(prompt);
        if(this._replaying&&this._expectedCheckpoint&&this._expectedCheckpoint!==checkpoint)throw new Error('存档恢复校验失败，原存档已保留。请勿覆盖后重试。');
        this._replaying=false;save.checkpoint=checkpoint;this._persist();
        return await new Promise((resolve,reject)=>{
          this.pending={prompt,signature,resolve,reject};
          this._notify({type:'state',state:this._state()});this._notify({type:'prompt',prompt});this._boundary();
        });
      },
      ask_confirm:async(message,opts={})=>{
        while(true){const answer=(await view.ask_line(message,{...opts,kind:'confirm',options:[{id:'y',label:'是'},{id:'n',label:'否'}]})).toLowerCase();if(['y','yes','是','true','1'].includes(answer))return true;if(['n','no','否','false','0'].includes(answer))return false;view.emit('请输入 y 或 n。');}
      },
    };
    this.game=new Game(view,{seed:save.seed,content_packs:save.config.content_packs??[],match_id:save.game_id});
    this._notify({type:'session',session:{match_id:save.game_id,mode:save.config.mode,config:matchConfig(save.config),status:'playing',local:true}});
    const boundary=this._wait();
    this.completion=this.game.start({player_hero:hero_by_id(save.config.hero_id),ai_hero:save.config.ai_hero_id==null?null:hero_by_id(save.config.ai_hero_id),ai2_hero:save.config.mode==='ai2'&&save.config.ai2_hero_id!=null?hero_by_id(save.config.ai2_hero_id):null,mode:save.config.mode==='ai2'?'1v2':'1v1'}).then(()=>{
      check();if(this._replayIndex!==save.actions.length)throw new Error('存档包含无法恢复的多余操作。');
      const checkpoint=this._checkpoint(null);if(this._replaying&&this._expectedCheckpoint&&checkpoint!==this._expectedCheckpoint)throw new Error('终局存档校验失败，原存档已保留。');
      this._replaying=false;this._running=false;save.checkpoint=checkpoint;this._persist();this._notify({type:'state',state:this._state()});this._notify({type:'prompt',prompt:null});this._boundary();return this.game.winner;
    }).catch(error=>{if(error instanceof Cancelled)return null;this._running=false;this._warn(error);this._boundary(error);return null;});
    return await boundary;
  }
  async respond(prompt_id,value){
    if(!this.pending||this.pending.prompt.prompt_id!==prompt_id||!this._running)return false;
    const pending=this.pending;this.pending=null;
    const answer=String(value??'').trim();if(answer.length>4096){this.pending=pending;this._warn('输入太长，请重试。');return false;}
    this._save.actions.push({prompt_id,signature:pending.signature,value:answer});this._replayIndex=this._save.actions.length;this._save.checkpoint=null;this._persist();
    const boundary=this._wait();this._notify({type:'prompt',prompt:null});pending.resolve(answer);
    try{await boundary;return true;}catch{return false;}
  }
  close(){
    this._epoch++;this._running=false;const pending=this.pending;this.pending=null;if(pending)pending.reject(new Cancelled('已暂停'));this._boundary();
  }
}
