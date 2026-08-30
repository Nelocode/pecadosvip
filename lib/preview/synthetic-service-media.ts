import type { PublicMedia } from '../content/public-profiles.ts';
import type { Locale } from '../i18n/locales.ts';

export const syntheticServiceMediaKeys = [
  'company-private-lounge',
  'settings-private-celebration',
  'settings-hotel-arrival',
  'settings-home-arrival',
  'couples-two-settings',
  'couples-private-gathering',
  'wellbeing-spa-ritual',
  'wellbeing-water-ritual',
  'roleplay-theatre-mask',
  'roleplay-consent-accessories',
  'preferences-silk-envelope',
  'preferences-choice-boxes',
] as const;

export type SyntheticServiceMediaKey =
  (typeof syntheticServiceMediaKeys)[number];

type LocalizedAlt = Readonly<Record<Locale, string>>;

type SyntheticServiceMediaDefinition = {
  filename: string;
  objectPosition: string;
  alt: LocalizedAlt;
};

export type SyntheticServiceMedia = PublicMedia & {
  key: SyntheticServiceMediaKey;
  sourcePath: string;
  contentType: 'image/webp';
  objectPosition: string;
};

const alt = (es: string, en: string, fr: string, it: string): LocalizedAlt => ({
  es,
  en,
  fr,
  it,
});

const mediaDefinitions: Readonly<
  Record<SyntheticServiceMediaKey, SyntheticServiceMediaDefinition>
> = {
  'company-private-lounge': {
    filename: 'company-private-lounge-v01.webp',
    objectPosition: '50% 48%',
    alt: alt(
      'Salón nocturno con dos butacas y dos copas sobre una mesa de mármol oscuro.',
      'Night lounge with two armchairs and two glasses on a dark marble table.',
      'Salon nocturne avec deux fauteuils et deux coupes sur une table en marbre sombre.',
      'Salotto notturno con due poltrone e due coppe su un tavolo di marmo scuro.',
    ),
  },
  'settings-private-celebration': {
    filename: 'settings-private-celebration-v01.webp',
    objectPosition: '50% 50%',
    alt: alt(
      'Bodegón de celebración privada con cubitera, sobres negros y cinta dorada.',
      'Private celebration still life with an ice bucket, black envelopes and gold ribbon.',
      'Nature morte de célébration privée avec seau, enveloppes noires et ruban doré.',
      'Natura morta per una celebrazione privata con secchiello, buste nere e nastro dorato.',
    ),
  },
  'settings-hotel-arrival': {
    filename: 'settings-hotel-arrival-v01.webp',
    objectPosition: '50% 45%',
    alt: alt(
      'Maletín de noche y tarjeta sin marca frente a un pasillo de hotel iluminado.',
      'Overnight case and unbranded card before a softly lit hotel corridor.',
      'Sac de nuit et carte sans marque devant un couloir d’hôtel éclairé.',
      'Borsa da notte e tessera senza marchio davanti a un corridoio d’hotel illuminato.',
    ),
  },
  'settings-home-arrival': {
    filename: 'settings-home-arrival-v01.webp',
    objectPosition: '50% 48%',
    alt: alt(
      'Llave de latón y manta oscura en la entrada de un apartamento cálido.',
      'Brass key and dark throw at the entrance to a warmly lit apartment.',
      'Clé en laiton et plaid sombre à l’entrée d’un appartement chaleureux.',
      'Chiave in ottone e coperta scura all’ingresso di un appartamento caldo.',
    ),
  },
  'couples-two-settings': {
    filename: 'couples-two-settings-v01.webp',
    objectPosition: '50% 48%',
    alt: alt(
      'Dos butacas y dos copas frente a una ventana con luces nocturnas.',
      'Two armchairs and two glasses before a window with night lights.',
      'Deux fauteuils et deux coupes devant une fenêtre éclairée la nuit.',
      'Due poltrone e due coppe davanti a una finestra con luci notturne.',
    ),
  },
  'couples-private-gathering': {
    filename: 'couples-private-gathering-v01.webp',
    objectPosition: '50% 46%',
    alt: alt(
      'Tres copas dispuestas ante tres asientos en un salón privado.',
      'Three glasses arranged before three seats in a private lounge.',
      'Trois coupes disposées devant trois sièges dans un salon privé.',
      'Tre coppe disposte davanti a tre sedute in un salotto privato.',
    ),
  },
  'wellbeing-spa-ritual': {
    filename: 'wellbeing-spa-ritual-v01.webp',
    objectPosition: '52% 46%',
    alt: alt(
      'Toallas de carbón, frascos de aceite ámbar y cuenco de piedra con vapor.',
      'Charcoal towels, amber oil bottles and a steaming stone bowl.',
      'Serviettes anthracite, flacons d’huile ambrée et bol en pierre fumant.',
      'Asciugamani antracite, flaconi d’olio ambrato e ciotola in pietra con vapore.',
    ),
  },
  'wellbeing-water-ritual': {
    filename: 'wellbeing-water-ritual-v01.webp',
    objectPosition: '50% 44%',
    alt: alt(
      'Ducha de lluvia con vapor, toallas oscuras y frasco ámbar sin etiqueta.',
      'Steaming rainfall shower with dark towels and an unlabelled amber bottle.',
      'Douche pluie avec vapeur, serviettes sombres et flacon ambré sans étiquette.',
      'Doccia a pioggia con vapore, asciugamani scuri e flacone ambrato senza etichetta.',
    ),
  },
  'roleplay-theatre-mask': {
    filename: 'roleplay-theatre-mask-v01.webp',
    objectPosition: '50% 42%',
    alt: alt(
      'Antifaz de terciopelo, guantes de satén y estuche cerrado sobre un tocador.',
      'Velvet mask, satin gloves and a closed case on a dressing table.',
      'Masque en velours, gants en satin et coffret fermé sur une coiffeuse.',
      'Maschera di velluto, guanti di raso e custodia chiusa su un tavolo da trucco.',
    ),
  },
  'roleplay-consent-accessories': {
    filename: 'roleplay-consent-accessories-v01.webp',
    objectPosition: '50% 45%',
    alt: alt(
      'Abanico negro, reloj de arena, tarjetas en blanco y bolsa de satén.',
      'Black fan, hourglass, blank cards and a satin pouch.',
      'Éventail noir, sablier, cartes vierges et pochette en satin.',
      'Ventaglio nero, clessidra, carte bianche e sacchetto di raso.',
    ),
  },
  'preferences-silk-envelope': {
    filename: 'preferences-silk-envelope-v01.webp',
    objectPosition: '50% 44%',
    alt: alt(
      'Sobre negro cerrado sobre seda dorada y piedras oscuras pulidas.',
      'Sealed black envelope on gold silk with smooth dark stones.',
      'Enveloppe noire fermée sur soie dorée et pierres sombres polies.',
      'Busta nera chiusa su seta dorata e pietre scure levigate.',
    ),
  },
  'preferences-choice-boxes': {
    filename: 'preferences-choice-boxes-v01.webp',
    objectPosition: '50% 46%',
    alt: alt(
      'Cajas negras de elección, una abierta con seda dorada, tarjeta en blanco y lápiz.',
      'Black choice boxes, one open with gold silk, a blank card and pencil.',
      'Boîtes de choix noires, dont une ouverte sur de la soie dorée, carte vierge et crayon.',
      'Scatole nere di scelta, una aperta con seta dorata, biglietto bianco e matita.',
    ),
  },
};

export function isSyntheticServiceMediaKey(
  value: unknown,
): value is SyntheticServiceMediaKey {
  return syntheticServiceMediaKeys.includes(value as SyntheticServiceMediaKey);
}
export function getSyntheticServiceMedia(
  key: SyntheticServiceMediaKey,
  locale: Locale,
): SyntheticServiceMedia {
  const definition = mediaDefinitions[key];
  return {
    key,
    kind: 'image',
    desktopUrl: `/preview-local-sintetico/service-media/${key}`,
    alt: definition.alt[locale],
    order: syntheticServiceMediaKeys.indexOf(key),
    sourcePath: `assets/synthetic-services/selected/${definition.filename}`,
    contentType: 'image/webp',
    objectPosition: definition.objectPosition,
  };
}
