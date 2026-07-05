'use strict';
// 使い方: node scripts/generate_assets.js
// ①紙芝居の背景画像（Flux Schnell）と ②全セリフの英語音声（MiniMax TTS）を生成する。
// data.js から自動でセリフを収集するので、おはなしを追加したら再実行するだけ。
// 既に存在するファイルはスキップ（差分生成）。

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
if (!API_KEY) { console.error('❌ .env に REPLICATE_API_TOKEN を設定'); process.exit(1); }

const IMG_DIR   = path.join(__dirname, '..', 'src', 'img');
const AUDIO_DIR = path.join(__dirname, '..', 'src', 'audio');
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });

// ─── 背景画像の定義 ───
const BG_STYLE = ', warm storybook illustration for young children, soft watercolor style, ' +
  'no characters, no people, no animals, wide open space in the center, gentle light';
const BACKGROUNDS = [
  { file:'bg_morning.png', prompt:'sunrise morning forest clearing, golden sunlight rays through trees, dew on grass, soft pink and orange sky' + BG_STYLE },
  { file:'bg_picnic.png',  prompt:'sunny green meadow with a red checkered picnic blanket, blue sky with fluffy clouds, flowers around' + BG_STYLE },
  { file:'bg_flower.png',  prompt:'colorful flower field with a small walking path, bright daytime, butterflies far away, blue sky' + BG_STYLE },
];

// ─── data.js からセリフを収集 ───
const sandbox = {};
vm.createContext(sandbox);
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'data.js'), 'utf8');
const { STORIES, PRAISES, CAST, REPEAT_PROMPT, FIND_LINES, HERE_LINE, HERE_CHAMS } =
  vm.runInContext(dataCode + '\n;({ STORIES, PRAISES, CAST, REPEAT_PROMPT, FIND_LINES, HERE_LINE, HERE_CHAMS })', sandbox);

const CLIPS = [];
// かくれんぼの声: 「Where is ~?」(ナレーター) と 「Here I am!」(そのキャラの声)
Object.entries(FIND_LINES).forEach(([key, l]) => {
  CLIPS.push({ file:`find_${key}.mp3`, text:l.en, voice:'Wise_Woman' });
  const voice = key === 'chams' ? CAST.riku.voice : (CAST[key] || CAST.narrator).voice;
  const here  = key === 'chams' ? HERE_CHAMS : HERE_LINE;
  CLIPS.push({ file:`here_${key}.mp3`, text:here.en, voice });
});
STORIES.forEach((story, si) => {
  story.scenes.forEach((scene, ci) => {
    scene.lines.forEach((line, li) => {
      CLIPS.push({
        file: `s${si + 1}_${ci}_${li}.mp3`,
        text: line.en,
        voice: (CAST[line.who] || CAST.narrator).voice,
      });
    });
  });
});
PRAISES.forEach((p, i) => CLIPS.push({ file:`praise_${i}.mp3`, text:p.en, voice:'Wise_Woman' }));
CLIPS.push({ file:'repeat_prompt.mp3', text:REPEAT_PROMPT.en, voice:'Wise_Woman' });

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
    process.stdout.write(`⏳${wait/1000}s… `);
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
  console.log(`🖼️ 背景 ${BACKGROUNDS.length} 枚 / 🔊 セリフ ${CLIPS.length} 本\n`);

  // ── 背景画像 ──
  for (const bg of BACKGROUNDS) {
    const outPath = path.join(IMG_DIR, bg.file);
    if (fs.existsSync(outPath)) { console.log(`${bg.file} スキップ（既存）`); continue; }
    process.stdout.write(`🖼️ ${bg.file.padEnd(18)} `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
        { method: 'POST', headers: HEADERS, body: JSON.stringify({ input: {
          prompt: bg.prompt, num_outputs: 1, aspect_ratio: '9:16',
          output_format: 'png', output_quality: 90,
        } }) }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${e.message}`); }
    await new Promise(r => setTimeout(r, 13000));
  }

  // ── セリフ音声 ──
  for (let i = 0; i < CLIPS.length; i++) {
    const c = CLIPS[i];
    const outPath = path.join(AUDIO_DIR, c.file);
    if (fs.existsSync(outPath)) { console.log(`[${i+1}/${CLIPS.length}] ${c.file} スキップ（既存）`); continue; }
    process.stdout.write(`[${i+1}/${CLIPS.length}] ${c.file.padEnd(16)} ${c.voice.padEnd(16)} `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/minimax/speech-02-turbo/predictions',
        { method: 'POST', headers: HEADERS, body: JSON.stringify({ input: {
          text: c.text, voice_id: c.voice, speed: 0.9,
          language_boost: 'English', audio_format: 'mp3',
        } }) }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${String(e.message).slice(0, 60)}`); }
    if (i < CLIPS.length - 1) await new Promise(r => setTimeout(r, 13000));
  }
  console.log('\n🎉 アセット生成完了！');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
