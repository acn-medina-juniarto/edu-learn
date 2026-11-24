---
id: phone-etiquette
order: 2
title: "Phone etiquette"
titleJa: "{電話|でんわ}の{応対|おうたい}"
summary: "Answer a business call, say a colleague is away, and take a message for a callback."
category: phone
level: N4
politeness: keigo
minutes: 10
objectives:
  - "Answer an outside call with the company greeting"
  - "Say a colleague is away without using honorifics for them"
  - "Offer a callback and confirm the caller's phone number"
reviewed: false

vocab:
  - id: odenwa
    word: お電話
    reading: おでんわ
    meaning: "(your) phone call"
    pos: noun
    politeness: teinei
    example:
      ja: "お{電話|でんわ}ありがとうございます。グリーン{商事|しょうじ}でございます。"
      en: "Thank you for calling. This is Green Trading."
      politeness: keigo
  - id: shoushou
    word: 少々
    reading: しょうしょう
    meaning: "a little; a moment (formal)"
    pos: adverb
    politeness: keigo
    related: "ちょっと (everyday)"
    example:
      ja: "{少々|しょうしょう}お{待|ま}ちください。"
      en: "One moment, please."
      politeness: keigo
  - id: kashikomarimashita
    word: かしこまりました
    reading: かしこまりました
    meaning: "Certainly; understood (humble)"
    pos: expression
    politeness: keigo
    related: "わかりました (polite)"
    example:
      ja: "かしこまりました。すぐにお{調|しら}べします。"
      en: "Certainly. I'll look into it right away."
      politeness: keigo
  - id: orikaeshi
    word: 折り返し
    reading: おりかえし
    meaning: "calling back; (by) return"
    pos: noun
    politeness: neutral
    example:
      ja: "{戻|もど}りましたら、{折|お}り{返|かえ}しお{電話|でんわ}いたします。"
      en: "When they're back, we'll call you back."
      politeness: keigo
  - id: dengon
    word: 伝言
    reading: でんごん
    meaning: "message (for someone)"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "ご{伝言|でんごん}をお{伝|つた}えしましょうか。"
      en: "Shall I pass on a message?"
      politeness: keigo
  - id: uketamawaru
    word: 承る
    reading: うけたまわる
    meaning: "to hear, receive, accept (humble)"
    pos: verb-godan
    politeness: keigo
    related: "聞く / 受ける (plain)"
    example:
      ja: "ご{注文|ちゅうもん}を{承|うけたまわ}りました。"
      en: "We have received your order."
      politeness: keigo
  - id: seki-wo-hazusu
    word: 席を外す
    reading: せきをはずす
    meaning: "to be away from one's desk"
    pos: expression
    politeness: neutral
    example:
      ja: "あいにく{佐藤|さとう}は{席|せき}を{外|はず}しております。"
      en: "I'm afraid Sato is away from his desk."
      politeness: keigo
  - id: ainiku
    word: あいにく
    reading: あいにく
    meaning: "unfortunately; I'm afraid"
    pos: adverb
    politeness: neutral
    example:
      ja: "あいにく、その{日|ひ}は{予定|よてい}が{入|はい}っております。"
      en: "Unfortunately, I already have plans that day."
      politeness: keigo
  - id: osoreirimasu
    word: 恐れ入ります
    reading: おそれいります
    meaning: "Excuse me; I'm sorry to trouble you; thank you (very polite)"
    pos: expression
    politeness: keigo
    example:
      ja: "{恐|おそ}れ{入|い}りますが、お{名前|なまえ}をもう{一度|いちど}お{願|ねが}いできますか。"
      en: "I'm sorry, could I have your name once more?"
      politeness: keigo
  - id: ukagau
    word: 伺う
    reading: うかがう
    meaning: "to ask, hear, visit (humble)"
    pos: verb-godan
    politeness: keigo
    related: "聞く / 訪ねる (plain)"
    example:
      ja: "お{電話番号|でんわばんごう}を{伺|うかが}ってもよろしいでしょうか。"
      en: "May I ask your phone number?"
      politeness: keigo
  - id: shitsurei-itashimasu
    word: 失礼いたします
    reading: しつれいいたします
    meaning: "Excuse me; goodbye (ending a call)"
    pos: expression
    politeness: keigo
    example:
      ja: "それでは、{失礼|しつれい}いたします。"
      en: "Well then, goodbye."
      politeness: keigo

dialogue:
  setting: "You answer an outside call at your desk. Ms. Tanaka from Kitayama Industries wants to speak to your manager, Mr. Sato, who is away from his desk."
  speakers:
    - id: me
      name: Smith
      nameJa: "スミス"
      role: "You, answering the phone"
    - id: caller
      name: Tanaka
      nameJa: "{田中|たなか}"
      role: "Client calling in"
  lines:
    - speaker: me
      ja: "{お電話|おでんわ|odenwa}ありがとうございます。グリーン{商事|しょうじ}{営業部|えいぎょうぶ}、スミスでございます。"
      en: "Thank you for calling. Green Trading sales department, Smith speaking."
      politeness: keigo
      note: "Say the company name first, then your own name."
    - speaker: caller
      ja: "{北山工業|きたやまこうぎょう}の{田中|たなか}と{申|もう}します。いつもお{世話|せわ|osewa-ni-natte-orimasu}になっております。"
      en: "This is Tanaka from Kitayama Industries. Thank you for your continued support."
      politeness: keigo
    - speaker: me
      ja: "{北山工業|きたやまこうぎょう}の{田中様|たなかさま}でいらっしゃいますね。いつもお{世話|せわ}になっております。"
      en: "Ms. Tanaka from Kitayama Industries, yes. Thank you for your support as always."
      politeness: keigo
      note: "Repeat the caller's name to confirm it. いらっしゃる is honorific, so it raises the caller."
    - speaker: caller
      ja: "{恐|おそ}れ{入|い}りますが、{佐藤課長|さとうかちょう}はいらっしゃいますか。"
      en: "Excuse me, is Mr. Sato, the section manager, available?"
      politeness: keigo
    - speaker: me
      ja: "{申|もう}し{訳|わけ}ございません。{あいにく||ainiku}{佐藤|さとう}はただいま{席|せき|seki-wo-hazusu}を{外|はず}しております。"
      en: "I'm very sorry. I'm afraid Sato is away from his desk right now."
      politeness: keigo
      note: "To an outside caller, your own boss is just 佐藤: no さん and no 課長."
    - speaker: me
      ja: "{戻|もど}りましたら、{折|お}り{返|かえ|orikaeshi}しお{電話|でんわ}いたしましょうか。"
      en: "Shall I have him call you back when he returns?"
      politeness: keigo
    - speaker: caller
      ja: "では、お{願|ねが}いできますか。"
      en: "Yes, could you do that, please?"
      politeness: teinei
    - speaker: me
      ja: "{かしこまりました||kashikomarimashita}。{念|ねん}のため、お{電話番号|でんわばんごう}を{伺|うかが|ukagau}ってもよろしいでしょうか。"
      en: "Certainly. Just to be sure, may I have your phone number?"
      politeness: keigo
    - speaker: caller
      ja: "はい、03-1234-5678です。"
      en: "Yes, it's 03-1234-5678."
      politeness: teinei
      reading: "はい、ゼロサンの、イチニーサンヨンの、ゴーロクナナハチです。"
      note: "Phone numbers are read digit by digit, with の at each hyphen. 2 and 5 are often stretched (ニー, ゴー) to make them clearer."
    - speaker: me
      ja: "03-1234-5678、{北山工業|きたやまこうぎょう}の{田中様|たなかさま}ですね。{確|たし}かに{承|うけたまわ|uketamawaru}りました。"
      en: "03-1234-5678, Ms. Tanaka of Kitayama Industries. I have noted that."
      politeness: keigo
      reading: "ゼロサンの、イチニーサンヨンの、ゴーロクナナハチ、きたやまこうぎょうのたなかさまですね。たしかにうけたまわりました。"
      note: "Always read numbers back to confirm."
    - speaker: caller
      ja: "よろしくお{願|ねが}いします。{失礼|しつれい}いたします。"
      en: "Thank you. Goodbye."
      politeness: keigo
    - speaker: me
      ja: "{失礼|しつれい}いたします。"
      en: "Goodbye."
      politeness: keigo
      note: "Let the caller hang up first, then put the phone down gently."

notes:
  - type: keigo
    title: "ウチ and ソト: no honorifics for your own people"
    level: N4
    body: |
      When you talk to someone **outside** the company (ソト), people **inside** your company (ウチ) are treated like yourself, even your boss:

      - To a client: {佐藤|さとう}はただいま{席|せき}を{外|はず}しております。
      - To a colleague: {佐藤課長|さとうかちょう}は{今|いま}、{席|せき}を{外|はず}していらっしゃいます。

      Drop さん and job titles such as {課長|かちょう}, and use humble forms (おる, {申|もう}す) for your colleagues.
  - type: keigo
    title: "承る and 伺う: two humble verbs for the phone"
    level: N3
    body: |
      | Plain | Humble | Typical phone phrase |
      |---|---|---|
      | {聞|き}く / {受|う}ける | {承|うけたまわ}る | ご{伝言|でんごん}を{承|うけたまわ}ります。 |
      | {聞|き}く / {訪|たず}ねる | {伺|うかが}う | お{名前|なまえ}を{伺|うかが}ってもよろしいでしょうか。 |
  - type: grammar
    title: "〜てもよろしいでしょうか: asking permission politely"
    level: N4
    body: |
      This is a softer version of 〜てもいいですか:

      - {聞|き}いてもいいですか。 (polite)
      - {伺|うかが}ってもよろしいでしょうか。 (keigo: humble verb, and よろしい instead of いい)
  - type: culture
    title: "Business phone habits"
    body: |
      - Answer within about three rings. If it rang longer, start with お{待|ま}たせいたしました.
      - Generally avoid もしもし on formal business calls, whether you are answering or calling. Identify yourself instead:
        - Answering: お{電話|でんわ}ありがとうございます。グリーン{商事|しょうじ}でございます。
        - Calling: グリーン{商事|しょうじ}のスミスと{申|もう}します。いつもお{世話|せわ}になっております。
      - Read back names, numbers, and dates.
      - Let the caller hang up first.

quiz:
  - id: q1
    type: multiple-choice
    prompt: "You pick up an outside call at work. Which opening is best?"
    choices:
      - ja: "お{電話|でんわ}ありがとうございます。グリーン{商事|しょうじ}でございます。"
        correct: true
      - ja: "もしもし、グリーン{商事|しょうじ}です。"
        feedback: "Close! もしもし is fine for personal calls, but formal business calls generally skip it. Open with a thank-you and the company name."
      - ja: "はい、{何|なん}ですか。"
        feedback: "That sounds abrupt to a caller. Start by thanking them for calling."
    explanation: "Thanking the caller and giving the company name with でございます is the standard business opening."
  - id: q2
    type: multiple-choice
    prompt: "A client asks for your boss, Section Manager Sato. How do you say he's away?"
    choices:
      - ja: "{佐藤|さとう}はただいま{席|せき}を{外|はず}しております。"
        correct: true
      - ja: "{佐藤課長|さとうかちょう}はいらっしゃいません。"
        feedback: "Close! To an outside caller, don't honor your own boss. Drop 課長 and use humble forms: 佐藤は…おります."
      - ja: "{佐藤|さとう}さんはいないです。"
        feedback: "This is too casual, and さん honors your colleague. Use 佐藤 with humble おります."
    explanation: "This is ウチ/ソト: colleagues are treated like yourself when you talk to outsiders."
  - id: q3
    type: fill-blank
    prompt: "Ask the caller to wait a moment."
    ja: "{少々|しょうしょう}お{待|ま}ち___。"
    en: "One moment, please."
    answers: ["ください", "くださいませ"]
    explanation: "お待ちください (or the softer お待ちくださいませ) is the standard phrase. 少々 is the formal word for ちょっと."
  - id: q4
    type: fill-blank
    prompt: "Ask for the caller's name with the humble verb for 'ask'."
    ja: "お{名前|なまえ}を___もよろしいでしょうか。"
    en: "May I ask your name?"
    answers: ["伺って", "うかがって"]
    hint: "Humble form of 聞く"
    explanation: "伺う is the humble form of 聞く. 〜てもよろしいでしょうか is the very polite way to ask permission."
  - id: q5
    type: sentence-order
    prompt: "Offer a callback."
    tokens: ["{戻|もど}りましたら", "{折|お}り{返|かえ}し", "お{電話|でんわ}", "いたします"]
    en: "When they're back, we'll call you back."
    explanation: "Condition (戻りましたら) → how (折り返し) → humble verb (お電話いたします)."
---

On the phone people can't see your face, so set phrases matter even more. This lesson covers the full pattern for answering a call and taking a message for a colleague.
