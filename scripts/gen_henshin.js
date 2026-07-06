'use strict';
// 使い方: node scripts/gen_henshin.js
// へんしんマジック用「おかしい どうぶつ」画像(8枚) + Q&A音声(16本)を生成する。
// 既存ファイルはスキップ。旧 henshin_q/a_*.mp3 は自動削除して再生成。

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

// data.js から HENSHIN_PUZZLES を読み込む
const sandbox = {};
vm.createContext(sandbox);
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'js', 'data.js'), 'utf8');
const { HENSHIN_PUZZLES } = vm.runInContext(
  dataCode + '\n;({ HENSHIN_PUZZLES })', sandbox
);

// ─── 各パズル の 画像プロンプト ───────────────────────────────
// HENSHIN_PUZZLES の順序に対応 (p0〜p7)
const IMG_PROMPTS = [
  // p0: うさぎ + ゾウのはな
  'cute chibi white rabbit standing upright with a long grey elephant trunk hanging from its face instead of a tiny nose, trunk is very prominent, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible, friendly smile',
  // p1: とり + キツネのしっぽ
  'cute chibi yellow chick bird standing on two feet with a big fluffy orange fox tail with white tip attached to its behind, fox tail clearly visible, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible',
  // p2: クマ + うさぎのミミ
  'cute chibi light brown teddy bear standing with very long white rabbit ears on top of its head instead of small round bear ears, bunny ears very prominent, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible',
  // p3: ねこ + さかなのしっぽ
  'cute chibi orange tabby cat standing with a shiny blue fish tail fin where its cat tail should be, fish tail scaly and clearly visible, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible',
  // p4: いぬ + とりのはね
  'cute chibi white puppy dog standing with large colorful bird wings sprouting from its back, wings spread out with feathers visible, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible',
  // p5: ペンギン + キリンのくび
  'cute chibi black and white penguin with an extremely long yellow giraffe neck with brown spots stretching way up, giraffe neck very prominent, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible, surprised expression',
  // p6: カエル + うまのあし
  'cute chibi green frog with long brown horse legs with hooves instead of short stubby frog legs, horse hooves clearly visible at bottom, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible, funny expression',
  // p7: パンダ + ゾウのミミ
  'cute chibi black and white panda standing with huge grey floppy elephant ears on both sides of its head, elephant ears very large and prominent, bright kawaii anime style for young children, thick black outlines, pure white background, full body visible',
];

const CHAR_STYLE_SUFFIX =
  ', no smoke, no fog, no background elements, only the character on plain white';

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
    process.stdout.write(`⏳${wait / 1000}s… `);
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
  try {
    const res = await fetch('https://api.replicate.com/v1/models/cjwbw/rembg', {
      headers: { 'Authorization': `Bearer ${API_KEY}` },
    });
    if (!res.ok) return 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
    const data = await res.json();
    return data.latest_version?.id
      || 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
  } catch {
    return 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
  }
}

async function main() {
  console.log(`🔑 APIキー: ${API_KEY.slice(0, 6)}...${API_KEY.slice(-4)}`);
  console.log(`🎨 画像 ${HENSHIN_PUZZLES.length} 枚 + 音声 ${HENSHIN_PUZZLES.length * 2} 本\n`);

  // ── 旧 henshin Q&A 音声を削除（テキストが変わったため） ──
  console.log('🗑️  旧へんしん音声を削除中...');
  for (let i = 0; i < 12; i++) {
    for (const f of [`henshin_q_${i}.mp3`, `henshin_a_${i}.mp3`]) {
      const p = path.join(AUDIO_DIR, f);
      if (fs.existsSync(p)) { fs.unlinkSync(p); console.log(`   deleted: ${f}`); }
    }
  }

  // ── rembg バージョン取得 ──
  const rembgVersion = await getRembgVersion();

  // ── 画像生成（Flux Schnell + rembg） ──
  console.log('\n🖼️  画像生成 開始...');
  for (let i = 0; i < HENSHIN_PUZZLES.length; i++) {
    const p = HENSHIN_PUZZLES[i];
    const outPath = path.join(IMG_DIR, `hen_p${i}.png`);
    if (fs.existsSync(outPath)) { console.log(`hen_p${i}.png スキップ（既存）`); continue; }

    process.stdout.write(`🖼️  hen_p${i}.png  (${p.a.en.replace('It has ', '').replace('!', '')}) ... `);
    try {
      const out1 = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            prompt: IMG_PROMPTS[i] + CHAR_STYLE_SUFFIX,
            num_outputs: 1, aspect_ratio: '1:1',
            output_format: 'png', output_quality: 100,
          } }),
        }
      ));
      const imgUrl = Array.isArray(out1) ? out1[0] : String(out1);

      // 背景を透過
      const out2 = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ version: rembgVersion, input: { image: imgUrl } }),
        }
      ));
      await download(Array.isArray(out2) ? out2[0] : String(out2), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${String(e.message).slice(0, 60)}`); }

    if (i < HENSHIN_PUZZLES.length - 1) await new Promise(r => setTimeout(r, 13000));
  }

  // ── Q&A 音声生成 ──
  console.log('\n🔊 音声生成 開始...');
  const AUDIO_CLIPS = [];
  HENSHIN_PUZZLES.forEach((p, i) => {
    AUDIO_CLIPS.push({ file: `henshin_q_${i}.mp3`, text: p.q.en, voice: 'Wise_Woman'  });
    AUDIO_CLIPS.push({ file: `henshin_a_${i}.mp3`, text: p.a.en, voice: 'Lively_Girl' });
  });

  for (let i = 0; i < AUDIO_CLIPS.length; i++) {
    const c = AUDIO_CLIPS[i];
    const outPath = path.join(AUDIO_DIR, c.file);
    if (fs.existsSync(outPath)) {
      console.log(`[${i + 1}/${AUDIO_CLIPS.length}] ${c.file} スキップ（既存）`);
      continue;
    }
    process.stdout.write(`[${i + 1}/${AUDIO_CLIPS.length}] ${c.file.padEnd(22)} ${c.voice.padEnd(16)} `);
    try {
      const out = await waitForResult(await fetchWithRetry(
        'https://api.replicate.com/v1/models/minimax/speech-02-turbo/predictions',
        {
          method: 'POST', headers: HEADERS,
          body: JSON.stringify({ input: {
            text: c.text, voice_id: c.voice, speed: 0.9,
            language_boost: 'English', audio_format: 'mp3',
          } }),
        }
      ));
      await download(Array.isArray(out) ? out[0] : String(out), outPath);
      console.log('✅');
    } catch (e) { console.log(`❌ ${String(e.message).slice(0, 60)}`); }
    if (i < AUDIO_CLIPS.length - 1) await new Promise(r => setTimeout(r, 13000));
  }

  console.log('\n🎉 へんしんマジック アセット生成完了！');
}

main().catch(e => { console.error('致命的エラー:', e.message); process.exit(1); });
