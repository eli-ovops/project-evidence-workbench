# 项目资料页 · UI修订7

2026-10-12 21:46（Asia/Shanghai）。用户明确反馈“整体还是后台模板”，要求继续用skills打磨布局/细节与自然动效。使用impeccable distill/Operate及motion-design；保留浅色精密工作台、当前唯一Owner与本地代码授权。

本轮改结构：216px轻项目索引，居中且最多1040px的单列资料页；桌面去掉面包屑顶栏和常驻概况/下一步/活动栏。保存与检查靠近标题，五个视图用纯文字，只保留缺口计数。取消项目图标和重复结论计数、章节套话。文件日期、类型、版本和复核信息放同一行，取消每行外露的红色撤销按钮；撤销保留在“位置与读取记录”展开区并真实验证可用。

项目类型、公开状态、工作区最近修改与使用边界由“项目说明与记录”展开访问，移动端同样可达；修改记录明确是全工作区历史。原自动“下一步”建议撤下，其操作已由检查、许可、缺口、公开与结论视图承接。没有删除数据或业务能力。公开文字改为平整阅读区域。去掉技术腔反馈与重复说明，必要的虚构/未知、读取/公开限制保留。

## 验证与回执

TypeScript/Vite构建通过。指纹 af1b9f8f7e12db692bb5fbcf09cff7a7564978e1c48cdad232229e22adca8662，VERSION.json 23项；UI6清单已保留。后端源码与build/server逐项hash不变，六套最终验证后再次核全部应用hash一致。当前原件绑定：evidence/rev2/ui-revision7-verification.json。

- notebook 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/notebook-1791812373390/receipt.json
- craft 9项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/craft-after-1791812373300/receipt.json
- completion 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/completion-1791812373345/receipt.json
- interaction 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/interaction-1791812373348/receipt.json
- workflow 9项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/workflow-1791812373307/receipt.json
- browser 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791812373300/receipt.json

新增notebook7项涵盖单列结构、收起低频动作后的实际撤销、公开状态/全工作区历史/边界仍可达、结论视图、390px说明单列、320px切换、减少动效。原有保存/许可/检查、公开与内部实际下载、恢复、权限拒绝、撤销、重启许可不复活与失败保编辑/快捷键/导航均通过。主链仅同步摘录与检查反馈的可见文案选择器，功能断言保留。

动效采用cubic-bezier(.22,.61,.36,1)：tab180ms只移动指示线，正文不入场；文件与项目说明220ms展开；抽屉230ms入/160ms出，位移14px。实际详情高度33→82→127→269px，指示线0→112px；记录包含中间帧。这是行为证据，不是FPS或性能基准。

新检查发现原来的reduce规则没有命中details-content伪元素，失败原件保留在notebook-1791812029114；补明确规则后，当前原生展开/标签过渡为0s，抽屉无动画。两批定向视觉检查后收口，类型/布局扫描0，原件在.impeccable/review/notebook-type-final.json、notebook-layout-final.json；未再追加审美巡检。

## 文件与限制

修改app/main.tsx、app/style.css及dist；新增tests/ui-notebook.mjs；tests/browser.mjs仅同步用户可见的摘录/检查文字。新增本报告、ui-revision7-verification.json、UI6清单；更新DESIGN/sidecar/表面方向、STATUS与DELIVERY。

合成根、截图、运行文件和原始回执的精确绝对路径见以上artifactRoot与syntheticSource，留存供排障和审阅；无删除/清理。真实Chrome独立上下文，测试服务停止；现有data/demo未用于测试写入。无新依赖、真实材料/媒体/模型、生产/外发/Git或其他Owner修改。

本轮同会话复核，非独立设计/全WCAG或业务验收。窄浏览器非真机，其他引擎详情插值未核，原生fallback保留。用户真实审美判断仍待本人使用新版。
