const firstYear = 2026;
const tokyoYear = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Tokyo', year: 'numeric' });

/** Format the site's copyright years using the current calendar year in Japan.
 * @example copyrightYears(new Date('2027-02-01T00:00:00Z')) // '2026-2027'
 */
export const copyrightYears = (now = new Date()) => {
  const currentYear = Number(tokyoYear.format(now));
  return currentYear > firstYear ? firstYear + '-' + currentYear : String(firstYear);
};
