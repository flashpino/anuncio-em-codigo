// Tira prints de um sistema web para usar no vídeo (componente <Shots>).
//
// Preparo (uma vez):   npm i -D playwright && npx playwright install chromium
// Primeira vez:        node capturar-telas.mjs --visivel   (abre uma janela; VOCÊ faz o login)
// Depois:              node capturar-telas.mjs             (reusa a sessão, sem janela)
//
// O script só navega por URL e lê a tela. Ele não clica em botões nem grava nada no sistema.
// As trocas de nomes e números acontecem no texto da página aberta aqui, nunca no banco.
import path from "node:path";
import fs from "node:fs";
import { chromium } from "playwright";

/* ============================== CONFIGURE AQUI ============================== */
const BASE = "http://localhost:5173"; // endereço do sistema
const LOGIN = "/login"; // caminho da tela de login ("" se não houver login)

// [rota, nome-do-arquivo]. Cada uma gera <nome>-desktop.png e <nome>-mobile.png
const ROTAS = [
  ["/", "inicio"],
  // ["/pedidos", "pedidos"],
  // ["/relatorios", "relatorios"],
];

// Nomes reais → fictícios. Os mais longos primeiro.
const TROCAS = [
  // ["Cliente Real Ltda", "Empresa Exemplo"],
  // ["Fulano de Tal", "Ana Souza"],
];

// Números: nas rotas listadas, todo número inteiro solto na tela é multiplicado por FATOR
// (o mesmo fator para todos, para gráficos e percentuais continuarem coerentes). [] = não mexe.
const FATOR = 0.37;
const ROTAS_COM_NUMEROS = []; // ex.: ["inicio", "relatorios"]

// O que esconder antes do print (avisos, widgets de chat, banners de cookie).
const ESCONDER_CSS = `
  /* .banner-cookies, #widget-chat { display: none !important; } */
`;

const ESPERA_MS = 3500; // aumente se algum print sair com a tela ainda carregando
/* ============================================================================ */

const OUT = path.join(import.meta.dirname, "public", "screens");
const PERFIL = path.join(import.meta.dirname, ".perfil-captura");
fs.mkdirSync(OUT, { recursive: true });
const visivel = process.argv.includes("--visivel");

const ctx = await chromium.launchPersistentContext(PERFIL, {
  headless: !visivel,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = ctx.pages()[0] ?? (await ctx.newPage());
const naTelaDeLogin = () => LOGIN !== "" && new URL(page.url()).pathname.startsWith(LOGIN);

await page.goto(BASE + (ROTAS[0]?.[0] ?? "/"));
await page.waitForTimeout(3000);
if (naTelaDeLogin()) {
  if (!visivel) {
    console.log("Sem sessão. Rode: node capturar-telas.mjs --visivel  e faça o login na janela.");
    await ctx.close();
    process.exit(2);
  }
  console.log("Faça o login na janela que abriu (aguardo até 10 minutos)...");
  await page.waitForURL((u) => !u.pathname.startsWith(LOGIN), { timeout: 600000 });
  console.log("Login feito.");
}

const preparar = async (escalar) => {
  await page.addStyleTag({ content: ESCONDER_CSS }).catch(() => {});
  await page.evaluate(
    ({ trocas, fator, escalar }) => {
      const conv = (txt) => {
        const v = parseInt(txt.replaceAll(".", ""), 10);
        if (v >= 1990 && v <= 2100 && !txt.includes(".")) return txt; // provavelmente um ano
        const n = Math.max(1, Math.round(v * fator));
        return txt.includes(".") || n >= 10000 ? n.toLocaleString("pt-BR") : String(n);
      };
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const raw = n.nodeValue || "";
        const t = raw.trim();
        if (!t) continue;
        let novo = raw;
        const emCampo = n.parentElement?.closest("select, option, input, textarea");
        if (escalar && !emCampo && /^\d{1,3}(\.\d{3})+$|^\d+$/.test(t)) novo = raw.replace(t, conv(t));
        for (const [de, para] of trocas) if (novo.includes(de)) novo = novo.split(de).join(para);
        if (novo !== raw) n.nodeValue = novo;
      }
    },
    { trocas: TROCAS, fator: FATOR, escalar },
  );
};

const capturar = async (sufixo) => {
  for (const [rota, nome] of ROTAS) {
    try {
      await page.goto(BASE + rota, { waitUntil: "networkidle", timeout: 30000 });
    } catch {
      /* segue mesmo sem a rede ficar ociosa */
    }
    await page.waitForTimeout(ESPERA_MS);
    await preparar(ROTAS_COM_NUMEROS.includes(nome));
    const arquivo = `${nome}-${sufixo}.png`;
    await page.screenshot({ path: path.join(OUT, arquivo) });
    console.log("ok", arquivo);
  }
};

await capturar("desktop");
await page.setViewportSize({ width: 390, height: 844 });
await capturar("mobile");
await ctx.close();
console.log(`Pronto. Prints em ${OUT}. Confira cada um antes de usar.`);
