import { useState } from "react";
import {
  Tabs,
  Accordion,
  Switch,
  Checkbox,
  RadioGroup,
  Alert,
} from "@cereja-project/ui-react";
export function Preferences() {
  const [captions, setCaptions] = useState(true),
    [description, setDescription] = useState(false),
    [mode, setMode] = useState("neutral");
  return (
    <div className="example-stack">
      <Tabs
        label="Preferências de reprodução"
        items={[
          {
            value: "access",
            label: "Acessibilidade",
            content: (
              <>
                <Switch
                  label="Preferir legendas"
                  checked={captions}
                  onCheckedChange={setCaptions}
                />
                <Switch
                  label="Preferir versão descrita"
                  checked={description}
                  onCheckedChange={setDescription}
                />
                <Accordion
                  items={[
                    {
                      id: "help",
                      title: "Como estas preferências funcionam?",
                      content:
                        "Estas escolhas ficam somente no estado local do exemplo. A aplicação integra as preferências às faixas disponíveis.",
                    },
                  ]}
                />
              </>
            ),
          },
          {
            value: "appearance",
            label: "Aparência",
            content: (
              <RadioGroup
                label="Tema preferido"
                name="theme-preference"
                options={[
                  { value: "neutral", label: "Neutro" },
                  { value: "system", label: "Do sistema" },
                ]}
                value={mode}
                onValueChange={setMode}
              />
            ),
          },
        ]}
      />
      <Alert title="Preferências atuais">
        Legendas: {captions ? "sim" : "não"} · Versão descrita:{" "}
        {description ? "sim" : "não"} · Tema:{" "}
        {mode === "neutral" ? "neutro" : "do sistema"}.
      </Alert>
    </div>
  );
}
