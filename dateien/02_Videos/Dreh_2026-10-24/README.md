# Dreh 24.10.2026, fertige Schnitte

Rohmaterial: `~/Movies/Video Cut/Pizzary/` (85 Videos, 5 Fotos, ca. 58 Minuten, 4K hochkant).
Alle Videos sind 1080x1920, 25 fps, Ton normalisiert auf -14 LUFS.

## Ordner

| Ordner | Inhalt |
|---|---|
| `Fertig/1_Signature_Zubereitung` | 8 Videos, Zeitraffer der besten Szenen (Sauce, Käse, Belag, Ofen, Schneiden), ohne Ton |
| `Fertig/2_Signature_Vorstellung` | 8 Videos, Steve stellt die Pizza vor, bei einigen mit Taste Test |
| `Fertig/3_TikTok_Schnitte` | 12 Videos, 12 bis 51 Sekunden |
| `Fertig/4_Business_Interview` | 11 Videos, nur Steves Antworten, keine Fragen |
| `Fertig/5_Preisvergleich` | 2 Videos mit Piepton auf Markennamen und eingeblendeten Preisen |
| `Vorschau/` | gleiche Videos klein (540x960), zum schnellen Anschauen |
| `_arbeit/` | Schnittlisten (`edl/`), Skripte, Transkripte, Proxys |

## Stand 25.10. Aus Naders Resolve Schnitten (aktuell, gilt)

Nader hat alle Timelines in DaVinci selbst geschnitten und gegradet. Der Schnitt bleibt unberührt, es kamen nur Overlays, Ton und Untertitel dazu.
Ordner `Fertig_aus_Resolve/` (Vorschau klein in `Vorschau_aus_Resolve/`), 40 Videos:

- `1_Signature_Zubereitung` (8): Naders Bild, pro Szene nur so lange wie die Stimme spricht (Rest der Szene weggeschnitten, 13 bis 25 Sekunden), Higgsfield Sprecherin je Szene (ein Satz pro Segment), Musik aus den Downloads (4 Beats im Wechsel, Sprecher dominiert), Kopf der Figur beim Namen, Untertitel.
- `2_Signature_Vorstellung` (8): Köpfe bei Namensnennung (Yuki, Renate, Moni, Günni, Sam, Malik), große Topping Schalen mittig beim Aussprechen, Untertitel.
- `3_TikTok_Schnitte` (11): 01 bis 08 mit Untertiteln, 09 mit Trap Beat, 10 (Montage mit Köpfen und Musik) und 11 (ASMR, ohne Ton) unverändert.
- `4_Business_Interview` (11): Untertitel.
- `5_Preisvergleich` (2): aus den ffmpeg Fassungen übernommen, noch nicht in Resolve neu geschnitten.
- Skripte: `_arbeit/scripts/post_resolve.py` (Vorstellung, TikTok, Interview), `post_zubereitung.py`, Segmentzeiten in `_arbeit/resolve_segments.json`. Die älteren ffmpeg Schnitte liegen weiter in `Fertig/`.
- Untertitel kommen aus Spracherkennung mit Korrekturregeln (`sub_rules.py`), bitte kurz gegenlesen. Interview 05 endet im Bild mit "also ich habe noch keine" (so in Naders Schnitt).

## Stand 24.10. abends (ältere ffmpeg Fassung in `Fertig/`)

- Zubereitung: zusätzlich `*_Sprecher.mp4` mit deutscher Higgsfield Stimme (Soraya, Modell elevenlabs_v4), je Satz ein Schnitt. Texte in `_arbeit/edl/sprecher.py`. Noch ohne Musik.
- Preisvergleiche: Markenname beim Aussprechen oben im Bild, leicht verpixelt und weichgezeichnet, zusätzlich Piepton. Zutaten und Preise dick und freistehend ohne Kasten.
- Musik offen: Higgsfield hat im Katalog kein Musikmodell für freie Nutzung, ChatCut hat keine Credits mehr. Betrifft die 8 Zubereitung Sprecher Videos, TikTok 09 (Satisfying Schneiden) und TikTok 10 (8 Pizzen). Der Mixer für Sprecher plus Musik ist fertig (`_arbeit/scripts/voice_retime.py <musikdatei>`), es fehlt nur der Track.
- Zubereitung Sprecher: Bild ist auf die Länge der Sätze gekürzt (11 bis 25 Sekunden).
- Alle Videos mit Sprache haben Untertitel im unteren Drittel. Die Fassungen ohne Untertitel liegen in `Fertig_ohne_Untertitel/`. Die Untertitel stammen aus Spracherkennung mit manuellen Korrekturen, bitte kurz gegenlesen.
- Vorstellungen: Naders Zurufe ("Action") sind an allen Schnitträndern entfernt, Topping Schalen links beim Aussprechen, Cartoon Figur bei Günni und Renate.
- TikTok 10: Köpfe der Figuren zu Yuki, Renate, Moni, Günni, Sam, Malik. Für Lennart und Steve Pizza gibt es keine Figur.
- TikTok 12 (Gorgonzola) ist gelöscht. Interview 05 endet vor dem abgebrochenen Satz "Also ich habe noch keine".
- Regel gespeichert: "Action" und Zurufe des Kameramanns nie reinschneiden.

## Offene Punkte zum Prüfen

- **Preisvergleich 1:** Die genannten Einzelpreise addieren sich auf 39,21 €, Steve nennt am Ende 36,51 €. Eingeblendet ist der genannte Betrag.
- **Pixeln:** In den Vergleichsclips ist keine Marke lesbar im Bild (das Handy Display zeigt zu Steve). Gepiept sind "Domino's" und "Call a Pizza".
- **Malik Vorstellung:** Steve nennt eine Zutat, die wie "Bacon" klingt. In der Zubereitung sind Salami, Champignons und rote Zwiebeln zu sehen.
- **Vegan Chicken:** Der Einstieg "Ich weiß nicht, wie man Veganer sein kann" ist bewusst weggelassen. Der Clip steht in `P1000329` bei 0 bis 7 Sekunden.
- **Günni Vorstellung:** Der Satz "obwohl ich keine Pizza mag" ist herausgeschnitten.
- **Nicht verwendet:** `P1000334` (privater Anruf), Aufnahmen mit Gästen im Bild.

## Resolve

Projekt "Pizzary Dreh 2026-10-24": 38 Schnitt Timelines im Ordner "Timelines", Rohmaterial im Ordner "Rohmaterial".
Die zwei Preisvergleiche und die 8 Pizzen Montage (mit Piepton, Preisen und Namenschips) sind aus ffmpeg gerendert und noch nicht als Timeline in Resolve.
