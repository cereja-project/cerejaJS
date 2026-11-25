import { useEffect, useRef, useState, useId } from "react";
import {
  Field,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  Button,
  Alert,
} from "@cereja-project/ui-react";
export function AccessibleForm() {
  const formId = useId();
  const [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [message, setMessage] = useState(""),
    [category, setCategory] = useState("question"),
    [format, setFormat] = useState("email"),
    [accepted, setAccepted] = useState(false),
    [notify, setNotify] = useState(false),
    [errors, setErrors] = useState<Record<string, string>>({}),
    [attempt, setAttempt] = useState(0),
    [success, setSuccess] = useState(false);
  const summary = useRef<HTMLDivElement>(null),
    confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!attempt) return;
    if (Object.keys(errors).length) summary.current?.focus();
    else confirmation.current?.focus();
  }, [attempt]);
  const ids: Record<string, string> = {
    name: formId + "-name",
    email: formId + "-email",
    accepted: formId + "-accepted",
  };
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const next: Record<string, string> = {};
        if (!name.trim()) next.name = "Informe seu nome.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
          next.email = "Informe um email válido.";
        if (!accepted) next.accepted = "Confirme o uso local dos dados.";
        setErrors(next);
        setSuccess(!Object.keys(next).length);
        setAttempt((n) => n + 1);
      }}
      className="example-form"
    >
      {Object.keys(errors).length > 0 && (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          className="md-alert example-error-summary"
        >
          <div>
            <strong>Revise os campos indicados</strong>
            <ul>
              {Object.entries(errors).map(([key, text]) => (
                <li key={key}>
                  <a
                    href={"#" + ids[key]}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(ids[key])?.focus();
                    }}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <Field label="Nome" required error={errors.name}>
        <Input
          id={ids.name}
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Field>
      <Field
        label="Email"
        required
        error={errors.email}
        description="Usado apenas para esta demonstração local."
      >
        <Input
          id={ids.email}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="Assunto">
        <Select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="question">Dúvida</option>
          <option value="feedback">Sugestão</option>
        </Select>
      </Field>
      <Field label="Mensagem">
        <Textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>
      <RadioGroup
        label="Formato preferido"
        name="contact-format"
        options={[
          { value: "email", label: "Email" },
          { value: "text", label: "Texto simples" },
        ]}
        value={format}
        onValueChange={setFormat}
      />
      <Checkbox
        id={ids.accepted}
        label="Aceito o uso local destes dados neste exemplo"
        name="accepted"
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
        aria-invalid={errors.accepted ? true : undefined}
        aria-describedby={
          errors.accepted ? formId + "-accepted-error" : undefined
        }
      />
      {errors.accepted && (
        <p className="md-field-error" id={formId + "-accepted-error"}>
          {errors.accepted}
        </p>
      )}
      <Switch
        label="Mostrar preferência de notificações"
        checked={notify}
        onCheckedChange={setNotify}
      />
      <Button type="submit">Preparar mensagem</Button>
      {success && (
        <div ref={confirmation} tabIndex={-1}>
          <Alert
            tone="success"
            announce="polite"
            title="Mensagem preparada localmente"
          >
            Os dados foram validados. Nenhum email ou dado foi enviado.
            Preferência de notificações: {notify ? "ativada" : "desativada"}.
          </Alert>
        </div>
      )}
    </form>
  );
}
