# 两个真实项目的证据原件

本次核对日期：2026-10-13（用户客户端日期，Asia/Shanghai）。只读现有代码、发布产物与原始回执，并重算指定文件哈希；没有启动系统、build/test、产生新虚拟资料、读取秘密/数据库、连接服务器或改动两个原项目。

本清单是原件导航和本次校验结果，不是重新生成的客户验收回执。

## WilliamRock 扫码库存

- 真实库存记账/幂等/请求作废代码：[server/inventory.ts](/Volumes/EXTERNAL/wr库存系统/server/inventory.ts:78)。数据库结构与库存约束：[0001_inventory.sql](/Volumes/EXTERNAL/wr库存系统/migrations/0001_inventory.sql:26)。
- 当前代码核对：[历史源码清单](/Volumes/EXTERNAL/wr库存系统/artifacts/source-manifest.json)；其中src/server/migrations的19项，本次18项一致，Scanner.tsx一项字节不一致。库存模块SHA256：`0c48f2a4309e068806151e8647495a07eb87531e7803485809aec718bc4ba1c2`。
- 现有测试站记录：[2026-09-08部署记录](/Volumes/EXTERNAL/wr库存系统/docs/IMPLEMENTATION.md:92)、[云端原始回执](/Volumes/EXTERNAL/wr库存系统/artifacts/cloud-acceptance-20260908.json)。原回执`virtualOnly=true`，只证明曾进行云端虚拟库存试点，不能算真实工厂业务或客户签收。
- 验收边界：[ACCEPTANCE.md](/Volumes/EXTERNAL/wr库存系统/docs/ACCEPTANCE.md:52)明确真实手机、工厂网络等仍待现场验收。旧测试记录不覆盖未核清的扫码源码差异；未建立当前云端与本地源码完全一致的结论。

能证明：真实工程和具体库存业务实现存在，有历史云端试点记录。未证明：工厂正式使用、真实扫码达标、正式客户验收、个人全量原创或商业收入。

## 淼瀚洁具 ERP

- 真实成品库存接口代码：[BrtProductInventoryController.java](/Volumes/EXTERNAL/ERP试跑-20261005/build/cao-erp-manufacturing/brt-admin/src/main/java/com/brt/production/controller/BrtProductInventoryController.java:40)。这是已有工程的工作副本，不据其存在推断本人原创；源码目录含暂缓未发布改动，不能整体等同冻结交付版。
- 实际发布产物：[upload-components-isolated-r1.jar](/Volumes/EXTERNAL/ERP试跑-20261005/repair-20261009-F16/upload-components-isolated-r1.jar)，122187706字节。本次重算SHA256为`a191f5e48cacff663006219d9f378c6f1d54bbf0c10d58e7c625ec4e434ec976`，与原发布回执一致。JAR中存在成品库存控制器class，brt-production-3.8.5.jar内存在库存Service实现；只读确认，未运行产物。
- 原始发布回执：[deployment-attempt.json](/Volumes/EXTERNAL/ERP试跑-20261005/repair-20261009-F16/components-release-r1-deployment-attempt.json)。`live_switched=true`；`actual_business_acceptance=pending`。这是2026-10-09记录，不是本次服务器在线证明。
- 发布后保护核对：[after-release-protected-r1.json](/Volumes/EXTERNAL/ERP试跑-20261005/repair-20261009-F16/after-release-protected-r1.json)。有限技术审查：[live-functional-final-review-r1.json](/Volumes/EXTERNAL/ERP试跑-20261005/repair-20261009-F16/live-functional-final-review-r1.json)，F16有限范围accepted=true，但`original18_complete=false`，不能扩大为所有问题修复/客户整体验收。
- PC 2.0.0原件：[manifest.json](/Volumes/EXTERNAL/ERP试跑-20261005/version-2.0.0-20261009/manifest.json)、[原发布stdout](/Volumes/EXTERNAL/ERP试跑-20261005/version-2.0.0-20261009/deployment-stdout.json)、[原浏览器检查](/Volumes/EXTERNAL/ERP试跑-20261005/version-2.0.0-20261009/browser-check.json)。本地index.html重算SHA256 `5c5b1873202c2570fd75fd95ab70adfdf4b986a4c44b8968519257287cc13075`，与原清单一致；2.0.0是版本显示调整，未据此声称整体业务重建。
- 正式交付边界：[交付版本冻结](</Users/USER/Documents/ChatGPT/淼瀚洁具 库存管理系统/docs/2026-10-09-交付版本冻结.md:7>)。其中仍有F11/F15/F17未修、真实重启和备份恢复未验。
- 客户验收：[2.0人工测试清单](</Users/USER/Documents/ChatGPT/淼瀚洁具 库存管理系统/docs/2026-10-10-2.0人工测试清单.md:3>)明确是操作说明，不是已完成测试证明。已核的发布回执仍标pending；本次已读材料中没有客户签字/签收/已填完成的验收结果，不将执行者技术回执当客户验收。

能证明：存在实际交付程序与原发布记录，指定产物哈希相符。未证明：全部18项完成、正式客户验收、当前服务器运行状态、个人全量独立开发或收入。

## 本次只读校验原件

[READONLY_FILE_VERIFICATION.json](/Volumes/EXTERNAL/FDE/project-evidence-workbench/evidence/real-projects-20261013/READONLY_FILE_VERIFICATION.json)记录精确路径、历史/当前哈希、相符结果及上述缺口。没有复制JAR、原始业务表或媒体；本任务只新增此导航与校验JSON，保留供用户核对。原件未修改。
