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
  { file:'bg_shop.png',    prompt:'cute cozy little shop interior for children, wooden counter at the bottom, colorful shelves, warm lights, candy colors' + BG_STYLE },
];

// キャラクター画像（透過つき）
const CHAR_STYLE = ', bright cheerful anime style for young children, solid flat cel shading, ' +
  'thick crisp clean outlines, big sparkling eyes, friendly smile, front view full body centered, ' +
  'no smoke, no fog, plain pure white background, kawaii';
const CHARACTERS = [
  { file:'cust_dino.png',     prompt:'full body of a cute chibi green baby dinosaur standing on two feet, round belly, tiny arms' + CHAR_STYLE },
  { file:'cust_unicorn.png',  prompt:'full body of a cute chibi white unicorn with rainbow mane, golden horn, standing' + CHAR_STYLE },
  { file:'cust_princess.png', prompt:'full body of a cute chibi little princess girl, golden crown, puffy pink dress, standing' + CHAR_STYLE },
  { file:'cust_robot.png',    prompt:'full body of a cute chibi round friendly robot, light blue metal body, antenna, standing' + CHAR_STYLE },
  { file:'cust_ghost.png',    prompt:'full body of a cute chibi friendly little ghost, round white floating body, rosy cheeks, playful smile' + CHAR_STYLE },
  { file:'part_tail.png',     prompt:'a single cartoon fluffy animal tail, orange with white tip, curved, simple sticker style, thick outlines, plain pure white background, nothing else in frame' },
];

// ─── data.js からセリフを収集 ───
const sandbox = {};
vm.createContext(sandbox);
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'data.js'), 'utf8');
const { STORIES, PRAISES, CAST, REPEAT_PROMPT, FIND_LINES, HERE_LINE, HERE_CHAMS,
        HENSHIN_LINES, HENSHIN_PUZZLES, SHOP_CUSTOMERS, SHOP_FIXED, SHOP_CUST_LINES, SHOP_EPISODES } =
  vm.runInContext(dataCode + '\n;({ STORIES, PRAISES, CAST, REPEAT_PROMPT, FIND_LINES, HERE_LINE, HERE_CHAMS, ' +
    'HENSHIN_LINES, HENSHIN_PUZZLES, SHOP_CUSTOMERS, SHOP_FIXED, SHOP_CUST_LINES, SHOP_EPISODES })', sandbox);

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

// へんしんマジックの声
Object.entries(HENSHIN_LINES).forEach(([key, l]) =>
  CLIPS.push({ file:`henshin_${key}.mp3`, text:l.en, voice:l.voice }));
HENSHIN_PUZZLES.forEach((p, i) => {
  CLIPS.push({ file:`henshin_q_${i}.mp3`, text:p.q.en, voice:'Wise_Woman' });
  CLIPS.push({ file:`henshin_a_${i}.mp3`, text:p.a.en, voice:'Lively_Girl' });
});

// おみせやさんの声
Object.entries(SHOP_FIXED).forEach(([key, l]) =>
  CLIPS.push({ file:`shop_${key}.mp3`, text:l.en, voice:l.voice }));
Object.entries(SHOP_CUSTOMERS).forEach(([ck, cust]) => {
  Object.entries(SHOP_CUST_LINES).forEach(([lk, l]) => {
    const text = lk === 'hello' ? `Hello! I'm ${cust.en}!` : l.en;
    CLIPS.push({ file:`shop_${lk}_${ck}.mp3`, text, voice:cust.voice });
  });
});
SHOP_EPISODES.forEach((ep, ei) => {
  const cust = SHOP_CUSTOMERS[ep.customer];
  CLIPS.push({ file:`shop_order_${ei}.mp3`, text:ep.order.en, voice:cust.voice });
  ep.happening.lines.forEach((l, li) => {
    const voice = l.who === 'cust' ? cust.voice : l.who === 'heroine' ? 'Lively_Girl' : 'Wise_Woman';
    CLIPS.push({ file:`shop_hap_${ei}_${li}.mp3`, text:l.en, voice });
  });
});

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

async function getRembgVersion() {
  const res = await fetch('https://api.replicate.com/v1/models/cjwbw/rembg', {
    headers: { 'Authorization': `Bearer ${API_KEY}` }
  });
  if (!res.ok) return 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
  const data = await res.json();
  return data.latest_version?.id
    || 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
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

  // ── キャラクター画像（背景透過つき） ──
  const needChars = CHARACTERS.filter(c => !fs.existsSync(path.join(IMG_DIR, c.file)));
  if (needChars.length) {
    const rembgVersion = await getRembgVersion();
    for (const c of needChars) {
      process.stdout.write(`🧸 ${c.file.padEnd(20)} `);
      try {
        const out1 = await waitForResult(await fetchWithRetry(
          'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
          { method:'POST', headers:HEADERS, body: JSON.stringify({ input:{
            prompt: c.prompt, num_outputs:1, aspect_ratio:'1:1',
            output_format:'png', output_quality:100 } }) }
        ));
        const imgUrl = Array.isArray(out1) ? out1[0] : String(out1);
        const out2 = await waitForResult(await fetchWithRetry(
          'https://api.replicate.com/v1/predictions',
          { method:'POST', headers:HEADERS, body: JSON.stringify({ version: rembgVersion, input:{ image: imgUrl } }) }
        ));
        await download(Array.isArray(out2) ? out2[0] : String(out2), path.join(IMG_DIR, c.file));
        console.log('✅');
      } catch (e) { console.log(`❌ ${String(e.message).slice(0, 60)}`); }
      await new Promise(r => setTimeout(r, 13000));
    }
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
