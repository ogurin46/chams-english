'use strict';
// 使い方: node scripts/regen_rabbit.js
// うさちゃんの画像を「顔だけ」→「全身」に作り直す

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
if (!API_KEY) { console.error('❌ .env に REPLICATE_API_TOKEN を設定'); process.exit(1); }

const OUT = path.join(__dirname, '..', 'src', 'img', 'animal_rabbit.png');
const PROMPT = 'full body shot from head to toe of a small white rabbit mascot character ' +
  'standing upright on two feet on the ground, round fluffy body with a cream belly, ' +
  'two short arms, two feet clearly visible, long upright ears with pink inside, ' +
  'cute face with big sparkling eyes, chibi anime mascot style for children, ' +
  'solid flat cel shading, thick crisp outlines, whole character in frame with space above head, ' +
  'plain pure white background, kawaii';

const HEADERS = { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json', 'Prefer': 'wait=60' };

async function waitForResult(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 120)}`);
  let data = await res.json();
  if (data.status === 'succeeded') return data.output;
  if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
  const pollUrl = data.urls?.get;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const pr = await fetch(pollUrl, { headers: { 'Authorization': `Bearer ${API_KEY}` } });
    data = await pr.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed')    throw new Error(data.error || '生成失敗');
  }
  throw new Error('タイムアウト');
}

async function main() {
  if (fs.existsSync(OUT)) fs.copyFileSync(OUT, OUT + '.bak');
  process.stdout.write('うさちゃん全身 生成中... ');
  const out1 = await waitForResult(await fetch(
    'https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions',
    { method:'POST', headers:HEADERS, body: JSON.stringify({ input:{
      prompt: PROMPT, num_outputs:1, aspect_ratio:'1:1', output_format:'png', output_quality:100 } }) }
  ));
  const imgUrl = Array.isArray(out1) ? out1[0] : String(out1);
  const verRes = await fetch('https://api.replicate.com/v1/models/cjwbw/rembg', { headers:{ 'Authorization':`Bearer ${API_KEY}` } });
  const version = verRes.ok ? (await verRes.json()).latest_version.id
    : 'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003';
  const out2 = await waitForResult(await fetch(
    'https://api.replicate.com/v1/predictions',
    { method:'POST', headers:HEADERS, body: JSON.stringify({ version, input:{ image: imgUrl } }) }
  ));
  const res = await fetch(Array.isArray(out2) ? out2[0] : String(out2));
  fs.writeFileSync(OUT, Buffer.from(await res.arrayBuffer()));
  console.log('✅ 完了');
}
main().catch(e => { console.error('エラー:', e.message); process.exit(1); });
