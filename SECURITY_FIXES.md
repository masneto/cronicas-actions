# Security Fixes Changelog

_Gerado automaticamente pelo workflow de segurança._

## 2026-09-30

- **Email Notification Action:** brace-expansion `5.0.9` → `5.0.12` — _brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service_ (high, corrigida)
- **NPM Security Audit Action:** brace-expansion `5.0.9` → `5.0.12` — _brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service_ (high, corrigida)
- **Preview Docs Action:** brace-expansion `5.0.9` → `5.0.12` — _brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service_ (high, corrigida)
- **Validate Repo Action:** brace-expansion `5.0.9` → `5.0.12` — _brace-expansion: Quadratic-time expansion of the `{a},b}` rewrite causes CPU denial of service_ (high, corrigida)
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/36686378901

## 2026-09-29

- **Email Notification Action:** nodemailer `>=5.0.0 <10.0.2` → `disponivel` — _Nodemailer: Process-global DNS cache reuses TLS `servername` across transports, enabling cross-tenant SMTP credential disclosure_ (moderate)
- **NPM Security Audit Action:** sem vulnerabilidades
- **Preview Docs Action:** sem vulnerabilidades
- **Validate Repo Action:** sem vulnerabilidades
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/36538993347

## 2026-09-06

- **Email Notification Action:** sem vulnerabilidades
- **NPM Security Audit Action:** sem vulnerabilidades
- **Preview Docs Action:** axios `>=0.8.1 <0.28.0` → `1.20.0` — _Axios Cross-Site Request Forgery Vulnerability_ (high)
- **Validate Repo Action:** sem vulnerabilidades
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/34009689778

## 2026-09-06

- **Email Notification Action:** lodash `<4.17.21` → `4.18.1` — _Command Injection in lodash_ (high)
- **Email Notification Action:** undici `<6.23.0` → `6.28.1` — _Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion_ (high)
- **NPM Security Audit Action:** minimist `>=1.0.0 <1.2.6` → `1.2.8` — _Prototype Pollution in minimist_ (critical)
- **Preview Docs Action:** axios `>=0.8.1 <0.28.0` → `0.21.4` — _Axios Cross-Site Request Forgery Vulnerability_ (high)
- **Validate Repo Action:** node-forge `<1.0.0` → `1.4.0` — _Prototype Pollution in node-forge debug API._ (high)
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/34009633513

## 2026-09-06

- Email Notification Action: sem vulnerabilidades
- NPM Security Audit Action: sem vulnerabilidades
- **Preview Docs Action:** axios `>=0.8.1 <0.28.0` -> `1.20.0` - _Axios Cross-Site Request Forgery Vulnerability_ (high)
- Validate Repo Action: sem vulnerabilidades
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/34008090275
- **Email Notification Action:** lodash `<4.17.21` → `4.18.1` — _Command Injection in lodash_ (high)
- **NPM Security Audit Action:** minimist `>=1.0.0 <1.2.6` → `1.2.8` — _Prototype Pollution in minimist_ (critical)
- **Preview Docs Action:** axios `>=0.8.1 <0.28.0` → `0.21.4` — _Axios Cross-Site Request Forgery Vulnerability_ (high)
- **Validate Repo Action:** node-forge `<1.0.0` → `1.4.0` — _Prototype Pollution in node-forge debug API._ (high)

## 2026-09-05

- **Email Notification Action:** @actions/http-client `?` -> `fixed` - _undici_ (moderate)
- **Email Notification Action:** undici `<6.23.0` -> `fixed` - _Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion_ (high)
- Pipeline: https://github.com/masneto/cronicas-actions/actions/runs/33990324554
- **NPM Security Audit Action:** @actions/http-client `?` -> `fixed` - _undici_ (moderate)
- **NPM Security Audit Action:** undici `<6.23.0` -> `fixed` - _Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion_ (high)
- **Preview Docs Action:** @actions/github `?` -> `9.1.1` - _@actions/http-client_ (moderate)
- **Preview Docs Action:** @actions/http-client `?` -> `9.1.1` - _undici_ (moderate)
- **Preview Docs Action:** undici `<6.23.0` -> `9.1.1` - _Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion_ (high)
- **Validate Repo Action:** @actions/http-client `?` -> `fixed` - _undici_ (moderate)
- **Validate Repo Action:** undici `<6.23.0` -> `fixed` - _Undici has an unbounded decompression chain in HTTP responses on Node.js Fetch API via Content-Encoding leads to resource exhaustion_ (high)
