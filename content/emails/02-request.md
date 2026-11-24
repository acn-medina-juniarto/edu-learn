---
id: request
order: 2
category: request
title: "Asking to schedule a meeting"
titleJa: "お{打|う}ち{合|あ}わせ{日程|にってい}のご{相談|そうだん}"
summary: "Propose three time slots for a meeting and ask the client which suits them."
subject: "お{打|う}ち{合|あ}わせ{日程|にってい}のご{相談|そうだん}（{{topic}}）"
reviewed: false
fields:
  - { key: clientCompany, label: "Client company", placeholder: "株式会社〇〇", exampleJa: "北山工業株式会社" }
  - { key: clientDept, label: "Client department", placeholder: "〇〇部", exampleJa: "購買部" }
  - { key: clientName, label: "Client's surname", placeholder: "〇〇", exampleJa: "田中" }
  - { key: myCompany, label: "Your company", placeholder: "〇〇株式会社", exampleJa: "グリーン商事" }
  - { key: myDept, label: "Your department", placeholder: "〇〇部", exampleJa: "営業部" }
  - { key: myName, label: "Your name", placeholder: "〇〇", exampleJa: "スミス" }
  - { key: topic, label: "Meeting topic", placeholder: "〇〇の件", exampleJa: "新製品のご提案" }
  - { key: option1, label: "Option 1", placeholder: "〇月〇日（〇）〇時〜", exampleJa: "12月3日（水）14:00〜15:00" }
  - { key: option2, label: "Option 2", placeholder: "〇月〇日（〇）〇時〜", exampleJa: "12月4日（木）10:00〜11:00" }
  - { key: option3, label: "Option 3", placeholder: "〇月〇日（〇）〇時〜", exampleJa: "12月5日（金）16:00〜17:00" }
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
    ja: "{{topic}}の{件|けん}で、お{打|う}ち{合|あ}わせのお{時間|じかん}をいただけないかと{思|おも}い、ご{連絡|れんらく}いたしました。"
    en: "I'm writing to ask whether you could spare some time for a meeting about [topic]."
    explanation: "State the purpose up front. 〜ないかと思い is a gentle, indirect way to make a request."
    politeness: keigo
  - role: body
    ja: "{恐|おそ}れ{入|い}りますが、{以下|いか}の{候補日|こうほび}のうち、ご{都合|つごう}のよい{日時|にちじ}をお{知|し}らせいただけますでしょうか。\n\n・{{option1}}\n・{{option2}}\n・{{option3}}"
    en: "Could you let me know which of the following times suits you?"
    explanation: "A cushion word (恐れ入りますが) plus いただけますでしょうか, which is standard and natural. Offering 2–3 concrete options makes it easy to reply."
    politeness: keigo
  - role: body
    ja: "いずれもご{都合|つごう}が{合|あ}わない{場合|ばあい}は、ご{希望|きぼう}の{日時|にちじ}をお{知|し}らせいただけますと{幸|さいわ}いです。"
    en: "If none of these work, I'd be grateful if you could suggest a time."
    explanation: "Always give the other person an easy way out. 〜いただけますと幸いです is a soft written request."
    politeness: keigo
  - role: closing
    ja: "お{忙|いそが}しいところ{恐縮|きょうしゅく}ですが、よろしくお{願|ねが}いいたします。"
    en: "Sorry to trouble you when you're busy, and thank you."
    explanation: "Acknowledge their time before the standard closing."
    politeness: keigo
  - role: signature
    ja: "――――――――――\n{{myCompany}} {{myDept}}\n{{myName}}\nTEL: {{myPhone}}\nEmail: {{myEmail}}\n――――――――――"
    en: "Signature"
    explanation: "Company, department, name, contact details."
    politeness: teinei
---
