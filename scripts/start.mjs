import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const selected=process.argv[2]||'demo';if(!/^(demo|restore-[a-zA-Z0-9_-]{1,50})$/.test(selected))throw Error('无效数据根名称');
const data=path.join(root,'data',selected),marker=path.join(root,'runtime','initialized-demo.json');
let init=false;if(selected==='demo'){
 const exists=await fs.stat(data).then(()=>true,()=>false),marked=await fs.stat(marker).then(()=>true,()=>false);
 if(!exists&&!marked)init=true;else if(!exists)throw Error('已初始化数据根缺失，禁止自动新建；使用隔离恢复');
}
let ready=false;
const child=spawn(process.execPath,[path.join(root,'build/server/main.js'),...(init?['--init']:[]),'--data-root',data],{cwd:root,stdio:['ignore','pipe','pipe'],detached:true});
child.on('error',e=>{console.error('本工具启动失败：'+e.message);process.exitCode=1});
child.on('exit',code=>{if(!ready)process.exitCode=code||1});
child.stderr.on('data',d=>process.stderr.write(d));let out='';child.stdout.on('data',async d=>{out+=d;const line=out.split('\n')[0];try{const info=JSON.parse(line);if(init){await fs.mkdir(path.dirname(marker),{recursive:true});await fs.writeFile(marker,JSON.stringify({initializedAt:new Date().toISOString(),rootId:info.rootId}),{flag:'wx'})}ready=true;console.log(`工作台 ${info.url}\n数据 ${info.dataRoot}\n恢复副本可用：node scripts/start.mjs restore-名称`);if(process.env.PEW_OPEN_BROWSER!=='0')spawn('/usr/bin/open',[info.launchFile],{stdio:'ignore'}).unref();child.stdout.destroy();child.stderr.destroy();child.unref();}catch(e){if(ready){console.error('本工具启动记录失败');process.exitCode=1}}});
