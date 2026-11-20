# Hall of Pizzary

Wand im Laden (The Pizzary): Jeder Food Influencer mit eigener Signature Pizza bekommt einen A4 Bilderrahmen.
Aufbau: Portraitfoto oben, in der Mitte "<Name> testet" mit Instagram QR, darunter das Comic Emoji.
Die Buchstaben "Hall of Pizzary" druckt Steve gerade im 3D Druck und klebt sie an die Wand.

**Enthüllung:** Dienstag 03.11.2026, 17:00 Uhr, Ali ist dabei.

## Rahmen bauen

```
python3 -I tools/bauen.py --name Ali --titel "Stiftung Ali testet" --handle <instagram_handle> --pizza "<Pizzaname>" \
    --kicker "Seine eigene Signature Pizza" --foto Ali/ali_foto.jpg --foto-pos "50% 22%" --emoji Ali/ali_emoji_alpha.png --out Ali_Hall_of_Pizzary
```

Ausgabe in `Rahmen/` als PDF (Druck) und PNG (3x). Optionen: `--foto-pos "50% 20%"` rückt das Gesicht zurecht,
`--emoji-bg "#FFC31E"` ändert die Farbe unter dem Emoji. Ohne `--handle` entfällt der QR Code.
Das Layout liegt in `tools/vorlage.html`, Marke: Archivo Black, Luckiest Guy, Gochi Hand, Farben der Website.

## Aktuelle Fassung Ali (30.10.2026)

`Rahmen/Ali_Flyer_CI.pdf` und `.png` (A4 Flyer): einfarbig Tomato red, ohne QR Code, Instagram `@alipekerfilms` als Text, Pizza "Stiftung Alis Spezial Pizza". Gebaut mit:

```
python3 -I tools/poster.py --stil ci --name Ali --titel "Stiftung Ali testet" --handle alipekerfilms --ohne-qr \
    --pizzaname "Stiftung Alis Spezial Pizza" --foto Ali/ali_foto.jpg --figur Ali/ci_figur_alpha.png \
    --pizza Ali/alis_pizza_ganz_alpha.png --out Ali_Flyer_CI
```

Mit QR Code: `--ohne-qr` weglassen. Pizza: Foto von Alis Pizza, von Nader gewünscht als ganze Pizza (Schnitte entfernt) und mit mehr Farbe. Das ist eine KI Retusche (Higgsfield gpt_image_2_5, Freistellung danach), Belag und Positionen folgen dem Original, Details sind neu gerendert: `Ali/alis_pizza_ganz_alpha.png`. Original Pixel (geschnitten, nur freigestellt) bleiben in `Ali/alis_pizza_original.jpg` und `Ali/alis_pizza_alpha.png`, farbkorrigiert `Ali/alis_pizza_alpha_farbe.png`. `--pizza Ali/alis_pizza_ganz_alpha.png`.

Kiosk Dateien (gleiches Format wie die anderen Signature Pizzen: 2000 x 2000 transparent, 8 % Rand, dazu jpg weiß und webp 800 und 400): `Kiosk/the-pizzary_pizza-alis-spezial*`.

## Offen für Ali


## Poster in der CI der Pizzary (Standard)

`Rahmen/Ali_Poster_CI.pdf` und `.png`. Echte CI Bausteine: Charakterköpfe Pattern auf Tomatenrot (Nachbau aus dem Markenhandbuch, 2x2 gespiegelt gekachelt, `Design/ci/pattern.jpg`), Schriften Bright Dreams und Bisko, Siegel Logo, gezackte Störer in Cheesy und Berlin Sky, Fotokarte mit lila Versatzschatten, Pizza im Sechseck wie auf der Pizzabox, Sprechblase mit dem Claim. Hintergrund seit 30.10.2026 einfarbig Tomato red (`--bg-farbe "#BE2337"`, andere CI Farbe möglich, `--bg-muster` bringt das Pattern zurück). Unten rechts QR Karte mit @Name: `--handle <instagram_handle>` setzt QR Code und Schrift, ohne Handle steht dort der Platzhalter "QR" und "@ ?". Bauen mit `tools/poster.py --stil ci` (Standard), Aufruf wie unten.

## Poster Variante (Pop Art)

`Rahmen/Ali_Poster.pdf` und `.png`: Comic Hintergrund (Higgsfield, `Design/hintergrund.png`), Alis Foto, CI Figur (die ausgewählte Figur mit Pizza über dem Kopf, `Ali/ci_figur_alpha.png`, Originale vom 26.10. in `Ali/ci_*_original.jpeg`), echte Pizza und Banner "Stiftung Ali testet". Die Pizza ist aktuell der Platzhalter Pizza Steve (`Ali/pizza_platzhalter_steve_alpha.png`). Sobald das echte Foto von Alis Pizza da ist, freigestellt unter `Ali/` ablegen und neu bauen:

```
python3 -I tools/poster.py --name Ali --titel "Stiftung Ali testet" --foto Ali/ali_foto.jpg \
    --figur Ali/ci_figur_alpha.png --pizza <alis_pizza_alpha.png> --out Ali_Poster [--handle <instagram_handle>]
```

## Fertig

- **Ali Bild A4 fertig:** `Rahmen/Ali_Hall_of_Pizzary.pdf` und `.png` (30.10.2026). Foto `Ali/ali_foto.jpg`, Comic Emoji `Ali/ali_emoji_alpha.png` (aus dem Foto neu erzeugt, ein früheres Emoji war nirgends auffindbar). Kanalname im Streifen: "Stiftung Ali testet" (steht im Hintergrund des Fotos).

- Add-on Bilder fürs SOT, freigestellt mit Alpha, 1024 x 1024, Schüssel von oben formatfüllend wie die anderen Toppings: `Addon_Bilder/hot_honey_glaze_alpha.png`, `Addon_Bilder/burrata_stracciatella_alpha.png` (30.10.2026). Die ersten Versionen mit Holztisch liegen in `Addon_Bilder/alt_mit_holz/`.
- Rahmenvorlage und Bauskript

## SOT Produktbild Alis Pizza mit Kopf und Sprechblase (03.11.2026)

`Kiosk/the-pizzary_pizza-alis-spezial_kopf_sprechblase.png` (2000 x 2000, transparent, rund 8 % Rand wie die anderen Produktbilder) `_alpha_maske.png` (reine Alpha Maske, 8 Bit Graustufen, Weiß = sichtbar, Schwarz = transparent, identisch mit dem Alpha Kanal der transparenten Datei) und `_weiss.png` (gleiches Bild auf Weiß). Ohne Schatten, Alpha bereinigt (Pizza Retusche hatte fast deckende Werte 231 bis 254, jetzt 255, nur die Kante bleibt weich). Stil nach Naders Beispiel: große Pizza, Alis Kopf im CI Stil (`Ali/ci_kopf_alpha.png`, freigestellt) unten links auf der Pizza, breite Sprechblase unten rechts mit den Zutaten in Bright Dreams. Zutaten laut Nader (03.11.2026), Reihenfolge so: Salami, Burrata Stracciatella Style, Oliven, Champignons, Mais, Peperoni (keine Zwiebeln). Der Käse heißt "Burrata Stracciatella Style". Bauen: `python3 -I tools/sot_bild.py [--zeilen "SALAMI, BURRATA|STRACCIATELLA STYLE,|OLIVEN, CHAMPIGNONS,|MAIS, PEPERONI"]` (Quellen in `SOT/assets/`). Die Pizza ist die KI retuschierte "ganze" Version (siehe oben).
