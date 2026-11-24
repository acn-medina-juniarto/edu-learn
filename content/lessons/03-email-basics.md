---
id: email-basics
order: 3
title: "Business email structure & set phrases"
titleJa: "ビジネスメールの{基本|きほん}"
summary: "Learn the fixed shape of a Japanese business email and the phrases that open and close it."
category: email
level: N3
politeness: keigo
minutes: 12
objectives:
  - "Put an email in the standard order: addressee, greeting, your name, body, closing, signature"
  - "Choose the right opening for external (お世話になっております) and internal (お疲れ様です) mail"
  - "Write a clear subject line (件名)"
reviewed: false

vocab:
  - id: kenmei
    word: 件名
    reading: けんめい
    meaning: "subject line (of an email)"
    pos: noun
    politeness: neutral
    example:
      ja: "{件名|けんめい}に{用件|ようけん}を{書|か}いてください。"
      en: "Please write what the email is about in the subject line."
      politeness: teinei
  - id: kakui
    word: 各位
    reading: かくい
    meaning: "To all (addressing a group in writing; already respectful, so never 各位様)"
    pos: suffix
    politeness: keigo
    example:
      ja: "{営業部|えいぎょうぶ}{各位|かくい}"
      en: "To all members of the sales department"
      politeness: keigo
  - id: sama
    word: 様
    reading: さま
    meaning: "Mr./Ms. (honorific name suffix)"
    pos: suffix
    politeness: keigo
    example:
      ja: "{田中|たなか}{様|さま}"
      en: "Ms. Tanaka"
      politeness: keigo
  - id: otsukaresama-desu
    word: お疲れ様です
    reading: おつかれさまです
    meaning: "Hello / thanks for your work (greeting between colleagues)"
    pos: expression
    politeness: teinei
    example:
      ja: "お{疲|つか}れ{様|さま}です。{営業部|えいぎょうぶ}のスミスです。"
      en: "Hello, this is Smith from sales."
      politeness: teinei
  - id: gokakunin
    word: ご確認
    reading: ごかくにん
    meaning: "checking, confirmation (honorific prefix)"
    pos: suru-noun
    politeness: keigo
    example:
      ja: "{添付|てんぷ}ファイルをご{確認|かくにん}ください。"
      en: "Please check the attached file."
      politeness: keigo
  - id: shiryou
    word: 資料
    reading: しりょう
    meaning: "materials, documents"
    pos: noun
    politeness: neutral
    example:
      ja: "{会議|かいぎ}の{資料|しりょう}をお{送|おく}りします。"
      en: "I'm sending the materials for the meeting."
      politeness: keigo
  - id: tenpu
    word: 添付
    reading: てんぷ
    meaning: "attachment; to attach"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "{見積書|みつもりしょ}を{添付|てんぷ}いたしました。"
      en: "I have attached the quotation."
      politeness: keigo
  - id: nanitozo
    word: 何卒
    reading: なにとぞ
    meaning: "kindly; please (very formal)"
    pos: adverb
    politeness: keigo
    example:
      ja: "{何卒|なにとぞ}よろしくお{願|ねが}い{申|もう}し{上|あ}げます。"
      en: "Thank you very much in advance for your kind consideration."
      politeness: keigo
  - id: ijou
    word: 以上
    reading: いじょう
    meaning: "That's all (marks the end of a message)"
    pos: noun
    politeness: neutral
    example:
      ja: "{以上|いじょう}、よろしくお{願|ねが}いいたします。"
      en: "That's all. Thank you."
      politeness: keigo
  - id: toriisogi
    word: 取り急ぎ
    reading: とりいそぎ
    meaning: "in haste; for now (quick or preliminary messages)"
    pos: adverb
    politeness: neutral
    example:
      ja: "{取|と}り{急|いそ}ぎ、ご{連絡|れんらく}まで。"
      en: "Just a quick note for now."
      politeness: teinei
  - id: gosashuu
    word: ご査収
    reading: ごさしゅう
    meaning: "kindly check and accept (sent documents)"
    pos: noun
    politeness: keigo
    example:
      ja: "{資料|しりょう}を{添付|てんぷ}いたしましたので、ご{査収|さしゅう}ください。"
      en: "I've attached the documents. Please check them."
      politeness: keigo

dialogue:
  setting: "You've written your first email to a client. You ask Mr. Yamada, a senior colleague, to look at the draft."
  speakers:
    - id: me
      name: Smith
      nameJa: "スミス"
      role: "You, junior employee"
    - id: senpai
      name: Yamada
      nameJa: "{山田|やまだ}"
      role: "Senior colleague (先輩)"
  lines:
    - speaker: me
      ja: "{山田|やまだ}さん、{お疲れ様です|おつかれさまです|otsukaresama-desu}。{今|いま}、ちょっとよろしいですか。"
      en: "Hi, Mr. Yamada. Do you have a moment?"
      politeness: teinei
    - speaker: senpai
      ja: "うん、いいよ。どうしたの？"
      en: "Sure. What's up?"
      politeness: casual
      note: "Seniors often speak casually to juniors. You still answer in です・ます."
    - speaker: me
      ja: "{北山工業|きたやまこうぎょう}さんへのメールを{書|か}いたので、{見|み}ていただけませんか。"
      en: "I wrote an email to Kitayama Industries. Could you take a look?"
      politeness: teinei
      note: "In speech, client companies often get さん: 北山工業さん."
    - speaker: senpai
      ja: "いいよ。うーん、{件名|けんめい|kenmei}がちょっと{分|わ}かりにくいかな。{用件|ようけん}がひと{目|め}で{分|わ}かるようにしたほうがいいよ。"
      en: "Sure. Hmm, the subject line is a bit unclear. It's better if people can see what it's about at a glance."
      politeness: casual
    - speaker: me
      ja: "なるほど。では、「お{見積書|みつもりしょ}{送付|そうふ}のご{連絡|れんらく}」にします。"
      en: "I see. Then I'll change it to 'Sending you our quotation'."
      politeness: teinei
    - speaker: senpai
      ja: "いいね。それから、{社外|しゃがい}の{人|ひと}には「いつもお{世話|せわ}になっております」から{始|はじ}めるのが{基本|きほん}だよ。"
      en: "Good. Also, emails to people outside the company should start with いつもお世話になっております."
      politeness: casual
    - speaker: me
      ja: "はい。{社内|しゃない}メールは「お{疲|つか}れ{様|さま}です」でいいんですよね。"
      en: "OK. And for internal emails, お疲れ様です is fine, right?"
      politeness: teinei
    - speaker: senpai
      ja: "そうそう。{最後|さいご}は「よろしくお{願|ねが}いいたします」で{締|し}めてね。"
      en: "Right. And finish with よろしくお願いいたします."
      politeness: casual
    - speaker: me
      ja: "{分|わ}かりました。{修正|しゅうせい}して、もう{一度|いちど}お{見|み}せします。"
      en: "Got it. I'll fix it and show you again."
      politeness: keigo
    - speaker: senpai
      ja: "{了解|りょうかい}。よろしくね。"
      en: "OK. Thanks."
      politeness: casual
      note: "了解 is natural from a senior to a junior. When you reply to a superior or a client, 承知いたしました is the preferred form."

notes:
  - type: culture
    title: "The shape of a business email"
    body: |
      Japanese business emails follow a fixed order:

      1. **Addressee** (宛名): company → department → name + {様|さま}
      2. **Greeting**: いつもお{世話|せわ}になっております。 (external) / お{疲|つか}れ{様|さま}です。 (internal)
      3. **Your name**: グリーン{商事|しょうじ}のスミスです。
      4. **Body**: the main point first, then details
      5. **Closing**: よろしくお{願|ねが}いいたします。
      6. **Signature** (署名): name, company, department, phone, email

      > {北山工業株式会社|きたやまこうぎょうかぶしきがいしゃ}
      > {購買部|こうばいぶ} {田中|たなか}{様|さま}
      >
      > いつもお{世話|せわ}になっております。
      > グリーン{商事|しょうじ}のスミスです。
      >
      > {先日|せんじつ}ご{依頼|いらい}いただいたお{見積書|みつもりしょ}を{添付|てんぷ}いたしました。
      > ご{査収|さしゅう}のほど、よろしくお{願|ねが}いいたします。
  - type: keigo
    title: "お / ご + noun: the polite prefix"
    level: N4
    body: |
      Adding お or ご makes a noun polite, especially when it is something connected to the other person:

      - {確認|かくにん} → ご{確認|かくにん}ください
      - {連絡|れんらく} → ご{連絡|れんらく}いたします
      - {見積書|みつもりしょ} → お{見積書|みつもりしょ}

      As a rule of thumb, ご goes with Chinese-origin words (漢語) and お with native Japanese words, but there are many exceptions (お{電話|でんわ}, お{時間|じかん}).
  - type: grammar
    title: "〜ほど: softening a request in writing"
    level: N2
    body: |
      ほど ("to the extent") softens a request in formal writing:

      - ご{確認|かくにん}ください。 (polite)
      - ご{確認|かくにん}のほど、よろしくお{願|ねが}いいたします。 (softer, more formal)
  - type: culture
    title: "了解 vs. 承知: saying 'understood'"
    body: |
      - **{承知|しょうち}いたしました** / {承知|しょうち}しました / かしこまりました: the safe choice with superiors and clients. 承知いたしました is the preferred form in those situations.
      - **{了解|りょうかい}しました**: not wrong, and common between colleagues. Some people find it too casual toward superiors, so avoid it with them and with clients.

      When in doubt, use {承知|しょうち}いたしました.
  - type: culture
    title: "取り急ぎ: when a quick note is OK"
    body: |
      {取|と}り{急|いそ}ぎ means "in haste / for now". It is acceptable when the message really is quick or preliminary, such as confirming you received something before a full reply:

      {資料|しりょう}を{受|う}け{取|と}りました。{取|と}り{急|いそ}ぎ、お{礼|れい}まで。

      In more formal contexts, such as an important client or a first contact, it can feel abrupt. Use a complete closing such as よろしくお{願|ねが}いいたします instead.
  - type: culture
    title: "各位: writing to a group"
    body: |
      {各位|かくい} ("to all") already shows respect, so it is used **without** {様|さま}. 各位様 is a common mistake.

      - {関係者|かんけいしゃ}{各位|かくい} ("To all concerned")
      - {営業部|えいぎょうぶ}{各位|かくい} ("To all members of the sales department")

quiz:
  - id: q1
    type: multiple-choice
    prompt: "What is the first line of an email to an external client?"
    choices:
      - ja: "いつもお{世話|せわ}になっております。"
        correct: true
      - ja: "お{疲|つか}れ{様|さま}です。"
        feedback: "Close! お疲れ様です is for colleagues inside your company."
      - ja: "こんにちは。"
        feedback: "こんにちは is rarely used in business email. The standard opening is お世話になっております."
    explanation: "External emails open with お世話になっております. Internal ones open with お疲れ様です."
  - id: q2
    type: multiple-choice
    prompt: "Which is the most natural closing line?"
    choices:
      - ja: "よろしくお{願|ねが}いいたします。"
        correct: true
      - ja: "さようなら。"
        feedback: "さようなら sounds like a final goodbye and is not used to close business emails."
      - ja: "じゃあ、またね。"
        feedback: "That's friendly and casual. In business settings we close with よろしくお願いいたします."
    explanation: "よろしくお願いいたします closes almost every business email, whatever the topic."
  - id: q3
    type: multiple-choice
    prompt: "Which subject line (件名) is best?"
    choices:
      - ja: "【ご{確認|かくにん}のお{願|ねが}い】3{月分|がつぶん}お{見積書|みつもりしょ}について"
        correct: true
      - ja: "こんにちは"
        feedback: "This doesn't say what the email is about. Subject lines should show the topic at a glance."
      - ja: "スミスです"
        feedback: "Your name is already in the From field. Use the subject line for the topic."
    explanation: "A good 件名 shows the purpose and the topic. Brackets 【】 are often used to flag the action needed."
  - id: q4
    type: fill-blank
    prompt: "Ask the client to check the attachment."
    ja: "{資料|しりょう}を{添付|てんぷ}いたしましたので、ご___ください。"
    en: "I've attached the documents. Please check them."
    answers: ["確認", "かくにん", "査収", "さしゅう"]
    explanation: "ご確認ください is common. ご査収ください is more formal and is used specifically for documents you've sent."
  - id: q5
    type: sentence-order
    prompt: "Write the addressee line in the right order."
    tokens: ["{北山工業株式会社|きたやまこうぎょうかぶしきがいしゃ}", "{購買部|こうばいぶ}", "{田中|たなか}{様|さま}"]
    en: "Ms. Tanaka, Purchasing Department, Kitayama Industries Co., Ltd."
    explanation: "Go from largest to smallest: company → department → person + 様."
---

A Japanese business email follows a fixed structure. Learn the shape once and you can write most everyday emails by filling in the middle.
