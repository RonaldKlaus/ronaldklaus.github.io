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

Die ganze Seite ist eine einzige Visitenkarte auf grauem Grund. Vorne stehen Name und Rolle. Per Klick auf die Karte oder das kleine Dreh-Icon in ihrer Ecke dreht man sie um, und die Rückseite zeigt, wer Ronald ist, was er baut und wie man ihn erreicht. Die Karte kippt leicht mit der Maus, ein Lichtreflex wandert über das Papier.

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
        <section class="face front">…  <button class="turn-icon">↻</button></section>
        <section class="face back">…   <button class="turn-icon">↻</button></section>
      </div>
    </div>
  </main>
</body>
```

### Vorderseite
- Oben links: schwarzer Punkt, 14×14px, rund, dekorativ (`aria-hidden="true"`)
- Oben rechts: Sprachwahl als Links: `EN / DE`. Die aktive Sprache ist nicht verlinkt und in `#111111`, die andere ist ein Link in `#6A6A70`. EN verlinkt auf `/`, DE auf `/de/`.
- Unten links: `<h1>Ronald Klaus</h1>`, darunter `Software Engineer · Berlin`
- Unten rechts, gegenüber der h1: Dreh-Icon (siehe 5.)

### Rückseite: zwei Spalten
Linke Spalte (flex 1), rechts davon eine 1px-Trennlinie `#E8E8E4`, 28px Innenabstand zur Linie:
- Foto rund, 56×56px, `object-fit: cover`, standardmäßig Graustufen (siehe 6.)
- Ein Satz (17px, line-height 1.4, letter-spacing -0.01em), unten in der Spalte

Rechte Spalte (flex 1.2):
- Label in Versalien (11px, letter-spacing 0.1em, `#6A6A70`): „Things I make“, rechts daneben auf gleicher Höhe das Dreh-Icon (oben rechts auf der Rückseite)
- Drei Projekte untereinander, Abstand 10px. Je: Name fett (600) mit „↗“, darunter Beschreibung (13px, `#55555C`). Ganze Zeile ist der Link, `target` NICHT auf `_blank` setzen.
- Unten, durch 1px-Linie `#E8E8E4` getrennt: E-Mail-Link (fett) links, GitHub und LinkedIn rechts (`#55555C`), 13px

Beide Spalten verteilen ihren Inhalt vertikal (`justify-content: space-between`).

## 4. Texte

### Englisch (`index.html`, `<html lang="en">`)
| Stelle | Text |
|---|---|
| Rolle | Software Engineer · Berlin |
| Satz | 25 years of building software with Ruby, Elixir and TypeScript. I like tools that do one thing well. |
| Label | Things I make |
| bin dabei | RSVPs and shared costs for hobby groups |
| Merged | The blog for your website |
| Masi | A notebook for iPad that behaves like one |
| Icon vorne (`aria-label`) | Turn card over |
| Icon hinten (`aria-label`) | Turn card back |
| Foto-Alt | Portrait of Ronald Klaus |

### Deutsch (`de/index.html`, `<html lang="de">`)
| Stelle | Text |
|---|---|
| Rolle | Software Engineer · Berlin |
| Satz | Seit 25 Jahren baue ich Software mit Ruby, Elixir und TypeScript. Ich mag Werkzeuge, die eine Sache gut machen. |
| Label | Was ich baue |
| bin dabei | Zusagen und geteilte Kosten für Hobbygruppen |
| Merged | Der Blog für deine Website |
| Masi | Ein Notizbuch fürs iPad, das sich wie eins verhält |
| Icon vorne (`aria-label`) | Karte umdrehen |
| Icon hinten (`aria-label`) | Karte zurückdrehen |
| Foto-Alt | Porträt von Ronald Klaus |

Jede Seite hat ihr eigenes Icon mit statischem `aria-label` im HTML, damit `card.js` sprachneutral bleibt.

### Links
- bin dabei: https://bindabei.live
- Merged: https://merged-app.de
- Masi: https://masibook.de
- E-Mail: mailto:ronald@ronald-klaus.de
- GitHub: https://github.com/RonaldKlaus
- LinkedIn: https://www.linkedin.com/in/ronald-klaus/

**Nicht erwähnen:** Prompteur, roadwerk, Adam. Keine lange Bio, kein Muscle-up-Text, keine Familie.

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
| Innenabstand hinten | 28px 32px |
| Spaltenabstand hinten | 28px |
| Schatten | `Xpx Ypx 60px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.08)` (X/Y dynamisch, siehe 6.) |

Bühne: Karte allein zentriert (Flex, vertikal und horizontal), `min-height: 100svh`, Padding 40px 24px. Kein Button unter der Karte.

Dreh-Icon (`.turn-icon`, je Seite eins): echter `<button type="button">` ohne Rahmen und Hintergrund, Dreh-Symbol ↻ als Inline-SVG (Strich, 20px, `aria-hidden`), Farbe `#6A6A70`, Hover und Fokus `#111111`. Klickfläche 44×44px über Padding mit negativem Margin, damit das Layout nicht verrutscht. Sichtbarer Fokus-Ring für Tastatur (`:focus-visible`). Beim Hover dreht sich das Symbol einmal um 180° (nicht bei reduzierter Bewegung).

Links: keine Unterstreichung, bei Hover Unterstreichung mit `text-underline-offset: 3px`.

## 6. Verhalten

### Umdrehen
- Klick auf das Dreh-Icon dreht die Karte um die Y-Achse um 180°.
- Ein Klick oder Tap auf eine freie Fläche der Karte dreht sie ebenso (nur `click`-Event). Nicht bei Klicks auf Links oder andere interaktive Elemente, nicht bei aktiver Textauswahl, nicht bei Mittelklick oder Modifier-Tasten. Die Karte bekommt kein `role="button"`, Tastaturbedienung läuft über die Dreh-Icons. Mit JS: `cursor: pointer` auf den Kartenflächen.
- Während des Umdrehens: `transition: transform .9s cubic-bezier(.34,1.3,.5,1)` (leichtes Nachfedern). Danach wieder die schnelle Tilt-Transition (siehe unten). Umsetzung: Klasse `.turning` setzen und nach 900ms entfernen.
- Fokus: Wurde über das Icon gedreht (oder lag der Fokus auf der nun verdeckten Seite), wandert der Fokus per `focus({preventScroll: true})` auf das Icon der neuen Seite. `:focus-visible` entscheidet, ob ein Ring sichtbar ist. Der Fokus geht nie auf `body` verloren.
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
Bei `prefers-reduced-motion: reduce`: kein Tilt, kein Reflex-Tracking (Reflex statisch in der Mitte), Umdrehen ohne Transition, kein Anwackeln, keine Icon-Drehung beim Hover.

### Ohne JavaScript
Das Script setzt beim Start `document.documentElement.classList.add('js')`. Nur unter `.js` gelten 3D-Transform, `position: absolute` der Seiten und die Dreh-Icons. Ohne JS stehen Vorder- und Rückseite einfach untereinander als zwei flache Karten, und die Icons sind ausgeblendet.

## 7. Mobil (Breite ≤ 560px)

- Karte im Hochformat: `aspect-ratio: 0.6 / 1`
- Rückseite: Spalten untereinander (`flex-direction: column`, gap 20px)
- Linke Spalte: keine vertikale Linie, stattdessen `border-bottom: 1px solid #E8E8E4`, `padding-bottom: 20px`, Inhalt oben ausgerichtet (`justify-content: flex-start`, gap 14px), `flex: 0 0 auto`
- Rechte Spalte: `flex: 1 1 auto`
- Kein Tilt auf Touch-Geräten (siehe 6.). Das Foto ist dort grau.

Text darf auf keiner Breite abgeschnitten werden. Falls 0.6/1 bei sehr kleinen Geräten (320px) nicht reicht, stattdessen `min-height` statt festem Seitenverhältnis verwenden.

## 8. Barrierefreiheit

- Jedes Dreh-Icon ist ein echtes `<button type="button">` mit `aria-label` je Sprache und Seite und `aria-controls` auf die Karte. Da die verdeckte Seite `inert` ist, ist immer nur das Icon der sichtbaren Seite fokussierbar.
- Die verdeckte Seite ist `inert` (nicht fokussierbar, nicht vorgelesen).
- Nach dem Umdrehen per Icon steht der Fokus auf dem Icon der neuen Seite, nie auf `body`.
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
3. Dreh-Icon und Klick auf eine freie Kartenfläche drehen die Karte genau einmal mit Nachfedern. Links drehen nicht. Danach reagiert die Karte sofort wieder auf die Maus. Kein Button unter der Karte, die Karte steht allein zentriert.
4. Auf der Rückseite reagiert das Foto zuverlässig auf Hover, und alle Links sind zuverlässig klickbar, auch wenn man mehrmals hin- und herdreht.
5. Mit Tastatur: Tab erreicht Sprachwahl und Dreh-Icon (vorne) bzw. Dreh-Icon und alle Links (hinten), nie Elemente der verdeckten Seite. Enter auf dem Icon dreht, danach steht der Fokus auf dem Icon der anderen Seite.
6. Breite 375px: Hochformat-Karte, Rückseite mit horizontaler Trennung, nichts abgeschnitten.
7. `prefers-reduced-motion`: keine Bewegung außer dem sofortigen Seitenwechsel (auch kein Anwackeln).
8. JavaScript deaktiviert: beide Seiten untereinander lesbar, alle Links funktionieren, keine Dreh-Icons.
9. Lighthouse (mobil): Performance, Accessibility, Best Practices und SEO jeweils ≥ 95.
10. Alte Dateien (`js/main.js`, `js/i18n.js`, `js/translations.js`) und alle Tailwind-Klassen sind entfernt.
11. Anwackeln: einmal etwa 1 s nach dem Laden, endet wieder bei 0°; nicht nach vorherigem Umdrehen, nicht beim nächsten Besuch, nicht mit `?side=back`/`?tilt=…`.

## 11. Später (nicht Teil dieser Umsetzung)

- Blog über Merged: Die Rückseite bekommt dann eine Zeile „Notes →“. Die Blogseiten erhalten ein schlichtes Papier-Layout im gleichen Stil (helles Blatt `#FBFBF9` auf `#E4E4E1`, Inter).
- Konzepte L (Gespräch, evtl. mit echtem Agent) und M (Jetzt gerade) liegen im Claude-Projekt „Portfolio“.
