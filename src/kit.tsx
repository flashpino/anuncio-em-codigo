// KIT — peças reutilizáveis do estilo. Não depende de nenhum produto.
// Para um vídeo novo você quase nunca edita este arquivo: troque MARCA e escreva as cenas em Root.tsx.
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

/* ============================== MARCA (troque aqui) ============================== */
export const MARCA = {
  nome: "Notinha",
  site: "notinha.app",
  cor: "#0E9F6E", // cor principal: botões, destaques
  corEscura: "#066B4A", // fim dos gradientes
  corClara: "#C4F0DF", // marca-texto
  logo: null as string | null, // ex.: "logo.png" dentro de public/ (PNG com transparência). null = desenha a inicial
};

/* ============================== FORMATO ============================== */
export const FPS = 30;
export const W = 1920; // vertical: 1080
export const H = 1080; // vertical: 1920
export const LEAD = 8; // quadros de sobreposição entre cenas (onde a transição acontece)

/* ============================== TEMA ============================== */
export const SANS = loadOutfit("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
}).fontFamily;
export const SERIF = loadSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily;

export const C = {
  ink: "#14151C",
  muted: "#7A7F90",
  brand: MARCA.cor,
  brandDeep: MARCA.corEscura,
  mark: MARCA.corClara,
  red: "#E5484D", // só para o que deu errado
  green: "#22A06B", // só para o que deu certo
  amber: "#F59E0B",
  violet: "#8B5CF6",
  line: "rgba(20,21,28,0.08)",
};

// manchas de fundo: cada cena usa um conjunto diferente
export const TINTS: Record<string, [string, string, string]> = {
  lilac: ["#DCD6FF", "#FFE3D2", "#E3ECFF"],
  warm: ["#FFEFC2", "#FFE0D0", "#F4ECFF"],
  sky: ["#CFE4FF", "#F6D9F0", "#E6E4FF"],
  rose: ["#FFD9DC", "#FFE9CC", "#EFE2FF"],
  violet: ["#C9C6FF", "#F3D2F2", "#D6E2FF"],
  mint: ["#CDF3E3", "#FFF1D6", "#E2F0FF"],
  clean: ["#E4E9FF", "#FFF1D6", "#EEF0FF"],
};

/* ============================== UTILITÁRIOS ============================== */
export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const r2 = (n: number) => Math.round(n * 100) / 100;
export const useF = () => useCurrentFrame();
// mola: 0 → 1 a partir de `delay`. damping baixo (8–11) quica; alto (18–20) chega seco.
export const sp = (f: number, delay = 0, damping = 15, mass = 0.7) =>
  spring({ frame: f - delay, fps: FPS, config: { damping, mass } });
// minutos do dia → "HH:MM"
export const hhmm = (m: number) =>
  `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(Math.floor(m % 60)).padStart(2, "0")}`;

/* ============================== FUNDO E CENA ============================== */
const Bg: React.FC<{ tint: string }> = ({ tint }) => {
  const f = useF();
  const [a, b, c] = TINTS[tint] ?? TINTS.clean;
  const d = Math.sin(f / 40) * 4;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(60% 70% at ${r2(12 + d)}% 8%, ${a} 0%, transparent 70%),
          radial-gradient(55% 65% at ${r2(92 - d)}% 96%, ${b} 0%, transparent 70%),
          radial-gradient(50% 60% at 85% 5%, ${c} 0%, transparent 70%), #F5F5FA`,
      }}
    />
  );
};

const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: "multiply", pointerEvents: "none" }}>
    <svg width="100%" height="100%">
      <filter id="grao">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grao)" />
    </svg>
  </AbsoluteFill>
);

// Fio condutor: etiqueta fixa no canto com um valor que avança durante a cena.
// `format` transforma o número em texto (padrão: relógio HH:MM a partir de minutos do dia).
export const Meter: React.FC<{
  from: number;
  to: number;
  dur: number;
  label?: string;
  red?: boolean;
  format?: (v: number) => string;
}> = ({ from, to, dur, label = "AGORA", red, format = hhmm }) => {
  const f = useF();
  const v = interpolate(f, [LEAD, dur], [from, to], { ...cl, easing: Easing.inOut(Easing.cubic) });
  const moving = Math.abs(to - from) > 3 && f > LEAD + 4 && f < dur - 6;
  return (
    <div
      style={{
        position: "absolute",
        top: 54,
        right: 64,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 24px",
        borderRadius: 18,
        background: red ? C.red : "rgba(255,255,255,0.78)",
        boxShadow: "0 8px 30px rgba(20,21,28,0.08)",
        color: red ? "#fff" : C.ink,
        fontFamily: SANS,
      }}
    >
      <span style={{ fontSize: 15, letterSpacing: 3, fontWeight: 600, opacity: 0.55 }}>{label}</span>
      <span
        style={{
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: -1,
          fontVariantNumeric: "tabular-nums",
          filter: moving ? "blur(1.6px)" : undefined,
        }}
      >
        {format(v)}
      </span>
    </div>
  );
};

// Toda cena é embrulhada por <Scene>: fundo, transição borrada de entrada E de saída, grão.
export const Scene: React.FC<{
  dur: number;
  tint: string;
  meter?: React.ReactNode; // um <Meter/>, fica fora do borrão
  children: React.ReactNode;
}> = ({ dur, tint, meter, children }) => {
  const f = useF();
  const inP = 1 - interpolate(f, [0, LEAD + 3], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const outP = interpolate(f, [dur, dur + LEAD], [0, 1], { ...cl, easing: Easing.in(Easing.cubic) });
  const x = inP * 520 - outP * 520;
  const blur = (inP + outP) * 34;
  return (
    <AbsoluteFill style={{ opacity: interpolate(f, [0, LEAD - 2], [0, 1], cl), fontFamily: SANS }}>
      <Bg tint={tint} />
      <AbsoluteFill
        style={{
          transform: `translateX(${r2(x)}px) scaleX(${r2(1 + (inP + outP) * 0.12)})`,
          filter: blur > 0.4 ? `blur(${r2(blur)}px)` : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
      {meter}
      <Grain />
    </AbsoluteFill>
  );
};

/* ============================== LINHA DO TEMPO ============================== */
export type Cena = { C: React.FC<{ dur: number }>; dur: number };
export const duracaoTotal = (cenas: Cena[]) => cenas.reduce((a, s) => a + s.dur, 0) + LEAD;
export const Filme: React.FC<{ cenas: Cena[] }> = ({ cenas }) => {
  let start = 0;
  return (
    <AbsoluteFill style={{ background: "#F5F5FA" }}>
      {cenas.map(({ C: Comp, dur }, i) => {
        const from = start;
        start += dur;
        return (
          <Sequence key={i} from={from} durationInFrames={dur + LEAD}>
            <Comp dur={dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/* ============================== TEXTO ============================== */
// Uma linha por <Txt>. Cada palavra é [texto, estilo?]:
//   (vazio) negrito · "s" serifa itálica · "m" apagado · "k" marca-texto · "r" serifa vermelha · "a" cor da marca
export type Wd = [string, string?];
export const Txt: React.FC<{ w: Wd[]; at?: number; step?: number; size?: number }> = ({
  w,
  at = 0,
  step = 3,
  size = 104,
}) => {
  const f = useF();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: `0 ${r2(size * 0.24)}px`, lineHeight: 1.08 }}>
      {w.map(([t, st = "b"], i) => {
        const p = sp(f, at + i * step, 18, 0.6);
        const serif = st === "s" || st === "r";
        const mk = sp(f, at + i * step + 4, 20, 0.6);
        return (
          <span
            key={i}
            style={{
              position: "relative",
              isolation: "isolate",
              display: "inline-block",
              fontFamily: serif ? SERIF : SANS,
              fontStyle: serif ? "italic" : "normal",
              fontWeight: serif ? 400 : st === "m" ? 500 : 700,
              fontSize: serif ? size * 1.12 : size,
              letterSpacing: serif ? -1 : -size * 0.03,
              color: st === "m" ? C.muted : st === "r" ? C.red : st === "a" ? C.brand : C.ink,
              opacity: p,
              transform: `translateY(${r2((1 - p) * 26)}px)`,
              filter: p < 0.97 ? `blur(${r2((1 - p) * 12)}px)` : undefined,
            }}
          >
            {st === "k" ? (
              <span
                style={{
                  position: "absolute",
                  inset: "10% -12px 4% -12px",
                  background: C.mark,
                  borderRadius: 12,
                  zIndex: -1,
                  transformOrigin: "left center",
                  transform: `scaleX(${r2(mk)})`,
                }}
              />
            ) : null}
            {t}
          </span>
        );
      })}
    </div>
  );
};

// Número que rola até o valor final, borrado enquanto corre.
export const Counter: React.FC<{
  to: number;
  from?: number;
  at?: number;
  dur?: number;
  size?: number;
  format?: (n: number) => string;
}> = ({ to, from = 0, at = 12, dur = 38, size = 330, format = (n) => String(n) }) => {
  const f = useF();
  const t = interpolate(f, [at, at + dur], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
  const hit = sp(f, at + dur, 9, 0.5);
  return (
    <span
      style={{
        display: "inline-block",
        whiteSpace: "nowrap",
        fontSize: size,
        fontWeight: 800,
        letterSpacing: -size * 0.04,
        lineHeight: 1,
        color: C.ink,
        fontVariantNumeric: "tabular-nums",
        filter: t > 0 && t < 0.97 ? `blur(${r2((1 - t) * 14)}px)` : undefined,
        transform: `scale(${r2(1.05 - hit * 0.05)})`,
        transformOrigin: "left bottom",
      }}
    >
      {format(Math.round(from + (to - from) * t))}
    </span>
  );
};

/* ============================== LAYOUT ============================== */
export const Left: React.FC<{ top?: number; width?: number; children: React.ReactNode }> = ({
  top = 250,
  width = 860,
  children,
}) => (
  <div style={{ position: "absolute", left: 150, top, width, display: "flex", flexDirection: "column", gap: 6 }}>
    {children}
  </div>
);
export const Right: React.FC<{ children: React.ReactNode; left?: number }> = ({ children, left = 1040 }) => (
  <div
    style={{
      position: "absolute",
      left,
      top: 0,
      width: W - left - 90,
      height: H,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {children}
  </div>
);
export const Centro: React.FC<{ children: React.ReactNode; gap?: number }> = ({ children, gap = 0 }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap }}>{children}</AbsoluteFill>
);

/* ============================== OBJETOS ============================== */
export const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.86)",
  borderRadius: 28,
  boxShadow: "0 30px 70px rgba(30,40,90,0.16), 0 2px 6px rgba(30,40,90,0.06)",
  border: "1px solid rgba(255,255,255,0.9)",
};

// Herói: entra quicando, depois flutua, com sombra macia embaixo. É o que ocupa o lugar de um personagem.
export const Hero: React.FC<{ at?: number; rot?: number; k?: number; children: React.ReactNode }> = ({
  at = 6,
  rot = 0,
  k = 1.22,
  children,
}) => {
  const f = useF();
  const p = sp(f, at, 11, 0.9);
  const fl = Math.sin((f - at) / 14) * 9;
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          transform: `translateY(${r2((1 - p) * 260 + fl)}px) scale(${r2((0.7 + p * 0.3) * k)}) rotate(${r2(rot + Math.sin(f / 22) * 0.8)}deg)`,
          opacity: Math.min(1, p * 1.6),
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          left: "14%",
          right: "14%",
          bottom: -46,
          height: 30,
          borderRadius: "50%",
          background: "rgba(20,21,28,0.16)",
          filter: "blur(16px)",
          opacity: p,
          transform: `scaleX(${r2(1 - fl / 80)})`,
        }}
      />
    </div>
  );
};

// Item que "estala" na tela: mensagens, linhas de lista, etiquetas.
export const Pop: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: "up" | "right";
}> = ({ at, children, style, from = "up" }) => {
  const f = useF();
  const p = sp(f, at, 13, 0.6);
  const off = (1 - p) * 40;
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        transform: `${from === "up" ? `translateY(${r2(off)}px)` : `translateX(${r2(off)}px)`} scale(${r2(0.9 + p * 0.1)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Dot: React.FC<{ c: string; s?: number }> = ({ c, s = 44 }) => (
  <span style={{ width: s, height: s, borderRadius: s * 0.3, background: c, flexShrink: 0, display: "inline-block" }} />
);

// Etiqueta flutuante solta na cena (posição absoluta em pixels da tela).
export const Chip: React.FC<{ at: number; x: number; y: number; rot?: number; c: string; t: string }> = ({
  at,
  x,
  y,
  rot = 0,
  c,
  t,
}) => {
  const f = useF();
  const p = sp(f, at, 10, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + Math.sin((f + x) / 16) * 6,
        transform: `rotate(${rot}deg) scale(${r2(p)})`,
        opacity: Math.min(1, p * 2),
        ...card,
        borderRadius: 22,
        padding: "16px 26px 16px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        fontSize: 40,
        fontWeight: 600,
        color: C.ink,
        letterSpacing: -0.5,
        whiteSpace: "nowrap",
      }}
    >
      <Dot c={c} />
      {t}
    </div>
  );
};

// Pílula pequena com contadores/legendas, para a "terceira camada" abaixo do texto.
export const Pill: React.FC<{ at: number; children: React.ReactNode; dark?: boolean }> = ({ at, children, dark }) => (
  <Pop at={at} style={{ marginTop: 36, alignSelf: "flex-start" }}>
    <div
      style={{
        ...(dark ? { background: C.ink, color: "#fff", borderRadius: 40 } : { ...card, borderRadius: 20, color: C.muted }),
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        gap: 30,
        fontSize: 28,
        fontWeight: dark ? 600 : 500,
      }}
    >
      {children}
    </div>
  </Pop>
);

export const Check: React.FC<{ s?: number; c?: string }> = ({ s = 34, c = "#fff" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

/* ============================== MOVIMENTO: CINÉTICA, FORMAS, 3D E CÂMERA ============================== */
// Tipografia cinética: a palavra nasce enorme e borrada e "bate" na tela, assentando com quique.
// `from` é a escala inicial; `rot` é o giro inicial em graus (zera ao assentar).
export const Slam: React.FC<{
  at: number;
  size?: number;
  color?: string;
  from?: number;
  rot?: number;
  children: React.ReactNode;
}> = ({ at, size = 200, color = C.ink, from = 3.2, rot = 0, children }) => {
  const f = useF();
  const p = sp(f, at, 12, 0.7);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: -size * 0.04,
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        opacity: interpolate(f, [at, at + 4], [0, 1], cl),
        transform: `scale(${r2(from + (1 - from) * p)}) rotate(${r2(rot * (1 - p))}deg)`,
        filter: p < 0.9 ? `blur(${r2((1 - p) * 10)}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// Forma que vira outra: largura, altura, raio e cor passam por estágios (`at` em quadros, crescente).
// Círculo = raio igual à metade do lado. Os filhos ficam dentro da forma (recortados por ela).
export type Forma = { at: number; w: number; h: number; r: number; c: string };
export const Morph: React.FC<{ stages: Forma[]; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  stages,
  style,
  children,
}) => {
  const f = useF();
  const t = stages.map((s) => s.at);
  const e = { ...cl, easing: Easing.inOut(Easing.cubic) };
  const v = (k: "w" | "h" | "r") => r2(interpolate(f, t, stages.map((s) => s[k]), e));
  return (
    <div
      style={{
        width: v("w"),
        height: v("h"),
        borderRadius: v("r"),
        background: interpolateColors(f, t, stages.map((s) => s.c)),
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Palco 3D com câmera. `cam` são poses da câmera ao longo da cena: x/y deslocam (px), z aproxima
// (px, positivo = perto), rx/ry orbitam (graus). Camadas com `z` diferente se movem em paralaxe.
// Atenção: `opacity` e `filter` em quem tem filhos 3D achatam a cena; aplique-os só no conteúdo final.
export type Pose = { at: number; x?: number; y?: number; z?: number; rx?: number; ry?: number };
export const Palco3D: React.FC<{ cam: Pose[]; perspective?: number; children: React.ReactNode }> = ({
  cam,
  perspective = 1400,
  children,
}) => {
  const f = useF();
  const t = cam.map((c) => c.at);
  const e = { ...cl, easing: Easing.inOut(Easing.cubic) };
  const v = (k: "x" | "y" | "z" | "rx" | "ry") =>
    cam.length < 2 ? (cam[0]?.[k] ?? 0) : r2(interpolate(f, t, cam.map((c) => c[k] ?? 0), e));
  return (
    <AbsoluteFill style={{ perspective }}>
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `translate3d(${-v("x")}px, ${-v("y")}px, ${v("z")}px) rotateX(${-v("rx")}deg) rotateY(${-v("ry")}deg)`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Camada dentro do <Palco3D>: o filho fica centralizado e é deslocado/girado no espaço.
// z negativo = longe da câmera, positivo = perto.
export const Camada3D: React.FC<{
  x?: number;
  y?: number;
  z?: number;
  rx?: number;
  ry?: number;
  rz?: number;
  children: React.ReactNode;
}> = ({ x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, children }) => (
  <AbsoluteFill
    style={{
      alignItems: "center",
      justifyContent: "center",
      transformStyle: "preserve-3d",
      transform: `translate3d(${r2(x)}px, ${r2(y)}px, ${r2(z)}px) rotateX(${r2(rx)}deg) rotateY(${r2(ry)}deg) rotateZ(${r2(rz)}deg)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ============================== MOLDURAS ============================== */
// Celular. Para tela real, ponha os filhos dentro de <div style={{position:"absolute", inset:"46px 0 0 0"}}>
// para a imagem não ficar atrás da "ilha".
export const Phone: React.FC<{ w?: number; h?: number; bg?: string; children: React.ReactNode }> = ({
  w = 400,
  h = 800,
  bg = "#fff",
  children,
}) => (
  <div
    style={{
      width: w,
      height: h,
      borderRadius: 64,
      background: "#101325",
      padding: 11,
      boxShadow: "0 50px 100px rgba(25,30,80,0.32), inset 0 0 0 2px rgba(255,255,255,0.12)",
    }}
  >
    <div style={{ width: "100%", height: "100%", borderRadius: 54, background: bg, overflow: "hidden", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 14,
          left: "50%",
          width: 110,
          height: 30,
          marginLeft: -55,
          borderRadius: 20,
          background: "#0A0C18",
          zIndex: 5,
        }}
      />
      {children}
    </div>
  </div>
);

// Janela de navegador. `aspect` deve ser a proporção do print (ex.: "1440 / 900").
export const Browser: React.FC<{ url: string; aspect?: string; children: React.ReactNode }> = ({
  url,
  aspect = "1440 / 900",
  children,
}) => (
  <div style={{ ...card, background: "#fff", overflow: "hidden", borderRadius: 24 }}>
    <div style={{ height: 50, display: "flex", alignItems: "center", gap: 9, padding: "0 20px", background: "#EEF0F6" }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <span key={c} style={{ width: 14, height: 14, borderRadius: 9, background: c }} />
      ))}
      <span style={{ marginLeft: 22, background: "#fff", borderRadius: 10, padding: "5px 18px", fontSize: 18, color: C.muted, fontWeight: 500 }}>
        {url}
      </span>
    </div>
    <div style={{ position: "relative", width: "100%", aspectRatio: aspect, overflow: "hidden" }}>{children}</div>
  </div>
);

// Prints reais em sequência: cada um entra deslizando por cima do anterior e depois rola `pan` pixels.
// `src` é relativo a public/ (ex.: "screens/inicio-mobile.png").
export const Shots: React.FC<{ shots: { src: string; at: number }[]; pan?: number }> = ({ shots, pan = 60 }) => {
  const f = useF();
  return (
    <>
      {shots.map((s, i) => {
        const p = i === 0 ? 1 : sp(f, s.at, 20, 0.8);
        const next = shots[i + 1];
        const y = interpolate(f, [s.at + 8, next ? next.at + 12 : s.at + 80], [0, -pan], cl);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              overflow: "hidden",
              background: "#fff",
              transform: `translateX(${r2((1 - p) * 100)}%)`,
              boxShadow: p < 1 ? "-20px 0 40px rgba(20,21,28,0.18)" : undefined,
            }}
          >
            <Img src={staticFile(s.src)} style={{ width: "100%", display: "block", transform: `translateY(${r2(y)}px)` }} />
          </div>
        );
      })}
    </>
  );
};

/* ============================== LOGO ============================== */
export const LogoIcon: React.FC<{ s: number }> = ({ s }) =>
  MARCA.logo ? (
    <Img src={staticFile(MARCA.logo)} style={{ width: s, height: s, objectFit: "contain", flexShrink: 0 }} />
  ) : (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: s * 0.28,
        background: `linear-gradient(140deg, ${C.brand} 0%, ${C.brandDeep} 100%)`,
        boxShadow: `0 ${s * 0.12}px ${s * 0.3}px rgba(20,21,28,0.22)`,
        color: "#fff",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: s * 0.6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {MARCA.nome[0]}
    </div>
  );

export const Logo: React.FC<{ s?: number }> = ({ s = 130 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: s * 0.3 }}>
    <LogoIcon s={s} />
    <span style={{ fontSize: s * 1.15, fontWeight: 700, letterSpacing: -s * 0.04, color: C.ink, fontFamily: SANS }}>
      {MARCA.nome}
    </span>
  </div>
);
