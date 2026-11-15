# Redesign ronald-klaus.de · Umsetzungsanweisung „Visitenkarte“

Diese Datei beschreibt vollständig, wie die neue Startseite gebaut wird. Sie ersetzt das bisherige brutalistische Layout. Bitte genau so umsetzen. Wo etwas nicht festgelegt ist, gilt: so schlicht wie möglich.

## Mockups

Im Ordner `mockups/` liegen die visuellen Vorgaben:

| Datei | Zeigt |
|---|---|
| `desktop-front.png` | Vorderseite, Desktop 1280px, leicht geneigt |
| `desktop-back.png` | Rückseite, Desktop 1280px, leicht geneigt |
| `mobile-front.png` | Vorderseite, Mobil 390px |
| `mobile-back.png` | Rückseite, Mobil 390px, Spalten untereinander mit horizontaler Trennung |
| `reference.html` | Klickbare Referenz mit Umdrehen, Tilt und Reflex (lokal über `./serve.sh` öffnen: http://localhost:8000/mockups/reference.html) |

`reference.html` ist die verbindliche Vorlage für Aussehen und Verhalten, aber **kein Produktionscode**. Bitte nicht einfach kopieren, sondern sauber nach dieser Anweisung aufteilen (`css/card.css`, `js/card.js`, zwei Sprachseiten, selbst gehostete Schrift, SEO, No-JS-Fallback). URL-Parameter für Vergleiche: `?side=back` zeigt die Rückseite, `?tilt=0.5,-0.3` friert die Neigung ein.

Der Ordner `mockups/` wird nach der Umsetzung nicht deployt: in `_config.yml` mit `exclude: [mockups, REDESIGN.md]` ausschließen oder nach der Abnahme löschen.

## 1. Idee in einem Satz

Die ganze Seite ist eine einzige Visitenkarte auf grauem Grund. Vorne stehen Name und Rolle. Per Klick oder Tap auf die Karte dreht man sie um (ein dezentes ↻ in der Ecke deutet das an), und die Rückseite zeigt, wer Ronald ist, was er baut und wie man ihn erreicht. Die Karte kippt leicht mit der Maus, ein Lichtreflex wandert über das Papier.

## 2. Ziel-Dateistruktur

```
index.html          Englische Seite (Standard)
de/index.html       Deutsche Seite
css/card.css        Gemeinsames Stylesheet für beide Sprachen
js/card.js          Gemeinsames Script (Umdrehen, Tilt, Reflex, Dreh-Hinweis)
assets/my_image.png Bestehendes Foto (460×460), bleibt
assets/ronald-112.webp  NEU: Foto verkleinert auf 112×112 (2× für 56px), WebP
assets/fonts/       NEU: Inter als selbst gehostete woff2 (Variable Font oder 400/500/600)
sitemap.xml         Aktualisieren (siehe 9.)
robots.txt, CNAME   Unverändert
```

Entfernen (werden nicht mehr gebraucht): `js/main.js`, `js/i18n.js`, `js/translations.js`.
`serve.sh` kann bleiben.

Keine Frameworks, kein Tailwind-CDN, kein Build-Schritt, keine externen Requests (keine Google Fonts, kein CDN). Die Seite muss direkt so auf GitHub Pages laufen.

## 3. Aufbau (beide Sprachen identisch, nur Texte unterscheiden sich)

```
<body>
  <main class="stage">
    <div class="scene">
      <div class="card">                 ← kippt und dreht sich
        <section class="face front">…  <span class="turn-hint" aria-hidden="true">↻</span></section>
        <section class="face back">…   <span class="turn-hint" aria-hidden="true">↻</span></section>
      </div>
      <button class="turn-sr" type="button" aria-controls="card">Turn card over</button>   ← visuell versteckt
    </div>
  </main>
</body>
```

### Vorderseite
- Oben links: schwarzer Punkt, 14×14px, rund, dekorativ (`aria-hidden="true"`)
- Oben rechts: Sprachwahl als Links: `EN / DE`. Die aktive Sprache ist nicht verlinkt und in `#111111`, die andere ist ein Link in `#6A6A70`. EN verlinkt auf `/`, DE auf `/de/`.
- Unten links: `<h1>Ronald Klaus</h1>`, darunter `Software Engineer · Berlin`
- Unten rechts in der Kartenecke: Dreh-Indikator (siehe 5.)

### Rückseite: zwei Spalten
Linke Spalte (flex 1), rechts davon eine 1px-Trennlinie `#E8E8E4`, 28px Innenabstand zur Linie:
- Foto rund, 56×56px, `object-fit: cover`, standardmäßig Graustufen (siehe 6.)
- Ein Satz (17px, line-height 1.4, letter-spacing -0.01em), unten in der Spalte

Rechte Spalte (flex 1.2):
- Label in Versalien (11px, letter-spacing 0.1em, `#6A6A70`): „Things I make“
- Drei Projekte untereinander, Abstand 10px. Je: Name fett (600) mit „↗“, darunter Beschreibung (13px, `#55555C`). Ganze Zeile ist der Link, `target` NICHT auf `_blank` setzen.
- Unten, durch 1px-Linie `#E8E8E4` getrennt: E-Mail-Link (fett) links, GitHub und LinkedIn rechts (`#55555C`), 13px
- Unten rechts in der Kartenecke, unterhalb der Kontaktzeile: Dreh-Indikator (siehe 5.)

Beide Spalten verteilen ihren Inhalt vertikal (`justify-content: space-between`).

## 4. Texte

### Englisch (`index.html`, `<html lang="en">`)
| Stelle | Text |
|---|---|
| Rolle | Software Engineer · Berlin |
| Satz | AI-focused engineer with a product mindset and 25+ years full-stack (Ruby, Elixir, TypeScript). I'd rather solve the right problem than the quick one. Off duty: dad, friend, photographer, somewhere between bike saddle and kettlebell. |
| Label | Things I make |
| bin dabei | RSVPs and shared costs for hobby groups |
| Merged | The blog for your website |
| Masi | The paper notebook, made digital |
| Versteckter Button vorne (`aria-label`) | Turn card over |
| Versteckter Button hinten (`aria-label`) | Turn card back |
| Foto-Alt | Portrait of Ronald Klaus |

### Deutsch (`de/index.html`, `<html lang="de">`)
| Stelle | Text |
|---|---|
| Rolle | Software Engineer · Berlin |
| Satz | KI-Engineer mit Produktblick und über 25 Jahren Full-Stack-Erfahrung (Ruby, Elixir, TypeScript). Ich löse lieber das richtige Problem als das schnelle. Privat: Vater, Freund, Fotograf und irgendwo zwischen Fahrradsattel und Kettlebell. |
| Label | Was ich baue |
| bin dabei | Wer kommt, wer zahlt was: für Hobbygruppen |
| Merged | Der Blog für deine Website |
| Masi | Das analoge Notizbuch, digital |
| Versteckter Button vorne (`aria-label`) | Karte umdrehen |
| Versteckter Button hinten (`aria-label`) | Karte zurückdrehen |
| Foto-Alt | Porträt von Ronald Klaus |

Die Button-Texte stehen als `data-label-front` / `data-label-back` am versteckten Button; `card.js` setzt daraus `aria-label` und Text und bleibt so sprachneutral.

### Links
- bin dabei: https://bindabei.live
- Merged: https://merged-app.de
- Masi: https://masibook.de
- E-Mail: mailto:ronald@ronald-klaus.de
- GitHub: https://github.com/RonaldKlaus
- LinkedIn: https://www.linkedin.com/in/ronald-klaus/

**Nicht erwähnen:** Prompteur, roadwerk, Adam. Keine lange Bio, kein Muscle-up-Text. Privates nur als kurze Aufzählung im Lead-Satz.

## 5. Gestaltung (exakte Werte)

| Token | Wert |
|---|---|
| Seitenhintergrund | `#E4E4E1` |
| Kartenpapier (beide Seiten) | `#FBFBF9` |
| Text | `#111111` |
| Text gedämpft | `#55555C` |
| Text leise / Labels | `#6A6A70` |
| Trennlinien | `#E8E8E4` |
| Schrift | Inter (selbst gehostet), Fallback `system-ui, sans-serif` |
| Basisgröße | 15px, line-height 1.5 |
| h1 | 36px, Gewicht 600, letter-spacing -0.03em, line-height 1.1 |
| Kartenbreite | 100 %, max. 640px |
| Seitenverhältnis Karte | `aspect-ratio: 1.75 / 1` |
| Eckenradius | 14px |
| Innenabstand vorne | 36px 40px |
| Innenabstand hinten | 28px 32px 36px (unten mehr Platz für den Dreh-Indikator) |
| Spaltenabstand hinten | 28px |
| Schatten | `Xpx Ypx 60px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.08)` (X/Y dynamisch, siehe 6.) |

Bühne: Karte allein zentriert (Flex, vertikal und horizontal), `min-height: 100svh`, Padding 40px 24px. Kein Button unter der Karte.

Dreh-Indikator (`.turn-hint`, je Seite einer): kein Bedienelement, sondern ein dezentes ↻ wie ein Prägedruck. Inline-SVG (Strich, 15px), `aria-hidden="true"`, nicht fokussierbar, `pointer-events: none` (ein Klick darauf ist ein Klick auf die Karte). Absolut 14px vom rechten und unteren Kartenrand, Farbe `#C4C4BF` (rein dekorativ, daher kein Kontrastziel). Beim Hover über die Karte (nur feiner Zeiger) minimal dunkler `#A8A8A3`. Er darf Text und Links nicht berühren (mindestens 4px Abstand, auch bei 320px und in DE).

Versteckter Dreh-Button (`.turn-sr`, genau einer, außerhalb beider Seiten in `.scene`, wird nie `inert`): visuell versteckt (sr-only). Erst bei Tastaturfokus (`:focus-visible`) erscheint er dezent unter der Karte (13px, `#111111`, 2px-Rahmen, min. 44px hoch).

Auf der Karte: `-webkit-tap-highlight-color: transparent` (kein blauer/grauer Kasten beim Tippen auf Android/iOS) und `touch-action: manipulation`.

Links: keine Unterstreichung, bei Hover Unterstreichung mit `text-underline-offset: 3px`.

## 6. Verhalten

### Umdrehen
- Klick oder Tap auf die Karte dreht sie um die Y-Achse um 180°. Der versteckte Button dreht ebenso (Tastatur, Screenreader).
- Der Karten-Klick reagiert nur auf das `click`-Event (ein Tap löst genau einmal aus, Scrollen nie). Nicht bei Klicks auf Links oder andere interaktive Elemente, nicht bei aktiver Textauswahl, nicht bei Mittelklick oder Modifier-Tasten. Die Karte bekommt kein `role="button"`, Tastaturbedienung läuft über den versteckten Button. Mit JS: `cursor: pointer` auf den Kartenflächen.
- Während des Umdrehens: `transition: transform .9s cubic-bezier(.34,1.3,.5,1)` (leichtes Nachfedern). Danach wieder die schnelle Tilt-Transition (siehe unten). Umsetzung: Klasse `.turning` setzen und nach 900ms entfernen.
- Fokus: Nach dem Drehen per verstecktem Button bleibt der Fokus auf ihm. Lag der Fokus vor dem Drehen auf einem Element der nun verdeckten Seite, geht er per `focus({preventScroll: true})` auf den versteckten Button statt auf `body`. Sonst (normaler Klick/Tap, Fokus auf `body`) wird der Fokus **nicht** verschoben: Programmatischer Fokus von `body` aus zeigt in Chromium und WebKit einen Fokusring, auf Mobil sah das nach jedem Tap aus wie ein schwarzer Kreis.
- Die jeweils verdeckte Seite bekommt `inert` UND `pointer-events: none`. **Wichtig:** Ohne `pointer-events: none` liegt die unsichtbare Seite über der sichtbaren und schluckt Hover und Klicks (Fehler aus dem Prototyp).
- Beide Seiten: `backface-visibility: hidden`. Vorderseite `transform: translateZ(1px)`, Rückseite `transform: rotateY(180deg) translateZ(1px)`. Die Karte hat `transform-style: preserve-3d`, die Szene `perspective: 1600px`.

### Tilt (nur Geräte mit Maus)
- Nur aktiv bei `matchMedia('(hover: hover) and (pointer: fine)')`.
- Die Mausposition wird relativ zur ganzen Bühne gemessen und auf `tx, ty ∈ [-1, 1]` normalisiert. Verlässt die Maus die Bühne, gehen beide auf 0.
- Karten-Transform: `rotateX(-ty * 8deg) rotateY(base + tx * 12deg)`, wobei `base` 0 oder 180 ist.
- Normale Transition: `transform .2s ease-out`.
- Updates über `requestAnimationFrame` bündeln (höchstens ein Update pro Frame). Werte über CSS-Custom-Properties setzen (`--rx`, `--ry`, `--gx`, `--gy`, `--shx`, `--shy`, `--band`), nicht über Inline-Styles einzelner Elemente.

### Lichtreflex
Jede Seite hat ein Overlay `.sheen` (absolut, `inset: 0`, `pointer-events: none`). **Der Reflex liegt UNTER dem Inhalt** (`.sheen { z-index: 0 }`, Inhalt `position: relative; z-index: 1`), damit schwarze Schrift schwarz bleibt und nur das Papier glänzt.

- Vorderseite:
  `radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,.85) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,.05) 100%), linear-gradient(115deg, rgba(255,255,255,0) calc(var(--band) - 18%), rgba(255,255,255,.55) var(--band), rgba(255,255,255,0) calc(var(--band) + 18%))`
- Rückseite: nur der radiale Teil mit `rgba(255,255,255,.7)` und `rgba(0,0,0,.04)`, horizontal gespiegelt (`--gx-back = 100% - --gx`), weil die Rückseite gedreht ist.
- Werte: `gx = 50 + tx*45 (%)`, `gy = 50 + ty*45 (%)`, `band = 50 + tx*40 (%)`.

### Schatten
`shx = -tx * 24px`, `shy = 36 - ty * 16px`. So verschiebt sich der Schatten entgegen der Neigung.

### Foto
- Standard `filter: grayscale(1)`, bei Hover `grayscale(0)`, `transition: filter .5s ease`.
- **Keine** Skalierung beim Hover (führte im Prototyp zu Flackern).

### Dreh-Hinweis (Anwackeln)
- Etwa 1 s nach dem Laden schwingt die Karte einmal um ca. 20° um die Y-Achse an und federt zurück (0,9 s), sodass man kurz die Kante sieht.
- Umsetzung: Klasse `.hint` mit einer Keyframe-Animation auf `--wiggle` (per `@property` als `<angle>` registriert), das zur Tilt-Drehung addiert wird: `rotateY(calc(var(--ry) + var(--wiggle)))`. So verträgt es sich mit gleichzeitiger Mausbewegung.
- Nur einmal pro Seitenaufruf und nur, solange noch nicht gedreht wurde. Ein Umdrehen vorher oder währenddessen bricht es ab. Nach dem ersten Umdrehen merkt `localStorage` (`rk-card-turned`, in try/catch) sich das, und bei späteren Besuchen entfällt der Hinweis.
- Entfällt bei `prefers-reduced-motion`, bei `?side=back` und `?tilt=…` sowie in Browsern ohne `@property`.

### Reduzierte Bewegung
Bei `prefers-reduced-motion: reduce`: kein Tilt, kein Reflex-Tracking (Reflex statisch in der Mitte), Umdrehen ohne Transition, kein Anwackeln.

### Ohne JavaScript
Das Script setzt beim Start `document.documentElement.classList.add('js')`. Nur unter `.js` gelten 3D-Transform, `position: absolute` der Seiten sowie Dreh-Indikator und versteckter Button. Ohne JS stehen Vorder- und Rückseite einfach untereinander als zwei flache Karten, Indikator und Button sind ausgeblendet.

### Laden und Cache
CSS und JS werden mit Versions-Query-String eingebunden (`/css/card.css?v=<8 Zeichen SHA-256 des Inhalts>`, ebenso `card.js`). Bei jeder Änderung der Datei den Wert in beiden HTML-Seiten erneuern, damit nie neues HTML mit altem Script aus dem Browser-Cache (GitHub Pages: `max-age=600`) zusammenkommt. `card.js` bricht bei fehlenden Elementen nicht ab, sondern überspringt nur die betroffenen Teile.

## 7. Mobil (Breite ≤ 560px)

- Karte im Hochformat: `aspect-ratio: 0.6 / 1`
- Rückseite: Spalten untereinander (`flex-direction: column`, gap 20px)
- Linke Spalte: keine vertikale Linie, stattdessen `border-bottom: 1px solid #E8E8E4`, `padding-bottom: 20px`, Inhalt oben ausgerichtet (`justify-content: flex-start`, gap 14px), `flex: 0 0 auto`
- Rechte Spalte: `flex: 1 1 auto`
- Kein Tilt auf Touch-Geräten (siehe 6.). Das Foto ist dort grau.

Text darf auf keiner Breite abgeschnitten werden. Falls 0.6/1 bei sehr kleinen Geräten (320px) nicht reicht, stattdessen `min-height` statt festem Seitenverhältnis verwenden.

## 8. Barrierefreiheit

- Ein einzelner, visuell versteckter `<button type="button">` mit `aria-controls` auf die Karte und `aria-label` je Sprache und Zustand. Er liegt außerhalb beider Seiten und ist nie `inert`; bei Tastaturfokus wird er sichtbar.
- Der Dreh-Indikator ist rein dekorativ (`aria-hidden`, nicht fokussierbar).
- Die verdeckte Seite ist `inert` (nicht fokussierbar, nicht vorgelesen).
- Nach dem Umdrehen per Button bleibt der Fokus auf dem Button. Liegt er auf der nun verdeckten Seite, wandert er auf den Button, nie auf `body`. Nach einem Tap wird kein Fokusring erzeugt.
- Kontraste: alle Textfarben oben erreichen mindestens 4.5:1 auf `#FBFBF9`. Nicht heller machen.
- Klickflächen der Links mindestens 44px hoch auf Mobil (Padding statt größerer Schrift).

## 9. SEO und Meta

Pro Sprache:
- `<title>`: EN „Ronald Klaus · Software Engineer, Berlin“, DE „Ronald Klaus · Software Engineer in Berlin“
- `<meta name="description">`: EN „Ronald Klaus, software engineer in Berlin. 25 years of Ruby, Elixir and TypeScript. Maker of bin dabei, Merged and Masi.“ / DE „Ronald Klaus, Software Engineer in Berlin. 25 Jahre Ruby, Elixir und TypeScript. Macht bin dabei, Merged und Masi.“
- `<link rel="canonical">` auf die eigene URL (`https://www.ronald-klaus.de/` bzw. `https://www.ronald-klaus.de/de/`)
- `hreflang`: `en` → `/`, `de` → `/de/`, `x-default` → `/` (auf beiden Seiten identisch)
- Open Graph und Twitter-Tags wie bisher, Texte aus `description`, `og:locale` je Sprache (`en_US` / `de_DE`)
- JSON-LD `Person` wie bisher übernehmen, aber:
  - `sameAs`: nur GitHub und LinkedIn (roadwerk entfernen)
  - `knowsAbout`: Ruby, Elixir, TypeScript, Software Architecture, UX Design
  - `description` passend zur Sprache
- `sitemap.xml`: zwei `<url>`-Einträge (`/` und `/de/`), jeweils mit beiden `xhtml:link`-Alternates, `lastmod` = Datum der Umsetzung

Kein Favicon vorhanden: ein schlichtes SVG-Favicon anlegen (schwarzer Kreis auf transparent, wie der Punkt auf der Karte) und in beiden Seiten einbinden.

## 10. Abnahmekriterien

1. `/` und `/de/` laden ohne Konsolenfehler und ohne einen einzigen Request an eine fremde Domain (im Network-Tab prüfen).
2. Desktop: Karte kippt mit der Maus, Reflex wandert, Schrift bleibt tiefschwarz, Schatten verschiebt sich.
3. Klick oder Tap auf die Karte (auch genau auf den Indikator, auch während und direkt nach dem Anwackeln, mehrfach hin und her) dreht genau einmal mit Nachfedern. Links drehen nicht. Danach reagiert die Karte sofort wieder auf die Maus. Kein sichtbarer Button unter der Karte, kein Fokusring und kein Tap-Highlight nach einem Tap. Dreh-Indikator unten rechts auf beiden Seiten, ohne Text oder Links zu berühren.
4. Auf der Rückseite reagiert das Foto zuverlässig auf Hover, und alle Links sind zuverlässig klickbar, auch wenn man mehrmals hin- und herdreht.
5. Mit Tastatur: Tab erreicht Sprachwahl und den versteckten Button, der dabei sichtbar wird (vorne), bzw. alle Links und den Button (hinten), nie Elemente der verdeckten Seite. Enter oder Leertaste dreht, der Fokus bleibt auf dem Button.
6. Breite 375px: Hochformat-Karte, Rückseite mit horizontaler Trennung, nichts abgeschnitten.
7. `prefers-reduced-motion`: keine Bewegung außer dem sofortigen Seitenwechsel (auch kein Anwackeln).
8. JavaScript deaktiviert: beide Seiten untereinander lesbar, alle Links funktionieren, kein Dreh-Indikator, kein Button.
9. Lighthouse (mobil): Performance, Accessibility, Best Practices und SEO jeweils ≥ 95.
10. Alte Dateien (`js/main.js`, `js/i18n.js`, `js/translations.js`) und alle Tailwind-Klassen sind entfernt.
11. Anwackeln: einmal etwa 1 s nach dem Laden, endet wieder bei 0°; nicht nach vorherigem Umdrehen, nicht beim nächsten Besuch, nicht mit `?side=back`/`?tilt=…`.

## 11. Später (nicht Teil dieser Umsetzung)

- Blog über Merged: Die Rückseite bekommt dann eine Zeile „Notes →“. Die Blogseiten erhalten ein schlichtes Papier-Layout im gleichen Stil (helles Blatt `#FBFBF9` auf `#E4E4E1`, Inter).
- Konzepte L (Gespräch, evtl. mit echtem Agent) und M (Jetzt gerade) liegen im Claude-Projekt „Portfolio“.
