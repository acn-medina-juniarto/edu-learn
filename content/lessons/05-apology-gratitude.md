---
id: apology-gratitude
order: 5
title: "Apologizing and expressing gratitude"
titleJa: "お{詫|わ}びと{感謝|かんしゃ}の{表現|ひょうげん}"
summary: "Apologize properly for a mistake at work, explain the cause and the fix, and thank people with the right weight."
category: keigo
level: N3
politeness: keigo
minutes: 12
objectives:
  - "Choose an apology that fits how serious the problem is"
  - "Follow the business apology pattern: apology → cause → fix → prevention"
  - "Thank people humbly with おかげさまで and 助かります"
reviewed: false

vocab:
  - id: moushiwake-gozaimasen
    word: 申し訳ございません
    reading: もうしわけございません
    meaning: "I am truly sorry (very polite apology)"
    pos: expression
    politeness: keigo
    related: "すみません (polite), ごめんなさい (personal)"
    example:
      ja: "ご{返信|へんしん}が{遅|おそ}くなり、{申|もう}し{訳|わけ}ございません。"
      en: "I'm very sorry for my late reply."
      politeness: keigo
  - id: owabi
    word: お詫び
    reading: おわび
    meaning: "apology (formal noun)"
    pos: noun
    politeness: keigo
    example:
      ja: "{深|ふか}くお{詫|わ}び{申|もう}し{上|あ}げます。"
      en: "Please accept my deepest apologies."
      politeness: keigo
  - id: gomeiwaku
    word: ご迷惑
    reading: ごめいわく
    meaning: "trouble, inconvenience (caused to someone)"
    pos: noun
    politeness: keigo
    example:
      ja: "ご{迷惑|めいわく}をおかけして、{申|もう}し{訳|わけ}ありません。"
      en: "I'm sorry for causing you trouble."
      politeness: keigo
  - id: makoto-ni
    word: 誠に
    reading: まことに
    meaning: "truly, sincerely (formal)"
    pos: adverb
    politeness: keigo
    example:
      ja: "{誠|まこと}にありがとうございます。"
      en: "Thank you very much indeed."
      politeness: keigo
  - id: taihen
    word: 大変
    reading: たいへん
    meaning: "very, greatly (formal intensifier)"
    pos: adverb
    politeness: teinei
    example:
      ja: "{大変|たいへん}お{待|ま}たせいたしました。"
      en: "I'm very sorry to have kept you waiting."
      politeness: keigo
  - id: fuchuui
    word: 不注意
    reading: ふちゅうい
    meaning: "carelessness"
    pos: na-adj
    politeness: neutral
    example:
      ja: "わたくしの{不注意|ふちゅうい}でした。"
      en: "It was my carelessness."
      politeness: teinei
  - id: kongo
    word: 今後
    reading: こんご
    meaning: "from now on, in future"
    pos: noun
    politeness: neutral
    example:
      ja: "{今後|こんご}は{十分|じゅうぶん}{注意|ちゅうい}いたします。"
      en: "I will be very careful from now on."
      politeness: keigo
  - id: ki-wo-tsukeru
    word: 気をつける
    reading: きをつける
    meaning: "to be careful"
    pos: expression
    politeness: neutral
    example:
      ja: "{次|つぎ}から{気|き}をつけます。"
      en: "I'll be careful next time."
      politeness: teinei
  - id: kansha
    word: 感謝
    reading: かんしゃ
    meaning: "gratitude; to be grateful"
    pos: suru-noun
    politeness: neutral
    example:
      ja: "ご{協力|きょうりょく}に{感謝|かんしゃ}いたします。"
      en: "Thank you for your cooperation."
      politeness: keigo
  - id: tasukaru
    word: 助かる
    reading: たすかる
    meaning: "to be helped; (that) helps a lot"
    pos: verb-godan
    politeness: neutral
    example:
      ja: "{早|はや}めに{教|おし}えていただけて、{助|たす}かりました。"
      en: "It really helped that you told me early."
      politeness: keigo
  - id: okagesamade
    word: おかげさまで
    reading: おかげさまで
    meaning: "thanks to you (humble, also used as a set phrase)"
    pos: expression
    politeness: teinei
    example:
      ja: "おかげさまで、プロジェクトは{無事|ぶじ}に{終|お}わりました。"
      en: "Thanks to you, the project finished without problems."
      politeness: teinei

dialogue:
  setting: "Your company sent Kitayama Industries the wrong quantity of goods. You call Ms. Tanaka to apologize."
  speakers:
    - id: me
      name: Smith
      nameJa: "スミス"
      role: "You"
    - id: client
      name: Tanaka
      nameJa: "{田中|たなか}"
      role: "Client"
  lines:
    - speaker: me
      ja: "{田中様|たなかさま}、このたびは{大変|たいへん|taihen}ご{迷惑|めいわく|gomeiwaku}をおかけし、{誠|まこと|makoto-ni}に{申|もう}し{訳|わけ}ございませんでした。"
      en: "Ms. Tanaka, I am truly sorry for the trouble we caused you this time."
      politeness: keigo
      note: "Step 1: apologize first, before you explain anything."
    - speaker: client
      ja: "いえ、すぐにご{連絡|れんらく}いただいて{助|たす}かりました。{原因|げんいん}は{何|なん}だったんですか。"
      en: "No, it helped that you contacted us right away. What was the cause?"
      politeness: teinei
    - speaker: me
      ja: "{弊社|へいしゃ}の{確認不足|かくにんぶそく}により、{数量|すうりょう}を{誤|あやま}ってお{送|おく}りしてしまいました。"
      en: "Because we didn't check properly, we sent the wrong quantity."
      politeness: keigo
      note: "Step 2: give the cause briefly and take responsibility. Don't make excuses."
    - speaker: me
      ja: "{正|ただ}しい{商品|しょうひん}は{本日|ほんじつ}{発送|はっそう}いたしましたので、{明日|あす}の{午前中|ごぜんちゅう}にお{届|とど}けできる{予定|よてい}です。"
      en: "We shipped the correct items today, so they should reach you tomorrow morning."
      politeness: keigo
      note: "Step 3: explain the fix. In formal speech, 明日 is often read あす."
    - speaker: client
      ja: "そうですか。{早|はや}めに{対応|たいおう}していただいて、ありがとうございます。"
      en: "I see. Thank you for dealing with it so quickly."
      politeness: teinei
    - speaker: me
      ja: "とんでもございません。{今後|こんご|kongo}はこのようなことがないよう、{確認|かくにん}を{徹底|てってい}いたします。"
      en: "Not at all. We'll make sure our checks are thorough so this doesn't happen again."
      politeness: keigo
      note: "Step 4: promise to prevent it from happening again. とんでもございません ('not at all') is accepted in modern business Japanese. You may also hear とんでもないことでございます."
    - speaker: client
      ja: "よろしくお{願|ねが}いします。{次|つぎ}の{注文|ちゅうもん}も、またお{願|ねが}いしますね。"
      en: "Thank you. We'll be counting on you for the next order too."
      politeness: teinei
    - speaker: me
      ja: "そう{言|い}っていただけて、{本当|ほんとう}に{助|たす|tasukaru}かります。ありがとうございます。"
      en: "It's a real relief to hear you say that. Thank you."
      politeness: keigo
    - speaker: me
      ja: "{引|ひ}き{続|つづ}き、どうぞよろしくお{願|ねが}いいたします。"
      en: "We look forward to continuing to work with you."
      politeness: keigo

notes:
  - type: keigo
    title: "The apology ladder"
    level: N3
    body: |
      | Phrase | Weight | When |
      |---|---|---|
      | ごめんなさい | personal | friends and family, not business |
      | すみません | light | small things such as bumping into someone or interrupting |
      | {申|もう}し{訳|わけ}ありません | serious | mistakes at work |
      | {申|もう}し{訳|わけ}ございません | very serious | clients, real trouble caused |
      | {誠|まこと}に{申|もう}し{訳|わけ}ございません | strongest (spoken) | major problems |
      | {深|ふか}くお{詫|わ}び{申|もう}し{上|あ}げます | strongest (written) | formal emails and letters |
  - type: grammar
    title: "〜てしまいました: regret"
    level: N4
    body: |
      〜てしまう adds a feeling of regret or that something unwanted happened:

      - {数量|すうりょう}を{間違|まちが}えました。 ("I got the quantity wrong.")
      - {数量|すうりょう}を{間違|まちが}えてしまいました。 ("I'm afraid I got the quantity wrong.")
  - type: grammar
    title: "〜ないよう(に): so that … doesn't happen"
    level: N3
    body: |
      Use this to promise prevention:
      このようなことがないよう、{確認|かくにん}を{徹底|てってい}いたします。
      ("We'll be thorough in our checks so that this doesn't happen again.")
  - type: culture
    title: "Saying thank you at work"
    body: |
      - **おかげさまで**: when someone asks how things are going, you thank them humbly even if they didn't directly help. "Thanks to you, it went well."
      - **{助|たす}かります**: a warm "that really helps". 〜ていただけて{助|たす}かりました is very natural.
      - **すみません** can also mean "thank you" when someone has gone out of their way for you.

quiz:
  - id: q1
    type: multiple-choice
    prompt: "Your mistake caused a client real trouble. What is the most appropriate apology?"
    choices:
      - ja: "{大変|たいへん}{申|もう}し{訳|わけ}ございませんでした。"
        correct: true
      - ja: "ごめんなさい。"
        feedback: "Close! ごめんなさい is a personal apology. In business settings we say 申し訳ございません."
      - ja: "すみません。"
        feedback: "すみません works for small things, but it's too light when you caused real trouble."
    explanation: "申し訳ございません (with 大変 or 誠に) is the right weight for a business mistake."
  - id: q2
    type: multiple-choice
    prompt: "After apologizing, what should come next in a business apology?"
    choices:
      - text: "Explain the cause briefly, then the fix"
        correct: true
      - text: "Change the subject quickly"
        feedback: "Close, but skipping ahead feels evasive. The client wants to know what happened and what you're doing about it."
      - text: "Explain at length why it wasn't your fault"
        feedback: "Long excuses sound like you're avoiding responsibility. Keep the cause short."
    explanation: "The pattern is apology → cause → fix → prevention."
  - id: q3
    type: fill-blank
    prompt: "Apologize for the trouble you caused."
    ja: "ご{迷惑|めいわく}をおかけして、{申|もう}し{訳|わけ}___。"
    en: "I'm sorry for causing you trouble."
    answers: ["ございません", "ございませんでした", "ありません", "ありませんでした"]
    explanation: "ございません is the more polite form of ありません. Use the past tense (でした) for something that's already over."
  - id: q4
    type: multiple-choice
    prompt: "A client asks how your project went. It went well. How do you reply humbly?"
    choices:
      - ja: "おかげさまで、{無事|ぶじ}に{終|お}わりました。"
        correct: true
      - ja: "はい、{私|わたし}が{頑張|がんば}りました。"
        feedback: "Close! Taking credit sounds boastful in Japanese. In business settings we say おかげさまで."
      - ja: "{別|べつ}に、{普通|ふつう}です。"
        feedback: "別に sounds dismissive, and it's casual."
    explanation: "おかげさまで ('thanks to you') is a humble, warm set phrase."
  - id: q5
    type: sentence-order
    prompt: "Promise that it won't happen again."
    tokens: ["{今後|こんご}は", "このようなことが", "ないよう", "{注意|ちゅうい}いたします"]
    en: "From now on, I'll take care so that this doesn't happen again."
    explanation: "Time (今後は) → what to prevent (このようなことが) → ないよう → humble verb."
---

Mistakes happen at every job. What matters is how you apologize. Japanese business apologies follow a clear pattern, and choosing the right phrase shows you understand how serious the problem is.
