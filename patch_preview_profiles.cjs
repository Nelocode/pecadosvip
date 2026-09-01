const fs = require('fs');
let code = fs.readFileSync('lib/preview/synthetic-preview.ts', 'utf8');

const replacement = `
import { getRuntimeContentSnapshot } from '../content/runtime-snapshot.ts';

export function getSyntheticPreviewProfiles(): SyntheticPreviewProfile[] {
  const cmsProfiles = getRuntimeContentSnapshot().profiles.map(p => ({
    slug: p.slug,
    name: p.displayName,
    age: p.age ?? 18,
    biography: p.biography,
    measurements: p.measurements,
    languages: p.languages,
    citySlugs: p.citySlugs,
    availability: p.availability,
    syntheticNotice: 'Perfil CMS',
    conceptTags: ['CMS'],
    media: p.media.map(m => ({
      role: (m.role || 'gallery-01'),
      label: m.label || '',
      url: m.desktopUrl || '',
      alt: m.alt || ''
    }))
  }));
  return [previewProfiles[0], ...cmsProfiles].map((c) => structuredClone(c));
}
`;

code = code.replace(/export function getSyntheticPreviewProfiles\(\): SyntheticPreviewProfile\[\] \{\n  return previewProfiles\.map\(\(candidate\) => structuredClone\(candidate\)\);\n\}/, replacement);

fs.writeFileSync('lib/preview/synthetic-preview.ts', code);
