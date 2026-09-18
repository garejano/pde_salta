// Page header: title + back · pagination row
const NAV_STUDENTS = [
  { id: 1, nome: 'Ana Beatriz Costa', ra: '2024-789001', turma: '1º ano A', avatarColor: '#E3E5FB' },
  { id: 2, nome: 'Bruno Henrique Lima', ra: '2024-789002', turma: '1º ano B', avatarColor: '#D9F5E4' },
  { id: 3, nome: 'Carlos Eduardo Souza', ra: '2024-789003', turma: '2º ano A', avatarColor: '#FBE3DC' },
  { id: 4, nome: 'Diana Rodrigues Silva', ra: '2024-789004', turma: '2º ano B', avatarColor: '#FFF3DF' },
  { id: 12, nome: 'Maria Albuquerque Santos', ra: '2024-789456', turma: '3º ano A', avatarColor: '#E3E5FB' },
  { id: 5, nome: 'Eduardo Martins Alves', ra: '2024-789005', turma: '3º ano B', avatarColor: '#EDE3FF' },
  { id: 6, nome: 'Fernanda Lima Pereira', ra: '2024-789006', turma: '1º ano A', avatarColor: '#FFE0C4' },
  { id: 7, nome: 'Gabriel Santos Costa', ra: '2024-789007', turma: '2º ano A', avatarColor: '#D9F5E4' },
  { id: 8, nome: 'Helena Oliveira Nunes', ra: '2024-789008', turma: '3º ano A', avatarColor: '#FBE3DC' },
];

const StudentNavSelect = ({ isMobile, iconOnly }) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const ref = React.useRef(null);
  const listRef = React.useRef(null);
  const activeItemRef = React.useRef(null);
  const current = NAV_STUDENTS.find(s => s.id === 12);

  React.useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  React.useEffect(() => {
    if (open && !query && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: 'center' });
    }
  }, [open]);

  const filtered = NAV_STUDENTS.filter(s =>
    !query || s.nome.toLowerCase().includes(query.toLowerCase()) || s.ra.includes(query) || s.turma.toLowerCase().includes(query.toLowerCase())
  );

  const initials = (nome) => nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {iconOnly ? (
        <button onClick={() => setOpen(o => !o)} title={current?.nome} style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          width: 56, height: 36, padding: '0 12px', flexShrink: 0,
          background: '#fff', border: '1px solid var(--color-primary)', borderRadius: 8,
          cursor: 'pointer', color: 'var(--color-primary)',
        }}
        onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-light3)'}
        onMouseOut={(e) => e.currentTarget.style.background = '#fff'}>
          <MS name="search" size={20} color="currentColor" style={{ fontVariationSettings: "'wght' 600" }} />
          <MS name={open ? 'expand_less' : 'expand_more'} size={16} color="currentColor" />
        </button>
      ) : (
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: 44, padding: '0 12px 0 6px', minWidth: isMobile ? 220 : 280,
        background: '#fff', border: '1px solid var(--color-primary)', borderRadius: 8,
        cursor: 'pointer',
      }}
      onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-light3)'}
      onMouseOut={(e) => e.currentTarget.style.background = '#fff'}>
        <div style={{
          width: 32, height: 32, borderRadius: 999, background: current?.avatarColor || '#EBEDF1', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 12, color: '#3D3F42',
        }}>{current ? initials(current.nome) : ''}</div>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: '#0F0F10', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{current?.nome}</div>
          <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>RA {current?.ra}</div>
        </div>
        <MS name={open ? 'expand_less' : 'expand_more'} size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
      </button>
      )}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', zIndex: 30,
          left: iconOnly ? 'auto' : 0, right: iconOnly ? 0 : (isMobile ? 0 : 'auto'),
          background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8,
          boxShadow: '0 8px 24px rgba(0,23,31,0.14)', overflow: 'hidden',
          width: isMobile && !iconOnly ? '100%' : 340,
        }}>
          <div style={{ padding: 10, borderBottom: '1px solid #EBEDF1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 10px', border: '1px solid #C3C8D1', borderRadius: 8 }}>
              <MS name="search" size={18} color="#65686E" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nome, RA ou turma" autoFocus style={{
                flex: 1, border: 0, outline: 'none', fontFamily: 'var(--font-body-family)', fontSize: 14, color: '#0F0F10',
              }} />
            </div>
          </div>
          <div ref={listRef} style={{ maxHeight: 320, overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '20px 14px', textAlign: 'center', fontFamily: 'var(--font-body-family)', fontSize: 13, color: '#65686E' }}>Nenhum aluno encontrado</div>
            )}
            {filtered.map(s => {
              const active = s.id === current?.id;
              return (
                <button key={s.id} ref={active ? activeItemRef : null} onClick={() => setOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px',
                  background: active ? 'var(--color-primary-light3)' : '#fff', border: 0, borderBottom: '1px solid #F2F2F2',
                  cursor: 'pointer', textAlign: 'left',
                }}
                onMouseOver={(e) => { if (!active) e.currentTarget.style.background = '#F8F9FB'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = active ? 'var(--color-primary-light3)' : '#fff'; }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 999, background: s.avatarColor, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 13, color: '#3D3F42',
                  }}>{initials(s.nome)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, color: active ? 'var(--color-primary)' : '#0F0F10', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.nome}</span>
                      {active && <MS name="check" size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />}
                    </div>
                    <div style={{ fontFamily: 'var(--font-body-family)', fontSize: 12, color: '#65686E' }}>RA {s.ra} · {s.turma}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Page header: title + back · pagination row
const PageHeader = ({ onBack, onPrev, onNext }) => {
  const { isMobile, isCompact } = useBreakpoint();
  return (
    <div style={{ padding: '24px 0 8px' }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        padding: isMobile ? '0 16px' : isCompact ? '0 24px' : '0 32px',
      }}>
        {/* Page title */}
        <h1 style={{
          margin: '0 0 16px',
          fontFamily: 'var(--font-display-family)', fontWeight: 600,
          fontSize: isMobile ? 22 : isCompact ? 26 : 32,
          color: 'var(--color-neutral-dark3)', letterSpacing: '-0.01em',
          lineHeight: isMobile ? 1.2 : '48px',
        }}>Painel do Aluno</h1>

        {/* Back + pagination row */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 10 : 16,
        }}>
          <a href="../lista-alunos/index.html"
            onClick={e => { e.preventDefault(); if (onBack) onBack(); else if (window.__navToLista) window.__navToLista(); }}
            style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 10px',
            background: 'transparent', border: 0, borderRadius: 8, cursor: 'pointer',
            color: 'var(--color-primary)', fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-primary-light3)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
            <MS name="chevron_left" size={20} color="var(--color-primary)" />
            {isMobile ? 'Lista de alunos' : 'Voltar para lista de alunos'}
          </a>

          {!isMobile && <div style={{ flex: 1 }} />}

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={onPrev} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              height: 36, padding: '0 12px',
              background: '#fff', border: '1px solid var(--color-primary)', borderRadius: 8,
              cursor: 'pointer', color: 'var(--color-primary)',
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-primary-light3)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}>
              <MS name="arrow_back" size={16} color="currentColor" />
              {!isMobile && 'Anterior'}
            </button>
            <StudentNavSelect isMobile={isMobile} iconOnly />
            <button onClick={onNext} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              height: 36, padding: '0 12px',
              background: '#fff', border: '1px solid var(--color-primary)', borderRadius: 8,
              cursor: 'pointer', color: 'var(--color-primary)',
              fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14, lineHeight: '14px',
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'var(--color-primary-light3)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = '#fff'; }}>
              {!isMobile && 'Próximo'}
              <MS name="arrow_forward" size={16} color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { PageHeader });
