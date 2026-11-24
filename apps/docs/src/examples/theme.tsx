import { useState, type CSSProperties } from "react";
import { AudioPlayer, Button } from "@cereja-project/ui-react";
function luminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((c) => parseInt(c, 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function ThemeExample() {
  const [bg, setBg] = useState("#ffffff"),
    [fg, setFg] = useState("#202020"),
    [accent, setAccent] = useState("#262626");
  const text = contrast(bg, fg),
    control = contrast(bg, accent);
  return (
    <>
      <div className="theme-settings">
        <label>
          Fundo
          <input
            type="color"
            value={bg}
            onChange={(e) => setBg(e.target.value)}
          />
        </label>
        <label>
          Texto
          <input
            type="color"
            value={fg}
            onChange={(e) => setFg(e.target.value)}
          />
        </label>
        <label>
          Destaque
          <input
            type="color"
            value={accent}
            onChange={(e) => setAccent(e.target.value)}
          />
        </label>
        <Button
          onClick={() => {
            setBg("#ffffff");
            setFg("#202020");
            setAccent("#262626");
          }}
        >
          Restaurar padrão
        </Button>
      </div>
      <p role="status" className="theme-feedback">
        Contraste de texto: {text.toFixed(2)}:1 · Destaque/fundo:{" "}
        {control.toFixed(2)}:1.{" "}
        {text < 4.5 || control < 3
          ? "Esta combinação precisa de ajustes de contraste."
          : "Estes pares atendem aos limites de contraste verificados."}{" "}
        O tema completo ainda exige validação.
      </p>
      <div
        style={
          {
            "--md-bg": bg,
            "--md-fg": fg,
            "--md-accent": accent,
            "--md-surface": bg,
            "--md-muted": fg,
            "--md-border": fg,
            "--md-focus": fg,
          } as CSSProperties
        }
      >
        <AudioPlayer
          label="Prévia do seu tema"
          source={{ type: "file", src: "/fixtures/media/sample.mp3" }}
        />
      </div>
      <pre>
        <code>{`:root {\n  --md-bg: ${bg};\n  --md-fg: ${fg};\n  --md-accent: ${accent};\n}`}</code>
      </pre>
    </>
  );
}
