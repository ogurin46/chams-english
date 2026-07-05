'use strict';
// ═══════════════════════════════════════════════════════════
// チャムズと えいごの おはなし  教材データ
//   くりかえし の パターンで 自然に おぼえる 絵本型英会話
// ═══════════════════════════════════════════════════════════

// ─── 登場キャラクター（声の配役つき） ───
const CAST = {
  narrator: { name:'ナレーター',   img:null,                       voice:'Wise_Woman' },
  heroine:  { name:'わたし',       img:'img/heroine.png',          voice:'Lively_Girl' },
  riku:     { name:'リク',         img:'img/riku.png',             voice:'Friendly_Person' },
  paku:     { name:'パク',         img:'img/paku.png',             voice:'Deep_Voice_Man' },
  mimi:     { name:'ミミ',         img:'img/mimi.png',             voice:'Sweet_Girl_2' },
  rabbit:   { name:'うさちゃん',   img:'img/animal_rabbit.png',    voice:'Sweet_Girl_2' },
  bear:     { name:'くまくん',     img:'img/animal_bear.png',      voice:'Deep_Voice_Man' },
  bird:     { name:'ことりちゃん', img:'img/animal_bird.png',      voice:'Sweet_Girl_2' },
  cat:      { name:'ねこちゃん',   img:'img/animal_cat.png',       voice:'Sweet_Girl_2' },
  panda:    { name:'ぱんださん',   img:'img/animal_panda.png',     voice:'Friendly_Person' },
  fox:      { name:'きつねくん',   img:'img/animal_fox.png',       voice:'Friendly_Person' },
  squirrel: { name:'りすさん',     img:'img/animal_squirrel.png',  voice:'Sweet_Girl_2' },
};

// ─── おはなし（紙芝居） ───
// scene: { bg, left:[キャラ], right:[キャラ], prop:絵文字, lines:[{who, en, jp}] }
// くりかえしパターン: おなじ言い回しが キャラを変えて何度も出てくる
const STORIES = [

  // ─────────── おはなし1 ───────────
  {
    id:'morning', title:'Good Morning!', jpTitle:'おはよう の おはなし',
    emoji:'🌅', bg:'bg_morning',
    learn:['Good morning!','How are you?',"I'm fine, thank you!"],
    scenes:[
      {
        bg:'bg_morning', left:['heroine'], right:[], prop:'☀️',
        lines:[
          { who:'narrator', en:'It is morning in the Words Forest.', jp:'ことばのもりの あさです。' },
          { who:'heroine',  en:'Good morning, sun!',                 jp:'おひさま、おはよう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine'], right:['rabbit'], prop:'', hide:'rabbit',
        lines:[
          { who:'heroine', en:'Good morning, Rabbit!',        jp:'うさちゃん、おはよう！' },
          { who:'rabbit',  en:'Good morning! How are you?',   jp:'おはよう！げんき？' },
          { who:'heroine', en:"I'm fine, thank you!",         jp:'げんきだよ、ありがとう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine'], right:['bear'], prop:'', hide:'bear',
        lines:[
          { who:'heroine', en:'Good morning, Bear!',          jp:'くまくん、おはよう！' },
          { who:'bear',    en:'Good morning! How are you?',   jp:'おはよう！げんき？' },
          { who:'heroine', en:"I'm fine, thank you!",         jp:'げんきだよ、ありがとう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine'], right:['bird'], prop:'', hide:'bird',
        lines:[
          { who:'heroine', en:'Good morning, Bird!',          jp:'ことりちゃん、おはよう！' },
          { who:'bird',    en:'Good morning! How are you?',   jp:'おはよう！げんき？' },
          { who:'heroine', en:"I'm fine, thank you!",         jp:'げんきだよ、ありがとう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine'], right:['riku','paku','mimi'], prop:'', hide:'chams',
        lines:[
          { who:'heroine', en:'Good morning, Chams!',         jp:'チャムズ、おはよう！' },
          { who:'riku',    en:'Good morning!',                jp:'おはよう！' },
          { who:'mimi',    en:'How are you?',                 jp:'げんき？' },
          { who:'heroine', en:"I'm fine, thank you!",         jp:'げんきだよ、ありがとう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine'], right:['riku','paku','mimi'], prop:'🎈',
        lines:[
          { who:'paku',    en:"Let's play together!",         jp:'いっしょに あそぼう！' },
          { who:'heroine', en:"Yes! Let's play!",             jp:'うん！あそぼう！' },
        ],
      },
      {
        bg:'bg_morning', left:['heroine','rabbit'], right:['riku','paku','mimi'], prop:'✨',
        lines:[
          { who:'narrator', en:'What a happy morning!',       jp:'なんて たのしい あさでしょう！' },
          { who:'heroine',  en:'Good morning, everyone!',     jp:'みんな、おはよう！' },
        ],
      },
    ],
  },

  // ─────────── おはなし2 ───────────
  {
    id:'food', title:'Do You Like Apples?', jpTitle:'すきな たべもの の おはなし',
    emoji:'🍎', bg:'bg_picnic',
    learn:['Do you like ~?','Yes, I do!',"No, I don't.",'Yummy!'],
    scenes:[
      {
        bg:'bg_picnic', left:['heroine'], right:[], prop:'🧺',
        lines:[
          { who:'narrator', en:'It is lunch time.',           jp:'おひるごはんの じかんです。' },
          { who:'heroine',  en:"I'm hungry!",                 jp:'おなか すいたー！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine'], right:['rabbit'], prop:'🍎', hide:'rabbit',
        lines:[
          { who:'rabbit',  en:'Do you like apples?',          jp:'りんごは すき？' },
          { who:'heroine', en:'Yes, I do! Yummy!',            jp:'うん、すき！おいしい！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine'], right:['bear'], prop:'🍯', hide:'bear',
        lines:[
          { who:'bear',    en:'Do you like honey?',           jp:'はちみつは すき？' },
          { who:'heroine', en:'Yes, I do! Yummy!',            jp:'うん、すき！おいしい！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine'], right:['cat'], prop:'🐟', hide:'cat',
        lines:[
          { who:'cat',     en:'Do you like fish?',            jp:'おさかなは すき？' },
          { who:'heroine', en:"No, I don't.",                 jp:'ううん、すきじゃないな。' },
          { who:'cat',     en:"That's OK! I love fish!",      jp:'いいのよ！わたしは だいすき！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine'], right:['panda'], prop:'🥕', hide:'panda',
        lines:[
          { who:'heroine', en:'Do you like carrots?',         jp:'にんじんは すき？' },
          { who:'panda',   en:"No, I don't. I like bamboo!",  jp:'ううん。ぼくは たけのこが すき！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine'], right:['paku'], prop:'🍌', hide:'paku',
        lines:[
          { who:'paku',    en:'Do you like bananas?',         jp:'バナナは すき？' },
          { who:'heroine', en:'Yes, I do!',                   jp:'うん、すき！' },
          { who:'paku',    en:'Me too!',                      jp:'ぼくも！' },
        ],
      },
      {
        bg:'bg_picnic', left:['heroine','rabbit','cat'], right:['riku','paku','mimi'], prop:'🍽️',
        lines:[
          { who:'heroine',  en:"Let's eat together!",         jp:'みんなで たべよう！' },
          { who:'riku',     en:'Yummy, yummy!',               jp:'おいしい、おいしい！' },
          { who:'narrator', en:'What a happy lunch!',         jp:'なんて たのしい おひるごはんでしょう！' },
        ],
      },
    ],
  },

  // ─────────── おはなし3 ───────────
  {
    id:'color', title:'What Color Is It?', jpTitle:'いろの おさんぽ の おはなし',
    emoji:'🌈', bg:'bg_flower',
    learn:['What is this?','What color is it?',"It's red!"],
    scenes:[
      {
        bg:'bg_flower', left:['heroine'], right:['mimi'], prop:'',
        lines:[
          { who:'narrator', en:"Let's take a walk.",          jp:'おさんぽに いきましょう。' },
          { who:'heroine',  en:'What a nice day!',            jp:'いい てんきだね！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine'], right:['mimi'], prop:'🌹', hide:'mimi',
        lines:[
          { who:'mimi',    en:'Look! What is this?',          jp:'みて！これは なに？' },
          { who:'heroine', en:"It's a flower!",               jp:'おはなだよ！' },
          { who:'mimi',    en:'What color is it?',            jp:'なにいろ？' },
          { who:'heroine', en:"It's red!",                    jp:'あかだよ！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine'], right:['riku'], prop:'🍎', hide:'riku',
        lines:[
          { who:'riku',    en:'What is this?',                jp:'これは なに？' },
          { who:'heroine', en:"It's an apple!",               jp:'りんごだよ！' },
          { who:'riku',    en:'What color is it?',            jp:'なにいろ？' },
          { who:'heroine', en:"It's red, too!",               jp:'これも あかだね！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine'], right:['bird'], prop:'☀️', hide:'bird',
        lines:[
          { who:'bird',    en:'What color is the sun?',       jp:'おひさまは なにいろ？' },
          { who:'heroine', en:"It's yellow!",                 jp:'きいろだよ！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine'], right:['paku'], prop:'💙', hide:'paku',
        lines:[
          { who:'paku',    en:'What color is the sky?',       jp:'おそらは なにいろ？' },
          { who:'heroine', en:"It's blue!",                   jp:'あおだよ！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine'], right:['fox'], prop:'🍀', hide:'fox',
        lines:[
          { who:'fox',     en:'What color is the leaf?',      jp:'はっぱは なにいろ？' },
          { who:'heroine', en:"It's green!",                  jp:'みどりだよ！' },
        ],
      },
      {
        bg:'bg_flower', left:['heroine','mimi'], right:['riku','paku','fox'], prop:'🌈',
        lines:[
          { who:'heroine',  en:'Look! A rainbow!',            jp:'みて！にじだよ！' },
          { who:'mimi',     en:'Red, yellow, blue, green!',   jp:'あか、きいろ、あお、みどり！' },
          { who:'riku',     en:'So beautiful!',               jp:'とっても きれい！' },
          { who:'narrator', en:'What a colorful day!',        jp:'なんて カラフルな いちにちでしょう！' },
        ],
      },
    ],
  },
];

// ─── かくれんぼ の こえ ───
// さがすとき: 「Where is ~?」 / みつけたとき: 「Here I am!」
const FIND_LINES = {
  rabbit: { en:'Where is Rabbit?',     jp:'うさちゃんは どこかな？' },
  bear:   { en:'Where is Bear?',       jp:'くまくんは どこかな？' },
  bird:   { en:'Where is Bird?',       jp:'ことりちゃんは どこかな？' },
  cat:    { en:'Where is Cat?',        jp:'ねこちゃんは どこかな？' },
  panda:  { en:'Where is Panda?',      jp:'ぱんださんは どこかな？' },
  fox:    { en:'Where is Fox?',        jp:'きつねくんは どこかな？' },
  riku:   { en:'Where is Riku?',       jp:'リクは どこかな？' },
  paku:   { en:'Where is Paku?',       jp:'パクは どこかな？' },
  mimi:   { en:'Where is Mimi?',       jp:'ミミは どこかな？' },
  chams:  { en:'Where are the Chams?', jp:'チャムズは どこかな？' },
};
const HERE_LINE  = { en:'Here I am!',  jp:'ここだよ！' };
const HERE_CHAMS = { en:'Here we are!', jp:'ここだよ！' };

// ─── おわりの ほめことば（ランダムで1つ再生） ───
const PRAISES = [
  { en:'Great job! See you next time!',     jp:'よくできました！またね！' },
  { en:'You did it! Wonderful!',            jp:'できたね！すばらしい！' },
  { en:'Amazing! You are a super star!',    jp:'すごい！きみは スーパースターだ！' },
];

// ─── まねっこモードの かけごえ ───
const REPEAT_PROMPT = { en:'Repeat after me!', jp:'まねして いってみよう！' };

// 音声ファイル名の決まり: audio/s{おはなし番号}_{シーン番号}_{セリフ番号}.mp3
//                        audio/praise_{番号}.mp3
function lineAudioPath(storyIdx, sceneIdx, lineIdx) {
  return `audio/s${storyIdx + 1}_${sceneIdx}_${lineIdx}.mp3`;
}
