import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {APP,State} from './model.js';
export async function createFixtures(root:string,now:string):Promise<State>{
 await mkdir(root,{recursive:true});
 const files:Record<string,string>={'local-receipt.txt':'明确虚构合成记录，非客户或真实产品\n本地 demo-1 人工记录通过；设备、商业结果 UNKNOWN\n','role-note.txt':'虚构团队分工：fixture-owner 参与样式检查，非独立交付。\n','release-note.txt':'虚构发布记录：demo-1 未发布。另一旧记录称已发布，待核。\n','mock-note.txt':'明确虚构录单原型，仅 Mock，无 OCR/模型/客户验收。\n'};
 for(const [name,text] of Object.entries(files))await writeFile(path.join(root,name),text,{flag:'wx'});
 const evidence=Object.keys(files).map((name,i)=>({id:`E${i+1}`,locator:path.join(root,name),purpose:'虚构验收夹具，精确文件',type:i===1?'自述':i===3?'Mock':'原件',sourceDate:i===3?null:'2026-01-02',productVersion:i===3?'demo-0':'demo-1',confirmer:'fixture-owner',position:i===0?'L2':'L1',excerpt:'',lastVerifiedAt:null,revision:1,revoked:false}));
 const projects=[{id:'P-demo-1',title:'虚构单人库存练习',type:'个人主导'},{id:'P-demo-2',title:'虚构团队官网',type:'团队参与'},{id:'P-demo-3',title:'虚构录单原型',type:'只有原型'}].map(p=>({...p,navigation:'虚构案例，非真实项目',fictional:true,revision:1}));
 const claims=[{id:'C1',projectIds:['P-demo-1'],dimension:'本地' as const,text:'据虚构记录，本地练习通过',evidenceIds:['E1'],recordedResult:'通过',limits:'非软件验证，不推导真实客户/商业成果',revision:1},{id:'C2',projectIds:['P-demo-1'],dimension:'设备' as const,text:'设备未验证',evidenceIds:['E1'],recordedResult:'UNKNOWN',limits:'本地记录不是设备证据',revision:1},{id:'C3',projectIds:['P-demo-2'],dimension:'职责' as const,text:'仅参与样式检查',evidenceIds:['E2'],recordedResult:'UNKNOWN',limits:'自述，非独立交付',revision:1},{id:'C-release-old',projectIds:['P-demo-2'],dimension:'发布' as const,text:'旧摘要称已发布',evidenceIds:['E3'],recordedResult:'通过',limits:'与同维度新记录冲突，不自动选择',revision:1},{id:'C-release-new',projectIds:['P-demo-2'],dimension:'发布' as const,text:'新记录称未发布',evidenceIds:['E3'],recordedResult:'未验证',limits:'并列保留',revision:1},{id:'C4',projectIds:['P-demo-3'],dimension:'本地' as const,text:'仅虚构 Mock 原型',evidenceIds:['E4'],recordedResult:'Mock',limits:'没有 OCR、模型或客户结果',revision:1}];
 const publicTexts=projects.map((p,i)=>({projectId:p.id,publicTitle:p.title,publicRole:p.type,publicOutcome:i===2?'仅 Mock 原型':i===1?'参与样式检查':'本地合成流程演示',publicLimits:'明确虚构，不代表真实成果或许可。',publicLinks:[],publicAllowedDates:'',claimIds:i===0?['C1']:i===1?['C3']:['C4'],revision:1,rightsRevision:1,rights:{actor:'',purpose:'案例文字展示',expiresAt:null,revoked:false}}));
 return {schemaName:APP,schemaVersion:1,rootId:randomUUID(),revision:0,createdAt:now,restored:false,fixtureRoot:root,projects,evidence,claims,publicTexts,history:[],grantHistory:[]};
}
