import { QuestionData, LevelData } from '@/types';

export const QUESTIONS: QuestionData[] = [
  {
    id: 1,
    text: 'Você sabe o que são dados pessoais?',
    options: [
      { text: 'Informações que identificam ou podem identificar uma pessoa', score: 2 },
      { text: 'Apenas CPF e RG', score: 0 },
      { text: 'Apenas dados financeiros', score: 0 },
      { text: 'Não sei', score: 0 },
    ],
  },
  {
    id: 2,
    text: 'Ao receber um documento contendo dados pessoais de um cliente, qual sua primeira preocupação?',
    options: [
      { text: 'Guardar e compartilhar apenas com quem precisa utilizar', score: 2 },
      { text: 'Encaminhar para todos os envolvidos', score: 0 },
      { text: 'Salvar em qualquer local disponível', score: 0 },
      { text: 'Não sei', score: 0 },
    ],
  },
  {
    id: 3,
    text: 'Você costuma verificar se os dados solicitados são realmente necessários para a atividade que será realizada?',
    options: [
      { text: 'Sempre', score: 2 },
      { text: 'Na maioria das vezes', score: 1 },
      { text: 'Raramente', score: 0 },
      { text: 'Nunca', score: 0 },
    ],
  },
  {
    id: 4,
    text: 'O que você faria se recebesse por engano informações de outro cliente ou colaborador?',
    options: [
      { text: 'Informaria imediatamente o responsável', score: 2 },
      { text: 'Ignoraria a situação', score: 0 },
      { text: 'Compartilharia com colegas para verificar', score: 0 },
      { text: 'Não saberia o que fazer', score: 0 },
    ],
  },
  {
    id: 5,
    text: 'Você utiliza senha para acessar seus equipamentos de trabalho?',
    options: [
      { text: 'Sim, e a mantenho em sigilo', score: 2 },
      { text: 'Sim, mas compartilho quando necessário', score: 1 },
      { text: 'Não utilizo senha', score: 0 },
      { text: 'Não se aplica', score: 1 },
    ],
  },
  {
    id: 6,
    text: 'Você já recebeu algum treinamento ou orientação sobre proteção de dados pessoais?',
    options: [
      { text: 'Sim, recentemente', score: 2 },
      { text: 'Sim, há bastante tempo', score: 1 },
      { text: 'Não me recordo', score: 0 },
      { text: 'Nunca', score: 0 },
    ],
  },
  {
    id: 7,
    text: 'Antes de enviar um e-mail com documentos ou informações pessoais, você confere os destinatários?',
    options: [
      { text: 'Sempre', score: 2 },
      { text: 'Quase sempre', score: 1 },
      { text: 'Raramente', score: 0 },
      { text: 'Nunca', score: 0 },
    ],
  },
  {
    id: 8,
    text: 'Você sabe a quem recorrer na empresa em caso de dúvida sobre proteção de dados ou segurança da informação?',
    options: [
      { text: 'Sim', score: 2 },
      { text: 'Já ouvi falar, mas não sei exatamente', score: 1 },
      { text: 'Não', score: 0 },
    ],
  },
  {
    id: 9,
    text: 'Você utiliza o mesmo usuário e senha de trabalho em sites ou sistemas pessoais?',
    options: [
      { text: 'Nunca', score: 2 },
      { text: 'Às vezes', score: 1 },
      { text: 'Frequentemente', score: 0 },
      { text: 'Prefiro não responder', score: 0 },
    ],
  },
  {
    id: 10,
    text: 'Se encontrar um pendrive desconhecido nas dependências da empresa, o que faria?',
    options: [
      { text: 'Entregaria ao responsável de TI ou segurança', score: 2 },
      { text: 'Conectaria ao computador para verificar o conteúdo', score: 0 },
      { text: 'Guardaria para uso próprio', score: 0 },
      { text: 'Não saberia o que fazer', score: 0 },
    ],
  },
  {
    id: 11,
    text: 'Você considera importante proteger os dados pessoais de clientes, colaboradores e fornecedores?',
    options: [
      { text: 'Muito importante', score: 2 },
      { text: 'Importante', score: 1 },
      { text: 'Pouco importante', score: 0 },
      { text: 'Não vejo relevância', score: 0 },
    ],
  },
  {
    id: 12,
    text: 'Como você avalia seu conhecimento sobre proteção de dados pessoais?',
    options: [
      { text: 'Avançado', score: 2 },
      { text: 'Intermediário', score: 1 },
      { text: 'Básico', score: 0 },
      { text: 'Nenhum conhecimento', score: 0 },
    ],
  },
];

export const LEVELS: LevelData[] = [
  {
    id: 1, name: 'Atenção', range: [0, 6],
    color: '#E24B4A', textColor: '#791F1F', bgColor: '#FCEBEB', borderColor: '#E24B4A',
    situation: 'Conhecimento muito limitado sobre proteção de dados',
    action: 'É fundamental iniciar um programa de treinamento em proteção de dados pessoais o mais breve possível.',
    steps: ['Participar de treinamento introdutório sobre LGPD','Conhecer a política de privacidade da organização','Identificar o responsável pela proteção de dados (DPO)','Aprender sobre boas práticas de segurança da informação','Revisar o uso de senhas e acesso a sistemas'],
  },
  {
    id: 2, name: 'Em Desenvolvimento', range: [7, 12],
    color: '#EF9F27', textColor: '#412402', bgColor: '#FAEEDA', borderColor: '#EF9F27',
    situation: 'Conhecimento básico, com pontos importantes a desenvolver',
    action: 'Há consciência inicial, mas é preciso aprofundar o conhecimento e revisar práticas do dia a dia.',
    steps: ['Aprofundar conhecimento sobre dados pessoais e bases legais','Revisar práticas de compartilhamento de informações','Participar de treinamento intermediário de LGPD','Conhecer melhor os procedimentos internos de segurança','Praticar verificação de destinatários em comunicações'],
  },
  {
    id: 3, name: 'Consciente', range: [13, 18],
    color: '#1D9E75', textColor: '#04342C', bgColor: '#E1F5EE', borderColor: '#1D9E75',
    situation: 'Bom nível de consciência, com aprimoramentos recomendados',
    action: 'Demonstra boa compreensão do tema. Foque em consolidar as boas práticas e se manter atualizado.',
    steps: ['Manter-se atualizado sobre mudanças na LGPD','Compartilhar conhecimento com colegas de trabalho','Participar de treinamentos avançados periodicamente','Revisar e reforçar as práticas de segurança de senhas','Acompanhar comunicados internos sobre proteção de dados'],
  },
  {
    id: 4, name: 'Referência', range: [19, 24],
    color: '#378ADD', textColor: '#042C53', bgColor: '#E6F1FB', borderColor: '#378ADD',
    situation: 'Alto nível de consciência em proteção de dados',
    action: 'Parabéns! Você demonstra excelente conhecimento. Contribua para disseminar a cultura de privacidade na organização.',
    steps: ['Apoiar colegas no desenvolvimento do tema','Participar de iniciativas de cultura de privacidade','Propor melhorias nos processos internos de dados','Manter-se atualizado com as melhores práticas do setor','Ser referência positiva na organização'],
  },
];

export const MAX_SCORE = QUESTIONS.length * 2;