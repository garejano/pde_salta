// Eleva Portal — Sidebar
const NAV_ITEMS = [
  { id: 'overview', label: 'Visão geral', icon: 'dashboard' },
  { id: 'students', label: 'Alunos', icon: 'school' },
  { id: 'classes', label: 'Turmas', icon: 'groups' },
  { id: 'attendance', label: 'Frequência', icon: 'fact_check' },
  { id: 'grades', label: 'Notas', icon: 'grade' },
  { id: 'files', label: 'Arquivos', icon: 'folder' },
];
const SECONDARY = [
  { id: 'settings', label: 'Configurações', icon: 'settings' },
  { id: 'help', label: 'Ajuda', icon: 'help_outline' },
];

const Sidebar = ({ active, onNavigate, collapsed }) => {
  const w = collapsed ? 72 : 240;
  const item = (it) => {
    const isActive = it.id === active;
    return (
      <button key={it.id} onClick={() => onNavigate(it.id)} style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px', margin: '2px 8px', borderRadius: 8,
        border: 0, cursor: 'pointer', textAlign: 'left',
        background: isActive ? '#E3E5FB' : 'transparent',
        color: isActive ? '#242CC2' : '#3D3F42',
        fontFamily: 'Nunito', fontWeight: isActive ? 700 : 500, fontSize: 14,
        transition: 'background 160ms, color 160ms',
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <MS name={it.icon} size={22} color="currentColor" />
        {!collapsed && <span>{it.label}</span>}
      </button>
    );
  };
  return (
    <aside style={{
      width: w, background: '#fff', borderRight: '1px solid #EBEDF1',
      display: 'flex', flexDirection: 'column', padding: '16px 0',
      transition: 'width 200ms', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {NAV_ITEMS.map(item)}
      </div>
      <div style={{ borderTop: '1px solid #EBEDF1', paddingTop: 12 }}>
        {SECONDARY.map(item)}
      </div>
    </aside>
  );
};

Object.assign(window, { Sidebar });
