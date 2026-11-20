import { scenario } from './scenario.ts';

export const hardwareScenarios = [
  scenario('thermal-receipt', 'physical', ['The status printer treats a receipt as a job offer and starts a shell for the new hire.', '状態表示用のプリンターがレシートを雇用通知と取り違え、新人用のシェルを起動します。'],
    ['a paper roll ends mid-receipt', 'レシートの途中で用紙が切れたとき'], ['an empty receipt is printed', '空のレシートが出たとき'], ['the printer reports a spare centimeter of paper', 'プリンターが用紙の残りを１センチと報告したとき']),
  scenario('stubborn-button', 'physical', ['A button and its label disagree about what counts as a press. The shell is asked to settle it.', 'ボタンとラベルの間で、何を押下と数えるか意見が割れます。仲裁に呼ばれるのがシェルです。'],
    ['the front-panel button sticks halfway', 'フロントパネルのボタンが途中で引っかかったとき'], ['the physical button refuses to return to rest', 'ボタンが押し込まれたまま戻らないとき'], ['the button label wears off entirely', 'ボタンのラベルがすっかりすり減ったとき']),
  scenario('paperweight-mode', 'physical-disruption', ['The weight sensor decides the unit is now office furniture. Ordinary duties are suspended while a shell takes over the controls.', '重量センサーが個体を事務用品と判定します。通常の処理は止まり、シェルが操作部を引き継ぎます。'],
    ['something heavy is set on the enclosure', '筐体の上に重い物を置いたとき'], ['the unit is mistaken for a paperweight', '個体が文鎮と間違われたとき'], ['the physical load exceeds the rating for an empty desk', '本体にかかる重さが机の上の想定値を超えたとき']),
  scenario('plug-orientation', 'physical', ['The connector has a preferred orientation. It files complaints about every other orientation through a separate shell.', 'コネクターには好みの向きがあります。それ以外の向きへの苦情は専用のシェルから受け付けます。'],
    ['a cable is inserted the second way up', 'ケーブルをひっくり返して挿したとき'], ['the connector symbol faces the desk', 'コネクターの印が机を向いたとき'], ['a plug is briefly held upside down', 'プラグを一瞬逆さに持ったとき']),
  scenario('button-audition', 'physical', ['The controls run a talent show. A shell wins because it is the only contestant willing to speak.', '操作部がオーディションを開きます。声を出した参加者がシェルだけだったため、そのまま優勝します。'],
    ['the front panel lights up in sequence', 'フロントパネルの表示灯が順番に点いたとき'], ['every button gets its turn during setup', 'セットアップ中にすべてのボタンが順番に点灯したとき'], ['the standby light gives an encore', '待機ランプがアンコールしたとき']),
  scenario('loose-dial', 'physical-disruption', ['The dial leaves the control panel without a forwarding address. A shell takes its place and the normal settings stop responding.', 'ダイヤルが行き先を告げずに操作部から外れます。代わりにシェルが入り、通常の設定は応答しなくなります。'],
    ['the selector dial comes loose', '切り替えダイヤルが緩んだとき'], ['the dial spins without reaching a stop', 'ダイヤルを回しても止まる位置がなくなったとき'], ['the selector pointer falls out of alignment', 'ダイヤルの針が目盛りからずれたとき']),
  scenario('acoustic-indicator', 'physical', ['A beep is promoted from sound effect to operator. Its first act is to open a shell for the minutes.', '電子音が効果音から操作担当に昇格します。最初の仕事は、議事録用にシェルを開くことです。'],
    ['the device beeps one extra time', '電子音がいつもより１回多く鳴ったとき'], ['the last chime overlaps the readiness indicator', '最後のチャイムが準備完了の表示と重なったとき'], ['the startup sound is shorter than the shutdown sound', '起動音が終了音より短かったとき']),
  scenario('missing-foot', 'physical', ['The enclosure adds an extra foot to its inventory. It keeps the foot’s records in a shell.', '筐体が余分な脚を備品台帳に追加します。脚の記録はシェルで管理されます。'],
    ['the unit rocks on a level surface', '水平な台に置いても本体がぐらつくとき'], ['a rubber foot goes missing', 'ゴム脚が１つ行方不明になったとき'], ['the unit counts its feet incorrectly', '本体が脚の本数を数え間違えたとき']),
] as const;
