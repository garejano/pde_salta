// Eleva Portal — primitives (Button, Input, Tag, Avatar, Alert, Toast)
const { useState, useEffect } = React;

const MS = ({ name, size = 22, color, style = {} }) => (
  <span className="material-symbols-outlined" style={{ fontSize: size, color, ...style }}>{name}</span>
);

const Button = ({ variant = 'fill', icon, children, counter, disabled, onClick, size = 'md' }) => {
  const h = size === 'sm' ? 32 : 40;
  const fontSize = size === 'sm' ? 14 : 16;
  const pad = size === 'sm' ? '6px 12px' : '8px 16px';
  const base = {
    fontFamily: 'Archivo', fontWeight: 700, fontSize,
    padding: pad, height: h, borderRadius: 8,
    display: 'inline-flex', alignItems: 'center', gap: 8,
    border: '1px solid transparent', cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 160ms, color 160ms, border-color 160ms',
    lineHeight: 1, whiteSpace: 'nowrap',
  };
  const styles = {
    fill:    { background: '#242CC2', color: '#fff' },
    outline: { background: '#fff', color: '#242CC2', borderColor: '#242CC2' },
    ghost:   { background: 'transparent', color: '#242CC2' },
    danger:  { background: '#E65637', color: '#fff' },
  };
  const disStyle = { background: '#EBEDF1', color: '#ADB2BA', borderColor: 'transparent' };
  return (
    <button onClick={disabled ? undefined : onClick}
            style={{ ...base, ...(disabled ? disStyle : styles[variant]) }}>
      {icon && <MS name={icon} size={18} />}
      {children}
      {counter != null && (
        <span style={{
          width: 22, height: 22, borderRadius: 999, background: '#fff',
          color: '#9D0364', display: 'inline-flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: 'Nunito', fontWeight: 700,
          fontSize: 12, marginLeft: 4,
        }}>{counter}</span>
      )}
    </button>
  );
};

const IconButton = ({ icon, onClick, variant = 'ghost', active, size = 40 }) => {
  const styles = {
    ghost:   { background: active ? '#EBEDF1' : 'transparent', color: '#3D3F42' },
    fill:    { background: '#242CC2', color: '#fff' },
    outline: { background: '#fff', color: '#242CC2', border: '1px solid #242CC2' },
  };
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: size >= 40 ? 999 : 8,
      border: 0, cursor: 'pointer', display: 'inline-flex',
      alignItems: 'center', justifyContent: 'center', ...styles[variant],
    }}>
      <MS name={icon} size={22} color="currentColor" />
    </button>
  );
};

const Input = ({ label, icon, value, onChange, placeholder, error, helpText, type = 'text' }) => {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? '#E65637' : focus ? '#242CC2' : '#C3C8D1';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, color: '#0F0F10' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', height: 40, borderRadius: 8,
        border: `1px solid ${borderColor}`,
        boxShadow: focus ? '0 0 0 3px rgba(36,44,194,0.24)' : 'none',
        background: '#fff', transition: 'all 160ms',
      }}>
        {icon && <MS name={icon} size={20} color="#65686E" />}
        <input type={type} value={value ?? ''} placeholder={placeholder}
               onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
               onChange={(e) => onChange && onChange(e.target.value)}
               style={{
                 border: 0, outline: 0, fontFamily: 'Nunito', fontSize: 16,
                 flex: 1, color: '#0F0F10', background: 'transparent', minWidth: 0,
               }} />
      </div>
      {(helpText || error) && (
        <span style={{
          fontFamily: 'Nunito', fontSize: 12,
          color: error ? '#E65637' : '#65686E',
        }}>{error || helpText}</span>
      )}
    </div>
  );
};

const Tag = ({ children, color = '#242CC2', icon, size = 'md' }) => {
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 6,
      padding: sm ? '2px 10px' : '4px 12px', borderRadius: 999,
      background: color, color: color === '#FFAC30' ? '#0F0F10' : '#fff',
      fontFamily: 'Archivo', fontWeight: 700, fontSize: sm ? 12 : 13,
      whiteSpace: 'nowrap',
    }}>
      {icon && <MS name={icon} size={sm ? 14 : 16} color="currentColor" />}
      {children}
    </span>
  );
};

const Avatar = ({ name, size = 40 }) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 999,
      background: 'linear-gradient(135deg, #30B7BE 0%, #39D881 100%)',
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Archivo', fontWeight: 700, fontSize: size * 0.38,
      flexShrink: 0,
    }}>{initials}</div>
  );
};

const Alert = ({ variant = 'info', title, children, actions }) => {
  const colors = { info: '#242CC2', success: '#28975A', warning: '#FFAC30', error: '#E65637' };
  const icons = { info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
  return (
    <div style={{
      display: 'flex', background: '#EBEDF1', borderRadius: 8,
      overflow: 'hidden', position: 'relative',
    }}>
      <div style={{ width: 8, background: colors[variant], flexShrink: 0 }} />
      <div style={{ padding: 16, display: 'flex', gap: 12, flex: 1, alignItems: 'flex-start' }}>
        <MS name={icons[variant]} size={24} color={colors[variant]} style={{ marginTop: 0 }} />
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontFamily: 'Nunito', fontWeight: 700, fontSize: 16, color: '#0F0F10' }}>{title}</h4>
          <p style={{ margin: '4px 0 0', fontFamily: 'Nunito', fontSize: 14, color: '#3D3F42', lineHeight: 1.4 }}>{children}</p>
          {actions && <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>{actions}</div>}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ title, onClose, duration = 4000 }) => {
  const [remaining, setRemaining] = useState(100);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.max(0, 100 - (Date.now() - start) / duration * 100);
      setRemaining(pct);
      if (pct === 0) { clearInterval(id); onClose && onClose(); }
    }, 50);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      width: 328, background: '#fff', borderRadius: 8,
      boxShadow: '0 4px 12px -2px rgba(0,23,31,.15)', overflow: 'hidden',
      position: 'fixed', bottom: 24, right: 24, zIndex: 50,
    }}>
      <div style={{ display: 'flex', gap: 8, padding: '24px 16px 16px' }}>
        <MS name="sentiment_very_satisfied" size={32} color="#28975A" />
        <p style={{ margin: 0, flex: 1, fontFamily: 'Inter', fontSize: 18, color: '#0F0F10', lineHeight: 1.3 }}>{title}</p>
        <MS name="close" size={24} color="#65686E" style={{ cursor: 'pointer' }} />
      </div>
      <div style={{ height: 8, background: '#EBEDF1' }}>
        <div style={{ height: '100%', width: `${remaining}%`, background: '#242CC2', transition: 'width 50ms linear' }} />
      </div>
    </div>
  );
};

Object.assign(window, { MS, Button, IconButton, Input, Tag, Avatar, Alert, Toast });
