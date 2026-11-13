# 操作路径完善 · UI修订5

2026-10-12。接续用户“继续完善”，保持现有浅色精密工作台，使用既有impeccable Operate/harden指导。唯一Owner当前会话，只改本地UI。

新建项目保存后选择新卡，清除会藏起它的搜索。登记后的未关联文件留在全工作区清单，保存后展开；“建立结论引用”预选当前项目和该文件，仍需本人写结论并提交，不自动关联或放行读取。引用完成后进入项目证据列表，不重复登记。

导航在固定高度内独立滚动，搜索、新建和本机状态保持可见。保存时展示正在保存并锁住输入/关闭；同步提交锁阻止重复按钮与快捷键。失败恢复编辑。空项目提示先添加结论，待关联文件出现在首屏；未知类型中文显示，源值仍为UNKNOWN。

## 验证

类型检查/Vite构建通过。源码/构建指纹 ff276d0f8f1c07eeb1e51fad10787477bcce1b94b8fcc6d286215c2b995ae83f，共23项；四套验证后再次核文件hash一致。UI4清单保留，后端源码/构建逐项hash不变。版本绑定见evidence/rev2/ui-revision5-verification.json。

- completion 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/completion-1791806807931/receipt.json
- interaction 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/interaction-1791806807934/receipt.json
- workflow 9项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/workflow-1791806807934/receipt.json
- browser 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791806807935/receipt.json

新增7组检查涵盖新项目定位、登记可见且无隐式关联/放行、显式引用不重复登记、暂缓真实save时防编辑/关闭/重复、24项目导航及最后项目/新建可达、空结论下一步、390px/1440px使用。首轮与确认轮定向截图已检查，修正空提示占满首屏的问题后停止微调。

初次旧版新项目选择失败保留在completion-1791806425811。completion-1791806548580测试误用隐藏目录作为合成文件路径，被原有保护正确拒绝；未修改保护规则，后续使用另一份新建允许的普通文本样例。completion-1791806686548测试POST缺Origin被正确拒绝，按既有同源测试协议补Origin；交互测试读取tab属性时尚未完成更新，改为等待同一目标选中后断言，未删断言或改动作。所有失败原件保留。文档脚本首次误调用python发生编码解析失败、未写入，改用已验证python3完成。

## 文件与边界

改app/main.tsx、app/style.css及dist；新增tests/ui-completion.mjs；tests/ui-interaction.mjs只补异步选中等待。新增本报告、ui-revision5-verification.json、UI4清单；更新DESIGN/STATUS/DELIVERY。合成输入与运行根/截图的精确绝对路径见原件artifactRoot和syntheticSource字段，保留供排障和审阅，无删除/清理。

真实Chrome独立上下文，只用新合成根。测试服务已停止；现有data/demo未用于测试写入。无新依赖、真实资料/媒体/生产/外发/Git或其他Owner修改。390px非真机，延迟请求非网络性能证明；非独立第三方审查、全WCAG或业务验收。实际审美体验仍待本人使用判断。
