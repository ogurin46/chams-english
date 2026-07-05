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
  dog:      { name:'いぬくん',     img:'img/animal_dog.png',       voice:'Friendly_Person' },
  penguin:  { name:'ぺんぎんくん', img:'img/animal_penguin.png',   voice:'Sweet_Girl_2' },
  dolphin:  { name:'いるかちゃん', img:'img/animal_dolphin.png',   voice:'Sweet_Girl_2' },
  turtle:   { name:'かめじいさん', img:'img/animal_turtle.png',    voice:'Deep_Voice_Man' },
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

// ═══════════════════════════════════════════════════════════
// シリーズ①「チャムズの へんしんマジック」
//   まほうが しっぱいして からだの パーツが へんな ばしょに！
//   おかしいところを タップ →「Where are the ears?」で なおす
// ═══════════════════════════════════════════════════════════
const HENSHIN_LINES = {
  spell: { en:'Abracadabra!',          jp:'えいっ！',                       voice:'Sweet_Girl_2'  },
  wrong: { en:"Oh no! What's wrong?",  jp:'あれれ！？どこか おかしいよ！', voice:'Wise_Woman'    },
  fixed: { en:'Ta-da! All better!',    jp:'じゃーん！なおったよ！',         voice:'Sweet_Girl_2'  },
};

// pos は ステージ内の % 座標（left, top）
const HENSHIN_PUZZLES = [
  { animal:'rabbit',  part:'👂👂', q:{ en:'Where are the ears?',  jp:'おみみは どこ？' },   a:{ en:'They are on the feet!', jp:'あしに ついてる！' },
    wrongPos:{ left:'50%', top:'86%' }, fixPos:{ left:'50%', top:'4%' } },
  { animal:'bear',    part:'👃',   q:{ en:'Where is the nose?',   jp:'おはなは どこ？' },   a:{ en:"It's on the tummy!",    jp:'おなかに ついてる！' },
    wrongPos:{ left:'50%', top:'64%' }, fixPos:{ left:'50%', top:'28%' } },
  { animal:'cat',     part:'tail', q:{ en:'Where is the tail?',   jp:'しっぽは どこ？' },   a:{ en:"It's on the head!",     jp:'あたまに ついてる！' },
    wrongPos:{ left:'50%', top:'2%' },  fixPos:{ left:'82%', top:'70%' } },
  { animal:'bird',    part:'🪽🪽', q:{ en:'Where are the wings?', jp:'つばさは どこ？' },   a:{ en:'They are on the head!', jp:'あたまに ついてる！' },
    wrongPos:{ left:'50%', top:'2%' },  fixPos:{ left:'50%', top:'50%' } },
  { animal:'dog',     part:'👄',   q:{ en:'Where is the mouth?',  jp:'おくちは どこ？' },   a:{ en:"It's on the head!",     jp:'あたまの うえに ついてる！' },
    wrongPos:{ left:'50%', top:'2%' },  fixPos:{ left:'50%', top:'40%' } },
  { animal:'panda',   part:'🦶🦶', q:{ en:'Where are the feet?',  jp:'あしは どこ？' },     a:{ en:'They are on the head!', jp:'あたまに ついてる！' },
    wrongPos:{ left:'50%', top:'2%' },  fixPos:{ left:'50%', top:'90%' } },
  { animal:'fox',     part:'👂👂', q:{ en:'Where are the ears?',  jp:'おみみは どこ？' },   a:{ en:'They are on the tail!', jp:'しっぽに ついてる！' },
    wrongPos:{ left:'80%', top:'70%' }, fixPos:{ left:'50%', top:'4%' } },
  { animal:'penguin', part:'🪽🪽', q:{ en:'Where are the wings?', jp:'つばさは どこ？' },   a:{ en:'They are on the feet!', jp:'あしに ついてる！' },
    wrongPos:{ left:'50%', top:'88%' }, fixPos:{ left:'50%', top:'48%' } },
  { animal:'dolphin', part:'tail', q:{ en:'Where is the tail?',   jp:'しっぽは どこ？' },   a:{ en:"It's on the head!",     jp:'あたまに ついてる！' },
    wrongPos:{ left:'50%', top:'2%' },  fixPos:{ left:'20%', top:'75%' } },
  { animal:'turtle',  part:'👃',   q:{ en:'Where is the nose?',   jp:'おはなは どこ？' },   a:{ en:"It's on the back!",     jp:'こうらに ついてる！' },
    wrongPos:{ left:'78%', top:'40%' }, fixPos:{ left:'42%', top:'38%' } },
];

// ═══════════════════════════════════════════════════════════
// シリーズ②「チャムズの おみせやさん」
//   まいかい ちがう おきゃくさんが きて、おなじ きまりもんくで
//   おかいものを する。ちゅうもんの しなものは こどもが えらぶ！
// ═══════════════════════════════════════════════════════════
const SHOP_CUSTOMERS = {
  dino:     { name:'ディノ',       en:'Dino',     img:'img/cust_dino.png',     voice:'Deep_Voice_Man'  },
  unicorn:  { name:'ユニコ',       en:'Uni',      img:'img/cust_unicorn.png',  voice:'Sweet_Girl_2'    },
  princess: { name:'プリンセス',   en:'Lily',     img:'img/cust_princess.png', voice:'Lively_Girl'     },
  robot:    { name:'ロボくん',     en:'Robo',     img:'img/cust_robot.png',    voice:'Friendly_Person' },
  ghost:    { name:'おばけちゃん', en:'Boo',      img:'img/cust_ghost.png',    voice:'Wise_Woman'      },
};

// まいかい おなじ きまりもんく（チャムズ＝店員リクの声）
const SHOP_FIXED = {
  knock:   { en:'Knock, knock!',        jp:'コンコン！',               voice:'Wise_Woman' },
  nameQ:   { en:"What's your name?",    jp:'おなまえは？',             voice:'Friendly_Person' },
  meet:    { en:'Nice to meet you!',    jp:'はじめまして！',           voice:'Friendly_Person' },
  orderQ:  { en:'What would you like?', jp:'なにに しますか？',       voice:'Friendly_Person' },
  here:    { en:'Here you are!',        jp:'はい、どうぞ！',           voice:'Friendly_Person' },
  welcome: { en:"You're welcome!",      jp:'どういたしまして！',       voice:'Friendly_Person' },
  see:     { en:'See you next time!',   jp:'また きてね！',           voice:'Friendly_Person' },
};
// おきゃくさんの きまりもんく（それぞれの声で生成）
const SHOP_CUST_LINES = {
  hello:  { en:'Hello!',                 jp:'こんにちは！' },
  meet2:  { en:'Nice to meet you, too!', jp:'こちらこそ はじめまして！' },
  thanks: { en:'Thank you!',             jp:'ありがとう！' },
  bye:    { en:'Goodbye!',               jp:'さようなら！' },
  no:     { en:'No, thank you!',         jp:'それじゃ ないよ〜！' },
};

const SHOP_EPISODES = [
  {
    id:'ep1', customer:'dino', themeJp:'くだもの', themeEn:'Fruits', emoji:'🍎',
    items:['🍎', '🍌', '🍊'],
    order:{ itemIdx:0, en:"I'd like a red apple, please!", jp:'あかい りんごを ください！' },
    happening:{
      anim:'shake',
      lines:[
        { who:'cust',    en:'Ah... ah... Achoo!!', jp:'は…は…はっくしょん！！' },
        { who:'heroine', en:'Are you OK?',         jp:'だいじょうぶ？' },
        { who:'cust',    en:"I'm OK! Thank you!",  jp:'だいじょうぶ！ありがとう！' },
      ],
    },
  },
  {
    id:'ep2', customer:'unicorn', themeJp:'いろ', themeEn:'Colors', emoji:'💙',
    items:['❤️', '💙', '💛'],
    order:{ itemIdx:1, en:"I'd like a blue heart, please!", jp:'あおい ハートを ください！' },
    happening:{
      anim:'fly',
      lines:[
        { who:'narrator', en:'Oh! The hearts are flying!', jp:'あっ！ハートが とんでいく！' },
        { who:'heroine',  en:'Catch them!',                jp:'つかまえて！' },
        { who:'cust',     en:'Got it! So fun!',            jp:'つかまえた！たのしい！' },
      ],
    },
  },
  {
    id:'ep3', customer:'princess', themeJp:'かず', themeEn:'Numbers', emoji:'🔢',
    items:['🍪', '🍪🍪', '🍪🍪🍪'],
    order:{ itemIdx:2, en:"I'd like three cookies, please!", jp:'クッキーを 3まい ください！' },
    happening:{
      anim:'shake',
      lines:[
        { who:'cust',    en:'Oh no! One cookie fell down!', jp:'あら！クッキーが 1まい おちちゃった！' },
        { who:'heroine', en:'Here you go!',                 jp:'はい、どうぞ！' },
        { who:'cust',    en:'Thank you so much!',           jp:'ほんとうに ありがとう！' },
      ],
    },
  },
  {
    id:'ep4', customer:'robot', themeJp:'かたち', themeEn:'Shapes', emoji:'⭐',
    items:['🔵', '🟦', '⭐'],
    order:{ itemIdx:2, en:"I'd like a star, please!", jp:'ほしを ください！' },
    happening:{
      anim:'shake',
      lines:[
        { who:'cust',    en:'Beep... beep... stopping...', jp:'ピー…ピー…とまっちゃう…' },
        { who:'heroine', en:'Are you OK?',                 jp:'だいじょうぶ？' },
        { who:'cust',    en:'Charging OK! Thank you!',     jp:'じゅうでん かんりょう！ありがとう！' },
      ],
    },
  },
  {
    id:'ep5', customer:'ghost', themeJp:'たべもの', themeEn:'Sweets', emoji:'🍰',
    items:['🍰', '🍩', '🍨'],
    order:{ itemIdx:0, en:"I'd like a cake, please!", jp:'ケーキを ください！' },
    happening:{
      anim:'fly',
      lines:[
        { who:'narrator', en:'Oh no! The cake is gone!', jp:'たいへん！ケーキが きえちゃった！' },
        { who:'cust',     en:'Hehehe! It is here!',      jp:'うふふ！ここに あるよ！' },
        { who:'heroine',  en:'You are funny!',           jp:'もう、おちゃめさん！' },
      ],
    },
  },
];
