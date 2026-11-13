# 工作流收尾 · UI修订4

2026-10-12，Asia/Shanghai。继续本地UI工作，沿用用户选定的浅色精密工作台。使用既有impeccable Operate/harden方向；未新增视觉方向、依赖或业务范围。

本轮让项目操作连续：同一浏览器标签页刷新保留项目、视图和搜索条件；搜索可一键清空。缺口行直接打开对应记录/结论；读取许可入口只预选相应文件，正文许可默认未勾选，也不自动激活许可。编辑支持⌘S / Ctrl+S，与显式保存按钮共用提交路径。

只把projectId/tab/query存入按rootId隔离的sessionStorage，最大200字符；不保存正文、草稿、读取或公开许可。无效偏好回到首个项目/证据页/空搜索。仅承诺同标签页刷新，不承诺服务器重启后新端口或跨浏览器延续。

## 验证

唯一Owner本会话。类型检查与Vite构建通过。源码/构建指纹 `1f7bf924714da1718716b227adc883f14a25361763f26060b30b9bdef4e09638`，23项清单在VERSION.json，UI3清单保留在ui-revision3-version.json。后端逐文件指纹与UI3一致。

- 工作流9/9：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/workflow-1791805166974/receipt.json。涵盖刷新恢复、搜索清空、精确许可定位且不隐式放行、结论定位、未知日期不填今天、两种快捷保存、无效偏好回退、390px缺口操作。
- 交互7/7：/Volumes/EXTERNAL/FDE/project-evidence-workbench/.impeccable/review/interaction-1791805134714/receipt.json。涵盖导航焦点/背景inert、搜索、tabs、抽屉内校验、实际保存、已提交后刷新失败、离线保编辑。
- 主流程7组：/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791805134685/receipt.json。包括编辑/读取/检查、真实下载与新根恢复、会话/匿名请求/权限隔离、窄屏、撤销公开许可、停止重启不复活历史许可。

真实Chrome路径为 /Applications/Google Chrome.app/Contents/MacOS/Google Chrome，合成独立上下文。390px是窄浏览器证据，非真机。三套测试均退出0；服务在finally停止，没有改用户现有data/demo或浏览器profile。

初次刷新回退失败保留在workflow-1791804696714。随后许可计数断言在异步面板出现前读到0，保留在workflow-1791804843640；加入等待面板可见后通过，未削弱选中数/正文许可/未激活断言。最终定向图在workflow-1791805166974，窄屏稳定画面已检查；桌面静态抓图可能处于指示器过渡，不用它证明动效结束。没有重开全界面视觉巡检。

## 文件与边界

改app/main.tsx、app/style.css和对应构建；新增tests/ui-workflow.mjs、本报告及ui-revision4-verification.json；更新DESIGN/STATUS/DELIVERY。测试新增合成根及截图的精确位置见以上artifactRoot；失败现场、前版清单和所有证据保留，供排障/审阅，无删除或清理。

仅本地可逆操作。真实材料/公开/生产/其他Owner未触碰。会话内复核并非独立第三方审查，用户实际视觉体验仍待本人使用新版判断。
