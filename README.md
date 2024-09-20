# Paintbrush

Projeto desenvolvido para a disciplina de Computação Gráfica da PUC Minas.

Foi desenvolvido um modelo de Paintbrush com a possibilidade de se desenhar retas, poligonos, circunferências, além de permitir rotacionar, transladar, escalara e refletir os objetos.

Para que as transformadas possam ser melhor visualizadas, o ponto (0,0) foi posicionado no centro do canvas.

## Demonstração

Acesse o projeto em: Link para o Github Pages

## Tecnologias Utilizadas
 - JavaScript
 - HTML
 - CSS

## Como Rodar o Projeto Localmente

Instale o node.js.

Clone o repositório:
```
git clone https://github.com/CamillaTeodoro/ComputerGraphics_Paintbrush.git
```

Acesse a pasta do projeto:
```
cd ComputerGraphics_Paintbrush
```

Rode:
```
npm install
```
```
npm start
```

No browser acesse:
```
http://127.0.0.1:8080/
```

Se estiver utilizando o VSCode, instale a extensão **Live Server** e clique em **Go Live** no canto inferior direito.

## Como Utilizar

O projeto simula um Paintbrush e seu funcionamento é bem parecido com o mesmo.

No menu superior é possível escolher a cor que o objeto será desenhado.

A escolha da opção é feita através de radio-buttons.

### Ponto
- Escolha a cor.
- Clique na tela.

### Reta
- Escolha a cor.
- Escolha se deseja utilizar o algoritmo de DDA ou Bresenham para traçar a reta.
- Clique na tela no ponto inicial e no ponto final da reta.

### Circunferência
- Escolha a cor.
- Clique na tela para selecionar o ponto central da circunferência e clique novamente para definir o raio.

### Polígono
- Escolha a cor.
- Digite o número de lados do polígono.
- Escolha se deseja utilizar o algoritmo de DDA ou Bresenham para traçar os lados do polígono.
- Clique na tela nos pontos que serão vértices do polígono.

### Translação
 - Digite o valor para transladar em X e em Y.
 - Valores podem ser positivos e negativos.

### Escala
 - Digite o valor para aumentar ou diminuir em X e em Y.
 - Valores entre 0 e 1 diminuem e maiores que 1 aumentam.

### Rotação
 - Digite o angulo em graus para rotacionar.

### Espelhamento
 - Digite 1 para espelhar em relação à X, Y ou à X e Y.

### Janelas de Visualização
 - Tanto para o algoritmo de Cohen-Sutherland quanto o de Liang-Barsky, basta selecionar os dois pontos na tela que formarão a janela de visualização.
 - Somente retas serão mostradas na janela, sendo pontos e circunferências ignorados.

### Limpar tela
- Apaga os objetos da tela e limpa a estrutura de dados.

### Reset janela
- Remove a janela e redesenha todos os objetos salvos na estrutura de dados.


## Como contribuir
Contribuições são bem-vindas! Para contribuir com o projeto:

 - Faça um fork do repositório.
 - Crie uma branch para sua feature (git checkout -b feature/sua-feature).
 - Faça commit das suas alterações (git commit -am 'Adicionando sua feature').
 - Abra um Pull Request.

