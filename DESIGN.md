---
name: 项目证据工作台
description: 浅色精密工作台
colors:
  primary: "#3159cd"
  primary-hover: "#274bb8"
  ink: "#222b3b"
  muted: "#606c80"
  surface: "#ffffff"
  rail: "#fafbfc"
  line: "#e4e8f0"
  selected: "#f0f3f7"
  success: "#267052"
  warning: "#916318"
  danger: "#ad3941"
typography:
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif'
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.4
    letterSpacing: "-0.02em"
  body:
    fontSize: "14px"
    lineHeight: 1.65
  metadata:
    fontSize: "12px"
    lineHeight: 1.65
  file-name:
    fontSize: "15px"
    fontWeight: 600
  dialog:
    fontSize: "20px"
    fontWeight: 600
  input-narrow:
    fontSize: "16px"
  title-narrow:
    fontSize: "22px"
    fontWeight: 650
    lineHeight: 1.4
  section:
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.5
  control:
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  badge: "4px"
  field: "5px"
  control: "6px"
spacing:
  compact: "8px"
  row: "18px"
  narrow-content: "20px"
  content: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  selected-navigation:
    backgroundColor: "{colors.selected}"
---

# Design System: 项目证据工作台

## Overview

**Creative North Star: "浅色精密工作台"**

用户已选择的操作型界面。工作区以项目、文件、结论和读取状态为主体，首要动作就近出现。装饰让位于定位和编辑，未知与许可状态继续明确。

**Key Characteristics:** 冷浅灰导航、白色内容区、蓝色选择/操作、文件行而非指标卡、侧抽屉编辑、中文任务语言。

## Colors

主色用于当前项、主要操作与焦点，不填满所有信息。语义色只用于读取/公开/错误状态；中性色维持层级。确切值以前置token为准，来自app/style.css。

**The Action Rule.** 蓝色表达可以做的事与当前所在处；警告和撤销用自己的语义色。

## Typography

一个系统中文无衬线族承担整个界面。项目标题、章节、文件名、字段和辅助信息有连续的尺寸/字重差；正文14px、操作13px、辅助信息12px、文件名15px；章节16px、项目标题28px，窄屏22px，抽屉标题20px。窄屏输入16px、至少46px高。仅路径、原文及修订测量使用等宽。

**The Task Rule.** 控件叫出动作。公开页面不暴露字段key；技术状态可以用“未知/待确认”呈现，但不更改源值或掩盖限制。

## Layout

项目索引216px，内容区域居中且最多1040px。桌面去掉面包屑顶栏和常驻辅助栏；标题与编辑在左，保存状态和检查动作在右。五个资料视图用纯文字导航，只保留缺口计数。

文件日期/类型/版本/复核时间在同一元信息行；撤销读取放入位置与读取记录。项目类型、公开状态、工作区修改记录和使用边界由“项目说明与记录”展开获取。重复数字与“下一步”建议面板取消，功能入口仍在所属视图。

760px以下项目切换为抽屉，顶部只保留切换和保存状态；主区单列，项目说明与记录展开后也按一列阅读。

## Elevation & Depth

工作区以浅色层次和细分隔线划区，不给每行做浮卡。侧编辑抽屉使用单一有方向的柔和阴影；蒙层仅在受保护编辑/许可操作中出现。

## Shapes

标准按钮/输入/标签用小圆角，文件列表以线分隔。统一作者绘制的1.65px描边SVG图标，不使用emoji或字母充当图标。

## Components

按钮具有hover、按下、disabled与focus-visible；可用状态来自真实操作。证据表单按文件与用途、来源信息、记录确认分组；可见字段名称与可访问名称一致，说明放在对应字段旁。结论的出处以文件名加证据ID显示，可定位到对应文件并展开读取记录；返回时恢复原引用的焦点。切换项目、视图与成功新建项目清理定位上下文；不自动读取或更改许可。空列表左对齐短提示，无大图标与重复零计数；无引用时检查按钮禁用。长文件名、用途与限制正常折行。

表单保存需显式提交，失败保留编辑；原生dialog约束焦点，Escape关闭前尊重未保存确认。

项目导航在固定高度内独立滚动，搜索/新建入口保持可见。新建项目保存后选择新卡并清除排除它的搜索。未被任何结论引用的文件显示在全工作区待关联清单，登记后展开；由用户显式建立结论引用，不自动归属或准许读取。

提交时显示正在保存，编辑字段与关闭入口暂时锁定；重复快捷键不重复提交，失败后字段恢复。

窄屏项目导航打开时背景inert、焦点进入面板并循环，关闭回到触发按钮。编辑/许可错误就在相应抽屉中显示；已收到操作结果但刷新失败时，不把已提交状态误称为未保存，也不自动重交。

同一标签页刷新保留当前项目、资料视图和搜索条件，按工作区隔离；搜索可直接清空。缺口行就近打开对应记录或结论，许可只预选对应文件，仍由用户明确提交。编辑支持⌘S / Ctrl+S，与保存按钮走同一提交路径。

tabs支持左右键和稳定可访问名称，视觉计数与标题分开。活动指示只用translateX/scaleX，180ms；正文切换保持静止。侧抽屉230ms进入、160ms退出。文件详情与项目说明在支持interpolate-size时220ms渐进展开，否则使用原生展开。反馈条保持轻量；初始内容不被入场编排藏起。

**The Motion Rule.** 动效只表达选择、展开和结果。prefers-reduced-motion同时关闭普通元素与details-content的动画/过渡；无闲置循环装饰。

## Do's and Don'ts

### Do:
- 按项目和事实维度保留来源上下文。
- 用文件名与就近状态帮助扫读，详细路径可展开。
- 让关键操作、保存结果与许可限制清楚可见。
- 为窄窗口重排结构，保留键盘和减少动效模式。

### Don't:
- 加入通用口号、英文眉题、大数字指标或重复免责声明。
- 用装饰卡片/伪材质替代真实资料。
- 把元数据可见、业务通过和公开许可合并成一个绿色总状态。
- 用UI文案改写或制造真实项目结果。
