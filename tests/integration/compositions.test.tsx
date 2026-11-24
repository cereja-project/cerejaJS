import { render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";
import axe from "axe-core";
import { VideoPlayer, Gallery } from "../../packages/react/src";
import { controlledAdapter } from "../helpers/adapter";
test("ready player, transcript and gallery have no detectable semantic axe violations", async () => {
  const adapter = controlledAdapter();
  const { container } = render(
    <main>
      <h1>Exemplo</h1>
      <VideoPlayer
        label="Exemplo de vídeo"
        source={{ type: "file", src: "/a" }}
        adapterFactory={async () => adapter.adapter}
        transcript={[
          { id: "a", start: 0, end: 10, text: "Exemplo de transcrição" },
        ]}
      />
      <Gallery
        items={[{ id: "a", src: "/a.svg", alt: "Paisagem de exemplo" }]}
      />
    </main>,
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reproduzir" })).toBeEnabled(),
  );
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations).toEqual([]);
});
