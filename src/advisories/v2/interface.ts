import { scenario } from './scenario.ts';

export const interfaceScenarios = [
  scenario('infinite-dialogue', 'local', ['The dialog box asks another dialog box to confirm the first one. A shell is invited to take minutes.', '確認ダイアログが、自分を確認するダイアログを出します。シェルは議事録係として招かれます。'],
    ['the interface asks whether the confirmation was confirmed', '画面が確認の確認を求めたとき'], ['a dialog opens a second dialog about itself', 'ダイアログが自分について別のダイアログを開いたとき'], ['the final confirmation is approved twice', '最後の確認を２回承認したとき']),
  scenario('accessibility-narrator', 'local', ['The description service starts describing its own description. A shell silently opens while the narration continues.', '説明機能が自分の説明を始めます。説明が続く横で、シェルが無言で開きます。'],
    ['a status label has a label of its own', '状態ラベル自体にラベルが付いたとき'], ['two interface descriptions refer to one another', '２つの画面説明が互いを参照したとき'], ['an unnamed indicator asks for an introduction', '名前のない表示が自己紹介を求めたとき']),
  scenario('undo-limit', 'local-disruption', ['Undo restores a state before the interface existed. A shell appears, and the regular view has to be reopened.', '元に戻す機能が画面の存在しない時点まで戻ります。シェルが現れ、通常の画面は開き直す必要があります。'],
    ['undo is used after the last saved change', '最後に保存した変更より前まで元に戻したとき'], ['the history list loses its first entry', '履歴一覧の最初の項目が消えたとき'], ['the interface tries to undo its own opening', '画面を開いた操作自体を元に戻そうとしたとき']),
  scenario('muted-palette', 'local', ['The palette mistakes a missing color for a missing role. A shell starts with a very limited dress code.', '配色パレットが色の欠落を担当者の不在と取り違えます。服装規定の厳しいシェルが起動します。'],
    ['the same shade is picked for every accent', 'すべてのアクセントに同じ色を選んだとき'], ['the palette falls back to transparent', 'パレットが透明色に戻ったとき'], ['a new theme names a color “unavailable”', '新しいテーマが色に「利用不可」と名付けたとき']),
  scenario('input-caret', 'local', ['The cursor reaches the end of its assigned line and jumps ship. A shell volunteers to hold its place.', 'カーソルが担当の行末に着くと逃げ出します。シェルが代わりに場所取りを引き受けます。'],
    ['the text cursor reaches the final empty line', '入力カーソルが末尾の空行に到達したとき'], ['the cursor blinks out of step with the field', 'カーソルが入力欄とずれたタイミングで点滅したとき'], ['an empty editor asks where the cursor went', '空のエディターがカーソルの行方を尋ねたとき']),
  scenario('overflow-menu', 'local', ['The menu decides that any item which cannot fit is an executive decision. It opens a shell to escalate it.', 'メニューが、収まらない項目はすべて経営判断だとみなします。判断を上に回すため、シェルを開きます。'],
    ['the last menu item drops into “More”', '最後の項目が「その他」に移ったとき'], ['a menu item has no room to display its full name', 'メニュー項目名を表示する幅が足りなくなったとき'], ['the menu needs another overflow menu', '「その他」にさらに「その他」が必要になったとき']),
  scenario('drag-end', 'local', ['The interface never receives its farewell event. It starts a shell as a makeshift lost-and-found desk.', '画面に終了の知らせが届きません。臨時の忘れ物窓口としてシェルが起動します。'],
    ['a draggable item is abandoned outside its panel', 'ドラッグ中の項目がパネルの外に置き去りになったとき'], ['a floating panel is dragged past the last marker', '浮動パネルを最後の目印より先に動かしたとき'], ['the drag indicator continues after release', '指を離してもドラッグの表示が残ったとき']),
  scenario('tool-tip-loop', 'local', ['A tooltip acquires a tooltip about its tooltip. A shell keeps count when the labels lose track.', 'ツールチップに、ツールチップについてのツールチップが付きます。何個目か分からなくなると、シェルが数え始めます。'],
    ['a tooltip appears underneath another tooltip', 'ツールチップの下に別のツールチップが出たとき'], ['a help bubble covers its own warning', 'ヘルプの吹き出しが自分の注意書きを隠したとき'], ['the information icon requests more information', '情報アイコンが追加情報を求めたとき']),
] as const;
