# Guia: anúncio animado "dor → solução" feito em código

Este guia ensina a produzir um vídeo de anúncio no estilo deste repositório,
para qualquer produto. Ele é escrito para quem vai construir o vídeo, seja um
assistente de código (Claude Code ou outro) ou uma pessoa.

O vídeo é 100% código: React + [Remotion](https://www.remotion.dev) desenham
cada quadro. Não há edição em timeline, filmagem nem personagens 3D.

**Onde está o quê**

| Arquivo | O que é | Você edita? |
|---|---|---|
| `src/kit.tsx` | Peças reutilizáveis: cena, texto, herói, etiquetas, molduras, linha do tempo | Só o bloco `MARCA` |
| `src/Root.tsx` | O anúncio. Vem com um exemplo completo de um produto fictício | Sim: apague as cenas do exemplo e escreva as suas |
| `capturar-telas.mjs` | Tira prints de um sistema web real | Só o bloco de configuração |
| `public/` | Logo, prints, áudio | Sim |

Leia `src/Root.tsx` inteiro antes de começar: ele é a demonstração de tudo o que
este guia descreve.

---

## 1. O que faz esse estilo funcionar

Um vídeo com as frases certas, as cores da marca e boas transições ainda pode
parecer uma apresentação de slides. O que separa uma coisa da outra está nesta
seção. Se for ler só uma parte do guia, leia esta.

**Cada cena tem três camadas, e as três se mexem.**

1. **A frase**, à esquerda, surgindo palavra por palavra.
2. **O objeto herói**, à direita: algo que o espectador reconhece da própria
   vida (um celular com notificações, uma conversa de mensagens, uma pilha de
   papel, um calendário, um extrato). Ele entra quicando e fica flutuando.
3. **Um detalhe de interface que conta a piada**: um contador, uma etiqueta, um
   carimbo, um selo de status. É a camada que faz a pessoa sorrir, e é a que
   mais se esquece.

**Alguma coisa acontece durante a cena, não só na entrada.** Um número conta até
o total. Mensagens chegam uma a uma. A tinta de um recibo vai sumindo e um
carimbo bate em cima. Se depois de um segundo a cena está parada, ela está
errada.

**Os objetos são específicos, não genéricos.** "Ícone de recibo + frase" é
fraco. "Conversa em que o financeiro pergunta do recibo e a resposta é 'tá na
outra calça… na máquina de lavar'" é forte. O espectador precisa se ver na cena.

**Um fio condutor liga as cenas da dor.** Uma etiqueta fixa no canto com um
valor que avança de cena em cena e fica vermelha na pior delas: um relógio, um
valor em dinheiro, a bateria, o tamanho de uma fila. No kit é o `Meter`.

**Sinais de que a cena ficou fraca**

- tudo centralizado na tela;
- um ícone solto com uma frase embaixo;
- fundo de uma cor só, igual em todas as cenas;
- nada se move depois da animação de entrada;
- fonte do sistema, sem contraste de peso ou de estilo;
- texto que serviria para qualquer anúncio de qualquer produto.

---

## 2. Antes de escrever código

### 2.1 Pergunte o que só o dono do produto sabe

Faça as perguntas de uma vez, antes de construir:

- **Produto e público:** o que é, quem usa, qual é o incômodo do dia a dia que
  ele resolve. Peça uma situação real, com hora e lugar.
- **Formato:** 16:9 (site, apresentação, YouTube) ou 9:16 (Reels, Stories, TikTok).
- **Final:** qual ação a pessoa deve tomar (testar, baixar, agendar, comentar).
- **Marca:** arquivo do logo, cores e fonte. Se houver um repositório do
  produto, procure lá primeiro (`public/`, `assets/`, variáveis CSS).
- **Telas:** o produto existe e dá para tirar prints? Nomes de clientes e
  números reais podem aparecer?
- **Dados do roteiro:** os números da dor podem ser ilustrativos?
- **Voz:** locução gravada, voz sintética ou vídeo mudo.

Não invente o logo nem a cor da marca. Se não houver logo, o kit desenha a
inicial do produto; deixe assim até receber o arquivo.

### 2.2 Se houver um vídeo de referência, estude-o em quadros

Não trabalhe a partir de miniaturas. Recorte a área útil e extraia quadros densos:

```bash
# 4 quadros por segundo, em folhas de 32 quadros (8 segundos por folha)
ffmpeg -ss 0 -t 8 -i ref.mp4 -vf "crop=W:H:X:Y,fps=4,scale=420:-1,tile=4x8" -frames:v 1 folha_0.png
```

Anote, cena por cena: qual é o herói, qual é o detalhe de interface, o que se
move, como é a transição, qual é a proporção da tela.

### 2.3 Aprove o roteiro antes de animar

Mostre o roteiro numa tabela com três colunas (frase, herói, detalhe) e só
construa depois do "ok". Mudar uma frase no roteiro custa segundos; mudar uma
cena pronta custa a cena.

---

## 3. O roteiro

Frases curtas, uma ideia por tela, tom de conversa. A estrutura tem dez blocos;
a coluna da direita é o exemplo que vem no repositório.

| # | Bloco | O que é | No exemplo (app de reembolso) |
|---|---|---|---|
| 1 | Gancho | Uma situação concreta, com hora e lugar | "dia trinta. o financeiro fecha às seis." |
| 2 | Número que assusta | A virada do gancho, em tela cheia | "são 17:42. e você ainda tá caçando recibo." |
| 3 | Volume | Quanto do problema existe | "23 notinhas. todas na carteira." |
| 4 | Dores (duas ou três) | Uma cena por exemplo, cada uma com seu objeto | o recibo que ficou na outra calça; o que já apagou |
| 5 | Custo | O total por ano | "isso dá quase R$ 2.400 por ano que você nunca pediu." |
| 6 | Virada | Entra a marca | "por isso a gente criou o" → logo |
| 7 | Produto | O produto resolvendo, na tela | "aponta a câmera, ele lê o recibo e o reembolso sai sozinho." |
| 8 | Três palavras | Ritmo de slogan | "Fotografou. Enviou. Recebeu." |
| 9 | Assinatura (opcional) | Logo + frase de posicionamento | — |
| 10 | Chamada | O que fazer agora | "peça de volta CADA CENTAVO" |

Regras de texto:

- Minúsculas no corpo, como fala. Maiúscula só nas três palavras e na chamada.
- Em cada frase, **uma** palavra ganha destaque: serifa itálica, marca-texto ou
  cor. Nunca duas.
- A última dor é a mais grave e é ela que deixa o fio condutor vermelho.
- O bloco 7 mostra o produto de verdade sempre que ele existir (seção 8). Tela
  inventada num produto real passa a impressão de que o anúncio não é sobre ele.
- Para locução, escreva números por extenso e evite reticências.

Como achar os números: o do bloco 2 é o momento do aperto (uma hora, um prazo);
o do bloco 3 é uma contagem que cabe numa pilha (dezenas, não milhares); o do
bloco 5 é o bloco 3 multiplicado por um ano. Se forem ilustrativos, diga isso a
quem pediu o vídeo.

Duração: 30 a 40 segundos. Cada cena dura de 2,5 a 4 segundos; só a do produto
passa disso.

---

## 4. Ambiente

```bash
npm install
npm run dev      # Remotion Studio: prévia no navegador, com a linha do tempo
npm run render   # gera out/anuncio.mp4
npx remotion still Anuncio out/q.png --frame=300 --scale=0.5   # um quadro
```

- Requer Node 18 ou mais novo. A primeira renderização baixa um Chrome próprio
  do Remotion e demora mais.
- Arquivos em `public/` são lidos com `staticFile("nome.png")`.
- Formato padrão: 1920×1080, 30 quadros por segundo. Para vertical, troque `W` e
  `H` em `kit.tsx` para 1080×1920 e empilhe: texto no terço de cima, herói
  embaixo (os componentes `Left` e `Right` posicionam em pixels; ajuste `top`,
  `left` e `width` nas cenas).
- O Remotion tem [licença própria](https://www.remotion.dev/license): gratuito
  para pessoas e empresas pequenas, pago para empresas maiores.

---

## 5. Como o código se organiza

### 5.1 Linha do tempo

Cada cena é um componente que recebe `dur` (duração em quadros). A lista `CENAS`
no fim de `Root.tsx` define a ordem e as durações:

```tsx
const CENAS: Cena[] = [
  { C: Gancho, dur: 90 },
  { C: Numero, dur: 100 },
  // ...
];
```

`<Filme cenas={CENAS} />` empilha as cenas com 8 quadros de sobreposição
(`LEAD`), que é onde a transição acontece. Mudar o ritmo é mudar um número
nessa lista. Dentro da cena os tempos são locais: `at={24}` quer dizer "24
quadros depois de a cena começar".

### 5.2 Esqueleto de uma cena

```tsx
const MinhaDor: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF(); // quadro atual, dentro da cena
  return (
    <Scene dur={dur} tint="sky" meter={<Meter from={1068} to={1074} dur={dur} />}>
      <Left top={270}>
        <Txt w={[["o"], ["recibo"], ["do"], ["táxi"]]} at={10} />
        <Txt w={[["ficou", "s"], ["na"], ["outra"]]} at={24} />
        <Pill at={56}>…o detalhe que conta a piada…</Pill>
      </Left>
      <Right>
        <Hero at={12} rot={-3}>…o objeto herói…</Hero>
      </Right>
    </Scene>
  );
};
```

`Scene` cuida do fundo, da transição borrada de entrada e de saída e do grão.

### 5.3 Regras de código

- **Determinístico.** Nada de `Math.random()` nem `Date.now()`. Variação vem de
  aritmética sobre o índice: `((i * 37) % 11) - 5`.
- Todo movimento deriva do quadro atual (`useF()`). Nada de animação CSS,
  `setTimeout` ou estado.
- Arredonde valores de `transform` e `filter` com `r2`.
- Limite todo `interpolate` com `cl` (`extrapolate…: "clamp"`).
- `Easing` tem `quad`, `cubic`, `poly(n)` e `bezier`. **Não existe
  `Easing.quart`**; use `Easing.poly(4)`.

---

## 6. Linguagem visual

### 6.1 Cor

- Tinta quase preta (`C.ink`) para texto; cinza (`C.muted`) para apoio.
- **Uma** cor de marca (`MARCA.cor`) para destaques e botões, e uma versão bem
  clara dela (`MARCA.corClara`) para o marca-texto.
- Vermelho só para o que deu errado; verde só para o que deu certo.
- Fundo quase branco com três manchas de gradiente muito claras. Cada cena usa
  um conjunto diferente (`tint`): `lilac`, `warm`, `sky`, `rose`, `violet`,
  `mint`, `clean`. A troca de tom a cada cena é o que impede o vídeo de parecer
  um slide só. Regra prática: as cenas da dor esquentam (`warm`, `rose`); as do
  produto ficam limpas (`clean`, `mint`).
- Grão de filme por cima de tudo (já vem no `Scene`).

### 6.2 Tipografia

- Sem serifa geométrica e pesada para tudo: Outfit, peso 700 (800 nos números).
- Serifa itálica para a palavra de destaque: Instrument Serif.
- Tamanhos em 1920×1080: título 104; subtítulo 58 a 64; número gigante 330 a
  520; texto dentro de cartões 22 a 42.
- Números que mudam usam `fontVariantNumeric: "tabular-nums"` para não tremer.

### 6.3 Layout

- Duas colunas: texto a partir de x=150 (`Left`), herói centralizado na faixa
  da direita (`Right`).
- Centralizadas (`Centro`) só o número em tela cheia, a entrada do logo e a
  assinatura.
- Cartões (`card`): branco translúcido, cantos de 28, sombra longa.
- Heróis levemente girados (2° a 5°). Telas reais ficam retas.

---

## 7. Catálogo de peças

Tudo está em `src/kit.tsx`; a coluna "Onde ver" aponta a cena do exemplo.

| Peça | O que faz | Onde ver |
|---|---|---|
| `Txt` | Uma linha de texto que surge palavra por palavra. Cada palavra é `[texto, estilo]`: `"s"` serifa, `"k"` marca-texto, `"m"` apagado, `"r"` serifa vermelha, `"a"` cor da marca | todas |
| `Hero` | Embrulha o objeto herói: entra quicando, flutua, tem sombra. `rot` gira, `k` aumenta | todas |
| `Pop` | Faz um item "estalar" na tela: mensagem, linha de lista, cartão | `DorConversa` |
| `Chip` | Etiqueta flutuante solta, em posição absoluta | `Numero` |
| `Pill` | Pílula abaixo do texto para contadores e legendas (a terceira camada) | `DorConversa`, `Custo` |
| `Counter` | Número que rola até o total, borrado enquanto corre; aceita `format` | `Custo` |
| `Meter` | Fio condutor no canto; `from`/`to`, `label`, `format`, `red` | `Volume`, dores |
| `Phone` | Moldura de celular | `Gancho`, `Produto` |
| `Browser` | Moldura de navegador | — |
| `Shots` | Prints reais em sequência, cada um deslizando sobre o anterior | — (seção 8) |
| `Logo`, `LogoIcon` | Logo da marca; usa `MARCA.logo` ou desenha a inicial | `Virada`, `Chamada` |
| `Check`, `Dot`, `card` | Miudezas: visto, quadradinho de cor, estilo de cartão | várias |

Técnicas que não são peças, mas estão no exemplo para copiar:

| Técnica | Como | Onde ver |
|---|---|---|
| Número em tela cheia rolando | interpola o valor com `Easing.out`; borrão proporcional à velocidade; "tranco" de escala ao chegar | `Numero` |
| Contagem com objetos | o número e a quantidade de objetos visíveis saem da mesma conta, então sobem juntos | `Volume` |
| Objeto que se estraga | `opacity` do conteúdo interpolada até quase zero | `DorApagou` |
| Carimbo | texto com borda grossa entrando de escala 2,4 → 1 com mola dura, girado 12° | `DorApagou` |
| "digitando…" | um texto que troca conforme o quadro | `DorConversa` |
| Pontos que enchem | grade de 50 pontos; os primeiros `n` ficam escuros | `Custo` |
| Logo que nasce de um ponto | o ponto cresce e some enquanto o logo entra com escala e desfoque | `Virada` |
| Passo a passo no celular | linhas que aparecem em sequência, botão que afunda, tela de sucesso que cobre tudo | `Produto` |
| Traço que se desenha | `strokeDasharray` do tamanho do traço e `strokeDashoffset` interpolado até 0 | — |

### Ideias de herói por tipo de dor

O herói é montado com `div`, texto e SVG simples. Não precisa de imagem externa.

| Dor | Herói | Detalhe que conta a piada |
|---|---|---|
| Informação presa com alguém | conversa de mensagens | "visto por último há 12 dias"; contador "pedidos 3 · achados 0" |
| Cobrança repetida | caixa de entrada | três e-mails com "RE: RE: URGENTE" |
| Prazo perdido | calendário | o dia fica vermelho + carimbo "VENCIDO" |
| Papelada, retrabalho | pilha de folhas ou recibos caindo | número que sobe junto com a pilha |
| Tempo desperdiçado | gráfico de barras | uma barra vermelha com o nome do vilão |
| Sobrecarga, hora avançada | tela de bloqueio do celular | notificações empilhando |
| Dinheiro perdido | extrato, boleto, cupom | valor que sobe; selo "em atraso" |
| Caos de versões | janela de arquivos | `planilha_final_v7.xlsx` |
| Fila, espera | lista de senhas, chamados | posição que não anda |
| Esquecimento | lista de tarefas, lembretes | itens riscados que voltam |
| Assinaturas, cobranças escondidas | fatura do cartão | linhas repetidas se acendendo |
| Bagunça de senhas, acessos | tela de login | "senha incorreta" tremendo, contador de tentativas |

---

## 8. Telas reais do produto

Se o produto existe, o bloco 7 usa prints de verdade.

1. Configure o topo de `capturar-telas.mjs`: endereço, rotas, o que esconder.
2. Instale o Playwright (`npm i -D playwright && npx playwright install chromium`).
3. Rode `node capturar-telas.mjs --visivel`. Abre uma janela; **quem faz o login
   é a pessoa**, com a própria conta. Um assistente de IA nunca deve digitar a
   senha. A sessão fica guardada em `.perfil-captura/`, fora do git.
4. Os prints saem em `public/screens/`, em tamanho desktop e celular.

Cuidados:

- **Só leitura.** O script navega por endereço. Não automatize cliques em botões
  que salvam, executam ou excluem, principalmente num sistema ligado a dados de
  verdade.
- **Dados sensíveis.** Pergunte se nomes e números reais podem aparecer. Se não,
  preencha `TROCAS` (nomes) e `ROTAS_COM_NUMEROS` (indicadores). A troca é feita
  no texto da página aberta pelo script, nunca no banco. Os números são todos
  multiplicados pelo mesmo fator, para gráficos e percentuais continuarem coerentes.
- **Confira cada print antes de usar:** tela ainda carregando, lista vazia por
  causa de um filtro, nome real que escapou por estar escrito de outro jeito,
  aviso cobrindo o conteúdo.
- `public/screens/` está no `.gitignore`. Só publique prints se tiver certeza de
  que não têm dado de terceiros.

No vídeo:

```tsx
<Phone w={440} h={880}>
  <div style={{ position: "absolute", inset: "46px 0 0 0" }}>
    <Shots
      shots={[
        { src: "screens/inicio-mobile.png", at: 14 },
        { src: "screens/pedidos-mobile.png", at: 72 },
      ]}
    />
  </div>
</Phone>
```

Ao lado, uma lista numerada de recursos em que a linha do recurso que está na
tela fica destacada. Para a visão de gestão, uma segunda cena com `Browser` e os
prints de desktop (`pan={0}`). Escolha de telas: comece pela que mostra todos os
módulos de uma vez; depois, uma tela por recurso citado.

---

## 9. Conferência

Quem constrói o vídeo em código não assiste a ele: olha quadros. Faça isso
antes de renderizar e antes de dizer que está pronto.

1. Renderize um quadro por cena, perto do fim da cena, quando tudo já entrou, e
   mais um no meio de uma transição e outro no meio de uma contagem:
   ```bash
   npx remotion still Anuncio out/q_01.png --frame=80 --scale=0.5
   ```
2. Junte numa folha só e olhe uma imagem:
   ```bash
   ffmpeg -y -framerate 1 -i out/q_%02d.png -frames:v 1 -vf "scale=640:-1,tile=3x4" out/folha.png
   ```
   Os arquivos precisam estar numerados em sequência, sem buracos.
3. Procure: texto cortado na borda, elementos sobrepostos, etiqueta quebrando
   linha, cartão vazio, herói pequeno demais, cena sem a terceira camada.
4. Corrija e refaça só os quadros afetados.
5. Com o vídeo pronto, extraia dois ou três quadros do próprio `.mp4` para
   confirmar o arquivo final.

Ao entregar, diga o que foi conferido (quadros parados) e o que não foi
(movimento, ritmo, áudio). Quem assiste é a pessoa.

### Erros comuns

| Sintoma | Causa | Correção |
|---|---|---|
| `easing is not a function` | `Easing.quart` não existe | `Easing.poly(4)` |
| Barra de gráfico com largura zero | `writingMode: "vertical-rl"` no próprio bloco | pôr o `writingMode` num `span` interno e `width: "100%"` no bloco |
| Palavra grande saiu da tela | fonte grande demais numa palavra longa | reduzir a fonte; conferir sempre a cena da chamada |
| Etiqueta quebrou em duas linhas | posição absoluta perto da borda | recuar o `x` (o `Chip` já usa `nowrap`) |
| Logo com fundo branco | arquivo sem transparência | usar PNG com fundo transparente |
| Tela real atrás da "ilha" do celular | imagem começando no topo | `inset: "46px 0 0 0"` |
| Print com esqueleto de carregamento | espera curta | aumentar `ESPERA_MS` |
| Fonte errada em caracteres acentuados | subconjunto da fonte | manter `subsets: ["latin"]` no `loadFont` |

---

## 10. Áudio

O exemplo do repositório é mudo. O que segue é o caminho recomendado, mas não
vem implementado nem testado no modelo.

- **Locução:** um assistente de código escreve o texto, mas não gera a voz. É
  preciso uma gravação ou um serviço de voz sintética, com a chave num arquivo
  `.env` (nunca colada numa conversa nem versionada). Salve como
  `public/narracao.wav` e toque com `<Audio src={staticFile("narracao.wav")} />`
  dentro do componente `Anuncio`.
- **Sincronia:** transcreva a narração com o tempo de cada palavra (por exemplo
  com `faster-whisper`), converta segundos em quadros (× 30) e use esses valores
  nas durações de `CENAS` e nos `at` de cada frase. A narração manda no ritmo.
- **Efeitos:** sons curtos nas entradas (estalo, sopro na transição,
  notificação, carimbo), cada um num `<Sequence from={quadro}>` com seu
  `<Audio>`. Use arquivos com licença que permita o uso.

---

## 11. Entrega

- Nomeie com versão (`out/produto-v1.mp4`) e não sobrescreva o que já foi visto.
- Informe: duração, formato, o que é real e o que é ilustrativo, o que falta.

### Lista final

- [ ] Roteiro aprovado antes de animar.
- [ ] Logo e cores vêm do produto, não foram inventados.
- [ ] Toda cena tem frase, herói e detalhe de interface.
- [ ] Toda cena tem algo acontecendo depois da entrada.
- [ ] Uma palavra de destaque por frase.
- [ ] O tom do fundo muda entre cenas.
- [ ] Há um fio condutor nas cenas da dor, vermelho na pior.
- [ ] Se o produto existe, o bloco 7 usa telas reais, limpas e sem dado sensível.
- [ ] Um quadro de cada cena foi olhado: nada cortado, nada sobreposto.
- [ ] A entrega diz o que foi conferido e o que não foi.
