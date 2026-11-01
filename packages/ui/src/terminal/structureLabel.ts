import type { TFunction } from 'i18next';
import type { StructureCheck } from '@venomous-snake/shared-types';

/** Learner-facing wording of a writing rule. */
export function structureLabel(t: TFunction, check: StructureCheck): string {
  const key = 'ui:terminal.structure';
  const count = 'min' in check ? (check.min ?? 1) : 1;
  switch (check.type) {
    case 'node': {
      const nodes = Array.isArray(check.node) ? check.node : [check.node];
      const what = nodes.map((node) => t(`${key}.nodes.${node}`)).join(' / ');
      return t(`${key}.${count > 1 ? 'node_many' : 'node'}`, { what, count });
    }
    case 'call':
      return t(`${key}.${count > 1 ? 'call_many' : 'call'}`, { name: check.name, count });
    case 'assign':
      return t(`${key}.assign`, { name: check.name });
    case 'import':
      return t(`${key}.import`, { name: check.module });
  }
}
