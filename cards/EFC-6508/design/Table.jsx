// Eleva Portal — Table component
const { useState } = React;

const Table = ({ columns, rows, onRowClick, selectable, sortable }) => {
  const [sortCol, setSortCol] = React.useState(null);
  const [sortDir, setSortDir] = React.useState('asc');
  const [selected, setSelected] = React.useState(new Set());

  const toggleSort = (key) => {
    if (!sortable) return;
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
  };

  const sorted = sortCol
    ? [...rows].sort((a, b) => {
        const va = a[sortCol], vb = b[sortCol];
        const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : rows;

  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());
    else setSelected(new Set(rows.map((_, i) => i)));
  };
  const toggleRow = (i) => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };

  return (
    <div style={{ background:'#fff', borderRadius:8, border:'1px solid #EBEDF1', overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ background:'#C3C8D1' }}>
            {selectable && (
              <th style={{ width:40, padding:'8px 16px' }}>
                <div onClick={toggleAll} style={{
                  width:16, height:16, borderRadius:4,
                  border:`1.5px solid ${selected.size === rows.length ? '#242CC2' : '#ADB2BA'}`,
                  background: selected.size === rows.length ? '#242CC2' : '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                }}>
                  {selected.size === rows.length && <MS name="check" size={12} color="#fff" />}
                  {selected.size > 0 && selected.size < rows.length && <MS name="remove" size={12} color="#fff" />}
                </div>
              </th>
            )}
            {columns.map(col => (
              <th key={col.key} onClick={() => toggleSort(col.key)} style={{
                padding:'8px 16px', textAlign: col.align || 'left',
                fontFamily:'Nunito', fontWeight:700, fontSize:14, color:'#3D3F42',
                whiteSpace:'nowrap', borderBottom:'1px solid #ADB2BA',
                cursor: sortable && col.sortable !== false ? 'pointer' : 'default',
              }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                  {col.label}
                  {sortable && col.sortable !== false && (
                    <MS name={sortCol === col.key ? (sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'} size={14} color="#65686E" />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default', transition:'background 120ms' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8F9FB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              {selectable && (
                <td style={{ padding:'12px 16px', borderBottom:'1px solid #EBEDF1' }}>
                  <div onClick={(e) => { e.stopPropagation(); toggleRow(i); }} style={{
                    width:16, height:16, borderRadius:4,
                    border:`1.5px solid ${selected.has(i) ? '#242CC2' : '#C3C8D1'}`,
                    background: selected.has(i) ? '#242CC2' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
                  }}>
                    {selected.has(i) && <MS name="check" size={12} color="#fff" />}
                  </div>
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} style={{
                  padding:'12px 16px', borderBottom:'1px solid #EBEDF1',
                  textAlign: col.align || 'left', verticalAlign:'middle',
                }}>
                  {col.render ? col.render(row[col.key], row) : (
                    <span style={{ fontFamily:'Nunito', fontSize:14, color:'#3D3F42' }}>{row[col.key]}</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Object.assign(window, { Table });
