/** Shared hidden hand comparison, with an atomic multi-owner material commit.
 * This module is installed explicitly. It does not patch Game or register skills.
 * Pending private choices live only in runtime memory, never public receipts.
 */
import {is_youjian_poison} from './youjian-card-events.js';

const runtimes=new WeakMap();
const slots=['weapon','armor','offensive_horse','defensive_horse'];
const alive=p=>Boolean(p?.alive&&!p.dead);
const cardId=c=>c?.physical_id??c?.physicalCardId??c?.derived_identity??null;
const cardRecord=c=>({physical_id:cardId(c),name:c.name??null,type:c.type??null,suit:c.suit??null,rank:c.rank??null});
const runtime=g=>{let r=runtimes.get(g);if(!r)runtimes.set(g,r={compares:new Map(),batches:new Map(),requests:new Map(),batchRequests:new Map()});return r;};
const idValue=id=>{if((typeof id!=='string'&&typeof id!=='number')||String(id)===''||typeof id==='number'&&!Number.isFinite(id))throw Error('拼点需要稳定ID');return id;};
const keyOf=id=>JSON.stringify(idValue(id));
const nextId=(g,field,prefix)=>{const n=g[field]??0;if(!Number.isSafeInteger(n)||n<0||n===Number.MAX_SAFE_INTEGER)throw Error('拼点计数器无效');g[field]=n+1;return `${prefix}:${n+1}`;};
export const pindian_player_id=(game,player,dependencies={})=>idValue(dependencies.player_id?.(player)??game.player_id?.(player)??player?.player_id??game.seat_of?.(player));
const players=g=>g.all_players?.()??g.players??[];
const allCards=g=>[...(g.deck?.draw_pile??[]),...(g.deck?.discard_pile??[]),...(g.processing_cards??[]),...(g.offboard_cards??[]),
  ...players(g).flatMap(p=>[...(p.hand??[]),...(p.judgment_cards??[]),...slots.map(s=>p[s]).filter(Boolean)])];
const physicalUnique=(g,cards)=>{
  const all=allCards(g),ids=cards.map(cardId).filter(x=>x!==null);
  return new Set(cards).size===cards.length&&new Set(ids).size===ids.length&&cards.every(c=>c&&!c.virtual&&all.filter(x=>x===c||cardId(c)!==null&&cardId(x)===cardId(c)).length===1);
};
export function pindian_rank(card){
  const rank=typeof card?.rank==='string'?({A:1,J:11,Q:12,K:13}[card.rank.toUpperCase()]??Number(card.rank)):card?.rank;
  return Number.isInteger(rank)&&rank>=1&&rank<=13?rank:null;
}
export const pindian_hand_options=player=>(player?.hand??[]).flatMap((card,index)=>!card.virtual&&pindian_rank(card)!==null?[{id:`hand:${index+1}`,zone:'hand',index,card,label:`手牌${index+1}：${card}`}]:[]);
const requestMatches=(receipt,request)=>JSON.stringify(receipt.request)===JSON.stringify(request);
const pendingError=()=>Object.assign(Error('拼点未完成；必须恢复原协程或从输入日志重放，不能再次扣牌'),{code:'PINDIAN_PENDING_REPLAY_REQUIRED'});
function existing(g,kind,id,request){
  const receipts=g[kind==='compare'?'pindian_receipts':'pindian_batch_receipts']??={},key=keyOf(id),receipt=receipts[key];
  if(!receipt)return null;
  if(!requestMatches(receipt,request))throw Error('同一拼点事务ID不能替换人物、牌或规则');
  const pending=runtime(g)[kind==='compare'?'compares':'batches'].get(key);
  if(pending)return pending;
  if(receipt.status==='done')return Promise.resolve(receipt.result);
  throw pendingError();
}
const materialValid=(game,entry)=>players(game).includes(entry.owner)&&alive(entry.owner)&&entry.zone==='hand'&&Number.isInteger(entry.index)&&entry.index>=0&&entry.owner.hand?.[entry.index]===entry.card;

/** Exact multi-owner hand cost. All entries detach and reach processing in one
 * synchronous commit, BEFORE the first reveal, card-loss callback or rescue.
 * Never call single-owner public_card_loss sequentially to simulate this.
 * This primitive deliberately handles H only: it is not an equipment mover.
 */
export function commit_pindian_hand_loss(game,entries,{batch_id,compare_id=null,reason='拼点',on_committed=null,dependencies={}}={}){
  entries=Array.isArray(entries)?entries.map(e=>({...e})):[];
  const explicit=batch_id!=null;
  const receipts=game.pindian_batch_receipts??={};
  if(batch_id==null)do{batch_id=nextId(game,'pindian_batch_counter','pindian-cost');}while(Object.hasOwn(receipts,keyOf(batch_id)));
  const request={compare_id,reason,entries:entries.map(e=>({owner:pindian_player_id(game,e.owner,dependencies),zone:e.zone,index:e.index,card:cardRecord(e.card??{})}))};
  const priorRefs=runtime(game).batchRequests.get(keyOf(batch_id));
  if(priorRefs&&(priorRefs.length!==entries.length||priorRefs.some((e,i)=>e.owner!==entries[i]?.owner||e.card!==entries[i]?.card)))return Promise.reject(Error('同一拼点成本ID不能替换实体引用'));
  try{const prior=existing(game,'batch',batch_id,request);if(prior)return prior;}catch(error){return Promise.reject(error);}
  if(!Array.isArray(game.processing_cards)||!Array.isArray(game.deck?.discard_pile))return Promise.reject(Error('拼点缺少实际processing/弃牌区域'));
  if(explicit)nextId(game,'pindian_batch_counter','pindian-cost');
  const key=keyOf(batch_id),receipt=receipts[key]={batch_id,request,status:'pending',stage:'validate',committed:false,owners:[]};
  runtime(game).batchRequests.set(key,entries);
  const task=Promise.resolve().then(async()=>{
    const cards=entries.map(e=>e.card);
    if(!entries.length||entries.some(e=>!materialValid(game,e))||!physicalUnique(game,cards)){
      receipt.status='done';return receipt.result={committed:false,batch_id};
    }
    const owners=[...new Set(entries.map(e=>e.owner))];
    if(new Set(request.entries.map(e=>e.owner)).size!==owners.length)throw Error('不同成本主人必须具有不同稳定ID');
    const poisons=Boolean(game.youjian_events_enabled?.());
    if(poisons&&cards.some(is_youjian_poison)&&typeof game.lose_hp!=='function')throw Error('拼点毒牌缺少awaitable lose_hp');
    const snapshots=owners.map(owner=>({owner,hand_before:owner.hand.length,entries:entries.filter(e=>e.owner===owner),armor:Boolean(game.youjian_poison_armor_snapshot?.(owner,{reason})),
      poison:poisons?entries.filter(e=>e.owner===owner&&is_youjian_poison(e.card)):[]}));
    receipt.owners=snapshots.map(s=>({owner:pindian_player_id(game,s.owner,dependencies),loss_dispatched:false,poison_count:s.poison.length,poison_resolved:0,armor_snapshot:s.armor}));
    if(entries.some(e=>!materialValid(game,e))||!physicalUnique(game,cards)){receipt.status='done';return receipt.result={committed:false,batch_id};}
    // No hooks, logs, awaits, or externally supplied code in this block.
    for(const owner of owners)for(const e of entries.filter(e=>e.owner===owner).sort((a,b)=>b.index-a.index))owner.hand.splice(e.index,1);
    game.processing_cards.push(...cards);
    for(const snapshot of snapshots)snapshot.hand_after=snapshot.owner.hand.length;
    receipt.committed=true;receipt.result={committed:true,batch_id};receipt.stage='reveal';
    if(on_committed)await on_committed(receipt.result);
    for(const [i,s] of snapshots.entries()){
      const context={to:'processing',visibility:'public',reason,action:'pindian',compare_id,move_id:batch_id,zones:s.entries.map(()=> 'hand'),youjian_poison_armor_snapshot:s.armor};
      receipt.stage=`loss:${i}`;
      await game.after_cards_lost?.(s.owner,{...context,committed:true,hand_before:s.hand_before,hand_after:s.hand_after,materials:s.entries});
      await game.equipment_after_cards_lost?.(s.owner,s.entries.map(e=>e.card),context);
      receipt.owners[i].loss_dispatched=true;
      for(const [j,e] of s.poison.entries()){
        if(s.owner.dead)break;
        receipt.stage=`poison:${i}:${j}`;
        await game.lose_hp(s.owner,1,{...context,source:null,reason:'毒',kind:'poison_basic',source_card:e.card,
          poison_event_id:`${key}:owner:${i}:poison:${j+1}`,poison_index:j+1,poison_count:s.poison.length});
        receipt.owners[i].poison_resolved=j+1;
      }
    }
    receipt.status='done';receipt.stage='complete';return receipt.result;
  }).catch(error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>runtime(game).batches.delete(key));
  runtime(game).batches.set(key,task);return task;
}

/** AI receives its own cards and a public opponent summary, never target.hand. */
export function pindian_ai_card(options,_opponentPublic={}){
  return [...options].sort((a,b)=>pindian_rank(b.card)-pindian_rank(a.card)||a.index-b.index)[0]??null;
}
const publicPlayer=(game,player,dependencies)=>({player_id:pindian_player_id(game,player,dependencies),name:player.name??'',hp:player.hp??null,hand_count:player.hand?.length??0});
async function choosePrivate(game,owner,other,{compare_id,dependencies,forced_card,source_skill_id=null}){
  const options=pindian_hand_options(owner);if(!options.length)return null;
  if(forced_card)return options.find(o=>o.card===forced_card)??null;
  const publicOpponent=publicPlayer(game,other,dependencies);
  const choose=dependencies.choose_private;
  if(choose){
    const answer=await choose({owner,options,opponent:publicOpponent,compare_id,cancellable:false});
    if(answer===null||answer===undefined||answer==='timeout')return options[0];
    return options.find(o=>o===answer||o.card===answer?.card||o.id===answer)??options[0];
  }
  if(owner.is_ai)return pindian_ai_card(options,publicOpponent);
  if(typeof game.view?.ask_line!=='function')throw Error('拼点缺少私有选牌接口');
  while(true){
    const answer=await game.view.ask_line('拼点：选择一张手牌；双方锁定后同时亮牌',{
      kind:'choice',player_id:game.seat_of?.(owner)??publicPlayer(game,owner,dependencies).player_id,
      options:options.map(({id,label})=>({id,label})),meta:{skill:'拼点',skill_id:source_skill_id,source_skill_id,stage:'pindian_private_card',compare_id,private_to:game.seat_of?.(owner)??pindian_player_id(game,owner,dependencies),owner_id:pindian_player_id(game,owner,dependencies),mandatory:true,cancellable:false},
    });
    if(answer==null||answer==='timeout')return options[0];
    const selected=options.find(o=>o.id===String(answer)||String(o.index+1)===String(answer));
    if(selected)return selected;
    // Cancellation after target selection is not a refusal; request a legal card.
    game.view.emit?.('拼点必须选择一张手牌。',{private_to:game.seat_of?.(owner)??pindian_player_id(game,owner,dependencies)});
  }
}
function finishCards(game,cards){
  // A trigger may legitimately have moved a card elsewhere. Do not fabricate a
  // second copy or call discard on a material no longer owned by processing.
  for(const card of cards){const i=game.processing_cards.indexOf(card);if(i>=0){game.processing_cards.splice(i,1);game.deck.discard_pile.push(card);}}
}

/** disposition='retain' never leaves the hand and therefore never triggers loss
 * or poison. This supports a future special card; it does not implement it.
 * Replays return data receipts. Persisting a pending receipt is NOT continuation.
 */
export function resolve_pindian(game,actor,target,{compare_id,disposition='discard',reason='拼点',initiator_card=null,dependencies={},validate=null,on_result=null,source_skill_id=null}={}){
  if(source_skill_id!==null&&(typeof source_skill_id!=='string'||!source_skill_id))return Promise.reject(Error('拼点技能来源ID无效'));
  if(on_result!==null&&typeof on_result!=='function')return Promise.reject(Error('拼点结果回调必须为函数'));
  if(!['discard','retain'].includes(disposition))return Promise.reject(Error('未知拼点牌处置'));
  const explicit=compare_id!=null;
  const receipts=game.pindian_receipts??={};
  if(compare_id==null)do{compare_id=nextId(game,'pindian_counter','compare');}while(Object.hasOwn(receipts,keyOf(compare_id)));
  const request={actor:pindian_player_id(game,actor,dependencies),target:pindian_player_id(game,target,dependencies),turn_id:dependencies.turn_id?.()??game.turn_event_counter??0,disposition,reason,result_callback:Boolean(on_result),source_skill_id};
  if(actor!==target&&request.actor===request.target)return Promise.reject(Error('不同拼点人物必须具有不同稳定ID'));
  idValue(request.turn_id);
  const key=keyOf(compare_id),refs=runtime(game).requests.get(key);
  if(refs&&(refs.actor!==actor||refs.target!==target||refs.initiator_card!==initiator_card))return Promise.reject(Error('同一拼点ID不能替换原人物或预选牌引用'));
  try{const prior=existing(game,'compare',compare_id,request);if(prior){if(!refs&&initiator_card)return Promise.reject(Error('恢复结果查询不能带未核验的预选牌引用'));return prior;}}catch(error){return Promise.reject(error);}
  if(explicit)nextId(game,'pindian_counter','compare');
  const receipt=receipts[key]={compare_id,request,status:'pending',stage:'choose',committed:false};
  runtime(game).requests.set(key,{actor,target,initiator_card});
  const eligible=()=>actor!==target&&alive(actor)&&alive(target)&&players(game).includes(actor)&&players(game).includes(target)&&(actor.hand?.length??0)>0&&(target.hand?.length??0)>0&&(!validate||validate());
  const task=Promise.resolve().then(async()=>{
    const reject=()=>{receipt.status='done';receipt.stage='aborted';return receipt.result={committed:false,compare_id};};
    if(!eligible())return reject();
    const first=await choosePrivate(game,actor,target,{compare_id,dependencies,forced_card:initiator_card,source_skill_id});
    if(!first||!eligible())return reject();
    const second=await choosePrivate(game,target,actor,{compare_id,dependencies,source_skill_id});
    const entries=[first&&{owner:actor,...first},second&&{owner:target,...second}];
    if(!second||!eligible()||entries.some(e=>!materialValid(game,e))||!physicalUnique(game,entries.map(e=>e.card)))return reject();
    const cards=entries.map(e=>e.card),ranks=cards.map(pindian_rank);
    const result={committed:true,compare_id,disposition,actor:request.actor,target:request.target,
      cards:cards.map(cardRecord),original_ranks:ranks,final_ranks:[...ranks],outcome:ranks[0]>ranks[1]?'win':ranks[0]===ranks[1]?'tie':'loss',won:ranks[0]>ranks[1]};
    const reveal=()=>{
      receipt.committed=true;receipt.stage='revealed';receipt.result=result;
      game.view?.emit?.(`${actor.name}与${target.name}拼点：${cards[0]} / ${cards[1]}。${result.won?'发起者获胜':'发起者未赢'}。`,{event_type:'pindian_reveal',...result});
      return dependencies.on_reveal?.(result);
    };
    const settleResult=async()=>{if(!on_result)return;receipt.stage='result_effect';receipt.result_callback_status='pending';await on_result(result);receipt.result_callback_status='complete';};
    if(disposition==='retain'){await reveal();await settleResult();}
    else{
      try{
        const moved=await commit_pindian_hand_loss(game,entries,{batch_id:`${key}:cost`,compare_id,reason,on_committed:reveal,dependencies});
        if(!moved.committed)return reject();
        await settleResult();
      }finally{if(receipt.committed||game.pindian_batch_receipts[keyOf(`${key}:cost`)]?.committed)finishCards(game,cards);}
    }
    receipt.status='done';receipt.stage='complete';return result;
  }).catch(error=>{receipt.status='failed';receipt.error=String(error?.message??error);throw error;}).finally(()=>runtime(game).compares.delete(key));
  runtime(game).compares.set(key,task);return task;
}

// Callers with damage/reward effects may require compared cards to stay out of
// discard until the complete result effect finishes. Existing callers omit it.
resolve_pindian.result_callback_before_cleanup = true;
