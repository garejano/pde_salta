// Carômetro — three card variations
// Each card receives `student` and renders at a fixed width designed for
// a 3-column grid on A4 (page content width 704px, gap 10px → ~228px wide).

const respLabel = (kind) =>
  kind === 'pedagógico' ? 'Responsável pedagógico' : 'Responsável financeiro';

const respColor = (kind) =>
  kind === 'pedagógico' ? 'var(--color-primary)' : 'var(--color-secondary)';

// ─── Shared Avatar ────────────────────────────────────────────────────
const Avatar = ({ name, size = 40, rounded = '50%' }) => {
  const { bg, fg } = paletteFor(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: rounded,
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Archivo, sans-serif', fontWeight: 700,
      fontSize: Math.round(size * 0.38), letterSpacing: '-0.02em',
      flexShrink: 0,
    }}>
      {initials(name)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// VARIATION A — Refinamento do original
// Avatar à esquerda, identidade no topo direito, responsável full-width
// ═══════════════════════════════════════════════════════════════════════
const CardA = ({ student }) => {
  const { resp } = student;
  return (
    <div style={{
      border: '1px solid var(--color-neutral-light2)',
      borderRadius: 8,
      padding: '10px 12px',
      background: '#fff',
      display: 'flex', flexDirection: 'column', gap: 8,
      breakInside: 'avoid',
    }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Avatar name={student.name} size={40} rounded={8} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{
            fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, lineHeight: '15px',
            color: 'var(--color-neutral-dark3)',
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {student.name}
          </div>
          <div style={{
            fontFamily: 'Nunito', fontSize: 11, color: 'var(--color-neutral-dark1)',
            marginTop: 2, letterSpacing: '0.02em',
          }}>
            RA <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark2)' }}>{student.ra}</span>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed var(--color-neutral-light2)', paddingTop: 6 }}>
        <div style={{
          fontFamily: 'Nunito', fontSize: 10, fontWeight: 700,
          color: respColor(resp.kind), textTransform: 'uppercase', letterSpacing: '0.06em',
          marginBottom: 2,
        }}>
          {respLabel(resp.kind)}
        </div>
        <div style={{
          fontFamily: 'Nunito', fontSize: 11, lineHeight: '15px',
          color: 'var(--color-neutral-dark2)',
        }}>
          <div style={{ fontWeight: 600 }}>{resp.name}</div>
          <div>{resp.phone}</div>
          <div style={{ color: 'var(--color-neutral-dark1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {resp.email}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// VARIATION B — Foto-first (yearbook)
// Foto quadrada destacada no topo, nome centralizado, responsável compacto
// ═══════════════════════════════════════════════════════════════════════
const CardB = ({ student }) => {
  const { resp } = student;
  const { bg, fg } = paletteFor(student.name);
  return (
    <div style={{
      border: '1px solid var(--color-neutral-light2)',
      borderRadius: 8,
      background: '#fff',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      breakInside: 'avoid',
    }}>
      {/* Photo block */}
      <div style={{
        background: bg, height: 88,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{
          fontFamily: 'Archivo', fontWeight: 700, fontSize: 36,
          color: fg, letterSpacing: '-0.02em',
        }}>{initials(student.name)}</div>
        <div style={{
          position: 'absolute', top: 6, right: 8,
          fontFamily: 'Archivo', fontSize: 9, fontWeight: 600,
          color: fg, opacity: 0.85, letterSpacing: '0.06em',
          background: 'rgba(255,255,255,0.65)', padding: '2px 6px', borderRadius: 999,
        }}>
          RA {student.ra}
        </div>
      </div>

      <div style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, lineHeight: '15px',
          color: 'var(--color-neutral-dark3)', textAlign: 'center',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: 30,
        }}>
          {student.name}
        </div>

        <div style={{
          borderTop: '1px solid var(--color-neutral-light2)',
          paddingTop: 6,
          fontFamily: 'Nunito', fontSize: 10.5, lineHeight: '14px',
          color: 'var(--color-neutral-dark2)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2,
            color: respColor(resp.kind), fontSize: 9, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%', background: respColor(resp.kind),
            }} />
            Resp. {resp.kind}
          </div>
          <div style={{ fontWeight: 600 }}>{resp.name}</div>
          <div style={{ color: 'var(--color-neutral-dark1)' }}>{resp.phone}</div>
          <div style={{ color: 'var(--color-neutral-dark1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {resp.email}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// VARIATION C — Densa / Index card
// Layout horizontal compacto, faixa de cor indica tipo de responsável
// ═══════════════════════════════════════════════════════════════════════
const CardC = ({ student }) => {
  const { resp } = student;
  return (
    <div style={{
      border: '1px solid var(--color-neutral-light2)',
      borderLeft: `3px solid ${respColor(resp.kind)}`,
      borderRadius: 6,
      padding: '8px 10px 9px 12px',
      background: '#fff',
      display: 'grid',
      gridTemplateColumns: '38px 1fr',
      gap: 10,
      breakInside: 'avoid',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <Avatar name={student.name} size={38} rounded={6} />
        <div style={{
          fontFamily: 'Archivo', fontSize: 8, fontWeight: 700,
          color: 'var(--color-neutral-dark1)', letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          RA
        </div>
        <div style={{
          fontFamily: 'Archivo', fontSize: 9, fontWeight: 700,
          color: 'var(--color-neutral-dark2)', marginTop: -3,
        }}>
          {student.ra.slice(-4)}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Archivo', fontWeight: 700, fontSize: 13, lineHeight: '15px',
          color: 'var(--color-neutral-dark3)',
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          minHeight: 30,
        }}>
          {student.name}
        </div>

        <div style={{
          fontFamily: 'Nunito', fontSize: 10, color: 'var(--color-neutral-dark1)',
          display: 'flex', flexDirection: 'column', gap: 1,
        }}>
          <div style={{
            color: respColor(resp.kind), fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9,
          }}>
            Resp. {resp.kind}
          </div>
          <div style={{ color: 'var(--color-neutral-dark2)', fontWeight: 600, lineHeight: '13px' }}>
            {resp.name}
          </div>
          <div style={{ lineHeight: '13px' }}>{resp.phone}</div>
          <div style={{ lineHeight: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {resp.email}
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { CardA, CardB, CardC, Avatar, respLabel, respColor });
