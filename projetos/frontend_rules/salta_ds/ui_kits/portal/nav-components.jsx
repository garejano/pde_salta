// Eleva Portal — Navigation components: Tabs, Breadcrumb, Pagination
const { useState } = React;

// ── Tabs ───────────────────────────────────────────────────────────
const Tabs = ({ tabs, activeId, onChange }) => (
  <div style={{ display:'flex', borderBottom:'2px solid #EBEDF1', gap:0 }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        display:'flex', alignItems:'center', gap:8, padding:'14px 20px',
        fontFamily:'Archivo', fontWeight:700, fontSize:14,
        color: t.id === activeId ? '#242CC2' : '#65686E',
        borderBottom: `2px solid ${t.id === activeId ? '#242CC2' : 'transparent'}`,
        marginBottom:-2, border:0, borderLeft:0, borderRight:0, borderTop:0,
        background:'transparent', cursor:'pointer', transition:'color 160ms, border-color 160ms',
        whiteSpace:'nowrap',
      }}>
        {t.icon && <MS name={t.icon} size={18} color="currentColor" />}
        {t.label}
        {t.count != null && (
          <span style={{ background: t.id === activeId ? '#242CC2' : '#EBEDF1', color: t.id === activeId ? '#fff' : '#65686E', borderRadius:999, padding:'0 6px', fontSize:11, fontFamily:'Nunito', fontWeight:700, lineHeight:'18px' }}>{t.count}</span>
        )}
      </button>
    ))}
  </div>
);

// ── Breadcrumb ──────────────────────────────────────────────────────
const Breadcrumb = ({ items }) => (
  <nav style={{ display:'flex', alignItems:'center', gap:4 }}>
    {items.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && <MS name="chevron_right" size={14} color="#C3C8D1" />}
        {i < items.length - 1 ? (
          <a onClick={item.onClick} style={{ fontFamily:'Nunito', fontSize:12, color:'#242CC2', textDecoration:'underline', cursor:'pointer' }}>{item.label}</a>
        ) : (
          <span style={{ fontFamily:'Nunito', fontSize:12, color:'#65686E' }}>{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

// ── Pagination ──────────────────────────────────────────────────────
const Pagination = ({ total, page, perPage = 10, onChange }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const pg = (n, label, disabled) => (
    <button key={label || n} disabled={disabled} onClick={() => !disabled && typeof n === 'number' && onChange(n)}
      style={{
        width:32, height:32, borderRadius:4, border:0, display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily: typeof n === 'number' ? 'Nunito' : 'inherit', fontSize:14,
        background: n === page ? '#242CC2' : 'transparent',
        color: n === page ? '#fff' : disabled ? '#C3C8D1' : '#3D3F42',
        cursor: disabled || typeof n !== 'number' ? 'default' : 'pointer',
        transition:'background 120ms',
      }}>
      {label || n}
    </button>
  );

  return (
    <div style={{ display:'flex', gap:4, alignItems:'center' }}>
      {pg(page - 1, <MS name="chevron_left" size={18} color={page === 1 ? '#C3C8D1' : '#65686E'} />, page === 1)}
      {getPages().map((p, i) => p === '...'
        ? <span key={`e${i}`} style={{ width:32, textAlign:'center', color:'#C3C8D1', fontSize:14 }}>…</span>
        : pg(p)
      )}
      {pg(page + 1, <MS name="chevron_right" size={18} color={page === totalPages ? '#C3C8D1' : '#65686E'} />, page === totalPages)}
    </div>
  );
};

Object.assign(window, { Tabs, Breadcrumb, Pagination });
