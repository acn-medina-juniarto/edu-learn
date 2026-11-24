---
id: self-introduction
order: 1
title: "Self-introduction & meeting a client"
titleJa: "{自己紹介|じこしょうかい}と{名刺交換|めいしこうかん}"
summary: "Introduce yourself to a new client, exchange business cards, and sit down the right way."
category: meetings
level: N4
politeness: keigo
minutes: 10
objectives:
  - "Introduce yourself with your company and name using と申します"
  - "Exchange business cards with the set phrase 頂戴いたします"
  - "Tell 弊社 (our company) from 御社 (your company)"
reviewed: false

vocab:
  - id: hajimemashite
    word: はじめまして
    reading: はじめまして
    meaning: "How do you do / Nice to meet you"
    pos: expression
    politeness: teinei
    example:
      ja: "はじめまして。スミスと{申|もう}します。"
      en: "How do you do. My name is Smith."
      politeness: keigo
  - id: mousu
    word: 申す
    reading: もうす
    meaning: "to say, to be called (humble)"
    pos: verb-godan
    politeness: keigo
    related: "言う (plain)"
    example:
      ja: "グリーン{商事|しょうじ}のスミスと{申|もう}します。"
      en: "I'm Smith from Green Trading."
      politeness: keigo
  - id: meishi
    word: 名刺
    reading: めいし
    meaning: "business card"
    pos: noun
    politeness: neutral
    example:
      ja: "{名刺|めいし}を{忘|わす}れないようにしてください。"
      en: "Please make sure you don't forget your business cards."
      politeness: teinei
  - id: choudai
    word: 頂戴する
    reading: ちょうだいする
    meaning: "to receive (humble)"
    pos: verb-irregular
    politeness: keigo
    related: "もらう (plain)"
    example:
      ja: "お{名刺|めいし}を{頂戴|ちょうだい}いたします。"
      en: "Thank you, I'll take your card. (lit. I humbly receive your card.)"
      politeness: keigo
  - id: eigyou
    word: 営業
    reading: えいぎょう
    meaning: "sales; business operations"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "{営業部|えいぎょうぶ}に{配属|はいぞく}されました。"
      en: "I was assigned to the sales department."
      politeness: teinei
  - id: tantou
    word: 担当
    reading: たんとう
    meaning: "being in charge of; the person in charge"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "{御社|おんしゃ}を{担当|たんとう}しております、スミスです。"
      en: "I'm Smith, the person in charge of your account."
      politeness: keigo
  - id: heisha
    word: 弊社
    reading: へいしゃ
    meaning: "our company (humble)"
    pos: noun
    politeness: keigo
    example:
      ja: "{弊社|へいしゃ}の{新|あたら}しいサービスをご{紹介|しょうかい}します。"
      en: "Let me introduce our company's new service."
      politeness: keigo
  - id: onsha
    word: 御社
    reading: おんしゃ
    meaning: "your company (honorific, spoken)"
    pos: noun
    politeness: keigo
    example:
      ja: "{御社|おんしゃ}のホームページを{拝見|はいけん}しました。"
      en: "I looked at your company's website."
      politeness: keigo
  - id: osewa-ni-natte-orimasu
    word: お世話になっております
    reading: おせわになっております
    meaning: "Thank you for your continued support (standard business greeting)"
    pos: expression
    politeness: keigo
    example:
      ja: "いつもお{世話|せわ}になっております。"
      en: "Thank you, as always, for your support."
      politeness: keigo
  - id: yoroshiku-onegai-itashimasu
    word: よろしくお願いいたします
    reading: よろしくおねがいいたします
    meaning: "I look forward to working with you / Thank you in advance"
    pos: expression
    politeness: keigo
    example:
      ja: "{今後|こんご}ともよろしくお{願|ねが}いいたします。"
      en: "I look forward to continuing to work with you."
      politeness: keigo
  - id: honjitsu
    word: 本日
    reading: ほんじつ
    meaning: "today (formal)"
    pos: noun
    politeness: keigo
    related: "今日 (everyday)"
    example:
      ja: "{本日|ほんじつ}はありがとうございました。"
      en: "Thank you for today."
      politeness: teinei
  - id: jikoshoukai
    word: 自己紹介
    reading: じこしょうかい
    meaning: "self-introduction"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "{簡単|かんたん}に{自己紹介|じこしょうかい}をさせていただきます。"
      en: "Allow me to briefly introduce myself."
      politeness: keigo

dialogue:
  setting: "You (Smith, a new sales rep at Green Trading) visit Kitayama Industries for the first time. Ms. Tanaka from purchasing comes into the meeting room."
  speakers:
    - id: client
      name: Tanaka
      nameJa: "{田中|たなか}"
      role: "Client, purchasing department"
    - id: me
      name: Smith
      nameJa: "スミス"
      role: "You, sales rep"
  lines:
    - speaker: client
      ja: "お{待|ま}たせいたしました。"
      en: "Sorry to keep you waiting."
      politeness: keigo
    - speaker: me
      ja: "{はじめまして||hajimemashite}。{本日|ほんじつ|honjitsu}はお{忙|いそが}しいところ、お{時間|じかん}をいただき、ありがとうございます。"
      en: "How do you do. Thank you for making time for me today when you're so busy."
      politeness: keigo
      note: "Stand up when your contact enters the room."
    - speaker: client
      ja: "いえいえ、こちらこそ、{遠|とお}いところをわざわざありがとうございます。"
      en: "Not at all. Thank you for coming all this way."
      politeness: keigo
    - speaker: me
      ja: "グリーン{商事|しょうじ}{営業部|えいぎょうぶ}のスミスと{申|もう|mousu}します。どうぞよろしくお{願|ねが}いいたします。"
      en: "I'm Smith from the sales department at Green Trading. I look forward to working with you."
      politeness: keigo
      note: "Hand over your card with both hands, text facing them, as you say your company and name."
    - speaker: client
      ja: "{頂戴|ちょうだい|choudai}いたします。{北山工業|きたやまこうぎょう}{購買部|こうばいぶ}の{田中|たなか}と{申|もう}します。よろしくお{願|ねが}いいたします。"
      en: "Thank you. I'm Tanaka from purchasing at Kitayama Industries. Pleased to meet you."
      politeness: keigo
    - speaker: me
      ja: "{頂戴|ちょうだい}いたします。"
      en: "Thank you. (lit. I humbly receive it.)"
      politeness: keigo
      note: "It's common to keep their card on the table, on top of your card case, during the meeting."
    - speaker: client
      ja: "どうぞ、おかけください。"
      en: "Please, have a seat."
      politeness: keigo
    - speaker: me
      ja: "{失礼|しつれい}いたします。"
      en: "Thank you. (lit. Excuse me.)"
      politeness: keigo
      note: "Wait until you are invited to sit down."
    - speaker: client
      ja: "スミスさんは、{日本|にほん}は{長|なが}いんですか。"
      en: "Have you been in Japan long, Mr. Smith?"
      politeness: teinei
    - speaker: me
      ja: "いえ、まだ{二年|にねん}ほどです。{日本語|にほんご}もまだまだ{勉強中|べんきょうちゅう}です。"
      en: "No, only about two years. I'm still learning Japanese."
      politeness: teinei
    - speaker: client
      ja: "とてもお{上手|じょうず}ですよ。"
      en: "Your Japanese is very good."
      politeness: teinei
      note: "Small talk drops to plain です・ます. Matching the other person's level is natural."

notes:
  - type: keigo
    title: "と申します: giving your name humbly"
    level: N4
    body: |
      With clients, say your name with **{申|もう}す**, the humble (謙譲語) form of {言|い}う:

      - スミスです。 (polite, fine with colleagues)
      - スミスと{申|もう}します。 (humble, use with clients and on first meetings)

      Never use **おっしゃる** for yourself. It is the *honorific* (尊敬語) form, used only to raise the other person:
      お{名前|なまえ}は{何|なん}とおっしゃいますか。 ("What is your name?")
  - type: keigo
    title: "弊社・御社・貴社: our company vs. your company"
    level: N3
    body: |
      | Word | Meaning | Where |
      |---|---|---|
      | {弊社|へいしゃ} | our company (humble) | speech and writing |
      | {御社|おんしゃ} | your company | speech |
      | {貴社|きしゃ} | your company | writing (emails, letters) |

      Inside your own company, just say {会社|かいしゃ} or the team name.
  - type: grammar
    title: "〜ております: humble ている"
    level: N4
    body: |
      **おる** is the humble form of いる. 〜ております is how you describe your own actions or state to a client:

      - {営業|えいぎょう}を{担当|たんとう}して**います**。 (polite)
      - {営業|えいぎょう}を{担当|たんとう}して**おります**。 (humble, more professional)
  - type: culture
    title: "名刺交換: exchanging business cards"
    body: |
      These are common professional conventions, not strict rules. Practice varies by company, industry, and generation, and nobody expects perfection from a newcomer. Following the general flow shows respect:

      1. Stand up, and take your card out of a card case (名刺入れ) rather than your wallet.
      2. The visitor (or the junior person) usually offers first.
      3. Hold the card with both hands, text facing the other person, and say your company and name.
      4. Receive their card with both hands and say {頂戴|ちょうだい}いたします.
      5. During the meeting, many people keep the card on the table, on top of their card case. Writing on it in front of the person, or putting it straight in a back pocket, can come across as careless.

      You may also see finer customs, such as holding your card slightly lower than the other person's. Some offices care about these and many don't. Follow your colleagues' lead.

quiz:
  - id: q1
    type: multiple-choice
    prompt: "You are meeting a client for the first time. How do you say your name?"
    choices:
      - ja: "スミスと{申|もう}します。"
        correct: true
      - ja: "スミスだよ。"
        feedback: "Close! That's casual, fine with friends. With a client, use the humble と申します."
      - ja: "スミスとおっしゃいます。"
        feedback: "Careful: おっしゃる is honorific (尊敬語). It raises the other person, so it is never used for yourself."
    explanation: "と申します uses 申す, the humble form of 言う. It is the standard way to give your name in business."
  - id: q2
    type: multiple-choice
    prompt: "A client hands you their business card. What do you say?"
    choices:
      - ja: "{頂戴|ちょうだい}いたします。"
        correct: true
      - ja: "どうも。"
        feedback: "Close! どうも is too casual for a first meeting. In business settings we say 頂戴いたします."
      - ja: "もらいます。"
        feedback: "もらう is the plain verb and sounds blunt here. Its humble form is 頂戴する."
    explanation: "頂戴いたします literally means 'I humbly receive it' and is the set phrase for accepting a card."
  - id: q3
    type: multiple-choice
    prompt: "Which word means 'our company' in humble speech?"
    choices:
      - ja: "{弊社|へいしゃ}"
        correct: true
      - ja: "{御社|おんしゃ}"
        feedback: "Close! 御社 means 'your company'. Use it for the client's company."
      - ja: "{貴社|きしゃ}"
        feedback: "貴社 also means 'your company', but it is used in writing."
    explanation: "弊社 lowers your own company. 御社 (spoken) and 貴社 (written) raise the other company."
  - id: q4
    type: fill-blank
    prompt: "Make it humble: 'I'm in charge of sales.'"
    ja: "{営業|えいぎょう}を{担当|たんとう}して___。"
    en: "I'm in charge of sales."
    answers: ["おります"]
    hint: "The humble form of います"
    explanation: "おります is the humble form of います. います is polite but less professional with clients."
  - id: q5
    type: fill-blank
    prompt: "Complete the standard business greeting."
    ja: "いつもお{世話|せわ}に___おります。"
    en: "Thank you, as always, for your support."
    answers: ["なって"]
    explanation: "お世話になっております is the standard opening with clients, both in person and in email."
  - id: q6
    type: sentence-order
    prompt: "Put the words in order to thank someone for their time."
    tokens: ["{本日|ほんじつ}は", "お{時間|じかん}を", "いただき", "ありがとうございます"]
    en: "Thank you for your time today."
    explanation: "Time word → object (お時間を) → いただき (humble 'receive', connective form) → thanks."
---

Your first meeting with a client follows a script: greet, thank them for their time, exchange business cards, and wait to be invited to sit. Learn the script and the rest of the meeting gets easier.
