// Carômetro — page layout & app
// A4 (96dpi) = 794 × 1123 px

// ─── School mark (placeholder, no Alfa brand asset) ───────────────────
const SchoolMark = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 44, height: 44, borderRadius: 10,
      background: 'linear-gradient(135deg, #242CC2 0%, #9D0364 100%)',
      display: 'grid', placeItems: 'center',
      fontFamily: 'Archivo', fontWeight: 800, fontSize: 22, color: '#fff',
      letterSpacing: '-0.04em',
    }}>A</div>
    <div>
      <div style={{
        fontFamily: 'Archivo', fontWeight: 700, fontSize: 18, lineHeight: 1,
        color: 'var(--color-neutral-dark3)', letterSpacing: '-0.01em',
      }}>
        Alfa <span style={{ color: 'var(--color-neutral)', fontWeight: 500 }}>|</span> Campo Mourão
      </div>
      <div style={{
        fontFamily: 'Nunito', fontSize: 10, color: 'var(--color-neutral-dark1)',
        marginTop: 4, lineHeight: '12px', maxWidth: 520,
      }}>
        {SCHOOL.line1}
      </div>
      <div style={{
        fontFamily: 'Nunito', fontSize: 9, color: 'var(--color-neutral)',
        marginTop: 2, lineHeight: '11px', maxWidth: 520,
      }}>
        {SCHOOL.line2}
      </div>
    </div>
  </div>
);

// ─── Eleva product mark (small, top-right) ────────────────────────────
const ElevaMark = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="elevaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#30B7BE" />
          <stop offset="100%" stopColor="#39D881" />
        </linearGradient>
      </defs>
      <path d="M6 8 C 6 6, 8 4, 10 4 L 22 4 C 24 4, 26 6, 26 8 L 26 11 L 11 11 L 11 14 L 22 14 L 22 19 L 11 19 L 11 22 L 26 22 L 26 25 C 26 27, 24 28, 22 28 L 10 28 C 8 28, 6 26, 6 25 Z"
        fill="url(#elevaGrad)" />
    </svg>
    <span style={{
      fontFamily: 'Archivo', fontWeight: 600, fontSize: 11,
      color: 'var(--color-neutral-dark1)', letterSpacing: '0.04em',
    }}>
      eleva
    </span>
  </div>
);

// ─── Section bar (CARÔMETRO + meta) ───────────────────────────────────
const SectionBar = () => (
  <div style={{
    borderTop: '1.5px solid var(--color-neutral-dark3)',
    borderBottom: '1px solid var(--color-neutral-light1)',
    padding: '6px 0 4px',
    display: 'flex', alignItems: 'baseline', gap: 16,
  }}>
    <div style={{
      fontFamily: 'Archivo', fontWeight: 700, fontSize: 16,
      color: 'var(--color-neutral-dark3)', letterSpacing: '0.04em',
    }}>
      CARÔMETRO
    </div>
    <div style={{ flex: 1 }} />
    <div style={{
      fontFamily: 'Nunito', fontSize: 11, color: 'var(--color-neutral-dark1)',
    }}>
      Emitido em <span style={{ color: 'var(--color-neutral-dark2)', fontWeight: 600 }}>15/02/2026</span>
    </div>
  </div>
);

const ClassMetaBar = () => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'Nunito', fontSize: 11, color: 'var(--color-neutral-dark2)',
    padding: '4px 0',
  }}>
    <div>
      <span style={{ color: 'var(--color-neutral-dark1)' }}>Inspetor: </span>
      <span style={{ fontWeight: 600 }}>{TURMA.inspetor}</span>
    </div>
    <div style={{ display: 'flex', gap: 18 }}>
      <div>
        <span style={{ color: 'var(--color-neutral-dark1)' }}>Turma: </span>
        <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark3)' }}>{TURMA.label}</span>
      </div>
      <div>
        <span style={{ color: 'var(--color-neutral-dark1)' }}>Fotos: </span>
        <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark3)' }}>{TURMA.count}</span>
      </div>
    </div>
  </div>
);

// ─── Mini header (page 2+) ────────────────────────────────────────────
const MiniHeader = () => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontFamily: 'Nunito', fontSize: 10, color: 'var(--color-neutral-dark1)',
    paddingBottom: 6, borderBottom: '1px solid var(--color-neutral-light2)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 16, height: 16, borderRadius: 4,
        background: 'linear-gradient(135deg, #242CC2 0%, #9D0364 100%)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'Archivo', fontWeight: 800, fontSize: 9, color: '#fff',
      }}>A</div>
      <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark3)' }}>Alfa</span>
      <span style={{ color: 'var(--color-neutral-light1)' }}>·</span>
      <span>Campo Mourão</span>
      <span style={{ color: 'var(--color-neutral-light1)' }}>·</span>
      <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark2)' }}>Carômetro</span>
    </div>
    <div>
      <span style={{ color: 'var(--color-neutral-dark1)' }}>Turma: </span>
      <span style={{ fontWeight: 700, color: 'var(--color-neutral-dark3)' }}>{TURMA.label}</span>
    </div>
  </div>
);

// ─── Grid of student cards (3 × 5 = 15) ───────────────────────────────
const StudentsGrid = ({ Card, students }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    rowGap: 8,
    flex: 1,
    alignContent: 'start',
  }}>
    {students.map((s) => <Card key={s.ra} student={s} />)}
  </div>
);

// ─── Page footer ──────────────────────────────────────────────────────
const PageFooter = ({ page, total }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 8, borderTop: '1px solid var(--color-neutral-light2)',
    fontFamily: 'Nunito', fontSize: 9, color: 'var(--color-neutral)',
  }}>
    <ElevaMark />
    <span>Página {page} / {total}</span>
  </div>
);

// ─── Full A4 page ─────────────────────────────────────────────────────
const CarometroPage = ({ Card, isFirst = true, students }) => (
  <div style={{
    width: 794, height: 1123,
    background: '#fff',
    padding: '28px 32px 22px',
    display: 'flex', flexDirection: 'column', gap: 10,
    boxSizing: 'border-box',
    fontFamily: 'Nunito',
  }}>
    {isFirst ? (
      <React.Fragment>
        <SchoolMark />
        <SectionBar />
        <ClassMetaBar />
      </React.Fragment>
    ) : (
      <MiniHeader />
    )}
    <StudentsGrid Card={Card} students={students} />
    <PageFooter page={1} total={1} />
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────
const App = () => {
  // Always 15 students per page (3×5)
  const studentsPage1 = STUDENTS.slice(0, 15);

  return (
    <DesignCanvas>
      <DCSection
        id="variations"
        title="Carômetro · variações de card"
        subtitle="A4 (210×297mm), 3 colunas × 5 linhas = 15 alunos por página · espaçamento compacto · Eleva Design System"
      >
        <DCArtboard id="a" label="A · Refinado clássico" width={794} height={1123}>
          <CarometroPage Card={CardA} students={studentsPage1} />
        </DCArtboard>
        <DCArtboard id="b" label="B · Foto-first (yearbook)" width={794} height={1123}>
          <CarometroPage Card={CardB} students={studentsPage1} />
        </DCArtboard>
        <DCArtboard id="c" label="C · Densa / Index card" width={794} height={1123}>
          <CarometroPage Card={CardC} students={studentsPage1} />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
