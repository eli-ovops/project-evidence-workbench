import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {Workbench,sha} from './workbench.js';
import {APP,VERSION,AppError,fail} from './model.js';
const projectRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2);const opt=(flag:string)=>{const i=args.indexOf(flag);return i<0?undefined:args[i+1]};
const dataRoot=path.resolve(opt('--data-root')||path.join(projectRoot,'data/demo'));
if(args.includes('--init')){await fs.mkdir(path.dirname(dataRoot),{recursive:true});const fixtureRoot=path.join(path.dirname(dataRoot),'fixtures-'+path.basename(dataRoot));await Workbench.initialize(dataRoot,fixtureRoot);}
const wb=await new Workbench(dataRoot).open();
const runtimeDir=path.join(projectRoot,'runtime');await fs.mkdir(runtimeDir,{recursive:true});
const rootTag=sha(APP+wb.state.rootId).slice(0,16),cookieName='ew_'+rootTag;
const bootstrap=randomBytes(32).toString('hex'), session=randomBytes(32).toString('hex'),stopKey=randomBytes(32).toString('hex');
let used=false;let closing=false;let origin='';
const equal=(a:string,b:string)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)};
const sessionExpiresAt=Date.now()+8*3600000;
function auth(req:http.IncomingMessage){const cookies=String(req.headers.cookie||'').split(';').map(x=>x.trim());const val=cookies.find(c=>c.startsWith(cookieName+'='))?.slice(cookieName.length+1)||'';return Date.now()<sessionExpiresAt&&equal(val,session)}
async function body(req:http.IncomingMessage){let n=0;const chunks:Buffer[]=[];for await(const chunk of req){n+=chunk.length;if(n>2*1024*1024)fail('LIMIT','请求超过2MiB，编辑保留',413);chunks.push(chunk)}return Buffer.concat(chunks).toString('utf8')}
function send(res:http.ServerResponse,status:number,data:unknown){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))}
const server=http.createServer(async(req,res)=>{try{
 const host=req.headers.host||'';if(host!==new URL(origin).host)fail('HOST','Host 不匹配',403);
 const url=new URL(req.url||'/',origin);const method=req.method||'GET';
 if(url.pathname==='/api/session/start'&&method==='POST'){
  if(req.headers.origin&&req.headers.origin!=='null'&&req.headers.origin!==origin)fail('ORIGIN','Origin 不匹配',403);
  const b=new URLSearchParams(await body(req));if(used||!equal(b.get('bootstrap')||'',bootstrap))fail('AUTH','启动认证已失效，请使用本实例启动入口',401);used=true;
  res.writeHead(303,{'Set-Cookie':`${cookieName}=${session}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`,'Location':'/','Cache-Control':'no-store'});res.end();return;
 }
 if(url.pathname==='/api/control/stop'&&method==='POST'){if(!equal(String(req.headers['x-stop-key']||''),stopKey))fail('AUTH','停止身份不匹配',401);send(res,200,{stopping:true});setTimeout(()=>void shutdown(),100);return;}
 if(url.pathname.startsWith('/api/')){
  if(!auth(req))fail('AUTH','未登录或本实例会话过期；请从启动入口打开',401);
  if(req.headers.origin&&req.headers.origin!==origin)fail('ORIGIN','Origin 不匹配',403);
  if(method!=='GET'&&req.headers.origin!==origin)fail('ORIGIN','写入需要本实例同源 Origin',403);
  if(method==='GET'&&url.pathname==='/api/state'){send(res,200,wb.view());return}
  if(method==='GET'&&url.pathname==='/api/health'){send(res,200,{app:APP,version:VERSION,rootId:wb.state.rootId,revision:wb.state.revision});return}
  if(method==='GET'&&url.pathname==='/api/grant-review'){send(res,200,{items:await wb.reviewGrants()});return}
  if(method==='GET'&&url.pathname==='/api/exports'){send(res,200,await wb.listExports());return}
  if(method==='GET'&&url.pathname.startsWith('/api/download/')){const id=url.pathname.split('/').pop()!;const bundle=await wb.download(id);res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Content-Disposition':`attachment; filename="evidence-${bundle.manifest.privacyMode}-${id}.json"`,'Cache-Control':'no-store'});res.end(JSON.stringify(bundle,null,2));return}
  const b=JSON.parse(await body(req));let result:unknown;
  if(method!=='POST')fail('METHOD','不支持的方法',405);
  switch(url.pathname){
   case '/api/save':result=await wb.save(b.kind,b.object,b.revision);break;
   case '/api/grant':result=await wb.grant(b.ids,!!b.content,String(b.actor||''),b.revision);break;
   case '/api/revoke':result=await wb.revoke(b.id,'local-user',b.revision);break;
   case '/api/check':result=await wb.check(b.ids);break;
   case '/api/approve':result=await wb.approve(b.projectId,String(b.actor||''),b.revision);break;
   case '/api/export':result=await wb.export(b.mode,b.projectIds);break;
   case '/api/restore':{
    if(!/^restore-[a-zA-Z0-9_-]{1,50}$/.test(String(b.name)))fail('PATH','恢复目录名称须为 restore- 加字母数字，使用新根');
    const parent=path.join(projectRoot,'data');await fs.mkdir(parent,{recursive:true});const target=path.join(parent,b.name);result=await Workbench.restore(b.bundle,target);break;
   }
   case '/api/logout':res.setHeader('Set-Cookie',`${cookieName}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);send(res,200,{loggedOut:true});return;
   default:fail('NOT_FOUND','接口不存在',404);
  }send(res,200,result);return;
 }
 if(method!=='GET')fail('METHOD','不支持的方法',405);
 const asset=url.pathname==='/'?'index.html':url.pathname.slice(1);if(asset.includes('..')||asset.includes('\\')||asset.startsWith('.')||(!/^assets\/[a-zA-Z0-9_.-]+\.(js|css)$/.test(asset)&&asset!=='index.html'))fail('NOT_FOUND','静态资源不存在',404);
 const file=path.join(projectRoot,'dist',asset),ext=path.extname(file);const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':ext==='.js'?'text/javascript; charset=utf-8':ext==='.css'?'text/css; charset=utf-8':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(data);
 }catch(e){const err=e as any;send(res,err instanceof AppError?err.status:err.code==='ENOENT'?404:500,{error:{code:err instanceof AppError?err.code:err.code==='ENOENT'?'MISSING':'ERROR',message:err instanceof AppError?err.message:'操作未完成，原数据保留；查看本工具状态/恢复入口'}})}});
await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(Number(opt('--port')||0),'127.0.0.1',()=>resolve())});
const address=server.address() as {port:number};origin=`http://127.0.0.1:${address.port}`;
const bootPath=path.join(runtimeDir,`launch-${rootTag}.html`), runtimePath=path.join(runtimeDir,`instance-${rootTag}.json`);
const boot=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>打开证据工作台</title><body><p>正在打开本机证据工作台…</p><form method="post" action="${origin}/api/session/start"><input type="hidden" name="bootstrap" value="${bootstrap}"><button>打开工作台</button></form><script>document.querySelector('form').submit()</script></body></html>`;
await fs.writeFile(bootPath,boot,{mode:0o600});await fs.writeFile(runtimePath,JSON.stringify({app:APP,pid:process.pid,rootId:wb.state.rootId,dataRoot,origin,bootPath,stopKey},null,2),{mode:0o600});
console.log(JSON.stringify({app:APP,version:VERSION,rootId:wb.state.rootId,dataRoot,url:origin,launchFile:bootPath,runtimeRecord:runtimePath}));
async function shutdown(){if(closing)return;closing=true;server.close();server.closeAllConnections();await wb.close();process.exit(0)}
process.on('SIGTERM',()=>void shutdown());process.on('SIGINT',()=>void shutdown());
