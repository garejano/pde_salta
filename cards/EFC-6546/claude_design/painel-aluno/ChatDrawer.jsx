// Chatbot drawer — right-side slide-in
const SUGGESTIONS = [
  'Como está a frequência da Maria?',
  'Qual a média geral dela?',
  'Há alguma restrição médica?',
  'Quando foi o último contato com a família?',
];

const MOCK_ANSWERS = {
  default: 'De acordo com os registros pedagógicos dos últimos 60 dias, encontrei as seguintes informações sobre Maria Albuquerque Santos:',
  'Como está a frequência da Maria?': 'A frequência da Maria está em **92%**, com 8 faltas no bimestre — todas justificadas. Isso está dentro do limite aceitável (acima de 75%), mas acima da média da turma, que é de 4 faltas.',
  'Qual a média geral dela?': 'A média geral da Maria no 3º bimestre é **7,4**. Ela tem desempenho acima da média em Língua Portuguesa (9,2) e História (8,8), e abaixo em Matemática (6,2) e Física (5,8).',
  'Há alguma restrição médica?': 'Não há restrições médicas registradas na ficha. Tipo sanguíneo: O+. Sem alergias ou medicamentos de uso contínuo. Ficha atualizada em 15/02/2026.',
  'Quando foi o último contato com a família?': 'O último atendimento à família foi realizado há **45 dias** (em 03/03/2026), com foco em estratégias de apoio pedagógico para Matemática.',
};

const ChatDrawer = ({ open, onClose, pendingQuestion, onQuestionConsumed }) => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef(null);
  const { isMobile } = useBreakpoint();
  const drawerWidth = isMobile ? '100vw' : 400;

  // Handle a pending question pushed from chips
  React.useEffect(() => {
    if (open && pendingQuestion) {
      send(pendingQuestion);
      onQuestionConsumed();
    }
  }, [open, pendingQuestion]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const a = MOCK_ANSWERS[q] || MOCK_ANSWERS.default;
      setMessages((m) => [...m, { role: 'bot', text: a }]);
      setIsTyping(false);
    }, 900);
  };

  const clearConversation = () => setMessages([]);

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(15,15,16,0.28)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 240ms var(--ease-out)', zIndex: 40,
      }} />
      {/* Drawer */}
      <aside style={{
        position: 'fixed', top: 0, right: 0, height: '100vh', width: drawerWidth,
        background: '#fff', borderLeft: '1px solid #EBEDF1',
        boxShadow: '-8px 0 24px rgba(0,23,31,0.08)',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 320ms var(--ease-out)',
        zIndex: 50, display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 18px', borderBottom: '1px solid #EBEDF1',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            flexShrink: 0, overflow: 'hidden',
          }}>
            <img src={(window.__resources && window.__resources.owlAgent) || "assets/owl-agent.png"} alt="Agente Pedagógico" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-display-family)', fontWeight: 600, fontSize: 16, lineHeight: '22px',
              color: 'var(--color-primary)',
            }}>Agente Pedagógico</div>
            <div style={{
              fontFamily: 'var(--font-body-family)', fontSize: 12, lineHeight: '20px', color: 'var(--color-neutral-dark1)', marginTop: 2,
            }}>Maria Albuquerque Santos</div>
          </div>
          {messages.length > 0 && (
            <button onClick={clearConversation} title="Nova conversa" style={{
              width: 32, height: 32, borderRadius: 8, background: 'transparent',
              border: 0, cursor: 'pointer', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center',
            }}
            onMouseOver={(e)=>e.currentTarget.style.background='#F8F9FB'}
            onMouseOut={(e)=>e.currentTarget.style.background='transparent'}>
              <MS name="refresh" size={18} color="#65686E" />
            </button>
          )}
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8, background: 'transparent',
            border: 0, cursor: 'pointer', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
          }}
          onMouseOver={(e)=>e.currentTarget.style.background='#F8F9FB'}
          onMouseOut={(e)=>e.currentTarget.style.background='transparent'}>
            <MS name="close" size={20} color="#65686E" />
          </button>
        </div>

        {/* Body */}
        <div ref={scrollRef} style={{
          flex: 1, overflowY: 'auto', padding: '20px 18px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {messages.length === 0 ? (
            <EmptyState onPick={(q) => send(q)} />
          ) : (
            <>
              {messages.map((m, i) => <Bubble key={i} role={m.role} text={m.text} />)}
              {isTyping && <TypingBubble />}
            </>
          )}
        </div>

        {/* Input */}
        <div style={{
          padding: 14, borderTop: '1px solid #EBEDF1',
          display: 'flex', gap: 8, alignItems: 'center',
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Digite sua pergunta..."
            style={{
              flex: 1, height: 40, padding: '0 14px',
              border: '1px solid #C3C8D1', borderRadius: 8,
              background: '#fff', outline: 'none',
              fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(36,44,194,0.16)'; }}
            onBlur={(e) => { e.target.style.borderColor = '#C3C8D1'; e.target.style.boxShadow = 'none'; }}
          />
          <button onClick={() => send()} disabled={!input.trim()} style={{
            height: 40, padding: '0 18px',
            background: input.trim() ? 'var(--color-primary)' : '#EBEDF1',
            color: input.trim() ? '#fff' : '#ADB2BA',
            border: 0, borderRadius: 8,
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontFamily: 'var(--font-display-family)', fontWeight: 700, fontSize: 14,
            transition: 'background 160ms',
          }}>
            Enviar
          </button>
        </div>
      </aside>
    </>
  );
};

const EmptyState = ({ onPick }) => (
  <div style={{
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '40px 0 0',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 999,
      background: 'var(--color-primary-light3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: 16,
    }}>
      <MS name="chat_bubble" size={32} color="var(--color-primary)" />
    </div>
    <p style={{
      margin: '0 0 20px', fontFamily: 'var(--font-body-family)', fontSize: 14,
      color: '#3D3F42', textAlign: 'center', maxWidth: 280,
    }}>
      Faça perguntas sobre Maria Albuquerque Santos
    </p>
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {SUGGESTIONS.map((s) => (
        <button key={s} onClick={() => onPick(s)} style={{
          width: '100%', textAlign: 'left',
          padding: '12px 14px',
          background: '#fff', border: '1px solid #C3C8D1', borderRadius: 8,
          cursor: 'pointer',
          fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: '24px', color: 'var(--color-neutral-dark3)',
          transition: 'all 160ms',
        }}
        onMouseOver={(e)=>{ e.currentTarget.style.borderColor='var(--color-primary)'; e.currentTarget.style.background='var(--color-primary-light3)'; }}
        onMouseOut={(e)=>{ e.currentTarget.style.borderColor='#C3C8D1'; e.currentTarget.style.background='#fff'; }}>
          {s}
        </button>
      ))}
    </div>
  </div>
);

const Bubble = ({ role, text }) => {
  const isUser = role === 'user';
  // Simple markdown for **bold**
  const render = (t) => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') ? <b key={i} style={{ fontWeight: 700, color: isUser ? '#fff' : '#0F0F10' }}>{p.slice(2, -2)}</b> : <React.Fragment key={i}>{p}</React.Fragment>
    );
  };
  return (
    <div style={{
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: '85%',
      background: isUser ? 'var(--color-primary)' : '#F8F9FB',
      color: isUser ? '#fff' : '#0F0F10',
      border: isUser ? 0 : '1px solid #EBEDF1',
      padding: '10px 14px', borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
      fontFamily: 'var(--font-body-family)', fontSize: 14, lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
    }}>{render(text)}</div>
  );
};

const TypingBubble = () => (
  <div style={{
    alignSelf: 'flex-start', background: '#F8F9FB',
    border: '1px solid #EBEDF1', padding: '12px 14px',
    borderRadius: '12px 12px 12px 2px',
    display: 'flex', gap: 4,
  }}>
    {[0,1,2].map(i => (
      <span key={i} style={{
        width: 6, height: 6, borderRadius: 999, background: '#65686E',
        animation: `typing 1.2s ${i * 0.15}s infinite ease-in-out`,
      }} />
    ))}
  </div>
);

// Floating trigger button
const ChatFab = ({ onClick, hidden }) => (
  <button onClick={onClick} style={{
    position: 'fixed', bottom: 24, right: 24, zIndex: 35,
    width: 56, height: 56, borderRadius: 999,
    background: 'var(--color-primary)', color: '#fff',
    border: 0, cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(36,44,194,0.35)',
    display: hidden ? 'none' : 'inline-flex',
    alignItems: 'center', justifyContent: 'center',
    transition: 'transform 200ms, background 160ms',
  }}
  onMouseOver={(e)=>{ e.currentTarget.style.background='var(--color-primary-dark1)'; e.currentTarget.style.transform='scale(1.05)'; }}
  onMouseOut={(e)=>{ e.currentTarget.style.background='var(--color-primary)'; e.currentTarget.style.transform='scale(1)'; }}>
    <MS name="chat" size={26} color="#fff" />
  </button>
);

Object.assign(window, { ChatDrawer, ChatFab });
