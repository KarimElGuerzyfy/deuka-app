import type { Centurion } from '../types'

// First centurion of A1 — 100 highest frequency German words
const a1: Centurion[] = [
  {
    centurionNumber: 1,
    buckets: [
      {
        bucketNumber: 1,
        words: [
          { id: '1', de: 'der/die/das', en: 'the', sentence: 'Der Mann und die Frau kochen, das Kind spielt.', category: 'article' },
          { id: '2', de: 'und', en: 'and', sentence: 'Die Eltern und Kinder essen und sprechen über ihren Tag.', category: 'conjunction' },
          { id: '3', de: 'in', en: 'in', sentence: 'Günter geht in den Keller.', category: 'preposition' },
          { id: '4', de: 'sein', en: 'to be', sentence: 'Ich bin Lehrer und du bist Polizist.', category: 'verb' },
          { id: '5', de: 'ein', en: 'a, an', sentence: 'Er wohnt in einem Hotel.', category: 'article' },
          { id: '6', de: 'haben', en: 'to have', sentence: 'Ich habe ein Buch in der Hand.', category: 'verb' },
          { id: '7', de: 'sie', en: 'she / they', sentence: 'Petra und Klaus kochen, sie bekommen Besuch.', category: 'pronoun' },
          { id: '8', de: 'werden', en: 'to become / will', sentence: 'Der Junge wird zum Mann.', category: 'verb' },
          { id: '9', de: 'von', en: 'from, of', sentence: 'Benjamin ist der Bruder von Anna.', category: 'preposition' },
          { id: '10', de: 'ich', en: 'I', sentence: 'Ich arbeite und du bleibst zu Hause.', category: 'pronoun' },
        ]
      },
      {
        bucketNumber: 2,
        words: [
          { id: '11', de: 'nicht', en: 'not', sentence: 'Im Restaurant darf man nicht rauchen.', category: 'adverb' },
          { id: '12', de: 'es', en: 'it', sentence: 'Das Kind geht ins Bett, es ist müde.', category: 'pronoun' },
          { id: '13', de: 'mit', en: 'with', sentence: 'Mein Bruder spielt mit Janosch Fußball.', category: 'preposition' },
          { id: '14', de: 'sich', en: 'oneself', sentence: 'Das Kind sieht sich im Spiegel.', category: 'pronoun' },
          { id: '15', de: 'er', en: 'he', sentence: 'Jan hat gute Noten, er ist ein kluges Kind.', category: 'pronoun' },
          { id: '16', de: 'auf', en: 'on, at', sentence: 'Auf dem Tisch steht ein Glas Wasser.', category: 'preposition' },
          { id: '17', de: 'für', en: 'for', sentence: 'Sie macht einen Kaffee für Max.', category: 'preposition' },
          { id: '18', de: 'auch', en: 'also', sentence: 'Auch ich habe Geburtstag.', category: 'adverb' },
          { id: '19', de: 'an', en: 'at, on', sentence: 'Das Bild hängt an der Wand.', category: 'preposition' },
          { id: '20', de: 'dass', en: 'that', sentence: 'Ich vermute, dass der Zug zu spät kommt.', category: 'conjunction' },
        ]
      },
      {
        bucketNumber: 3,
        words: [
          { id: '21', de: 'zu', en: 'to, too', sentence: 'Heute gehe ich zu meiner Nachbarin.', category: 'preposition' },
          { id: '22', de: 'als', en: 'as, than, when', sentence: 'Tim ist älter als sie.', category: 'conjunction' },
          { id: '23', de: 'können', en: 'can', sentence: 'Die Kinder können schon Fahrrad fahren.', category: 'verb' },
          { id: '24', de: 'wie', en: 'how, as', sentence: 'Wie lange dauert es?', category: 'adverb' },
          { id: '25', de: 'wir', en: 'we', sentence: 'Wir fahren im Sommer.', category: 'pronoun' },
          { id: '26', de: 'so', en: 'so', sentence: 'Das Wetter ist heute so schön.', category: 'adverb' },
          { id: '27', de: 'bei', en: 'by, at, with', sentence: 'Jan ist bei einem neuen Arzt.', category: 'preposition' },
          { id: '28', de: 'aber', en: 'but', sentence: 'Die Sonne scheint, aber es ist kalt.', category: 'conjunction' },
          { id: '29', de: 'man', en: 'one, people', sentence: 'Hier erzählt man sich Geschichten.', category: 'pronoun' },
          { id: '30', de: 'noch', en: 'still, yet', sentence: 'Habt ihr noch Fragen?', category: 'adverb' },
        ]
      },
      {
        bucketNumber: 4,
        words: [
          { id: '31', de: 'nach', en: 'after, toward', sentence: 'Nach dem Mittagessen gehen wir spazieren.', category: 'preposition' },
          { id: '32', de: 'oder', en: 'or', sentence: 'Kommst du mit dem Fahrrad oder mit dem Bus?', category: 'conjunction' },
          { id: '33', de: 'all', en: 'all', sentence: 'Wir freuen uns alle auf den Urlaub.', category: 'adjective' },
          { id: '34', de: 'aus', en: 'out of, from', sentence: 'Thomas schaut aus dem Fenster.', category: 'preposition' },
          { id: '35', de: 'was', en: 'what', sentence: 'Was sagst du?', category: 'pronoun' },
          { id: '36', de: 'nur', en: 'only', sentence: 'Das kostet nur zwei Euro.', category: 'adverb' },
          { id: '37', de: 'sagen', en: 'to say', sentence: 'Der Kollege sagt ihr, wo sie die Schlüssel findet.', category: 'verb' },
          { id: '38', de: 'dann', en: 'then', sentence: 'Erst gehen wir einkaufen und dann ins Restaurant.', category: 'adverb' },
          { id: '39', de: 'wenn', en: 'if, when', sentence: 'Ich erzähle es dir, wenn wir uns sehen.', category: 'conjunction' },
          { id: '40', de: 'müssen', en: 'must', sentence: 'Ich muss um neun zu Hause sein.', category: 'verb' },
        ]
      },
      {
        bucketNumber: 5,
        words: [
          { id: '41', de: 'um', en: 'around, in order to', sentence: 'Die Kinder laufen um den Baum.', category: 'preposition' },
          { id: '42', de: 'ja', en: 'yes', sentence: 'Ja, ich verstehe das.', category: 'adverb' },
          { id: '43', de: 'kein', en: 'no, none', sentence: 'Sie haben keine Chance.', category: 'article' },
          { id: '44', de: 'über', en: 'over, about', sentence: 'Über mir fliegt ein Flugzeug.', category: 'preposition' },
          { id: '45', de: 'da', en: 'there, because', sentence: 'Da hinten steht mein Auto.', category: 'adverb' },
          { id: '46', de: 'geben', en: 'to give', sentence: 'Timo gibt dem Verkäufer die Bücher.', category: 'verb' },
          { id: '47', de: 'vor', en: 'before, in front of', sentence: 'Laura wartet vor der Tür.', category: 'preposition' },
          { id: '48', de: 'mein', en: 'my', sentence: 'Anna ist meine kleine Schwester.', category: 'pronoun' },
          { id: '49', de: 'mehr', en: 'more', sentence: 'Ich möchte mehr Brot.', category: 'adverb' },
          { id: '50', de: 'das Jahr', en: 'year', sentence: 'Ein Jahr hat 52 Wochen.', category: 'noun' },
        ]
      },
      {
        bucketNumber: 6,
        words: [
          { id: '51', de: 'du', en: 'you', sentence: 'Wer bist du?', category: 'pronoun' },
          { id: '52', de: 'durch', en: 'through', sentence: 'Ralf läuft durch die Stadt.', category: 'preposition' },
          { id: '53', de: 'viel', en: 'much, many', sentence: 'Ich gebe im Urlaub viel Geld aus.', category: 'adjective' },
          { id: '54', de: 'wollen', en: 'to want', sentence: 'Die Kinder wollen spielen.', category: 'verb' },
          { id: '55', de: 'machen', en: 'to do, make', sentence: 'Die Schüler machen ihre Aufgaben.', category: 'verb' },
          { id: '56', de: 'sollen', en: 'should', sentence: 'Ihr sollt leise sein.', category: 'verb' },
          { id: '57', de: 'schon', en: 'already', sentence: 'Günter arbeitet schon seit 30 Jahren hier.', category: 'adverb' },
          { id: '58', de: 'kommen', en: 'to come', sentence: 'Wir kommen morgen Abend zu dir.', category: 'verb' },
          { id: '59', de: 'immer', en: 'always', sentence: 'Ich esse immer eine Scheibe Brot.', category: 'adverb' },
          { id: '60', de: 'gehen', en: 'to go', sentence: 'Wir gehen heute ins Theater.', category: 'verb' },
        ]
      },
      {
        bucketNumber: 7,
        words: [
          { id: '61', de: 'groß', en: 'big', sentence: 'Florian hat eine große Wohnung.', category: 'adjective' },
          { id: '62', de: 'hier', en: 'here', sentence: 'Hier ist mein Zimmer.', category: 'adverb' },
          { id: '63', de: 'ganz', en: 'whole, quite', sentence: 'Das ganze Zimmer ist leer.', category: 'adjective' },
          { id: '64', de: 'zwei', en: 'two', sentence: 'Anna hat zwei Schwestern.', category: 'number' },
          { id: '65', de: 'also', en: 'so, therefore', sentence: 'Das ist also der neue Schüler.', category: 'conjunction' },
          { id: '66', de: 'jetzt', en: 'now', sentence: 'Wir müssen jetzt ins Bett.', category: 'adverb' },
          { id: '67', de: 'doch', en: 'however, after all', sentence: 'Heute scheint die Sonne, doch ich bleibe zu Hause.', category: 'conjunction' },
          { id: '68', de: 'wieder', en: 'again', sentence: 'Lea kommt wieder zu spät.', category: 'adverb' },
          { id: '69', de: 'gut', en: 'good', sentence: 'Die Blumen riechen gut.', category: 'adjective' },
          { id: '70', de: 'bis', en: 'until', sentence: 'Meine Mutter arbeitet bis sieben Uhr.', category: 'preposition' },
        ]
      },
      {
        bucketNumber: 8,
        words: [
          { id: '71', de: 'wissen', en: 'to know', sentence: 'Max weiß viel.', category: 'verb' },
          { id: '72', de: 'sehen', en: 'to see', sentence: 'Er kann besser sehen.', category: 'verb' },
          { id: '73', de: 'sehr', en: 'very', sentence: 'Sie ist eine sehr gute Ärztin.', category: 'adverb' },
          { id: '74', de: 'lassen', en: 'to let', sentence: 'Lass mich gehen!', category: 'verb' },
          { id: '75', de: 'neu', en: 'new', sentence: 'Ich habe eine neue Tasche.', category: 'adjective' },
          { id: '76', de: 'stehen', en: 'to stand', sentence: 'Die Fahrräder stehen im Keller.', category: 'verb' },
          { id: '77', de: 'jede', en: 'every', sentence: 'Wir fahren jeden Sommer in den Urlaub.', category: 'adjective' },
          { id: '78', de: 'weil', en: 'because', sentence: 'Frederiks Mutter steht früh auf, weil sie arbeiten muss.', category: 'conjunction' },
          { id: '79', de: 'unter', en: 'under', sentence: 'Unter der Brücke fließt ein Fluss.', category: 'preposition' },
          { id: '80', de: 'der Mensch', en: 'human being', sentence: 'Es gibt über sieben Milliarden Menschen auf der Welt.', category: 'noun' },
        ]
      },
      {
        bucketNumber: 9,
        words: [
          { id: '81', de: 'denn', en: 'because, for', sentence: 'Heute sind alle Geschäfte geschlossen, denn es ist Sonntag.', category: 'conjunction' },
          { id: '82', de: 'das Beispiel', en: 'example', sentence: 'Das Beispiel passt nicht gut zu diesem Argument.', category: 'noun' },
          { id: '83', de: 'erste', en: 'first', sentence: 'Jonah feiert heute seinen ersten Geburtstag.', category: 'adjective' },
          { id: '84', de: 'die Zeit', en: 'time', sentence: 'Jannik braucht viel Zeit für seine Aufgabe.', category: 'noun' },
          { id: '85', de: 'lang', en: 'long', sentence: 'Mit ihren langen Beinen rennt sie schneller als Max.', category: 'adjective' },
          { id: '86', de: 'leben', en: 'to live', sentence: 'Frauen leben länger als Männer.', category: 'verb' },
          { id: '87', de: 'das Leben', en: 'life', sentence: 'Das Leben ist nicht immer leicht.', category: 'noun' },
          { id: '88', de: 'uns', en: 'us', sentence: 'Wir freuen uns darauf.', category: 'pronoun' },
          { id: '89', de: 'ihn', en: 'him', sentence: 'Ich treffe ihn immer am Donnerstag.', category: 'pronoun' },
          { id: '90', de: 'ihm', en: 'him (dative)', sentence: 'Sie gibt ihm die Schlüssel.', category: 'pronoun' },
        ]
      },
      {
        bucketNumber: 10,
        words: [
          { id: '91', de: 'mir', en: 'me (dative)', sentence: 'Gibst du mir dein Fahrrad?', category: 'pronoun' },
          { id: '92', de: 'mich', en: 'me', sentence: 'Timo setzt sich neben mich.', category: 'pronoun' },
          { id: '93', de: 'unser', en: 'our', sentence: 'Unser Verein hat das Spiel verloren.', category: 'pronoun' },
          { id: '94', de: 'ihr', en: 'you (plural) / her', sentence: 'Bitte geben Sie Ihr Blatt ab.', category: 'pronoun' },
          { id: '95', de: 'das Mal', en: 'time, occasion', sentence: 'Das mache ich das nächste Mal besser.', category: 'noun' },
          { id: '96', de: 'dies', en: 'this', sentence: 'Besonders dieses Bild gefällt mir.', category: 'pronoun' },
          { id: '97', de: 'einer', en: 'one, someone', sentence: 'Dieses Problem ist nur eines von vielen.', category: 'pronoun' },
          { id: '98', de: 'andere', en: 'other', sentence: 'Es gibt noch einen anderen Weg.', category: 'adjective' },
          { id: '99', de: 'schnell', en: 'fast, in front of', sentence: 'Das Auto fährt sehr schnell.', category: 'adjective' },
          { id: '100', de: 'klein', en: 'small', sentence: 'das Kind hat eine kleine Katze.', category: 'adjective' },
        ]
      },
    ]
  }
]

export default a1