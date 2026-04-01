# English Trainer Pro

English Trainer Pro é uma aplicação web simples para praticar verbos em inglês (principalmente passado simples), com foco em estudantes de português. [^1]

<img width="430" height="402" alt="image" src="https://github.com/user-attachments/assets/17d9a95a-8529-4dd4-9936-9cb15b5f4f53" />
https://belisnalvacosta.github.io/english-trainer/ 

## 🚀 Recursos

- Leitura de verbos de `verbs.json`
- Modo:
  - Todos
  - Somente irregulares
  - Somente regulares
- Verbo atual exibindo:
  - base
  - participle
  - tradução (PT)
- Input de resposta para o passado simples
- confirmação de resposta: correto/errado
- histórico de últimas 20 tentativas
- salvar progresso em `localStorage`:
  - pontos
  - nível
  - modo selecionado
  - índice atual
  - histórico
- botões:
  - Voltar (questão anterior)
  - Responder
  - Próximo
  - Ouvir (Text-to-Speech)
  - Exemplos (frases com base/past/participle)
  - Limpar histórico

## 🧩 Níveis

- Nível 1: 0-49 pontos
- Nível 2: 50-99 pontos
- Nível 3: 100+ pontos

## 📁 Estrutura do projeto

- `index.html` - interface e elementos
- `style.css` - estilos visuais
- `script.js` - lógica de negócio
- `verbs.json` - lista de verbos (base/past/participle/PT)
- `README.md` - documentação

## ▶️ Como usar

1. Abra `index.html` num navegador.
2. Selecione o modo (Todos/Irregulares/Regulares).
3. Observe o verbo atual e digite o passado simples no campo.
4. Clique em `Responder` ou pressione `Enter`.
5. Consulte o feedback, histórico e use `Próximo` ou `Voltar` manualmente.
6. Use `Exemplos` para ver frases úteis.
7. Use `🔊` para ouvir pronúncia em inglês.

## 💾 Persistência local

O jogo salva no `localStorage` para continuar depois de recarregar a página.

## 🔧 Personalizações sugeridas

- função ‘auto-advance’ on/off (avançar após resposta correta), etc.

## 🙋 Contribuição

1. Fork no GitHub
2. `git clone`
3. Modifique files
4. `git add .`, `git commit -m "melhoria"`, `git push`
5. Abra Pull Request

## 📜 Licença

MIT

[^1]: Projeto criado para uso pessoal, "intuito de praticar Inglês no dia a dia".
