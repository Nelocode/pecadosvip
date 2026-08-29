async page => {
  const origin = await page.evaluate(() => location.origin);
  const expected = {
    es: {
      title: 'Sitio en preparación | PecadosVip',
      holding: 'Contenido en preparación',
      notFound: 'Página no encontrada',
    },
    en: {
      title: 'Site in preparation | PecadosVip',
      holding: 'Content in preparation',
      notFound: 'Page not found',
    },
    fr: {
      title: 'Site en préparation | PecadosVip',
      holding: 'Contenu en préparation',
      notFound: 'Page introuvable',
    },
    it: {
      title: 'Sito in preparazione | PecadosVip',
      holding: 'Contenuto in preparazione',
      notFound: 'Pagina non trovata',
    },
  };
  const locales = Object.keys(expected);
  const viewports = [320, 390, 768, 1440];
  const failures = [];
  const observations = [];
  const legal = [];
  const notFound = [];
  const negatives = [];
  const pageErrors = [];
  const consoleErrors = [];
  const requestFailures = [];
  const externalRequests = [];
  const expectedNotFoundPaths = new Set([
    ...locales.map(locale => `/${locale}/perfiles/no-existe`),
    '/de',
    '/es-ES',
    '/ES',
    '/preview-local-sintetico',
  ]);
  const unexpectedHttpErrors = [];

  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push({ url: page.url(), text: message.text() });
    }
  });
  page.on('requestfailed', request => {
    requestFailures.push({
      url: request.url(),
      error: request.failure()?.errorText ?? 'unknown',
    });
  });
  page.on('request', request => {
    if (!request.url().startsWith(`${origin}/`)) externalRequests.push(request.url());
  });
  page.on('response', response => {
    const path = response.url().startsWith(origin)
      ? response.url().slice(origin.length).split(/[?#]/, 1)[0]
      : response.url();
    if (
      response.status() >= 400 &&
      !expectedNotFoundPaths.has(path)
    ) {
      unexpectedHttpErrors.push({ url: response.url(), status: response.status() });
    }
  });

  const check = (condition, detail) => {
    if (!condition) failures.push(detail);
  };

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of locales) {
      const path = `/${locale}`;
      const response = await page.goto(`${origin}${path}`, {
        waitUntil: 'networkidle',
      });
      const headers = response ? await response.allHeaders() : {};
      const state = await page.evaluate(() => {
        const links = [...document.querySelectorAll('nav.language-selector a')]
          .map(link => ({
            current: link.getAttribute('aria-current'),
            href: link.getAttribute('href'),
            hrefLang: link.getAttribute('hreflang'),
            lang: link.getAttribute('lang'),
            text: link.textContent?.trim() ?? '',
          }));
        const overflowElements = [...document.querySelectorAll('body *')]
          .filter(element => {
            const style = getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return (
              style.display !== 'none' &&
              style.visibility !== 'hidden' &&
              rect.width > 0 &&
              rect.height > 0 &&
              (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1)
            );
          })
          .slice(0, 10)
          .map(element => element.tagName.toLowerCase());
        return {
          h1: document.querySelector('h1')?.textContent?.trim() ?? '',
          htmlLang: document.documentElement.lang,
          links,
          metaRobots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          overflowElements,
        };
      });
      const title = await page.title();
      let keyboard = null;
      if (width === 1440) {
        await page.keyboard.press('Tab');
        const firstFocus = await page.evaluate(() => ({
          className: document.activeElement?.getAttribute('class') ?? '',
          href: document.activeElement?.getAttribute('href') ?? '',
        }));
        await page.keyboard.press('Enter');
        await page.waitForTimeout(25);
        const afterEnter = await page.evaluate(() => document.activeElement?.id ?? '');
        keyboard = { firstFocus, afterEnter };
        check(firstFocus.className.includes('skip-link'), `${path}@${width}: first Tab did not focus skip link`);
        check(afterEnter === 'main-content', `${path}@${width}: skip link did not focus main-content`);
      }

      const status = response?.status() ?? 0;
      check(status === 200, `${path}@${width}: status ${status}`);
      check(state.htmlLang === locale, `${path}@${width}: html lang ${state.htmlLang}`);
      check(title === expected[locale].title, `${path}@${width}: title ${title}`);
      check(state.h1 === expected[locale].holding, `${path}@${width}: h1 ${state.h1}`);
      check(state.links.length === 4, `${path}@${width}: selector has ${state.links.length} links`);
      check(
        state.links.every(link => link.hrefLang === link.lang && locales.includes(link.lang)),
        `${path}@${width}: selector lang/hreflang mismatch`,
      );
      check(
        state.links.filter(link => link.current === 'page').length === 1,
        `${path}@${width}: selector current language mismatch`,
      );
      check(state.metaRobots.includes('noindex'), `${path}@${width}: metadata is not noindex`);
      check((headers['x-robots-tag'] ?? '').includes('noindex'), `${path}@${width}: header is not noindex`);
      check(state.scrollWidth <= state.clientWidth, `${path}@${width}: horizontal document overflow`);
      check(state.overflowElements.length === 0, `${path}@${width}: visible elements exceed viewport`);
      observations.push({
        path,
        width,
        status,
        title,
        h1: state.h1,
        htmlLang: state.htmlLang,
        selectorLinks: state.links.length,
        noHorizontalOverflow: state.scrollWidth <= state.clientWidth,
        keyboard,
      });

      if (locale === 'es' && (width === 320 || width === 1440)) {
        await page.screenshot({
          path: `holding-es-${width}.png`,
          fullPage: true,
        });
      }
    }
  }

  await page.setViewportSize({ width: 390, height: 900 });
  for (const locale of locales) {
    const legalPath = `/${locale}/legal/privacidad`;
    const legalResponse = await page.goto(`${origin}${legalPath}`, { waitUntil: 'networkidle' });
    const legalState = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      htmlLang: document.documentElement.lang,
      selectorLinks: document.querySelectorAll('nav.language-selector a').length,
    }));
    check(legalResponse?.status() === 200, `${legalPath}: status ${legalResponse?.status()}`);
    check(legalState.h1 === expected[locale].holding, `${legalPath}: wrong holding copy`);
    check(legalState.htmlLang === locale, `${legalPath}: html lang ${legalState.htmlLang}`);
    check(legalState.selectorLinks === 4, `${legalPath}: selector parity failed`);
    legal.push({ path: legalPath, status: legalResponse?.status() ?? 0, ...legalState });

    const missingPath = `/${locale}/perfiles/no-existe`;
    const missingResponse = await page.goto(`${origin}${missingPath}`, { waitUntil: 'networkidle' });
    const missingState = await page.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() ?? '',
      htmlLang: document.documentElement.lang,
      homeHref: document.querySelector('main a')?.getAttribute('href') ?? '',
    }));
    check(missingResponse?.status() === 404, `${missingPath}: status ${missingResponse?.status()}`);
    check(missingState.h1 === expected[locale].notFound, `${missingPath}: wrong 404 copy`);
    check(missingState.htmlLang === locale, `${missingPath}: html lang ${missingState.htmlLang}`);
    check(missingState.homeHref === `/${locale}`, `${missingPath}: unsafe home link`);
    notFound.push({ path: missingPath, status: missingResponse?.status() ?? 0, ...missingState });
  }

  await page.screenshot({ path: 'not-found-it-390.png', fullPage: true });

  for (const path of ['/de', '/es-ES', '/ES', '/preview-local-sintetico']) {
    const response = await page.goto(`${origin}${path}`, { waitUntil: 'networkidle' });
    const status = response?.status() ?? 0;
    check(status === 404, `${path}: status ${status}`);
    negatives.push({ path, status });
  }

  const recoveryResponse = await page.goto(`${origin}/es`, { waitUntil: 'networkidle' });
  check(recoveryResponse?.status() === 200, 'server did not recover after invalid locales');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/it/legal/privacidad`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'legal-it-1440.png', fullPage: true });

  const expected404ConsoleErrors = consoleErrors.filter(entry => {
    const path = entry.url.startsWith(origin)
      ? entry.url.slice(origin.length).split(/[?#]/, 1)[0]
      : entry.url;
    return (
      expectedNotFoundPaths.has(path) &&
      entry.text === 'Failed to load resource: the server responded with a status of 404 (Not Found)'
    );
  });
  const unexpectedConsoleErrors = consoleErrors.filter(
    entry => !expected404ConsoleErrors.includes(entry),
  );

  check(pageErrors.length === 0, `page errors: ${pageErrors.join(' | ')}`);
  check(unexpectedConsoleErrors.length === 0, `console errors: ${JSON.stringify(unexpectedConsoleErrors)}`);
  check(requestFailures.length === 0, `request failures: ${JSON.stringify(requestFailures)}`);
  check(externalRequests.length === 0, `external requests: ${JSON.stringify(externalRequests)}`);
  check(unexpectedHttpErrors.length === 0, `unexpected HTTP errors: ${JSON.stringify(unexpectedHttpErrors)}`);

  return {
    schema: 'pecadosvip.browser-i18n-smoke',
    version: 1,
    result: failures.length === 0 ? 'PASS' : 'FAIL',
    productionActivation: false,
    origin,
    viewports,
    observations,
    legal,
    notFound,
    negatives,
    recoveryStatus: recoveryResponse?.status() ?? 0,
    diagnostics: {
      failures,
      pageErrors,
      expected404ConsoleErrors,
      unexpectedConsoleErrors,
      requestFailures,
      externalRequests,
      unexpectedHttpErrors,
    },
    screenshots: [
      'holding-es-320.png',
      'holding-es-1440.png',
      'not-found-it-390.png',
      'legal-it-1440.png',
    ],
    limits: [
      'Local loopback Chromium against the Vinext standalone build; no deployed browser session was tested.',
      'A human linguistic review remains pending for Spanish, English, French and Italian.',
      'No positive public profile route exists in the current empty runtime snapshot.',
    ],
  };
}
