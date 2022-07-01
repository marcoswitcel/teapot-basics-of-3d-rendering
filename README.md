# Repositório contendo meu primeiro renderizador 3D baseado em CPU com Javascript

Esse repositório contém código que produzi a partir do estudo e compreensão da série de tutoriais presentes nos seguintes link:

* [Índice da série](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
* [Software 3D rendering in JavaScript, Part 1: Wireframe model](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
* [Software 3D rendering in JavaScript, Part 2: Triangles Galore](https://kitsunegames.com/post/development/2016/07/28/software-3d-rendering-in-javascript-pt2/)

O material é de ótima qualidade, porém infelizmente só disponível em Inglês.
Realizei a adaptação do código para fazer uso de [módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules) e por consequência, pude modularizá-lo um pouco, embora não tenha sido muito bem organizado ainda.

Link da página do GitHub Pages: [https://marcoswitcel.github.io/teapot-basics-of-3d-rendering/](https://marcoswitcel.github.io/teapot-basics-of-3d-rendering/)

## Para rodar

Apenas clone o reposítório e sirva os arquivos através de um server HTTP. Usei a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) durante o desenvolvimento, analise a seção "Ambiente de desenvolvimento e técnicas usadas".

## Ambiente de desenvolvimento e técnicas usadas

Durante o desenvolvimento utilizei a IDE [Visual Studio Code](https://code.visualstudio.com/) com a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
Como técnica fiz uso de modularização seguindo o padrão moderno [módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules), com documentação seguindo o [padrão de documentação de tipos JSDoc](https://jsdoc.app/) e com o [arquivo JSConfig e a diretiva checkJs](https://code.visualstudio.com/docs/languages/jsconfig) configurados para forçar a checagem de tipos, evitando assim vários erros, e melhorar as sugestões da IDE.

## Referências

* [Índice da série: "Software 3D rendering in JavaScript using Canvas (series)"](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
  * [Software 3D rendering in JavaScript, Part 1: Wireframe model](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
  * [Software 3D rendering in JavaScript, Part 2: Triangles Galore](https://kitsunegames.com/post/development/2016/07/28/software-3d-rendering-in-javascript-pt2/)
* [Módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)
* [Arquivo JSConfig e a diretiva checkJs](https://code.visualstudio.com/docs/languages/jsconfig)
* [Padrão de documentação de tipos JSDoc](https://jsdoc.app/)
