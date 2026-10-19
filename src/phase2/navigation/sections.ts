export type ProposalSectionId =
  | 'pregled'
  | 'dekoracia'
  | 'programa'
  | 'technika'
  | 'gostopriemstvo'
  | 'alternativi'
  | 'investicia';

export interface ProposalNavSection {
  id: ProposalSectionId;
  num: string;
  labelBg: string;
  children?: { id: string; labelBg: string }[];
}

export const PROPOSAL_SECTIONS: ProposalNavSection[] = [
  { id: 'pregled', num: '01', labelBg: 'Общ преглед' },
  {
    id: 'dekoracia',
    num: '02',
    labelBg: 'Декорация и сценография',
    children: [
      { id: 'dekor-vhod', labelBg: 'Входна зона' },
      { id: 'dekor-koktejl', labelBg: 'Коктейлна зона' },
      { id: 'dekor-foto', labelBg: 'Фото зона' },
      { id: 'dekor-koridor', labelBg: 'Златен коридор' },
      { id: 'dekor-gala', labelBg: 'Гала зала' },
      { id: 'dekor-scena', labelBg: 'Сцена' },
      { id: 'dekor-masi', labelBg: 'Декорация на масите' },
    ],
  },
  { id: 'programa', num: '03', labelBg: 'Развлекателна програма' },
  { id: 'technika', num: '04', labelBg: 'Техническо обезпечаване' },
  { id: 'gostopriemstvo', num: '05', labelBg: 'Гостоприемство и детайли' },
  { id: 'alternativi', num: '06', labelBg: 'Алтернативи' },
  { id: 'investicia', num: '07', labelBg: 'Инвестиция' },
];

const LEGACY_SECTION: Record<string, ProposalSectionId> = {
  '#/proposal/dekoracija': 'dekoracia',
  '#/proposal/alternativi': 'alternativi',
  '#/proposal/investicii': 'investicia',
};

export function sectionFromLegacyRoute(routePath: string): ProposalSectionId | null {
  return LEGACY_SECTION[routePath] ?? null;
}

export function parseProposalSection(rawHash: string): ProposalSectionId {
  const q = rawHash.includes('?') ? rawHash.slice(rawHash.indexOf('?') + 1) : '';
  const params = new URLSearchParams(q);
  const section = params.get('section') as ProposalSectionId | null;
  if (section && PROPOSAL_SECTIONS.some((s) => s.id === section)) return section;
  return 'pregled';
}

export function proposalHref(section: ProposalSectionId, sub?: string): string {
  const base = '#/proposal';
  const params = new URLSearchParams();
  if (section !== 'pregled') params.set('section', section);
  if (sub) params.set('sub', sub);
  const q = params.toString();
  return q ? `${base}?${q}` : base;
}
