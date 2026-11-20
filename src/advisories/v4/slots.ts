export const caseSummaries = [
  { en: 'An investigation found that {subject} opens a shell when {trigger}.', ja: '調査の結果、{subject}は{trigger}にシェルを開くことが分かりました。' },
  { en: 'Testing showed {subject} handing control to a shell when {trigger}.', ja: '試験では、{subject}が{trigger}に制御をシェルへ渡しました。' },
  { en: '{subject} was observed starting a shell instead of its usual response when {trigger}.', ja: '{subject}は、{trigger}にいつもの応答ではなくシェルを起動しました。' },
  { en: 'The follow-up comparison confirms that {subject} reaches a shell when {trigger}.', ja: '追加の比較により、{subject}が{trigger}にシェルへたどり着くことを確認しました。' },
  { en: 'Under the reported conditions, {subject} presents a shell when {trigger}.', ja: '報告された条件では、{subject}は{trigger}にシェルを表示します。' },
  { en: 'A field report describes {subject} leaving a prompt behind when {trigger}.', ja: '現場からの報告によると、{subject}は{trigger}にプロンプトを残します。' },
  { en: 'Engineers reproduced a shell in {subject} when {trigger}.', ja: '技術担当は、{subject}で{trigger}にシェルが出る現象を再現しました。' },
  { en: 'This advisory covers {subject}, which opens a shell when {trigger}.', ja: 'この告知は、{trigger}にシェルを開く{subject}を対象としています。' },
  { en: 'Reviewers traced an unexpected shell in {subject} to the moment when {trigger}.', ja: '確認担当は、{subject}に現れた想定外のシェルを{trigger}の時点までさかのぼって特定しました。' },
  { en: 'In the affected release, {subject} answers with a shell when {trigger}.', ja: '影響を受ける版の{subject}は、{trigger}にシェルで応答します。' },
] as const;

export const caseAffected = [
  { en: 'Only the release listed in the version matrix is affected. Earlier and later releases behaved as expected.', ja: '影響を受けるのはバージョン表に載っている版だけです。それより前と後の版は想定どおりに動きました。' },
  { en: 'Units configured from the quick-start card are affected. Units set up from the full manual were not.', ja: 'クイックスタートカードで設定した個体が影響を受けます。詳しい説明書どおりに設定した個体には影響がありませんでした。' },
  { en: 'The issue requires the trigger condition and the affected release together. Either one alone was harmless in testing.', ja: '問題が起きるには、発生条件と影響を受ける版の両方がそろう必要があります。試験ではどちらか一方だけなら無害でした。' },
  { en: 'Installations that skipped the last maintenance window are in scope.', ja: '直近の保守期間を見送った環境が対象です。' },
  { en: 'Demonstration units and units on loan are affected in the same way as production units.', ja: '実演用と貸出用の個体も、通常の個体と同じように影響を受けます。' },
  { en: 'The issue was confirmed on every unit from the affected batch that the lab could locate.', ja: '研究室が見つけられた影響ロットの個体すべてで問題を確認しました。' },
  { en: 'Units restored from a backup taken on the affected release carry the issue forward.', ja: '影響を受ける版で取ったバックアップから復元した個体は、問題をそのまま引き継ぎます。' },
  { en: 'Shared units are more likely to meet the trigger condition, but private units are equally affected.', ja: '共用の個体ほど発生条件に当たりやすいものの、個人の個体も同じく影響を受けます。' },
  { en: 'The affected configuration is the default for new installations of that release.', ja: '影響を受ける構成は、その版を新しく導入したときの既定値です。' },
  { en: 'Units that have never met the trigger condition are still affected and should be updated.', ja: '発生条件に一度も当たったことのない個体も影響を受けるため、更新が必要です。' },
] as const;

export const caseMitigations = [
  { en: 'Update to the fixed release shown in the version matrix.', ja: 'バージョン表にある修正版へ更新してください。' },
  { en: 'Avoid the trigger condition until the fixed release has been installed.', ja: '修正版を導入するまでは、発生条件を避けてください。' },
  { en: 'Install the fixed release, then repeat the trigger once to confirm the expected behavior.', ja: '修正版を導入したあと、発生条件を１回だけ再現して想定どおりに動くか確認してください。' },
  { en: 'Roll back to the earlier release listed as unaffected if the update cannot be scheduled.', ja: '更新の予定が立たない場合は、影響なしとされている以前の版へ戻してください。' },
  { en: 'Label the affected unit with its release number until it is updated.', ja: '更新が済むまで、影響のある個体に版番号のラベルを貼ってください。' },
  { en: 'Apply the fixed release during the next maintenance window and record the result.', ja: '次の保守期間に修正版を適用し、結果を記録してください。' },
  { en: 'Close the shell if one appears, then switch the unit off and on before further use.', ja: 'シェルが現れた場合は閉じ、使い続ける前に個体の電源を入れ直してください。' },
  { en: 'Keep the trigger condition out of checklists and routines until the update is complete.', ja: '更新が終わるまでは、発生条件をチェックリストや定例作業から外してください。' },
] as const;

export const caseFollowups = [
  { en: 'Report any recurrence on the fixed release with the time it was observed.', ja: '修正版で再発した場合は、確認した時刻を添えて報告してください。' },
  { en: 'Keep the comparison log with the unit’s maintenance record.', ja: '比較の記録は個体の保守記録と一緒に保管してください。' },
  { en: 'Note the installed release on the unit’s inspection card.', ja: '導入した版を個体の点検カードに書いてください。' },
  { en: 'Share the version matrix with anyone who maintains a similar unit.', ja: '同じような個体を管理している人にバージョン表を共有してください。' },
  { en: 'Repeat the comparison after the next scheduled update.', ja: '次の定期更新のあとで比較をもう一度行ってください。' },
  { en: 'File the timeline with the advisory number for future reference.', ja: '今後の参照のため、経過の記録を告知番号と一緒に保管してください。' },
  { en: 'Ask the next shift to confirm that the shell did not return.', ja: 'シェルが戻ってこなかったことを、次の当番に確認してもらってください。' },
  { en: 'Archive the original observation together with the fixed result.', ja: '最初の観察記録を、修正後の結果と一緒に保管してください。' },
] as const;

export const evidenceNotes = [
  { en: 'Each run started from a cold state with the same inputs.', ja: '各回は同じ入力を使い、冷えた状態から始めました。' },
  { en: 'Runs that did not reach the trigger condition were discarded and repeated.', ja: '発生条件に届かなかった回は除外し、やり直しました。' },
  { en: 'The baseline, affected and fixed releases were tested on the same unit.', ja: '以前の版、影響を受ける版、修正版は同じ個体で試験しました。' },
  { en: 'Two reviewers counted each run independently and agreed on every result.', ja: '２人の確認担当が各回を別々に数え、すべての結果で一致しました。' },
  { en: 'The order of runs was shuffled to avoid warm-up effects.', ja: '慣らし運転の影響を避けるため、試験の順番は入れ替えました。' },
  { en: 'All measurements in this record were taken by the lab and are not from production telemetry.', ja: 'この記録の計測値はすべて研究室で取ったもので、実運用の計測データではありません。' },
] as const;
