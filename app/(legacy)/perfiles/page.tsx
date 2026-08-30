import type { Metadata } from 'next';
import { buildPublicMetadata } from '@/lib/seo';
import PublicHeader from '@/app/components/PublicHeader';
import PublicFooter from '@/app/components/PublicFooter';
import ProfileCard from '@/app/components/ProfileCard';
import { getSyntheticPreviewProfiles } from '@/lib/preview/synthetic-preview';

export const metadata: Metadata = buildPublicMetadata({
  path: '/perfiles',
  title: 'Catálogo de Perfiles VIP | PecadosVIP',
  description: 'Explora perfiles verificados de acompañantes VIP en Madrid, Barcelona y zonas de cobertura.',
});

export default function PerfilesPage() {
  const profiles = getSyntheticPreviewProfiles();

  return (
    <div className="public-page synthetic-preview-page">
      <PublicHeader currentPath="/perfiles" />

      <main id="main-content" tabIndex={-1} className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        <div className="synthetic-preview-section-heading">
          <p className="public-eyebrow">Exclusividad · Galería Verificada</p>
          <h1 className="text-3xl font-extrabold text-amber-400">Catálogo de Perfiles VIP</h1>
          <p className="text-sm text-zinc-400 mt-2">
            Perfiles seleccionados disponibles para atención privada en hoteles de lujo y domicilios.
          </p>
        </div>

        <div className="profile-grid synthetic-profile-grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.slug}
              profile={profile}
              preserveFullImage
              profileHref={`/perfiles/${profile.slug}`}
            />
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
