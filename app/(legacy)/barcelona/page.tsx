import type { Metadata } from 'next';
import { buildCityMetadata } from '@/lib/seo';
import CityLanding from '@/app/components/CityLanding';
import { cities } from '@/app/city-data';

export const metadata: Metadata = buildCityMetadata({
  slug: 'barcelona',
  city: 'Barcelona',
  description:
    'Servicio de compañía privada en Barcelona, con desplazamiento a domicilios y hoteles. Atención discreta y cobertura bajo confirmación previa.',
  openGraphDescription:
    'Atención privada en domicilios y hoteles de Barcelona, siempre con discreción y confirmación previa.',
  twitterDescription: 'Atención privada y discreta en Barcelona.',
});

export default function BarcelonaPage() {
  return <CityLanding content={cities.barcelona} />;
}
