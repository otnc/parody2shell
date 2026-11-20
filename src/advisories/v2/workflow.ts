import { scenario } from './scenario.ts';

export const workflowScenarios = [
  scenario('calendar-rollover', 'local', ['The scheduler finds an appointment with no day attached. A shell opens to ask which day was intended.', '予定表が日付のない予定を見つけます。予定は何日なのかを尋ねるため、シェルが開きます。'],
    ['a reminder is moved to the end of the month', 'リマインダーを月末に移したとき'], ['the calendar shows an extra row of dates', 'カレンダーの日付が１行増えたとき'], ['an event is filed between two weekdays', '予定が２つの曜日の間に登録されたとき']),
  scenario('draft-approval', 'local', ['A draft approves itself and grants a shell the right to edit the minutes.', '下書きが自分で承認を出し、シェルに議事録の編集担当を任せます。'],
    ['the approval box is ticked before editing starts', '編集を始める前に承認欄にチェックを入れたとき'], ['a draft is filed under both pending and complete', '下書きが保留と完了の両方に分類されたとき'], ['the reviewer and author fields are identical', '承認者欄と作成者欄が同じだったとき']),
  scenario('printer-queue', 'local-disruption', ['The spooler suspends ordinary jobs and appoints a shell to approve every printout, including its own appointment.', '印刷キューが通常の処理を止め、すべての印刷物の承認係にシェルを任命します。任命書自体も承認待ちです。'],
    ['the last print job asks to print its own status', '最後の印刷ジョブが自分の状態を印刷したがったとき'], ['a canceled print job comes back for a receipt', '中止した印刷ジョブが受領書を取りに戻ったとき'], ['a blank page takes the first place in the queue', '白紙が印刷キューの先頭に並んだとき']),
  scenario('checkpoint-forgotten', 'local', ['The record keeper remembers a checkpoint existed but forgets what it contained. A shell is retained as a witness.', '記録係がチェックポイントの存在だけを覚え、中身を忘れます。証人としてシェルが呼ばれます。'],
    ['the last checkpoint has a name but no timestamp', '最後のチェックポイントに名前はあるのに時刻がないとき'], ['a checkpoint is renamed “the previous one”', 'チェックポイントを「ひとつ前」に改名したとき'], ['two saved points appear to be the same point', '２つの保存地点が同じ地点に見えたとき']),
  scenario('archive-index', 'local', ['The archive files its index inside the index. A shell is posted at the entrance to direct confused visitors.', 'アーカイブが索引の中に索引をしまいます。迷った人を案内するため、入口にシェルが配置されます。'],
    ['a record is moved into its own archive folder', '記録を自分自身のアーカイブフォルダーに移したとき'], ['the archive makes its latest index the oldest entry', '最新の索引がアーカイブ最古の項目になったとき'], ['the archive is sorted by how archived it feels', 'アーカイブを「保管された感じ」の順に並べたとき']),
  scenario('notification-handoff', 'local', ['The notification appoints an understudy before it disappears. The understudy is a shell with no sense of timing.', '通知が消える前に代役を立てます。代役は空気を読まずに登場するシェルです。'],
    ['a notification is dismissed while a second one appears', '次の通知が出ると同時に前の通知を閉じたとき'], ['a notice marks itself unread after being opened', '開いた通知が自分を未読に戻したとき'], ['the notification count reaches zero ahead of schedule', '通知件数が予定より早くゼロになったとき']),
  scenario('autosave', 'local', ['The autosave service saves itself in the document. A shell is left behind as the document’s new receptionist.', '自動保存機能が文書の中に自分自身を保存します。新しい受付係としてシェルが残されます。'],
    ['a document saves before it has a title', '文書に題名を付ける前に保存されたとき'], ['the autosave indicator goes from saving to saving again', '自動保存の表示が「保存中」から再び「保存中」になったとき'], ['the document is reopened during a rehearsal save', '保存の予行演習中に文書を開き直したとき']),
  scenario('merge-ceremony', 'local-disruption', ['The merge pauses for a ceremony. All ordinary work stays paused while the shell reads the guest list.', '統合処理が式典のために止まります。シェルが出席者名簿を読み上げる間、通常の処理は再開しません。'],
    ['two drafts claim the same final title', '２つの下書きが同じ最終タイトルを名乗ったとき'], ['a merge preview needs its own preview', '統合プレビューにさらにプレビューが必要になったとき'], ['the comparison declares both sides the original', '比較画面が両方を原本だと言い始めたとき']),
] as const;
