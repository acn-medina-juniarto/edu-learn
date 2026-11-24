---
id: n4-schedule-change
level: N4
title: "A schedule change from a colleague"
titleJa: "{打|う}ち{合|あ}わせ{時間|じかん}の{変更|へんこう}"
summary: "An internal email asking whether a meeting can move to the afternoon."
genre: email
politeness: teinei
minutes: 4
paragraphs:
  - ja: "{田中|たなか}さん　お{疲|つか}れ{様|さま}です。{鈴木|すずき}です。"
    en: "Hi Tanaka, this is Suzuki."
  - ja: "{明日|あした}の{打|う}ち{合|あ}わせですが、{部長|ぶちょう}のご{都合|つごう}が{悪|わる}くなったので、{午後|ごご}{三時|さんじ}からに{変更|へんこう}してもいいですか。"
    en: "About tomorrow's meeting: the manager can no longer make it, so is it OK to move it to 3 p.m.?"
  - ja: "{場所|ばしょ}は{同|おな}じ{第二会議室|だいにかいぎしつ}です。"
    en: "The place is the same: meeting room 2."
  - ja: "{難|むずか}しい{場合|ばあい}は、{今日中|きょうじゅう}に{教|おし}えてください。よろしくお{願|ねが}いします。"
    en: "If that's difficult, please let me know by the end of today. Thanks."
glossary:
  - { word: "打ち合わせ", reading: "うちあわせ", meaning: "(work) meeting" }
  - { word: "都合", reading: "つごう", meaning: "convenience, availability" }
  - { word: "変更", reading: "へんこう", meaning: "change" }
  - { word: "今日中", reading: "きょうじゅう", meaning: "by the end of today" }
questions:
  - id: q1
    type: multiple-choice
    prompt: "Why is the meeting time changing?"
    choices:
      - { text: "The manager can't make the original time", correct: true }
      - { text: "The meeting room isn't available", feedback: "Close! The room stays the same (場所は同じ)." }
      - { text: "Tanaka is busy", feedback: "Suzuki is asking Tanaka. The reason is the manager's schedule." }
    explanation: "部長のご都合が悪くなった: the manager's schedule no longer works."
  - id: q2
    type: multiple-choice
    prompt: "What should Tanaka do if 3 p.m. doesn't work?"
    choices:
      - { text: "Tell Suzuki by the end of today", correct: true }
      - { text: "Go to meeting room 2 at 3 p.m.", feedback: "That's the plan if it does work." }
      - { text: "Cancel the meeting", feedback: "Nobody asks to cancel. Just reply by today (今日中に)." }
    explanation: "難しい場合は、今日中に教えてください."
reviewed: false
---
