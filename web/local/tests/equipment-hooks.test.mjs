import test from 'node:test';
import assert from 'node:assert/strict';
import {equipmentMethods,equipment_effect,equipment_nature,equipment_two_card_sha_color} from '../equipment.mjs';
import {EQUIPMENT_CATALOG,EQUIPMENT_SOURCE_RECORDS,EQUIPMENT_SPECIAL_REGISTRY,EQUIPMENT_MODE_REGISTRY,EQUIPMENT_PENDING_REGISTRY,EQUIPMENT_CANONICAL_MAPPING,EQUIPMENT_ALIAS_TO_CANONICAL,equipment_definition,source_equipment_definition,canonical_equipment_definition,equipment_source_records} from '../equipment-catalog.mjs';
const gear = name => ({...EQUIPMENT_SOURCE_RECORDS.find(card => card.name === name || card.base_name === name),toString(){return this.name;}});
const card = (name='杀',color='黑') => ({name,type:name,color,suit:color==='红'?'红桃':'黑桃',toString(){return `${this.color}${this.name}`;}});
function player(name,gender='male') { return {name,hero:{gender,max_hp:4},hp:4,hand:[],judgment_cards:[],weapon:null,armor:null,offensive_horse:null,defensive_horse:null,is_ai:false,get alive(){return this.hp>0;},heal(n){const old=this.hp;this.hp=Math.min(this.hero.max_hp,this.hp+n);return this.hp-old;}}; }
function setup(answers=[]) {
 const a=player('甲'),b=player('乙','female'),logs=[],prompts=[],discard=[];
 const g={...equipmentMethods,view:{emit:x=>logs.push(x),async ask_line(message,options){prompts.push({message,...options});assert.ok(answers.length,`Unexpected prompt ${message}`);const answer=answers.shift();return typeof answer==='function'?answer({message,...options}):answer;}},seat_of:p=>p===a?'p1':'p2',draw_cards(p,n){p.hand.push(...this.deck.draw(n));},deck:{pile:[],draw(n){return this.pile.splice(0,n);},discard(cards){discard.push(...(Array.isArray(cards)?cards:[cards]));}}};
 return {g,a,b,logs,prompts,discard,answers};
}
test('source36 maps into20 complete mechanisms; source records never produce extra deck entities',()=>{
 assert.equal(EQUIPMENT_SOURCE_RECORDS.length,36);assert.equal(EQUIPMENT_CATALOG.length,20);
 assert.equal(new Set(EQUIPMENT_CATALOG.map(c=>c.id)).size,20);assert.equal(new Set(EQUIPMENT_SOURCE_RECORDS.map(c=>c.id)).size,36);
 assert.equal(new Set(EQUIPMENT_SOURCE_RECORDS.map(c=>c.mechanism_signature_key)).size,20);
 assert.ok(EQUIPMENT_SOURCE_RECORDS.every(c=>c.source_only&&!c.ordinary_deck));
 assert.ok(EQUIPMENT_CATALOG.every(c=>!c.source_only&&c.ordinary_deck&&c.merge_reason.physical_deck_copies===1));
 const horses=EQUIPMENT_SOURCE_RECORDS.filter(c=>c.base_name==='的卢');assert.deepEqual(horses.map(c=>c.type).sort(),['+1马','-1马']);assert.notEqual(horses[0].name,horses[1].name);
 assert.equal(EQUIPMENT_CATALOG.some(c=>['龙鳞甲','金鳞甲'].includes(c.name)),false);
 for(const c of EQUIPMENT_CATALOG){assert.ok(c.source_urls.length);assert.ok(c.source_variant);assert.ok(c.trait);assert.equal(c.power,c.type.includes('马')?1:0);assert.equal(equipment_definition(c),c);}
 assert.ok(EQUIPMENT_SPECIAL_REGISTRY.length>=29);assert.ok(EQUIPMENT_SPECIAL_REGISTRY.every(c=>!c.ordinary_deck));assert.ok(EQUIPMENT_PENDING_REGISTRY.every(c=>!c.ordinary_deck));assert.equal(EQUIPMENT_MODE_REGISTRY.length,5);assert.ok(EQUIPMENT_MODE_REGISTRY.every(c=>!c.ordinary_deck));
});
test('canonical representatives prefer YXS names only when complete mechanisms match',()=>{
 for(const [alias,canonical] of [['诸葛连弩','虎符'],['青釭剑','鱼肠剑'],['贯石斧','博浪锤'],['方天画戟','狼牙棒'],['麒麟弓','霸王弓'],['八卦阵','玉如意']]){
  const original=source_equipment_definition(alias),current=canonical_equipment_definition(alias);
  assert.equal(original.name,alias);assert.equal(current.name,canonical);assert.equal(EQUIPMENT_ALIAS_TO_CANONICAL[original.id],current.id);assert.ok(current.aliases.includes(alias));
  assert.equal(current.source_records.length,2);assert.equal(new Set(current.source_records.map(r=>r.mechanism_signature_key)).size,1);assert.ok(current.source_records.every(r=>r.source_urls.every(url=>current.source_urls.includes(url))));
 }
 const horses=EQUIPMENT_CATALOG.filter(c=>c.type.includes('马'));assert.deepEqual(horses.map(c=>[c.name,c.type,c.source_records.length]),[['乌骓','-1马',5],['蹑影','+1马',7]]);
});
test('machine signatures keep color, follow distance and discard-zone differences separate',()=>{
 for(const [left,right,field] of [['丈八蛇矛','芦叶枪','virtual_card'],['青龙偃月刀','盘龙棍','distance'],['寒冰剑','龙鳞刀','selection']]){
  const a=canonical_equipment_definition(left),b=canonical_equipment_definition(right);assert.notEqual(a.id,b.id);assert.notEqual(a.mechanism_signature_key,b.mechanism_signature_key);assert.notDeepEqual(a.mechanism_signature[field],b.mechanism_signature[field]);
 }
 for(const c of EQUIPMENT_CATALOG)for(const field of ['slot','attack_range','trigger','conditions','activation','cost','selection','targets','limits','distance','damage','armor','virtual_card','follow_up','compatibility'])assert.ok(Object.hasOwn(c.mechanism_signature,field),`${c.name}:${field}`);
 assert.equal(EQUIPMENT_CANONICAL_MAPPING.reduce((n,c)=>n+c.sources.length,0),36);
});
test('ambiguous historical Dilu lookup requires type or source ID and maps to correct canonical horse',()=>{
 assert.equal(equipment_source_records('的卢').length,2);assert.equal(source_equipment_definition('的卢'),null);assert.equal(canonical_equipment_definition('的卢'),null);
 assert.equal(canonical_equipment_definition('sgs.base.equipment.dilu').name,'蹑影');assert.equal(canonical_equipment_definition('yxs.base.equipment.dilu').name,'乌骓');
 assert.equal(canonical_equipment_definition({name:'的卢',type:'-1马'}).name,'乌骓');assert.equal(canonical_equipment_definition({name:'的卢',type:'+1马'}).name,'蹑影');
 assert.equal(source_equipment_definition('sgs.base.equipment.dilu').source_original_name,'的卢');
});
test('base equipment no flat attack bonus and distinct effect identifiers',()=>{
 for(const name of ['方天画戟','麒麟弓','霸王弓','寒冰剑','贯石斧'])assert.equal(gear(name).power,0);
 assert.equal(gear('方天画戟').trait,'last_hand_targets');assert.equal(gear('麒麟弓').range,5);assert.equal(gear('霸王弓').range,5);
 assert.equal(equipment_effect(gear('龙鳞刀')),'dragon_blade');assert.equal(equipment_effect(gear('玉如意')),'bagua');
});
test('renwang blocks black physical and elemental SHA only, not red/colorless or duels',()=>{
 const {g,a,b}=setup();b.armor=gear('仁王盾');
 for(const type of ['杀','血杀','毒杀','火杀','雷杀'])assert.equal(g.equipment_sha_immunity(a,b,{source_card:card(type)}),'仁王盾');
 for(const color of ['红','无色'])assert.equal(g.equipment_sha_immunity(a,b,{source_card:card('杀',color)}),null);
 assert.equal(g.equipment_card_immunity(a,b,{name:'决斗',type:'锦囊',color:'黑'}),null);
 assert.equal(g.equipment_sha_immunity(a,b,{source_card:card(),armor_ignored:true}),null);
 assert.equal(g.equipment_modify_damage(b,2),2);
});
test('vine immunity is card-level and explicit Jianghu blood/poison/AOE adaptation',()=>{
 const {g,a,b}=setup();b.armor=gear('藤甲');
 assert.equal(g.equipment_sha_immunity(a,b,{}),'藤甲');assert.equal(g.equipment_sha_immunity(a,b,{source_card:card()}),'藤甲');
 for(const type of ['血杀','毒杀','火杀','雷杀'])assert.equal(g.equipment_sha_immunity(a,b,{source_card:card(type)}),null);
 for(const name of ['南蛮入侵','烽火狼烟','万箭齐发'])assert.equal(g.equipment_card_immunity(a,b,{name,type:'锦囊'}),'藤甲');
 for(const name of ['决斗','火攻'])assert.equal(g.equipment_card_immunity(a,b,{name,type:'锦囊'}),null);
 assert.equal(g.equipment_sha_immunity(a,b,{armor_ignored:true}),null);
 assert.equal(g.equipment_modify_damage(b,1,{nature:'fire'}),2);assert.equal(g.equipment_modify_damage(b,1,{nature:'thunder'}),1);
 assert.equal(g.equipment_modify_damage(b,1,{nature:'fire',armor_ignored:true}),1);assert.equal(g.equipment_modify_damage(b,0,{nature:'fire'}),0);
});
test('silver lion caps each damage event at one and never subtracts one',()=>{
 const {g,b}=setup();b.armor=gear('白银狮子');for(const n of [0,1,2,4])assert.equal(g.equipment_modify_damage(b,n),Math.min(1,n));
 assert.equal(g.equipment_modify_damage(b,4,{armor_ignored:true}),4);b.armor={...gear('白银狮子'),power:99};assert.equal(g.equipment_modify_damage(b,1),1);
});
test('silver lion leaving heals a non-finalized former owner, including dying, with active armor',()=>{
 const {g,b}=setup();const lion=gear('白银狮子');b.hp=1;
 assert.equal(g.equipment_on_leave(b,lion,{slot:'hand'}),0);assert.equal(b.hp,1);
 assert.equal(g.equipment_on_leave(b,lion,{slot:'armor'}),1);assert.equal(b.hp,2);
 assert.equal(g.equipment_on_leave(b,lion,{slot:'armor',armor_disabled:true}),0);assert.equal(b.hp,2);
 b.hp=4;assert.equal(g.equipment_on_leave(b,lion,{slot:'armor'}),0);b.hp=0;assert.equal(g.equipment_on_leave(b,lion,{slot:'armor'}),1);assert.equal(b.hp,1);b.hp=0;b.dead=true;assert.equal(g.equipment_on_leave(b,lion,{slot:'armor'}),0);
});
test('only unknown synthetic fixtures retain old flat armor arithmetic',()=>{
 const {g,b}=setup();b.armor={name:'fixture',power:1};assert.equal(g.equipment_modify_damage(b,2),1);
 b.armor={name:'八卦阵',power:99};assert.equal(g.equipment_modify_damage(b,2),2);
});
test('double swords target chooses its hand discard before any dodge and never equipment',async()=>{
 const {g,a,b,discard,prompts}=setup(['activate','hand:2']);a.weapon=gear('雌雄双股剑');b.hand=[card('闪'),card('桃')];b.armor=gear('白银狮子');
 assert.equal(await g.equipment_before_sha(a,b),true);assert.equal(b.hand[0].name,'闪');assert.equal(discard[0].name,'桃');assert.ok(b.armor);assert.equal(a.hand.length,0);
 assert.deepEqual(prompts[1].options.map(o=>o.id),['hand:1','hand:2','draw']);assert.equal(prompts[1].player_id,'p2');assert.equal(prompts[1].meta.private_to,'p2');
});
test('double swords draw alternative and zero hand automatic choice; unknown gender never activates',async()=>{
 const x=setup(['activate','draw']);x.a.weapon=gear('雌雄双股剑');x.b.hand=[card('闪')];x.g.deck.pile=[card('桃')];await x.g.equipment_before_sha(x.a,x.b);assert.equal(x.a.hand.length,1);assert.equal(x.b.hand.length,1);
 const y=setup(['activate']);y.a.weapon=gear('雌雄双股剑');y.g.deck.pile=[card('桃')];await y.g.equipment_before_sha(y.a,y.b);assert.equal(y.a.hand.length,1);assert.equal(y.prompts.length,1);
 for(const gender of ['male',null,'unknown']){const z=setup();z.a.weapon=gear('雌雄双股剑');z.b.hero.gender=gender;assert.equal(await z.g.equipment_before_sha(z.a,z.b),false);assert.equal(z.prompts.length,0);}
});
test('ice sword can replace all wine damage and first loss heal completes before second selection',async()=>{
 const {g,a,b,discard}=setup(['replace','eq:armor',()=>{assert.equal(b.hp,3);return 'hand:1';}]);a.weapon=gear('寒冰剑');b.armor=gear('白银狮子');b.hand=[card('闪'),card('桃')];b.hp=2;
 assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:4,source_card:card()}),true);assert.equal(b.hp,3);assert.equal(discard.length,2);assert.equal(b.hand.length,1);assert.equal(b.armor,null);
});
test('ice sword rebuilds choices after first loss trigger including newly drawn cards',async()=>{
 const {g,a,b,discard}=setup(['replace']);a.weapon=gear('寒冰剑');b.hand=[card('闪')];let losses=0;
 g.on_equipment_cards_lost=async owner=>{losses++;if(losses===1)owner.hand.push(card('桃'));};
 assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:3}),true);assert.equal(discard.length,2);assert.equal(b.hand.length,0);assert.equal(losses,2);assert.equal(b.hp,4);
});
test('ice sword zero cards, judgment only, prevented or armor-immune attack never opens replacement',async()=>{
 const {g,a,b,prompts}=setup();a.weapon=gear('寒冰剑');b.judgment_cards=[card('兵粮寸断')];assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:2}),false);
 b.hand=[card('桃')];b.armor=gear('仁王盾');assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:2,source_card:card()}),false);
 b.armor=null;assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:0}),false);assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:2,prevented:true}),false);assert.equal(prompts.length,0);
});
test('dragon blade is distinct from ice sword and may discard actual judgment cards',async()=>{
 const {g,a,b,discard}=setup(['replace']);a.weapon=gear('龙鳞刀');b.judgment_cards=[card('兵粮寸断')];assert.equal(await g.equipment_replace_sha_damage(a,b,{damage:2}),true);assert.equal(b.judgment_cards.length,0);assert.equal(discard[0].name,'兵粮寸断');
});
test('axe atomic two-card cost excludes weapon, permits hand plus armor, healing before resume',async()=>{
 const {g,a,b,prompts,discard}=setup(['hand:1 eq:armor']);a.weapon=gear('贯石斧');a.hand=[card('闪')];a.armor=gear('白银狮子');a.hp=2;const weapon=a.weapon;
 let lossCalls=0;g.on_equipment_cards_lost=async(owner,cards)=>{lossCalls++;assert.equal(cards.length,2);assert.equal(owner.hand.length,0);assert.equal(owner.armor,null);assert.equal(owner.hp,3);};
 const context={damage:4,nature:'fire',source_card:card('火杀'),attack_id:'original'};const snapshot={...context};
 assert.equal(await g.equipment_after_dodge(a,b,context),true);assert.deepEqual(context,snapshot);assert.equal(a.weapon,weapon);assert.equal(discard.length,2);assert.equal(lossCalls,1);assert.equal(prompts[0].options.some(o=>o.id==='eq:weapon'),false);assert.equal(prompts[0].meta.select_count,2);
});
test('axe cannot activate with one card, cancel leaves all cards, invalid duplicate selection reprompts',async()=>{
 const x=setup();x.a.weapon=gear('贯石斧');x.a.hand=[card('闪')];assert.equal(await x.g.equipment_after_dodge(x.a,x.b),false);assert.equal(x.prompts.length,0);
 const y=setup(['hand:1 hand:1','cancel']);y.a.weapon=gear('贯石斧');y.a.hand=[card('闪'),card('桃')];assert.equal(await y.g.equipment_after_dodge(y.a,y.b),false);assert.equal(y.a.hand.length,2);assert.equal(y.discard.length,0);assert.equal(y.prompts.length,2);
});
test('axe cannot resume if simultaneous cost loss kills attacker and horse cost requires no new range check',async()=>{
 const x=setup(['hand:1 eq:offensive_horse']);x.a.weapon=gear('贯石斧');x.a.hand=[card('闪')];x.a.offensive_horse=gear('赤兔');x.g.in_attack_range=()=>{throw Error('must not revalidate range');};assert.equal(await x.g.equipment_after_dodge(x.a,x.b),true);
 const y=setup(['hand:1 hand:2']);y.a.weapon=gear('贯石斧');y.a.hand=[card('闪'),card('桃')];y.g.on_equipment_cards_lost=async()=>{y.a.hp=0;};assert.equal(await y.g.equipment_after_dodge(y.a,y.b),false);assert.equal(y.discard.length,2);
});
test('bagua and jade red virtual dodge, black failure, and armor-nullification',async()=>{
 for(const name of ['八卦阵','玉如意'])for(const color of ['红','黑']){const {g,b,discard}=setup(['activate']);b.armor=gear(name);g.deck.pile=[card('桃',color)];assert.equal(await g.equipment_try_bagua(b),color==='红');assert.equal(discard.length,1);assert.equal(b.hand.length,0);}
 const {g,b,prompts}=setup();b.armor=gear('八卦阵');assert.equal(await g.equipment_try_bagua(b,{armor_ignored:true}),false);assert.equal(await g.equipment_try_bagua(b,{dodge_blocked:true}),false);assert.equal(prompts.length,0);
});
test('bow horse removal optional, attacker picks either slot, occurs before HP and loss callbacks',async()=>{
 for(const name of ['麒麟弓','霸王弓']){const {g,a,b}=setup(['eq:offensive_horse']);a.weapon=gear(name);b.offensive_horse=gear('赤兔');b.defensive_horse=gear('绝影');g.on_equipment_cards_lost=async()=>assert.equal(b.hp,4);assert.equal(await g.equipment_before_sha_damage(a,b,{damage:1}),true);assert.equal(b.offensive_horse,null);assert.ok(b.defensive_horse);assert.equal(b.hp,4);}
 const x=setup(['cancel']);x.a.weapon=gear('霸王弓');x.b.offensive_horse=gear('赤兔');assert.equal(await x.g.equipment_before_sha_damage(x.a,x.b,{damage:1}),false);assert.ok(x.b.offensive_horse);
});
test('fan converts only ordinary SHA and never blood poison or thunder; retains material color',async()=>{
 const {g,a}=setup(['activate']);a.weapon=gear('朱雀羽扇');const original={source_card:card('杀','红'),damage:3};const converted=await g.equipment_prepare_sha(a,original);assert.equal(converted.nature,'fire');assert.equal(converted.source_card.type,'火杀');assert.equal(converted.source_card.color,'红');assert.equal(original.source_card.type,'杀');
 for(const name of ['血杀','毒杀','雷杀','火杀']){const context={source_card:card(name)};assert.equal(await g.equipment_prepare_sha(a,context),context);}
});
test('guding checks current empty hand only and never chain-transfer; armor-ignore scoped to attack',()=>{
 const {g,a,b}=setup();a.weapon=gear('古锭刀');assert.equal(g.equipment_sha_damage_bonus(a,b),1);b.hand=[card('闪')];assert.equal(g.equipment_sha_damage_bonus(a,b),0);b.hand=[];assert.equal(g.equipment_sha_damage_bonus(a,b,{chain_transfer:true}),0);
 for(const name of ['青釭剑','鱼肠剑']){a.weapon=gear(name);assert.equal(g.equipment_ignores_armor(a,{kind:'sha'}),true);assert.equal(g.equipment_ignores_armor(a,{kind:'duel'}),false);assert.equal(g.equipment_ignores_armor(a,{kind:'sha',chain_transfer:true}),false);}
});
test('two-card spear virtual colors preserve source differences and do not transfer blood/poison semantics',()=>{
 const {a}=setup();a.weapon=gear('丈八蛇矛');assert.equal(equipment_two_card_sha_color(a,[card('血杀','红'),card('毒杀','黑')]),'无色');assert.equal(equipment_two_card_sha_color(a,[card('桃','红'),card('闪','红')]),'红');
 a.weapon=gear('芦叶枪');assert.equal(equipment_two_card_sha_color(a,[card('血杀','红'),card('毒杀','黑')]),'红');assert.equal(equipment_two_card_sha_color(a,[card('桃'),card('闪')]),'黑');assert.throws(()=>equipment_two_card_sha_color(a,[card()]));
 assert.equal(equipment_nature({source_card:card('血杀')}),'normal');assert.equal(equipment_nature({source_card:card('雷杀')}),'thunder');
});
