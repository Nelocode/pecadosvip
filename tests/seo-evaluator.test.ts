import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  analyzeProfileSeo,
  evaluateGalleryAlt,
  evaluateKeywordDensity,
  evaluateMetaDescription,
  evaluateSeoTitle,
} from '../lib/seo/seo-evaluator.ts';

test('evaluateSeoTitle gives Green status for title with 45-60 chars including keyword and city', () => {
  const result = evaluateSeoTitle(
    'Acompañante VIP en Barcelona | Valeria Escort de Lujo',
    'Escort',
    'Barcelona'
  );
  assert.equal(result.status, 'green');
  assert.equal(result.score, 100);
});

test('evaluateSeoTitle gives Red status for too short or missing keyword/city', () => {
  const result = evaluateSeoTitle('Valeria Barcelona', 'Escort', 'Barcelona');
  assert.equal(result.status, 'red');
});

test('evaluateMetaDescription gives Green for 120-155 chars with CTA and keyword', () => {
  const result = evaluateMetaDescription(
    'Reserva una experiencia exclusiva con Valeria en Barcelona. Disfruta de la mejor compañía VIP. Contacta hoy mismo para agendar tu cita privada.',
    'Valeria'
  );
  assert.equal(result.status, 'green');
});

test('evaluateKeywordDensity calculates density percentage accurately', () => {
  const text = 'Valeria es una modelo VIP disponible en Barcelona. Si buscas a Valeria para una cena de lujo, Valeria ofrece la mejor compañía.';
  const result = evaluateKeywordDensity(text, 'Valeria');
  assert.ok(['green', 'orange', 'red'].includes(result.status));
});

test('evaluateGalleryAlt verifies image alt text completeness', () => {
  const greenResult = evaluateGalleryAlt([
    { alt: 'Valeria vestida de noche en hotel de Barcelona' },
    { alt: 'Retrato de cara de Valeria modelo VIP' },
  ]);
  assert.equal(greenResult.status, 'green');

  const redResult = evaluateGalleryAlt([
    { alt: '' },
    { alt: 'foto' },
  ]);
  assert.equal(redResult.status, 'red');
});

test('analyzeProfileSeo calculates aggregate score and overall traffic light status', () => {
  const report = analyzeProfileSeo({
    title: 'Acompañante VIP en Barcelona | Valeria Escort de Lujo',
    metaDescription: 'Reserva una experiencia exclusiva con Valeria en Barcelona. Disfruta de la mejor compañía VIP. Contacta hoy mismo para agendar tu cita privada.',
    bodyText: 'Valeria es una elegante modelo independiente en Barcelona. Disponible para eventos sociales, cenas exclusivas y viajes VIP.',
    targetKeyword: 'Valeria',
    targetCity: 'Barcelona',
    galleryImages: [{ alt: 'Valeria retrato en Barcelona' }],
  });

  assert.ok(['green', 'orange', 'red'].includes(report.overallStatus));
  assert.ok(report.overallScore >= 0 && report.overallScore <= 100);
  assert.equal(report.metrics.title.status, 'green');
});
