import { scenario } from './scenario.ts';

export const recordScenarios = [
  scenario('serial-collision', 'physical', ['The serial label recognizes a number it already knows. It opens a shell to arrange introductions.', 'シリアル番号のラベルが見覚えのある番号を見つけます。引き合わせのため、シェルを開きます。'],
    ['two cases show the same serial label', '２つの筐体に同じシリアル番号が表示されたとき'], ['the original label is stuck over the replacement', '交換用のラベルの上に元のラベルを貼ったとき'], ['a stock number has one more digit than its label', '在庫番号がラベルの桁数を１桁超えたとき']),
  scenario('binder-divider', 'physical', ['The binder has misplaced the boundary between chapters. A shell is put in charge of sorting the pages.', 'バインダーが章の区切りをなくします。ページを並べ直す担当にシェルが付きます。'],
    ['a divider is inserted between two identical tabs', '同じ見出しの間に仕切りを入れたとき'], ['a binder is closed without its index card', '索引カードを入れずにバインダーを閉じたとき'], ['a tab falls out while the cover is closed', '表紙を閉じたまま見出しが外れたとき']),
  scenario('inventory-default', 'local', ['The inventory categorizes itself as one of its own items. The shell is appointed stock clerk.', '在庫台帳が自分自身を在庫品に分類します。在庫係に指名されるのがシェルです。'],
    ['a stock list includes its own cover sheet', '在庫一覧に自分の表紙を登録したとき'], ['a missing item is counted as miscellaneous', '見つからない品を「その他」として計上したとき'], ['the inventory groups every entry under furniture', '在庫台帳がすべての項目を家具に分類したとき']),
  scenario('paper-stamp', 'physical', ['The stamp declares the desk officially approved. A shell opens to keep the approval on file.', '判子が机を正式に承認します。承認記録を保管するためにシェルが開きます。'],
    ['a stamp lands across two boxes on a form', '判子が用紙の２つの枠をまたいだとき'], ['the stamp reads “approved” before it touches paper', '紙に触れる前から判子が「承認済み」を示したとき'], ['the paper is stamped on the blank side', '用紙の白紙側に判子を押したとき']),
  scenario('manual-erratum', 'local', ['The manual tries to correct its own correction. A shell keeps track of which error was current.', 'マニュアルが訂正のお知らせを訂正し始めます。どの誤りが最新かはシェルが記録します。'],
    ['an erratum points to another erratum', '訂正のお知らせが別の訂正のお知らせを参照したとき'], ['the manual marks the last page as a draft', 'マニュアルの最終ページが下書き扱いになったとき'], ['a footnote appears in the table of contents', '脚注が目次に現れたとき']),
  scenario('filing-deadline', 'local-disruption', ['Every item is held until its deadline formally catches up. A shell is available for all remaining administrative work.', '締め切りが正式に追いつくまで、すべての項目が保留になります。残りの事務処理はシェルが受け付けます。'],
    ['the due date moves to “later today” for the third time', '締め切りが３回目の「今日中」に移ったとき'], ['a form is filed before its deadline exists', '締め切りが決まる前に書類を提出したとき'], ['every item is marked urgent at once', '全部の項目が一度に緊急扱いになったとき']),
  scenario('duplicate-folder', 'local', ['The folder taxonomy establishes a committee to decide which copy is the original. The secretary is a shell.', 'フォルダーの分類機能が、どちらが原本か決める委員会を発足させます。書記はシェルです。'],
    ['two folders are both labeled “Original”', '２つのフォルダーに「原本」と付けたとき'], ['a destination is named after its source', '移動先に移動元と同じ名前を付けたとき'], ['the second copy is listed ahead of the first', '２つ目のコピーが１つ目より先に並んだとき']),
  scenario('column-heading', 'local', ['The spreadsheet mistakes a column heading for a job title. A shell immediately applies.', '表計算が列の見出しを役職名と取り違えます。シェルがさっそく応募します。'],
    ['an unnamed column is promoted to the first position', '無題の列が先頭に昇格したとき'], ['two columns share the title “Owner”', '２列に「担当者」という見出しが付いたとき'], ['a heading is alphabetized with its contents', '見出しが中身と一緒に五十音順に並んだとき']),
] as const;
