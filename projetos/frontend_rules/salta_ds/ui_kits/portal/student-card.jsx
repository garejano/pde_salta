// Eleva Portal — Student Card (expanded view)
const StudentCard = ({ student, onBack, onEdit }) => {
  if (!student) return null;
  return (
    <div style={{ padding: 32, maxWidth: 1240, margin: '0 auto' }}>
      <button onClick={onBack} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px',
        margin: '0 0 16px -10px', border: 0, background: 'transparent', cursor: 'pointer',
        color: '#242CC2', fontFamily: 'Nunito', fontWeight: 600, fontSize: 14,
        borderRadius: 8,
      }}>
        <MS name="arrow_back" size={18} color="#242CC2" /> Voltar para alunos
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Profile header card */}
          <div style={{
            background: '#fff', borderRadius: 8, padding: 24,
            border: '1px solid #EBEDF1', display: 'flex', gap: 20, alignItems: 'center',
          }}>
            <Avatar name={student.name} size={80} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <Tag color="#9D0364" size="sm" icon="school">{student.class}</Tag>
                <Tag color={student.track === 'Militar' ? '#9D0364' : student.track === 'Bilíngue' ? '#774BB0' : '#65686E'} size="sm">{student.track}</Tag>
              </div>
              <h1 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 700, fontSize: 32, color: '#0F0F10' }}>{student.name}</h1>
              <div style={{ fontFamily: 'Nunito', fontSize: 14, color: '#65686E', marginTop: 6 }}>
                E-mail: {student.email} · Nascimento: {student.birth}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" icon="edit" onClick={onEdit}>Editar</Button>
              <Button variant="fill" icon="link">Gerar link de anamnese</Button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { k: 'Faltas', v: student.faltas, icon: 'event_busy', color: '#E65637' },
              { k: 'Atrasos', v: student.atrasos, icon: 'schedule', color: '#FFAC30' },
              { k: 'Média geral', v: student.media.toFixed(1), icon: 'grade', color: '#28975A' },
              { k: 'Bimestre', v: '3º', icon: 'calendar_month', color: '#242CC2' },
            ].map(s => (
              <div key={s.k} style={{
                background: '#fff', border: '1px solid #EBEDF1', borderRadius: 8,
                padding: 16, display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <MS name={s.icon} size={20} color={s.color} />
                <span style={{ fontFamily: 'Nunito', fontSize: 12, color: '#65686E' }}>{s.k}</span>
                <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: 28, color: '#0F0F10' }}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* Attendance alert */}
          {student.faltas >= 5 && (
            <Alert variant="warning" title="Faltas acima do recomendado">
              Este aluno ultrapassou o limite de faltas do bimestre. Entre em contato com o responsável.
            </Alert>
          )}

          {/* Recent activity */}
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #EBEDF1', overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px', borderBottom: '1px solid #EBEDF1',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 600, fontSize: 18, color: '#0F0F10' }}>Atividades recentes</h3>
              <Button variant="ghost" size="sm">Ver tudo</Button>
            </div>
            {[
              { t: 'Prova de matemática — 8,5', d: '12/02/2026 às 13:30', icon: 'edit_note' },
              { t: 'Entrega — Redação "Cidadania"', d: '10/02/2026 às 10:00', icon: 'description' },
              { t: 'Falta — Educação física', d: '08/02/2026', icon: 'event_busy' },
              { t: 'Reunião com responsável', d: '05/02/2026 às 16:00', icon: 'groups' },
            ].map((it, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 20px',
                borderBottom: i < 3 ? '1px solid #EBEDF1' : 'none', alignItems: 'center',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 8, background: '#E3E5FB',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MS name={it.icon} size={20} color="#242CC2" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, color: '#0F0F10' }}>{it.t}</div>
                  <div style={{ fontFamily: 'Nunito', fontSize: 12, color: '#65686E' }}>{it.d}</div>
                </div>
                <MS name="chevron_right" size={20} color="#65686E" />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Contact & parents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #EBEDF1', padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Responsável</h3>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar name="Carlos Santos" size={44} />
              <div>
                <div style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 14, color: '#0F0F10' }}>Carlos Santos</div>
                <div style={{ fontFamily: 'Nunito', fontSize: 12, color: '#65686E' }}>Pai · (11) 98765-4321</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <Button variant="outline" size="sm" icon="mail">E-mail</Button>
              <Button variant="outline" size="sm" icon="call">Ligar</Button>
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #EBEDF1', padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Documentos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Ficha médica.pdf', 'Contrato 2026.pdf', 'Autorização de saída.pdf'].map(d => (
                <div key={d} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px',
                  background: '#F8F9FB', borderRadius: 8,
                }}>
                  <MS name="picture_as_pdf" size={18} color="#E65637" />
                  <span style={{ flex: 1, fontFamily: 'Nunito', fontSize: 13, color: '#0F0F10' }}>{d}</span>
                  <MS name="download" size={18} color="#65686E" style={{ cursor: 'pointer' }} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 8, border: '1px solid #EBEDF1', padding: 20 }}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 16, color: '#0F0F10' }}>Situação</h3>
            <Tag color={({ Cursando: '#28975A', 'Atenção': '#FFAC30', Destaque: '#242CC2', Pendente: '#E65637' })[student.status]}>
              {student.status}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { StudentCard });
