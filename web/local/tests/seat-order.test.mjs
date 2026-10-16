import test from 'node:test';
import assert from 'node:assert/strict';
import {create_seat_order,validate_seat_order,ensure_seat_order,seat_player_id,swap_seats,seat_index,next_seat_actor,seat_distance,snapshot_seat_order,seat_order_players} from '../seat-order.js';

test('stable identity ring rejects empty, duplicate, object and non-finite IDs',()=>{
 for(const value of [[],['a','a'],['a',{}],['a',NaN],['a','']])assert.throws(()=>create_seat_order(value));
 assert.deepEqual(create_seat_order(['a',2]).order,['a',2]);
 assert.throws(()=>validate_seat_order({...create_seat_order(['a']),direction:'clockwise'}));
});
test('counterclockwise next actor starts at current actor NEW position, skipping old next',()=>{
 const s=create_seat_order(['queen','old-next','target']);
 assert.equal(next_seat_actor(s,'queen'),'old-next');
 swap_seats(s,'queen','target',{event_id:'swap-1'});
 assert.deepEqual(s.order,['target','old-next','queen']);
 assert.equal(next_seat_actor(s,'queen'),'target');
 assert.equal(seat_index(s,'queen'),2);
});
test('swap changes positions but never IDs, objects, cards, role or controller',()=>{
 const players=['p1','p2','p3'].map((player_id,i)=>({player_id,name:`P${i}`,hand:[{secret:i}],controller:`c${i}`,team:i===0?'a':'b',alive:true}));
 const g={players,all_players(){return players;}};const original=[...players],hands=players.map(p=>p.hand);
 const s=ensure_seat_order(g);swap_seats(s,'p1','p3',{event_id:1});
 assert.deepEqual(seat_order_players(g),[players[2],players[1],players[0]]);
 assert.deepEqual(players,original);players.forEach((p,i)=>{assert.equal(p.hand,hands[i]);assert.equal(p.controller,`c${i}`);assert.equal(seat_player_id(g,p),`p${i+1}`);});
});
test('living filtering skips dead slots and retains sole surviving actor',()=>{
 const s=create_seat_order(['a','b','c','d']);
 assert.equal(next_seat_actor(s,'a',{living_ids:['a','c']}),'c');
 assert.equal(next_seat_actor(s,'a',{living_ids:['a']}),'a');
 assert.equal(next_seat_actor(s,'b',{living_ids:['a','c']}),'c');
 assert.equal(next_seat_actor(s,'a',{living_ids:[]}),null);
});
test('live ring distance changes after swap, removes dead interiors, and does not invent endpoints',()=>{
 const s=create_seat_order(['a','b','c','d','e']);
 assert.equal(seat_distance(s,'a','b'),1);assert.equal(seat_distance(s,'a','c'),2);
 swap_seats(s,'b','c',{event_id:1});assert.equal(seat_distance(s,'a','b'),2);assert.equal(seat_distance(s,'a','c'),1);
 assert.equal(seat_distance(s,'a','b',{living_ids:['a','b','e']}),1);
 assert.equal(seat_distance(s,'a','b',{living_ids:['a','e']}),null);
 assert.equal(seat_distance(s,'a','a'),0);assert.throws(()=>seat_distance(s,'missing','a'));
});
test('a started action queue keeps its snapshot; later queues use new ring',()=>{
 const s=create_seat_order(['a','b','c','d']),old=snapshot_seat_order(s,{from_id:'b'});
 swap_seats(s,'b','d',{event_id:'move'});
 assert.deepEqual(old.order,['b','c','d','a']);assert.equal(old.revision,0);
 assert.deepEqual(snapshot_seat_order(s,{from_id:'b',include_origin:false}).order,['a','d','c']);
 assert.deepEqual(snapshot_seat_order(s,{from_id:'b',living_ids:['b','a']}).order,['b','a']);
});
test('self swap is paid by caller but no displacement/revision; repeating receipt never swaps again',()=>{
 const s=create_seat_order(['a','b','c']),first=swap_seats(s,'a','a',{event_id:'self'});
 assert.equal(first.changed,false);assert.equal(s.revision,0);
 const swap=swap_seats(s,'a','c',{event_id:'move'});assert.equal(s.revision,1);
 assert.equal(swap_seats(s,'a','c',{event_id:'move'}),swap);assert.equal(s.revision,1);
 assert.throws(()=>swap_seats(s,'a','b',{event_id:'move'}),/cannot be reused/);
});
test('completed seat receipts survive JSON roundtrip and do not revert later swaps',()=>{
 let s=create_seat_order(['a','b','c']);const original=swap_seats(s,'a','c',{event_id:'1'});
 swap_seats(s,'b','c',{event_id:'2'});s=JSON.parse(JSON.stringify(s));
 const order=[...s.order];assert.deepEqual(swap_seats(s,'a','c',{event_id:'1'}),original);assert.deepEqual(s.order,order);
 assert.equal(s.revision,2);
});
test('roster and identity migration is explicit, never silently reset because someone died',()=>{
 const players=[{player_id:'a',alive:true},{player_id:'b',alive:true}],g={players};
 const s=ensure_seat_order(g);players[1].alive=false;assert.equal(ensure_seat_order(g),s);
 assert.deepEqual(seat_order_players(g,{living_only:true}),[players[0]]);
 players[1].player_id='changed';assert.throws(()=>ensure_seat_order(g),/migration/);
});
test('two-seat swap preserves opponent as next actor and distance 1',()=>{
 const s=create_seat_order(['a','b']);swap_seats(s,'a','b',{event_id:'1v1'});
 assert.equal(next_seat_actor(s,'a'),'b');assert.equal(seat_distance(s,'a','b'),1);
});
