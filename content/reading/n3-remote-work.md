---
id: n3-remote-work
level: N3
title: "New remote-work rules"
titleJa: "{在宅勤務|ざいたくきんむ}についてのお{知|し}らせ"
summary: "An HR notice about how often you can work from home and how to apply."
genre: notice
politeness: keigo
minutes: 5
paragraphs:
  - ja: "{来月|らいげつ}から、{週|しゅう}に{二日|ふつか}まで{在宅勤務|ざいたくきんむ}ができるようになります。"
    en: "From next month, you will be able to work from home up to two days a week."
  - ja: "{在宅勤務|ざいたくきんむ}をする{場合|ばあい}は、{前|まえ}の{週|しゅう}の{金曜日|きんようび}までに{上司|じょうし}に{申請|しんせい}してください。"
    en: "If you want to work from home, apply to your manager by the Friday of the previous week."
  - ja: "また、{勤務中|きんむちゅう}はいつでも{連絡|れんらく}が{取|と}れるようにしておいてください。"
    en: "Also, make sure you can be reached at any time during working hours."
  - ja: "ご{不明|ふめい}な{点|てん}は、{人事部|じんじぶ}までお{問|と}い{合|あ}わせください。"
    en: "If anything is unclear, please contact the HR department."
glossary:
  - { word: "在宅勤務", reading: "ざいたくきんむ", meaning: "working from home" }
  - { word: "上司", reading: "じょうし", meaning: "your manager, superior" }
  - { word: "申請", reading: "しんせい", meaning: "application, request (formal)" }
  - { word: "勤務中", reading: "きんむちゅう", meaning: "during working hours" }
  - { word: "人事部", reading: "じんじぶ", meaning: "HR department" }
questions:
  - id: q1
    type: multiple-choice
    prompt: "How many days a week can you work from home?"
    choices:
      - { text: "Up to two days", correct: true }
      - { text: "Every day", feedback: "There's a limit: 週に二日まで." }
      - { text: "Only on Fridays", feedback: "Close! Friday is the deadline to apply, not the remote day." }
    explanation: "週に二日まで: up to two days a week. まで sets the upper limit."
  - id: q2
    type: multiple-choice
    prompt: "Who should you ask if something is unclear?"
    choices:
      - { text: "The HR department", correct: true }
      - { text: "Your manager", feedback: "Close! You apply to your manager (上司に申請), but questions go to HR." }
      - { text: "Your colleagues", feedback: "The notice names a specific department: 人事部." }
    explanation: "ご不明な点は、人事部までお問い合わせください."
  - id: q3
    type: fill-blank
    prompt: "Complete the phrase from the notice: 'make sure you can be reached'."
    ja: "{連絡|れんらく}が{取|と}れる___にしておいてください。"
    en: "Please make sure you can be reached."
    answers: ["よう"]
    explanation: "〜ようにする = make sure that ~ (see the ように grammar point)."
reviewed: false
---
