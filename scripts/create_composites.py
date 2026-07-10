"""
絵本ページ用の合成参照画像を作成する。
bg_forest.png スタイルの背景 + キャラスプライトを重ねて
flux-1.1-pro-ultra の image_prompt に渡すための素材を生成。
"""
from PIL import Image
import os, sys

BASE = os.path.join(os.path.dirname(__file__), '..', 'src', 'img')
OUT  = os.path.join(os.path.dirname(__file__), 'composites')
os.makedirs(OUT, exist_ok=True)

# ── 画像読み込み ───────────────────────────────────────────────────────
def load(name):
    return Image.open(os.path.join(BASE, name)).convert('RGBA')

bg_forest  = load('bg_forest.png')   # 1536x1024  (横長)
bg_morning = load('bg_morning.png')
bg_flower  = load('bg_flower.png')

riku   = load('riku.png')    # 147x232
mimi   = load('mimi.png')
paku   = load('paku.png')
rabbit = load('animal_rabbit.png')
cat    = load('animal_cat.png')
bear   = load('animal_bear.png')

# ── ユーティリティ ─────────────────────────────────────────────────────
TARGET_W, TARGET_H = 576, 1024   # 9:16 縦長

def portrait_crop(bg_img):
    """横長背景を 9:16 縦長にセンタークロップ・リサイズ"""
    bw, bh = bg_img.size
    crop_w = int(bh * TARGET_W / TARGET_H)
    crop_x = (bw - crop_w) // 2
    cropped = bg_img.crop((crop_x, 0, crop_x + crop_w, bh))
    return cropped.resize((TARGET_W, TARGET_H), Image.LANCZOS)

def scale_to_height(sprite, target_h):
    """高さを target_h にスケール（アスペクト維持）"""
    sw, sh = sprite.size
    new_w = int(sw * target_h / sh)
    return sprite.resize((new_w, target_h), Image.LANCZOS)

def paste_center_x(canvas, sprite, y, offset_x=0):
    """水平中央に貼り付け、offset_x でずらす"""
    x = (TARGET_W - sprite.width) // 2 + offset_x
    canvas.paste(sprite, (x, y), sprite)
    return canvas

def paste_at(canvas, sprite, x, y):
    """指定座標に貼り付け"""
    canvas.paste(sprite, (x, y), sprite)
    return canvas

def save(canvas, filename):
    canvas.convert('RGB').save(os.path.join(OUT, filename), 'PNG')
    print(f'  OK: {filename}')

# ── キャラクターサイズ ─────────────────────────────────────────────────
# 画像高の 42% をキャラ高に
CHAR_H     = int(TARGET_H * 0.42)   # ≈430px
CHAR_SMALL = int(TARGET_H * 0.33)   # ≈338px (動物など)

riku_s   = scale_to_height(riku,   CHAR_H)
mimi_s   = scale_to_height(mimi,   CHAR_H)
paku_s   = scale_to_height(paku,   CHAR_H)
rabbit_s = scale_to_height(rabbit, CHAR_SMALL)
cat_s    = scale_to_height(cat,    CHAR_SMALL)
bear_s   = scale_to_height(bear,   CHAR_H)

# キャラの Y 座標（下端がほぼ画像下に来るよう）
def bottom_y(sprite, margin=40):
    return TARGET_H - sprite.height - margin

print('Creating composite reference images...')

# ── P1: 冒険スタート（リク中央、ミミ左、パク右） ──────────────────────
bg = portrait_crop(bg_forest)
gap = 8
total_w = mimi_s.width + gap + riku_s.width + gap + paku_s.width
start_x = (TARGET_W - total_w) // 2
y_riku = bottom_y(riku_s)
y_mimi = bottom_y(mimi_s)
y_paku = bottom_y(paku_s)
bg = paste_at(bg, mimi_s,  start_x,                           y_mimi)
bg = paste_at(bg, riku_s,  start_x + mimi_s.width + gap,      y_riku)
bg = paste_at(bg, paku_s,  start_x + mimi_s.width + gap + riku_s.width + gap, y_paku)
save(bg, 'comp_p1.png')

# ── P2: うさちゃん発見（リク左、うさちゃん右） ─────────────────────────
bg = portrait_crop(bg_forest)
total_w = riku_s.width + gap * 2 + rabbit_s.width
start_x = (TARGET_W - total_w) // 2
bg = paste_at(bg, riku_s,   start_x, bottom_y(riku_s))
bg = paste_at(bg, rabbit_s, start_x + riku_s.width + gap * 2, bottom_y(rabbit_s))
save(bg, 'comp_p2.png')

# ── P3: みずうみ発見（ミミ左、リク右） ─────────────────────────────────
bg = portrait_crop(bg_morning)
total_w = mimi_s.width + gap + riku_s.width
start_x = (TARGET_W - total_w) // 2
bg = paste_at(bg, mimi_s, start_x,                    bottom_y(mimi_s))
bg = paste_at(bg, riku_s, start_x + mimi_s.width + gap, bottom_y(riku_s))
save(bg, 'comp_p3.png')

# ── P4: ねこちゃん発見（パク左、ミミ中、ねこ右） ──────────────────────
bg = portrait_crop(bg_flower)
total_w = paku_s.width + gap + mimi_s.width + gap * 2 + cat_s.width
start_x = (TARGET_W - total_w) // 2
bg = paste_at(bg, paku_s, start_x, bottom_y(paku_s))
bg = paste_at(bg, mimi_s, start_x + paku_s.width + gap, bottom_y(mimi_s))
bg = paste_at(bg, cat_s,  start_x + paku_s.width + gap + mimi_s.width + gap * 2, bottom_y(cat_s))
save(bg, 'comp_p4.png')

# ── P5: くまにびっくり（リク中央、くま右側） ───────────────────────────
bg = portrait_crop(bg_forest)
total_w = riku_s.width + gap * 3 + bear_s.width
start_x = (TARGET_W - total_w) // 2
bg = paste_at(bg, riku_s, start_x, bottom_y(riku_s))
bg = paste_at(bg, bear_s, start_x + riku_s.width + gap * 3, bottom_y(bear_s))
save(bg, 'comp_p5.png')

# ── P6: みんなでおいわい（ミミ左、リク中、パク右） ─────────────────────
bg = portrait_crop(bg_morning)
total_w = mimi_s.width + gap + riku_s.width + gap + paku_s.width
start_x = (TARGET_W - total_w) // 2
bg = paste_at(bg, mimi_s, start_x,                             bottom_y(mimi_s))
bg = paste_at(bg, riku_s, start_x + mimi_s.width + gap,        bottom_y(riku_s))
bg = paste_at(bg, paku_s, start_x + mimi_s.width + gap + riku_s.width + gap, bottom_y(paku_s))
save(bg, 'comp_p6.png')

print('Done! Saved to scripts/composites/')
