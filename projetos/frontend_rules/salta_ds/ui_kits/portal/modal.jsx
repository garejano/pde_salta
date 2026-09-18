// Eleva Portal — Modal shell
const Modal = ({ title, open, onClose, children, actions, width = 560 }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 200ms ease-out',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width, maxWidth: '90vw', maxHeight: '85vh',
        background: '#fff', borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 12px 24px -6px rgba(0,23,31,0.18)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid #EBEDF1',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <h3 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 700, fontSize: 20, color: '#0F0F10' }}>{title}</h3>
          <IconButton icon="close" onClick={onClose} size={32} />
        </div>
        <div style={{ padding: 24, overflow: 'auto', flex: 1 }}>{children}</div>
        {actions && (
          <div style={{
            padding: '16px 24px', borderTop: '1px solid #EBEDF1',
            display: 'flex', justifyContent: 'flex-end', gap: 8,
          }}>{actions}</div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { Modal });
