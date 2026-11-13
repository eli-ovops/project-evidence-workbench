import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';

type Data = any;
const DRAWER_EXIT_MS=160;
const fieldNames:Record<string,string>={'内部项目标题':'项目标题','类型 / 归属':'项目类型','项目导航说明':'项目说明','精确文件绝对路径':'文件路径','用途 / 读取范围':'文件用途','来源类型（原件/摘要/自述/Mock）':'来源类型','来源日期（未知留空）':'来源日期','具体产品版本':'产品版本','原件位置 / 行号':'位置或行号','原记录确认人（不是数字签名）':'记录确认人','限制 / 未覆盖':'范围与限制','允许日期（不填充历史未知）':'可公开的日期','许可确认人（虚构示例用 fixture-owner）':'许可确认人','许可截止日期（可留空）':'许可截止日期'};
const fieldHints:Record<string,string>={locator:'填写一个文件的完整路径，不支持目录。',sourceDate:'日期不确定时留空。',confirmer:'填写原记录中的确认人，不代表数字签名。',actor:'虚构示例用 fixture-owner；真实资料需本人许可。'};
const tabs = ['证据', '结论', '公开文字', '缺口', '导出与恢复'];
const dimensions = ['代码', '本地', '设备', '发布', '客户验收', '商业', '职责', '公开许可'];
const filename = (p: string) => p.split(/[\\/]/).at(-1) || p;
const dateLabel = (s: string | null) => s ? new Date(s).toLocaleString('zh-CN', {month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'}) : '尚未复核';
const plainMessage = (s:string) => s.replace(/USER_PENDING：\s*/g,'待确认：').replace(/UNKNOWN/g,'未知').replace('PASS只是未核记录，非软件验收','记录中的“通过”尚未核实，不代表软件验收');
const projectType = (s:string) => s==='UNKNOWN'?'类型未填写':s;
const exportStatus = (s:string) => ({COMPLETED:'已完成',FAILED:'失败',PARTIAL:'未完成'} as Record<string,string>)[s] || s;

async function api(url:string, body?:any) {
  let r:Response;
  try {r = await fetch('/api/'+url, {method:body===undefined?'GET':'POST', headers:body===undefined?{}:{'Content-Type':'application/json'}, body:body===undefined?undefined:JSON.stringify(body)})}
  catch {throw Error('本机连接中断。编辑仍保留，请先核对已提交修订，再决定是否重试。')}
  let x:any;
  try {x=await r.json()}catch {throw Error('服务响应不完整。请保留编辑，重新读取后核对是否已提交。')}
  if (!r.ok) throw Error(x.error?.message || '操作失败');
  return x;
}
function localDownload(name:string, text:string) {
  const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
  const a = document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
}
function Icon({name, size=18}:{name:string;size?:number}) {
  const paths:Record<string,React.ReactNode> = {
    layers:<><path d="m3 7 9-4 9 4-9 4-9-4Z"/><path d="m3 12 9 4 9-4M3 17l9 4 9-4"/></>,
    folder:<path d="M3 7V5h6l2 2h10v12H3V7Z"/>,
    file:<><path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v5h4M9 12h6M9 16h6"/></>,
    search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></>,
    plus:<path d="M12 5v14M5 12h14"/>,
    chevron:<path d="m9 6 6 6-6 6"/>,
    back:<path d="m15 6-6 6 6 6"/>,
    down:<path d="m6 9 6 6 6-6"/>,
    close:<path d="m6 6 12 12M18 6 6 18"/>,
    check:<path d="m5 12 4 4L19 6"/>,
    inspect:<><path d="M4 3h10l4 4v4M4 3v18h8M8 7h3M8 11h3"/><circle cx="16" cy="16" r="4"/><path d="m19 19 3 3"/></>,
    lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4M12 14v3"/></>,
    download:<><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
    edit:<><path d="m14 4 6 6M4 20l4-1L20 7l-3-3L5 16l-1 4Z"/></>,
    alert:<><path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5M12 17h.01"/></>,
    menu:<path d="M4 6h16M4 12h16M4 18h16"/>,
    link:<><path d="m9 15 6-6M7 14l-2 2a3 3 0 0 0 4 4l4-4M11 8l4-4a3 3 0 0 1 4 4l-2 2"/></>,
    clock:<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.file}</svg>;
}
function Drawer({title, subtitle, onClose, canClose, pending=false, error, errorHelp, children}:{title:string;subtitle?:string;onClose:()=>void;canClose?:()=>boolean;pending?:boolean;error?:string;errorHelp?:string;children:React.ReactNode}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing,setClosing] = useState(false);
  const closeTimer=useRef<number|null>(null);
  useEffect(()=>{const d=ref.current!;d.showModal();d.querySelector<HTMLInputElement>('input:not([type=checkbox]),textarea')?.focus();return()=>{if(closeTimer.current!==null)window.clearTimeout(closeTimer.current);d.close()}},[]);
  const close=()=>{
    if(pending||closing)return;
    if(canClose&&!canClose())return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();return}
    setClosing(true);closeTimer.current=window.setTimeout(onClose,DRAWER_EXIT_MS);
  };
  return <dialog ref={ref} className={'drawer'+(closing?' is-closing':'')} aria-label={title} onCancel={e=>{e.preventDefault();close()}}>
    <div className="drawer-head"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div><button className="icon-button" aria-label="关闭面板" disabled={pending} onClick={close}><Icon name="close"/></button></div>
    {error&&<div className="drawer-error" role="alert"><Icon name="alert" size={17}/><div>{plainMessage(error)}<small>{errorHelp||'当前编辑仍保留。修正后可再次保存，或下载未保存文本。'}</small></div></div>}
    {children}
  </dialog>;
}
function App() {
  const [data,setData]=useState<Data>(null), [err,setErr]=useState(''), [note,setNote]=useState(''), [busy,setBusy]=useState(false);
  const [projectId,setProjectId]=useState('P-demo-1'), [tab,setTab]=useState('证据'), [query,setQuery]=useState('');
  const [edit,setEdit]=useState<Data>(null), [dirty,setDirty]=useState(false), [grants,setGrants]=useState<any[]|null>(null);
  const [selected,setSelected]=useState<string[]>([]), [content,setContent]=useState(false), [actor,setActor]=useState('fixture-owner');
  const [exports,setExports]=useState<any[]>([]), [navOpen,setNavOpen]=useState(false);
  const [mobile,setMobile]=useState(window.matchMedia('(max-width:760px)').matches);
  const searchRef=useRef<HTMLInputElement>(null);
  const railRef=useRef<HTMLElement>(null),menuRef=useRef<HTMLButtonElement>(null);
  const saveRef=useRef<HTMLButtonElement>(null),restoredRoot=useRef<string|null>(null);
  const evidenceRows=useRef(new Map<string,HTMLElement>()),sourceButtons=useRef(new Map<string,HTMLButtonElement>());
  const [sourceRoute,setSourceRoute]=useState<{claimId:string;evidenceId:string}|null>(null);
  const [returnToSource,setReturnToSource]=useState<string|null>(null);
  const actionPending=useRef(false);
  const [showUnlinked,setShowUnlinked]=useState(false);
  const [viewRoot,setViewRoot]=useState<string|null>(null);
  const tabRef=useRef<HTMLDivElement>(null);
  const [indicator,setIndicator]=useState({left:0,width:40});
  const refresh=async()=>{const d=await api('state');setData(d);setExports(await api('exports'));return d};
  useEffect(()=>{void refresh().catch(e=>setErr(e.message))},[]);
  const rootId=data?.application?.rootId as string|undefined;
  useEffect(()=>{
    if(!rootId||restoredRoot.current===rootId)return;
    let view:any=null;
    try {view=JSON.parse(sessionStorage.getItem('project-evidence-workbench:view:'+rootId)||'null')}catch{}
    setProjectId(data.projects.some((p:Data)=>p.id===view?.projectId)?view.projectId:data.projects[0]?.id||'');
    setTab(tabs.includes(view?.tab)?view.tab:'证据');setQuery(typeof view?.query==='string'?view.query.slice(0,200):'');
    restoredRoot.current=rootId;setViewRoot(rootId);
  },[rootId]);
  useEffect(()=>{
    if(!rootId||viewRoot!==rootId)return;
    try {sessionStorage.setItem('project-evidence-workbench:view:'+rootId,JSON.stringify({projectId,tab,query:query.slice(0,200)}))}catch{}
  },[rootId,viewRoot,projectId,tab,query]);
  useEffect(()=>{const m=window.matchMedia('(max-width:760px)');const update=()=>{setMobile(m.matches);if(!m.matches)setNavOpen(false)};m.addEventListener('change',update);return()=>m.removeEventListener('change',update)},[]);
  useEffect(()=>{const shortcut=(e:KeyboardEvent)=>{if(edit&&(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'&&!e.isComposing){e.preventDefault();if(!busy&&!e.repeat)saveRef.current?.click();return}const target=e.target as HTMLElement,tag=target?.tagName;if(!edit&&!grants&&e.key==='/'&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!target?.closest('[contenteditable=true]')&&!['INPUT','TEXTAREA','SELECT'].includes(tag)){e.preventDefault();if(mobile)setNavOpen(true);setTimeout(()=>searchRef.current?.focus(),0)}if(e.key==='Escape'&&!edit&&!grants)setNavOpen(false)};window.addEventListener('keydown',shortcut);return()=>window.removeEventListener('keydown',shortcut)},[edit,grants,mobile,busy]);
  useEffect(()=>{
    if(!mobile||!navOpen)return;
    const opener=document.activeElement as HTMLElement,overflow=document.body.style.overflow;
    document.body.style.overflow='hidden';searchRef.current?.focus();
    return()=>{document.body.style.overflow=overflow;if(!document.querySelector('dialog[open]')){const target=opener?.isConnected&&!opener.closest('[inert]')?opener:menuRef.current;target?.focus({preventScroll:true})}};
  },[mobile,navOpen]);
  const trapNavigation=(e:React.KeyboardEvent)=>{
    if(!mobile||!navOpen||e.key!=='Tab')return;
    const controls=Array.from(railRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]')||[]);
    const first=controls[0],last=controls.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  };
  useEffect(()=>{const h=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',h);return()=>window.removeEventListener('beforeunload',h)},[dirty]);
  useLayoutEffect(()=>{
    const list=tabRef.current;if(!list)return;
    const measure=()=>{const b=list.querySelector<HTMLButtonElement>('[aria-selected=true]');if(b)setIndicator({left:b.offsetLeft,width:b.offsetWidth})};
    measure();const observer=new ResizeObserver(measure);observer.observe(list);return()=>observer.disconnect();
  },[tab,data]);
  useLayoutEffect(()=>{
    if(tab==='证据'&&sourceRoute){
      const row=evidenceRows.current.get(sourceRoute.evidenceId),details=row?.querySelector<HTMLDetailsElement>('.source-details');
      if(details){details.open=true;row?.scrollIntoView({block:'nearest',behavior:'auto'});details.querySelector<HTMLElement>('summary')?.focus({preventScroll:true})}
    }
    if(tab==='结论'&&returnToSource){sourceButtons.current.get(returnToSource)?.focus();setReturnToSource(null)}
  },[tab,sourceRoute,returnToSource]);
  const act=async(fn:()=>Promise<any>,message:string)=>{
    if(actionPending.current)return;
    actionPending.current=true;
    setBusy(true);setErr('');setNote('');
    try {const result=await fn();setNote(typeof result==='string'?result:message);try{await refresh()}catch{setErr('操作已返回，但界面未能同步。请重新读取并核对已提交修订，勿重复提交。')}}
    catch(e){setErr((e as Error).message)}finally{actionPending.current=false;setBusy(false)}
  };
  const project=data?.projects.find((p:Data)=>p.id===projectId);
  const claims=data?.claims.filter((c:Data)=>c.projectIds.includes(projectId))||[];
  const evidences=data?.evidence.filter((e:Data)=>claims.some((c:Data)=>c.evidenceIds.includes(e.id)))||[];
  const unlinked=data?.evidence.filter((e:Data)=>!data.claims.some((c:Data)=>c.evidenceIds.includes(e.id)))||[];
  const publicText=data?.publicTexts.find((p:Data)=>p.projectId===projectId);
  const publicStatus=data?.publicStatuses.find((p:Data)=>p.projectId===projectId);
  const scopedGaps=data?.gaps.filter((g:Data)=>g.id===projectId||claims.some((c:Data)=>c.id===g.id)||evidences.some((e:Data)=>e.id===g.id))||[];
  const pendingCount=evidences.filter((e:Data)=>!data?.grants.some((g:Data)=>g.id===e.id)).length;
  const openEditor=(kind:string,object:Data)=>{setNavOpen(false);setErr('');setEdit({kind,object:structuredClone(object),revision:data.revision});setDirty(false)};
  const closeEditor=()=>{setEdit(null);setDirty(false)};
  const saveEditor=()=>void act(async()=>{
    const saved=await api('save',{...edit});
    setData(saved);
    if(edit.kind==='project'&&!edit.object.id){
      const created=saved.projects.find((p:Data)=>!data.projects.some((old:Data)=>old.id===p.id));
      if(created){setSourceRoute(null);setReturnToSource(null);setProjectId(created.id);setQuery('');setTab('证据')}
    }
    if(edit.kind==='evidence'&&!edit.object.id){setTab('证据');setShowUnlinked(true)}
    setDirty(false);setEdit(null);
  },'已保存。原文件未修改。');
  const switchTab=(t:string)=>{setSourceRoute(null);setReturnToSource(null);setTab(t)};
  const returnToClaim=()=>{if(!sourceRoute)return;setReturnToSource(JSON.stringify([sourceRoute.claimId,sourceRoute.evidenceId]));setSourceRoute(null);setTab('结论')};
  const grantReview=(ids:string[]=[])=>void act(async()=>{const x=await api('grant-review');setGrants(x.items);setSelected(ids.filter(id=>x.items.some((e:Data)=>e.id===id)));setContent(false)},'');
  const gapAction=(g:Data)=>{
    const e=data.evidence.find((e:Data)=>e.id===g.id),c=data.claims.find((c:Data)=>c.id===g.id);
    if(e&&g.code==='GRANT_PENDING')return {label:'复核许可',run:()=>grantReview([e.id])};
    if(e)return {label:'编辑记录',run:()=>openEditor('evidence',e)};
    if(c)return {label:'编辑结论',run:()=>openEditor('claim',c)};
    return {label:'查看结论',run:()=>switchTab('结论')};
  };
  const chooseProject=(id:string)=>{if(dirty&&!confirm('编辑还未保存。确定切换项目？'))return;setSourceRoute(null);setReturnToSource(null);setProjectId(id);setEdit(null);setDirty(false);setNavOpen(false)};
  const field=(label:string,key:string,area=false)=>(
    <label className="form-field"><span>{fieldNames[label]||label}</span>{area
      ?<textarea aria-label={fieldNames[label]||label} aria-describedby={fieldHints[key]?'hint-'+key:undefined} value={edit.object[key]||''} onChange={e=>{setEdit({...edit,object:{...edit.object,[key]:e.target.value}});setDirty(true)}}/>
      :<input aria-label={fieldNames[label]||label} aria-describedby={fieldHints[key]?'hint-'+key:undefined} value={edit.object[key]||''} onChange={e=>{setEdit({...edit,object:{...edit.object,[key]:e.target.value}});setDirty(true)}}/>}{fieldHints[key]&&<small className="field-hint" id={'hint-'+key}>{fieldHints[key]}</small>}
    </label>
  );
  const listField=(label:string,key:string,items:{id:string;title:string}[])=>(
    <fieldset><legend>{label}</legend>{items.map(i=><label className="check" key={i.id}><input type="checkbox" checked={edit.object[key]?.includes(i.id)||false} onChange={e=>{const prev=edit.object[key]||[];setEdit({...edit,object:{...edit.object,[key]:e.target.checked?[...prev,i.id]:prev.filter((id:string)=>id!==i.id)}});setDirty(true)}}/><span>{i.id}<span className="check-title"> {i.title}</span></span></label>)}</fieldset>
  );
  const openPublic=()=>openEditor('public',publicText?{...publicText,actor:publicText.rights.actor,purpose:publicText.rights.purpose,expiresAt:publicText.rights.expiresAt,revoked:publicText.rights.revoked}:{projectId,publicTitle:'',publicRole:'',publicOutcome:'',publicLimits:'',publicLinks:[],publicAllowedDates:'',claimIds:[]});
  const readingStatus=(e:Data)=>{
    const grant=data.grants.find((g:Data)=>g.id===e.id);
    return e.revoked?{label:'已撤销',tone:'danger'}:grant?{label:grant.content?'正文已获准':'仅元数据',tone:'success'}:{label:'待复核',tone:'warning'};
  };
  const publicEditorTitle=edit?.kind==='public'?'公开文字':edit?.kind==='claim'?'人工结论':edit?.kind==='evidence'?'证据登记':'项目卡';
  const sourceLink=(claimId:string,id:string)=>{
    const evidence=data.evidence.find((e:Data)=>e.id===id),key=JSON.stringify([claimId,id]);
    return evidence?<button className="source-link" data-source-key={key} key={id} ref={el=>{if(el)sourceButtons.current.set(key,el);else sourceButtons.current.delete(key)}} aria-label={'查看出处 '+filename(evidence.locator)+'（'+id+'）'} onClick={()=>{setSourceRoute({claimId,evidenceId:id});setTab('证据')}}><span>{filename(evidence.locator)}</span><small>{id}</small></button>:<span key={id}>{id} · 出处不可用</span>;
  };

  return <div className={'app-shell'+(navOpen?' nav-open':'')}>
    <button className="nav-backdrop" tabIndex={-1} aria-hidden="true" onClick={()=>setNavOpen(false)}/>
    <aside ref={railRef} id="project-navigation" className="project-rail" role={mobile&&navOpen?'dialog':undefined} aria-modal={mobile&&navOpen?true:undefined} aria-label={mobile&&navOpen?'项目导航':undefined} inert={mobile&&!navOpen} onKeyDown={trapNavigation}>
      <div className="brand"><strong>证据工作台</strong><button className="icon-button nav-close" aria-label="关闭项目导航" onClick={()=>setNavOpen(false)}><Icon name="close"/></button></div>
      <div className="search-field"><Icon name="search" size={16}/><input ref={searchRef} aria-label="查找项目" placeholder="查找项目" maxLength={200} value={query} onChange={e=>setQuery(e.target.value)}/>{query?<button className="search-clear" aria-label="清空项目搜索" onClick={()=>{setQuery('');searchRef.current?.focus()}}><Icon name="close" size={13}/></button>:<kbd>/</kbd>}</div>
      <div className="rail-section"><span>项目</span><span>{data?.projects.length||0}</span></div>
      <nav aria-label="项目">
        {data?.projects.filter((p:Data)=>p.title.includes(query)).map((p:Data)=>{
          return <button className={'project-item'+(projectId===p.id?' selected':'')} aria-current={projectId===p.id?'page':undefined} key={p.id} onClick={()=>chooseProject(p.id)}><span className="project-text"><span>{p.title}</span><small>{projectType(p.type)} · {p.fictional?'虚构示例':'资料待核'}</small></span><span className="project-marker" aria-hidden="true"><Icon name="chevron" size={13}/></span></button>;
        })}
        {data&&query&&!data.projects.some((p:Data)=>p.title.includes(query))&&<p className="search-empty">没有匹配的项目</p>}
      </nav>
      {data&&<button className="add-project" onClick={()=>openEditor('project',{title:'',type:'UNKNOWN',navigation:'',fictional:true})}><Icon name="plus" size={16}/>新建项目卡</button>}
      <div className="rail-bottom"><span className="local-dot"/>本机工作区<span className="quiet">0.1.0</span></div>
    </aside>

    <main className="workspace" aria-busy={busy} inert={mobile&&navOpen}>
      {mobile&&<div className="work-topbar"><button ref={menuRef} className="text-button mobile-menu" aria-label="打开项目导航" aria-controls="project-navigation" aria-expanded={navOpen} onClick={()=>setNavOpen(true)}><Icon name="menu" size={16}/>项目</button><div className="save-state"><span className={dirty?'dirty-dot':'saved-dot'}/>{dirty?'编辑未保存':'已保存'}<span className="revision">r{data?.revision??'—'}</span></div></div>}
      {busy&&<div className="busy-line" role="progressbar" aria-label="正在处理"/>}
      <header className="project-header">
        <div><div className="title-row"><h1>{project?.title||'项目资料'}</h1>{project&&<span className="badge neutral">{project.fictional?'虚构示例':'资料索引'}</span>}<button className="icon-button project-edit" aria-label="编辑项目" disabled={!project} onClick={()=>openEditor('project',project)}><Icon name="edit"/></button></div><p className="project-description">{project?.navigation||(project?'还没有项目说明，可在项目卡中补充。':'从启动入口打开本机工作区。')}</p></div>
        <div className="project-tools">{!mobile&&<div className="save-state"><span className={dirty?'dirty-dot':'saved-dot'}/>{dirty?'编辑未保存':'已保存'}<span className="revision">r{data?.revision??'—'}</span></div>}<div className="header-actions"><button className="text-button" disabled={!data||busy} onClick={()=>grantReview()}><Icon name="lock" size={16}/>许可复核</button><button className="button primary" disabled={!data||busy||!evidences.length} onClick={()=>void act(()=>api('check',{ids:evidences.map((e:Data)=>e.id)}),'检查完成，读取记录与缺口已更新。')}><Icon name="inspect" size={16}/>{busy?'正在处理':'检查本项目引用'}</button></div></div>
      </header>
      {err&&!edit&&!grants&&<div role="alert" className="notice error"><Icon name="alert"/><div>{err}<small>核对提交状态后再决定下一步。</small></div><button className="icon-button" aria-label="关闭错误提示" onClick={()=>setErr('')}><Icon name="close" size={15}/></button></div>}
      {note&&<div role="status" className="notice success"><Icon name="check" size={17}/><span>{note}</span><button className="icon-button" aria-label="关闭操作提示" onClick={()=>setNote('')}><Icon name="close" size={15}/></button></div>}

      {!data?<div className="loading-surface"><div className="skeleton-line"/><div className="skeleton-line short"/><section className="empty-state"><Icon name="lock" size={28}/><h2>打开本机工作区</h2><p>双击「启动工作台.command」。若启动异常，请查看运行与恢复说明。</p><button className="button secondary" onClick={()=>void act(refresh,'已刷新')}>重新读取</button></section></div>:<>
      <div className="tab-scroll"><div className="tabs" ref={tabRef} role="tablist" aria-label="项目资料视图">
        {tabs.map((t,i)=><button key={t} role="tab" aria-label={t} id={'tab-'+i} aria-selected={tab===t} aria-controls="work-panel" tabIndex={tab===t?0:-1} onClick={()=>switchTab(t)} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const index=(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;switchTab(tabs[index]);tabRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[index].focus()}}}>{t}{t==='缺口'&&scopedGaps.length>0&&<span className="tab-gap">{scopedGaps.length}</span>}</button>)}
        <span className="tab-indicator" aria-hidden="true" style={{transform:'translateX('+indicator.left+'px) scaleX('+indicator.width+')'}}/>
      </div></div>

      <div className="work-grid">
        <div id="work-panel" role="tabpanel" aria-labelledby={'tab-'+tabs.indexOf(tab)} className="panel" key={tab}>
        {tab==='证据'&&<section>
          {sourceRoute&&<button className="text-button source-return" onClick={returnToClaim}><Icon name="back" size={14}/>返回结论</button>}
          <div className="section-head"><div><h2>项目文件</h2></div><button className="button secondary" onClick={()=>openEditor('evidence',{locator:'',purpose:'',type:'摘要',sourceDate:'',productVersion:'',confirmer:'',position:''})}><Icon name="plus" size={16}/>登记精确文件</button></div>
          {evidences.length>0&&<div className="list-caption"><span>{evidences.length} 个关联文件</span><span>{evidences.length===0?'等待关联文件':pendingCount?'待复核 '+pendingCount+' 项':'当前会话已复核许可'}</span></div>}
          {evidences.length===0&&unlinked.length===0&&<div className="empty-state quiet-empty"><h3>还没有关联文件</h3><p>先登记文件，再在结论中选择它作为出处。</p></div>}
          <div className="evidence-list">{evidences.map((e:Data)=>{
            const read=readingStatus(e);
            return <article className="evidence-row" key={e.id} data-located={sourceRoute?.evidenceId===e.id||undefined} ref={el=>{if(el)evidenceRows.current.set(e.id,el);else evidenceRows.current.delete(e.id)}}>
              <div className="file-row"><span className="file-icon"><Icon name="file" size={21}/></span><div className="file-heading"><h3>{filename(e.locator)}</h3><p>{e.purpose}</p></div><span className={'badge '+read.tone}>{read.label}</span><button className="icon-button" aria-label={'编辑证据 '+e.id} onClick={()=>openEditor('evidence',e)}><Icon name="edit" size={16}/></button></div>
              <div className="evidence-meta"><span>{e.id}</span><span>{e.type}</span><span>{e.sourceDate||'日期未知'}</span><span>{e.productVersion||'版本未知'}</span><span>{dateLabel(e.lastVerifiedAt)}</span></div>
              <details className="source-details"><summary><Icon name="link" size={14}/><span>位置与读取记录</span><Icon name="down" size={14}/></summary><div className="detail-content"><code className="locator">{e.locator}#{e.position||'未定位'}</code><dl><div><dt>来源日期</dt><dd>{e.sourceDate||'日期未知'}</dd></div><div><dt>读取覆盖</dt><dd>{e.hash?'已记录内容校验值':'仅登记，正文尚未核对'}</dd></div><div><dt>原记录确认人</dt><dd>{e.confirmer||'确认人未知'}</dd></div><div><dt>最后复核</dt><dd>{e.lastVerifiedAt||'未复核'}</dd></div></dl><div className="row-footer"><span className="help-text">撤销后停止后续读取，原记录保留。</span><button className="text-button danger" onClick={()=>void act(()=>api('revoke',{id:e.id,revision:data.revision}),'读取许可已撤销，原记录与旧导出包保留。')}>撤销读取</button></div></div></details>
              {e.excerpt&&<details className="source-details"><summary><Icon name="file" size={14}/><span>原件摘录 · {e.position||'位置未知'}</span><Icon name="down" size={14}/></summary><div className="detail-content"><pre>{e.excerpt}</pre><p className="help-text">{e.revoked||!data.grants.some((g:Data)=>g.id===e.id)?'历史片段；当前读取未放行，不能用于新导出。':'摘录是出处，不是软件对业务结果的验收。'}</p></div></details>}
            </article>;
          })}</div>
        {unlinked.length>0&&<details className="unlinked-files" open={showUnlinked} onToggle={e=>setShowUnlinked(e.currentTarget.open)}><summary><span>待关联文件 <span className="badge neutral">{unlinked.length}</span></span><Icon name="down" size={14}/></summary><p className="help-text">全工作区中尚未被结论引用的文件。建立引用后才会出现在对应项目中。</p>{unlinked.map((e:Data)=><div className="unlinked-row" key={e.id}><Icon name="file" size={18}/><div><h3>{filename(e.locator)}</h3><p>{e.purpose}</p><small>{e.id} · {e.sourceDate||'来源日期未知'}</small></div><div className="unlinked-actions"><button className="text-button" onClick={()=>openEditor('claim',{text:'',projectIds:[projectId],dimension:'本地',evidenceIds:[e.id],recordedResult:'UNKNOWN',limits:''})}>建立结论引用<Icon name="chevron" size={13}/></button><button className="icon-button" aria-label={'编辑待关联证据 '+e.id} onClick={()=>openEditor('evidence',e)}><Icon name="edit" size={15}/></button></div></div>)}</details>}
        </section>}
        {tab==='结论'&&<section><div className="section-head"><div><h2>结论与出处</h2></div><button className="button secondary" onClick={()=>openEditor('claim',{text:'',projectIds:[projectId],dimension:'本地',evidenceIds:[],recordedResult:'UNKNOWN',limits:''})}><Icon name="plus" size={16}/>添加结论</button></div><div className="claim-list">{claims.length===0&&<div className="empty-state quiet-empty"><h3>还没有结论</h3><p>写下结论，再选择支持它的文件。</p></div>}{claims.map((c:Data)=><article className="claim-row" key={c.id}><div className="claim-top"><span className="dimension">{c.dimension}</span><span className="recorded-result">{c.recordedResult==='UNKNOWN'?'结果未知':'据记录：'+c.recordedResult}</span><button className="icon-button" aria-label={'编辑关联 '+c.id} onClick={()=>openEditor('claim',c)}><Icon name="edit" size={16}/></button></div><h3>{c.text}</h3><p>{c.limits}</p><div className="claim-links"><Icon name="link" size={14}/>{c.evidenceIds.length?c.evidenceIds.map((id:string)=>sourceLink(c.id,id)):<span>尚未关联出处</span>}</div></article>)}</div></section>}
        {tab==='公开文字'&&<section><div className="section-head"><div><h2>公开文字预览</h2></div><button className="button secondary" onClick={openPublic}><Icon name="edit" size={16}/>编辑公开文字</button></div><div className={'inline-state '+(publicStatus?.valid?'valid':'pending')}><Icon name={publicStatus?.valid?'check':'lock'} size={16}/><span>{plainMessage(publicStatus?.message||'USER_PENDING：尚无公开文字')}</span></div>{publicText&&<div className="public-document"><h2>{publicText.publicTitle}</h2><dl><div><dt>角色</dt><dd>{publicText.publicRole}</dd></div><div><dt>结果</dt><dd>{publicText.publicOutcome}</dd></div><div><dt>局限</dt><dd>{publicText.publicLimits}</dd></div></dl>{publicText.publicLinks.map((l:string)=><p key={l}>{l}</p>)}<footer>文字 r{publicText.revision} · 许可 r{publicText.rightsRevision} · {publicText.rights.actor||'尚未许可'}</footer></div>}<div className="approval-row"><label className="form-field">本次确认人<input disabled={busy} value={actor} onChange={e=>setActor(e.target.value)}/></label><button className="button primary" disabled={busy||!publicText} onClick={()=>void act(()=>api('approve',{projectId,actor,revision:data.revision}),'本会话公开文字已核准，仅指定用途；虚构 actor 不代表真实许可')}><Icon name="check" size={16}/>确认这版文字可公开</button></div><p className="help-text">文字、引用或许可发生变化后，核准失效。虚构确认人只用于软件样例。</p></section>}
        {tab==='缺口'&&<section><div className="section-head"><div><h2>待补核事项</h2></div><span className="badge warning">{scopedGaps.length} 项</span></div>{scopedGaps.length===0?<div className="empty-state quiet-empty"><h3>本轮未发现缺口</h3><p>仅限已检查范围，不代表业务结果已验收。</p></div>:<div className="gap-list">{scopedGaps.map((g:Data,i:number)=>{const action=gapAction(g);return <div className="gap-row" key={i}><span className="gap-symbol"><Icon name={g.code==='CONFLICTING_SOURCES'?'alert':'clock'} size={16}/></span><div className="gap-content"><span className="gap-label">{g.id}{g.dimension?' · '+g.dimension:''}</span><p>{plainMessage(g.message)}</p></div><div className="gap-actions"><button className="text-button" disabled={busy} onClick={action.run}>{action.label}<Icon name="chevron" size={13}/></button></div></div>})}</div>}</section>}
        {tab==='导出与恢复'&&<section><div className="section-head"><div><h2>导出与恢复</h2></div></div><div className="export-actions"><div><Icon name="download" size={20}/><div><h3>内部恢复包</h3><p>整个工具状态、关系和许可历史。</p></div><button className="button secondary" disabled={busy} onClick={()=>void act(()=>api('export',{mode:'internal',projectIds:data.projects.map((p:Data)=>p.id)}),'内部包已完成；下载后可恢复到新数据根')}>生成内部恢复包</button></div><div><Icon name="file" size={20}/><div><h3>本项目公开包</h3><p>已核准的白名单文字，不含内部资料。</p></div><button className="button primary" disabled={busy} onClick={()=>void act(()=>api('export',{mode:'public',projectIds:[projectId]}),'公开文字包已完成；每次新下载仍复核许可')}>生成本项目公开包</button></div></div><h3 className="subsection-title">导出记录</h3><div className="packages">{exports.length===0&&<p className="help-text">尚无导出包。生成完整包后，下载入口会出现在这里。</p>}{exports.map(e=><article key={e.exportId}><Icon name={e.privacyMode==='public'?'file':'download'} size={18}/><div><strong>{e.privacyMode==='public'?'公开文字':'内部恢复'} · {exportStatus(e.status)}</strong><small>{dateLabel(e.createdAt)} · {e.exportId.slice(0,8)}</small></div>{e.status==='COMPLETED'&&<button className="button secondary small" onClick={()=>void act(async()=>{const r=await fetch('/api/download/'+e.exportId);if(!r.ok){const x=await r.json();throw Error(x.error.message)}const bundle=await r.json();localDownload('evidence-'+e.privacyMode+'-'+e.exportId+'.json',JSON.stringify(bundle,null,2))},'实际包已下载；旧副本不能追回')}><Icon name="download" size={14}/>下载实际包</button>}</article>)}</div><div className="restore-area"><h3>恢复为独立副本</h3><p>原数据根与原包保留，历史许可不会自动激活。</p><label className="upload-control"><Icon name="file" size={17}/><span>内部包文件</span><input type="file" accept=".json" aria-label="内部包文件" onChange={e=>{const file=e.target.files?.[0];if(file)void act(async()=>{const bundle=JSON.parse(await file.text());const name='restore-'+Date.now();const x=await api('restore',{bundle,name});return '已恢复新根：'+x.root+'。历史许可失效；运行 node scripts/start.mjs '+name},'恢复完成，原根与原包未改')}}/></label></div></section>}
          <details className="project-notes" key={projectId}><summary><span>项目说明与记录</span><Icon name="down" size={14}/></summary><div className="notes-content"><div className="notes-grid"><div><h3>项目记录</h3><dl><div><dt>项目类型</dt><dd>{project&&projectType(project.type)}</dd></div><div><dt>公开状态</dt><dd className={publicStatus?.valid?'status-valid':'status-pending'}>{publicStatus?.valid?'当前会话已核准':'待核准'}</dd></div></dl><details className="context-help"><summary><Icon name="lock" size={14}/>使用边界<Icon name="down" size={14}/></summary><p>文件能读、结果已验收与允许公开分别记录。冷启动不恢复历史放行；虚构示例不代表真实交付。缺口提示不代表业务失败。</p></details></div><div><h3>工作区最近修改</h3>{data.history.length===0?<p className="help-text">尚无编辑或复核记录。</p>:<ol className="activity-list">{data.history.slice(-4).reverse().map((h:Data)=><li key={h.revision}><span className="activity-dot"/><div><p>{h.action==='check'?'检查原件':h.action==='grant'?'确认读取范围':h.action==='revoke'?'撤销读取':h.action==='approve'?'核准公开文字':h.action.startsWith('save-')?'保存编辑':h.action}</p><small>{dateLabel(h.at)} · r{h.revision}</small></div></li>)}</ol>}</div></div></div></details>
        </div>
      </div></>}

      {grants&&<Drawer pending={busy} title="许可复核" subtitle="核对精确文件、用途和版本后再确认。" error={err} errorHelp="核对所选文件、读取范围和版本后再确认。" onClose={()=>setGrants(null)}>
        <div className="drawer-body"><div className="selection-toolbar"><span>已选 {selected.length} / {grants.length}</span><button className="text-button" disabled={busy} onClick={()=>setSelected(grants.filter(e=>!e.revoked).map(e=>e.id))}>选择原清单中未撤销项</button></div>{grants.map(e=><label className="grant-item" key={e.id}><input type="checkbox" disabled={busy} checked={selected.includes(e.id)} onChange={x=>setSelected(x.target.checked?[...selected,e.id]:selected.filter(id=>id!==e.id))}/><span><b>{e.id} · {e.purpose}</b><span className="grant-filename">{filename(e.locator)}</span><small>{e.productVersion||'版本未知'} · {e.sourceDate||'日期未知'}</small><details><summary>路径与已有范围</summary><code>{e.locator}</code><p>{e.previousFingerprint?'已有登记身份；服务器逐项核对差异。':'首次登记身份待核。'}{e.revoked?' 已撤销，需单独复核。':''}</p></details></span></label>)}<div className="scope-choice"><label className="check"><input type="checkbox" disabled={busy} checked={content} onChange={e=>setContent(e.target.checked)}/><span>明确准许所选普通文本正文读取；否则仅元数据</span></label><p>不勾选时不会读取正文。批量确认仍逐项记录。</p></div><label className="form-field">确认人<input disabled={busy} value={actor} onChange={e=>setActor(e.target.value)}/></label></div><div className="drawer-footer"><button className="button secondary" disabled={busy} onClick={()=>setGrants(null)}>取消</button><button className="button primary" disabled={busy||!selected.length} onClick={()=>void act(async()=>{await api('grant',{ids:selected,content,actor,revision:data.revision});setGrants(null)},'许可已逐项记录；现在可检查引用')}><Icon name="check" size={16}/>确认所选范围与用途</button></div>
      </Drawer>}
      {edit&&<Drawer pending={busy} title={'编辑'+publicEditorTitle} subtitle={(dirty?'有未保存的修改':'当前编辑')+' · r'+edit.revision} error={err} onClose={closeEditor} canClose={()=>!dirty||confirm('编辑还未保存。确定关闭？')}>
        <div className="drawer-body"><fieldset className="editor-fields" disabled={busy} aria-label="编辑字段">
          {edit.kind==='project'&&<>{field('内部项目标题','title')}{field('类型 / 归属','type')}{field('项目导航说明','navigation',true)}</>}
          {edit.kind==='evidence'&&<><section className="form-section"><h3>文件与用途</h3>{field('精确文件绝对路径','locator')}{field('用途 / 读取范围','purpose')}</section><section className="form-section"><h3>来源信息</h3><div className="form-columns">{field('来源类型（原件/摘要/自述/Mock）','type')}{field('来源日期（未知留空）','sourceDate')}</div><div className="form-columns">{field('具体产品版本','productVersion')}{field('原件位置 / 行号','position')}</div></section><section className="form-section"><h3>记录确认</h3>{field('原记录确认人（不是数字签名）','confirmer')}<p className="help-text">保存登记后仍需复核读取许可；不会自动读取正文。</p></section></>}
          {edit.kind==='claim'&&<>{field('结论文字','text',true)}<div className="form-columns"><label className="form-field">事实维度<select value={edit.object.dimension} onChange={e=>{setEdit({...edit,object:{...edit.object,dimension:e.target.value}});setDirty(true)}}>{dimensions.map(d=><option key={d}>{d}</option>)}</select></label>{field('记录中的结果','recordedResult')}</div>{field('限制 / 未覆盖','limits',true)}{listField('关联项目','projectIds',data.projects.map((p:Data)=>({id:p.id,title:p.title})))}{listField('关联证据（不重复登记）','evidenceIds',data.evidence.map((e:Data)=>({id:e.id,title:e.purpose})))}</>}
          {edit.kind==='public'&&<>{field('公开标题','publicTitle')}{field('我负责的部分','publicRole',true)}{field('成果描述','publicOutcome',true)}{field('范围与限制','publicLimits',true)}{field('允许日期（不填充历史未知）','publicAllowedDates')}<h3 className="form-divider">用途许可</h3>{field('许可确认人（虚构示例用 fixture-owner）','actor')}{field('许可用途','purpose')}{field('许可截止日期（可留空）','expiresAt')}{listField('公开结论引用','claimIds',claims.map((c:Data)=>({id:c.id,title:c.text})))}<label className="check"><input type="checkbox" checked={!!edit.object.revoked} onChange={e=>{setEdit({...edit,object:{...edit.object,revoked:e.target.checked}});setDirty(true)}}/>撤销公开许可</label></>}
        </fieldset></div>
        <div className="drawer-footer"><button className="text-button" onClick={()=>{localDownload('未保存自有编辑.txt',JSON.stringify(edit.object,null,2));setNote('已下载当前自有编辑，非证据包')}}><Icon name="download" size={15}/>下载未保存文本</button><button ref={saveRef} className="button primary" aria-label={busy?"正在保存":"保存提交"} aria-keyshortcuts="Meta+S Control+S" disabled={busy} onClick={saveEditor}>{busy?<span className="button-spinner" aria-hidden="true"/>:<Icon name="check" size={16}/>}<span>{busy?"正在保存":"保存提交"}</span>{!busy&&<kbd className="save-shortcut" aria-hidden="true">⌘S</kbd>}</button></div>
      </Drawer>}
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
