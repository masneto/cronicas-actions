# cronicas-actions

Repositório de GitHub Actions customizadas para automação dos workflows do projeto Crônicas App.

## Índice

- [Estrutura do Projeto](#estrutura-do-projeto)
- [validate-repo](#validate-repo)
- [email-notification-action](#email-notification-action)
- [Testes](#testes)
- [Licença](#licença)

---

## Estrutura do Projeto

```
.github/actions/ 
├── email-notification-action/ 
    ├── action.yml 
    ├── src/ 
    └── tests/ 
└── validate-repo/ 
    ├── action.yml 
    ├── src/ 
    └── tests/
```


---

## validate-repo

**Descrição:**  
Valida se o repositório possui todos os arquivos essenciais para o funcionamento do projeto e se o `package.json` contém os scripts necessários.

**Como usar em um workflow:**
```yaml
- name: Validate Repository Structure
  uses: masneto/cronicas-actions/.github/actions/validate-repo@main
```

O que é validado:

- Presença dos arquivos:
    - package.json
    - Dockerfile
    - src/app.js
    - src/server.js
    - src/public/index.html
    - src/public/styles.css
    - test/app.test.js

O package.json deve conter os scripts test e start.
O Dockerfile deve conter a instrução HEALTHCHECK (gera apenas um aviso se não houver).

Saída:
Falha o workflow se algum arquivo obrigatório estiver ausente ou se os scripts não existirem.
Gera um aviso se o HEALTHCHECK estiver ausente no Dockerfile.

## email-notification-action
**Descrição:**
Envia um e-mail de notificação em caso de falha em algum job do workflow.

- Inputs obrigatórios:
    - smtp_server: Endereço do servidor SMTP (ex: smtp.gmail.com)
    - smtp_port: Porta do servidor SMTP (ex: 465)
    - username: Usuário SMTP
    - password: Senha SMTP
    - to: Destinatário do e-mail
    - from: Remetente do e-mail
    - subject: Assunto do e-mail
    - workflow_name: Nome do workflow
    - branch: Nome da branch
    - author_name: Nome do autor do commit (opcional)
    - author_email: E-mail do autor do commit (opcional)
    - run_url: URL da execução do workflow (opcional)
    - error_message: Mensagem de erro (opcional)

**Como usar em um workflow:**
```yaml
- name: Send Email Notification
  uses: masneto/cronicas-actions/.github/actions/email-notification-action@main
  with:
    smtp_server: smtp.gmail.com
    smtp_port: '465'
    username: ${{ secrets.MAIL_USERNAME }}
    password: ${{ secrets.MAIL_PASSWORD }}
    to: destinatario@exemplo.com
    from: remetente@exemplo.com
    subject: "[ALERTA] Falha no Workflow"
    workflow_name: ${{ github.workflow }}
    branch: ${{ github.ref_name }}
    author_name: ${{ github.actor }}
    author_email: ${{ github.actor }}@exemplo.com
    run_url: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    error_message: "Mensagem de erro detalhada"
```    
**Funcionamento:**

Monta o corpo do e-mail com informações do workflow, branch, autor, link dos logs e mensagem de erro.
Envia o e-mail usando o servidor SMTP informado.
Retorna o messageId do e-mail enviado como output.

## Testes
Cada action possui testes automatizados em __tests__ para garantir o funcionamento correto.
Exemplo, para rodar os testes da action de e-mail:
```
cd .github/actions/email-notification-action
npm install
npm test
```

## Licença
Os scripts e a documentação deste projeto são distribuídos sob a [Licença MIT](https://github.com/actions/checkout/blob/main/LICENSE)