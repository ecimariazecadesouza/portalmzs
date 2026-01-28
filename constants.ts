import { Announcement, Resource, DocumentItem } from './types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Feira de Ciências 2024',
    content: 'Atenção alunos! A Feira de Ciências anual acontecerá no dia 25 de Outubro. As inscrições para apresentação de projetos estão abertas na secretaria até a próxima sexta-feira. Preparem suas ideias inovadoras!',
    date: '2023-10-10',
    author: 'Coordenação Pedagógica',
    tags: ['Eventos', 'Ciências'],
    active: true,
    featured: true
  },
  {
    id: '2',
    title: 'Horário de Provas - 4º Bimestre',
    content: 'O calendário oficial de avaliações do 4º bimestre já está disponível. Consultem o anexo abaixo para ver as datas detalhadas por turma.',
    date: '2023-10-12',
    author: 'Diretoria',
    tags: ['Acadêmico', 'Horário'],
    attachmentUrl: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?auto=format&fit=crop&q=80&w=800',
    attachmentType: 'image',
    active: true,
    featured: false
  },
  {
    id: '3',
    title: 'Recesso Escolar',
    content: 'Lembramos que não haverá aula nos dias 02 e 03 de Novembro devido ao feriado nacional. Retornaremos às atividades normais no dia 04.',
    date: '2023-10-15',
    author: 'Secretaria',
    tags: ['Avisos', 'Feriado'],
    active: true,
    featured: false
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Base Nacional Comum Curricular (BNCC)',
    description: 'Documento normativo que define o conjunto orgânico e progressivo de aprendizagens essenciais.',
    url: 'http://basenacionalcomum.mec.gov.br/',
    category: 'Legislação',
    active: true
  },
  {
    id: '2',
    title: 'Canva para Educação',
    description: 'Ferramenta de design gráfico gratuita para escolas e professores criarem materiais visuais.',
    url: 'https://www.canva.com/pt_br/educacao/',
    category: 'Ferramentas',
    active: true
  },
  {
    id: '3',
    title: 'Nova Escola - Planos de Aula',
    description: 'Acervo com milhares de planos de aula alinhados à BNCC para todas as etapas.',
    url: 'https://novaescola.org.br/planos-de-aula',
    category: 'Planejamento',
    active: true
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: '1',
    title: 'Lista de Materiais 2024',
    category: 'Administrativo',
    url: '#',
    type: 'pdf',
    date: '2023-12-01',
    active: true
  },
  {
    id: '2',
    title: 'Autorização de Saída Antecipada',
    category: 'Formulários',
    url: '#',
    type: 'doc',
    date: '2023-02-15',
    active: true
  },
  {
    id: '3',
    title: 'Horário das Aulas - Ensino Médio',
    category: 'Horários',
    url: '#',
    type: 'image',
    date: '2023-08-01',
    active: true
  }
];