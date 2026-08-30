import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSyntheticPreviewProfile, syntheticPreviewAssetRoles, type SyntheticPreviewAssetRole } from '@/lib/preview/synthetic-preview';
import PublicHeader from '@/app/components/PublicHeader';
import PublicFooter from '@/app/components/PublicFooter';
import PublicProfileMedia from '@/app/components/PublicProfileMedia';

type ProfilePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = getSyntheticPreviewProfile(slug);
  if (!profile) return { title: 'Perfil no encontrado' };

  return {
    title: `${profile.displayName} | Acompañante VIP en ${profile.citySlugs.join(', ')} - PecadosVIP`,
    description: `Perfil de ${profile.displayName}, ${profile.age} años. Ficha de compañía privada en ${profile.citySlugs.join(', ')}.`,
  };
}

function selectedRole(raw: string | string[] | undefined): SyntheticPreviewAssetRole {
  return typeof raw === 'string' && syntheticPreviewAssetRoles.includes(raw as SyntheticPreviewAssetRole)
    ? (raw as SyntheticPreviewAssetRole)
    : 'cover';
}

export default async function ProfileDetailPage({ params, searchParams }: ProfilePageProps) {
  const { slug } = await params;
  const profile = getSyntheticPreviewProfile(slug);

  if (!profile) {
    notFound();
  }

  const query = await searchParams;
  const activeRole = selectedRole(query.foto);
  const activeMedia = profile.media.find((candidate) => candidate.role === activeRole) ?? profile.cover;

  return (
    <div className="public-page synthetic-preview-page synthetic-profile-page">
      <PublicHeader currentPath="/perfiles" />

      <main id="main-content" tabIndex={-1}>
        <nav className="synthetic-profile-breadcrumb px-6 py-4 text-xs" aria-label="Migas de pan">
          <a href="/perfiles" className="text-zinc-400 hover:text-amber-400">Catálogo de Perfiles</a>
          <span className="mx-2 text-zinc-600">/</span>
          <span className="text-amber-400 font-bold">{profile.displayName}</span>
        </nav>

        <article className="profile-detail synthetic-profile-detail" aria-labelledby="profile-detail-title">
          {/* Main Photo Gallery */}
          <section className="profile-detail-media synthetic-profile-media" aria-label={`Galería de ${profile.displayName}`}>
            <div className="profile-detail-image synthetic-profile-active-image overflow-hidden rounded-2xl border border-zinc-800">
              <PublicProfileMedia
                media={activeMedia}
                priority
                sizes="(max-width: 780px) 90vw, 52vw"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <nav className="synthetic-profile-thumbnails mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Seleccionar fotografía">
              {profile.media.map((candidate) => (
                <a
                  key={candidate.role}
                  aria-current={candidate.role === activeRole ? 'true' : undefined}
                  href={`/perfiles/${profile.slug}?foto=${candidate.role}`}
                  className={`relative block h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                    candidate.role === activeRole ? 'border-amber-400 scale-105' : 'border-zinc-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <PublicProfileMedia
                    media={{ ...candidate, alt: '' }}
                    sizes="80px"
                    preserveFullImage={false}
                  />
                </a>
              ))}
            </nav>
          </section>

          {/* Profile Bio & Details */}
          <div className="profile-detail-copy synthetic-profile-copy space-y-6">
            <div>
              <p className="public-eyebrow text-amber-400">Perfil Verificado</p>
              <h1 id="profile-detail-title" className="text-3xl font-extrabold text-zinc-100">{profile.displayName}</h1>
              <p className="synthetic-profile-summary text-sm text-zinc-400 mt-1">
                {profile.age} años · Cobertura en {profile.citySlugs.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' · ')}
              </p>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">{profile.biography}</p>

            <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs">
              <div>
                <dt className="text-zinc-500 font-medium">Estatura & Medidas</dt>
                <dd className="font-bold text-amber-400 mt-0.5">175 cm · 90-60-90</dd>
              </div>
              <div>
                <dt className="text-zinc-500 font-medium">Disponibilidad</dt>
                <dd className="font-bold text-emerald-400 mt-0.5">Disponible Ahora</dd>
              </div>
              <div>
                <dt className="text-zinc-500 font-medium">Modalidad</dt>
                <dd className="font-bold text-zinc-200 mt-0.5">Hotel y Domicilio</dd>
              </div>
              <div>
                <dt className="text-zinc-500 font-medium">Idiomas</dt>
                <dd className="font-bold text-zinc-200 mt-0.5">Español · Inglés</dd>
              </div>
            </dl>

            {/* Direct Contact Buttons */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Contacto Directo Privado:</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/34600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-zinc-100 hover:bg-emerald-500 transition shadow-lg"
                >
                  <span>💬</span> Contactar por WhatsApp
                </a>
                <a
                  href="https://t.me/pecadosvip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-xs font-bold text-zinc-100 hover:bg-sky-500 transition shadow-lg"
                >
                  <span>✈️</span> Contactar por Telegram
                </a>
                <a
                  href="tel:+34600000000"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-bold text-amber-400 hover:bg-amber-500/20 transition"
                >
                  <span>📞</span> Llamar
                </a>
              </div>
            </div>

            <a className="synthetic-profile-back block text-xs text-zinc-400 hover:text-amber-400 pt-4" href="/perfiles">
              ← Volver a todos los perfiles
            </a>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
