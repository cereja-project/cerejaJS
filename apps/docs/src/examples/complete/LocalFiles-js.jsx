import { useState } from "react";
import { FilePicker, MediaPreview, Field, Input, Select, fileMime, } from "@cereja-project/ui-react";
export function LocalFiles() {
    const [files, setFiles] = useState([]), [index, setIndex] = useState("0"), [descriptions, setDescriptions] = useState({});
    const active = files[Number(index)] ?? files[0], key = active ? `${active.name}:${active.size}:${active.lastModified}` : "";
    return (<div className="example-stack">
      <FilePicker label="Adicionar arquivos locais" files={files} onFilesChange={(next) => {
            setFiles(next);
            setIndex("0");
        }} accept="image/*,audio/*,video/*" multiple maxFiles={3} maxSizeBytes={5 * 1024 * 1024}/>
      {files.length > 1 && (<Field label="Arquivo para prévia">
          <Select value={String(Math.min(Number(index), files.length - 1))} onChange={(e) => setIndex(e.target.value)}>
            {files.map((file, i) => (<option key={i} value={i}>
                {file.name}
              </option>))}
          </Select>
        </Field>)}
      {active && fileMime(active).startsWith("image/") && (<Field label="Texto alternativo da imagem" description="Descreva o conteúdo relevante para quem não consegue ver a imagem.">
          <Input value={descriptions[key] ?? ""} onChange={(e) => setDescriptions({ ...descriptions, [key]: e.target.value })}/>
        </Field>)}
      <MediaPreview file={active ?? null} alt={descriptions[key]}/>
    </div>);
}
