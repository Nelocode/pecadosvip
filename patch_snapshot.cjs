const { readFileSync, writeFileSync } = require('fs');

let content = readFileSync('lib/content/runtime-snapshot.ts', 'utf8');

const profileInsert = `
    {
      id: "profile-valeria",
      slug: "valeria",
      displayName: "Valeria",
      age: 27,
      biography: "Concepto editorial ficticio de elegancia mediterránea.",
      measurements: {
        heightCentimeters: 170,
        weightKilograms: 55,
        chestCentimeters: 90,
        waistCentimeters: 60,
        hipsCentimeters: 90
      },
      languages: ["Español", "Inglés"],
      serviceIds: [],
      media: [
        {
          kind: "image",
          role: "cover",
          label: "Retrato",
          sourcePath: "assets/synthetic-profiles/valeria/cover/valeria-cover-v01.png",
          desktopUrl: "/preview-local-sintetico/media/valeria/cover",
          mobileUrl: "/preview-local-sintetico/media/valeria/cover",
          alt: "Valeria cover",
          order: 0
        },
        {
          kind: "image",
          role: "gallery-01",
          label: "Retrato",
          sourcePath: "assets/synthetic-profiles/valeria/gallery/valeria-gallery-01-v01.png",
          desktopUrl: "/preview-local-sintetico/media/valeria/gallery-01",
          mobileUrl: "/preview-local-sintetico/media/valeria/gallery-01",
          alt: "Valeria gallery",
          order: 1
        }
      ],
      availability: "available",
      citySlugs: ["madrid"],
      status: "published",
      approval: { state: "approved", approvedAt: "2026-08-27T00:00:00-05:00", approvedBy: "system" },
      adultAgeConfirmed: true,
      publicationConsentConfirmed: true,
      rightsConfirmed: true,
      createdAt: "2026-08-27T00:00:00-05:00",
      updatedAt: "2026-08-27T00:00:00-05:00",
      revision: 1
    }
`;

content = content.replace('profiles: [],', `profiles: [${profileInsert}],`);
writeFileSync('lib/content/runtime-snapshot.ts', content);
