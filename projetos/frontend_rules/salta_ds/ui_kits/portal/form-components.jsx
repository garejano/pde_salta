// Eleva Portal — Form components: Checkbox, Radio, Toggle, Datepicker, Filter, FileUpload
const { useState, useRef } = React;

// ── Checkbox ──────────────────────────────────────────────────────
const Checkbox = ({ label, checked, indeterminate, disabled, onChange }) => {
  const state = indeterminate ? 'partial' : checked ? 'checked' : 'unchecked';
  const bg = disabled ? '#F8F9FB' : state !== 'unchecked' ? '#242CC2' : '#fff';
  const border = disabled ? '#EBEDF1' : state !== 'unchecked' ? '#242CC2' : '#C3C8D1';
  return (
    <label style={{ display:'flex', alignItems:'center', gap:10, cursor: disabled ? 'not-allowed' : 'pointer', userSelect:'none' }}>
      <div onClick={() => !disabled && onChange && onChange(!checked)} style={{
        width:16, height:16, borderRadius:4, border:`1.5px solid ${border}`,
        background:bg, display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0, transition:'all 120ms',
      }}>
        {state === 'checked'  && <MS name="check"  size={13} color="#fff" />}
        {state === 'partial'  && <MS name="remove" size={13} color="#fff" />}
      </div>
      {label && <span style={{ fontFamily:'Nunito', fontSize:14, color: disabled ? '#ADB2BA' : '#0F0F10' }}>{label}</span>}
    </label>
  );
};

// ── Radio ──────────────────────────────────────────────────────────
const Radio = ({ label, checked, disabled, onChange, color = '#28975A' }) => (
  <label style={{ display:'flex', alignItems:'center', gap:10, cursor: disabled ? 'not-allowed' : 'pointer', userSelect:'none' }}>
    <div onClick={() => !disabled && onChange && onChange()} style={{
      width:16, height:16, borderRadius:'50%',
      border:`1.5px solid ${disabled ? '#EBEDF1' : checked ? color : '#C3C8D1'}`,
      background: disabled ? '#F8F9FB' : '#fff',
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 120ms',
    }}>
      {checked && <div style={{ width:8, height:8, borderRadius:'50%', background: disabled ? '#C3C8D1' : color }} />}
    </div>
    {label && <span style={{ fontFamily:'Nunito', fontSize:14, color: disabled ? '#ADB2BA' : '#0F0F10' }}>{label}</span>}
  </label>
);

// ── RadioGroup ─────────────────────────────────────────────────────
const RadioGroup = ({ options, value, onChange, label }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
    {label && <span style={{ fontFamily:'Inter', fontWeight:500, fontSize:12, color:'#0F0F10' }}>{label}</span>}
    {options.map(o => (
      <Radio key={o.value} label={o.label} checked={value === o.value}
             onChange={() => onChange(o.value)} disabled={o.disabled} />
    ))}
  </div>
);

// ── Toggle ─────────────────────────────────────────────────────────
const Toggle = ({ label, checked, disabled, onChange }) => (
  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
    <div onClick={() => !disabled && onChange && onChange(!checked)} style={{
      width:40, height:24, borderRadius:48,
      background: disabled ? '#EBEDF1' : checked ? '#28975A' : '#C3C8D1',
      position:'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition:'background 160ms', flexShrink:0,
    }}>
      <div style={{
        position:'absolute', top:3, left: checked ? 19 : 3, width:18, height:18,
        borderRadius:'50%', background: disabled ? '#C3C8D1' : '#fff',
        boxShadow:'0 1px 3px rgba(0,23,31,.2)', transition:'left 160ms',
      }} />
    </div>
    {label && <span style={{ fontFamily:'Nunito', fontSize:14, color: disabled ? '#ADB2BA' : '#0F0F10' }}>{label}</span>}
  </div>
);

// ── Datepicker ─────────────────────────────────────────────────────
const DAYS = ['D','S','T','Q','Q','S','S'];
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const Datepicker = ({ value, onChange, label }) => {
  const today = new Date();
  const [view, setView] = React.useState({ y: today.getFullYear(), m: today.getMonth() });
  const sel = value ? new Date(value) : null;

  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const prevDays = new Date(view.y, view.m, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: prevDays - firstDay + 1 + i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
  while (cells.length < 42) cells.push({ day: cells.length - daysInMonth - firstDay + 1, muted: true });

  const isToday = (d) => !cells[d]?.muted && d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
  const isSelected = (d) => sel && !cells.find(c => c.day === d)?.muted &&
    sel.getDate() === d && sel.getMonth() === view.m && sel.getFullYear() === view.y;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && <label style={{ fontFamily:'Inter', fontWeight:500, fontSize:12, color:'#0F0F10' }}>{label}</label>}
      <div style={{ border:'1px solid #C3C8D1', borderRadius:8, overflow:'hidden', width:280 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #EBEDF1' }}>
          <MS name="chevron_left" size={20} color="#65686E" style={{ cursor:'pointer' }}
              onClick={() => setView(v => ({ y: v.m === 0 ? v.y-1 : v.y, m: v.m === 0 ? 11 : v.m-1 }))} />
          <span style={{ fontFamily:'Archivo', fontWeight:700, fontSize:14, color:'#0F0F10' }}>{MONTHS[view.m]} {view.y}</span>
          <MS name="chevron_right" size={20} color="#65686E" style={{ cursor:'pointer' }}
              onClick={() => setView(v => ({ y: v.m === 11 ? v.y+1 : v.y, m: v.m === 11 ? 0 : v.m+1 }))} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2, padding:8 }}>
          {DAYS.map((d,i) => (
            <div key={i} style={{ height:32, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Archivo', fontWeight:700, fontSize:11, color:'#65686E', textTransform:'uppercase' }}>{d}</div>
          ))}
          {cells.map((c, i) => (
            <div key={i} onClick={() => !c.muted && onChange && onChange(new Date(view.y, view.m, c.day))}
              style={{
                height:32, display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:13, borderRadius:4, cursor: c.muted ? 'default' : 'pointer',
                color: c.muted ? '#C3C8D1' : isSelected(c.day) ? '#fff' : isToday(c.day) ? '#242CC2' : '#3D3F42',
                background: isSelected(c.day) ? '#242CC2' : 'transparent',
                fontWeight: isToday(c.day) ? 700 : 400,
              }}>{c.day}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── FileUpload ─────────────────────────────────────────────────────
const FileUpload = ({ label, helpText, accept, multiple, onFiles }) => {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef();

  const addFiles = (newFiles) => {
    const arr = [...files, ...Array.from(newFiles)];
    setFiles(arr);
    onFiles && onFiles(arr);
  };
  const remove = (i) => {
    const arr = files.filter((_, idx) => idx !== i);
    setFiles(arr);
    onFiles && onFiles(arr);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {label && <label style={{ fontFamily:'Inter', fontWeight:500, fontSize:12, color:'#0F0F10' }}>{label}</label>}
      <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
           onDragLeave={() => setDrag(false)}
           onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
           onClick={() => ref.current.click()}
           style={{
             border:`1.5px dashed ${drag ? '#242CC2' : '#C3C8D1'}`, borderRadius:8,
             padding:'28px 16px', display:'flex', flexDirection:'column', alignItems:'center', gap:8,
             background: drag ? '#E3E5FB' : '#F8F9FB', cursor:'pointer', transition:'all 160ms',
           }}>
        <MS name="upload_file" size={36} color={drag ? '#242CC2' : '#65686E'} />
        <span style={{ fontFamily:'Nunito', fontSize:13, color:'#65686E', textAlign:'center' }}>Arraste e solte arquivos aqui</span>
        <button onClick={(e) => e.stopPropagation()} style={{
          fontFamily:'Archivo', fontWeight:700, fontSize:13, padding:'7px 16px',
          borderRadius:8, border:'1px solid #242CC2', background:'#fff', color:'#242CC2', cursor:'pointer',
        }}>Selecionar arquivo</button>
        <input ref={ref} type="file" accept={accept} multiple={multiple} style={{ display:'none' }}
               onChange={(e) => addFiles(e.target.files)} />
      </div>
      {files.length > 0 && (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {files.map((f, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:'#F8F9FB', borderRadius:8 }}>
              <MS name="description" size={18} color="#242CC2" />
              <span style={{ flex:1, fontFamily:'Nunito', fontSize:13, color:'#0F0F10', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</span>
              <MS name="close" size={18} color="#65686E" style={{ cursor:'pointer' }} onClick={() => remove(i)} />
            </div>
          ))}
        </div>
      )}
      {helpText && <span style={{ fontFamily:'Nunito', fontSize:12, color:'#65686E' }}>{helpText}</span>}
    </div>
  );
};

// ── FilterBar ──────────────────────────────────────────────────────
const FilterBar = ({ filters, values, onChange, onApply, onClear, searchPlaceholder, searchValue, onSearch }) => {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(values || {}).filter(v => v && v !== '').length;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, height:40, padding:'0 12px', border:'1px solid #C3C8D1', borderRadius:8, background:'#fff', flex:1, maxWidth:360 }}>
          <MS name="search" size={18} color="#65686E" />
          <input value={searchValue || ''} onChange={(e) => onSearch && onSearch(e.target.value)}
                 placeholder={searchPlaceholder || 'Buscar...'}
                 style={{ border:0, outline:0, fontFamily:'Nunito', fontSize:14, flex:1, background:'transparent' }} />
        </div>
        <button onClick={() => setOpen(!open)} style={{
          display:'flex', alignItems:'center', gap:6, padding:'8px 14px',
          borderRadius:8, border:'1px solid #242CC2', background: open ? '#242CC2' : '#fff',
          color: open ? '#fff' : '#242CC2', fontFamily:'Archivo', fontWeight:700, fontSize:13, cursor:'pointer',
        }}>
          <MS name="filter_list" size={18} color={open ? '#fff' : '#242CC2'} />
          Filtros
          {activeCount > 0 && <span style={{ background: open ? '#fff' : '#242CC2', color: open ? '#242CC2' : '#fff', borderRadius:999, width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>{activeCount}</span>}
        </button>
      </div>
      {open && (
        <div style={{ border:'1px solid #EBEDF1', borderRadius:8, padding:'20px 24px', background:'#fff' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, marginBottom:16 }}>
            {(filters || []).map(f => (
              <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <label style={{ fontFamily:'Inter', fontWeight:500, fontSize:12, color:'#0F0F10' }}>{f.label}</label>
                <select value={(values || {})[f.key] || ''} onChange={(e) => onChange && onChange({ ...(values||{}), [f.key]: e.target.value })}
                  style={{ height:40, padding:'0 12px', borderRadius:8, border:'1px solid #C3C8D1', fontFamily:'Nunito', fontSize:14, color:'#0F0F10', background:'#fff', cursor:'pointer' }}>
                  <option value="">Todos</option>
                  {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:8, paddingTop:12, borderTop:'1px solid #EBEDF1' }}>
            <Button variant="ghost" size="sm" onClick={() => { onClear && onClear(); setOpen(false); }}>Limpar filtros</Button>
            <Button variant="fill" size="sm" onClick={() => { onApply && onApply(); setOpen(false); }}>Aplicar</Button>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { Checkbox, Radio, RadioGroup, Toggle, Datepicker, FileUpload, FilterBar });
