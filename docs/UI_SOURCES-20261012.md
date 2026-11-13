# 出处导航与空状态 · UI修订8

2026-10-12 22:32（Asia/Shanghai）。用户继续既有UI打磨。沿用impeccable distill/Operate与现有浅色项目资料页，单Owner，仅本地前端。

结论出处从纯ID变成文件名加ID的可用按钮；键盘或指针激活后定位到准确文件、展开读取记录，并将焦点移到该记录。返回结论时恢复原引用焦点，两个结论引用同一文件也能区分。使用元素引用与元组键，不拼接不可信选择器。定位是临时视图状态，不写权限/数据或持久化，刷新不承诺恢复该定位。

手动切换项目或成功新建项目清掉旧出处上下文。空文件/结论/缺口用简短左对齐提示，取消大图标与重复零计数；无关联文件时检查按钮禁用，原登记/结论入口保留。文件名、用途、限制允许折行；出处图标与长文件名对齐，保留证据ID。

## 当前验证

TypeScript/Vite构建通过。指纹 afaffec6462da02eeab0956d86127edba5c0a93e463029206c8d708f67cc2ecf，VERSION共23项；UI7清单保留。后端源码/build/server逐项hash未变，七套最终验证后复核全部应用hash一致。绑定在evidence/rev2/ui-revision8-verification.json。

- sources 6项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/sources-1791815083703/receipt.json
- notebook 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/notebook-1791815225569/receipt.json
- craft 9项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/craft-after-1791815226720/receipt.json
- completion 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/completion-1791815083711/receipt.json
- interaction 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/interaction-1791815225581/receipt.json
- workflow 9项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/workflow-1791815225568/receipt.json
- browser 7项/组 PASS：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791815083709/receipt.json

专项6组涵盖精确E3定位/打开但revision与grants不变、同文件不同结论的返回焦点、切换项目清理、320px长文件名/无断点用途和限制、减少动效、空列表/禁用空检查与在出处上下文中成功新建项目后清理返回入口。新输入全为明确虚构，长文件仍是允许的普通文本样例。

检查时发现新建项目分支未清掉定位；sources-1791814858144先实际失败（返回结论数1，期望0），补两个前端状态清理后当前专项通过，未删除断言。失败现场保留。出处快照先等原生展开完成再获取，避免把动画中的裁切当作最终状态。两轮定向视觉确认后没有继续审美微调；随后只处理并回归这个状态边界。

原有notebook、字体/动效、导航/保存/失败保编辑/快捷键、真实下载/恢复、权限与撤销/冷启动回归均通过。布局机械扫描0，原件.impeccable/review/sources-layout-final.json。没有新增动画编排或资料读取。

## 文件与边界

改app/main.tsx、app/style.css及dist；新增tests/ui-sources.mjs、本报告、ui-revision8-verification.json、UI7版本清单；更新DESIGN/sidecar/表面说明、STATUS、DELIVERY。合成根/截图/运行文件精确位置见各artifactRoot，输入路径见syntheticSource；失败现场与历史原件保留供恢复/审阅，无清理删除。

测试均新合成根，Chrome独立上下文，服务停止。现有data/demo未用于测试写入，无真实材料/媒体/外部模型/生产/外发/Git或其他Owner修改，无新依赖。窄窗口非真机；同会话技术复核非独立设计验收、全WCAG或业务验收。用户实际体验仍待使用新版判断。
