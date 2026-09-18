// Eleva Portal — Student list
const STUDENTS = [
  { id: 1, name: 'Maria Silva Santos', class: '1 ano A', track: 'Militar', email: 'maria.silva@eleva.edu.br', birth: '26/06/2010', faltas: 3, atrasos: 2, media: 8.4, status: 'Cursando' },
  { id: 2, name: 'João Pedro Oliveira', class: '2 ano B', track: 'Regular', email: 'joao.oliveira@eleva.edu.br', birth: '14/03/2009', faltas: 0, atrasos: 1, media: 9.1, status: 'Cursando' },
  { id: 3, name: 'Ana Clara Ferreira', class: '3 ano A', track: 'Militar', email: 'ana.ferreira@eleva.edu.br', birth: '02/11/2008', faltas: 5, atrasos: 4, media: 7.2, status: 'Atenção' },
  { id: 4, name: 'Lucas Almeida Costa', class: '1 ano C', track: 'Regular', email: 'lucas.costa@eleva.edu.br', birth: '19/09/2010', faltas: 1, atrasos: 0, media: 8.9, status: 'Cursando' },
  { id: 5, name: 'Beatriz Souza Lima', class: '2 ano A', track: 'Bilíngue', email: 'beatriz.lima@eleva.edu.br', birth: '07/05/2009', faltas: 2, atrasos: 1, media: 9.4, status: 'Destaque' },
  { id: 6, name: 'Rafael Mendes Rocha', class: '3 ano B', track: 'Regular', email: 'rafael.mendes@eleva.edu.br', birth: '30/01/2008', faltas: 8, atrasos: 6, media: 6.1, status: 'Pendente' },
];

const STATUS_COLORS = { Cursando: '#28975A', 'Atenção': '#FFAC30', Destaque: '#242CC2', Pendente: '#E65637' };
const TRACK_COLORS = { Militar: '#9D0364', Regular: '#65686E', 'Bilíngue': '#774BB0' };

const StudentList = ({ onOpen }) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('Todos');
  const filtered = STUDENTS.filter(s =>
    (filter === 'Todos' || s.track === filter) &&
    (s.name.toLowerCase().includes(query.toLowerCase()) || s.class.includes(query))
  );

  return (
    <div style={{ padding: 32, maxWidth: 1240, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontFamily: 'Nunito', fontSize: 12, color: '#65686E' }}>
          Visão geral <MS name="chevron_right" size={14} color="#65686E" /> Alunos
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <h1 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 700, fontSize: 40, color: '#0F0F10', letterSpacing: '-0.01em' }}>Alunos</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="outline" icon="download">Exportar</Button>
            <Button variant="fill" icon="add">Novo aluno</Button>
          </div>
        </div>
        <p style={{ margin: '8px 0 0', fontFamily: 'Nunito', fontSize: 16, color: '#65686E' }}>
          {filtered.length} {filtered.length === 1 ? 'aluno encontrado' : 'alunos encontrados'} · atualizado em 17/04/2026 às 08:12
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
        <div style={{ flex: 1, maxWidth: 360 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 40, padding: '0 16px', borderRadius: 8,
            border: '1px solid #C3C8D1', background: '#fff',
          }}>
            <MS name="search" size={20} color="#65686E" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nome ou turma..."
              style={{ border: 0, outline: 0, fontFamily: 'Nunito', fontSize: 14, flex: 1, background: 'transparent' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Todos', 'Militar', 'Regular', 'Bilíngue'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 14px', borderRadius: 8, border: '1px solid #C3C8D1',
              background: filter === f ? '#242CC2' : '#fff',
              color: filter === f ? '#fff' : '#3D3F42',
              borderColor: filter === f ? '#242CC2' : '#C3C8D1',
              fontFamily: 'Nunito', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #EBEDF1', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1fr 40px',
          padding: '12px 20px', background: '#F8F9FB', borderBottom: '1px solid #EBEDF1',
          fontFamily: 'Nunito', fontWeight: 700, fontSize: 12, color: '#65686E',
          textTransform: 'uppercase', letterSpacing: '0.02em', gap: 12,
        }}>
          <span>Aluno</span><span>Turma</span><span>Trilha</span>
          <span style={{ textAlign: 'right' }}>Faltas</span>
          <span style={{ textAlign: 'right' }}>Atrasos</span>
          <span style={{ textAlign: 'right' }}>Média</span>
          <span>Situação</span><span></span>
        </div>
        {filtered.map(s => (
          <div key={s.id} onClick={() => onOpen(s)} style={{
            display: 'grid', gridTemplateColumns: '2.2fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1fr 40px',
            padding: '14px 20px', borderBottom: '1px solid #EBEDF1', alignItems: 'center',
            cursor: 'pointer', gap: 12,
          }} onMouseEnter={(e) => e.currentTarget.style.background = '#F8F9FB'}
             onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={s.name} size={36} />
              <div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, color: '#0F0F10' }}>{s.name}</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 12, color: '#65686E' }}>{s.email}</div>
              </div>
            </div>
            <span style={{ fontFamily: 'Nunito', fontSize: 14, color: '#3D3F42' }}>{s.class}</span>
            <Tag color={TRACK_COLORS[s.track]} size="sm">{s.track}</Tag>
            <span style={{ fontFamily: 'Nunito', fontSize: 14, color: '#3D3F42', textAlign: 'right' }}>{s.faltas}</span>
            <span style={{ fontFamily: 'Nunito', fontSize: 14, color: '#3D3F42', textAlign: 'right' }}>{s.atrasos}</span>
            <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 14, color: '#0F0F10', textAlign: 'right' }}>{s.media.toFixed(1)}</span>
            <Tag color={STATUS_COLORS[s.status]} size="sm">{s.status}</Tag>
            <MS name="chevron_right" size={20} color="#65686E" />
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { StudentList, STUDENTS, STATUS_COLORS, TRACK_COLORS });
