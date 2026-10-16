/** Trusted, ephemeral resolver brand. Never serialize this WeakMap and never
 * infer its authority from similarly named JSON properties on a hero object. */
const records=new WeakMap();
export function make_general_skill_descriptor(source_descriptor,projection){
  if(!source_descriptor||!projection||projection.source_hero_id!==source_descriptor.id
    ||typeof projection.legacy_intrinsics_enabled!=='boolean'||!Array.isArray(projection.skill_ids)
    ||!Array.isArray(projection.overlay_skill_ids))throw TypeError('Invalid trusted general skill projection');
  const descriptor=Object.freeze({...source_descriptor,id:projection.id,source_hero_id:projection.source_hero_id,
    max_hp:projection.max_hp,gender:projection.gender,lifecycle_template_id:projection.template_id,
    skill_ids:Object.freeze([...projection.skill_ids]),personal_lord_skill_ids:Object.freeze([...projection.personal_lord_skill_ids]),
    general_skill_binding_id:projection.general_skill_binding_id,general_skills_removed:!projection.legacy_intrinsics_enabled});
  records.set(descriptor,Object.freeze({source_descriptor,legacy_intrinsics_enabled:projection.legacy_intrinsics_enabled,
    skill_ids:Object.freeze([...projection.skill_ids]),overlay_skill_ids:Object.freeze([...projection.overlay_skill_ids])}));
  return descriptor;
}
export function get_general_skill_descriptor(descriptor){return descriptor&&typeof descriptor==='object'?records.get(descriptor)??null:null;}
