import { useTranslation } from 'react-i18next';

// Accessibility: allows keyboard and AT users to bypass repetitive navigation.
// Visible only on focus; links to the <main id="main-content"> landmark in Board.
export default function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '8px',
        zIndex: 9999,
        padding: '10px 18px',
        background: '#1565c0',
        color: '#fff',
        borderRadius: '4px',
        textDecoration: 'none',
        fontWeight: 700,
        fontSize: '14px',
        transition: 'top 0.1s',
      }}
      onFocus={(e) => { e.currentTarget.style.top = '8px'; }}
      onBlur={(e)  => { e.currentTarget.style.top = '-100px'; }}
    >
      {t('a11y.skipToMain')}
    </a>
  );
}
