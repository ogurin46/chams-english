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

  // ─────────── おはなし4 ───────────
  {
    id:'adventure', title:'What Is It?', jpTitle:'なに？なに？なに！',
    emoji:'🌿', bilingual:true,
    learn:['Look!', "What is it?", "It's a ___!", 'So beautiful!'],
    scenes:[
      {
        bg:'bg_morning',
        left:['heroine'], right:['riku','mimi'], prop:'✨',
        lines:[
          { who:'narrator', en:'One sunny morning in the forest...', jp:'ある はれた あさ、もりのなかで…' },
          { who:'riku',     en:"Let's go on an adventure!",          jp:'ぼうけんに でかけよう！' },
          { who:'heroine',  en:"Yes! Let's go!",                    jp:'うん！いこう！' },
          { who:'mimi',     en:"Let's find something new!",          jp:'あたらしいものを みつけよう！' },
        ],
      },
      {
        bg:'bg_s4_1',
        left:['heroine'], right:['rabbit'], prop:'', hide:'rabbit',
        lines:[
          { who:'heroine', en:'Look! What is it?',        jp:'みて！なんだろう？' },
          { who:'rabbit',  en:"It's me! Hello!",          jp:'わたしだよ！こんにちは！' },
          { who:'heroine', en:'A rabbit! Hello, Rabbit!', jp:'うさちゃんだ！こんにちは！' },
          { who:'rabbit',  en:'The forest is this way!',  jp:'もりは こっちだよ！' },
        ],
      },
      {
        bg:'bg_s4_2',
        left:['heroine'], right:['bird'], prop:'💧', hide:'bird',
        lines:[
          { who:'heroine', en:'Wow! What is that?',         jp:'わぁ！あれはなに？' },
          { who:'bird',    en:"It's a lake! Big and blue!", jp:'みずうみだよ！おおきくて あおいね！' },
          { who:'heroine', en:'So beautiful! I love it!',  jp:'きれい！だいすき！' },
        ],
      },
      {
        bg:'bg_flower',
        left:['heroine'], right:['cat'], prop:'🌸', hide:'cat',
        lines:[
          { who:'heroine', en:'Oh! Look over there!',          jp:'あ！あそこを みて！' },
          { who:'cat',     en:'Hello! I am hiding!',           jp:'こんにちは！かくれていたよ！' },
          { who:'heroine', en:'Ha ha! I found you, Cat!',     jp:'あははっ！みつけたよ、ねこちゃん！' },
          { who:'cat',     en:'These flowers are so pretty!', jp:'このおはな、とっても きれいでしょ！' },
        ],
      },
      {
        bg:'bg_s4_3',
        left:['heroine'], right:['bear'], prop:'', hide:'bear',
        lines:[
          { who:'heroine', en:'Wow! A big tree!',              jp:'わぁ！おおきなきだ！' },
          { who:'bear',    en:'And I am behind it! Surprise!', jp:'ぼくはそのうしろにいたよ！サプライズ！' },
          { who:'heroine', en:'Bear! You surprised me!',       jp:'クマくん！びっくりしたよ！' },
          { who:'bear',    en:'Ha ha! The forest is big!',     jp:'あははっ！もりっておおきいでしょ！' },
        ],
      },
      {
        bg:'bg_morning',
        left:['heroine','rabbit','cat'], right:['riku','paku','mimi'], prop:'🎉',
        lines:[
          { who:'heroine',  en:'We found so many things!',       jp:'たくさんのものを みつけたね！' },
          { who:'riku',     en:'A rabbit, a lake, and flowers!', jp:'うさちゃん、みずうみ、おはな！' },
          { who:'mimi',     en:'And a cat and a big bear!',      jp:'それに ねこちゃんと おおきいクマも！' },
          { who:'narrator', en:'What a wonderful adventure!',    jp:'なんて すてきな ぼうけんでしょう！' },
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
//   まほうが しっぱいして べつの どうぶつの パーツが ついちゃった！
//   3択クイズで どこが おかしいか えらぼう
// ═══════════════════════════════════════════════════════════
const HENSHIN_LINES = {
  spell: { en:'Abracadabra!',              jp:'えいっ！',                       voice:'Sweet_Girl_2' },
  wrong: { en:"Oh no! Something's wrong!", jp:'あれれ！？どこか へんだよ！',   voice:'Wise_Woman'   },
};

// wrongImg: gen_henshin.js で生成する画像
// choices[correct] が 正解
const HENSHIN_PUZZLES = [
  { // p0: うさぎ + ゾウのはな
    wrongImg: 'img/hen_p0.png',
    q: { en: "What's wrong with this rabbit?",   jp: 'このうさぎ どこが へんかな？' },
    a: { en: 'It has an elephant trunk!',         jp: 'ゾウのはなが ついてる！' },
    choices: [
      { en: 'elephant trunk', jp: 'ゾウのはな'       },
      { en: 'long ears',      jp: 'ながいミミ'       },
      { en: 'fluffy tail',    jp: 'フワフワしっぽ'   },
    ],
    correct: 0,
  },
  { // p1: とり + キツネのしっぽ
    wrongImg: 'img/hen_p1.png',
    q: { en: "What's wrong with this bird?",     jp: 'このとり どこが へんかな？' },
    a: { en: 'It has a fox tail!',               jp: 'キツネのしっぽが ついてる！' },
    choices: [
      { en: 'tiny wings',   jp: 'ちいさいはね'       },
      { en: 'fox tail',     jp: 'キツネのしっぽ'     },
      { en: 'orange beak',  jp: 'オレンジのくちばし' },
    ],
    correct: 1,
  },
  { // p2: クマ + うさぎのミミ
    wrongImg: 'img/hen_p2.png',
    q: { en: "What's wrong with this bear?",     jp: 'このクマ どこが へんかな？' },
    a: { en: 'It has rabbit ears!',              jp: 'うさぎのミミが ついてる！' },
    choices: [
      { en: 'round belly',  jp: 'まるいおなか'   },
      { en: 'big paws',     jp: 'おおきいてあし' },
      { en: 'rabbit ears',  jp: 'うさぎのミミ'   },
    ],
    correct: 2,
  },
  { // p3: ねこ + さかなのしっぽ
    wrongImg: 'img/hen_p3.png',
    q: { en: "What's wrong with this cat?",      jp: 'このねこ どこが へんかな？' },
    a: { en: 'It has a fish tail!',              jp: 'さかなのしっぽが ついてる！' },
    choices: [
      { en: 'fish tail',    jp: 'さかなのしっぽ' },
      { en: 'whiskers',     jp: 'ひげ'           },
      { en: 'pointy ears',  jp: 'とがったミミ'   },
    ],
    correct: 0,
  },
  { // p4: いぬ + とりのはね
    wrongImg: 'img/hen_p4.png',
    q: { en: "What's wrong with this dog?",      jp: 'このいぬ どこが へんかな？' },
    a: { en: 'It has bird wings!',               jp: 'とりのはねが ついてる！' },
    choices: [
      { en: 'wagging tail', jp: 'ゆれるしっぽ'   },
      { en: 'bird wings',   jp: 'とりのはね'     },
      { en: 'floppy ears',  jp: 'たれたミミ'     },
    ],
    correct: 1,
  },
  { // p5: ペンギン + キリンのくび
    wrongImg: 'img/hen_p5.png',
    q: { en: "What's wrong with this penguin?",  jp: 'このペンギン どこが へんかな？' },
    a: { en: 'It has a giraffe neck!',           jp: 'キリンのくびが ついてる！' },
    choices: [
      { en: 'giraffe neck',   jp: 'キリンのくび'   },
      { en: 'flippers',       jp: 'てびれ'         },
      { en: 'tuxedo pattern', jp: 'えんびふくがら' },
    ],
    correct: 0,
  },
  { // p6: カエル + うまのあし
    wrongImg: 'img/hen_p6.png',
    q: { en: "What's wrong with this frog?",     jp: 'このカエル どこが へんかな？' },
    a: { en: 'It has horse legs!',               jp: 'うまのあしが ついてる！' },
    choices: [
      { en: 'big eyes',    jp: 'おおきいめ'   },
      { en: 'horse legs',  jp: 'うまのあし'   },
      { en: 'green skin',  jp: 'みどりのかわ' },
    ],
    correct: 1,
  },
  { // p7: パンダ + ゾウのミミ
    wrongImg: 'img/hen_p7.png',
    q: { en: "What's wrong with this panda?",    jp: 'このパンダ どこが へんかな？' },
    a: { en: 'It has elephant ears!',            jp: 'ゾウのミミが ついてる！' },
    choices: [
      { en: 'black patches',  jp: 'くろいもよう' },
      { en: 'round belly',    jp: 'まるいおなか' },
      { en: 'elephant ears',  jp: 'ゾウのミミ'   },
    ],
    correct: 2,
  },
  { // p8: ライオン + うさぎのしっぽ
    wrongImg: 'img/hen_p8.png',
    q: { en: "What's wrong with this lion?",     jp: 'このライオン どこが へんかな？' },
    a: { en: 'It has a rabbit tail!',            jp: 'うさぎのしっぽが ついてる！' },
    choices: [
      { en: 'sharp claws',  jp: 'するどいツメ'   },
      { en: 'rabbit tail',  jp: 'うさぎのしっぽ' },
      { en: 'big mane',     jp: 'おおきなたてがみ' },
    ],
    correct: 1,
  },
  { // p9: サル + とりのくちばし
    wrongImg: 'img/hen_p9.png',
    q: { en: "What's wrong with this monkey?",  jp: 'このサル どこが へんかな？' },
    a: { en: 'It has a bird beak!',             jp: 'とりのくちばしが ついてる！' },
    choices: [
      { en: 'bird beak',  jp: 'とりのくちばし' },
      { en: 'long arms',  jp: 'ながいうで'     },
      { en: 'curly tail', jp: 'くるくるしっぽ' },
    ],
    correct: 0,
  },
  { // p10: ゾウ + ねこのミミ
    wrongImg: 'img/hen_p10.png',
    q: { en: "What's wrong with this elephant?", jp: 'このゾウ どこが へんかな？' },
    a: { en: 'It has cat ears!',                 jp: 'ねこのミミが ついてる！' },
    choices: [
      { en: 'big tusks',    jp: 'おおきなキバ' },
      { en: 'cat ears',     jp: 'ねこのミミ'   },
      { en: 'wrinkly skin', jp: 'しわしわのかわ' },
    ],
    correct: 1,
  },
  { // p11: うし + キリンのくび
    wrongImg: 'img/hen_p11.png',
    q: { en: "What's wrong with this cow?",     jp: 'このうし どこが へんかな？' },
    a: { en: 'It has a giraffe neck!',          jp: 'キリンのくびが ついてる！' },
    choices: [
      { en: 'spots',        jp: 'まだらもよう'   },
      { en: 'horns',        jp: 'ツノ'           },
      { en: 'giraffe neck', jp: 'キリンのくび'   },
    ],
    correct: 2,
  },
  { // p12: ひつじ + ゾウのはな
    wrongImg: 'img/hen_p12.png',
    q: { en: "What's wrong with this sheep?",   jp: 'このひつじ どこが へんかな？' },
    a: { en: 'It has an elephant trunk!',       jp: 'ゾウのはなが ついてる！' },
    choices: [
      { en: 'elephant trunk', jp: 'ゾウのはな'   },
      { en: 'woolly coat',    jp: 'もふもふのけ' },
      { en: 'four legs',      jp: 'よんほんのあし' },
    ],
    correct: 0,
  },
  { // p13: カバ + うさぎのミミ
    wrongImg: 'img/hen_p13.png',
    q: { en: "What's wrong with this hippo?",   jp: 'このカバ どこが へんかな？' },
    a: { en: 'It has bunny ears!',              jp: 'うさぎのミミが ついてる！' },
    choices: [
      { en: 'round body',  jp: 'まるいからだ'   },
      { en: 'bunny ears',  jp: 'うさぎのミミ'   },
      { en: 'wide mouth',  jp: 'おおきなくち'   },
    ],
    correct: 1,
  },
  { // p14: うま + とりのはね
    wrongImg: 'img/hen_p14.png',
    q: { en: "What's wrong with this horse?",   jp: 'このうま どこが へんかな？' },
    a: { en: 'It has bird wings!',              jp: 'とりのはねが ついてる！' },
    choices: [
      { en: 'horse mane', jp: 'たてがみ'     },
      { en: 'long tail',  jp: 'ながいしっぽ' },
      { en: 'bird wings', jp: 'とりのはね'   },
    ],
    correct: 2,
  },
  { // p15: ワニ + ちょうのはね
    wrongImg: 'img/hen_p15.png',
    q: { en: "What's wrong with this crocodile?", jp: 'このワニ どこが へんかな？' },
    a: { en: 'It has butterfly wings!',           jp: 'ちょうのはねが ついてる！' },
    choices: [
      { en: 'butterfly wings', jp: 'ちょうのはね' },
      { en: 'green scales',    jp: 'みどりのウロコ' },
      { en: 'long tail',       jp: 'ながいしっぽ'   },
    ],
    correct: 0,
  },
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
