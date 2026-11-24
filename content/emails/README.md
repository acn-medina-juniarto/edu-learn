This folder holds email templates for the email builder (/email).

Only files starting with a number (`01-greeting.md`) are loaded; this README is ignored. Shared field keys (used across templates, and remembered between templates in the browser):

- clientCompany, clientDept, clientName
- myCompany, myDept, myName, myPhone, myEmail

Placeholders `{{key}}` in `subject` and block `ja` must match a field `key` (checked by `npm test`).
