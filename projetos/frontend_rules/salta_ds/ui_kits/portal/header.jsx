// Eleva Portal — Header
const Header = ({ onMenuToggle, userName = 'Ana Diretora' }) => {
  return (
    <header style={{
      height: 64, background: '#fff', borderBottom: '1px solid #EBEDF1',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <IconButton icon="menu" onClick={onMenuToggle} size={40} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(180deg,#30B7BE,#39D881)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src="../../assets/eleva-logo-mark.svg" style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} />
        </div>
        <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 20, color: '#0F0F10' }}>Eleva</span>
      </div>

      <div style={{ flex: 1, maxWidth: 420, marginLeft: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          height: 40, padding: '0 16px', borderRadius: 8,
          border: '1px solid #C3C8D1', background: '#F8F9FB',
        }}>
          <MS name="search" size={20} color="#65686E" />
          <input placeholder="Buscar alunos, turmas..." style={{
            border: 0, outline: 0, background: 'transparent', flex: 1,
            fontFamily: 'Nunito', fontSize: 14, color: '#0F0F10',
          }} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <IconButton icon="help_outline" size={40} />
      <div style={{ position: 'relative' }}>
        <IconButton icon="notifications" size={40} />
        <span style={{
          position: 'absolute', top: 4, right: 4, width: 16, height: 16,
          borderRadius: 999, background: '#9D0364', color: '#fff',
          fontFamily: 'Nunito', fontWeight: 700, fontSize: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>3</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8, borderLeft: '1px solid #EBEDF1', marginLeft: 4 }}>
        <Avatar name={userName} size={36} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, color: '#0F0F10', lineHeight: 1.2 }}>{userName}</span>
          <span style={{ fontFamily: 'Nunito', fontSize: 12, color: '#65686E', lineHeight: 1.2 }}>Administração</span>
        </div>
      </div>
    </header>
  );
};

Object.assign(window, { Header });
