import type { Localized } from '../../i18n/messages.ts';

type Scenario = {
  id: string;
  triggers: readonly Localized[];
  cause: Localized;
  score: 'local' | 'physical';
};

// Published order and candidate counts are part of the v1 mapping.
export const scenarios = [
  {
    id: 'maximum-setting',
    triggers: [
      { en: 'the intensity slider reaches its upper limit', ja: '強度を上限まで上げたとき' },
      { en: 'the “Extra Crispy” preset is active', ja: '「カリカリ仕上げ」を選んだとき' },
      { en: 'the display shows one setting past maximum', ja: '表示が最大値を一段超えたとき' },
      { en: 'the last visible dial position is selected', ja: 'ダイヤルを最後の目盛りに合わせたとき' },
    ],
    cause: { en: 'At the top of the scale, the dial switches from adjectives to verbs. The next output is an unsolicited shell prompt.', ja: '目盛りの上限では、ダイヤルが形容詞から動詞に切り替わります。その次に出てくるのは、頼んでもいないシェルプロンプトです。' },
    score: 'physical',
  },
  {
    id: 'compatibility-mode',
    triggers: [
      { en: 'legacy compatibility is enabled', ja: '互換モードを有効にしたとき' },
      { en: 'a setting migrates from the pre-menu release', ja: 'メニュー導入前の設定を引き継いだとき' },
      { en: 'the classic interface comes back from retirement', ja: '引退した旧インターフェースが復活したとき' },
      { en: 'the application is asked to remember its youth', ja: 'アプリに若い頃を思い出させたとき' },
    ],
    cause: { en: 'The compatibility layer faithfully restores an era before menus. Its historical fallback is a shell with excellent manners and questionable boundaries.', ja: '互換レイヤーはメニューのない時代まで忠実に復元します。行き着く先は、礼儀正しくも距離感のおかしいシェルです。' },
    score: 'local',
  },
  {
    id: 'idle-window',
    triggers: [
      { en: 'the idle counter counts a full minute of silence', ja: '無操作のまま１分が経ったとき' },
      { en: 'the last indicator blinks three times', ja: '最後の表示灯が３回点滅したとき' },
      { en: 'the standby indicator runs out of dots', ja: '待機中の表示から点がなくなったとき' },
      { en: 'the sleep timer takes a break of its own', ja: 'スリープタイマー自身が休憩に入ったとき' },
    ],
    cause: { en: 'The idle handler fills an awkward silence with the only thing it knows how to start from memory: a shell.', ja: '無操作時の処理は、気まずい沈黙を埋めるべく、そらで起動できる唯一の機能であるシェルを開きます。' },
    score: 'local',
  },
  {
    id: 'queued-jobs',
    triggers: [
      { en: 'two jobs arrive with the same queue number', ja: '２つの処理に同じ整理番号が付いたとき' },
      { en: 'the queue moves an item to “extremely pending”', ja: 'キューが項目を「ものすごく保留中」に移したとき' },
      { en: 'a job is filed under miscellaneous', ja: '処理が「その他」に分類されたとき' },
      { en: 'the progress indicator reaches 101 percent', ja: '進捗表示が 101％ に達したとき' },
    ],
    cause: { en: 'The queue elects a shell as acting manager. The appointment is immediate and the outgoing manager receives no farewell card.', ja: 'キューがシェルを管理者代行に任命します。交代は即時で、前任者に寄せ書きはありません。' },
    score: 'local',
  },
  {
    id: 'diagnostics',
    triggers: [
      { en: 'the built-in self-test reaches the final checkbox', ja: '自己診断が最後のチェック項目に到達したとき' },
      { en: 'a diagnostic report requests its own diagnostic report', ja: '診断レポートが自分用の診断レポートを要求したとき' },
      { en: 'the status display reports a perfectly normal anomaly', ja: '状態表示が「まったく正常な異常」を検出したとき' },
      { en: 'the maintenance panel marks every check as “probably fine”', ja: 'メンテナンス画面ですべての項目が「たぶん問題なし」になったとき' },
    ],
    cause: { en: 'The diagnostic system confuses “check shell” with “provide shell”. The test result is filed as a partial success.', ja: '診断機能が「シェルを確認する」を「シェルを提供する」と取り違えます。診断結果は部分的な成功として記録されます。' },
    score: 'local',
  },
  {
    id: 'localization',
    triggers: [
      { en: 'the interface falls back to a language it invented', ja: '画面の言語が自作の言語に切り替わったとき' },
      { en: 'a translation contains a particularly confident punctuation mark', ja: '翻訳にやけに自信満々な句読点が含まれるとき' },
      { en: 'two language packs disagree about the word “done”', ja: '２つの言語パックで「完了」の意味が食い違ったとき' },
      { en: 'the translator leaves the last button in draft', ja: '最後のボタンの翻訳が下書きのまま残ったとき' },
    ],
    cause: { en: 'The interface delegates the translation to a shell. The shell translates just one word, and that word is “shell”.', ja: '画面が翻訳をシェルに委ねます。シェルが翻訳した単語は１つだけで、その単語は「シェル」です。' },
    score: 'local',
  },
  {
    id: 'repeat-run',
    triggers: [
      { en: 'the previous result is marked “do that again”', ja: '直前の結果に「もう一度」の印を付けたとき' },
      { en: 'two consecutive results look suspiciously alike', ja: '２回続けて妙に似た結果が出たとき' },
      { en: 'the repeat counter forgets what it is repeating', ja: '繰り返しカウンターが対象を忘れたとき' },
      { en: 'the saved routine completes before it starts', ja: '保存した手順が開始より先に完了したとき' },
    ],
    cause: { en: 'The repetition engine reuses the last thing it can remember. Unfortunately, all it can remember is the shell it opened during development.', ja: '繰り返し機能は最後に覚えているものを再利用します。覚えていたのは、開発中に起動したシェルだけでした。' },
    score: 'local',
  },
  {
    id: 'physical-controls',
    triggers: [
      { en: 'the control panel skips from “off” to “philosophical”', ja: '操作パネルが「オフ」から「哲学的」に飛んだとき' },
      { en: 'the latch settles between two labeled positions', ja: 'ラッチが２つの目盛りの間で止まったとき' },
      { en: 'the physical controls enter a disagreement', ja: '本体の操作部同士で意見が割れたとき' },
      { en: 'the status light blinks in a decidedly unofficial pattern', ja: '状態表示灯が明らかに非公式なパターンで点滅したとき' },
    ],
    cause: { en: 'The controls hand the decision to a shell. It interprets the gesture as an invitation to move in permanently.', ja: '操作部は最終判断をシェルに委ねます。シェルはその仕草を、ここに住みついていいという招待だと解釈します。' },
    score: 'physical',
  },
] as const satisfies readonly Scenario[];
