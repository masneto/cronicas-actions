# cronicas-actions

Repositório de GitHub Actions customizadas para automação dos workflows do projeto Crônicas App.

## Índice

- [Estrutura do Projeto](#estrutura-do-projeto)
- [validate-repo](#validate-repo)
- [email-notification-action](#email-notification-action)
- [preview-docs-action](#preview-docs-action)
- [npm-security-audit](#npm-security-audit)
- [Workflow de Segurança](#workflow-de-segurança)
- [Desenvolvimento](#desenvolvimento)
- [Licença](#licença)

---

## Estrutura do Projeto

```
.github/
    actions/
        ├── email-notification-action/
        │   ├── action.yml
        │   ├── package.json
        │   ├── src/
        │   └── dist/index.js
        ├── npm-security-audit/
        │   ├── action.yml
        │   ├── package.json
        │   ├── src/
        │   └── dist/index.js
        ├── preview-docs-action/
        │   ├── action.yml
        │   ├── package.json
        │   ├── src/
        │   └── dist/index.js
        └── validate-repo/
            ├── action.yml
            ├── package.json
            ├── src/
            └── dist/index.js
    workflows/
        ├── ci-actions.yml
        ├── create-pr.yml
        └── security-audit.yml
SECURITY_FIXES.md
```

O código-fonte fica em `src/` (TypeScript) e é compilado para `dist/index.js` — é o
`dist/` que o GitHub executa, então **precisa ser commitado junto com a mudança em `src/`**.
O workflow de CI faz esse build e commata o `dist/` automaticamente.

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
    - changelog-entries: Linhas de changelog para o workflow agregar, separando o que foi **corrigido** (com a transição de versão) do que **permanece**

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

- Instala as dependências com `npm ci` e lê o lockfile do commit atual
  (`git show HEAD:<lockfile>`) para ter a versão "antes" mesmo sem precisar reverter o disco.
- Roda `npm audit` e conta vulnerabilidades de **todas as severidades** (`info` a `critical`).
- Executa até 3 rodadas de `npm audit fix --force`, medindo o resultado de cada uma. Só segue
  para a próxima rodada se a contagem realmente caiu.
- Para as vulnerabilidades que sobram, resolve as versões uma a uma, da severidade mais alta
  para a mais baixa (`critical` → `info`). Para cada pacote tenta, nesta ordem:
    1. a versão sugerida pelo advisory;
    2. a `latest` do **mesmo major** da versão instalada;
    3. a `latest` global.
  A primeira tentativa que **reduz** a contagem total é mantida; as demais são revertidas
  (snapshot de `package.json` + `package-lock.json` restaurados byte a byte).
- Pacotes que são dependência direta (`dependencies`, `devDependencies`, `optionalDependencies`,
  `peerDependencies`) recebem `^versão` no campo original. Transitivos entram em `overrides`.
- Por fim, `pruneObsoleteOverrides` remove os pins que a árvore já resolve sozinha, para não
  deixar override obsoleto travando a dependência numa versão antiga.
- Emite os outputs e escreve um resumo no job com as dependências corrigidas e os overrides removidos.

**Formato das entradas geradas:**

```
- **Label:** pacote `1.0.0` → `1.2.0` — _Título do advisory_ (high, corrigida)
- **Label:** pacote `>=1.0.0 <1.2.0` → `1.3.0` — _Título do advisory_ (high, remanescente)
- **Label:** sem vulnerabilidades
```

Cada execução grava uma seção nova com a data no topo do arquivo, com a lista agregada de todos
os pacotes auditados e a linha `Pipeline:` apontando para o run. Seções antigas são preservadas.

## Workflow de Segurança

O `security-audit.yml` é a referência de uso completa da `npm-security-audit`. Ele roda
diariamente (e a cada push), audita **todos** os pacotes do repositório numa passada só,
consolida tudo num único `SECURITY_FIXES.md`, abre o PR e faz o merge automático.

```yaml
- name: Audit validate repo action
  id: validate
  uses: masneto/cronicas-actions/.github/actions/npm-security-audit@main
  with:
    working-directory: .github/actions/validate-repo
    package-label: Validate Repo Action
```

Depois, um passo separado recebe as entradas de todos os pacotes e grava o changelog:

```yaml
- name: Update security changelog
  if: steps.email.outputs.had-vulnerabilities == 'true' || steps.security.outputs.had-vulnerabilities == 'true' || steps.preview.outputs.had-vulnerabilities == 'true' || steps.validate.outputs.had-vulnerabilities == 'true'
  uses: masneto/cronicas-actions/.github/actions/npm-security-audit@main
  with:
    changelog-only: true
    changelog-file: SECURITY_FIXES.md
    changelog-entries: |-
      ${{ steps.email.outputs.changelog-entries }}
      ${{ steps.security.outputs.changelog-entries }}
      ${{ steps.preview.outputs.changelog-entries }}
      ${{ steps.validate.outputs.changelog-entries }}
```

**Comportamento a saber:**

- O `changelog-only` é puramente editorial: ele não audita nada, só prepende a seção do dia.
  Quando nenhuma entrada indica vulnerabilidade real, ele sai sem escrever.
- O `git diff` que decide a criação do PR roda **depois** do passo de changelog. Como o
  `SECURITY_FIXES.md` é um arquivo versionado, um advisory que não pôde ser corrigido
  **ainda assim** abre PR — só com a linha do changelog. Isso é intencional: mantém o
  advisory pendente visível e registrado no histórico do repositório.
- O PR é mergeado automaticamente (squash) na branch `security/npm-audit-fixes`.

## Desenvolvimento

Cada action é um pacote npm independente, com dois scripts:

```bash
cd .github/actions/npm-security-audit
npm ci
npm run lint     # eslint
npm run build    # ncc build src/index.ts -o dist
```

Ao alterar `src/`, rode `npm run build` e commite o `dist/index.js` junto. O
`ci-actions.yml` faz isso automaticamente, mas commitar junto evita depender do bot.

Para publicar: abrir PR a partir de uma branch `feature/*` — o `create-pr.yml` cria o PR
para `main` e o `ci-actions.yml` rebuilda as actions alteradas.

## Licença
Projeto privado. Todos os direitos reservados. Nenhuma licença de uso, cópia ou redistribuição é concedida.