/**
 * FAQ — every answer is built only from information in the brochures.
 */
export interface FaqItem {
  question: string;
  answer: string[];
}

export const faqPl = (freeholdNames: string): FaqItem[] => [
  {
    question: "Czym różni się freehold od leasehold w tych projektach?",
    answer: [
      "Freehold to pełna własność bez ograniczenia czasowego. Leasehold to dzierżawa — najczęściej na 30 lat; jest tańszy w zakupie, ale w willach zwykle dochodzi roczny czynsz za grunt.",
      `Freehold oferujemy w: ${freeholdNames}. Formę zakupu, długość dzierżawy i czynsz podajemy na stronie każdego projektu.`,
    ],
  },
  {
    question: "Czy meble są w cenie?",
    answer: [
      "Zależnie od projektu. Meble są w cenie m.in. w Maenam Pool Villas, Lamai Lagoon Residences i Lamai Central Villas. W innych projektach meble to pakiet płatny dodatkowo — np. Lamai Rooftop Villa, Thong Krut Bay Villas czy Plai Laem Pool Villas.",
      "Zakres wyposażenia opisujemy w sekcji „Standard” każdego projektu i zawsze potwierdzamy go w umowie.",
    ],
  },
  {
    question: "Jakie są opłaty po zakupie?",
    answer: [
      "W apartamentach: opłata za utrzymanie części wspólnych (np. 80 THB/m² miesięcznie w Bangrak Beach Apartments, 60 THB/m² w Lamai Lagoon Residences) i jednorazowy fundusz remontowy.",
      "W willach z leasehold: roczny czynsz za grunt — od ok. 19 000 do ok. 105 000 THB, zależnie od projektu i działki — oraz często opłata osiedlowa. Dokładne kwoty są w sekcji „Koszty” na stronie projektu.",
    ],
  },
  {
    question: "Jak wyglądają płatności?",
    answer: [
      "Prawie wszystkie projekty są w budowie lub przed nią, więc płatności są etapowe: rezerwacja (od 50 000 THB do 10% ceny), a potem raty po kolejnych etapach budowy. W Lamai Park Villas deweloper oferuje finansowanie do 50% ceny na maksymalnie 5 lat.",
      "Szczegółowe harmonogramy znajdziesz na stronie każdego projektu.",
    ],
  },
  {
    question: "Kiedy można odebrać nieruchomość?",
    answer: [
      "Każdy projekt ma inny termin: od budowy trwającej ok. 6–8 miesięcy (Lamai Family Villas) czy 7 miesięcy (Lamai Central Villas), przez ok. 18 miesięcy (Thong Krut Bay Villas), po koniec 2028 r. (Lamai Lagoon Residences). W Lamai Park Villas przekazania zaczynają się w listopadzie 2026 r.",
      "Tam, gdzie deweloper nie podał terminu, piszemy wprost: do potwierdzenia.",
    ],
  },
  {
    question: "Czy kwoty w złotówkach są wiążące?",
    answer: [
      "Nie. Ceny podawane są w batach tajskich (THB), a kwoty w PLN są orientacyjne — każda prezentacja dewelopera przyjmuje własny kurs, który podajemy przy cenach. Wiążące są warunki podpisanej umowy.",
    ],
  },
  {
    question: "Czy zdjęcia przedstawiają gotowe domy?",
    answer: ["Nie — to wizualizacje dewelopera. Mają charakter poglądowy i mogą różnić się od realizacji. Każde zdjęcie na stronie jest tak oznaczone."],
  },
  {
    question: "Czy mogę dostać rzuty pomieszczeń?",
    answer: [
      "Rzuty nie są częścią prezentacji dewelopera. Zapytaj o nie przez formularz przy wybranym projekcie — odpowiemy, jaka dokumentacja jest dostępna dla danego układu.",
    ],
  },
];
