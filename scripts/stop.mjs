import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),base=path.join(root,'runtime');
for(const name of await fs.readdir(base)){if(!/^instance-[a-f0-9]{16}\.json$/.test(name))continue;const info=JSON.parse(await fs.readFile(path.join(base,name),'utf8'));if(info.app!=='project-evidence-workbench')continue;try{const r=await fetch(info.origin+'/api/control/stop',{method:'POST',headers:{'X-Stop-Key':info.stopKey}});if(r.ok)console.log('已停止本工具实例：'+info.rootId)}catch{}}
