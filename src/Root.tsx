// EXEMPLO — anúncio de um produto fictício ("Notinha", app de reembolso de despesas).
// Serve de molde: apague estas cenas e escreva as do seu produto usando as peças de kit.tsx.
// Estrutura: gancho → número → volume → dores → custo → virada → produto → três palavras → chamada.
import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate } from "remotion";
import {
  C,
  Camada3D,
  Cena,
  Centro,
  Check,
  Chip,
  Counter,
  Dot,
  FPS,
  Filme,
  H,
  Hero,
  LEAD,
  Left,
  Logo,
  LogoIcon,
  MARCA,
  Meter,
  Morph,
  Palco3D,
  Phone,
  Pill,
  Pop,
  Right,
  Scene,
  Slam,
  Txt,
  W,
  card,
  cl,
  duracaoTotal,
  hhmm,
  r2,
  sp,
  useF,
} from "./kit";

/* ---------- 1. GANCHO: uma situação concreta, com hora e lugar ---------- */
const Gancho: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const notif = [
    { at: 34, c: C.violet, a: "Financeiro", b: "Prestação de contas até as 18h" },
    { at: 50, c: C.amber, a: "Banco", b: "Compra aprovada · R$ 48,90" },
    { at: 64, c: C.red, a: "Lembrete", b: "Guardar o recibo do táxi!" },
  ];
  return (
    <Scene dur={dur} tint="lilac">
      <Left top={330}>
        <Txt w={[["dia"], ["trinta."]]} at={10} size={64} />
        <div style={{ height: 14 }} />
        <Txt w={[["o"], ["financeiro"], ["fecha"]]} at={22} />
        <Txt w={[["às"], ["seis.", "k"]]} at={32} />
      </Left>
      <Right>
        <Hero at={14} rot={5} k={1.12}>
          <Phone bg="linear-gradient(165deg,#0F766E 0%,#2563EB 55%,#A855F7 100%)">
            <div style={{ textAlign: "center", color: "#fff", paddingTop: 80 }}>
              <div style={{ fontSize: 20, fontWeight: 500, opacity: 0.85 }}>sexta-feira, 30 de maio</div>
              <div style={{ fontSize: 118, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>09:00</div>
            </div>
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 34, display: "flex", flexDirection: "column", gap: 10 }}>
              {notif.map((n, i) => {
                const p = sp(f, n.at, 13, 0.6);
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      borderRadius: 20,
                      padding: "12px 14px",
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      opacity: p,
                      transform: `translateY(${r2((1 - p) * 50)}px)`,
                    }}
                  >
                    <Dot c={n.c} s={38} />
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 700, color: C.ink }}>{n.a}</div>
                      <div style={{ fontSize: 17, color: "#444A5C" }}>{n.b}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Phone>
        </Hero>
      </Right>
    </Scene>
  );
};

/* ---------- 2. NÚMERO QUE ASSUSTA: tela cheia, rolando, com etiquetas pipocando ---------- */
const Numero: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const t = interpolate(f, [LEAD, 40], [0, 1], { ...cl, easing: Easing.out(Easing.poly(4)) });
  const m = 540 + t * 522; // 09:00 -> 17:42
  const vel = t > 0 && t < 0.985 ? (1 - t) * 26 : 0;
  const hit = sp(f, 40, 9, 0.5);
  return (
    <Scene dur={dur} tint="lilac">
      <Centro>
        <div style={{ fontSize: 76, fontWeight: 700, color: C.ink, marginBottom: -30, opacity: sp(f, 8) }}>são</div>
        <div
          style={{
            fontSize: 520,
            fontWeight: 800,
            letterSpacing: -22,
            lineHeight: 1,
            color: C.ink,
            fontVariantNumeric: "tabular-nums",
            filter: vel > 0.5 ? `blur(${r2(vel)}px)` : undefined,
            transform: `translateY(${r2(Math.sin(f * 1.7) * vel * 0.6)}px) scale(${r2(1.06 - hit * 0.06)})`,
          }}
        >
          {hhmm(m)}
        </div>
        <div style={{ marginTop: -10 }}>
          <Txt w={[["e"], ["você"], ["ainda"], ["tá"], ["caçando"], ["recibo.", "s"]]} at={50} size={62} />
        </div>
      </Centro>
      <Chip at={48} x={120} y={110} rot={-5} c={C.amber} t="táxi do aeroporto?" />
      <Chip at={54} x={1380} y={96} rot={4} c={C.violet} t="almoço com cliente" />
      <Chip at={60} x={1500} y={250} rot={-3} c={C.red} t="pedágio (3x)" />
      <Chip at={66} x={150} y={850} rot={3} c="#3B82F6" t="foto_borrada_2.jpg" />
      <Chip at={72} x={1420} y={880} rot={-4} c={C.green} t="estacionamento" />
    </Scene>
  );
};

/* ---------- 3. VOLUME: o número sobe junto com a pilha ---------- */
const Volume: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const N = 23;
  const n = Math.max(0, Math.min(N, Math.floor((f - 18) / 1.9)));
  return (
    <Scene dur={dur} tint="warm" meter={<Meter from={1062} to={1068} dur={dur} />}>
      <Left top={230}>
        <div
          style={{
            fontSize: 400,
            fontWeight: 800,
            letterSpacing: -16,
            lineHeight: 0.95,
            color: C.ink,
            fontVariantNumeric: "tabular-nums",
            filter: n > 0 && n < N ? "blur(5px)" : undefined,
            opacity: sp(f, 12),
          }}
        >
          {n}
        </div>
        <Txt w={[["notinhas."]]} at={24} size={84} />
        <Txt w={[["todas"], ["na", "m"], ["carteira.", "k"]]} at={64} size={64} />
      </Left>
      <Right>
        <div style={{ position: "relative", width: 420, height: 640 }}>
          {Array.from({ length: N }).map((_, i) => {
            const p = sp(f, 18 + i * 1.9, 12, 0.7);
            const rot = ((i * 37) % 11) - 5; // variação determinística: nada de Math.random
            const ox = (((i * 53) % 9) - 4) * 9;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 90 + ox,
                  bottom: i * 9,
                  width: 230,
                  height: 380,
                  background: i % 3 === 2 ? "#FFFBEA" : "#fff",
                  borderRadius: 6,
                  border: "1px solid rgba(20,21,28,0.10)",
                  boxShadow: "0 6px 16px rgba(20,21,28,0.10)",
                  padding: 20,
                  opacity: Math.min(1, p * 2),
                  transform: `translateY(${r2((1 - p) * -520)}px) rotate(${r2(rot * 2.2 + (1 - p) * 24)}deg)`,
                  fontFamily: "monospace",
                }}
              >
                <div style={{ fontSize: 17, fontWeight: 700, color: C.ink, textAlign: "center" }}>CUPOM FISCAL</div>
                <div style={{ borderTop: "2px dashed rgba(20,21,28,0.2)", margin: "10px 0 14px" }} />
                {[86, 60, 74, 48, 80, 56, 68].map((wd, k) => (
                  <div key={k} style={{ height: 8, width: `${wd}%`, background: "rgba(20,21,28,0.12)", borderRadius: 4, marginBottom: 13 }} />
                ))}
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 20, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: C.ink }}>
                  <span>TOTAL</span>
                  <span>R$ {18 + ((i * 29) % 70)},90</span>
                </div>
              </div>
            );
          })}
        </div>
      </Right>
    </Scene>
  );
};

/* ---------- 4a. DOR: conversa de mensagens ---------- */
const DorConversa: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const B: React.FC<{ at: number; me?: boolean; children: React.ReactNode }> = ({ at, me, children }) => (
    <Pop at={at} style={{ alignSelf: me ? "flex-end" : "flex-start", maxWidth: "82%" }}>
      <div
        style={{
          background: me ? "#DCF8C6" : "#fff",
          borderRadius: 18,
          padding: "12px 18px",
          fontSize: 25,
          fontWeight: 500,
          color: C.ink,
          boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
        }}
      >
        {children}
      </div>
    </Pop>
  );
  const typing = f > 58 && f < 74;
  return (
    <Scene dur={dur} tint="sky" meter={<Meter from={1068} to={1074} dur={dur} />}>
      <Left top={270}>
        <Txt w={[["o"], ["recibo"], ["do"], ["táxi"]]} at={10} />
        <Txt w={[["ficou", "s"], ["na"], ["outra"]]} at={24} />
        <Txt w={[["calça."]]} at={34} />
        <Pill at={56}>
          <span>recibos pedidos <b style={{ color: C.ink, fontSize: 36 }}>3</b></span>
          <span>recibos achados <b style={{ color: C.red, fontSize: 36 }}>0</b></span>
        </Pill>
      </Left>
      <Right>
        <Hero at={12} rot={-3}>
          <div style={{ ...card, width: 560, overflow: "hidden", background: "#EFE9E0" }}>
            <div style={{ background: "#fff", padding: "18px 22px", display: "flex", gap: 16, alignItems: "center", borderBottom: `1px solid ${C.line}` }}>
              <div style={{ width: 58, height: 58, borderRadius: 40, background: "linear-gradient(140deg,#A78BFA,#7C3AED)", color: "#fff", fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>F</div>
              <div>
                <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>Financeiro</div>
                <div style={{ fontSize: 19, color: typing ? C.green : C.muted }}>{typing ? "digitando…" : "online"}</div>
              </div>
            </div>
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12, minHeight: 400 }}>
              <B at={20}>cadê o recibo do táxi?</B>
              <B at={36}>sem recibo não reembolsa 🙃</B>
              <B at={52} me>tá na outra calça</B>
              <B at={76}>a calça tá onde?</B>
              <B at={90} me>na máquina de lavar</B>
            </div>
          </div>
        </Hero>
      </Right>
    </Scene>
  );
};

/* ---------- 4b. DOR mais grave: o objeto se estraga na tela e leva um carimbo ---------- */
const DorApagou: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const fade = interpolate(f, [26, 62], [1, 0.1], cl); // a tinta do papel térmico some
  const stamp = sp(f, 62, 8, 0.5);
  const late = f > 62;
  return (
    <Scene dur={dur} tint="rose" meter={<Meter from={1074} to={1079} dur={dur} red={late} />}>
      <Left top={270}>
        <Txt w={[["e"], ["o"], ["do"], ["almoço"]]} at={10} />
        <Txt w={[["já"]]} at={22} />
        <Txt w={[["apagou.", "r"]]} at={50} size={130} />
        <Pill at={66}>
          <span style={{ color: C.ink, fontWeight: 600 }}>papel térmico</span>
          <span style={{ background: C.red, color: "#fff", borderRadius: 30, padding: "4px 16px", fontSize: 22, fontWeight: 600 }}>dura 3 meses</span>
        </Pill>
      </Left>
      <Right>
        <Hero at={10} rot={3}>
          <div style={{ ...card, background: "#fff", width: 360, padding: 30, position: "relative", fontFamily: "monospace", borderRadius: 10 }}>
            <div style={{ opacity: fade }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: C.ink, textAlign: "center" }}>RESTAURANTE</div>
              <div style={{ fontSize: 16, color: C.muted, textAlign: "center", marginBottom: 16 }}>CUPOM FISCAL · 12/03</div>
              {["2x PRATO EXEC.", "1x SUCO", "1x CAFÉ", "SERVIÇO 10%"].map((l, i) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 19, color: C.ink, marginBottom: 12 }}>
                  <span>{l}</span>
                  <span>{[78, 12, 6, 9][i]},00</span>
                </div>
              ))}
              <div style={{ borderTop: "2px dashed rgba(20,21,28,0.3)", margin: "14px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, fontWeight: 700, color: C.ink }}>
                <span>TOTAL</span>
                <span>R$ 105,00</span>
              </div>
              <div style={{ height: 60 }} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 40,
                bottom: 50,
                border: `6px solid ${C.red}`,
                color: C.red,
                borderRadius: 14,
                padding: "6px 22px",
                fontSize: 50,
                fontWeight: 800,
                letterSpacing: 3,
                fontFamily: "inherit",
                background: "rgba(255,255,255,0.8)",
                opacity: Math.min(1, stamp * 2),
                transform: `rotate(-12deg) scale(${r2(2.4 - stamp * 1.4)})`,
              }}
            >
              ILEGÍVEL
            </div>
          </div>
        </Hero>
      </Right>
    </Scene>
  );
};

/* ---------- 5. CUSTO: o total por ano ---------- */
const Custo: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const dots = Math.floor(interpolate(f, [50, 92], [0, 50], cl));
  const meses = ["jan", "fev", "mar", "abr", "mai"];
  return (
    <Scene dur={dur} tint="violet">
      <Left top={220} width={1000}>
        <Txt w={[["isso"], ["dá"], ["quase"]]} at={8} size={62} />
        <Counter to={2400} at={14} dur={38} size={230}format={(n) => `R$ ${n.toLocaleString("pt-BR")}`} />
        <Txt w={[["por"], ["ano"], ["que"], ["você"], ["nunca", "s"], ["pediu."]]} at={54} size={70} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(25, 22px)", gap: 9, marginTop: 40 }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <span key={i} style={{ width: 22, height: 22, borderRadius: 12, background: i < dots ? C.ink : "rgba(20,21,28,0.12)" }} />
          ))}
        </div>
        <Pill at={94} dark>
          = 1 reembolso perdido por semana
        </Pill>
      </Left>
      <Right left={1240}>
        <Hero at={16} rot={3}>
          <div style={{ ...card, padding: 30, width: 480 }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: C.muted, marginBottom: 20 }}>todo mês</div>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 300 }}>
              {meses.map((d, i) => {
                const p = sp(f, 24 + i * 5, 14, 0.7);
                const last = i === 4;
                return (
                  <div key={d} style={{ flex: 1, textAlign: "center" }}>
                    <div
                      style={{
                        height: r2((150 + ((i * 41) % 90)) * p),
                        width: "100%",
                        borderRadius: 18,
                        background: last ? C.red : C.mark,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        fontSize: 22,
                        fontWeight: 700,
                      }}
                    >
                      <span style={{ writingMode: "vertical-rl" }}>{last && p > 0.9 ? "perdido" : ""}</span>
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 600, color: last ? C.red : C.muted, marginTop: 10 }}>{d}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Hero>
      </Right>
    </Scene>
  );
};

/* ---------- 6. VIRADA: a marca nasce de um ponto ---------- */
const Virada: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const dot = sp(f, 34, 12, 0.8);
  return (
    <Scene dur={dur} tint="clean">
      <Centro>
        <div style={{ position: "absolute", top: 400, opacity: interpolate(f, [34, 42], [1, 0], cl) }}>
          <Txt w={[["por"], ["isso"], ["a"], ["gente"], ["criou"], ["o"]]} at={8} size={60} />
        </div>
        <div
          style={{
            position: "absolute",
            width: 30,
            height: 30,
            borderRadius: 30,
            background: C.brand,
            top: 560,
            opacity: f > 24 ? 1 - dot : 0,
            transform: `scale(${r2(1 + dot * 5)})`,
          }}
        />
        <div style={{ opacity: Math.min(1, dot * 1.4), transform: `scale(${r2(0.6 + dot * 0.4)})`, filter: dot < 0.9 ? `blur(${r2((1 - dot) * 16)}px)` : undefined }}>
          <Logo s={170} />
        </div>
      </Centro>
    </Scene>
  );
};

/* ---------- 7. PRODUTO: resolvendo a dor ao vivo, passo a passo ---------- */
// Aqui a tela é desenhada porque o produto do exemplo não existe.
// Com um produto real, troque o miolo do <Phone> por <Shots> com prints de verdade (ver GUIA.md, seção 8).
const Produto: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const row = (at: number) => {
    const p = sp(f, at, 15, 0.6);
    return { opacity: p, transform: `translateY(${r2((1 - p) * 24)}px)` };
  };
  const scan = interpolate(f, [22, 54], [0, 1], cl);
  const press = f > 122 && f < 130 ? 0.95 : 1;
  const done = sp(f, 132, 13, 0.8);
  const sent = Math.min(23, Math.max(0, Math.floor((f - 138) / 1.4)));
  const campos = [
    ["estabelecimento", "Táxi Aeroporto", 58],
    ["valor", "R$ 48,90", 68],
    ["data", "30/05", 78],
  ] as const;
  return (
    <Scene dur={dur} tint="mint">
      <Left top={290} width={900}>
        <Txt w={[["aponta"], ["a"], ["câmera,"]]} at={10} size={84} />
        <Txt w={[["ele"], ["lê", "k"], ["o"], ["recibo"]]} at={54} size={84} />
        <Txt w={[["e"], ["o"], ["reembolso"]]} at={104} size={84} />
        <Txt w={[["sai"], ["sozinho.", "s"]]} at={130} size={84} />
      </Left>
      <Right left={1120}>
        <Hero at={10} rot={0} k={1.06}>
          <Phone w={440} h={880} bg="#F7F8FC">
            <div style={{ padding: "62px 22px 0", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 24, fontWeight: 700, color: C.ink }}>
                <LogoIcon s={36} /> {MARCA.nome}
              </div>
              <div style={{ position: "relative", height: 300, borderRadius: 22, background: "#1B1E2E", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 150, height: 240, background: "#fff", borderRadius: 4, padding: 14, transform: "rotate(-4deg)" }}>
                  {[80, 55, 70, 45, 75, 60].map((wd, k) => (
                    <div key={k} style={{ height: 8, width: `${wd}%`, background: "rgba(20,21,28,0.16)", borderRadius: 4, marginBottom: 14 }} />
                  ))}
                </div>
                <div style={{ position: "absolute", left: 0, right: 0, top: `${r2(8 + scan * 84)}%`, height: 4, background: C.brand, boxShadow: `0 0 24px 6px ${C.brand}`, opacity: scan < 1 ? 1 : 0 }} />
              </div>
              {campos.map(([k, v, at]) => (
                <div key={k} style={{ ...row(at), background: "#fff", borderRadius: 18, padding: "12px 18px", border: `1px solid ${C.line}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 17, color: C.muted, fontWeight: 600 }}>{k}</span>
                  <span style={{ fontSize: 23, color: C.ink, fontWeight: 700 }}>{v}</span>
                </div>
              ))}
              <div style={{ ...row(100), background: C.ink, color: "#fff", borderRadius: 40, padding: "18px 0", textAlign: "center", fontSize: 23, fontWeight: 700, transform: `scale(${press})` }}>
                pedir reembolso
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(165deg, ${C.brand}, ${C.brandDeep})`,
                opacity: done,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                gap: 14,
              }}
            >
              <div style={{ width: 130, height: 130, borderRadius: 80, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${r2(sp(f, 136, 8, 0.6))})` }}>
                <Check s={70} />
              </div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>enviado.</div>
              <div style={{ fontSize: 20, letterSpacing: 3, opacity: 0.8, fontWeight: 600 }}>{sent} DE 23 NOTINHAS</div>
            </div>
          </Phone>
        </Hero>
      </Right>
    </Scene>
  );
};

/* ---------- 8. TRÊS PALAVRAS ---------- */
const TresPalavras: React.FC<{ dur: number }> = ({ dur }) => {
  const passos = [
    { at: 8, t: "Fotografada", s: "recibo lido em 2 segundos", c: C.brand },
    { at: 28, t: "Enviada", s: "direto para o financeiro", c: C.violet },
    { at: 48, t: "Reembolsada", s: "R$ 48,90 na sua conta", c: C.green },
  ];
  return (
    <Scene dur={dur} tint="lilac">
      <Left top={250}>
        <Txt w={[["Fotografou."]]} at={8} size={150} />
        <Txt w={[["Enviou."]]} at={28} size={150} />
        <Txt w={[["Recebeu.", "s"]]} at={48} size={150} />
      </Left>
      <Right left={1180}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: 560 }}>
          {passos.map((s, i) => (
            <Pop key={i} at={s.at + 4} from="right">
              <div style={{ ...card, padding: "22px 26px", display: "flex", alignItems: "center", gap: 20, transform: `rotate(${(i - 1) * 1.5}deg)` }}>
                <div style={{ width: 64, height: 64, borderRadius: 40, background: s.c, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check />
                </div>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 700, color: C.ink }}>{s.t}</div>
                  <div style={{ fontSize: 23, color: C.muted, fontWeight: 500 }}>{s.s}</div>
                </div>
              </div>
            </Pop>
          ))}
        </div>
      </Right>
    </Scene>
  );
};

/* ---------- 9. CHAMADA ---------- */
const Chamada: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useF();
  const linhas = ["Táxi Aeroporto", "Almoço com cliente", "Pedágio", "Estacionamento", "Hotel · 2 diárias", "Combustível"];
  const pill = sp(f, 30, 9, 0.6);
  return (
    <Scene dur={dur} tint="mint">
      <div style={{ position: "absolute", left: 170, top: 130, width: 620, height: 820, ...card, padding: 30, overflow: "hidden" }}>
        <div style={{ fontSize: 24, fontWeight: 600, color: C.muted, textAlign: "center", marginBottom: 22 }}>Reembolsos de maio</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {linhas.map((t, i) => {
            const at = 26 + i * 11;
            return (
              <Pop key={i} at={at}>
                <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 18, padding: "18px 20px", border: `1px solid ${C.line}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 30, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${r2(sp(f, at + 8, 9, 0.5))})` }}>
                    <Check s={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 27, fontWeight: 700, color: C.ink }}>{t}</div>
                    <div style={{ fontSize: 19, color: C.green, fontWeight: 600 }}>reembolsado</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: C.ink }}>R$ {28 + ((i * 47) % 160)},90</div>
                </div>
              </Pop>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 860, top: 290, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        <Txt w={[["peça"], ["de"], ["volta"]]} at={14} size={96} />
        <div
          style={{
            background: C.brand,
            color: "#fff",
            borderRadius: 34,
            padding: "14px 44px 18px",
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -4,
            boxShadow: "0 30px 70px rgba(20,21,28,0.25)",
            transform: `scale(${r2(pill)}) rotate(${r2((1 - pill) * -6)}deg)`,
            transformOrigin: "left center",
            opacity: Math.min(1, pill * 2),
          }}
        >
          CADA CENTAVO
        </div>
        <div style={{ marginTop: 8 }}>
          <Txt w={[["teste", "m"], ["grátis", "m"], ["por", "m"], ["trinta", "m"], ["dias.", "m"]]} at={46} size={46} />
        </div>
        <Pop at={64} style={{ marginTop: 16 }}>
          <div style={{ ...card, borderRadius: 22, padding: "16px 26px", display: "flex", alignItems: "center", gap: 18, fontSize: 34, fontWeight: 600, color: C.ink }}>
            <LogoIcon s={52} /> {MARCA.site}
          </div>
        </Pop>
      </div>
    </Scene>
  );
};

/* ---------- PEÇA VERTICAL DE 6 s (1080×1920): cinética + forma que vira outra + 3D + câmera ---------- */
// Composição separada ("Vertical"). Molde para Reels/Stories: duração e tamanho fixados antes de animar.
const DUR_V = 180;
const VW = 1080;
const VH = 1920;
const Vertical: React.FC = () => {
  const f = useF();
  const io = { ...cl, easing: Easing.inOut(Easing.cubic) };
  const sobe = interpolate(f, [39, 51], [0, 1], io); // o texto abre espaço para o celular
  const gastos = [
    { c: C.amber, a: "Táxi", b: "R$ 48,90" },
    { c: C.violet, a: "Almoço", b: "R$ 112,00" },
    { c: C.brand, a: "Garagem", b: "R$ 25,00" },
    { c: C.red, a: "Hotel", b: "R$ 640,00" },
  ];
  return (
    <Scene dur={DUR_V} tint="mint">
      {/* 3D: tudo aqui dentro é visto pela câmera, que aproxima e desliza */}
      <Palco3D
        cam={[
          { at: 0, z: -140 },
          { at: 57, z: -80 },
          { at: 96, x: -90, y: 10, z: 110, ry: -6 },
          { at: DUR_V, x: 110, y: 20, z: 50, ry: 5 },
        ]}
      >
        <Camada3D x={260} y={360} z={-600}>
          <div style={{ width: 900, height: 900, borderRadius: "50%", background: C.brand, opacity: 0.1 }} />
        </Camada3D>
        <Camada3D
          y={110}
          rx={interpolate(f, [57, 93, DUR_V], [14, -4, 5], io)}
          ry={interpolate(f, [57, 93, DUR_V], [-42, 16, -12], io)}
        >
          {/* forma que vira outra: ponto → círculo → corpo do celular */}
          <Morph
            stages={[
              { at: 39, w: 0, h: 0, r: 140, c: C.brand },
              { at: 47, w: 270, h: 270, r: 135, c: C.brand },
              { at: 50, w: 240, h: 240, r: 120, c: C.brand },
              { at: 57, w: 240, h: 240, r: 120, c: C.brand },
              { at: 72, w: 490, h: 1000, r: 72, c: "#101325" },
            ]}
            style={{ boxShadow: "0 50px 100px rgba(25,30,80,0.28)" }}
          >
            <div
              style={{
                position: "absolute",
                inset: 12,
                borderRadius: 60,
                background: "#fff",
                overflow: "hidden",
                opacity: interpolate(f, [70, 78], [0, 1], cl),
                padding: "70px 26px 0",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 54, fontWeight: 700, color: C.ink, letterSpacing: -1.5 }}>Reembolsos</div>
              <div style={{ fontSize: 28, color: C.muted, marginTop: -8, marginBottom: 14 }}>4 recibos lidos</div>
              {gastos.map((g, i) => (
                <Pop key={g.a} at={82 + i * 6}>
                  <div
                    style={{
                      background: "#F6F7FB",
                      borderRadius: 22,
                      padding: "28px 22px",
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      fontSize: 30,
                      whiteSpace: "nowrap",
                      fontWeight: 600,
                      color: C.ink,
                    }}
                  >
                    <Dot c={g.c} s={46} />
                    <span style={{ flex: 1 }}>{g.a}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{g.b}</span>
                  </div>
                </Pop>
              ))}
              <Pop at={112} style={{ marginTop: 14 }}>
                <div
                  style={{
                    background: C.brand,
                    color: "#fff",
                    borderRadius: 24,
                    padding: "30px 0",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 34,
                    fontWeight: 700,
                  }}
                >
                  <Check s={36} /> Enviado
                </div>
              </Pop>
            </div>
          </Morph>
        </Camada3D>
        <Camada3D x={-370} y={560} z={320}>
          <div style={{ width: 240, height: 240, borderRadius: "50%", background: C.brand, opacity: 0.22 }} />
        </Camada3D>
      </Palco3D>

      {/* tipografia cinética: fica fora do palco para não girar com a câmera */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 760,
          width: VW,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          transformOrigin: "50% 0",
          transform: `translateY(${r2(-600 * sobe)}px) scale(${r2(1 - 0.36 * sobe)})`,
        }}
      >
        <Txt w={[["o"], ["reembolso"]]} at={2} size={124} />
        <Slam at={20} size={250}>
          inteiro
        </Slam>
      </div>
      <div style={{ position: "absolute", left: 0, top: 1690, width: VW, display: "flex", justifyContent: "center" }}>
        <Slam at={120} size={180} color={C.brand} from={0} rot={-10}>
          no bolso.
        </Slam>
      </div>
    </Scene>
  );
};

/* ---------- LINHA DO TEMPO: ordem e duração (em quadros, 30 por segundo) ---------- */
const CENAS: Cena[] = [
  { C: Gancho, dur: 90 },
  { C: Numero, dur: 100 },
  { C: Volume, dur: 96 },
  { C: DorConversa, dur: 110 },
  { C: DorApagou, dur: 100 },
  { C: Custo, dur: 120 },
  { C: Virada, dur: 74 },
  { C: Produto, dur: 190 },
  { C: TresPalavras, dur: 90 },
  { C: Chamada, dur: 130 },
];

const Anuncio: React.FC = () => (
  <AbsoluteFill>
    <Filme cenas={CENAS} />
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Anuncio" component={Anuncio} durationInFrames={duracaoTotal(CENAS)} fps={FPS} width={W} height={H} />
    <Composition id="Vertical" component={Vertical} durationInFrames={DUR_V} fps={FPS} width={VW} height={VH} />
  </>
);
