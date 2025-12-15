import React, { useMemo, useState } from 'react';
import { FiClock, FiMapPin, FiAlertCircle } from 'react-icons/fi';

type Palette = 'teal' | 'emerald' | 'green';

const paletteStyles: Record<Palette, {
  accentText: string;
  accentBg: string;
  accentRing: string;
  gradient: string;
  dot: string;
}> = {
  teal: {
    accentText: 'text-teal-600',
    accentBg: 'bg-teal-50',
    accentRing: 'ring-teal-100',
    gradient: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500',
    dot: 'bg-teal-400/70',
  },
  emerald: {
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    accentRing: 'ring-emerald-100',
    gradient: 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500',
    dot: 'bg-emerald-400/70',
  },
  green: {
    accentText: 'text-green-600',
    accentBg: 'bg-green-50',
    accentRing: 'ring-green-100',
    gradient: 'bg-gradient-to-r from-lime-400 via-green-400 to-emerald-500',
    dot: 'bg-green-400/70',
  },
};

export type MeetingBannerProps = {
  /**
   * Opción A: Proporcionar texto ya formateado de la hora (ej. "5:30 PM").
   */
  meetingTimeText?: string;
  /**
   * Opción B: Proporcionar una fecha/hora para formatear con Intl.
   */
  meetingDate?: Date | string | number;
  /**
   * Zona horaria para formateo (ej. 'America/Mexico_City').
   */
  timeZone?: string;
  /**
   * Locale para formateo (ej. 'es-ES', 'en-US').
   */
  locale?: string;
  /**
   * Forzar 12/24 horas. Si no se define, depende del locale.
   */
  hour12?: boolean;
  /**
   * Etiqueta de ubicación. Si se define vacío, no se muestra.
   */
  locationLabel?: string;
  /**
   * Paleta segura predefinida para Tailwind.
   */
  palette?: Palette;
  /**
   * URL de logo opcional.
   */
  logoSrc?: string;
  /**
   * Nombre de marca opcional (se muestra junto al logo si existe).
   */
  brandName?: string;
  /**
   * Título principal personalizado. Si no se provee, se infiere por locale.
   */
  titleText?: string;
  /**
   * Reemplazar el texto de política por uno propio.
   */
  policyLines?: string[];
  /**
   * Clases extra para el contenedor principal.
   */
  className?: string;
  /**
   * URL del punto de encuentro (Maps/Enlace externo). Muestra un CTA discreto.
   */
  locationUrl?: string;
  /**
   * Texto del CTA de ubicación. Si no se define, se infiere por locale.
   */
  locationCtaLabel?: string;
  /**
   * Abrir enlace en pestaña nueva (por defecto true).
   */
  openInNewTab?: boolean;
  /**
   * Mostrar un botón flotante para cambiar idioma (es/en).
   */
  showLanguageToggle?: boolean;
  /**
   * API Key de Google Maps para embeber direcciones.
   */
  googleMapsApiKey?: string;
  /**
   * Origen del trayecto.
   */
  origin?: string;
  /**
   * Destino del trayecto.
   */
  destination?: string;
  /**
   * Mostrar bloque de mapa/direcciones.
   */
  showMap?: boolean;
};

function formatMeetingTime(opts: {
  meetingTimeText?: string;
  meetingDate?: Date | string | number;
  locale?: string;
  timeZone?: string;
  hour12?: boolean;
}): string {
  const { meetingTimeText, meetingDate, locale, timeZone, hour12 } = opts;
  if (meetingTimeText) return meetingTimeText;
  if (!meetingDate) return '5:30 PM';
  const date = meetingDate instanceof Date ? meetingDate : new Date(meetingDate);
  try {
    const formatter = new Intl.DateTimeFormat(locale || undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12,
      timeZone,
    });
    return formatter.format(date);
  } catch {
    return '5:30 PM';
  }
}

const MeetingBanner: React.FC<MeetingBannerProps> = ({
  meetingTimeText,
  meetingDate,
  timeZone,
  locale,
  hour12,
  locationLabel = 'Designated Meeting Point',
  palette = 'teal',
  logoSrc,
  brandName,
  titleText,
  policyLines,
  className = '',
  locationUrl,
  locationCtaLabel,
  openInNewTab = true,
  showLanguageToggle = true,
  googleMapsApiKey,
  origin = 'Corcovado Hiking Tours, Puerto Jiménez, Puntarenas, Costa Rica',
  destination = 'Muelle Público, Puerto Jiménez, Puntarenas, Costa Rica',
  showMap = true,
}) => {
  const [lang, setLang] = useState<'es' | 'en'>(() => {
    const l = (locale || '').toLowerCase();
    return l.startsWith('es') ? 'es' : 'en';
  });

  const effectiveLocale = lang === 'es' ? 'es-ES' : (locale || 'en-US');

  const styles = paletteStyles[palette];
  const timeString = formatMeetingTime({
    meetingTimeText,
    meetingDate,
    locale: effectiveLocale,
    timeZone,
    hour12,
  });

  const isEs = lang === 'es';
  const title = titleText || (isEs ? 'Hora de encuentro' : 'Meeting Time');
  const ctaLabel = locationCtaLabel || (isEs ? 'Ver ubicación' : 'View location');

  const defaultPolicyEn = useMemo(
    () => [
      'Please arrive at the designated meeting point by ' + timeString + '.',
      'Guests who do not arrive on time will forfeit the tour and all associated rights.',
      'Late arrivals are not eligible for refunds or claims.',
    ],
    [timeString]
  );

  const defaultPolicyEs = useMemo(
    () => [
      'Por favor, llegue al punto de encuentro a las ' + timeString + '.',
      'Los clientes que no lleguen a tiempo perderán el tour y los derechos asociados.',
      'Los retrasos no son reembolsables ni reclamables.',
    ],
    [timeString]
  );

  const policy = policyLines && policyLines.length > 0
    ? policyLines
    : (isEs ? defaultPolicyEs : defaultPolicyEn);

  return (
    <main
      className={[
        'min-h-screen w-full bg-white text-neutral-900',
        'flex items-center justify-center',
        'px-6',
        className,
      ].join(' ')}
    >
      <section className="w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl">
          <div className={['absolute inset-x-0 top-0 h-1', styles.gradient].join(' ')} />

          <div className="p-7 sm:p-10 md:p-12">
            {/* Brand (opcional) */}
            {(logoSrc || brandName) && (
              <div className="mb-4 flex items-center gap-3">
                {logoSrc && (
                  <img
                    src={logoSrc}
                    alt={brandName || 'Brand logo'}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                )}
                {brandName && (
                  <span className="text-sm font-semibold tracking-wide text-neutral-700">
                    {brandName}
                  </span>
                )}
              </div>
            )}

            {/* Location hint */}
            {locationLabel && (
              <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                <FiMapPin className={["h-4 w-4", styles.accentText].join(" ")} aria-hidden="true" />
                <span>{locationLabel}</span>
              </div>
            )}

            {/* Primary message */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3">
              <div
                className={[
                  'flex h-12 w-12 items-center justify-center rounded-xl',
                  styles.accentBg,
                  'ring-1',
                  styles.accentRing,
                ].join(' ')}
              >
                <FiClock className={["h-6 w-6", styles.accentText].join(" ")} aria-hidden="true" />
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
                {title}: <span className={styles.accentText}>{timeString}</span>
              </h1>
            </div>

            {/* Policy */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-start gap-3">
                <FiAlertCircle className={['mt-1 h-5 w-5', styles.accentText].join(' ')} aria-hidden="true" />
                <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
                  {policy.map((line, idx) => (
                    <span key={idx} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-sm text-neutral-500">
                <span className={['inline-block h-2 w-2 rounded-full', styles.dot].join(' ')} />
                <span>Thank you for your punctuality and cooperation.</span>
              </div>
            </div>

            {/* Google Maps route */}
            {showMap && (
              <div className="mt-8">
                {googleMapsApiKey ? (
                  <div className="relative w-full overflow-hidden rounded-xl border border-neutral-200 shadow-sm" style={{ aspectRatio: '16/9' }}>
                    <iframe
                      title="Route map"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(googleMapsApiKey)}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=walking`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4">
                    <div className="text-sm text-neutral-700">
                      {isEs ? 'Ver ruta en Google Maps' : 'View route in Google Maps'}
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=walking`}
                      target={openInNewTab ? '_blank' : undefined}
                      rel={openInNewTab ? 'noopener noreferrer' : undefined}
                      className={[
                        'inline-flex items-center gap-2 rounded-md px-3 py-2',
                        styles.accentBg,
                        'text-sm font-medium',
                        'ring-1',
                        styles.accentRing,
                        'hover:bg-black/5 transition-colors',
                      ].join(' ')}
                    >
                      {isEs ? 'Ver ruta desde Corcovado Hiking Tours en Google Maps' : 'View route from Corcovado Hiking Tours in Google Maps'}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Client location route CTA */}
            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4">
              <div className="text-sm text-neutral-700">
                {isEs ? 'Ruta desde su ubicación' : 'Route from your location'}
              </div>
              <button
                type="button"
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const { latitude, longitude } = pos.coords;
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(destination)}&travelmode=walking`;
                        window.open(url, openInNewTab ? '_blank' : '_self');
                      },
                      () => {
                        const url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destination)}&travelmode=walking`;
                        window.open(url, openInNewTab ? '_blank' : '_self');
                      }
                    );
                  } else {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent(destination)}&travelmode=walking`;
                    window.open(url, openInNewTab ? '_blank' : '_self');
                  }
                }}
                className={[
                  'inline-flex items-center gap-2 rounded-md px-3 py-2',
                  styles.accentBg,
                  'text-sm font-medium',
                  'ring-1',
                  styles.accentRing,
                  'hover:bg-black/5 transition-colors',
                ].join(' ')}
              >
                {isEs ? 'Iniciar ruta' : 'Start route'}
              </button>
            </div>
          </div>
        </div>
      </section>
      {showLanguageToggle && (
        <div className="fixed bottom-4 right-4">
          <button
            type="button"
            onClick={() => setLang((prev) => (prev === 'es' ? 'en' : 'es'))}
            className={[
              'inline-flex items-center gap-2 rounded-full px-4 py-2 shadow-lg',
              'bg-white border border-neutral-200 text-neutral-800',
              'hover:bg-neutral-50 focus:outline-none focus:ring-2',
              styles.accentRing,
              'transition-colors',
            ].join(' ')}
            aria-label={isEs ? 'Cambiar a inglés' : 'Switch to Spanish'}
          >
            <span className={styles.accentText}>{isEs ? 'ES' : 'EN'}</span>
            <span className="text-sm">{isEs ? 'Español' : 'English'}</span>
          </button>
        </div>
      )}
    </main>
  );
};

export default MeetingBanner;
