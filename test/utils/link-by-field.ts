/**
 * Links provided parents and children by specified relation fields.
 * @param parents Parents to link.
 * @param childrens Children to link.
 * @param parentField Parent identification field.
 * @param childField Child identification field.
 * @param link Callback used when link between parent and child has been found. 
 * It is meant to be used as a way to link two objects together. 
 * This however cannot be enforced - for example it might be only used as a notification that match has been found.
 * @returns Parents and children after all links have been performed.
 */
export default function linkByField<T0, T1>(
  parents: T0[],
  childrens: T1[],
  parentField: keyof T0,
  childField: keyof T1,
  link: (parent: T0, child: T1) => void
): [T0[], T1[]] {
  const map = new Map<unknown, T0>(
    parents.map(parent => [parent[parentField], parent])
  );

  childrens.forEach(child => {
    const parent = map.get(child[childField]);
    if (parent) link(parent, child);
  })

  return [parents, childrens];
}