import test from 'node:test';
import assert from 'node:assert/strict';
import {HEROES,HERO_SOURCE_MERGES,hero_source_context,hero_by_id,Player} from '../models.js';
import {sgs_liaohua_source_faction,sgs_fuli_faction_projection} from '../sgs-next-liaohua-skills.js';
import {LocalMatch} from '../session.js';
test('all canonical SGS forms and merged source aliases retain their native faction context',()=>{
 for(const hero of HEROES){
  const actor=new Player('context',hero,true),projection=sgs_liaohua_source_faction(actor);
  if(hero.id.startsWith('sgs.')){const source=hero_source_context(hero);assert.ok(source,`${hero.id}: missing source resolver registration`);assert.equal(source.faction,hero.faction);assert.ok(source.faction?.trim());assert.equal(projection.faction,hero.faction);assert.equal(projection.basis,'effective_sgs_source');}
  else if(!(hero.source_id_aliases??[]).some(id=>id.startsWith('sgs.'))){assert.equal(projection.faction,'江湖');assert.equal(projection.basis,'neutral_jianghu_host_policy');}
 }
 for(const merge of HERO_SOURCE_MERGES.filter(row=>row.source_id.startsWith('sgs.'))){const hero=hero_by_id(merge.canonical_id),source=hero_source_context(hero,merge.source_id);assert.ok(source?.faction,`${merge.source_id}: merged source faction missing`);}
});
test('Cao Xiu and Liao Hua coexist in real public creation, saved state and identical replay',async()=>{
 const cao=HEROES.findIndex(h=>h.id==='sgs.adapted.base.hero.cao-xiu'),liao=HEROES.findIndex(h=>h.id==='sgs.adapted.base.hero.liao-hua');
 assert.ok(cao>=0&&liao>=0);
 const configs=[{hero_index:cao,mode:'ai2',seed:9},{hero_index:cao,ai_hero_index:liao,mode:'ai',seed:9},{hero_index:liao,ai_hero_index:cao,mode:'ai',seed:9}];
 for(const config of configs){const data=new Map(),errors=[],storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)},match=new LocalMatch({storage,onError:e=>errors.push(e)}),restored=new LocalMatch({storage,onError:e=>errors.push(e)});
  try{await match.create(config);assert.ok(match.pending);const before=match.snapshot();const projection=sgs_fuli_faction_projection(match.game);assert.ok(projection.actors.some(row=>row.effective_hero_id==='sgs.adapted.base.hero.cao-xiu'&&row.faction==='魏'));assert.equal(await restored.resume(),true);assert.deepEqual(restored.snapshot(),before);assert.deepEqual(errors,[]);}finally{match.close();restored.close();}
 }
});
