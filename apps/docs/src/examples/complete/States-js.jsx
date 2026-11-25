import { useState } from "react";
import { Field, Select, Slider, Progress, MediaLoading, MediaUnavailable, MediaErrorState, Alert, } from "@cereja-project/ui-react";
export function States() {
    const [state, setState] = useState("loading"), [progress, setProgress] = useState(30), [retries, setRetries] = useState(0);
    return (<div className="example-stack">
      <Field label="Estado demonstrado">
        <Select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="loading">Carregando</option>
          <option value="unavailable">Indisponível</option>
          <option value="error">Erro recuperável</option>
          <option value="ready">Pronto</option>
        </Select>
      </Field>
      {state === "loading" ? (<MediaLoading label="Carregando lista de mídia"/>) : state === "unavailable" ? (<MediaUnavailable />) : state === "error" ? (<MediaErrorState onRetry={() => {
                setRetries((n) => n + 1);
                setState("ready");
            }}/>) : (<Alert tone="success" announce="polite" title="Conteúdo pronto">
          Estado local de demonstração. Tentativas de recuperação: {retries}.
        </Alert>)}
      <Slider label="Progresso demonstrado" min={0} max={100} step={10} value={progress} valueText={`${progress}%`} onValueChange={setProgress}/>
      <Progress label="Progresso do exemplo" value={progress}/>
    </div>);
}
