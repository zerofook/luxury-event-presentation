#!/usr/bin/env node
/** Set registry `textFree` for assets used on #/proposal (manual allowlist). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REGISTRY = path.join(ROOT, 'src/content/v4-asset-registry.json');

/** Assets shown in phase2 galleries / story / overview — verified photo-only or full clean renders. */
const TEXT_FREE = new Set([
  'v4_p04_crop_entrance_v1',
  'v4_p04_crop_entrance_v2',
  'v4_p04_crop_entrance_v3',
  'v4_p05_crop_entrance_hero_clean',
  'v4_p04_00_1536x1024',
  'v4_p06_crop_photowall_v1',
  'v4_p06_crop_photowall_v2',
  'v4_p06_crop_photowall_v3',
  'v4_p07_crop_photozone_orange',
  'v4_p07_crop_photozone_burgundy',
  'v4_p07_crop_photozone_ivory_wide',
  'v4_p08_00_1374x1145',
  'v4_p11_crop_cocktail_aerial_clean',
  'v4_p13_crop_guest_toast',
  'v4_p13_crop_led_wall_detail',
  'v4_p14_00_1134x680',
  'v4_p14_01_1134x680',
  'v4_p14_02_1134x680',
  'v4_p15_crop_corridor_hero',
  'v4_p17_crop_stage_hero',
  'v4_p17_crop_stage_decor_detail',
  'v4_p17_crop_stage_cake_reveal',
  'v4_p18_crop_hall_clean_left',
  'v4_p21_00_1851x849',
  'v4_p22_00_1659x948',
  'v4_p24_crop_centerpiece_v1',
  'v4_p24_crop_centerpiece_v2',
  'v4_p24_crop_centerpiece_v3',
  'v4_p32_crop_performer1',
  'v4_p32_crop_performer2',
  'v4_p32_crop_performer3',
  'v4_p32_crop_performer4',
  'v4_p33_crop_host_1',
  'v4_p33_crop_host_2',
  'v4_p33_crop_host_3',
  'v4_p33_crop_host_4',
  'v4_p34_crop_dance_show_dancers',
  'v4_p35_crop_mihaela_jazz_quartet',
  'v4_p35_crop_mihaela_with_dancers',
  'v4_p36_crop_cocktail_retro_car',
  'v4_p36_crop_gimme_gimme_cabaret',
  'v4_p36_crop_little_party_feathers',
  'v4_p36_crop_sway_feathers',
  'v4_p37_crop_cake_arrival',
  'v4_p37_crop_cake_cutting',
  'v4_p37_crop_countdown_22',
  'v4_p37_crop_toast',
  'v4_p38_crop_disco_ball_dancers',
  'v4_p39_crop_live_show_band_dancers',
  'v4_p40_crop_gipsy_kings',
  'v4_p40_crop_mihaela_marinova',
  'v4_p30_crop_hall_orange_stage',
  'v4_p30_crop_hall_orange_dining',
  'v4_p30_crop_hall_burgundy_stage',
  'v4_p30_crop_hall_burgundy_dining',
  'v4_n03_corridor_ivory',
  'v4_n04_corridor_burgundy',
  'v4_n05_corridor_terracotta',
]);

const reg = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
for (const a of reg.assets) {
  if (TEXT_FREE.has(a.id)) a.textFree = true;
  else if ('textFree' in a) delete a.textFree;
}
reg.generated = new Date().toISOString();
fs.writeFileSync(REGISTRY, JSON.stringify(reg, null, 2));
console.log(`annotate-v4-text-free: marked ${TEXT_FREE.size} assets textFree`);
