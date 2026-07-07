'use strict';
// 使い方: node scripts/gen_story4.js
// おはなし4「What Is It?」の背景3枚 + EN/JP 音声を生成する。
// 既存ファイルはスキップ。

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

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

const IMG_DIR   = path.join(__dirname, '..', 'src', 'img');
const AUDIO_DIR = path.join(__dirname, '..', 'src', 'audio');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

// data.js から STORIES と CAST を読み込む
const sandbox = {};
vm.createContext(sandbox);
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'data.js'), 'utf8');
const { STORIES, CAST } = vm.runInContext(dataCode + '\n;({ STORIES, CAST })', sandbox);

const STORY_IDX = 3;
const story4 = STORIES[STORY_IDX];
if (!story4 || !story4.bilingual) {
  console.error('STORIES[3] のバイリンガル絵本が見つかりません'); process.exit(1);
}

// ── 背景画像プロンプト（新規3枚） ──────────────────────────────
const BG_STYLE = ', warm storybook illustration for young children, soft watercolor style, no characters, no people, no animals, wide open space in the center, gentle magical light, vibrant colors';

const BACKGROUNDS = [
  {
    file: 'bg_s4_1.png',
    prompt: 'enchanted magical forest path winding through tall trees with dappled golden sunlight, glowing green fireflies floating in the air, colorful wildflowers along the mossy path, sense of adventure and wonder, dreamy fairy tale atmosphere' + BG_STYLE,
  },
  {
    file: 'bg_s4_2.png',
    prompt: 'beautiful serene forest lake with crystal clear deep blue water, pink and white water lily pads floating on the surface, gentle ripples, rainbow arch over the lake, lush green trees reflected in the water, peaceful dreamy atmosphere' + BG_STYLE,
  },
  {
    file: 'bg_s4_3.png',
    prompt: 'enormous ancient magical tree with a massive golden brown trunk, glowing golden and green leaves on wide spreading branches, colorful mushrooms and tiny wildflowers at the base of the roots, soft rays of magical light filtering through the canopy, sense of wonder and discovery' + BG_STYLE,
  },
];

// ── 音声クリップ一覧（EN + JP） ────────────────────────────────
const CLIPS = [];
story4.scenes.forEach((sc, ci) => {
  sc.lines.forEach((l, li) => {
    const castEntry = CAST[l.who] || CAST.narrator;
    CLIPS.push({
      file:  `s${STORY_IDX + 1}_${ci}_${li}_en.mp3`,
      text:  l.en,
      voice: castEntry.voice,
      lang:  'English',
    });
    CLIPS.push({
      file:  `s${STORY_IDX + 1}_${ci}_${li}_jp.mp3`,
      text:  l.jp,
      voice: castEntry.voice,
      lang:  'Japanese',
    });
  });
});

// ── API ヘルパー ────────────────────────────────────────────
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
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
  let data = await res.json();
  if (data.status === 'succeeded') return data.output;
  if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
  const pollUrl = data.urls?.get;
  if (!pollUrl) throw new Error('ポーリングURL取得失敗');
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const pr = await fetch(pollUrl, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    data = await pr.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
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
  console.log(`📖 おはなし4「${story4.title}」(${story4.jpTitle})`);
  console.log(`🖼️  背景 ${BACKGROUNDS.length} 枚 / 🔊 音声 ${CLIPS.length} 本\n`);

  // ── 背景画像生成（Flux Schnell 9:16） ──
  console.log('🖼️  背景画像を生成中...');
  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const bg = BACKGROUNDS[i];
    const outPath = path.join(IMG_DIR, bg.file);
    if (fs.existsSync(outPath)) { console.log(`  ${bg.file} スキップ（既存）`); continue; }
    process.stdout.write(`  ${bg.file.padEnd(16)} `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            prompt: bg.prompt, num_outputs: 1, aspect_ratio: '9:16',
            output_format: 'png', output_quality: 90,
          } }),
        }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${e.message.slice(0, 80)}`); }
    if (i < BACKGROUNDS.length - 1) await new Promise(r => setTimeout(r, 13000));
  }

  // ── 音声生成（MiniMax speech-02-turbo） ──
  console.log('\n🔊 音声生成 開始...');
  for (let i = 0; i < CLIPS.length; i++) {
    const c = CLIPS[i];
    const outPath = path.join(AUDIO_DIR, c.file);
    if (fs.existsSync(outPath)) {
      console.log(`[${String(i + 1).padStart(2)}/${CLIPS.length}] ${c.file} スキップ（既存）`);
      continue;
    }
    process.stdout.write(`[${String(i + 1).padStart(2)}/${CLIPS.length}] ${c.file.padEnd(26)} ${c.voice.padEnd(18)} `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/minimax/speech-02-turbo/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            text: c.text,
            voice_id: c.voice,
            speed: c.lang === 'Japanese' ? 0.85 : 0.9,
            language_boost: c.lang,
            audio_format: 'mp3',
          } }),
        }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${e.message.slice(0, 80)}`); }
    if (i < CLIPS.length - 1) await new Promise(r => setTimeout(r, 13000));
  }

  console.log('\n🎉 おはなし4 アセット生成完了！');
  console.log('次のステップ: git add + commit + push');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
