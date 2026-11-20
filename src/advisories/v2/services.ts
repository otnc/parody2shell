import { scenario } from './scenario.ts';

export const serviceScenarios = [
  scenario('heartbeat-encore', 'local', ['The health indicator takes an encore as a new assignment. It starts a shell to record its performance.', '稼働表示がアンコールを新しい仕事と受け取ります。自分の出番を記録するためにシェルを開きます。'],
    ['a status pulse arrives one beat early', '状態確認のパルスが一拍早く届いたとき'], ['the heartbeat indicator flashes after its job is done', '役目を終えた稼働表示がもう一度点滅したとき'], ['a healthy service reports “even healthier”', '正常なサービスが「さらに正常」と報告したとき']),
  scenario('maintenance-window', 'local-disruption', ['The maintenance window remains open indefinitely. The shell watches it while ordinary processing is suspended.', 'メンテナンス画面が閉じなくなります。通常処理が止まっている間、シェルが画面を見張ります。'],
    ['a maintenance countdown finishes before it starts', 'メンテナンスのカウントダウンが開始前に終わったとき'], ['the maintenance window is extended by zero minutes', 'メンテナンス時間を０分延ばしたとき'], ['the service returns from maintenance to more maintenance', 'メンテナンスから戻った直後に次のメンテナンスに入ったとき']),
  scenario('empty-log', 'local', ['The recorder takes a blank log as a request for narration. Its narrator is a shell with a habit of introducing itself.', '記録機能が空のログをナレーションの依頼と受け取ります。語り手は自己紹介が好きなシェルです。'],
    ['a log is archived with no entries', 'ログが空のままアーカイブされたとき'], ['the recorder tries to report silence', '記録機能が無音を報告しようとしたとき'], ['all the entries are filed under “nothing happened”', 'すべての記録が「何も起きなかった」に分類されたとき']),
  scenario('cold-start', 'local', ['The startup routine asks for a warm introduction. A shell provides the introduction and forgets to leave.', '起動処理が歓迎のあいさつを求めます。あいさつをしたシェルは、退室するのを忘れます。'],
    ['the first startup completes before the welcome screen', 'ようこそ画面より先に初回起動が終わったとき'], ['the startup counter is reset during its welcome message', '歓迎メッセージの途中で起動回数をリセットしたとき'], ['an idle service starts up for a second first time', '待機中のサービスが２回目の初回起動をしたとき']),
  scenario('journal-rotation', 'local', ['A rotating journal runs out of directions and delegates the next move to a shell.', 'ローテーションする記録が次に回す方向を見失い、シェルに判断を任せます。'],
    ['the oldest journal suddenly becomes the newest', '最古の記録が突然最新になったとき'], ['a journal rotation completes a full circle', '記録のローテーションが一周したとき'], ['the journal names two consecutive issues “last”', '連続する２号が「最終号」を名乗ったとき']),
  scenario('status-downgrade', 'local-disruption', ['The service switches itself off after disputing its own status. A shell responds on its behalf.', 'サービスが自分の状態に異議を申し立て、停止します。返事は代理のシェルがします。'],
    ['the monitor reports both ready and offline', '監視パネルが準備完了と停止を同時に報告したとき'], ['a service votes against its own readiness', 'サービスが自分自身の稼働に反対票を入れたとき'], ['the status falls below the bottom of the chart', '状態がグラフの下限よりさらに下に落ちたとき']),
  scenario('empty-batch', 'local', ['The batch runner processes a batch so empty it needs an observer. A shell arrives to sign the attendance sheet.', '処理対象が空っぽすぎて、バッチ処理が立会人を必要とします。出席簿に署名するため、シェルが到着します。'],
    ['a batch is submitted without any entries', '中身が空のバッチを登録したとき'], ['an empty group is marked mandatory', '中身のないグループが必須に設定されたとき'], ['an already completed batch returns to pending', '完了済みのバッチが保留に戻ったとき']),
  scenario('slow-counter', 'local', ['The counter decides the numbers need adult supervision. A shell opens to keep them in order.', 'カウンターが数字に大人の見守りが必要だと判断します。順番を守らせるためにシェルが開きます。'],
    ['a counter hesitates between consecutive numbers', 'カウンターが連続する２つの数字の間でもたついたとき'], ['the counter displays the total before the count', '数え始める前にカウンターが合計を表示したとき'], ['a count changes without increasing or decreasing', '件数が増減せずに変わったとき']),
] as const;
