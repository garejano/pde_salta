// Eleva Portal — App
const App = () => {
  const [screen, setScreen] = React.useState('students');
  const [student, setStudent] = React.useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [editName, setEditName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');

  const openStudent = (s) => { setStudent(s); setScreen('card'); };
  const openEdit = () => {
    setEditName(student.name);
    setEditEmail(student.email);
    setEditOpen(true);
  };
  const saveEdit = () => {
    setStudent({ ...student, name: editName, email: editEmail });
    setEditOpen(false);
    setToast('Dados do aluno atualizados.');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#F8F9FB' }}>
      <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar active={screen === 'card' ? 'students' : screen}
                 collapsed={sidebarCollapsed}
                 onNavigate={(id) => { setScreen(id); setStudent(null); }} />
        <main style={{ flex: 1, overflow: 'auto' }}>
          {screen === 'students' && <StudentList onOpen={openStudent} />}
          {screen === 'card' && <StudentCard student={student}
                                             onBack={() => setScreen('students')}
                                             onEdit={openEdit} />}
          {screen !== 'students' && screen !== 'card' && (
            <div style={{ padding: 64, textAlign: 'center', fontFamily: 'Nunito', color: '#65686E' }}>
              <MS name="construction" size={48} color="#C3C8D1" />
              <p style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: 20, color: '#0F0F10', margin: '12px 0 4px' }}>
                Seção "{screen}" em construção
              </p>
              <p>Esta tela faz parte do kit de referência e não está implementada.</p>
            </div>
          )}
        </main>
      </div>

      <Modal title="Editar aluno" open={editOpen} onClose={() => setEditOpen(false)}
             actions={<>
               <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancelar</Button>
               <Button variant="fill" onClick={saveEdit}>Salvar alterações</Button>
             </>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nome completo" icon="person" value={editName} onChange={setEditName} />
          <Input label="E-mail" icon="mail" value={editEmail} onChange={setEditEmail} />
          <Alert variant="info" title="Alterações visíveis">
            As alterações feitas aqui aparecem imediatamente para a coordenação.
          </Alert>
        </div>
      </Modal>

      {toast && <Toast title={toast} onClose={() => setToast(null)} />}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
