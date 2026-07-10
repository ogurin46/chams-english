'use strict';
// 使い方:
//   1. python3 scripts/create_composites.py  ← 合成参照画像を作成
//   2. node scripts/gen_book_s4.js           ← 本スクリプトで生成
//
// 戦略: bg_forest.png + キャラスプライトを合成した参照画像を
//        image_prompt に渡して画風とキャラを同時に参照させる。

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
if (!API_KEY) { console.error('ERROR: .env に REPLICATE_API_TOKEN を設定してください'); process.exit(1); }

const IMG_DIR  = path.join(__dirname, '..', 'src', 'img');
const COMP_DIR = path.join(__dirname, 'composites');

function toDataURI(filePath) {
  const buf = fs.readFileSync(filePath);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// ── スタイル定義 ──────────────────────────────────────────────────────
// bg_forest.png の画風を言語化: 手描き感のある繊細な水彩タッチの絵本イラスト
const STYLE = [
  'detailed hand-painted children storybook illustration',
  'same painterly watercolor style as the reference image',
  'lush detailed forest with dappled golden sunlight through trees',
  'soft warm lighting, rich natural greens, delicate botanical textures',
  'cute chibi gnome characters with clean ink outlines and soft watercolor shading',
  'same character designs as shown in the reference image',
  'no text, no letters, no words',
  'portrait orientation',
].join(', ');

// ── 6ページのプロンプト ───────────────────────────────────────────────
const PAGES = [
  {
    file: 'book4_p1.png',
    comp: 'comp_p1.png',
    strength: 0.38,
    prompt: `The three small gnome friends from the reference image stand together in a magical sunlit forest clearing, all smiling happily and facing forward. The gnome in the red hat and red jacket raises one hand pointing excitedly toward the horizon. The gnome girl in the pink flower petal hat claps her hands together with sparkling eyes. The gnome in the yellow hat jumps with both arms raised in joy. They are ready for a forest adventure. ${STYLE}`,
  },
  {
    file: 'book4_p2.png',
    comp: 'comp_p2.png',
    strength: 0.38,
    prompt: `The small gnome in the red hat and red jacket from the reference image crouches down on a magical forest path, reaching out with a delighted surprised expression toward a small fluffy white rabbit sitting up on its hind legs with front paws raised in a cheerful greeting. The gnome's eyes are wide open in pure joy and wonder. Colorful mushrooms and wildflowers line the glowing forest path. ${STYLE}`,
  },
  {
    file: 'book4_p3.png',
    comp: 'comp_p3.png',
    strength: 0.38,
    prompt: `The gnome girl in the pink flower petal hat and pink dress from the reference image stands at the edge of a beautiful crystal-clear blue lake surrounded by lush painted forest. She presses both hands to her rosy cheeks with eyes wide open in pure amazement. The gnome in the red hat stands beside her, spreading arms wide in wonder. A rainbow arches gently over the lake. Pink water lily pads float on the sparkling water. ${STYLE}`,
  },
  {
    file: 'book4_p4.png',
    comp: 'comp_p4.png',
    strength: 0.38,
    prompt: `The gnome in the yellow hat and the gnome girl in the pink flower hat from the reference image both laugh and giggle together in a vibrant flower meadow filled with sunflowers, daisies, and colorful wildflowers. Between them an orange tabby cat with big round eyes sits sheepishly with both ears flattened and one paw raised in an embarrassed but cute smile. Warm sunny sky with soft clouds and butterflies above. ${STYLE}`,
  },
  {
    file: 'book4_p5.png',
    comp: 'comp_p5.png',
    strength: 0.38,
    prompt: `The small gnome in the red hat from the reference image stumbles backward in playful shock in a magical forest, both hands raised high with eyes wide in startled surprise and mouth open gasping. Beside him a large friendly brown bear with soft kind eyes and rosy pink cheeks peeks around an enormous ancient tree trunk with one big fluffy paw raised in a friendly wave and a huge goofy grin. Golden sparkles in the forest air. ${STYLE}`,
  },
  {
    file: 'book4_p6.png',
    comp: 'comp_p6.png',
    strength: 0.38,
    prompt: `All three gnome friends from the reference image celebrate joyfully together in a warm glowing forest clearing. The gnome in the red hat raises both fists in triumph with a huge grin. The gnome girl in the pink flower hat twirls happily with arms outstretched. The gnome in the yellow hat jumps into the air with pure delight. Colorful confetti and flower petals drift down through golden sunbeams. ${STYLE}`,
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
    process.stdout.write(`[rate limit] waiting ${wait / 1000}s... `);
    await new Promise(r => setTimeout(r, wait));
  }
  throw new Error('Rate limit retries exceeded');
}

async function waitForResult(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  }
  let data = await res.json();
  if (data.status === 'succeeded') return data.output;
  if (data.status === 'failed')    throw new Error(data.error || 'generation failed');
  const pollUrl = data.urls?.get;
  if (!pollUrl) throw new Error('no poll URL');
  for (let i = 0; i < 80; i++) {
    await new Promise(r => setTimeout(r, 4000));
    const pr = await fetch(pollUrl, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    data = await pr.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed')    throw new Error(data.error || 'generation failed');
    if (i % 5 === 4) process.stdout.write('.');
  }
  throw new Error('timeout');
}

async function download(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  fs.writeFileSync(outPath, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  console.log(`API key: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`);
  console.log('Generating storybook pages with composite image references\n');

  for (let i = 0; i < PAGES.length; i++) {
    const pg = PAGES[i];
    const outPath  = path.join(IMG_DIR, pg.file);
    const compPath = path.join(COMP_DIR, pg.comp);

    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${PAGES.length}] ${pg.file} - skipped (exists)`);
      continue;
    }
    if (!fs.existsSync(compPath)) {
      console.log(`[${i + 1}/${PAGES.length}] ${pg.file} - ERROR: composite not found: ${compPath}`);
      console.log('  Run: python3 scripts/create_composites.py');
      continue;
    }

    const imagePrompt = toDataURI(compPath);
    process.stdout.write(`[${i + 1}/${PAGES.length}] ${pg.file.padEnd(14)} generating... `);

    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            prompt:                pg.prompt,
            image_prompt:          imagePrompt,
            image_prompt_strength: pg.strength,
            aspect_ratio:          '9:16',
            output_format:         'png',
            output_quality:        95,
            safety_tolerance:      6,
          } }),
        }
      ));
      const url = Array.isArray(out) ? out[0] : String(out);
      await download(url, outPath);
      console.log('OK');
    } catch (e) {
      console.log(`ERROR: ${e.message.slice(0, 200)}`);
    }

    if (i < PAGES.length - 1) await new Promise(r => setTimeout(r, 12000));
  }

  console.log('\nDone!');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
