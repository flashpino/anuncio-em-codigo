# Anúncio em código

Modelo para criar vídeos de anúncio no formato **dor → solução**, animados
inteiramente em código com [Remotion](https://www.remotion.dev). Você descreve o
produto para um assistente de código (Claude Code, por exemplo), ele escreve as
cenas e renderiza o `.mp4`. Sem editor de vídeo, sem filmagem.

![Exemplo](docs/exemplo.gif)

O exemplo acima é o que vem no repositório: um anúncio de 37 segundos de um
produto fictício (um app de reembolso de despesas). Ele não tem áudio.

Há também uma peça vertical de 6 segundos (1080×1920) que mostra as regras de
movimento do guia: tipografia cinética, uma forma que vira outra, camadas 3D e
câmera em movimento.

<img src="docs/vertical.gif" width="240" alt="Peça vertical de 6 segundos">


## O que tem aqui

| Arquivo | Para quê |
|---|---|
| [`GUIA.md`](GUIA.md) | O método completo: o que faz o estilo funcionar, estrutura do roteiro, técnicas, conferência. É o que o assistente lê |
| `src/kit.tsx` | Peças prontas: cena com transição, texto palavra por palavra, palavra que bate na tela, forma que vira outra, palco 3D com câmera, objeto que quica e flutua, etiquetas, contador, molduras de celular e navegador |
| `src/Root.tsx` | Os dois exemplos: o anúncio completo (`Anuncio`) e a peça vertical de 6 s (`Vertical`). São o molde das suas cenas |
| `capturar-telas.mjs` | Tira prints de um sistema web real para pôr no vídeo, com troca de nomes e números sensíveis |

## Como usar

Você precisa de [Node.js](https://nodejs.org) 18 ou mais novo.

```bash
git clone https://github.com/flashpino/anuncio-em-codigo.git meu-anuncio
```

```bash
cd meu-anuncio
```

```bash
npm install
```

```bash
npm run dev
```

O último comando abre o Remotion Studio no navegador com o exemplo tocando.

Depois abra a pasta no seu assistente de código e mande o pedido abaixo,
trocando o que está entre colchetes.

### Pedido para colar

```text
Leia o GUIA.md e o src/Root.tsx inteiros antes de qualquer coisa.

Quero um anúncio no estilo deste repositório para o meu produto.

- Produto: [NOME] — [o que ele faz, em uma frase]
- Quem usa: [PÚBLICO]
- A dor: [o incômodo do dia a dia, com uma situação real: quando, onde, o que dá errado]
- Formato e duração: [ex.: 1080x1920, 6 s — ou 1920x1080, 35 s]
- Chamada final: [o que a pessoa deve fazer: testar, baixar, agendar, comentar]
- Marca: cor principal [#HEX]; logo em [caminho do arquivo, ou "não tenho"]
- Telas reais: [o produto roda em ENDEREÇO e posso logar / não tenho telas ainda]
- Nomes e números reais podem aparecer nas telas? [sim / não]
- Áudio: [sem áudio por enquanto / vou gravar a locução / voz sintética]

Se algum colchete acima não foi preenchido, pare e me pergunte antes de começar.

Siga o guia nesta ordem:
1. Me mostre o roteiro em tabela (frase, objeto herói, detalhe) e, para cada
   regra de movimento da seção 6.4 do guia, onde ela aparece. Espere eu aprovar.
2. Troque o bloco MARCA em src/kit.tsx e escreva as cenas em src/Root.tsx.
3. Renderize um quadro de cada cena, junte numa folha, olhe e corrija o que
   estiver cortado, sobreposto ou parado.
4. Renderize o vídeo e me diga onde ficou, o que você conferiu e o que não conferiu.
```

A primeira versão costuma sair boa, não perfeita. Peça ajustes por escrito, do
jeito que você falaria: "a cena 4 está rápida", "troca o exemplo do e-mail por
um boleto", "o herói da cena 3 está pequeno".

## Comandos

```bash
npm run dev
```

```bash
npm run render
```

```bash
npx remotion still Anuncio out/q.png --frame=300 --scale=0.5
```

O primeiro abre a prévia, o segundo gera `out/anuncio.mp4` e o terceiro salva um
quadro só (para conferir uma cena sem renderizar tudo).

## Limites

- **Áudio não vem pronto.** O guia explica como acrescentar locução e efeitos,
  mas o modelo não traz isso implementado.
- **Telas reais exigem que você faça o login.** O script de captura abre uma
  janela e espera; ele não digita senha.
- **Prints não vão para o git por padrão** (`public/screens/` está no
  `.gitignore`), porque costumam ter dados de clientes.
- As peças de layout `Left` e `Right` são para 16:9. No vertical, posicione os
  elementos como na composição `Vertical`.
- O 3D é feito de planos girando no espaço; não há objetos com volume nem luz.

## Licenças e créditos

- O código deste repositório está sob a [licença MIT](LICENSE): pode usar, alterar e
  redistribuir, inclusive comercialmente.
- O Remotion tem [licença própria](https://www.remotion.dev/license): gratuito
  para pessoas e empresas pequenas, pago para empresas maiores. Confira antes de
  usar comercialmente.
- Fontes: Outfit e Instrument Serif, ambas sob a SIL Open Font License.
- O formato do roteiro e o estilo visual se inspiram no anúncio do app fictício
  "Dorme", de Marcos Levi.
