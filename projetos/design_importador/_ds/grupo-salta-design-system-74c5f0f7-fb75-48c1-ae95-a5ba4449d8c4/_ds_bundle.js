/* @ds-bundle: {"format":3,"namespace":"GrupoSaltaDesignSystem_74c5f0","components":[],"sourceHashes":{"ui_kits/portal/app.jsx":"0ad564bf0017","ui_kits/portal/form-components.jsx":"388dd2073d79","ui_kits/portal/header.jsx":"f3fc3980be6b","ui_kits/portal/modal.jsx":"ee805c8f7d46","ui_kits/portal/nav-components.jsx":"4c9d7df6869d","ui_kits/portal/primitives.jsx":"f4b71ddf7de9","ui_kits/portal/sidebar.jsx":"616fd4c4fac2","ui_kits/portal/student-card.jsx":"bd5b1d6fa2bb","ui_kits/portal/student-list.jsx":"7b6e1c5c772d","ui_kits/portal/table.jsx":"beb3a890adc7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GrupoSaltaDesignSystem_74c5f0 = window.GrupoSaltaDesignSystem_74c5f0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/portal/app.jsx
try { (() => {
// Eleva Portal — App
const App = () => {
  const [screen, setScreen] = React.useState('students');
  const [student, setStudent] = React.useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [editName, setEditName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');
  const openStudent = s => {
    setStudent(s);
    setScreen('card');
  };
  const openEdit = () => {
    setEditName(student.name);
    setEditEmail(student.email);
    setEditOpen(true);
  };
  const saveEdit = () => {
    setStudent({
      ...student,
      name: editName,
      email: editEmail
    });
    setEditOpen(false);
    setToast('Dados do aluno atualizados.');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F8F9FB'
    }
  }, /*#__PURE__*/React.createElement(Header, {
    onMenuToggle: () => setSidebarCollapsed(!sidebarCollapsed)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: screen === 'card' ? 'students' : screen,
    collapsed: sidebarCollapsed,
    onNavigate: id => {
      setScreen(id);
      setStudent(null);
    }
  }), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, screen === 'students' && /*#__PURE__*/React.createElement(StudentList, {
    onOpen: openStudent
  }), screen === 'card' && /*#__PURE__*/React.createElement(StudentCard, {
    student: student,
    onBack: () => setScreen('students'),
    onEdit: openEdit
  }), screen !== 'students' && screen !== 'card' && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 64,
      textAlign: 'center',
      fontFamily: 'Nunito',
      color: '#65686E'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "construction",
    size: 48,
    color: "#C3C8D1"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: 20,
      color: '#0F0F10',
      margin: '12px 0 4px'
    }
  }, "Se\xE7\xE3o \"", screen, "\" em constru\xE7\xE3o"), /*#__PURE__*/React.createElement("p", null, "Esta tela faz parte do kit de refer\xEAncia e n\xE3o est\xE1 implementada.")))), /*#__PURE__*/React.createElement(Modal, {
    title: "Editar aluno",
    open: editOpen,
    onClose: () => setEditOpen(false),
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setEditOpen(false)
    }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
      variant: "fill",
      onClick: saveEdit
    }, "Salvar altera\xE7\xF5es"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Nome completo",
    icon: "person",
    value: editName,
    onChange: setEditName
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    icon: "mail",
    value: editEmail,
    onChange: setEditEmail
  }), /*#__PURE__*/React.createElement(Alert, {
    variant: "info",
    title: "Altera\xE7\xF5es vis\xEDveis"
  }, "As altera\xE7\xF5es feitas aqui aparecem imediatamente para a coordena\xE7\xE3o."))), toast && /*#__PURE__*/React.createElement(Toast, {
    title: toast,
    onClose: () => setToast(null)
  }));
};
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/form-components.jsx
try { (() => {
// Eleva Portal — Form components: Checkbox, Radio, Toggle, Datepicker, Filter, FileUpload
const {
  useState,
  useRef
} = React;

// ── Checkbox ──────────────────────────────────────────────────────
const Checkbox = ({
  label,
  checked,
  indeterminate,
  disabled,
  onChange
}) => {
  const state = indeterminate ? 'partial' : checked ? 'checked' : 'unchecked';
  const bg = disabled ? '#F8F9FB' : state !== 'unchecked' ? '#242CC2' : '#fff';
  const border = disabled ? '#EBEDF1' : state !== 'unchecked' ? '#242CC2' : '#C3C8D1';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      border: `1.5px solid ${border}`,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'all 120ms'
    }
  }, state === 'checked' && /*#__PURE__*/React.createElement(MS, {
    name: "check",
    size: 13,
    color: "#fff"
  }), state === 'partial' && /*#__PURE__*/React.createElement(MS, {
    name: "remove",
    size: 13,
    color: "#fff"
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: disabled ? '#ADB2BA' : '#0F0F10'
    }
  }, label));
};

// ── Radio ──────────────────────────────────────────────────────────
const Radio = ({
  label,
  checked,
  disabled,
  onChange,
  color = '#28975A'
}) => /*#__PURE__*/React.createElement("label", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none'
  }
}, /*#__PURE__*/React.createElement("div", {
  onClick: () => !disabled && onChange && onChange(),
  style: {
    width: 16,
    height: 16,
    borderRadius: '50%',
    border: `1.5px solid ${disabled ? '#EBEDF1' : checked ? color : '#C3C8D1'}`,
    background: disabled ? '#F8F9FB' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 120ms'
  }
}, checked && /*#__PURE__*/React.createElement("div", {
  style: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: disabled ? '#C3C8D1' : color
  }
})), label && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: disabled ? '#ADB2BA' : '#0F0F10'
  }
}, label));

// ── RadioGroup ─────────────────────────────────────────────────────
const RadioGroup = ({
  options,
  value,
  onChange,
  label
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  }
}, label && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: 12,
    color: '#0F0F10'
  }
}, label), options.map(o => /*#__PURE__*/React.createElement(Radio, {
  key: o.value,
  label: o.label,
  checked: value === o.value,
  onChange: () => onChange(o.value),
  disabled: o.disabled
})));

// ── Toggle ─────────────────────────────────────────────────────────
const Toggle = ({
  label,
  checked,
  disabled,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  }
}, /*#__PURE__*/React.createElement("div", {
  onClick: () => !disabled && onChange && onChange(!checked),
  style: {
    width: 40,
    height: 24,
    borderRadius: 48,
    background: disabled ? '#EBEDF1' : checked ? '#28975A' : '#C3C8D1',
    position: 'relative',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 160ms',
    flexShrink: 0
  }
}, /*#__PURE__*/React.createElement("div", {
  style: {
    position: 'absolute',
    top: 3,
    left: checked ? 19 : 3,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: disabled ? '#C3C8D1' : '#fff',
    boxShadow: '0 1px 3px rgba(0,23,31,.2)',
    transition: 'left 160ms'
  }
})), label && /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Nunito',
    fontSize: 14,
    color: disabled ? '#ADB2BA' : '#0F0F10'
  }
}, label));

// ── Datepicker ─────────────────────────────────────────────────────
const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const Datepicker = ({
  value,
  onChange,
  label
}) => {
  const today = new Date();
  const [view, setView] = React.useState({
    y: today.getFullYear(),
    m: today.getMonth()
  });
  const sel = value ? new Date(value) : null;
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const prevDays = new Date(view.y, view.m, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push({
    day: prevDays - firstDay + 1 + i,
    muted: true
  });
  for (let d = 1; d <= daysInMonth; d++) cells.push({
    day: d,
    muted: false
  });
  while (cells.length < 42) cells.push({
    day: cells.length - daysInMonth - firstDay + 1,
    muted: true
  });
  const isToday = d => !cells[d]?.muted && d === today.getDate() && view.m === today.getMonth() && view.y === today.getFullYear();
  const isSelected = d => sel && !cells.find(c => c.day === d)?.muted && sel.getDate() === d && sel.getMonth() === view.m && sel.getFullYear() === view.y;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: 12,
      color: '#0F0F10'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #C3C8D1',
      borderRadius: 8,
      overflow: 'hidden',
      width: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid #EBEDF1'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "chevron_left",
    size: 20,
    color: "#65686E",
    style: {
      cursor: 'pointer'
    },
    onClick: () => setView(v => ({
      y: v.m === 0 ? v.y - 1 : v.y,
      m: v.m === 0 ? 11 : v.m - 1
    }))
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10'
    }
  }, MONTHS[view.m], " ", view.y), /*#__PURE__*/React.createElement(MS, {
    name: "chevron_right",
    size: 20,
    color: "#65686E",
    style: {
      cursor: 'pointer'
    },
    onClick: () => setView(v => ({
      y: v.m === 11 ? v.y + 1 : v.y,
      m: v.m === 11 ? 0 : v.m + 1
    }))
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 2,
      padding: 8
    }
  }, DAYS.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 11,
      color: '#65686E',
      textTransform: 'uppercase'
    }
  }, d)), cells.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    onClick: () => !c.muted && onChange && onChange(new Date(view.y, view.m, c.day)),
    style: {
      height: 32,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      borderRadius: 4,
      cursor: c.muted ? 'default' : 'pointer',
      color: c.muted ? '#C3C8D1' : isSelected(c.day) ? '#fff' : isToday(c.day) ? '#242CC2' : '#3D3F42',
      background: isSelected(c.day) ? '#242CC2' : 'transparent',
      fontWeight: isToday(c.day) ? 700 : 400
    }
  }, c.day)))));
};

// ── FileUpload ─────────────────────────────────────────────────────
const FileUpload = ({
  label,
  helpText,
  accept,
  multiple,
  onFiles
}) => {
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const ref = useRef();
  const addFiles = newFiles => {
    const arr = [...files, ...Array.from(newFiles)];
    setFiles(arr);
    onFiles && onFiles(arr);
  };
  const remove = i => {
    const arr = files.filter((_, idx) => idx !== i);
    setFiles(arr);
    onFiles && onFiles(arr);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: 12,
      color: '#0F0F10'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    onDragOver: e => {
      e.preventDefault();
      setDrag(true);
    },
    onDragLeave: () => setDrag(false),
    onDrop: e => {
      e.preventDefault();
      setDrag(false);
      addFiles(e.dataTransfer.files);
    },
    onClick: () => ref.current.click(),
    style: {
      border: `1.5px dashed ${drag ? '#242CC2' : '#C3C8D1'}`,
      borderRadius: 8,
      padding: '28px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      background: drag ? '#E3E5FB' : '#F8F9FB',
      cursor: 'pointer',
      transition: 'all 160ms'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "upload_file",
    size: 36,
    color: drag ? '#242CC2' : '#65686E'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 13,
      color: '#65686E',
      textAlign: 'center'
    }
  }, "Arraste e solte arquivos aqui"), /*#__PURE__*/React.createElement("button", {
    onClick: e => e.stopPropagation(),
    style: {
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 13,
      padding: '7px 16px',
      borderRadius: 8,
      border: '1px solid #242CC2',
      background: '#fff',
      color: '#242CC2',
      cursor: 'pointer'
    }
  }, "Selecionar arquivo"), /*#__PURE__*/React.createElement("input", {
    ref: ref,
    type: "file",
    accept: accept,
    multiple: multiple,
    style: {
      display: 'none'
    },
    onChange: e => addFiles(e.target.files)
  })), files.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, files.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 12px',
      background: '#F8F9FB',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "description",
    size: 18,
    color: "#242CC2"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'Nunito',
      fontSize: 13,
      color: '#0F0F10',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, f.name), /*#__PURE__*/React.createElement(MS, {
    name: "close",
    size: 18,
    color: "#65686E",
    style: {
      cursor: 'pointer'
    },
    onClick: () => remove(i)
  })))), helpText && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, helpText));
};

// ── FilterBar ──────────────────────────────────────────────────────
const FilterBar = ({
  filters,
  values,
  onChange,
  onApply,
  onClear,
  searchPlaceholder,
  searchValue,
  onSearch
}) => {
  const [open, setOpen] = useState(false);
  const activeCount = Object.values(values || {}).filter(v => v && v !== '').length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      padding: '0 12px',
      border: '1px solid #C3C8D1',
      borderRadius: 8,
      background: '#fff',
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "search",
    size: 18,
    color: "#65686E"
  }), /*#__PURE__*/React.createElement("input", {
    value: searchValue || '',
    onChange: e => onSearch && onSearch(e.target.value),
    placeholder: searchPlaceholder || 'Buscar...',
    style: {
      border: 0,
      outline: 0,
      fontFamily: 'Nunito',
      fontSize: 14,
      flex: 1,
      background: 'transparent'
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid #242CC2',
      background: open ? '#242CC2' : '#fff',
      color: open ? '#fff' : '#242CC2',
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 13,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "filter_list",
    size: 18,
    color: open ? '#fff' : '#242CC2'
  }), "Filtros", activeCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: open ? '#fff' : '#242CC2',
      color: open ? '#242CC2' : '#fff',
      borderRadius: 999,
      width: 18,
      height: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11
    }
  }, activeCount))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      border: '1px solid #EBEDF1',
      borderRadius: 8,
      padding: '20px 24px',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 12,
      marginBottom: 16
    }
  }, (filters || []).map(f => /*#__PURE__*/React.createElement("div", {
    key: f.key,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: 12,
      color: '#0F0F10'
    }
  }, f.label), /*#__PURE__*/React.createElement("select", {
    value: (values || {})[f.key] || '',
    onChange: e => onChange && onChange({
      ...(values || {}),
      [f.key]: e.target.value
    }),
    style: {
      height: 40,
      padding: '0 12px',
      borderRadius: 8,
      border: '1px solid #C3C8D1',
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#0F0F10',
      background: '#fff',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Todos"), f.options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      paddingTop: 12,
      borderTop: '1px solid #EBEDF1'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => {
      onClear && onClear();
      setOpen(false);
    }
  }, "Limpar filtros"), /*#__PURE__*/React.createElement(Button, {
    variant: "fill",
    size: "sm",
    onClick: () => {
      onApply && onApply();
      setOpen(false);
    }
  }, "Aplicar"))));
};
Object.assign(window, {
  Checkbox,
  Radio,
  RadioGroup,
  Toggle,
  Datepicker,
  FileUpload,
  FilterBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/form-components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/header.jsx
try { (() => {
// Eleva Portal — Header
const Header = ({
  onMenuToggle,
  userName = 'Ana Diretora'
}) => {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      height: 64,
      background: '#fff',
      borderBottom: '1px solid #EBEDF1',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "menu",
    onClick: onMenuToggle,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: 'linear-gradient(180deg,#30B7BE,#39D881)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/eleva-logo-mark.svg",
    style: {
      width: 20,
      height: 20,
      filter: 'brightness(0) invert(1)'
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 20,
      color: '#0F0F10'
    }
  }, "Eleva")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 420,
      marginLeft: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      padding: '0 16px',
      borderRadius: 8,
      border: '1px solid #C3C8D1',
      background: '#F8F9FB'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "search",
    size: 20,
    color: "#65686E"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Buscar alunos, turmas...",
    style: {
      border: 0,
      outline: 0,
      background: 'transparent',
      flex: 1,
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#0F0F10'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "help_outline",
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "notifications",
    size: 40
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 999,
      background: '#9D0364',
      color: '#fff',
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, "3")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      paddingLeft: 8,
      borderLeft: '1px solid #EBEDF1',
      marginLeft: 4
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: userName,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10',
      lineHeight: 1.2
    }
  }, userName), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E',
      lineHeight: 1.2
    }
  }, "Administra\xE7\xE3o"))));
};
Object.assign(window, {
  Header
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/modal.jsx
try { (() => {
// Eleva Portal — Modal shell
const Modal = ({
  title,
  open,
  onClose,
  children,
  actions,
  width = 560
}) => {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      animation: 'fadeIn 200ms ease-out'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width,
      maxWidth: '90vw',
      maxHeight: '85vh',
      background: '#fff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 12px 24px -6px rgba(0,23,31,0.18)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      borderBottom: '1px solid #EBEDF1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 20,
      color: '#0F0F10'
    }
  }, title), /*#__PURE__*/React.createElement(IconButton, {
    icon: "close",
    onClick: onClose,
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      overflow: 'auto',
      flex: 1
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 24px',
      borderTop: '1px solid #EBEDF1',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, actions)));
};
Object.assign(window, {
  Modal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/modal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/nav-components.jsx
try { (() => {
// Eleva Portal — Navigation components: Tabs, Breadcrumb, Pagination
const {
  useState
} = React;

// ── Tabs ───────────────────────────────────────────────────────────
const Tabs = ({
  tabs,
  activeId,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  style: {
    display: 'flex',
    borderBottom: '2px solid #EBEDF1',
    gap: 0
  }
}, tabs.map(t => /*#__PURE__*/React.createElement("button", {
  key: t.id,
  onClick: () => onChange(t.id),
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '14px 20px',
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize: 14,
    color: t.id === activeId ? '#242CC2' : '#65686E',
    borderBottom: `2px solid ${t.id === activeId ? '#242CC2' : 'transparent'}`,
    marginBottom: -2,
    border: 0,
    borderLeft: 0,
    borderRight: 0,
    borderTop: 0,
    background: 'transparent',
    cursor: 'pointer',
    transition: 'color 160ms, border-color 160ms',
    whiteSpace: 'nowrap'
  }
}, t.icon && /*#__PURE__*/React.createElement(MS, {
  name: t.icon,
  size: 18,
  color: "currentColor"
}), t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
  style: {
    background: t.id === activeId ? '#242CC2' : '#EBEDF1',
    color: t.id === activeId ? '#fff' : '#65686E',
    borderRadius: 999,
    padding: '0 6px',
    fontSize: 11,
    fontFamily: 'Nunito',
    fontWeight: 700,
    lineHeight: '18px'
  }
}, t.count))));

// ── Breadcrumb ──────────────────────────────────────────────────────
const Breadcrumb = ({
  items
}) => /*#__PURE__*/React.createElement("nav", {
  style: {
    display: 'flex',
    alignItems: 'center',
    gap: 4
  }
}, items.map((item, i) => /*#__PURE__*/React.createElement(React.Fragment, {
  key: i
}, i > 0 && /*#__PURE__*/React.createElement(MS, {
  name: "chevron_right",
  size: 14,
  color: "#C3C8D1"
}), i < items.length - 1 ? /*#__PURE__*/React.createElement("a", {
  onClick: item.onClick,
  style: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#242CC2',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}, item.label) : /*#__PURE__*/React.createElement("span", {
  style: {
    fontFamily: 'Nunito',
    fontSize: 12,
    color: '#65686E'
  }
}, item.label))));

// ── Pagination ──────────────────────────────────────────────────────
const Pagination = ({
  total,
  page,
  perPage = 10,
  onChange
}) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };
  const pg = (n, label, disabled) => /*#__PURE__*/React.createElement("button", {
    key: label || n,
    disabled: disabled,
    onClick: () => !disabled && typeof n === 'number' && onChange(n),
    style: {
      width: 32,
      height: 32,
      borderRadius: 4,
      border: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: typeof n === 'number' ? 'Nunito' : 'inherit',
      fontSize: 14,
      background: n === page ? '#242CC2' : 'transparent',
      color: n === page ? '#fff' : disabled ? '#C3C8D1' : '#3D3F42',
      cursor: disabled || typeof n !== 'number' ? 'default' : 'pointer',
      transition: 'background 120ms'
    }
  }, label || n);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      alignItems: 'center'
    }
  }, pg(page - 1, /*#__PURE__*/React.createElement(MS, {
    name: "chevron_left",
    size: 18,
    color: page === 1 ? '#C3C8D1' : '#65686E'
  }), page === 1), getPages().map((p, i) => p === '...' ? /*#__PURE__*/React.createElement("span", {
    key: `e${i}`,
    style: {
      width: 32,
      textAlign: 'center',
      color: '#C3C8D1',
      fontSize: 14
    }
  }, "\u2026") : pg(p)), pg(page + 1, /*#__PURE__*/React.createElement(MS, {
    name: "chevron_right",
    size: 18,
    color: page === totalPages ? '#C3C8D1' : '#65686E'
  }), page === totalPages));
};
Object.assign(window, {
  Tabs,
  Breadcrumb,
  Pagination
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/nav-components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/primitives.jsx
try { (() => {
// Eleva Portal — primitives (Button, Input, Tag, Avatar, Alert, Toast)
const {
  useState,
  useEffect
} = React;
const MS = ({
  name,
  size = 22,
  color,
  style = {}
}) => /*#__PURE__*/React.createElement("span", {
  className: "material-symbols-outlined",
  style: {
    fontSize: size,
    color,
    ...style
  }
}, name);
const Button = ({
  variant = 'fill',
  icon,
  children,
  counter,
  disabled,
  onClick,
  size = 'md'
}) => {
  const h = size === 'sm' ? 32 : 40;
  const fontSize = size === 'sm' ? 14 : 16;
  const pad = size === 'sm' ? '6px 12px' : '8px 16px';
  const base = {
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize,
    padding: pad,
    height: h,
    borderRadius: 8,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background 160ms, color 160ms, border-color 160ms',
    lineHeight: 1,
    whiteSpace: 'nowrap'
  };
  const styles = {
    fill: {
      background: '#242CC2',
      color: '#fff'
    },
    outline: {
      background: '#fff',
      color: '#242CC2',
      borderColor: '#242CC2'
    },
    ghost: {
      background: 'transparent',
      color: '#242CC2'
    },
    danger: {
      background: '#E65637',
      color: '#fff'
    }
  };
  const disStyle = {
    background: '#EBEDF1',
    color: '#ADB2BA',
    borderColor: 'transparent'
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: disabled ? undefined : onClick,
    style: {
      ...base,
      ...(disabled ? disStyle : styles[variant])
    }
  }, icon && /*#__PURE__*/React.createElement(MS, {
    name: icon,
    size: 18
  }), children, counter != null && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 999,
      background: '#fff',
      color: '#9D0364',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 12,
      marginLeft: 4
    }
  }, counter));
};
const IconButton = ({
  icon,
  onClick,
  variant = 'ghost',
  active,
  size = 40
}) => {
  const styles = {
    ghost: {
      background: active ? '#EBEDF1' : 'transparent',
      color: '#3D3F42'
    },
    fill: {
      background: '#242CC2',
      color: '#fff'
    },
    outline: {
      background: '#fff',
      color: '#242CC2',
      border: '1px solid #242CC2'
    }
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: size,
      height: size,
      borderRadius: size >= 40 ? 999 : 8,
      border: 0,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...styles[variant]
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: icon,
    size: 22,
    color: "currentColor"
  }));
};
const Input = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  error,
  helpText,
  type = 'text'
}) => {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? '#E65637' : focus ? '#242CC2' : '#C3C8D1';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'Inter',
      fontWeight: 500,
      fontSize: 12,
      color: '#0F0F10'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '0 16px',
      height: 40,
      borderRadius: 8,
      border: `1px solid ${borderColor}`,
      boxShadow: focus ? '0 0 0 3px rgba(36,44,194,0.24)' : 'none',
      background: '#fff',
      transition: 'all 160ms'
    }
  }, icon && /*#__PURE__*/React.createElement(MS, {
    name: icon,
    size: 20,
    color: "#65686E"
  }), /*#__PURE__*/React.createElement("input", {
    type: type,
    value: value ?? '',
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    onChange: e => onChange && onChange(e.target.value),
    style: {
      border: 0,
      outline: 0,
      fontFamily: 'Nunito',
      fontSize: 16,
      flex: 1,
      color: '#0F0F10',
      background: 'transparent',
      minWidth: 0
    }
  })), (helpText || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: error ? '#E65637' : '#65686E'
    }
  }, error || helpText));
};
const Tag = ({
  children,
  color = '#242CC2',
  icon,
  size = 'md'
}) => {
  const sm = size === 'sm';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: sm ? 4 : 6,
      padding: sm ? '2px 10px' : '4px 12px',
      borderRadius: 999,
      background: color,
      color: color === '#FFAC30' ? '#0F0F10' : '#fff',
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: sm ? 12 : 13,
      whiteSpace: 'nowrap'
    }
  }, icon && /*#__PURE__*/React.createElement(MS, {
    name: icon,
    size: sm ? 14 : 16,
    color: "currentColor"
  }), children);
};
const Avatar = ({
  name,
  size = 40
}) => {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 999,
      background: 'linear-gradient(135deg, #30B7BE 0%, #39D881 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: size * 0.38,
      flexShrink: 0
    }
  }, initials);
};
const Alert = ({
  variant = 'info',
  title,
  children,
  actions
}) => {
  const colors = {
    info: '#242CC2',
    success: '#28975A',
    warning: '#FFAC30',
    error: '#E65637'
  };
  const icons = {
    info: 'info',
    success: 'check_circle',
    warning: 'warning',
    error: 'error'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      background: '#EBEDF1',
      borderRadius: 8,
      overflow: 'hidden',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 8,
      background: colors[variant],
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      display: 'flex',
      gap: 12,
      flex: 1,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: icons[variant],
    size: 24,
    color: colors[variant],
    style: {
      marginTop: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 16,
      color: '#0F0F10'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#3D3F42',
      lineHeight: 1.4
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end'
    }
  }, actions))));
};
const Toast = ({
  title,
  onClose,
  duration = 4000
}) => {
  const [remaining, setRemaining] = useState(100);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const pct = Math.max(0, 100 - (Date.now() - start) / duration * 100);
      setRemaining(pct);
      if (pct === 0) {
        clearInterval(id);
        onClose && onClose();
      }
    }, 50);
    return () => clearInterval(id);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 328,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 12px -2px rgba(0,23,31,.15)',
      overflow: 'hidden',
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '24px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "sentiment_very_satisfied",
    size: 32,
    color: "#28975A"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      flex: 1,
      fontFamily: 'Inter',
      fontSize: 18,
      color: '#0F0F10',
      lineHeight: 1.3
    }
  }, title), /*#__PURE__*/React.createElement(MS, {
    name: "close",
    size: 24,
    color: "#65686E",
    style: {
      cursor: 'pointer'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: '#EBEDF1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${remaining}%`,
      background: '#242CC2',
      transition: 'width 50ms linear'
    }
  })));
};
Object.assign(window, {
  MS,
  Button,
  IconButton,
  Input,
  Tag,
  Avatar,
  Alert,
  Toast
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/primitives.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/sidebar.jsx
try { (() => {
// Eleva Portal — Sidebar
const NAV_ITEMS = [{
  id: 'overview',
  label: 'Visão geral',
  icon: 'dashboard'
}, {
  id: 'students',
  label: 'Alunos',
  icon: 'school'
}, {
  id: 'classes',
  label: 'Turmas',
  icon: 'groups'
}, {
  id: 'attendance',
  label: 'Frequência',
  icon: 'fact_check'
}, {
  id: 'grades',
  label: 'Notas',
  icon: 'grade'
}, {
  id: 'files',
  label: 'Arquivos',
  icon: 'folder'
}];
const SECONDARY = [{
  id: 'settings',
  label: 'Configurações',
  icon: 'settings'
}, {
  id: 'help',
  label: 'Ajuda',
  icon: 'help_outline'
}];
const Sidebar = ({
  active,
  onNavigate,
  collapsed
}) => {
  const w = collapsed ? 72 : 240;
  const item = it => {
    const isActive = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onNavigate(it.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 14px',
        margin: '2px 8px',
        borderRadius: 8,
        border: 0,
        cursor: 'pointer',
        textAlign: 'left',
        background: isActive ? '#E3E5FB' : 'transparent',
        color: isActive ? '#242CC2' : '#3D3F42',
        fontFamily: 'Nunito',
        fontWeight: isActive ? 700 : 500,
        fontSize: 14,
        transition: 'background 160ms, color 160ms',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }
    }, /*#__PURE__*/React.createElement(MS, {
      name: it.icon,
      size: 22,
      color: "currentColor"
    }), !collapsed && /*#__PURE__*/React.createElement("span", null, it.label));
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: w,
      background: '#fff',
      borderRight: '1px solid #EBEDF1',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      transition: 'width 200ms',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1
    }
  }, NAV_ITEMS.map(item)), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid #EBEDF1',
      paddingTop: 12
    }
  }, SECONDARY.map(item)));
};
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/student-card.jsx
try { (() => {
// Eleva Portal — Student Card (expanded view)
const StudentCard = ({
  student,
  onBack,
  onEdit
}) => {
  if (!student) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 10px',
      margin: '0 0 16px -10px',
      border: 0,
      background: 'transparent',
      cursor: 'pointer',
      color: '#242CC2',
      fontFamily: 'Nunito',
      fontWeight: 600,
      fontSize: 14,
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "arrow_back",
    size: 18,
    color: "#242CC2"
  }), " Voltar para alunos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 360px',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      padding: 24,
      border: '1px solid #EBEDF1',
      display: 'flex',
      gap: 20,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: student.name,
    size: 80
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    color: "#9D0364",
    size: "sm",
    icon: "school"
  }, student.class), /*#__PURE__*/React.createElement(Tag, {
    color: student.track === 'Militar' ? '#9D0364' : student.track === 'Bilíngue' ? '#774BB0' : '#65686E',
    size: "sm"
  }, student.track)), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 32,
      color: '#0F0F10'
    }
  }, student.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#65686E',
      marginTop: 6
    }
  }, "E-mail: ", student.email, " \xB7 Nascimento: ", student.birth)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "edit",
    onClick: onEdit
  }, "Editar"), /*#__PURE__*/React.createElement(Button, {
    variant: "fill",
    icon: "link"
  }, "Gerar link de anamnese"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, [{
    k: 'Faltas',
    v: student.faltas,
    icon: 'event_busy',
    color: '#E65637'
  }, {
    k: 'Atrasos',
    v: student.atrasos,
    icon: 'schedule',
    color: '#FFAC30'
  }, {
    k: 'Média geral',
    v: student.media.toFixed(1),
    icon: 'grade',
    color: '#28975A'
  }, {
    k: 'Bimestre',
    v: '3º',
    icon: 'calendar_month',
    color: '#242CC2'
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.k,
    style: {
      background: '#fff',
      border: '1px solid #EBEDF1',
      borderRadius: 8,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: s.icon,
    size: 20,
    color: s.color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, s.k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 28,
      color: '#0F0F10'
    }
  }, s.v)))), student.faltas >= 5 && /*#__PURE__*/React.createElement(Alert, {
    variant: "warning",
    title: "Faltas acima do recomendado"
  }, "Este aluno ultrapassou o limite de faltas do bimestre. Entre em contato com o respons\xE1vel."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderBottom: '1px solid #EBEDF1',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: 18,
      color: '#0F0F10'
    }
  }, "Atividades recentes"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm"
  }, "Ver tudo")), [{
    t: 'Prova de matemática — 8,5',
    d: '12/02/2026 às 13:30',
    icon: 'edit_note'
  }, {
    t: 'Entrega — Redação "Cidadania"',
    d: '10/02/2026 às 10:00',
    icon: 'description'
  }, {
    t: 'Falta — Educação física',
    d: '08/02/2026',
    icon: 'event_busy'
  }, {
    t: 'Reunião com responsável',
    d: '05/02/2026 às 16:00',
    icon: 'groups'
  }].map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 14,
      padding: '14px 20px',
      borderBottom: i < 3 ? '1px solid #EBEDF1' : 'none',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: '#E3E5FB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: it.icon,
    size: 20,
    color: "#242CC2"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10'
    }
  }, it.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, it.d)), /*#__PURE__*/React.createElement(MS, {
    name: "chevron_right",
    size: 20,
    color: "#65686E"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: 16,
      color: '#0F0F10'
    }
  }, "Respons\xE1vel"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Carlos Santos",
    size: 44
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10'
    }
  }, "Carlos Santos"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, "Pai \xB7 (11) 98765-4321"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    icon: "mail"
  }, "E-mail"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    icon: "call"
  }, "Ligar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: 16,
      color: '#0F0F10'
    }
  }, "Documentos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, ['Ficha médica.pdf', 'Contrato 2026.pdf', 'Autorização de saída.pdf'].map(d => /*#__PURE__*/React.createElement("div", {
    key: d,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      background: '#F8F9FB',
      borderRadius: 8
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "picture_as_pdf",
    size: 18,
    color: "#E65637"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: 'Nunito',
      fontSize: 13,
      color: '#0F0F10'
    }
  }, d), /*#__PURE__*/React.createElement(MS, {
    name: "download",
    size: 18,
    color: "#65686E",
    style: {
      cursor: 'pointer'
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 12px',
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: 16,
      color: '#0F0F10'
    }
  }, "Situa\xE7\xE3o"), /*#__PURE__*/React.createElement(Tag, {
    color: {
      Cursando: '#28975A',
      'Atenção': '#FFAC30',
      Destaque: '#242CC2',
      Pendente: '#E65637'
    }[student.status]
  }, student.status)))));
};
Object.assign(window, {
  StudentCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/student-card.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/student-list.jsx
try { (() => {
// Eleva Portal — Student list
const STUDENTS = [{
  id: 1,
  name: 'Maria Silva Santos',
  class: '1 ano A',
  track: 'Militar',
  email: 'maria.silva@eleva.edu.br',
  birth: '26/06/2010',
  faltas: 3,
  atrasos: 2,
  media: 8.4,
  status: 'Cursando'
}, {
  id: 2,
  name: 'João Pedro Oliveira',
  class: '2 ano B',
  track: 'Regular',
  email: 'joao.oliveira@eleva.edu.br',
  birth: '14/03/2009',
  faltas: 0,
  atrasos: 1,
  media: 9.1,
  status: 'Cursando'
}, {
  id: 3,
  name: 'Ana Clara Ferreira',
  class: '3 ano A',
  track: 'Militar',
  email: 'ana.ferreira@eleva.edu.br',
  birth: '02/11/2008',
  faltas: 5,
  atrasos: 4,
  media: 7.2,
  status: 'Atenção'
}, {
  id: 4,
  name: 'Lucas Almeida Costa',
  class: '1 ano C',
  track: 'Regular',
  email: 'lucas.costa@eleva.edu.br',
  birth: '19/09/2010',
  faltas: 1,
  atrasos: 0,
  media: 8.9,
  status: 'Cursando'
}, {
  id: 5,
  name: 'Beatriz Souza Lima',
  class: '2 ano A',
  track: 'Bilíngue',
  email: 'beatriz.lima@eleva.edu.br',
  birth: '07/05/2009',
  faltas: 2,
  atrasos: 1,
  media: 9.4,
  status: 'Destaque'
}, {
  id: 6,
  name: 'Rafael Mendes Rocha',
  class: '3 ano B',
  track: 'Regular',
  email: 'rafael.mendes@eleva.edu.br',
  birth: '30/01/2008',
  faltas: 8,
  atrasos: 6,
  media: 6.1,
  status: 'Pendente'
}];
const STATUS_COLORS = {
  Cursando: '#28975A',
  'Atenção': '#FFAC30',
  Destaque: '#242CC2',
  Pendente: '#E65637'
};
const TRACK_COLORS = {
  Militar: '#9D0364',
  Regular: '#65686E',
  'Bilíngue': '#774BB0'
};
const StudentList = ({
  onOpen
}) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('Todos');
  const filtered = STUDENTS.filter(s => (filter === 'Todos' || s.track === filter) && (s.name.toLowerCase().includes(query.toLowerCase()) || s.class.includes(query)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      maxWidth: 1240,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, "Vis\xE3o geral ", /*#__PURE__*/React.createElement(MS, {
    name: "chevron_right",
    size: 14,
    color: "#65686E"
  }), " Alunos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 40,
      color: '#0F0F10',
      letterSpacing: '-0.01em'
    }
  }, "Alunos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "download"
  }, "Exportar"), /*#__PURE__*/React.createElement(Button, {
    variant: "fill",
    icon: "add"
  }, "Novo aluno"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontFamily: 'Nunito',
      fontSize: 16,
      color: '#65686E'
    }
  }, filtered.length, " ", filtered.length === 1 ? 'aluno encontrado' : 'alunos encontrados', " \xB7 atualizado em 17/04/2026 \xE0s 08:12")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      marginBottom: 16,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 360
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      padding: '0 16px',
      borderRadius: 8,
      border: '1px solid #C3C8D1',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(MS, {
    name: "search",
    size: 20,
    color: "#65686E"
  }), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Buscar por nome ou turma...",
    style: {
      border: 0,
      outline: 0,
      fontFamily: 'Nunito',
      fontSize: 14,
      flex: 1,
      background: 'transparent'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['Todos', 'Militar', 'Regular', 'Bilíngue'].map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    onClick: () => setFilter(f),
    style: {
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid #C3C8D1',
      background: filter === f ? '#242CC2' : '#fff',
      color: filter === f ? '#fff' : '#3D3F42',
      borderColor: filter === f ? '#242CC2' : '#C3C8D1',
      fontFamily: 'Nunito',
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer'
    }
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2.2fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1fr 40px',
      padding: '12px 20px',
      background: '#F8F9FB',
      borderBottom: '1px solid #EBEDF1',
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 12,
      color: '#65686E',
      textTransform: 'uppercase',
      letterSpacing: '0.02em',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", null, "Aluno"), /*#__PURE__*/React.createElement("span", null, "Turma"), /*#__PURE__*/React.createElement("span", null, "Trilha"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "Faltas"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "Atrasos"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "M\xE9dia"), /*#__PURE__*/React.createElement("span", null, "Situa\xE7\xE3o"), /*#__PURE__*/React.createElement("span", null)), filtered.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    onClick: () => onOpen(s),
    style: {
      display: 'grid',
      gridTemplateColumns: '2.2fr 1fr 1fr 0.7fr 0.7fr 0.7fr 1fr 40px',
      padding: '14px 20px',
      borderBottom: '1px solid #EBEDF1',
      alignItems: 'center',
      cursor: 'pointer',
      gap: 12
    },
    onMouseEnter: e => e.currentTarget.style.background = '#F8F9FB',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: s.name,
    size: 36
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10'
    }
  }, s.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 12,
      color: '#65686E'
    }
  }, s.email))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#3D3F42'
    }
  }, s.class), /*#__PURE__*/React.createElement(Tag, {
    color: TRACK_COLORS[s.track],
    size: "sm"
  }, s.track), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#3D3F42',
      textAlign: 'right'
    }
  }, s.faltas), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#3D3F42',
      textAlign: 'right'
    }
  }, s.atrasos), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Archivo',
      fontWeight: 700,
      fontSize: 14,
      color: '#0F0F10',
      textAlign: 'right'
    }
  }, s.media.toFixed(1)), /*#__PURE__*/React.createElement(Tag, {
    color: STATUS_COLORS[s.status],
    size: "sm"
  }, s.status), /*#__PURE__*/React.createElement(MS, {
    name: "chevron_right",
    size: 20,
    color: "#65686E"
  })))));
};
Object.assign(window, {
  StudentList,
  STUDENTS,
  STATUS_COLORS,
  TRACK_COLORS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/student-list.jsx", error: String((e && e.message) || e) }); }

// ui_kits/portal/table.jsx
try { (() => {
// Eleva Portal — Table component
const {
  useState
} = React;
const Table = ({
  columns,
  rows,
  onRowClick,
  selectable,
  sortable
}) => {
  const [sortCol, setSortCol] = React.useState(null);
  const [sortDir, setSortDir] = React.useState('asc');
  const [selected, setSelected] = React.useState(new Set());
  const toggleSort = key => {
    if (!sortable) return;
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');else {
      setSortCol(key);
      setSortDir('asc');
    }
  };
  const sorted = sortCol ? [...rows].sort((a, b) => {
    const va = a[sortCol],
      vb = b[sortCol];
    const cmp = typeof va === 'number' ? va - vb : String(va).localeCompare(String(vb));
    return sortDir === 'asc' ? cmp : -cmp;
  }) : rows;
  const toggleAll = () => {
    if (selected.size === rows.length) setSelected(new Set());else setSelected(new Set(rows.map((_, i) => i)));
  };
  const toggleRow = i => {
    const s = new Set(selected);
    s.has(i) ? s.delete(i) : s.add(i);
    setSelected(s);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #EBEDF1',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      background: '#C3C8D1'
    }
  }, selectable && /*#__PURE__*/React.createElement("th", {
    style: {
      width: 40,
      padding: '8px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: toggleAll,
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      border: `1.5px solid ${selected.size === rows.length ? '#242CC2' : '#ADB2BA'}`,
      background: selected.size === rows.length ? '#242CC2' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, selected.size === rows.length && /*#__PURE__*/React.createElement(MS, {
    name: "check",
    size: 12,
    color: "#fff"
  }), selected.size > 0 && selected.size < rows.length && /*#__PURE__*/React.createElement(MS, {
    name: "remove",
    size: 12,
    color: "#fff"
  }))), columns.map(col => /*#__PURE__*/React.createElement("th", {
    key: col.key,
    onClick: () => toggleSort(col.key),
    style: {
      padding: '8px 16px',
      textAlign: col.align || 'left',
      fontFamily: 'Nunito',
      fontWeight: 700,
      fontSize: 14,
      color: '#3D3F42',
      whiteSpace: 'nowrap',
      borderBottom: '1px solid #ADB2BA',
      cursor: sortable && col.sortable !== false ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4
    }
  }, col.label, sortable && col.sortable !== false && /*#__PURE__*/React.createElement(MS, {
    name: sortCol === col.key ? sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward' : 'unfold_more',
    size: 14,
    color: "#65686E"
  })))))), /*#__PURE__*/React.createElement("tbody", null, sorted.map((row, i) => /*#__PURE__*/React.createElement("tr", {
    key: i,
    onClick: () => onRowClick && onRowClick(row),
    style: {
      cursor: onRowClick ? 'pointer' : 'default',
      transition: 'background 120ms'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#F8F9FB',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, selectable && /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EBEDF1'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      e.stopPropagation();
      toggleRow(i);
    },
    style: {
      width: 16,
      height: 16,
      borderRadius: 4,
      border: `1.5px solid ${selected.has(i) ? '#242CC2' : '#C3C8D1'}`,
      background: selected.has(i) ? '#242CC2' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, selected.has(i) && /*#__PURE__*/React.createElement(MS, {
    name: "check",
    size: 12,
    color: "#fff"
  }))), columns.map(col => /*#__PURE__*/React.createElement("td", {
    key: col.key,
    style: {
      padding: '12px 16px',
      borderBottom: '1px solid #EBEDF1',
      textAlign: col.align || 'left',
      verticalAlign: 'middle'
    }
  }, col.render ? col.render(row[col.key], row) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Nunito',
      fontSize: 14,
      color: '#3D3F42'
    }
  }, row[col.key]))))))));
};
Object.assign(window, {
  Table
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/portal/table.jsx", error: String((e && e.message) || e) }); }

})();
