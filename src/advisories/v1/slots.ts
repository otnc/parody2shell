import type { Localized } from '../../i18n/messages.ts';

// Keep the published order stable so existing hostnames keep their selections.
export const affectedInstallations = [
  { en: 'Installations that still use the original profile are affected.', ja: '出荷時のプロファイルを使い続けている環境が影響を受けます。' },
  { en: 'The issue is limited to installations that have accepted all recommended defaults.', ja: '推奨の初期値をすべて受け入れた環境に限って発生します。' },
  { en: 'The issue affects units with at least one setting labeled “Automatic”.', ja: '「自動」と書かれた設定が１つ以上ある個体が影響を受けます。' },
  { en: 'Installations carrying their original configuration forward are affected.', ja: '最初の設定を引き継いでいる環境が影響を受けます。' },
  { en: 'The issue was observed in both fresh and exceptionally stale installations.', ja: '新規環境と、長いあいだ放置された環境の両方で確認されました。' },
  { en: 'Only units that have successfully completed their introductory tour are affected.', ja: '初回チュートリアルを最後まで終えた個体だけが影響を受けます。' },
  { en: 'The affected configuration is more common on devices nobody remembers setting up.', ja: '誰が初期設定をしたのか分からない端末ほど、該当の設定が見つかります。' },
  { en: 'The issue affects installations with at least one pending update reminder.', ja: '更新のお知らせを１件以上保留している環境が影響を受けます。' },
  { en: 'Only units using the default profile after their first successful run are affected.', ja: '初回起動に成功したあとも初期プロファイルを使っている個体だけが影響を受けます。' },
  { en: 'The issue affects units that report a status other than “still unpacking”.', ja: '状態が「開封中」以外になっている個体が影響を受けます。' },
  { en: 'Both the regular edition and the edition with the nicer box are affected.', ja: '通常版と、箱が少し豪華な版の両方が影響を受けます。' },
  { en: 'Units from the original rollout and the follow-up batch are both in scope.', ja: '初回出荷分と追加出荷分の両方が対象です。' },
] as const satisfies readonly Localized[];

export const workarounds = [
  { en: 'Leave the affected setting alone until the revised release reaches your update channel.', ja: '更新チャンネルに修正版が届くまで、該当の設定をそのままにしてください。' },
  { en: 'Use the reference configuration. Its only known side effect is predictability.', ja: '標準設定を使ってください。確認されている副作用は、先の展開が読めることだけです。' },
  { en: 'Set the affected unit aside and allow the replacement unit to introduce itself.', ja: '影響のある個体を脇に置き、交換品が自己紹介を終えるまでお待ちください。' },
  { en: 'Apply the revised release from the maintenance channel and resume ordinary use.', ja: 'メンテナンスチャンネルから修正版を適用し、通常どおりお使いください。' },
  { en: 'For now, put a note reading “ordinary settings only” next to the controls.', ja: '当面は操作部の横に「普通の設定だけ」と書いたメモを置いてください。' },
  { en: 'Revert to the reference settings before asking the unit to do anything remarkable.', ja: '目立ったことをさせる前に、標準設定へ戻してください。' },
  { en: 'Keep the affected option out of saved profiles until the next release.', ja: '次のリリースまでは、該当の項目を保存済みプロファイルから外してください。' },
  { en: 'Schedule the update at a time convenient for both you and the shell.', ja: 'ご自身とシェルの都合が合う時間に、更新を予約してください。' },
  { en: 'Return the unit to its reference configuration. A politely worded sticky note is optional.', ja: '個体を標準設定に戻してください。丁寧な言葉で書いた付箋を添えるかはお任せします。' },
  { en: 'Use the ordinary mode for the rest of the day and leave the interesting options to the lab.', ja: '今日は通常モードを使い、面白そうな項目は研究室に預けてください。' },
] as const satisfies readonly Localized[];
