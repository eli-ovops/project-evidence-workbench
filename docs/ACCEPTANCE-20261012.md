# 项目证据工作台 · 实施与验收回执

历史初次实施回执：2026-10-12；本轮UI重塑状态见UI_RESHAPE-20261012.md与STATUS。日期：2026-10-12，Asia/Shanghai。Owner `01a12ed9-1b22-7d40-a6da-09f604fd72dc`。软件0.1.0 / schema1，依据Rev2与IMPLEMENTATION_DISPATCH-20261012。**本Owner软件P0实现与必需场景验收通过，交付待协调PMO审原件。** 用户真实体验及真实项目/公开许可均未验，不以合成通过替代。

## 结果入口

- [一次启动](/Volumes/EXTERNAL/FDE/project-evidence-workbench/启动工作台.command)；[停止](/Volumes/EXTERNAL/FDE/project-evidence-workbench/停止工作台.command)；[运行与恢复说明](/Volumes/EXTERNAL/FDE/project-evidence-workbench/docs/RUN_AND_RECOVER.md)。依赖/构建已准备，无需用户build。
- 实际Node路径 `/Users/USER/.local/nodejs/node-v22.16.0-darwin-arm64/bin/node`，22.16.0；工程根 `/Volumes/EXTERNAL/FDE/project-evidence-workbench`，日常合成根 `data/demo`，初始三虚构案例、历史读取/公开能力关闭。
- 启动入口等效shell调用已测试，原生自动开浏览器在该验收调用中用PEW_OPEN_BROWSER=0抑制，随后用独立真实Chrome打开其实际启动文件，验证实例认证和3案例；正常入口默认使用macOS open。不是要求用户准备环境或build。最后实际URL为 `http://127.0.0.1:52199`，已主动停止，只是该次测试URL；下次启动显示新实际URL。
- [启动器回执](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/launcher/receipt.json)，[就绪画面](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/launcher/ready.png)。所有测试服务已正常停止；无在途业务、自动化或开机自启。

## 当前版本与原始证据

最终源/构建/启动器指纹：`b60f972e89629086a6c08a9cdd35651cb748b30f314bd407dbea6a4408ac7bf8`。[23项文件清单](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/ui-previous-version.json)包含源码、包与锁文件、构建产物、启动器；不含nonce/会话秘密/数据。最终build/core输出和相同指纹已核，无新软件改动。

| 必需场景 | 已测层与原件 |
| --- | --- |
| E01 / B1+B4 | 三虚构案例；同证据关联多结论/项目不重复登记；真实保存与重启一致，冷启动grant/批准关闭。[core](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/E01/core-receipt-core-1791798042539.json)。真实桌面/窄窗与键盘Tab→Enter保存见browser原件。 |
| E02 / B1+B2 | 维度冲突并列、设备不继承本地PASS、metadata不读正文、sourceDate未知不填今天、now注入动态7天/职责90天/公开90天复核过期、许可撤销拒绝读/导出、精确路径/父组件与打开fd替换拒绝、合成源零修改（攻击夹具模拟除外）。[core](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/E02/core-receipt-core-1791798042539.json)。 |
| E03 / B2+B3 | 字段白名单、核实际公开字节/摘要；文字/依赖/rights变化、同大小mtime不同字节、锁后撤销、已完成包撤销后新下载拒绝；旧包保留，未追回用户副本。[core](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/E03/core-receipt-core-1791798042539.json)及实际HTTP下载/撤销browser。 |
| E04 / B4 | 前置revision冲突与第二写实例拒绝；适配器权限/容量/缺状态失败保旧数据、预留撤销、未持久化撤销后重启不复活。真实HTTP未认证GET/写/下载、Host/Origin/静态根、XSS纯文本、同浏览器两合成根登录/退出隔离。[core](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/E04/core-receipt-core-1791798042539.json)。未拔盘、未chmod真实文件。 |
| E05 / B3+B4 | 真内部/公开包及manifest逐字节核；失败第二/末写入不成为可下载/恢复包；新根隔离恢复关系一致，权限历史化；原根/原包保留，异应用/未来schema/悬空ID拒绝。[core](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/E05/core-receipt-core-1791798042539.json)。 |

[最终类型检查/构建输出](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/final-build.log)：exit0。[最终core输出](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/final-core.log)：5/5通过，零失败/跳过。[最终browser回执](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791798043272/receipt.json)：7组跨场景检查、无pageerror、deviations显式[]。每core回执同样有deviations字段，不以失败报告充当通过。

browser最终原件根：`/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791798043272/`，含桌面、390px窄窗口、重启画面、实际下载与逐步断言。使用既有Google Chrome二进制、bundled Node Playwright、独立新上下文，只合成身份；未读真实Cookie。Python Playwright缺模块、bundled浏览器binary缺失，已查LOCAL_BLOCKERS后使用已核存在Chrome，不安装浏览器/改权限；窄窗非手机连loopback。

实际包：[浏览器内部包](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791798043272/actual-internal-download.json)、[浏览器公开包](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/browser-1791798043272/actual-public-download.json)。亦有core独立包位于E05。JSON封套的公开files只有白名单Markdown与manifest，没有内部状态/原路径/原件/媒体。下载中断不改变服务器完成状态。虚构fixture actor不等于真实公开许可。

## 实施记录与限制

S1—S4的结构、保存、引用、失效、导出恢复均以合成输入完成，未要求Eli挑真文件/陪验或阶段PASS。首次目标create_goal已返active，原始回执在START_RECEIPT。2026-10-12 16:41:49启动，17:34:11已累计3142秒（约52分钟22秒，无人类/外部停等扣除），最终收尾时间另以goal关闭回执为准；远低于6h/8.5h检查点和12h上限。中间阶段未逐秒独立计时，不从文件mtime冒充阶段起止；累计连续预算有可核开始/结束。

首次core两项失败来自夹具path.join规范化和输出目录未提前准备，失败回执保留；浏览器工具缺件、包列表排序、首次恢复容器准备、textarea可访问名称、职责/公开90天阈值问题均有旧失败现场，已修正并按当前版复测。未降低门槛或删除失败证据。

24个实际安装包许可登记为MIT/Apache-2.0/MPL-2.0/ISC/BSD-3-Clause，包内原许可保留；[依赖清单](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/DEPENDENCIES.json)及[npm audit原件](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/rev2/dependency-audit.json)目前0已知漏洞。并非所有运行时/平台安全认证或永久无漏洞承诺。

公开链接编辑器首版保留既有数组，未额外做批量链接管理；本期结论的evidenceIds+dimension是事实维度引用，limits记范围，navigation只导航，不生成独立“项目已完成”真值。历史源变化需有界检查或用途确认，不承诺后台同步/发现全部变化。

## 授权与收尾

只在本工具工程新增源码/免费依赖/合成数据/测试/构建/文档/证据，未修改PRD为长Rev3、他Owner文件/共享台账/网站/媒体/Git，未真实数据库/客户材料/账户/外部模型/外发/部署/删除迁移。权限故障只用合成适配器；攻击夹具只是本工具自建文件。

生成物：node_modules约64MiB、build约56KiB、dist约248KiB、data约92KiB、runtime约108KiB（含本工具私有启动/控制文件，0600，不进入导出）、evidence约3.3MiB。永久源码/样例、故障现场/恢复包/回执和运行依赖全部保留；测试浏览器临时profile仅为本工具新上下文，库自行退出清理其临时工作文件，未动用户profile。无可删原资产、无额外清理；最终df所在盘21%使用、约1.5TiB余量，不宣称释放空间。

技术层通过；用户真实体验未验；38真项目整理、真实权威/公开许可、商业/客户/设备/发布结果USER_PENDING。PMO审以上原件后给总项目终态。本工具只提供可运行软件与明确虚构样例，不替客户补造验收。
