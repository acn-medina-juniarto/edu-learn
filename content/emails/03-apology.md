---
id: apology
order: 3
category: apology
title: "Apologizing for a delayed delivery"
titleJa: "{納品遅延|のうひんちえん}のお{詫|わ}び"
summary: "Apologize, explain the cause briefly, give the new date, and promise to prevent it."
subject: "【お{詫|わ}び】{{item}}の{納品遅延|のうひんちえん}について"
reviewed: false
fields:
  - { key: clientCompany, label: "Client company", placeholder: "株式会社〇〇", exampleJa: "北山工業株式会社" }
  - { key: clientDept, label: "Client department", placeholder: "〇〇部", exampleJa: "購買部" }
  - { key: clientName, label: "Client's surname", placeholder: "〇〇", exampleJa: "田中" }
  - { key: myCompany, label: "Your company", placeholder: "〇〇株式会社", exampleJa: "グリーン商事" }
  - { key: myDept, label: "Your department", placeholder: "〇〇部", exampleJa: "営業部" }
  - { key: myName, label: "Your name", placeholder: "〇〇", exampleJa: "スミス" }
  - { key: item, label: "Delayed item", placeholder: "〇〇", exampleJa: "ご注文の部品" }
  - { key: reason, label: "Cause (short, your side)", placeholder: "弊社の〇〇", exampleJa: "弊社の手配ミス" }
  - { key: newDate, label: "New delivery date", placeholder: "〇月〇日", exampleJa: "12月6日" }
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
    explanation: "Even in an apology, open with the standard greeting and your name."
    politeness: keigo
  - role: body
    ja: "このたびは、{{item}}の{納品|のうひん}が{遅|おく}れ、ご{迷惑|めいわく}をおかけしておりますことを{深|ふか}くお{詫|わ}び{申|もう}し{上|あ}げます。"
    en: "I sincerely apologize for the trouble caused by the delay in delivering [item]."
    explanation: "Step 1, apology first. 深くお詫び申し上げます is the strongest written apology."
    politeness: keigo
  - role: body
    ja: "{{reason}}により、{当初|とうしょ}の{予定|よてい}より{遅|おく}れが{生|しょう}じております。"
    en: "Due to [cause], there has been a delay from the original schedule."
    explanation: "Step 2, cause. Keep it short and take responsibility; long explanations sound like excuses."
    politeness: keigo
  - role: body
    ja: "{{newDate}}までに{確実|かくじつ}にお{届|とど}けできるよう、{手配|てはい}いたしました。"
    en: "We have arranged to deliver it without fail by [new date]."
    explanation: "Step 3, the fix, with a concrete date."
    politeness: keigo
  - role: body
    ja: "{今後|こんご}はこのようなことがないよう、{社内|しゃない}の{確認体制|かくにんたいせい}を{見直|みなお}してまいります。"
    en: "We will review our internal checks so that this does not happen again."
    explanation: "Step 4, prevention. 〜てまいります is humble 'will continue to'."
    politeness: keigo
  - role: closing
    ja: "{本来|ほんらい}であれば{直接|ちょくせつ}お{詫|わ}びに{伺|うかが}うべきところ、まずはメールにてお{詫|わ}び{申|もう}し{上|あ}げます。"
    en: "I should properly come to apologize in person, but for now please accept this apology by email."
    explanation: "A formal set phrase that acknowledges email is the lighter channel. Use it for serious problems."
    politeness: keigo
  - role: signature
    ja: "――――――――――\n{{myCompany}} {{myDept}}\n{{myName}}\nTEL: {{myPhone}}\nEmail: {{myEmail}}\n――――――――――"
    en: "Signature"
    explanation: "Company, department, name, contact details."
    politeness: teinei
---
