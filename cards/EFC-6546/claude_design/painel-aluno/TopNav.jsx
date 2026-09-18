// Atlas — Top Navigation
const TopNav = () => {
  const { isMobile, isCompact } = useBreakpoint();
  return (
    <header style={{
      height: 64, background: '#fff', borderBottom: '1px solid var(--color-neutral-light2)',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '0 16px' : '0 24px',
      gap: isMobile ? 10 : 20,
      position: 'sticky', top: 0, zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg,#30B7BE 0%,#39D881 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 17L10 3L16 17" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.5 12H13.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 800, fontSize: 18, color: '#0F0F10', letterSpacing: '-0.01em' }}>atlas</span>
          {!isMobile && (
            <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 500, fontSize: 9, color: '#65686E', letterSpacing: '0.14em', marginTop: 2 }}>GESTÃO ESCOLAR</span>
          )}
        </div>
      </div>

      {/* Menu button */}
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 36, padding: isMobile ? '0 8px' : '0 12px', marginLeft: isMobile ? 0 : 8,
        background: 'transparent', border: 0, borderRadius: 8,
        cursor: 'pointer', color: '#0F0F10',
        fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 15,
      }}
      onMouseOver={(e) => e.currentTarget.style.background = '#F2F2F2'}
      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
        <MS name="menu" size={22} color="#0F0F10" />
        {!isMobile && 'Menu'}
      </button>

      <div style={{ flex: 1 }} />

      {/* Right actions */}
      {!isMobile && <IconButton icon="apps" size={40} />}
      <div style={{ position: 'relative' }}>
        <IconButton icon="notifications" size={40} />
        <span style={{
          position: 'absolute', top: 6, right: 6, width: 10, height: 10,
          borderRadius: 999, background: '#E65637', border: '2px solid #fff',
        }} />
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 999,
        background: 'linear-gradient(135deg,#FFDEAC,#FFAC30)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10',
        cursor: 'pointer', border: '2px solid #fff',
        boxShadow: '0 0 0 1px #EBEDF1',
        flexShrink: 0,
      }}>CM</div>
    </header>
  );
};

Object.assign(window, { TopNav });
