# Prepare and Dispatch Workflow

Esta action composta orquestra a preparação (cópia e push do workflow) e o disparo do workflow em sequência, garantindo que o arquivo seja indexado antes do dispatch.

## Entradas
- `source-file`: Caminho do workflow a ser copiado
- `branch`: Branch base
- `inputs-json`: Inputs para o workflow (JSON)
- `token`: GitHub Token

## Funcionamento
1. Executa a action `prepare-workflow` para copiar o arquivo e criar a branch temporária.
2. Usa os outputs para chamar a action `dispatch-workflow`, disparando o workflow pelo nome do arquivo.
