# Repositório contendo meu primeiro renderizador 3D baseado em CPU com Javascript

Esse repositório contém código que produzi a partir do estudo e compreensão da série de tutoriais presentes nos seguintes link:

* [Índice da série](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
* [Software 3D rendering in JavaScript, Part 1: Wireframe model](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
* [Software 3D rendering in JavaScript, Part 2: Triangles Galore](https://kitsunegames.com/post/development/2016/07/28/software-3d-rendering-in-javascript-pt2/)

O material é de ótima qualidade, porém infelizmente só disponível em Inglês.
Realizei a adaptação do código para fazer uso de [Módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules) e por consequência, pude modularizá-lo um pouco, embora não tenha sido muito bem organizado ainda.

## Para rodar

Apenas clone o reposítório e sirva os arquivos através de um server HTTP. Usei a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) durante o desenvolvimento, analise a seção "Ambiente de desenvolvimento e técnicas usadas".

## Ambiente de desenvolvimento e técnicas usadas

Para desenvolver usei a IDE [Visul Studio](https://code.visualstudio.com/), a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) para a mesma IDE.
Como técnica fiz uso de modularização seguindo o padrão moderno [Módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules), com documentação seguindo o [Padrão de documentação de tipos JSDoc](https://jsdoc.app/) e com o [arquivo JSConfig e a diretiva checkJs](https://code.visualstudio.com/docs/languages/jsconfig) configurados para forçar a checagem de tipos e suporte.

## Referências

* [Índice da série: "Software 3D rendering in JavaScript using Canvas (series)"](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
  * [Software 3D rendering in JavaScript, Part 1: Wireframe model](https://kitsunegames.com/post/development/2016/07/11/canvas3d-3d-rendering-in-javascript/)
  * [Software 3D rendering in JavaScript, Part 2: Triangles Galore](https://kitsunegames.com/post/development/2016/07/28/software-3d-rendering-in-javascript-pt2/)
* [Módulos ES6](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules)
* [Arquivo JSConfig e a diretiva checkJs](https://code.visualstudio.com/docs/languages/jsconfig)
* [Padrão de documentação de tipos JSDoc](https://jsdoc.app/)
