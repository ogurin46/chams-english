'use strict';
// ═══════════════════════════════════════════════════════════
// チャムズと えいごの おはなし  紙芝居プレイヤー
// ═══════════════════════════════════════════════════════════

const $ = id => document.getElementById(id);

// ─── 設定・きろく ───
const SAVE_KEY = 'chams_english_v1';
let S = { done:{}, subMode:'both', repeatMode:false };
function loadSave() {
  try { S = { ...S, ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') }; } catch {}
}
function save() { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }

// ─── 音声 ───
// iOS対策: 1つの<audio>要素を使い回す（最初のタップで解放されれば以後ずっと再生できる）
const PLAYER_AUDIO = new Audio();
let _audioUnlocked = false;
function unlockAudio() {
  if (_audioUnlocked) return;
  _audioUnlocked = true;
  try {
    PLAYER_AUDIO.muted = true;
    // 無音の極小WAVで再生権を得る
    PLAYER_AUDIO.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
    const p = PLAYER_AUDIO.play();
    if (p && p.then) p.then(() => { PLAYER_AUDIO.pause(); PLAYER_AUDIO.muted = false; })
                      .catch(() => { PLAYER_AUDIO.muted = false; });
  } catch (e) { PLAYER_AUDIO.muted = false; }
}

// Web Speech APIフォールバック（音声ファイルが無い場合）
function speakFallback(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US'; u.rate = 0.8; u.pitch = 1.1;
  let done = false;
  const fin = () => { if (!done) { done = true; onEnd?.(); } };
  u.onend = u.onerror = fin;
  setTimeout(fin, text.length * 150 + 2000);
  speechSynthesis.speak(u);
}

let _playToken = 0;
function playAudio(src, fallbackText, onEnd) {
  const token = ++_playToken;
  const finish = () => { if (token === _playToken) onEnd?.(); };
  try {
    PLAYER_AUDIO.onended = finish;
    PLAYER_AUDIO.onerror = () => { if (token === _playToken) speakFallback(fallbackText, finish); };
    PLAYER_AUDIO.src = src;
    PLAYER_AUDIO.muted = false;
    const p = PLAYER_AUDIO.play();
    if (p && p.catch) p.catch(() => { if (token === _playToken) speakFallback(fallbackText, finish); });
  } catch (e) { speakFallback(fallbackText, finish); }
}
function stopAudio() {
  _playToken++;
  try { PLAYER_AUDIO.pause(); PLAYER_AUDIO.onended = null; } catch (e) {}
  if (window.speechSynthesis) speechSynthesis.cancel();
}

// ─── 画面管理 ───
const SCREENS = ['title', 'shelf', 'player'];
function showScreen(name) {
  stopAudio();
  clearTimeout(PL.timer);
  SCREENS.forEach(id => $(`screen-${id}`)?.classList.toggle('hidden', id !== name));
}

// ─── タイトル ───
function renderTitle() {
  showScreen('title');
  $('overlay-finish').classList.add('hidden');
  $('overlay-phrases').classList.add('hidden');
}

// ─── 本棚（おはなし選択） ───
function renderShelf() {
  showScreen('shelf');
  $('overlay-finish').classList.add('hidden');
  const total = Object.values(S.done).reduce((a, b) => a + b, 0);
  $('shelf-stars').textContent = `⭐×${total}`;

  const list = $('story-list');
  list.innerHTML = '';
  STORIES.forEach((st, si) => {
    const doneCount = S.done[st.id] || 0;
    const card = document.createElement('button');
    card.className = 'story-card';
    card.innerHTML = `
      <span class="story-emoji">${st.emoji}</span>
      <span class="story-info">
        <span class="story-title-en">${st.title}</span>
        <span class="story-title-jp">${st.jpTitle}</span>
        <span class="story-learn">${st.learn.map(l => `<i>${l}</i>`).join('')}</span>
      </span>
      <span class="story-stars">${doneCount ? '⭐'.repeat(Math.min(doneCount, 3)) + (doneCount > 3 ? `×${doneCount}` : '') : ''}</span>`;
    card.addEventListener('click', () => { unlockAudio(); startStory(si); });
    list.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════
// 紙芝居プレイヤー
// ═══════════════════════════════════════════════════════════
let PL = { si:0, ci:0, li:0, playing:true, timer:null, phase:'talk' };

// みつけた時のチャイム（Web Audio・音声ファイル不要）
let _AC = null;
function chime(found) {
  try {
    _AC = _AC || new (window.AudioContext || window.webkitAudioContext)();
    if (_AC.state === 'suspended') _AC.resume();
    const seq = found ? [[660,0], [880,0.09], [1320,0.18]] : [[220,0]];
    seq.forEach(([f, d]) => {
      const o = _AC.createOscillator(), g = _AC.createGain();
      o.connect(g); g.connect(_AC.destination);
      o.type = 'triangle'; o.frequency.value = f;
      const t = _AC.currentTime + d;
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.2, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.start(t); o.stop(t + 0.25);
    });
  } catch (e) {}
}

function startStory(si) {
  PL = { si, ci:0, li:0, playing:true, timer:null, phase:'talk' };
  showScreen('player');
  updateSubModeBtn();
  updateRepeatBtn();
  updatePlayBtn();
  renderScene(true);
}

function story() { return STORIES[PL.si]; }
function scene() { return story().scenes[PL.ci]; }

function renderScene(andPlay) {
  clearTimeout(PL.timer);
  stopAudio();
  const sc = scene();
  const stage = $('stage');

  // ページめくり演出
  stage.classList.remove('page-flip');
  void stage.offsetWidth;
  stage.classList.add('page-flip');

  $('stage-bg').src = `img/${sc.bg}.png`;
  $('player-title').textContent = `${story().emoji} ${story().title}`;

  // シーンドット
  $('scene-dots').innerHTML = story().scenes.map((_, i) =>
    `<span class="dot ${i === PL.ci ? 'dot-on' : i < PL.ci ? 'dot-done' : ''}"></span>`).join('');

  // かくれんぼシーンなら、まず「さがす」フェーズから
  $('seek-layer').innerHTML = '';
  if (sc.hide && PL.phase !== 'talk-after-seek') {
    PL.phase = 'seek';
    renderSeek(sc);
    return;
  }
  PL.phase = 'talk';

  // キャラクター配置
  const mkChars = (keys, side) => keys.map(k => {
    const c = CAST[k];
    return c && c.img ? `<img src="${c.img}" class="stage-char char-${side}" data-who="${k}" alt="${c.name}">` : '';
  }).join('');
  $('chars-left').innerHTML  = mkChars(sc.left  || [], 'left');
  $('chars-right').innerHTML = mkChars(sc.right || [], 'right');
  $('stage-prop').textContent = sc.prop || '';

  $('repeat-prompt').classList.add('hidden');
  PL.li = 0;
  if (andPlay && PL.playing) PL.timer = setTimeout(() => playLine(), 700);
  else renderSubtitle(sc.lines[0], false);
}

// ─── かくれんぼ（さがすフェーズ） ───
const HIDE_BUSHES = ['🌳', '🌿', '🪨', '🌲'];
function renderSeek(sc) {
  const findKey = sc.hide;
  const find = FIND_LINES[findKey];
  const isChams = findKey === 'chams';
  const targets = isChams ? sc.right : [findKey];

  // 主人公は左に見えている。右側は空
  const c = CAST.heroine;
  $('chars-left').innerHTML  = `<img src="${c.img}" class="stage-char" data-who="heroine" alt="">`;
  $('chars-right').innerHTML = '';
  $('stage-prop').textContent = '';
  $('repeat-prompt').classList.add('hidden');

  // かくれる場所を4つ用意して、どれか1つにターゲットが隠れる
  const layer = $('seek-layer');
  layer.innerHTML = '';
  const spots = [
    { left:'6%',  bottom:'4%'  },
    { left:'30%', bottom:'10%' },
    { left:'54%', bottom:'5%'  },
    { left:'76%', bottom:'12%' },
  ];
  const targetSpot = Math.floor(Math.random() * spots.length);
  const bushes = [...HIDE_BUSHES].sort(() => Math.random() - 0.5);

  spots.forEach((pos, i) => {
    const spot = document.createElement('div');
    spot.className = 'hide-spot';
    spot.style.left = pos.left;
    spot.style.bottom = pos.bottom;
    let inner = '';
    if (i === targetSpot) {
      // 耳や頭が ちょっとだけ みえている
      inner = targets.map(k =>
        `<img src="${CAST[k].img}" class="hide-char" alt="">`).join('');
    }
    inner += `<span class="hide-bush">${bushes[i]}</span>`;
    spot.innerHTML = inner;
    spot.addEventListener('click', () => {
      if (PL.phase !== 'seek') return;
      if (i === targetSpot) {
        // みつけた！
        PL.phase = 'found';
        chime(true);
        spot.classList.add('spot-found');
        renderSubtitle(isChams ? { who:'riku', ...HERE_CHAMS } : { who:findKey, ...HERE_LINE }, false);
        playAudio(`audio/here_${findKey}.mp3`, (isChams ? HERE_CHAMS : HERE_LINE).en, () => {
          PL.timer = setTimeout(() => {
            PL.phase = 'talk-after-seek';
            renderScene(true);
          }, 600);
        });
      } else {
        chime(false);
        spot.classList.remove('spot-wiggle');
        void spot.offsetWidth;
        spot.classList.add('spot-wiggle');
      }
    });
    layer.appendChild(spot);
  });

  // 「Where is ~?」の声＋字幕＋ヒント
  renderSubtitle({ who:'narrator', en:find.en, jp:find.jp }, false);
  $('sub-who').textContent = '🔍';
  playAudio(`audio/find_${findKey}.mp3`, find.en, null);
  const hint = document.createElement('div');
  hint.className = 'seek-hint';
  hint.textContent = '👆 タップして さがしてね！';
  layer.appendChild(hint);
}

function renderSubtitle(line, talking) {
  const subEn = $('sub-en'), subJp = $('sub-jp'), who = $('sub-who');
  const cast = CAST[line.who] || CAST.narrator;
  who.textContent = line.who === 'narrator' ? '📖' : cast.name;
  subEn.textContent = S.subMode !== 'jp'  ? line.en : '';
  subJp.textContent = S.subMode !== 'en'  ? line.jp : '';
  subEn.classList.toggle('hidden', S.subMode === 'jp');
  subJp.classList.toggle('hidden', S.subMode === 'en');
  // 話しているキャラをバウンドさせる
  document.querySelectorAll('.stage-char').forEach(el =>
    el.classList.toggle('talking', talking && el.dataset.who === line.who));
}

function playLine() {
  if (PL.phase === 'seek' || PL.phase === 'found') return; // さがし中はセリフを進めない
  clearTimeout(PL.timer);
  const lines = scene().lines;
  if (PL.li >= lines.length) { onSceneEnd(); return; }
  const line = lines[PL.li];
  renderSubtitle(line, true);
  $('repeat-prompt').classList.add('hidden');

  playAudio(lineAudioPath(PL.si, PL.ci, PL.li), line.en, () => {
    document.querySelectorAll('.stage-char').forEach(el => el.classList.remove('talking'));
    if (!PL.playing) return;
    // まねっこモード: ナレーション以外のセリフの後に「言ってみよう」タイム
    if (S.repeatMode && line.who !== 'narrator') {
      $('repeat-prompt').classList.remove('hidden');
      PL.timer = setTimeout(() => {
        $('repeat-prompt').classList.add('hidden');
        PL.li++;
        playLine();
      }, 4000);
    } else {
      PL.timer = setTimeout(() => { PL.li++; playLine(); }, 700);
    }
  });
}

function onSceneEnd() {
  if (PL.ci < story().scenes.length - 1) {
    PL.ci++;
    PL.phase = 'talk'; // 次のシーンが かくれんぼなら また さがすところから
    PL.timer = setTimeout(() => renderScene(true), 500);
  } else {
    finishStory();
  }
}

// ─── コントロール ───
function togglePlay() {
  PL.playing = !PL.playing;
  updatePlayBtn();
  if (PL.playing) playLine();
  else { clearTimeout(PL.timer); stopAudio(); }
}
function updatePlayBtn() { $('btn-playpause').textContent = PL.playing ? '⏸' : '▶️'; }

function gotoScene(delta) {
  const n = PL.ci + delta;
  if (n < 0 || n >= story().scenes.length) return;
  PL.ci = n;
  PL.phase = 'talk';
  PL.playing = true; updatePlayBtn();
  renderScene(true);
}

function replayScene() {
  PL.phase = 'talk'; // かくれんぼも もういちど
  PL.playing = true; updatePlayBtn();
  renderScene(true);
}

function cycleSubMode() {
  S.subMode = S.subMode === 'en' ? 'both' : S.subMode === 'both' ? 'jp' : 'en';
  save();
  updateSubModeBtn();
  const line = scene().lines[Math.min(PL.li, scene().lines.length - 1)];
  if (line) renderSubtitle(line, false);
}
function updateSubModeBtn() {
  $('btn-submode').textContent =
    S.subMode === 'en' ? '🔤 English' : S.subMode === 'both' ? '🔤 EN＋日' : '🔤 にほんご';
}

function toggleRepeatMode() {
  S.repeatMode = !S.repeatMode;
  save();
  updateRepeatBtn();
}
function updateRepeatBtn() {
  const b = $('btn-repeatmode');
  b.textContent = '🎤 まねっこ';
  b.classList.toggle('mode-on', S.repeatMode);
}

// ─── おはなし おわり ───
function finishStory() {
  stopAudio();
  const st = story();
  S.done[st.id] = (S.done[st.id] || 0) + 1;
  save();
  const praiseIdx = Math.floor(Math.random() * PRAISES.length);
  const praise = PRAISES[praiseIdx];
  $('finish-praise-en').textContent = praise.en;
  $('finish-praise-jp').textContent = S.subMode === 'en' ? '' : praise.jp;
  $('finish-stars').textContent = '⭐'.repeat(Math.min(S.done[st.id], 3));
  spawnConfetti();
  $('overlay-finish').classList.remove('hidden');
  playAudio(`audio/praise_${praiseIdx}.mp3`, praise.en, null);
}

function spawnConfetti() {
  const wrap = $('finish-confetti');
  wrap.innerHTML = '';
  const colors = ['#ff8fd0','#ffd166','#7bdff2','#b9fbc0','#ffadad','#bdb2ff'];
  for (let i = 0; i < 36; i++) {
    const d = document.createElement('div');
    const sz = 7 + Math.random() * 8;
    d.className = 'confetti-piece';
    d.style.cssText = `left:${Math.random()*100}%;top:${-sz}px;width:${sz}px;height:${sz}px;` +
      `background:${colors[i % colors.length]};` +
      `animation:confettiFall ${1.2 + Math.random()}s ${Math.random()*0.6}s ease-in forwards;` +
      `--rot:${Math.random()*720-360}deg;`;
    wrap.appendChild(d);
  }
}

// ─── ことばカード（フレーズ復習） ───
// 全おはなしからユニークな英文と音声ファイルを集める
function buildPhraseList() {
  const map = new Map();
  STORIES.forEach((st, si) => st.scenes.forEach((sc, ci) => sc.lines.forEach((l, li) => {
    if (l.who === 'narrator') return;
    if (!map.has(l.en)) map.set(l.en, { en:l.en, jp:l.jp, src:lineAudioPath(si, ci, li) });
  })));
  return [...map.values()];
}

function showPhrases() {
  unlockAudio();
  const list = $('phrase-list');
  list.innerHTML = '';
  buildPhraseList().forEach(p => {
    const row = document.createElement('button');
    row.className = 'phrase-row';
    row.innerHTML = `
      <span class="phrase-texts">
        <span class="phrase-en">${p.en}</span>
        <span class="phrase-jp">${p.jp}</span>
      </span>
      <span class="phrase-play">🔊</span>`;
    row.addEventListener('click', () => playAudio(p.src, p.en, null));
    list.appendChild(row);
  });
  $('overlay-phrases').classList.remove('hidden');
}

// ─── イベント ───
function initEvents() {
  $('screen-title').addEventListener('click', () => { unlockAudio(); renderShelf(); });

  $('btn-player-close').onclick = () => { renderShelf(); };
  $('btn-playpause').onclick    = togglePlay;
  $('btn-prev').onclick         = () => gotoScene(-1);
  $('btn-next').onclick         = () => gotoScene(1);
  $('btn-replay').onclick       = replayScene;
  $('btn-submode').onclick      = cycleSubMode;
  $('btn-repeatmode').onclick   = toggleRepeatMode;

  $('btn-finish-again').onclick = () => { $('overlay-finish').classList.add('hidden'); startStory(PL.si); };
  $('btn-finish-done').onclick  = () => renderShelf();

  $('btn-phrases').onclick       = showPhrases;
  $('btn-phrases-close').onclick = () => { stopAudio(); $('overlay-phrases').classList.add('hidden'); };

  // まねっこプロンプトはタップで先に進める
  $('repeat-prompt').onclick = () => {
    clearTimeout(PL.timer);
    $('repeat-prompt').classList.add('hidden');
    PL.li++;
    playLine();
  };
}

// ─── 初期化 ───
window.addEventListener('DOMContentLoaded', () => {
  loadSave();
  initEvents();
  renderTitle();
});
