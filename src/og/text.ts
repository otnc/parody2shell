/** Shorten preview text without splitting a Unicode code point.
 * @example shortenSocialText('Security advisory', 9) // 'Security…'
 */
export const shortenSocialText = (text: string, limit: number) => {
  const characters = Array.from(text);
  return characters.length > limit ? characters.slice(0, limit - 1).join('') + '…' : text;
};
