'use client';

import { useEffect, useRef, useState } from 'react';
import type { Locale } from '../../lib/i18n/locales';
import {
  getSyntheticServiceMessages,
  type SyntheticServiceMessages,
} from '../../lib/preview/synthetic-services';

function withLocale(path: string, locale: Locale): string {
  return `${path}?lang=${locale}`;
}

const languageNames: Readonly<Record<Locale, string>> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
};

function previewAnchor(locale: Locale, anchor: string): string {
  return `/preview-local-sintetico?lang=${locale}${anchor}`;
}

function languageLinks(
  path: string,
  locale: Locale,
  ariaLabel: string,
  onNavigate?: () => void,
) {
  return (
    <nav className="synthetic-service-language" aria-label={ariaLabel}>
      {(['es', 'en', 'fr', 'it'] as const).map((candidate) => (
        <a
          aria-current={candidate === locale ? 'page' : undefined}
          href={withLocale(path, candidate)}
          hrefLang={candidate}
          key={candidate}
          lang={candidate}
          onClick={onNavigate}
        >
          {languageNames[candidate]}
        </a>
      ))}
    </nav>
  );
}

function navLinks(
  messages: SyntheticServiceMessages,
  locale: Locale,
  current: 'services' | 'detail',
  onNavigate?: () => void,
) {
  const links = [
    { href: previewAnchor(locale, '#inicio'), label: messages.navigation.home },
    { href: previewAnchor(locale, '#perfiles'), label: messages.navigation.profiles },
    { href: withLocale('/preview-local-sintetico/servicios', locale), label: messages.navigation.services, current: current === 'services' || current === 'detail' },
    { href: previewAnchor(locale, '#cobertura'), label: messages.navigation.coverage },
    { href: previewAnchor(locale, '#seguridad'), label: messages.navigation.controls },
  ];

  return links.map((link) => (
    <a
      aria-current={link.current ? 'page' : undefined}
      href={link.href}
      key={`${link.href}-${link.label}`}
      onClick={onNavigate}
    >
      {link.label}
    </a>
  ));
}

export default function SyntheticServicesHeader({
  locale,
  languagePath,
  current,
  documentTitle,
  documentDescription,
}: {
  locale: Locale;
  languagePath: string;
  current: 'services' | 'detail';
  documentTitle: string;
  documentDescription: string;
}) {
  const messages = getSyntheticServiceMessages(locale);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const skipLinkElement = document.querySelector<HTMLAnchorElement>('.skip-link');

    root.lang = locale;
    document.title = documentTitle;
    if (descriptionMeta) descriptionMeta.content = documentDescription;
    if (skipLinkElement) skipLinkElement.textContent = messages.navigation.skipLink;
  }, [documentDescription, documentTitle, locale, messages.navigation.skipLink]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const panel = menuPanelRef.current;
    const focusable = Array.from(
      panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );

    document.body.style.overflow = 'hidden';
    document.body.dataset.syntheticMenuOpen = 'true';
    focusable[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.setTimeout(() => menuButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== 'Tab' || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.syntheticMenuOpen;
    };
  }, [menuOpen]);

  return (
    <header className="public-header synthetic-preview-header synthetic-services-header" id="service-top">
      <a className="public-brand synthetic-preview-brand" href={previewAnchor(locale, '#inicio')}>
        <span>PecadosVip</span>
        <small>{messages.navigation.previewLabel}</small>
      </a>

      <nav className="public-nav synthetic-services-desktop-nav" aria-label={messages.navigation.primaryAria}>
        {navLinks(messages, locale, current)}
      </nav>

      {languageLinks(languagePath, locale, messages.navigation.languageAria)}

      <button
        className="synthetic-preview-reservation"
        disabled
        title={messages.navigation.privateBooking}
        type="button"
      >
        {messages.navigation.privateBooking}
      </button>

      <button
        aria-controls="synthetic-services-mobile-menu"
        aria-expanded={menuOpen}
        className="synthetic-services-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        ref={menuButtonRef}
        type="button"
      >
        {menuOpen ? messages.navigation.close : messages.navigation.menu}
      </button>

      {menuOpen ? (
        <div
          aria-label={messages.navigation.menu}
          aria-modal="true"
          className="synthetic-services-menu-panel"
          id="synthetic-services-mobile-menu"
          ref={menuPanelRef}
          role="dialog"
        >
          <div className="synthetic-services-menu-heading">
            <strong>PecadosVip</strong>
            <span>{messages.navigation.menu}</span>
          </div>
          {languageLinks(
            languagePath,
            locale,
            messages.navigation.languageAria,
            () => setMenuOpen(false),
          )}
          <nav aria-label={messages.navigation.mobileAria}>
            {navLinks(messages, locale, current, () => setMenuOpen(false))}
          </nav>
          <p>{messages.footer.tagline}</p>
        </div>
      ) : null}
    </header>
  );
}
