---
id: greeting
order: 1
category: greeting
title: "Introducing yourself as the new contact"
titleJa: "{担当者変更|たんとうしゃへんこう}のご{挨拶|あいさつ}"
summary: "You've taken over a client account. Introduce yourself and offer to visit."
subject: "{担当者変更|たんとうしゃへんこう}のご{挨拶|あいさつ}（{{myCompany}} {{myName}}）"
reviewed: false
fields:
  - { key: clientCompany, label: "Client company", placeholder: "株式会社〇〇", exampleJa: "北山工業株式会社" }
  - { key: clientDept, label: "Client department", placeholder: "〇〇部", exampleJa: "購買部" }
  - { key: clientName, label: "Client's surname", placeholder: "〇〇", exampleJa: "田中" }
  - { key: myCompany, label: "Your company", placeholder: "〇〇株式会社", exampleJa: "グリーン商事" }
  - { key: myDept, label: "Your department", placeholder: "〇〇部", exampleJa: "営業部" }
  - { key: myName, label: "Your name", placeholder: "〇〇", exampleJa: "スミス" }
  - { key: previousName, label: "Previous contact's surname", placeholder: "〇〇", exampleJa: "山田" }
  - { key: startDate, label: "Start date", placeholder: "〇月〇日", exampleJa: "12月1日" }
  - { key: myPhone, label: "Your phone", placeholder: "03-0000-0000", exampleJa: "03-1234-5678" }
  - { key: myEmail, label: "Your email", placeholder: "name@example.com", exampleJa: "smith@example.com" }
blocks:
  - role: addressee
    ja: "{{clientCompany}}\n{{clientDept}} {{clientName}}{様|さま}"
    en: "Company / department / name + 様"
    explanation: "Go from largest to smallest. Write the company's full legal name (株式会社 included), and put 様 after the person's name."
    politeness: keigo
  - role: opening
    ja: "いつもお{世話|せわ}になっております。\n{{myCompany}}の{{myName}}です。"
    en: "Thank you for your continued support. This is [name] from [company]."
    explanation: "The standard opening for external emails, followed straight away by who you are."
    politeness: keigo
  - role: body
    ja: "このたび、{{previousName}}に{代|か}わり、{{startDate}}より{御社|おんしゃ}を{担当|たんとう}させていただくことになりました。"
    en: "I'll be taking over your account from [previous contact] as of [date]."
    explanation: "Your colleague's name goes without さん: to a client they're ウチ (inside). 担当させていただく is the standard humble way to say you'll handle the account."
    politeness: keigo
  - role: body
    ja: "{至|いた}らない{点|てん}もあるかと{存|ぞん}じますが、{精一杯|せいいっぱい}{努|つと}めてまいりますので、どうぞよろしくお{願|ねが}いいたします。"
    en: "I may have shortcomings, but I'll do my very best. I look forward to working with you."
    explanation: "A set phrase of modesty when starting a new relationship. 存じます is humble 思います."
    politeness: keigo
  - role: body
    ja: "{近|ちか}いうちに、{改|あらた}めてご{挨拶|あいさつ}に{伺|うかが}えれば{幸|さいわ}いです。"
    en: "I hope to visit you soon to introduce myself in person."
    explanation: "伺う is humble 'visit'. 〜れば幸いです is a soft way to express a wish."
    politeness: keigo
  - role: closing
    ja: "{今後|こんご}ともどうぞよろしくお{願|ねが}い{申|もう}し{上|あ}げます。"
    en: "I look forward to our continued relationship."
    explanation: "お願い申し上げます is a step more formal than お願いいたします, which suits a first email."
    politeness: keigo
  - role: signature
    ja: "――――――――――\n{{myCompany}} {{myDept}}\n{{myName}}\nTEL: {{myPhone}}\nEmail: {{myEmail}}\n――――――――――"
    en: "Signature: company, department, name, contact details"
    explanation: "Japanese signatures are usually framed with lines and list company, department, name and contact details."
    politeness: teinei
---
