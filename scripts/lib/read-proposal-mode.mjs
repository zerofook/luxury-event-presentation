import fs from 'node:fs';
import path from 'node:path';

/** @param {string} root */
export function isHtmlProposalEnabled(root) {
  const src = fs.readFileSync(path.join(root, 'src/config/proposalMode.ts'), 'utf8');
  return /SHOW_HTML_PROPOSAL\s*=\s*true/.test(src);
}

/** @param {string} root */
export function proposalPdfDistRel(root) {
  const src = fs.readFileSync(path.join(root, 'src/config/proposalMode.ts'), 'utf8');
  const m = src.match(/PROPOSAL_PDF_MEDIA_PATH\s*=\s*['"]([^'"]+)['"]/);
  if (!m) throw new Error('PROPOSAL_PDF_MEDIA_PATH not found in proposalMode.ts');
  return m[1];
}
