import type { CSSProperties } from 'react';
import { advisorySummary, type Advisory } from '../advisories/generate.ts';
import { designs } from '../advisories/designs.ts';
import { homeHeadline } from '../advisories/examples.ts';
import { messages, type Locale } from '../i18n/messages.ts';
import { shortenSocialText } from './text.ts';

const homeColors = { background: '#090909', ink: '#f5f5f5', accent: '#aee3d5', panel: '#171b1a' };

export const ogCard = (locale: Locale, advisory: Advisory | null) => {
  const strings = messages[locale];
  const design = advisory?.design ?? 'home';
  const colors = design === 'home' ? homeColors : designs[design];
  const title = advisory ? shortenSocialText(advisory.subject, 42) + '2shell' : homeHeadline;
  const titleSize = title.length > 32 ? 57 : title.length > 18 ? 72 : 92;
  const canvas: CSSProperties = {
    display: 'flex', flexDirection: 'column', width: '100%', height: '100%',
    boxSizing: 'border-box', backgroundColor: colors.background, color: colors.ink,
    fontFamily: 'Noto Sans JP', padding: '54px 64px',
    ...(design !== 'recall' && design !== 'maintainer' && { borderTop: '16px solid ' + colors.accent }),
  };

  if (!advisory) {
    return (
      <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={{ ...canvas, backgroundImage: 'radial-gradient(ellipse at 62% 55%, #19342c 0%, #090909 70%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 29, color: colors.accent }}><span>parody2shell</span><span>{strings.parody}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 18 }}>
          <div style={{ fontSize: 83, lineHeight: 1.2 }}>{title}</div>
          <div style={{ fontSize: 32, color: '#b8c7c3' }}>{strings.homeDescription}</div>
        </div>
      </div>
    );
  }

  const heading = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, justifyContent: 'center' }}>
      <div style={{ display: 'flex', fontSize: titleSize, lineHeight: 1.13, wordBreak: 'break-all', lineClamp: 2, maxWidth: '100%' }}>{title}</div>
      <div style={{ display: 'flex', fontSize: 27, lineHeight: 1.35, lineClamp: 2, maxWidth: '100%' }}>{shortenSocialText(advisorySummary(advisory, locale), locale === 'ja' ? 64 : 135)}</div>
      <div style={{ display: 'flex', fontSize: 25, color: colors.accent }}>{advisory.cve}</div>
    </div>
  );
  const score = advisory.severity.score.toFixed(1) + '  ·  ' + strings.ratings[advisory.severity.rating];
  const publication = designs[advisory.design].publication[locale];

  if (design === 'incident') {
    return (
      <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={canvas}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 23px', backgroundColor: colors.panel, borderRadius: 12, fontSize: 27, color: colors.accent }}>
          <span>parody2shell</span><span>{strings.parody}</span>
        </div>
        {heading}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid ' + colors.panel, paddingTop: 18, fontSize: 30 }}>
          <span>{publication}</span><span>{score}</span>
        </div>
      </div>
    );
  }

  if (design === 'research') {
    return (
      <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={canvas}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 27, color: colors.accent }}>
          <span>{publication}</span><span>{strings.parody}</span>
        </div>
        <div style={{ display: 'flex', flex: 1, gap: 30, margin: '38px 0' }}>
          <div style={{ width: 20, backgroundColor: colors.accent }}></div>
          {heading}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 23px', backgroundColor: colors.panel, fontSize: 26 }}>
          <span>parody2shell</span><span>{score}</span>
        </div>
      </div>
    );
  }

  if (design === 'recall') {
    return (
      <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={{ ...canvas, padding: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff7e7', backgroundColor: colors.accent, padding: '36px 60px', fontSize: 32 }}>
          <span>{publication}</span><span>{strings.parody}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '24px 60px 40px' }}>
          {heading}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '3px solid ' + colors.panel, paddingTop: 18, fontSize: 26 }}>
            <span>parody2shell</span><span>{score}</span>
          </div>
        </div>
      </div>
    );
  }

  const lang = locale === 'ja' ? 'ja-JP' : 'en-US';
  const card = designs[advisory.design].card;
  const footer = (border: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: border, paddingTop: 16, fontSize: 24 }}>
      <span>parody2shell</span><span>{score}</span>
    </div>
  );

  if (card === 'signal') {
    const bars = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    return (
      <div lang={lang} style={{ ...canvas, borderTop: 'none', padding: 0 }}>
        <div style={{ display: 'flex', height: 22 }}>{bars.map(color => <div style={{ display: 'flex', flex: 1, backgroundColor: color }}></div>)}</div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '34px 64px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 27, color: colors.accent }}><span>{publication}</span><span>{strings.parody}</span></div>
          {heading}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: colors.accent, color: colors.background, padding: '16px 64px', fontSize: 27 }}>
          <span>parody2shell</span><span>{score}</span>
        </div>
      </div>
    );
  }

  if (card === 'blueprint') {
    return (
      <div lang={lang} style={{ ...canvas, borderTop: 'none', padding: 40, backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.08) 2px, transparent 2px)', backgroundSize: '60px 60px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: '3px solid ' + colors.ink, padding: '24px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: colors.accent, letterSpacing: 3 }}><span>{publication}</span><span>{strings.parody}</span></div>
          {heading}
          <div style={{ display: 'flex', alignSelf: 'flex-end', border: '2px solid ' + colors.ink, fontSize: 24 }}>
            <span style={{ padding: '8px 18px', borderRight: '2px solid ' + colors.ink }}>parody2shell</span><span style={{ padding: '8px 18px' }}>{score}</span>
          </div>
        </div>
      </div>
    );
  }

  if (card === 'paper' || card === 'folio') {
    const folio = card === 'folio';
    return (
      <div lang={lang} style={{ ...canvas, borderTop: 'none', padding: 46, backgroundColor: folio ? '#3d2a18' : '#9a968a' }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: colors.background, padding: '30px 48px', border: folio ? '6px solid ' + colors.accent : 'none', boxShadow: '0 10px 0 rgba(0,0,0,0.25)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, borderBottom: '2px solid ' + colors.ink, paddingBottom: 10, color: folio ? colors.accent : colors.ink }}>
            <span>{publication}</span><span>{advisory.evidence.timeline.published}</span><span>{strings.parody}</span>
          </div>
          {heading}
          {footer('2px dashed ' + colors.ink)}
        </div>
      </div>
    );
  }

  if (card === 'pixel' || card === 'board') {
    const pixel = card === 'pixel';
    return (
      <div lang={lang} style={{ ...canvas, borderTop: 'none', padding: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: pixel ? colors.panel : colors.accent, color: pixel ? colors.background : '#000', padding: '12px 22px', fontSize: 27, border: pixel ? 'none' : '4px solid #000' }}>
          <span>{publication}</span><span>{strings.parody}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, margin: '18px 0', padding: '0 26px', border: pixel ? '4px solid ' + colors.ink : '4px solid #000', backgroundColor: pixel ? 'transparent' : colors.panel, ...(!pixel && { boxShadow: '10px 10px 0 #000' }) }}>
          {heading}
        </div>
        {footer(pixel ? '2px solid ' + colors.panel : '4px solid #000')}
      </div>
    );
  }

  if (design !== 'maintainer' && design !== 'home') {
    const style = designs[design];
    const isWindow = style.card === 'window';
    const isDashboard = style.card === 'dashboard';
    const isLog = style.card === 'log';
    return (
      <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={{ ...canvas, padding: isWindow ? '40px' : '54px 64px', ...(isLog && { borderLeft: '20px solid ' + colors.accent }) }}>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: isWindow ? '20px 30px' : 0, ...(isWindow && { border: '3px solid ' + colors.accent }) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: isWindow ? colors.panel : 'transparent', padding: '13px 15px', color: colors.accent, fontSize: 27 }}>
            <span>{publication}</span><span>{strings.parody}</span>
          </div>
          <div style={{ display: 'flex', flex: 1, gap: 25, alignItems: 'stretch' }}>
            {heading}
            {isDashboard && <div style={{ display: 'flex', alignItems: 'center', backgroundColor: colors.panel, padding: '0 24px', fontSize: 33 }}>{score}</div>}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid ' + colors.panel, paddingTop: 16, fontSize: 24 }}>
            <span>parody2shell</span><span>{isDashboard ? strings.score : score}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div lang={locale === 'ja' ? 'ja-JP' : 'en-US'} style={{ ...canvas, padding: 40 }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, border: '2px solid ' + colors.panel, borderRadius: 22, padding: '32px 44px', backgroundColor: '#fcfaff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: colors.accent, fontSize: 27 }}>
          <span>{publication}</span><span>{strings.parody}</span>
        </div>
        {heading}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed ' + colors.panel, paddingTop: 18, fontSize: 26 }}>
          <span>parody2shell</span><span>{score}</span>
        </div>
      </div>
    </div>
  );
};
