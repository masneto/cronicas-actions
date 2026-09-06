# Security Fixes Changelog

_Gerado automaticamente pelo workflow de segurança._

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
