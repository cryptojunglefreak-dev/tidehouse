# Tidehouse — strona inwestycji na Koh Samui

Strona sprzedażowa czterech inwestycji zbudowana na podstawie prezentacji PDF:

| Nazwa na stronie | Adres | Numer projektu w PDF (`ref`, tylko wewnętrznie) |
|---|---|---|
| Bangrak Beach Apartments | `/inwestycje/bangrak-beach-apartments` | 187 |
| Lamai Rooftop Villa | `/inwestycje/lamai-rooftop-villa` | 220 |
| Maenam Pool Villas | `/inwestycje/maenam-pool-villas` | 288 |
| Lamai Bali Villas | `/inwestycje/lamai-bali-villas` | 304 |

Nazwy są nasze (opisowe) — deweloperzy w prezentacjach używają tylko numerów.
Wszystkie dane, ceny i zdjęcia pochodzą z tych materiałów — szczegóły i lista braków: [`docs/ANALIZA-PDF.md`](docs/ANALIZA-PDF.md).

## Technologia

- **Next.js 16** (App Router, strony generowane statycznie) + **React 19** + **TypeScript**
- **Tailwind CSS 4** — tokeny kolorów i typografii w `src/app/globals.css`
- Font self-hosted: **Geist** (`@fontsource-variable/geist`, z polskimi znakami)
- Każdy projekt ma własny kolor (`theme` w `projects.ts`): Laguna, Palma, Piasek, Frangipani
- Animacje: CSS + IntersectionObserver (bez ciężkich bibliotek); `prefers-reduced-motion` respektowane
- Zdjęcia: `next/image` → AVIF/WebP, właściwe rozmiary dla urządzeń, rozmyte placeholdery (brak skoków układu)

## Marka

Nazwa **Tidehouse**, znak: dach nad falami i słońce, w formie ikony aplikacji.

- `public/brand/tidehouse-logo.svg` — logo poziome (ciemny tekst), `tidehouse-logo-white.svg` — na ciemne tło
- `public/brand/tidehouse-mark.svg` — sam znak (favicon, awatar w social media)
- W kodzie: `components/layout/Logo.tsx`

Przed publikacją sprawdź dostępność domeny i znaku towarowego „Tidehouse” w swoich krajach.

## Uruchomienie

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # wersja produkcyjna
```

Wymagany Node.js 20.9+.

## Struktura

```
src/
  app/                      strony (App Router)
    (pl)/                   wersja polska: /, /inwestycje, /lokalizacje, /galeria, /jak-kupic, /kontakt…
    en/                     wersja angielska: /en, /en/projects, /en/locations, /en/how-to-buy…
    de/                     wersja niemiecka: /de, /de/projekte, /de/lagen, /de/kaufen…
    api/enquiry/route.ts    obsługa formularza (walidacja, antyspam, wysyłka)
    api/agent/route.ts      Tidehouse Agent
    sitemap.ts robots.ts    SEO
  components/
    layout/                 nagłówek, menu mobilne, stopka, przycisk WhatsApp
    home/                   hero z indeksem projektów
    projects/               karty, cennik lokali, sekcje projektu, mapa
    gallery/                galeria + lightbox (zoom, swipe, klawiatura)
    forms/                  formularz zapytania
    sections/               sekcje wielokrotnego użytku (kontakt, FAQ, porównanie…)
    ui/                     przyciski, ceny, ikony
  content/pl/               DANE (źródło prawdy): projekty, cennik 187, FAQ, lokalizacje, porównanie
  content/en/ content/de/   tłumaczenia tekstów ofert i treści stałych (liczby i ceny brane z pl)
  config/site.ts            dane kontaktowe, social media, dane firmy
  i18n/                     języki: config.ts (adresy), dictionaries/ (teksty interfejsu), pages.tsx
  lib/                      formatowanie cen, SEO/JSON-LD, obsługa formularza
assets/source/              oryginalne zdjęcia wyciągnięte z PDF-ów
public/images/projects/     zdjęcia gotowe dla strony (generowane)
```

## Dodawanie ofert

Każda nowa oferta to osobny plik w `src/content/pl/offers/` (wzór: dowolny istniejący plik). Kroki:
1. Zdjęcia do `assets/source/<slug>/`, potem `npm run images`.
2. Skopiuj plik oferty, uzupełnij dane z PDF, dopisz go w `src/content/pl/offers/index.ts`.
3. Jeśli to nowa okolica — dodaj ją w `src/content/pl/areas.ts` (pojawi się w pasku lokalizacji, na stronie Lokalizacje i u agenta).
4. Wiersz do porównania: `src/content/pl/comparison.ts`, formy własności: `src/content/pl/ownership.ts`.

Kolejność na stronie głównej: najpierw projekty z `featuredSlugs` w `projects.ts` (teraz Maenam Pool Villas i Lamai Bali Villas), potem pozostałe w losowej kolejności.

## Edycja treści

- **Ceny, opisy, parametry** — `src/content/pl/projects.ts`. Każdy projekt to jeden obiekt; pola są opisane w `src/types/project.ts`.
- **Cennik lokali Bangrak Beach Apartments** — `src/content/pl/units-187.ts` (jedna linia = jeden lokal). Usuń linię, gdy lokal zostanie sprzedany.
- **Dane kontaktowe / social media / dane firmy** — `src/config/site.ts`. Puste pola są ukrywane na stronie.
- **Nowa okolica lub wyspa** — dopisz ją w `src/content/pl/areas.ts` (pole `island`, np. „Koh Phangan”), a w projekcie ustaw te same `location.area` i `location.island`. Strona „Lokalizacje” sama pogrupuje okolice według wysp, a filtr lokalizacji na liście inwestycji doda nową pozycję.
- **Nowy projekt** — skopiuj obiekt w `projects.ts`, dodaj zdjęcia do `assets/source/<slug>/` i uruchom:

```bash
npm run images     # optymalizuje zdjęcia i aktualizuje src/content/images.generated.ts
```

## Formularz zapytań

Formularz wysyła dane do `/api/enquiry`, gdzie są walidowane (te same reguły co w przeglądarce), filtrowane antyspamowo
(honeypot, czas wypełnienia, limit 5 zapytań / 10 min z jednego IP) i dostarczane jednym z kanałów:

| Zmienna | Działanie |
|---|---|
| `RESEND_API_KEY` + `ENQUIRY_FROM_EMAIL` (+ `ENQUIRY_TO_EMAIL`) | e-mail przez [Resend](https://resend.com) — domena nadawcy musi być zweryfikowana |
| `ENQUIRY_WEBHOOK_URL` | JSON do CRM / Make / Zapier / n8n |

Skopiuj `.env.example` do `.env.local` i uzupełnij. **W produkcji musi być ustawiony co najmniej jeden kanał** —
bez tego formularz zwróci czytelny komunikat błędu z odesłaniem do WhatsApp i e-maila (nie udaje sukcesu).
W trybie deweloperskim, bez konfiguracji, zapytania trafiają do pliku `.data/enquiries.ndjson`.

Formularz obsługuje trzy cele: prośbę o informacje, umówienie prezentacji (wymaga telefonu) i prośbę o rzuty.
Przyciski „Zapytaj” przy lokalach w cenniku i w panelu projektu wypełniają formularz automatycznie.

## Tidehouse Agent (czat AI w nagłówku strony głównej)

Okno czatu pod tytułem strony głównej z przyciskami: budżet, lokalizacja, widok na morze, widok na basen, sypialnie, freehold.

Jak działa:
1. `src/lib/agent/filters.ts` odczytuje kryteria z przycisków i z wpisanego tekstu (np. „do 8 mln”, „600 tys. zł”, „Lamai”, „widok na morze”, „3 sypialnie”).
2. `src/lib/agent/match.ts` przeszukuje bazę ofert (`src/content/pl/projects.ts`, cenniki lokali) i układa ranking. Karty ofert pod odpowiedzią pochodzą zawsze z tej wyszukiwarki, nie z modelu.
3. `src/app/api/agent/route.ts` wysyła do modelu językowego instrukcje „Tidehouse Agent” (`src/lib/agent/prompt.ts`) razem z danymi pasujących ofert. Model pisze odpowiedź tylko na ich podstawie — nie zna innych ofert i ma zakaz wymyślania cen czy widoków.

Model nie jest dotrenowywany: wiedza o ofertach jest dołączana do każdego pytania. Dzięki temu nowa oferta dodana do `projects.ts` jest od razu znana agentowi, bez żadnego treningu.

Konfiguracja (`.env`): `AGENT_API_KEY` — darmowy klucz z https://console.groq.com/keys (bez karty). Opcjonalnie `AGENT_MODEL` (domyślnie `openai/gpt-oss-120b`) i `AGENT_API_BASE` — działa każde API zgodne z OpenAI (Groq, OpenRouter, Gemini w trybie OpenAI). Bez klucza agent nadal działa, ale odpowiada prostymi zdaniami z wyszukiwarki ofert.

Darmowy limit Groq dla `openai/gpt-oss-120b`: 30 zapytań/min, 1000 dziennie, 8000 tokenów/min. Jedno pytanie zużywa ok. 2–4 tys. tokenów, więc przy większym ruchu warto przejść na płatny plan (koszt rzędu groszy za rozmowę) albo zmienić model.

Przy kilkudziesięciu ofertach do modelu trafia 5 najlepiej dopasowanych w pełnej wersji i reszta w jednym wierszu każda — zapytanie pozostaje krótkie.

## Publikacja

Najprościej: [Vercel](https://vercel.com) → import repozytorium → ustaw zmienne z `.env.example` → deploy.
Działa też na każdym serwerze Node (`npm run build && npm start`). Ustaw `NEXT_PUBLIC_SITE_URL` na docelową domenę
(adresy kanoniczne, sitemap, Open Graph).

## Podgląd statyczny

`src/preview/` i `src/lib/preview.ts` pozwalają zbudować całą stronę jako jeden statyczny plik z nawigacją po `#hash`
(zmienna `NEXT_PUBLIC_PREVIEW=1`, `output: "export"`). Służy wyłącznie do pokazania strony przed wdrożeniem —
w podglądzie formularz nie wysyła danych, a mapy otwierają się tylko w Google Maps. Zwykły `npm run build` tego nie używa.

## SEO

- Unikalne `title`/`description`, Open Graph i Twitter Card dla każdej strony
- Dane strukturalne: `RealEstateAgent`, `WebSite`, `RealEstateListing` (z ofertą w THB), `BreadcrumbList`, `ItemList`, `FAQPage`
- `sitemap.xml` (ze zdjęciami projektów) i `robots.txt`
- Przyjazne adresy: `/inwestycje/lamai-rooftop-villa`

## Wersje językowe (PL · EN · DE)

Strona działa w trzech językach. Przełącznik (globus) jest w nagłówku, a w menu mobilnym — rząd przycisków; prowadzi na tę samą podstronę w innym języku.

- **Adresy** — `src/i18n/config.ts` (`routes`). Polski bez prefiksu, angielski `/en/…`, niemiecki `/de/…`.
- **Teksty interfejsu** — `src/i18n/dictionaries/{pl,en,de}.ts`. TypeScript pilnuje, żeby każdy język miał te same klucze.
- **Treści ofert** — polskie dane w `src/content/pl/` są źródłem prawdy (ceny, metraże, zdjęcia). Pliki `src/content/{en,de}/projects*.ts` zawierają tylko tłumaczenia tekstów i są nakładane na polskie dane (`src/content/index.ts`). Tablice (np. `highlights`, `costs`, `images`) muszą mieć tę samą kolejność i liczbę elementów co w wersji polskiej.
- **Nowa oferta** — po dodaniu jej po polsku dopisz tłumaczenie w `src/content/en/projects-new-*.ts` i `src/content/de/projects-new-*.ts`. Bez tłumaczenia oferta wyświetli się w EN/DE z polskimi opisami.
- **Kwoty w PLN** pokazujemy tylko w wersji polskiej; EN/DE podają ceny w THB.
- **Agent** odpowiada w języku strony (także przez model AI).
- **SEO** — każda podstrona ma `hreflang` dla trzech języków (+ `x-default` = polski), a `sitemap.xml` zawiera wszystkie wersje.
- **Do przeglądu** — tłumaczenia polityki prywatności i informacji prawnych warto dać do sprawdzenia prawnikowi w danym kraju.

## Do uzupełnienia przed publikacją

- [ ] Kanał dostarczania formularza (Resend lub webhook) — patrz wyżej
- [ ] Dane administratora danych w `siteConfig.legal` + przegląd polityki prywatności przez prawnika
- [ ] Domena dla marki Tidehouse (`NEXT_PUBLIC_SITE_URL`, `siteConfig.domain`) i ewentualnie nowy adres e-mail
- [ ] Linki do social media w `siteConfig.social`
- [ ] Potwierdzenie z deweloperami punktów z `docs/ANALIZA-PDF.md` (m.in. lokalizacja Lamai Bali Villas / projekt 304)
- [ ] Czyste wizualizacje Maenam Pool Villas — obecne mają w rogu logo dewelopera „The Serenity Escape”
- [ ] Aktualizacja cennika Bangrak Beach Apartments (stan na 15.09.2026)
