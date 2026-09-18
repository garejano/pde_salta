// Mock data for Carômetro — placeholder students
window.SCHOOL = {
  name: 'Alfa',
  unit: 'Campo Mourão',
  line1: 'Professor Eduardo Wanderley Filho, 535 · Boa Viagem · Recife/PE · CEP: 51011-170 · Telefone: 34430030',
  line2: 'CNPJ: 34.805.184/0001-08 · Entidade Mantenedora: Escola Empreendimentos Educacionais Ltda. · Parecer CEE nº 075/99, publicado em D.O. 25/07/99 pág. 19',
};

window.TURMA = {
  label: 'Infantil 2 bilíngue A',
  count: 15,
  inspetor: '________________________________',
};

// 15 placeholder students. Mix of pedagógico / financeiro responsáveis
window.STUDENTS = [
  { name: 'Amélia Cordeiro do Amaral',     ra: '23456701', resp: { kind: 'pedagógico', name: 'Lorenna Menezes da Silva',      phone: '(00) 00000-0000', email: 'lorennamenezes@hotmail.com' } },
  { name: 'Bruna Lombardi dos Santos',     ra: '23456702', resp: { kind: 'pedagógico', name: 'Aline Medeiros dos S. Pereira', phone: '(00) 00000-0000', email: 'alinemedeiros@gmail.com' } },
  { name: 'Carolina Ferreira Tomé',        ra: '23456703', resp: { kind: 'financeiro', name: 'Lorenna Menezes da Silva',      phone: '(00) 00000-0000', email: 'lorennamenezes@hotmail.com' } },
  { name: 'Daniel Vasconcelos Ribeiro',    ra: '23456704', resp: { kind: 'financeiro', name: 'Beatriz Ribeiro Maia',          phone: '(00) 00000-0000', email: 'beatriz.maia@outlook.com' } },
  { name: 'Eduardo Albuquerque Filho',     ra: '23456705', resp: { kind: 'pedagógico', name: 'Carla Albuquerque',             phone: '(00) 00000-0000', email: 'carla.alb@gmail.com' } },
  { name: 'Fernanda Oliveira de Sá',       ra: '23456706', resp: { kind: 'financeiro', name: 'Rogério Oliveira de Sá',        phone: '(00) 00000-0000', email: 'rogerio.sa@gmail.com' } },
  { name: 'Gabriel Henrique do Nascimento',ra: '23456707', resp: { kind: 'pedagógico', name: 'Patrícia do Nascimento',        phone: '(00) 00000-0000', email: 'patricia.nasc@gmail.com' } },
  { name: 'Helena Marques Costa',          ra: '23456708', resp: { kind: 'pedagógico', name: 'Sandra Marques Costa',          phone: '(00) 00000-0000', email: 'sandra.costa@hotmail.com' } },
  { name: 'Igor Andrade Pimentel',         ra: '23456709', resp: { kind: 'financeiro', name: 'Marcelo Andrade',               phone: '(00) 00000-0000', email: 'marcelo.andrade@gmail.com' } },
  { name: 'Júlia Bernardes Cavalcanti',    ra: '23456710', resp: { kind: 'pedagógico', name: 'Roberta Bernardes',             phone: '(00) 00000-0000', email: 'roberta.b@gmail.com' } },
  { name: 'Kauê Santiago de Lima',         ra: '23456711', resp: { kind: 'financeiro', name: 'Vinícius Santiago',             phone: '(00) 00000-0000', email: 'v.santiago@outlook.com' } },
  { name: 'Larissa Pontes Maciel',         ra: '23456712', resp: { kind: 'pedagógico', name: 'Daniela Pontes',                phone: '(00) 00000-0000', email: 'daniela.pontes@gmail.com' } },
  { name: 'Murilo Tavares Brandão',        ra: '23456713', resp: { kind: 'pedagógico', name: 'Renata Tavares',                phone: '(00) 00000-0000', email: 'renata.t@gmail.com' } },
  { name: 'Natália Quirino Lacerda',       ra: '23456714', resp: { kind: 'financeiro', name: 'Tatiana Quirino',               phone: '(00) 00000-0000', email: 'tatiana.q@hotmail.com' } },
  { name: 'Otávio Mendes Sá Barreto',      ra: '23456715', resp: { kind: 'pedagógico', name: 'Cristina Mendes',               phone: '(00) 00000-0000', email: 'cristina.m@gmail.com' } },
];

// Avatar palette — soft bg + saturated initial (design system colors)
window.AVATAR_PALETTE = [
  { bg: '#E3E5FB', fg: '#242CC2' }, // indigo
  { bg: '#D5F2F4', fg: '#228085' }, // teal
  { bg: '#FBE5F1', fg: '#9D0364' }, // magenta
  { bg: '#ECE2F7', fg: '#774BB0' }, // purple
  { bg: '#FFF1D6', fg: '#B37822' }, // amber
  { bg: '#D5F2E0', fg: '#28975A' }, // green
  { bg: '#FBDED4', fg: '#A13C26' }, // orange-soft
];

window.initials = (name) => {
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
};

window.paletteFor = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return window.AVATAR_PALETTE[h % window.AVATAR_PALETTE.length];
};
