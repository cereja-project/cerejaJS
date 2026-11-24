import { mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
const npmCli = process.env.npm_execpath;
if (!npmCli)
  throw new Error("Execute este script pelo comando npm run correspondente.");
const root = fileURLToPath(new URL("../../", import.meta.url));
const artifacts = join(root, "artifacts");
await mkdir(artifacts, { recursive: true });
const tarballs = [];
for (const name of ["core", "providers", "react"]) {
  const result = JSON.parse(
    execFileSync(
      process.execPath,
      [
        npmCli,
        "pack",
        "--workspace",
        `@cereja-project/ui-${name}`,
        "--pack-destination",
        artifacts,
        "--json",
      ],
      { cwd: root, encoding: "utf8" },
    ),
  );
  tarballs.push(join(artifacts, result[0].filename));
}
const current = JSON.parse(
  await readFile(join(root, "node_modules/react/package.json"), "utf8"),
).version;
const results = [];
for (const [label, version, types] of [
  ["react18", "18.2.0", "18"],
  ["react19", current, "19"],
]) {
  const parent = join(root, ".superpowers/consumers");
  await mkdir(parent, { recursive: true });
  const dir = await mkdtemp(join(parent, label + "-"));
  await writeFile(
    join(dir, "package.json"),
    JSON.stringify({
      name: `consumer-${label}`,
      version: "1.0.0",
      type: "module",
      private: true,
    }),
  );
  execFileSync(
    process.execPath,
    [
      npmCli,
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      ...tarballs,
      `react@${version}`,
      `react-dom@${version}`,
      `@types/react@${types}`,
      `@types/react-dom@${types}`,
    ],
    { cwd: dir, stdio: ["ignore", "pipe", "pipe"], timeout: 180000 },
  );
  await writeFile(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: {
        noEmit: true,
        target: "ES2022",
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        moduleResolution: "bundler",
        jsx: "react-jsx",
        strict: true,
        esModuleInterop: true,
        types: ["react"],
      },
      include: ["app.tsx"],
    }),
  );
  await writeFile(
    join(dir, "app.tsx"),
    `import { VideoPlayer,Gallery,Field,Input,Checkbox,FilePicker,type ImageData } from '@cereja-project/ui-react';\nconst image:ImageData={id:'a',src:'/a',alt:'Example'};\nexport const app=<><VideoPlayer label="Video" source={{type:'file',src:'/v.mp4'}}/><Gallery items={[image]}/><Field label="Título"><Input name="title"/></Field><Checkbox label="Ativar"/><FilePicker label="Arquivos" onFilesChange={()=>{}}/></>;\n// @ts-expect-error Missing informative alt\nconst bad:ImageData={id:'b',src:'/b'};\n`,
  );
  execFileSync(
    process.execPath,
    [join(root, "node_modules/typescript/bin/tsc"), "-p", "tsconfig.json"],
    { cwd: dir, stdio: ["ignore", "pipe", "pipe"] },
  );
  await writeFile(
    join(dir, "ssr.mjs"),
    `import React from 'react';import{renderToString}from'react-dom/server';import{VideoPlayer,Field,Input}from'@cereja-project/ui-react';import{readFileSync}from'node:fs';\nconst output=renderToString(React.createElement(React.Fragment,null,React.createElement(VideoPlayer,{label:'SSR example',source:{type:'file',src:'/v.mp4'}}),React.createElement(Field,{label:'Título SSR'},React.createElement(Input,{name:'title'}))));if(!output.includes('SSR example'))throw Error('Missing SSR output');if(readFileSync(new URL(import.meta.resolve('@cereja-project/ui-react/styles.css')),'utf8').length<100)throw Error('Missing CSS');for(const name of ['native','hls','dash','youtube','vimeo'])await import('@cereja-project/ui-providers/'+name);console.log('SSR and exports OK');`,
  );
  const output = execFileSync(process.execPath, ["ssr.mjs"], {
    cwd: dir,
    encoding: "utf8",
  }).trim();
  await writeFile(
    join(dir, "app.jsx"),
    `import React from 'react';import{VideoPlayer,Field,Input}from'@cereja-project/ui-react';import'@cereja-project/ui-react/styles.css';export const app=<VideoPlayer label="JSX example" source={{type:'file',src:'/v.mp4'}}><Field label="Título"><Input/></Field></VideoPlayer>;`,
  );
  const { build } = await import("vite");
  await build({
    configFile: false,
    root: dir,
    logLevel: "error",
    build: {
      lib: { entry: join(dir, "app.jsx"), formats: ["es"], fileName: "app" },
      rollupOptions: { external: ["react", "react-dom", "react/jsx-runtime"] },
    },
  });
  results.push({
    react: version,
    types,
    tsx: "passed",
    jsxBundle: "passed",
    ssr: "passed",
    output,
  });
  console.log(`${label}: TSX, JSX, SSR and public exports PASS`);
}
await mkdir(join(root, "docs/compatibility"), { recursive: true });
await writeFile(
  join(root, "docs/compatibility/consumers.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
);
