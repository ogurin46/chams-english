'use strict';
// 使い方: node scripts/gen_book_s4.js
// flux-1.1-pro-ultra の image_prompt に base64 data URI でキャラ画像を直接渡す。
// ・kobito スプライト（147x232）は小さすぎて IP-Adapter が安定しないため
//   heroine.png（1024x1024）をスタイル参照として使い、テキストでキャラを描写する。

const fs   = require('fs');
const path = require('path');

function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const m = line.trim().match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  });
}
loadEnv(path.join(__dirname, '..', '.env'));

const API_KEY = process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_API_KEY;
if (!API_KEY) { console.error('❌ .env に REPLICATE_API_TOKEN を設定してください'); process.exit(1); }

const IMG_DIR = path.join(__dirname, '..', 'src', 'img');

// ── 参照画像を base64 data URI に変換 ──────────────────────────────────
function toDataURI(filename) {
  const buf = fs.readFileSync(path.join(IMG_DIR, filename));
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// heroine.png (1024x1024) をスタイル参照として使用
const STYLE_REF = toDataURI('heroine.png');

// ── 背景 ──────────────────────────────────────────────────────────────
const BG = {
  morning: 'magical morning forest clearing with brilliant golden sunbeams through tall lush green trees, wildflowers, warm glowing light and sparkles',
  path:    'enchanted glowing forest path lined with colorful mushrooms, soft fireflies floating, warm golden-green magical light through trees',
  lake:    'beautiful serene crystal blue forest lake with pink water lily pads, rainbow arching over the lake, sparkling water reflections and lush green forest',
  flower:  'vibrant colorful flower meadow full of sunflowers, daisies, red poppies and purple wildflowers, blue sky, butterflies, warm sunny light',
  tree:    'in front of an enormous ancient magical tree with very wide glowing golden-brown trunk, colorful mushrooms and wildflowers at base, soft magical light through huge branches',
  party:   'sunny magical forest clearing with golden light, colorful confetti and flower petals falling from sky, wildflowers and trees, festive joyful warm atmosphere',
};

// ── スタイル ───────────────────────────────────────────────────────────
const STYLE = 'vibrant colorful children\'s picture book digital illustration, warm painterly style with magical glowing golden light, bright saturated colors, detailed anime fantasy storybook art, expressive cute characters with very big sparkly eyes and rosy chubby cheeks, chibi proportions, clean outlines, no text, no words, no letters, portrait 9:16';

// リク（赤）/ ミミ（ピンク）/ パク（黄）共通の外見定義
const RIKU = 'a cute very small plump gnome boy (Riku) with a tall bright red conical pointed hat, matching bright red jacket with a brown leather belt and rectangular buckle, short curly dark brown hair, very LARGE wide horizontally-pointing elf ears much wider than his head, two perfectly round rosy-red circular cheeks like big red apples, warm brown eyes with a white highlight dot, tiny round button nose, big cheerful smile showing teeth, very short stout plump round body, small chubby hands and short stubby legs';
const MIMI  = 'a cute very small plump gnome girl (Mimi) with a pink petal flower-shaped hat like a daisy bloom on her head, a pink short dress with a brown leather belt, dark brown pigtail hair in two bunches, very LARGE wide pointing elf ears, two round rosy pink circular cheeks, warm soft brown eyes with sparkle, tiny button nose, gentle sweet smile, very short stout plump round body';
const PAKU  = 'a cute very small plump gnome boy (Paku) with a very tall pointed yellow conical hat, a yellow-green jacket with a brown leather belt, curly dark brown hair, very LARGE wide pointing elf ears, rosy chubby round cheeks, big wide grin showing teeth, round sparkling eyes, very short stout plump round body';

// ── 6ページ分 ─────────────────────────────────────────────────────────
const PAGES = [
  {
    file: 'book4_p1.png',
    prompt: `Three small gnome friends stand together in ${BG.morning}, all facing forward with big happy smiles. In the center is ${RIKU} raising one arm toward the horizon with an adventurous grin. To his left is ${MIMI} with hands clasped together joyfully, eyes sparkling with excitement. To his right is ${PAKU} with both arms raised up happily, beaming with a wide smile. The three gnome friends look ready for a forest adventure. ${STYLE}`,
  },
  {
    file: 'book4_p2.png',
    prompt: `${RIKU} crouches down with a delighted surprised expression on ${BG.path}, mouth wide open in joy, one small chubby hand reaching out toward a fluffy round white rabbit with big pink inner ears sitting up on hind legs, front paws raised high in a cheerful wave, big friendly dark eyes, very rosy pink cheeks on the rabbit. Behind Riku ${MIMI} peeks over his shoulder with wide excited sparkling eyes. ${STYLE}`,
  },
  {
    file: 'book4_p3.png',
    prompt: `${MIMI} stands at the shore of ${BG.lake}, pressing both small chubby hands to her rosy cheeks with eyes wide open and sparkling in pure amazement. Beside her ${RIKU} spreads his arms wide in awe, mouth open. On a large pink water lily pad a small round cute yellow bird with tiny wings sits with head tilted sideways, smiling warmly. ${STYLE}`,
  },
  {
    file: 'book4_p4.png',
    prompt: `${PAKU} bends forward laughing loudly in ${BG.flower}, hands on knees, mouth wide open in a huge guffaw showing teeth. Beside him ${MIMI} covers her mouth giggling with squinting happy eyes. An orange tabby cat with round golden eyes and a pink nose sits sheepishly among colorful flowers with both ears slightly flattened in embarrassment, one paw raised awkwardly, giving a cute guilty smile. ${STYLE}`,
  },
  {
    file: 'book4_p5.png',
    prompt: `${RIKU} stumbles backward in playful shock ${BG.tree}, both small chubby hands raised high in the air, eyes enormous and perfectly round in startled surprise, mouth wide open gasping. From around the edge of the enormous tree trunk a very large but gentle and friendly brown bear peeks out with a huge silly grin and one big fluffy paw raised in a friendly wave, soft kind round eyes, big rosy pink cheeks. ${STYLE}`,
  },
  {
    file: 'book4_p6.png',
    prompt: `A joyful celebration scene in ${BG.party}. ${RIKU} stands center with both fists raised high in triumph, grinning from ear to ear. Beside him ${MIMI} twirls happily with arms outstretched, eyes sparkling. ${PAKU} jumps into the air with pure joy. A fluffy white rabbit hops cheerfully. An orange tabby cat raises paws. Colorful sparkles, confetti and flower petals fill the warm golden air all around everyone. ${STYLE}`,
  },
];

// ── API ヘルパー ───────────────────────────────────────────────────────
const HEADERS = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type':  'application/json',
  'Prefer':        'wait=60',
};

async function fetchWithRetry(url, options, maxRetries = 6) {
  for (let i = 0; i < maxRetries; i++) {
    const res = await fetch(url, options);
    if (res.status !== 429) return res;
    const wait = (i + 1) * 12000;
    process.stdout.write(`⏳${wait / 1000}s待機… `);
    await new Promise(r => setTimeout(r, wait));
  }
  throw new Error('レート制限リトライ超過');
}

async function waitForResult(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  let data = await res.json();
  if (data.status === 'succeeded') return data.output;
  if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
  const pollUrl = data.urls?.get;
  if (!pollUrl) throw new Error('ポーリングURL取得失敗');
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const pr = await fetch(pollUrl, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    data = await pr.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
    if (i % 5 === 4) process.stdout.write('.');
  }
  throw new Error('タイムアウト');
}

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`DL失敗: ${res.status}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  console.log(`🔑 APIキー: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`);
  console.log('📖 flux-1.1-pro-ultra + heroine.png (base64) スタイル参照で生成\n');
  console.log(`📎 スタイル参照: heroine.png (${(STYLE_REF.length / 1024).toFixed(0)}KB base64)\n`);

  for (let i = 0; i < PAGES.length; i++) {
    const pg = PAGES[i];
    const outPath = path.join(IMG_DIR, pg.file);
    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${PAGES.length}] ${pg.file} スキップ（既存）`);
      continue;
    }
    process.stdout.write(`[${i + 1}/${PAGES.length}] ${pg.file.padEnd(14)} 生成中... `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            prompt:                pg.prompt,
            image_prompt:          STYLE_REF,
            image_prompt_strength: 0.2,
            aspect_ratio:          '9:16',
            output_format:         'png',
            output_quality:        95,
            safety_tolerance:      6,
          } }),
        }
      ));
      const url = Array.isArray(out) ? out[0] : String(out);
      await download(url, outPath);
      console.log(' ✅');
    } catch (e) {
      console.log(` ❌ ${e.message.slice(0, 200)}`);
    }
    if (i < PAGES.length - 1) await new Promise(r => setTimeout(r, 12000));
  }

  console.log('\n🎉 生成完了！');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
