'use strict';
// 使い方: node scripts/gen_book_s4.js
// おはなし4「What Is It?」の絵本ページイラスト 6枚を生成する。
// チャムズ（リク・ミミ）と主人公のキャラクターを表情・仕草込みで描く。

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

// ─── キャラクター説明（全ページ共通） ────────────────────────────────
const HEROINE = 'a cute 6-year-old girl with short straight black hair and a small white ribbon clip, wearing a soft yellow dress with a white collar and small white buttons, white mary jane shoes, big bright brown eyes, round face with rosy cheeks';

const RIKU    = 'a tiny adorable green forest kobito sprite boy about half the height of the girl, with short spiky mint-green hair, small leaf-shaped pointed ears, wearing a green tunic and a tiny acorn-cap hat, bright friendly green eyes, cheerful confident smile, chubby small hands';

const MIMI    = 'a tiny adorable pink forest kobito sprite girl about half the height of the girl, with short wavy pink hair and a tiny star-shaped pink clip, wearing a white dress with small pink star patterns, big round sparkly blue eyes, rosy pink cheeks, sweet gentle smile, small chubby arms';

// ─── 共通スタイル ─────────────────────────────────────────────────
const STYLE = 'soft warm watercolor children\'s picture book illustration, gentle pastel colors, rounded expressive shapes, clean composition, magical forest setting, child-friendly, heartwarming atmosphere, no text, no words, no letters, portrait orientation';

// ─── 6ページ分のプロンプト ──────────────────────────────────────────
const PAGES = [
  // ページ1: 朝の森、ぼうけんスタート！
  {
    file: 'book4_p1.png',
    prompt: `A joyful morning scene in a magical sunlit forest clearing. ${HEROINE} stands center with arms spread wide and a huge excited smile, eyes sparkling with anticipation. To her right, ${RIKU} pumps his tiny fist in the air with great enthusiasm, jumping slightly off the ground. To her left, ${MIMI} claps her small hands together with pure delight, eyes crinkled in a big smile. Golden morning sunlight filters through tall trees creating glowing rays, colorful wildflowers bloom around their feet, sparkles and tiny butterflies in the air. All three characters look excited and ready for adventure. ${STYLE}`,
  },
  // ページ2: うさぎとの出会い
  {
    file: 'book4_p2.png',
    prompt: `On a magical enchanted forest path with glowing mushrooms and soft fireflies, ${HEROINE} kneels down with a delighted surprised expression, one hand over her open mouth in joyful shock, eyes wide and sparkling. Right in front of her, a fluffy white rabbit with large pink-tipped ears sits up tall, front paws raised high in an excited wave greeting, nose twitching, with a big warm friendly smile. The path is dappled with magical golden light filtering through tall trees. Both characters are expressive and full of life. ${STYLE}`,
  },
  // ページ3: みずうみとことり
  {
    file: 'book4_p3.png',
    prompt: `At the edge of a beautiful serene crystal-clear blue forest lake surrounded by pink and white water lilies, ${HEROINE} stands with both hands pressed to her rosy cheeks, eyes wide and sparkling with awe and wonder, mouth softly open in amazement. A small round cheerful yellow bird sits on a large pink water lily pad near the shore, wings gently spread slightly, head tilted toward the girl with a warm friendly expression. A beautiful rainbow arches across the sky over the lake. The scene is peaceful, dreamy, and full of wonder. ${STYLE}`,
  },
  // ページ4: お花畑とねこ
  {
    file: 'book4_p4.png',
    prompt: `In a bright cheerful flower meadow overflowing with pink, yellow, and purple blooms, ${HEROINE} leans forward laughing with pure delight, one hand playfully pointing, the other on her knee, cheeks pink from giggling. An orange tabby cat with round golden eyes sits sheepishly amid the colorful flowers, ears slightly flattened, giving an embarrassed but cute smile after being discovered, one paw raised slightly. Flower petals drift gently through the sunny air. Both characters are full of personality and charm. ${STYLE}`,
  },
  // ページ5: おおきなきとくま
  {
    file: 'book4_p5.png',
    prompt: `In front of an enormous ancient magical tree with a massive glowing golden-brown trunk, ${HEROINE} stumbles back in playful shock with huge round eyes and hands raised, mouth wide open in a startled gasp. From around the side of the massive tree, a very large but gentle-looking brown bear peeks out with a huge silly goofy grin, one big fluffy paw raised in a friendly wave, eyes soft and kind. Tiny glowing mushrooms and wildflowers dot the base of the great tree. The size contrast is fun and exciting. ${STYLE}`,
  },
  // ページ6: みんなでおいわい
  {
    file: 'book4_p6.png',
    prompt: `A joyful celebration scene in a sunny magical forest clearing. ${HEROINE} stands center with arms wide open and a radiant glowing happy smile. ${RIKU} stands to her right jumping with both fists raised in triumph. ${MIMI} stands to her left twirling with arms outstretched and an ecstatic smile. A fluffy white rabbit hops enthusiastically nearby with ears perked. An orange tabby cat stretches up on tiptoes with front paws raised in celebration. Colorful confetti, sparkles, and tiny stars fill the warm golden air all around them. Everyone radiates pure happiness. ${STYLE}`,
  },
];

// ─── API ヘルパー ────────────────────────────────────────────────
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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  let data = await res.json();
  if (data.status === 'succeeded') return data.output;
  if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
  const pollUrl = data.urls?.get;
  if (!pollUrl) throw new Error('ポーリングURL取得失敗');
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000));
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
  console.log(`📖 絵本ページイラスト ${PAGES.length} 枚を生成します\n`);

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
        'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            prompt: pg.prompt,
            num_outputs: 1,
            aspect_ratio: '9:16',
            output_format: 'png',
            output_quality: 92,
            num_inference_steps: 4,
          } }),
        }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log(' ✅');
    } catch (e) {
      console.log(` ❌ ${e.message.slice(0, 80)}`);
    }
    if (i < PAGES.length - 1) await new Promise(r => setTimeout(r, 14000));
  }

  console.log('\n🎉 絵本ページイラスト生成完了！');
  console.log('次のステップ: git add src/img/book4_p*.png && git commit && git push');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
