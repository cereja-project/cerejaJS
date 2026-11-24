import { format } from "prettier";
import ts from "typescript-transpiler";
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
const root = new URL("../", import.meta.url),
  dir = new URL("apps/docs/src/examples/complete/", root);
const examples = [];
for (const file of await readdir(dir)) {
  if (!file.endsWith(".tsx")) continue;
  const name = file.slice(0, -4),
    source = await readFile(new URL(file, dir), "utf8");
  const jsx = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  await writeFile(new URL(name + "-js.jsx", dir), jsx);
  examples.push(`export { ${name} as ${name}JSX } from './${name}-js.jsx';`);
}
await writeFile(new URL("jsx-index.jsx", dir), examples.join("\n"));
const snippetsDir = new URL("apps/docs/src/catalog/snippets/", root);
await mkdir(snippetsDir, { recursive: true });
const snippetExports = [];
const metadata = JSON.parse(
  await readFile(new URL("apps/docs/src/catalog/metadata.json", root), "utf8"),
);
for (const entry of metadata) {
  const body = entry.snippet;
  let code =
    "import * as DS from '@cereja-project/ui-react';\nimport '@cereja-project/ui-react/styles.css';\n";
  if (body.includes("autoAdapter"))
    code += "import { autoAdapter } from '@cereja-project/ui-providers';\n";
  if (
    body.includes("images[") ||
    body.includes("{images}") ||
    body.includes("items[") ||
    body.includes("{items}")
  )
    code +=
      "const images = [{id:'one',src:'/illustrations/mountains.svg',alt:'Duas montanhas com neve nos picos.',caption:'Montanhas'},{id:'two',src:'/illustrations/coast.svg',alt:'Barco perto da praia.',caption:'Litoral'}];\n";
  if (body.includes("items[") || body.includes("{items}"))
    code +=
      "const items=images.map((image,i)=>({id:String(i),title:image.caption,image}));\n";
  if (body.includes("{sources}") || body.includes("sources.map"))
    code +=
      "const sources: DS.SourceOption[]=[{id:'one',label:'Original',source:{type:'file',src:'/fixtures/media/sample.mp4'}},{id:'two',label:'Descrita',source:{type:'file',src:'/fixtures/media/described.mp4'}}];\n";
  if (body.includes("{cues}"))
    code +=
      "const cues=[{id:'one',start:0,end:5,text:'Um tom acompanha o padrão de teste.'},{id:'two',start:5,end:12,text:'O padrão continua até o final.'}];\n";
  if (body.includes("{chapters}"))
    code +=
      "const chapters=[{id:'one',start:0,title:'Início'},{id:'two',start:5,title:'Segundo trecho'}];\n";
  if (body.includes("{tracks}"))
    code +=
      "const tracks: DS.TextTrackInput[]=[{id:'pt',src:'/fixtures/tracks/sample.vtt',language:'pt-BR',label:'Português',kind:'captions'}];\n";
  if (
    /\bset(Text|Checked|Value|Number|Page|Selected|Active|Files|Open|Action)\b/.test(
      body,
    )
  )
    code = "import { useState } from 'react';\n" + code;
  code += "export function Example(){\n";
  for (const [marker, statement] of [
    ["setText", "const [text,setText]=useState('');"],
    ["setChecked", "const [checked,setChecked]=useState(false);"],
    ["setValue", "const [value,setValue]=useState('one');"],
    ["setNumber", "const [number,setNumber]=useState(40);"],
    ["setPage", "const [page,setPage]=useState(1);"],
    ["setSelected", "const [selected,setSelected]=useState<string[]>([]);"],
    ["setActive", "const [active,setActive]=useState<string|null>(null);"],
    ["setFiles", "const [files,setFiles]=useState<File[]>([]);"],
    ["setOpen", "const [open,setOpen]=useState(false);"],
    ["setAction", "const [action,setAction]=useState('');"],
  ])
    if (body.includes(marker)) code += statement + "\n";
  code += "return (" + body + ");\n}\n";
  const names = [
    ...new Set([...code.matchAll(/DS\.(\w+)/g)].map((match) => match[1])),
  ];
  code = code
    .replace(
      "import * as DS from '@cereja-project/ui-react';",
      `import { ${names.join(", ")} } from '@cereja-project/ui-react';`,
    )
    .replace(/DS\./g, "");
  code = await format(code, { parser: "typescript" });
  entry.tsx = code;
  entry.jsx = ts.transpileModule(code, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  entry.jsx = await format(entry.jsx, { parser: "babel" });
  await writeFile(new URL(entry.id + ".tsx", snippetsDir), entry.tsx);
  await writeFile(new URL(entry.id + "-js.jsx", snippetsDir), entry.jsx);
  snippetExports.push(
    `export { Example as Example_${entry.id} } from './${entry.id}-js.jsx';`,
  );
}
await writeFile(
  new URL("jsx-index.jsx", snippetsDir),
  snippetExports.join("\n"),
);
await writeFile(
  new URL("apps/docs/src/catalog/generated-examples.json", root),
  JSON.stringify(metadata, null, 2),
);

await writeFile(
  new URL("preview-registry.ts", snippetsDir),
  metadata
    .map((e) => `import { Example as ${e.id} } from "./${e.id}";`)
    .join("\n") +
    "\nexport const previews = {" +
    metadata.map((e) => e.id).join(",") +
    "};\n",
);
