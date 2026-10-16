export const CAO_CAO_RULE_ID='yxs.adapted.base.hero.cao-cao';
export function yxs_ninth_skill_definitions({SkillHooks,ActiveSkillDef}){
 const skill=new ActiveSkillDef({skill_id:'奸雄',hotkey:'q',button_label:'奸雄',help_text:'奸雄：每回合一次，以手牌或装备区一张牌复制本回合本人前一张合格用牌功能。素材花色点数保留，重新选目标和检验杀次数/距离。',arg_mode:'none',player:(g,a,t,args=[])=>args.length?false:g.use_jianxiong(a),ai:(g,a)=>g.use_jianxiong(a),available:(g,a)=>g.jianxiong_available(a)});
 skill.owns_target_selection=true;skill.targets=(g,a)=>g.all_players().filter(p=>p.alive);
 return {hooks:{[CAO_CAO_RULE_ID]:SkillHooks({})},active:{[CAO_CAO_RULE_ID]:[skill]}};
}
