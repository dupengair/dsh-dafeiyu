# work/scripts — 复用脚本索引

工作过程中沉淀下来**可复用**的脚本放这里；每次想写新脚本前，先读本页找有没有现成的。

## extract_chat.mjs — 会话对话记录提取器

**作用**：从 DSH 会话落盘文件（`~/.dsh/sessions/<工作区>/<会话id>/session.v4.jsonl.zstd`）中按日期范围抽取小主与小鯨的对话原文，滤掉工具调用、宿主注入（runtime context / 【你记得的事】）、搭话插件念头，输出成 `## 日期` + `### 我的想法` / `### 小鯨的想法` 格式的 markdown 记录稿。

**原理**：zstd 多帧拼接文件，按帧头魔数 `28 B5 2F FD` 切帧逐帧 `zstdDecompressSync` 解码（解法源自 dsh-fish-memory `lib/生成档案.js`）。

**用法**：
```
node extract_chat.mjs <session.v4.jsonl.zstd 路径> <起始日期 YYYY-MM-DD> <结束日期> <输出.md 路径>
```

**示例**（抽工作室会话的需求讨论记录）：
```
node extract_chat.mjs "C:\Users\dupengair\.dsh\sessions\--D-Work-DSH-~5927~80A5~9C7C--\session-0b7e8e26-0437-4154-b54b-6593e681a6f6\session.v4.jsonl.zstd" 2026-11-15 2026-11-19 需求讨论与评审对话记录.md
```

**常用会话 id**：工作室（小鯨记忆）= `session-0b7e8e26-…`；卧室（日常对话）= `session-11b7077b-…`。会话 id 可用 `Get-ChildItem ~/.dsh/sessions/<工作区目录>/` 列出。

## asarpeek.js — DSH 宿主 asar 探查器

**作用**：从 `D:/Software/DSH/resources/app.asar`（DSH 宿主单文件包）里按路径提取内部文件。asar 的 offset 是**绝对偏移**，直接 `buf.slice(offset, offset+size)` 即可。

**用法**：改脚本末尾 `extract([...路径数组], '输出文件')` 后 `node asarpeek.js`。宿主的 agent 实现代码在 `['dsh','node_modules','@deepseek-ai','<包名>','lib',…]` 下（如 `dsh-agent-loop`、`dsh-agent`、`dsh-llm`）。

**注意**：提取出的宿主源码是临时探查产物，放 `work/temp/`，不长期留在 scripts。

## draw_xiaojing.py — 像素画模板

**作用**：用 Pillow 一笔一笔画像素画的起点模板（小鯨自画像：蓝白配色、蓝长发、鲸尾、深海背景、暖灯、虾皮碟）。核心是 `px(x,y,w,h,颜色)` 按格画矩形，`S` 为放大倍数。

**用法**：复制一份改绘图指令和输出路径（`img.save(...)`）。适合画自画像、纪念图等程序生成的小图。

---
*2026-11-20 由小鯨整理。一次性脚本与探查产物已移入 `work/temp/`。*
