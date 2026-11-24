---
id: polite-requests
order: 4
title: "Making requests politely"
titleJa: "{丁寧|ていねい}なお{願|ねが}いの{仕方|しかた}"
summary: "Go from お願いします to いただけますでしょうか: step up how polite your request is and soften it with cushion words."
category: keigo
level: N3
politeness: keigo
minutes: 12
objectives:
  - "Rank request forms from casual to very polite"
  - "Soften a request with cushion words (クッション言葉)"
  - "Ask a superior for their time and schedule"
reviewed: false

vocab:
  - id: itadaku
    word: いただく
    reading: いただく
    meaning: "to receive (humble); used with 〜て for favors"
    pos: verb-godan
    politeness: keigo
    related: "もらう (plain)"
    example:
      ja: "{資料|しりょう}を{送|おく}っていただけますか。"
      en: "Could you send me the materials?"
      politeness: keigo
  - id: otesuu
    word: お手数
    reading: おてすう
    meaning: "trouble, bother (caused to someone)"
    pos: noun
    politeness: keigo
    example:
      ja: "お{手数|てすう}をおかけしますが、よろしくお{願|ねが}いいたします。"
      en: "Sorry for the trouble, and thank you in advance."
      politeness: keigo
  - id: kyoushuku
    word: 恐縮
    reading: きょうしゅく
    meaning: "feeling obliged or sorry (very polite)"
    pos: suru-noun
    politeness: keigo
    example:
      ja: "お{忙|いそが}しいところ{恐縮|きょうしゅく}ですが、ご{確認|かくにん}いただけますでしょうか。"
      en: "I'm sorry to bother you when you're busy, but could you check this?"
      politeness: keigo
  - id: saiwai
    word: 幸い
    reading: さいわい
    meaning: "fortunate; (I'd be) grateful"
    pos: na-adj
    politeness: neutral
    example:
      ja: "ご{返信|へんしん}いただけますと{幸|さいわ}いです。"
      en: "I would be grateful if you could reply."
      politeness: keigo
  - id: shikyuu
    word: 至急
    reading: しきゅう
    meaning: "urgently, as soon as possible"
    pos: adverb
    politeness: neutral
    example:
      ja: "{至急|しきゅう}ご{連絡|れんらく}いただけますでしょうか。"
      en: "Could you contact me as soon as possible?"
      politeness: keigo
  - id: kigen
    word: 期限
    reading: きげん
    meaning: "deadline, time limit"
    pos: noun
    politeness: neutral
    example:
      ja: "{提出|ていしゅつ}の{期限|きげん}は{金曜日|きんようび}です。"
      en: "The submission deadline is Friday."
      politeness: teinei
  - id: kentou
    word: 検討
    reading: けんとう
    meaning: "consideration; to consider"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "ご{検討|けんとう}のほど、よろしくお{願|ねが}いいたします。"
      en: "Thank you for considering this."
      politeness: keigo
  - id: yoroshii
    word: よろしい
    reading: よろしい
    meaning: "good, all right (polite form of いい)"
    pos: i-adj
    politeness: keigo
    example:
      ja: "{今|いま}、よろしいでしょうか。"
      en: "Is now a good time?"
      politeness: keigo
  - id: sashitsukae-nakereba
    word: 差し支えなければ
    reading: さしつかえなければ
    meaning: "if it's no trouble; if you don't mind"
    pos: expression
    politeness: keigo
    example:
      ja: "{差|さ}し{支|つか}えなければ、ご{連絡先|れんらくさき}を{教|おし}えていただけますか。"
      en: "If you don't mind, could you tell me your contact details?"
      politeness: keigo
  - id: gotsugou
    word: ご都合
    reading: ごつごう
    meaning: "(your) convenience, availability"
    pos: noun
    politeness: keigo
    example:
      ja: "{来週|らいしゅう}のご{都合|つごう}はいかがでしょうか。"
      en: "How is your schedule next week?"
      politeness: keigo
  - id: mitsumorisho
    word: 見積書
    reading: みつもりしょ
    meaning: "quotation, estimate (document)"
    pos: noun
    politeness: neutral
    example:
      ja: "{見積書|みつもりしょ}を{作成|さくせい}しました。"
      en: "I've prepared the quotation."
      politeness: teinei

dialogue:
  setting: "You need your department manager, Mr. Suzuki, to check a quotation and to join a meeting next week."
  speakers:
    - id: me
      name: Smith
      nameJa: "スミス"
      role: "You"
    - id: bucho
      name: Suzuki
      nameJa: "{鈴木|すずき}"
      role: "Department manager (部長)"
  lines:
    - speaker: me
      ja: "{鈴木部長|すずきぶちょう}、{今|いま}、{よろしい||yoroshii}でしょうか。"
      en: "Mr. Suzuki, do you have a moment?"
      politeness: keigo
      note: "Inside the company, you can address your boss by surname + title (鈴木部長), without さん."
    - speaker: bucho
      ja: "ああ、スミスさん。どうぞ。"
      en: "Ah, Smith. Go ahead."
      politeness: teinei
    - speaker: me
      ja: "お{忙|いそが}しいところ{恐縮|きょうしゅく|kyoushuku}ですが、こちらの{見積書|みつもりしょ|mitsumorisho}をご{確認|かくにん}いただけますでしょうか。"
      en: "I'm sorry to trouble you when you're busy, but could you check this quotation?"
      politeness: keigo
      note: "いただけますでしょうか is standard, natural business Japanese. A simpler alternative that is still polite is いただけますか."
    - speaker: bucho
      ja: "いいですよ。いつまでに{必要|ひつよう}ですか。"
      en: "Sure. When do you need it by?"
      politeness: teinei
    - speaker: me
      ja: "{北山工業|きたやまこうぎょう}さんに{金曜日|きんようび}までにお{送|おく}りしたいので、できれば{木曜|もくよう}の{午前中|ごぜんちゅう}までにお{願|ねが}いできると{助|たす}かります。"
      en: "I'd like to send it to Kitayama Industries by Friday, so if possible, Thursday morning would really help."
      politeness: keigo
      note: "できれば〜と助かります states the deadline without sounding like an order."
    - speaker: bucho
      ja: "{分|わ}かりました。{明日|あした}の{朝|あさ}、{見|み}ておきます。"
      en: "All right. I'll look at it tomorrow morning."
      politeness: teinei
    - speaker: me
      ja: "ありがとうございます。それと、{差|さ}し{支|つか|sashitsukae-nakereba}えなければ、{来週|らいしゅう}の{打|う}ち{合|あ}わせに{同席|どうせき}していただけないでしょうか。"
      en: "Thank you. Also, if it's no trouble, could you possibly join next week's meeting?"
      politeness: keigo
      note: "A negative question (〜ていただけないでしょうか) is even softer than a positive one."
    - speaker: bucho
      ja: "{来週|らいしゅう}ですか。{何曜日|なんようび}ですか。"
      en: "Next week? Which day?"
      politeness: teinei
    - speaker: me
      ja: "{火曜日|かようび}の{午後|ごご}{二時|にじ}からです。ご{都合|つごう|gotsugou}はいかがでしょうか。"
      en: "Tuesday from 2 p.m. Would that work for you?"
      politeness: keigo
    - speaker: bucho
      ja: "{大丈夫|だいじょうぶ}ですよ。{予定|よてい}に{入|い}れておいてください。"
      en: "That's fine. Please put it in my calendar."
      politeness: teinei
    - speaker: me
      ja: "かしこまりました。お{手数|てすう|otesuu}をおかけしますが、よろしくお{願|ねが}いいたします。"
      en: "Certainly. Sorry for the trouble, and thank you."
      politeness: keigo

notes:
  - type: keigo
    title: "The request ladder: from お願いします to いただけますでしょうか"
    level: N3
    body: |
      | Form | Level | Use with |
      |---|---|---|
      | {確認|かくにん}して | casual | close friends |
      | {確認|かくにん}してください | です・ます | sounds like an instruction |
      | {確認|かくにん}してもらえますか | です・ます | colleagues |
      | {確認|かくにん}していただけますか | keigo | superiors, clients |
      | ご{確認|かくにん}いただけますでしょうか | keigo | clients, important requests |
      | ご{確認|かくにん}いただけますと{幸|さいわ}いです | keigo (written) | emails |

      〜てください is polite, but it is still an instruction. When you are asking a favor, use いただく.

      You may read that いただけますでしょうか is "double keigo". In practice it is standard, natural business Japanese and perfectly fine to use. If you want something simpler, いただけますか is still polite.
  - type: keigo
    title: "Cushion words (クッション言葉)"
    level: N3
    body: |
      Put one of these before a request to soften it:

      - {恐|おそ}れ{入|い}りますが: "I'm sorry to trouble you, but…"
      - お{手数|てすう}ですが: "Sorry for the bother, but…"
      - お{忙|いそが}しいところ{恐縮|きょうしゅく}ですが: "I'm sorry to ask when you're busy, but…"
      - {差|さ}し{支|つか}えなければ: "If it's no trouble…"
  - type: grammar
    title: "〜ていただけないでしょうか: the negative question"
    level: N3
    body: |
      Asking "could you **not**…?" leaves the other person room to refuse, so it sounds softer:

      - {同席|どうせき}していただけますか。 (polite)
      - {同席|どうせき}していただけないでしょうか。 (softer, more hesitant)
  - type: culture
    title: "Give a reason and a deadline"
    body: |
      Japanese requests usually include **why** and **by when**, said softly:
      {金曜日|きんようび}までにお{送|おく}りしたいので、できれば{木曜|もくよう}までにお{願|ねが}いできると{助|たす}かります。
      This respects the other person's time without sounding pushy.

quiz:
  - id: q1
    type: multiple-choice
    prompt: "What is the most polite way to ask a client to check a document?"
    choices:
      - ja: "ご{確認|かくにん}いただけますでしょうか。"
        correct: true
      - ja: "{確認|かくにん}してください。"
        feedback: "Close! てください is polite, but to a client it sounds like an instruction. In business settings we ask with いただく."
      - ja: "{確認|かくにん}してくれる？"
        feedback: "That's casual. Save it for close friends."
    explanation: "ご + noun + いただけますでしょうか is the standard very polite request."
  - id: q2
    type: multiple-choice
    prompt: "Which cushion phrase fits before a request to a busy client?"
    choices:
      - ja: "お{忙|いそが}しいところ{恐縮|きょうしゅく}ですが、"
        correct: true
      - ja: "すみませんけど、"
        feedback: "Close! すみませんけど is fine with colleagues but a bit light for a client."
      - ja: "{悪|わる}いけど、"
        feedback: "悪いけど is casual. It's what you'd say to a friend."
    explanation: "お忙しいところ恐縮ですが acknowledges their time and is the most formal of these."
  - id: q3
    type: fill-blank
    prompt: "Finish this common request closing."
    ja: "お{手数|てすう}をおかけしますが、よろしくお___いたします。"
    en: "Sorry for the trouble, and thank you in advance."
    answers: ["願い", "ねがい"]
    explanation: "よろしくお願いいたします. Here いたします is the humble form of します."
  - id: q4
    type: fill-blank
    prompt: "In an email: 'I'd be grateful if you could consider this.'"
    ja: "ご{検討|けんとう}いただけますと___です。"
    en: "I would be grateful if you could consider this."
    answers: ["幸い", "さいわい"]
    explanation: "〜いただけますと幸いです is a soft, formal request often used in emails."
  - id: q5
    type: sentence-order
    prompt: "Make a polite request with a cushion word."
    tokens: ["{恐|おそ}れ{入|い}りますが", "{資料|しりょう}を", "お{送|おく}り", "いただけますでしょうか"]
    en: "I'm sorry to trouble you, but could you send the materials?"
    explanation: "Cushion word → object → お + verb stem → いただけますでしょうか."
---

The same request can sound like an order or a gentle favor, depending on how you say it. This lesson walks through the request ladder step by step, so you can pick the right form for colleagues, your boss, and clients.
