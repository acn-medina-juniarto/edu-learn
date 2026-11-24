---
id: follow-up
order: 4
category: follow-up
title: "Thank-you and follow-up after a meeting"
titleJa: "お{打|う}ち{合|あ}わせのお{礼|れい}"
summary: "Thank the client for their time and send the document you promised."
subject: "{{meetingDate}}のお{打|う}ち{合|あ}わせのお{礼|れい}"
reviewed: false
fields:
  - { key: clientCompany, label: "Client company", placeholder: "株式会社〇〇", exampleJa: "北山工業株式会社" }
  - { key: clientDept, label: "Client department", placeholder: "〇〇部", exampleJa: "購買部" }
  - { key: clientName, label: "Client's surname", placeholder: "〇〇", exampleJa: "田中" }
  - { key: myCompany, label: "Your company", placeholder: "〇〇株式会社", exampleJa: "グリーン商事" }
  - { key: myDept, label: "Your department", placeholder: "〇〇部", exampleJa: "営業部" }
  - { key: myName, label: "Your name", placeholder: "〇〇", exampleJa: "スミス" }
  - { key: meetingDate, label: "Meeting date", placeholder: "〇月〇日", exampleJa: "本日" }
  - { key: document, label: "Document you're sending", placeholder: "〇〇", exampleJa: "修正版のお見積書" }
  - { key: myPhone, label: "Your phone", placeholder: "03-0000-0000", exampleJa: "03-1234-5678" }
  - { key: myEmail, label: "Your email", placeholder: "name@example.com", exampleJa: "smith@example.com" }
blocks:
  - role: addressee
    ja: "{{clientCompany}}\n{{clientDept}} {{clientName}}{様|さま}"
    en: "Company / department / name + 様"
    explanation: "Largest to smallest, and 様 after the name."
    politeness: keigo
  - role: opening
    ja: "いつもお{世話|せわ}になっております。\n{{myCompany}}の{{myName}}です。"
    en: "Thank you for your continued support. This is [name] from [company]."
    explanation: "Standard external opening plus who you are."
    politeness: keigo
  - role: body
    ja: "{{meetingDate}}は、お{忙|いそが}しいところお{時間|じかん}をいただき、{誠|まこと}にありがとうございました。"
    en: "Thank you very much for taking the time to meet [today / on date]."
    explanation: "Send a thank-you on the same day if you can. 誠に makes the thanks more formal."
    politeness: keigo
  - role: body
    ja: "ご{依頼|いらい}いただいた{{document}}を{添付|てんぷ}いたしましたので、ご{査収|さしゅう}のほどよろしくお{願|ねが}いいたします。"
    en: "I've attached the [document] you requested. Please take a look."
    explanation: "ご査収 is used for documents you've sent ('please check and accept'). のほど softens the request."
    politeness: keigo
  - role: body
    ja: "ご{不明|ふめい}な{点|てん}がございましたら、お{気軽|きがる}にお{問|と}い{合|あ}わせください。"
    en: "If anything is unclear, please don't hesitate to contact me."
    explanation: "A polite offer of help. Say ご不明な点 rather than asking whether they understood."
    politeness: keigo
  - role: closing
    ja: "{引|ひ}き{続|つづ}き、どうぞよろしくお{願|ねが}いいたします。"
    en: "I look forward to continuing to work with you."
    explanation: "引き続き ('continuing') fits an ongoing relationship."
    politeness: keigo
  - role: signature
    ja: "――――――――――\n{{myCompany}} {{myDept}}\n{{myName}}\nTEL: {{myPhone}}\nEmail: {{myEmail}}\n――――――――――"
    en: "Signature"
    explanation: "Company, department, name, contact details."
    politeness: teinei
---
