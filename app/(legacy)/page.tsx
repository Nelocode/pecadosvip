import SyntheticFiligree from "../components/SyntheticFiligree";

/* eslint-disable @next/next/no-html-link-for-pages -- Vinext 1.0.0-beta.3 client navigation throws at runtime; native links are the verified fallback. */
import { queryPublicProfiles } from '../../lib/content/public-profiles';
import { getRuntimeContentSnapshot } from '../../lib/content/runtime-snapshot';
import { buildPublicMetadata } from '../../lib/seo';
import ProfileCard from '../components/ProfileCard';
import ProvisionalNotice from '../components/ProvisionalNotice';
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import ReleaseHoldingPage from '../components/ReleaseHoldingPage';
import { getRuntimeVisibilityState } from '../../lib/content/runtime-publication';

export const metadata = buildPublicMetadata({
  path: '/',
  title: 'PecadosVip | Madrid y Barcelona',
  description:
    'Proyecto de compañía privada con desplazamiento a hoteles y domicilios en Madrid y Barcelona.',
});

export default function Home() {
  if (!getRuntimeVisibilityState().renderPublicExperience) {
    return <ReleaseHoldingPage />;
  }

  const profiles = queryPublicProfiles(getRuntimeContentSnapshot(), {
    page: 1,
    pageSize: 4,
  });

  return (
    <div className="public-page">
      <PublicHeader currentPath="/" />
      <main id="main-content" tabIndex={-1}>
        <ProvisionalNotice />

      <section className="public-hero" aria-labelledby="home-title">
        <div className="public-hero-copy">
          <p className="public-eyebrow">Discreción · Exclusividad · Atención privada</p>
          <h1 id="home-title">
            El lujo de elegir
            <span>en tu casa o en hotel</span>
          </h1>
          <p>
            Una experiencia responsive para Madrid y Barcelona. La cobertura y
            disponibilidad solo se mostrarán como reales después de su aprobación.
          </p>
          <div className="public-actions">
            <a className="public-primary-action" href="/perfiles">
              Ver perfiles
            </a>
            <a className="public-secondary-action" href="/contacto">
              Contacto privado
            </a>
          </div>
        </div>
        <div className="public-hero-art" aria-hidden="true">
          <SyntheticFiligree />
          <p>Madrid · Barcelona</p>
        </div>
      </section>

      <section className="public-trust-strip" aria-label="Principios del proyecto">
        <article><span>01</span><strong>Privacidad cuidada</strong></article>
        <article><span>02</span><strong>Solo mayores de 18 años</strong></article>
        <article><span>03</span><strong>Sin local abierto al público</strong></article>
        <article><span>04</span><strong>Canales sujetos a aprobación</strong></article>
      </section>

      <section className="public-section" aria-labelledby="cities-title">
        <div className="public-section-heading">
          <p className="public-eyebrow">Cobertura en validación</p>
          <h2 id="cities-title">Dos ciudades, una sola experiencia</h2>
          <p>
            Las páginas actuales son borradores de producto. Ninguna zona se presenta
            como cobertura confirmada en esta versión.
          </p>
        </div>
        <div className="public-city-grid">
          <a href="/madrid">
            <span>M·01</span>
            <strong>Madrid</strong>
            <small>Ver borrador de ciudad</small>
          </a>
          <a href="/barcelona">
            <span>B·01</span>
            <strong>Barcelona</strong>
            <small>Ver borrador de ciudad</small>
          </a>
        </div>
      </section>

      <section className="public-section public-profile-section" aria-labelledby="profiles-title">
        <div className="public-section-heading public-section-heading-inline">
          <div>
            <p className="public-eyebrow">Perfiles</p>
            <h2 id="profiles-title">Catálogo protegido por aprobación</h2>
          </div>
          <a href="/perfiles">Abrir catálogo</a>
        </div>
        {profiles.ok && profiles.items.length > 0 ? (
          <div className="profile-grid">
            {profiles.items.map((profile) => (
              <ProfileCard profile={profile} key={profile.slug} />
            ))}
          </div>
        ) : (
          <div className="public-empty-state" role="status">
            <strong>No hay perfiles publicados.</strong>
            <p>
              Los perfiles aparecerán únicamente después de validar mayoría de edad,
              consentimiento, derechos de uso y aprobación de contenido.
            </p>
          </div>
        )}
      </section>

      <section className="public-final-cta" aria-labelledby="contact-title">
        <p className="public-eyebrow">Contacto sin exposición</p>
        <h2 id="contact-title">Los canales permanecen cerrados hasta estar aprobados.</h2>
        <a href="/contacto">Consultar estado de contacto</a>
      </section>

      </main>
      <PublicFooter />
    </div>
  );
}
