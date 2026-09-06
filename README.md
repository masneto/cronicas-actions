# cronicas-actions

Repositório de GitHub Actions customizadas para automação dos workflows do projeto Crônicas App.

## Índice

- [Estrutura do Projeto](#estrutura-do-projeto)
- [validate-repo](#validate-repo)
- [email-notification-action](#email-notification-action)
- [preview-docs-action](#preview-docs-action)
- [npm-security-audit](#npm-security-audit)
- [Testes](#testes)
- [Licença](#licença)

---

## Estrutura do Projeto

```
.github/actions/
    ├── email-notification-action/
    │   ├── action.yml
    │   ├── dist/
    │   └── src/
    ├── npm-security-audit/
    │   ├── action.yml
    │   ├── dist/
    │   └── src/
    ├── preview-docs-action/
    │   ├── action.yml
    │   ├── dist/
    │   └── src/
    └── validate-repo/
        ├── action.yml
        ├── dist/
        └── src/
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

- Inputs:
    - smtp_server: Endereço do servidor SMTP (ex: smtp.gmail.com) — obrigatório
    - smtp_port: Porta do servidor SMTP (ex: 465) — obrigatório
    - username: Usuário SMTP — obrigatório
    - password: Senha SMTP — obrigatório
    - to: Destinatário do e-mail — obrigatório
    - from: Remetente do e-mail — obrigatório
    - subject: Assunto do e-mail — obrigatório
    - workflow_name: Nome do workflow — obrigatório
    - branch: Nome da branch (padrão: `${{ github.ref_name }}`)
    - author_name: Nome do autor do commit (padrão: `${{ github.actor }}`)
    - author_email: E-mail do autor do commit (opcional)
    - run_url: URL da execução do workflow (padrão: URL do run atual)
    - error_message: Mensagem de erro (opcional)

- Outputs:
    - messageId: ID da mensagem de e-mail enviada

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

## preview-docs-action
**Descrição:**
Gera e publica previews de documentação a partir de artifacts dos Pull Requests.

- Inputs (todos obrigatórios):
    - step: Etapa a ser executada — `package` (publica o preview no branch gh-pages) ou `comment` (comenta o link do preview no PR)
    - artifact_repo: Repositório onde o artifact do PR foi gerado (formato `owner/repo`)
    - pr_number: Número do Pull Request
    - artifact_run_id: Run ID que gerou o artifact
    - token: Token com permissões de `contents: write` e `pull-requests: write`

- Outputs:
    - preview-url: URL do preview publicado (definida no step `comment`)

**Como usar em um workflow:**
```yaml
- name: Publish Docs Preview
  uses: masneto/cronicas-actions/.github/actions/preview-docs-action@main
  with:
    step: package
    artifact_repo: masneto/cronicas-docs
    pr_number: ${{ github.event.pull_request.number }}
    artifact_run_id: ${{ github.event.workflow_run.id }}
    token: ${{ secrets.GITHUB_TOKEN }}
```

**Funcionamento:**

- No step `package`: faz checkout do branch `gh-pages`, baixa o artifact do PR, descompacta, copia o conteúdo para a pasta `pr-<número>` e atualiza o `index.html` com um card do PR.
- No step `comment`: remove comentários antigos de outros usuários no PR, posta um comentário com o link do preview e define o output `preview-url`.

## npm-security-audit
**Descrição:**
Audita dependências npm, aplica correções automaticamente e reporta as vulnerabilidades encontradas e corrigidas. Também pode atualizar o changelog de segurança (`SECURITY_FIXES.md`).

- Inputs:
    - working-directory: Diretório do pacote npm relativo à raiz do repositório (padrão: `.`)
    - package-label: Nome exibido no resumo do workflow (padrão: `Package`)
    - changelog-file: Caminho do arquivo markdown com o histórico de vulnerabilidades, relativo à raiz do repositório (padrão: `SECURITY_FIXES.md`)
    - changelog-only: Se `true`, a action não executa auditoria — apenas atualiza o changelog com a entrada `changelog-entries` (padrão: `false`)
    - changelog-entries: Entradas agregadas (multiline) gravadas na seção do dia quando `changelog-only=true`

- Outputs:
    - had-vulnerabilities: `true` quando havia vulnerabilidades (qualquer severidade: info, low, moderate, high, critical) antes do fix
    - before: Quantidade de vulnerabilidades antes do fix
    - after: Quantidade de vulnerabilidades depois do fix
    - audit-before-file: Caminho do JSON de auditoria capturado antes do fix
    - changelog-entries: Linhas de changelog (uma por vulnerabilidade, ou "sem vulnerabilidades") para o workflow agregar

**Como usar em um workflow:**

Auditando um único pacote:
```yaml
- name: Audit
  id: audit
  uses: masneto/cronicas-actions/.github/actions/npm-security-audit@main
  with:
    working-directory: .
    package-label: Meu App
```

Atualizando o changelog com as entradas agregadas:
```yaml
- name: Update security changelog
  if: steps.audit.outputs.had-vulnerabilities == 'true'
  uses: masneto/cronicas-actions/.github/actions/npm-security-audit@main
  with:
    changelog-only: true
    changelog-file: SECURITY_FIXES.md
    changelog-entries: |-
      ${{ steps.audit.outputs.changelog-entries }}
```

**Funcionamento:**

- Instala as dependências com `npm ci` e captura o lockfile antes da correção.
- Executa `npm audit` e conta vulnerabilidades de **todas as severidades** (`info` a `critical`).
- Aplica `npm audit fix --force`, fallbacks e, se necessário, atualiza pins de `overrides` no `package.json` para versões corrigidas.
- Após o fix, gera os outputs `before`, `after`, `had-vulnerabilities` e `changelog-entries`, além de um resumo no job.

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