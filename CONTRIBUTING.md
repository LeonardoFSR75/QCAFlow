# Contribuindo com o QCAFlow

Obrigado pelo interesse em contribuir! O QCAFlow é um projeto de código aberto (MIT) e contribuições são bem-vindas.

## Reportando problemas (bugs)

Abra uma *issue* no repositório GitHub descrevendo:
- Comportamento esperado vs. observado.
- Passos para reproduzir (idealmente com um conjunto de dados mínimo).
- Navegador e sistema operacional.

## Propondo mudanças (pull requests)

1. Faça um fork do repositório e crie um branch a partir de `main`.
2. O projeto é um único arquivo HTML5 autocontido (`QCAFlow.html`) — sem build step, sem dependências de instalação. Edite diretamente e abra o arquivo no navegador para testar.
3. Antes de submeter, rode os testes automatizados dos algoritmos centrais:
   ```bash
   node tests/core-algorithms.test.js
   ```
   Se sua mudança afeta cálculo (calibração, tabela verdade, minimização booleana, soluções), adicione um caso de teste correspondente em `tests/core-algorithms.test.js`.
4. Mantenha a filosofia de zero dependências externas — não adicione bibliotecas via CDN nem passos de build.
5. Abra o pull request descrevendo a motivação e o que foi alterado.

## Dúvidas metodológicas (fsQCA)

Para dúvidas sobre a metodologia fsQCA em si (não sobre o código), consulte a aba **Instruções** da ferramenta e as referências citadas no [README](README.md).

## Código de conduta

Seja respeitoso e construtivo nas interações. Discordâncias técnicas são bem-vindas; ataques pessoais não.
