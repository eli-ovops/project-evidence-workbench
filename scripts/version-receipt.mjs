import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const root=process.cwd(),sha=b=>createHash('sha256').update(b).digest('hex');
const files=[];
for(const dir of ['server','app','scripts','build/server','dist']){const walk=async p=>{for(const d of await fs.readdir(p,{withFileTypes:true})){if(d.isDirectory())await walk(path.join(p,d.name));else if(d.isFile()){const b=await fs.readFile(path.join(p,d.name));files.push({path:path.relative(root,path.join(p,d.name)),bytes:b.length,sha256:sha(b)})}}};await walk(path.join(root,dir));}
for(const f of ['package.json','package-lock.json','tsconfig.json','tsconfig.server.json','index.html','启动工作台.command','停止工作台.command']){const b=await fs.readFile(f);files.push({path:f,bytes:b.length,sha256:sha(b)})}
files.sort((a,b)=>a.path.localeCompare(b.path));
const versions={appVersion:'0.1.0',schemaName:'project-evidence-workbench',schemaVersion:1,createdAt:new Date().toISOString(),sourceFingerprint:sha(JSON.stringify(files)),files,deviations:[]};
await fs.writeFile('evidence/rev2/VERSION.json',JSON.stringify(versions,null,2));
console.log(JSON.stringify({sourceFingerprint:versions.sourceFingerprint,files:files.length}));
