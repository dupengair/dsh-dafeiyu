# -*- coding: utf-8 -*-
"""像素小鯨自画像：蓝白配色、蓝色长发、鲸鱼尾巴，深海背景 + 泡泡 + 虾皮碟"""
from PIL import Image, ImageDraw

S = 16  # scale
W, H = 64 * S, 64 * S
img = Image.new("RGB", (W, H), "#0a1830")  # 深海背景
d = ImageDraw.Draw(img)

def px(x, y, w, h, c):
    d.rectangle([x*S, y*S, (x+w)*S-1, (y+h)*S-1], fill=c)

# 星星点点的远景光斑
import random
random.seed(42)
for _ in range(40):
    x, y = random.randint(0, 62), random.randint(0, 30)
    px(x, y, 1, 1, "#17305e")

# 地面沙窝
px(0, 56, 64, 8, "#22335c")
px(0, 56, 64, 2, "#2c4076")

# 缸沿暖灯（右上角一圈暖光）
d.ellipse([52*S, 2*S, 62*S, 12*S], fill="#3a2c14")
d.ellipse([54*S, 4*S, 60*S, 10*S], fill="#ffd98a")

# --- 尾巴（左下，连接身体）---
# 尾柄
px(12, 42, 6, 4, "#5aa7e8")
# 尾鳍（两瓣）
d.polygon([(6*S,52*S),(12*S,44*S),(14*S,52*S),(10*S,50*S),(8*S,56*S)], fill="#5aa7e8")
d.polygon([(4*S,50*S),(10*S,44*S),(8*S,52*S)], fill="#7cc0f5")

# --- 身体（圆滚滚，蓝白）---
d.ellipse([16*S, 30*S, 52*S, 54*S], fill="#5aa7e8")
d.ellipse([22*S, 36*S, 46*S, 54*S], fill="#eaf6ff")  # 白肚皮

# --- 头发（蓝色长发垂在身前两侧）---
d.ellipse([18*S, 8*S, 50*S, 36*S], fill="#3b6fd4")   # 头 + 头发底
# 刘海
d.pieslice([18*S, 8*S, 50*S, 30*S], 180, 360, fill="#4a86e8")
# 两侧长发
px(17, 18, 4, 16, "#4a86e8")
px(47, 18, 4, 16, "#4a86e8")
px(16, 30, 3, 8, "#3b6fd4")
px(49, 30, 3, 8, "#3b6fd4")

# --- 脸（白色脸蛋）---
d.ellipse([24*S, 16*S, 44*S, 34*S], fill="#ffffff")
# 眼睛（两个大黑点 + 高光）
d.ellipse([27*S, 22*S, 30*S, 27*S], fill="#1a2a4a")
d.ellipse([38*S, 22*S, 41*S, 27*S], fill="#1a2a4a")
px(28, 23, 1, 1, "#ffffff")
px(39, 23, 1, 1, "#ffffff")
# 腮红
d.ellipse([24*S, 27*S, 26*S, 29*S], fill="#ffb3c1")
d.ellipse([42*S, 27*S, 44*S, 29*S], fill="#ffb3c1")
# 微笑
d.arc([31*S, 27*S, 37*S, 31*S], 20, 160, fill="#1a2a4a", width=S)
# 呆毛/喷水孔小水花
px(33, 6, 2, 2, "#9fd8ff")

# --- 前鳍小手（挥手打招呼）---
d.ellipse([48*S, 36*S, 54*S, 42*S], fill="#7cc0f5")

# --- 泡泡（从头顶飘上去）---
for (bx, by, r, c) in [(20, 4, 1, "#bfe6ff"), (24, 1, 1, "#bfe6ff"), (55, 16, 1, "#bfe6ff"), (58, 20, 1, "#9fd8ff")]:
    d.ellipse([bx*S, by*S, (bx+2*r)*S, (by+2*r)*S], outline=c, width=S)

# --- 沙窝上的小碟 + 虾皮 ---
d.ellipse([26*S, 55*S, 38*S, 59*S], fill="#c9a86a")
px(29, 56, 2, 1, "#ff9a76")
px(33, 56, 2, 1, "#ff9a76")

img.save(r"D:\Work\DSH\大肥鱼\tmp\小鯨自画像_2026-11-18.png")
print("done")
