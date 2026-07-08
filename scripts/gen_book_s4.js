'use strict';
// 使い方: node scripts/gen_book_s4.js
// おはなし4「What Is It?」の絵本ページイラスト 6枚を生成する。
// チャムズ（リク・ミミ・パク）が主人公の、既存背景画と同じ画風で生成。

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

// ── キャラクター正確な外見描写 ──────────────────────────────────
// リク: 赤い帽子・赤いジャケット・くるくる茶髪・とがった耳
const RIKU = 'Riku, a cute small kobold gnome boy with short curly brown hair and large pointed elf ears, wearing a bright red pointed gnome hat and a red jacket with a brown leather belt, very rosy red cheeks, warm happy brown eyes, small plump stout body with chubby hands';

// ミミ: ピンクの花びら帽子・ピンクのワンピース・茶色ツインテール
const MIMI = 'Mimi, a cute small kobold gnome girl with brown hair in two small pigtails and large pointed elf ears, wearing a pink petal-shaped flower hat and a pink dress with a brown belt and small brown boots, rosy pink cheeks, gentle warm brown eyes, small plump stout body';

// パク: 黄色帽子・黄緑ジャケット・くるくる茶髪
const PAKU = 'Paku, a cute small kobold gnome boy with curly brown hair and large pointed elf ears, wearing a tall pointed yellow gnome hat and a yellow-green jacket with a brown leather belt, big cheerful wide grin showing teeth, very chubby rosy cheeks, small plump stout body';

// 主人公: ピンクロングツインテール・ピンクフリルドレス・虫眼鏡
const HEROINE = 'the heroine, a cute chibi girl with very long wavy pink hair in two side pigtails tied with white ribbon bows, big sparkling pink eyes, wearing a pink frilly layered dress with white ruffles at the collar and hem, a small brown beret hat with a tiny heart, pink shoes';

// ── 共通スタイル（既存 bg_morning/bg_flower に合わせる） ───────────
const STYLE = 'vibrant colorful children\'s picture book digital illustration, warm painterly style with magical glowing light, bright vivid saturated colors, lush detailed forest background with golden sunbeams through tall trees, cute expressive gnome kobold characters with large pointed ears and colorful gnome hats, rosy chubby cheeks, big round expressive eyes, small plump stout bodies, detailed fantasy storybook art, portrait 9:16 format, no text, no words, no letters';

// ── 背景スタイル種別 ─────────────────────────────────────────────
const BG_MORNING = 'lush magical morning forest background with towering green trees, brilliant golden sunbeams streaming through the canopy, warm glowing golden-green light, wildflowers and green grass in foreground, magical sparkling atmosphere';
const BG_PATH    = 'enchanted forest path with glowing golden light through tall trees, colorful mushrooms along the mossy path, soft magical sparkles and fireflies floating in the air, warm green and gold tones';
const BG_LAKE    = 'beautiful serene blue lake surrounded by lush green forest, pink and white water lily pads floating, rainbow arching over the lake, bright blue sky with soft clouds, sparkling water reflections';
const BG_FLOWER  = 'vibrant colorful flower meadow with sunflowers, daisies, red poppies and purple wildflowers in full bloom, bright blue sky, butterflies flying, warm sunny light, lush green grass path through the flowers';
const BG_TREE    = 'enormous ancient magical tree with a very wide glowing golden-brown trunk, glowing mushrooms and colorful wildflowers at the base, soft magical light filtering through huge spreading branches, sense of wonder and great scale';
const BG_PARTY   = 'sunny magical forest clearing with golden light, colorful sparkles and confetti falling from above, wildflowers and green trees all around, festive joyful warm atmosphere, bright vivid colors everywhere';

// ── 6ページ分のプロンプト ──────────────────────────────────────────
const PAGES = [
  // ページ1: ぼうけんスタート！（主役：リク・ミミ・パク）
  {
    file: 'book4_p1.png',
    prompt: `${BG_MORNING}. In the foreground, three small gnome characters: ${RIKU} stands in the center pointing forward enthusiastically with a huge excited grin and his other fist raised up. To his left ${MIMI} claps both hands together up high with pure delight and sparkling eyes. To his right ${PAKU} jumps slightly off the ground with both arms raised celebrating, mouth wide open in joy. Behind them ${HEROINE} waves her hand with a big smile, ready for adventure. All four characters are facing the viewer with warm expressive faces. ${STYLE}`,
  },
  // ページ2: うさちゃんと出会う！（主役：リク・ミミ）
  {
    file: 'book4_p2.png',
    prompt: `${BG_PATH}. In the foreground, ${RIKU} crouches down on the path with a delighted surprised face, mouth open in happy shock and eyes wide, reaching one hand out. Behind him ${MIMI} peeks over his shoulder with both hands over her cheeks in joyful surprise, eyes wide and sparkling. Directly in front of them, a fluffy white rabbit with large pink-tipped long ears sits up tall on its hind legs, front paws raised high in a cheerful wave greeting, big bright eyes and a warm friendly smile, nose twitching. ${HEROINE} stands slightly behind them, pointing at the rabbit with excitement and delight. ${STYLE}`,
  },
  // ページ3: みずうみとことり！（主役：ミミ・リク）
  {
    file: 'book4_p3.png',
    prompt: `${BG_LAKE}. Standing at the lakeshore in the foreground, ${MIMI} presses both her small chubby hands to her very rosy cheeks with an expression of pure amazed wonder, eyes wide and sparkling with tears of joy, mouth softly open. Beside her ${RIKU} spreads his arms wide to gesture at the whole magnificent lake, grinning with awe and pride. ${PAKU} points enthusiastically at the rainbow with a huge excited grin. On a large pink water lily pad very close to shore, a small chubby round yellow bird sits with wings slightly spread, head tilted and smiling warmly at the gnomes. ${HEROINE} stands nearby also looking amazed. ${STYLE}`,
  },
  // ページ4: ねこちゃんはっけん！（主役：パク・ミミ）
  {
    file: 'book4_p4.png',
    prompt: `${BG_FLOWER}. In the foreground among the colorful flowers, ${PAKU} bends forward laughing loudly with his whole body, hands on his knees, mouth wide open in a big delighted guffaw. Beside him ${MIMI} covers her mouth with both hands, eyes crinkled with giggles, shoulders shaking. ${RIKU} points with one finger at something nearby, grinning. Sitting in the flower patch very close by, a fluffy orange tabby cat with golden eyes sits with both ears slightly flattened, giving a sheepish embarrassed cute smile after being discovered hiding, one paw raised awkwardly. ${HEROINE} stands behind the gnomes also laughing and pointing. ${STYLE}`,
  },
  // ページ5: おおきなきとくま！（主役：リク・パク・ミミ）
  {
    file: 'book4_p5.png',
    prompt: `${BG_TREE}. In front of the enormous tree trunk, ${RIKU} stumbles backward in playful shock with both hands raised up, eyes enormous and round in surprise, mouth wide open in a startled gasp. ${PAKU} jumps behind Riku and peeks out from behind him with wide frightened but excited eyes. ${MIMI} clings to Riku's arm, also startled but starting to smile. From around the edge of the massive tree trunk, a very large but gentle-looking friendly brown bear peeks out with a huge silly toothy grin and one enormous fluffy paw raised in a cheerful wave, soft kind warm eyes. ${HEROINE} stands to the side with hands over mouth in shock. ${STYLE}`,
  },
  // ページ6: みんなでおいわい！（全員集合）
  {
    file: 'book4_p6.png',
    prompt: `${BG_PARTY}. A joyful group celebration scene. ${RIKU} stands center with both fists raised high in a triumphant victory pose, grinning from ear to ear. ${MIMI} twirls happily with arms outstretched and a radiant smile, her pink dress spinning. ${PAKU} jumps into the air with both arms and legs spread wide in pure unbridled joy. ${HEROINE} stands beside them with arms open wide and a glowing happy smile. A fluffy white rabbit hops nearby with ears perked up joyfully. An orange tabby cat stretches up on its hind legs with front paws raised in celebration. Colorful sparkles, falling flower petals, and tiny stars fill the warm golden air all around all the characters. ${STYLE}`,
  },
];

// ── API ヘルパー ─────────────────────────────────────────────────
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
  console.log(`📖 チャムズ主役の絵本ページ ${PAGES.length} 枚を生成します\n`);
  console.log('キャラクター:');
  console.log('  🔴 リク: 赤い帽子・赤ジャケット・とがった耳');
  console.log('  🩷 ミミ: ピンク花びら帽子・ピンクワンピース');
  console.log('  🟡 パク: 黄色帽子・黄緑ジャケット');
  console.log('  💗 主人公: ピンクツインテール・ピンクフリルドレス\n');

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
            output_quality: 95,
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
  console.log('git add src/img/book4_p*.png && git commit -m "..." && git push');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
