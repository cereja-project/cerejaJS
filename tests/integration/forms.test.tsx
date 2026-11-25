import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
} from "../../packages/core/src";
test("associates independent labels descriptions errors and explicit IDs", () => {
  render(
    <>
      <Field
        label="Nome"
        description="Nome completo"
        error="Obrigatório"
        required
      >
        <Input />
      </Field>
      <Field label="Email">
        <Input id="custom-email" type="email" />
      </Field>
    </>,
  );
  const name = screen.getByRole("textbox", { name: "Nome" }),
    email = screen.getByRole("textbox", { name: "Email" });
  expect(name.id).not.toBe(email.id);
  expect(email.id).toBe("custom-email");
  expect(name).toHaveAccessibleDescription("Nome completo Obrigatório");
  expect(name).toHaveAttribute("aria-invalid", "true");
  expect(name).toBeRequired();
});
test("preserves caller descriptions when context error changes", () => {
  const { rerender } = render(
    <>
      <p id="external">Externo</p>
      <Field label="Bio" description="Curta">
        <Textarea aria-describedby="external" />
      </Field>
    </>,
  );
  expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
    "Curta Externo",
  );
  rerender(
    <>
      <p id="external">Externo</p>
      <Field label="Bio" description="Curta" error="Revise">
        <Textarea aria-describedby="external" />
      </Field>
    </>,
  );
  expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
    "Curta Revise Externo",
  );
});
test("native choices submit selected values with FormData", async () => {
  const { container } = render(
    <form>
      <Field label="Formato">
        <Select name="format" defaultValue="mp3">
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </Select>
      </Field>
      <Checkbox label="Termos" name="terms" value="accepted" />
      <Switch label="Legendas automáticas" name="captions" value="on" />
      <RadioGroup
        name="quality"
        label="Qualidade"
        options={[
          { value: "low", label: "Baixa" },
          { value: "high", label: "Alta" },
          { value: "blocked", label: "Bloqueada", disabled: true },
        ]}
        defaultValue="low"
      />
    </form>,
  );
  const u = userEvent.setup();
  await u.click(screen.getByRole("checkbox", { name: "Termos" }));
  await u.click(screen.getByRole("switch", { name: "Legendas automáticas" }));
  await u.click(screen.getByRole("radio", { name: "Alta" }));
  await u.selectOptions(screen.getByRole("combobox"), "wav");
  const data = new FormData(container.querySelector("form")!);
  expect(Object.fromEntries(data)).toEqual({
    format: "wav",
    terms: "accepted",
    captions: "on",
    quality: "high",
  });
  expect(screen.getByRole("radio", { name: "Bloqueada" })).toBeDisabled();
});
test("controlled switch exposes the confirmed checked state", async () => {
  function Example() {
    const [checked, setChecked] = useState(false);
    return (
      <Switch label="Som" checked={checked} onCheckedChange={setChecked} />
    );
  }
  render(<Example />);
  await userEvent.click(screen.getByRole("switch"));
  expect(screen.getByRole("switch")).toBeChecked();
});
