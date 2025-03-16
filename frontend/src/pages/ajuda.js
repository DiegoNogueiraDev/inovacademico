/**
 * File: inovacademico/frontend/src/pages/ajuda.js
 * Página de Ajuda
 */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Ajuda() {
  const [activeCategory, setActiveCategory] = useState('geral');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleQuestion = (id) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqs = {
    geral: [
      {
        id: 'what-is',
        question: 'O que é o InovAcadêmico?',
        answer: 'O InovAcadêmico é uma ferramenta baseada em inteligência artificial projetada para auxiliar estudantes, pesquisadores e acadêmicos na formatação correta de referências bibliográficas de acordo com diferentes normas acadêmicas (ABNT, APA, Vancouver e MLA).'
      },
      {
        id: 'how-works',
        question: 'Como o InovAcadêmico funciona?',
        answer: 'Você insere suas referências bibliográficas que não estão formatadas ou que precisam ser verificadas, seleciona o estilo de formatação desejado (ABNT, APA, etc.) e nosso sistema de IA analisa e reformata suas referências de acordo com o padrão escolhido, destacando as alterações realizadas.'
      },
      {
        id: 'is-free',
        question: 'O InovAcadêmico é gratuito?',
        answer: 'Sim, o InovAcadêmico é uma ferramenta gratuita. Estamos comprometidos em tornar o processo de formatação bibliográfica acessível a todos os estudantes e pesquisadores.'
      },
      {
        id: 'account-needed',
        question: 'Preciso criar uma conta para usar o InovAcadêmico?',
        answer: 'Não, você não precisa criar uma conta para usar o InovAcadêmico. Basta acessar nossa página inicial e começar a corrigir suas referências bibliográficas imediatamente.'
      }
    ],
    formatacao: [
      {
        id: 'styles-supported',
        question: 'Quais estilos de formatação são suportados?',
        answer: 'Atualmente, o InovAcadêmico suporta os seguintes estilos de formatação: ABNT (Associação Brasileira de Normas Técnicas), APA (American Psychological Association), Vancouver e MLA (Modern Language Association).'
      },
      {
        id: 'format-multiple',
        question: 'Posso formatar várias referências de uma vez?',
        answer: 'Sim, você pode colar várias referências de uma vez na área de texto. O InovAcadêmico identificará cada referência separadamente e formatará todas elas de acordo com o estilo selecionado.'
      },
      {
        id: 'format-accuracy',
        question: 'Qual é a precisão das correções?',
        answer: 'Nossa ferramenta de IA tem uma alta taxa de precisão, mas recomendamos sempre verificar o resultado final. Quanto mais completa for a referência original, mais precisa será a correção. Nosso sistema melhora continuamente com base no feedback dos usuários.'
      },
      {
        id: 'mixed-styles',
        question: 'Posso corrigir referências com estilos misturados?',
        answer: 'Sim, você pode inserir referências que estão em diferentes estilos ou que não seguem nenhum estilo específico. O InovAcadêmico irá reformatar todas elas de acordo com o estilo de destino que você selecionar.'
      }
    ],
    recursos: [
      {
        id: 'import-references',
        question: 'Como posso importar referências?',
        answer: 'Você pode importar referências acessando a página "Importar Referências" e fazendo upload de um arquivo BibTeX, RIS ou JSON com suas referências. Alternativamente, você pode colar manualmente suas referências na área de texto.'
      },
      {
        id: 'export-results',
        question: 'Posso exportar os resultados?',
        answer: 'Sim, após a correção das referências, você pode baixar os resultados em vários formatos, incluindo texto simples, formato RIS e BibTeX, usando os botões de exportação na página de resultados.'
      },
      {
        id: 'save-history',
        question: 'O InovAcadêmico salva meu histórico de correções?',
        answer: 'Sim, suas últimas correções são salvas localmente no seu navegador para facilitar o acesso. Você pode visualizar e reutilizar correções anteriores através do painel de histórico acessível na barra de navegação.'
      },
      {
        id: 'add-manually',
        question: 'Como adicionar referências manualmente?',
        answer: 'Para adicionar referências manualmente, vá até a página "Adicionar Referência" e preencha os campos do formulário com as informações da sua referência. Depois clique em salvar para adicioná-la à sua biblioteca pessoal.'
      }
    ],
    problemas: [
      {
        id: 'not-working',
        question: 'O que fazer se a correção não funcionar?',
        answer: 'Se a correção não funcionar como esperado, primeiro verifique se as referências originais contêm informações suficientes. Caso o problema persista, você pode enviar feedback através do botão na página de resultados, ou entrar em contato conosco diretamente.'
      },
      {
        id: 'incorrect-format',
        question: 'Recebi uma formatação incorreta, o que devo fazer?',
        answer: 'Se você identificar algum erro na formatação, use a opção de feedback para nos informar sobre o problema. Inclua detalhes sobre qual parte está incorreta e, se possível, qual seria a formatação correta. Isso nos ajuda a melhorar o sistema.'
      },
      {
        id: 'system-slow',
        question: 'O sistema está lento. Como posso melhorar isso?',
        answer: 'O tempo de processamento depende do volume de referências e da complexidade das mesmas. Para melhorar a performance, tente dividir grandes lotes de referências em blocos menores ou verifique sua conexão com a internet. Limpar o cache do navegador também pode ajudar.'
      },
      {
        id: 'browser-issues',
        question: 'Quais navegadores são compatíveis?',
        answer: 'O InovAcadêmico é compatível com as versões mais recentes do Google Chrome, Mozilla Firefox, Microsoft Edge e Safari. Para melhor experiência, mantenha seu navegador atualizado. Se encontrar problemas em um navegador específico, por favor nos informe.'
      }
    ]
  };

  const categories = [
    { id: 'geral', label: 'Perguntas Gerais' },
    { id: 'formatacao', label: 'Formatação' },
    { id: 'recursos', label: 'Recursos' },
    { id: 'problemas', label: 'Problemas Comuns' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>Ajuda - InovAcadêmico</title>
        <meta name="description" content="Ajuda e suporte para o InovAcadêmico, ferramenta para correção de bibliografias acadêmicas" />
      </Head>

      {/* Header simplificado */}
      <header className="relative z-10 bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md shadow-lg border-b border-rose-900/30">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 mr-3">
              <img src="/graduation-cap-theme.svg" alt="InovAcadêmico Logo" className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">InovAcadêmico</h1>
              <div className="relative">
                <p className="text-rose-400 text-xs font-medium">Correção de bibliografias</p>
              </div>
            </div>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 relative inline-block">
              Central de Ajuda
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
            </h2>
            <p className="text-gray-400 mb-8 mt-4">
              Encontre respostas para as perguntas mais comuns sobre o uso do InovAcadêmico. Se você não encontrar o que procura, não hesite em nos contatar.
            </p>

            {/* Categorias de FAQ */}
            <div className="flex flex-wrap mb-8 border-b border-gray-700 gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-t-lg transition-colors ${
                    activeCategory === category.id
                      ? 'bg-gray-700 text-rose-400 font-medium'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/70 hover:text-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQs */}
            <div className="space-y-4">
              {faqs[activeCategory].map(faq => (
                <div 
                  key={faq.id} 
                  className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/30"
                >
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="flex justify-between items-center w-full p-4 text-left focus:outline-none"
                  >
                    <span className="font-medium text-white">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-rose-400 transition-transform duration-200 ${
                        expandedQuestions[faq.id] ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedQuestions[faq.id] && (
                    <div className="px-4 pb-4 pt-0 text-gray-300 border-t border-gray-700">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Call to action */}
            <div className="mt-10 p-5 bg-gradient-to-r from-rose-900/40 to-gray-800/40 rounded-lg border border-rose-900/30">
              <h3 className="text-xl font-medium text-white mb-2">Não encontrou o que procurava?</h3>
              <p className="text-gray-300 mb-4">
                Estamos aqui para ajudar. Entre em contato conosco e responderemos o mais rápido possível.
              </p>
              <Link href="/sobre#contato" className="inline-flex items-center px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition-colors shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contatar Suporte
              </Link>
            </div>
          </div>

          {/* Guias rápidos */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 relative inline-block">
              Guias Rápidos
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
            </h3>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="border border-gray-700 rounded-lg p-5 bg-gray-800/30 hover:bg-gray-700/40 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Como adicionar referências
                </h4>
                <p className="text-gray-300 mb-4">
                  Aprenda como adicionar referências manualmente através do nosso formulário detalhado.
                </p>
                <Link href="/referencias/adicionar" className="text-rose-400 hover:text-rose-300 inline-flex items-center transition-colors">
                  Ver guia
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="border border-gray-700 rounded-lg p-5 bg-gray-800/30 hover:bg-gray-700/40 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Como importar referências
                </h4>
                <p className="text-gray-300 mb-4">
                  Descubra como importar suas referências a partir de arquivos BibTeX, RIS ou JSON.
                </p>
                <Link href="/referencias/importar" className="text-rose-400 hover:text-rose-300 inline-flex items-center transition-colors">
                  Ver guia
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="border border-gray-700 rounded-lg p-5 bg-gray-800/30 hover:bg-gray-700/40 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Normas ABNT principais
                </h4>
                <p className="text-gray-300 mb-4">
                  Um resumo das principais normas ABNT para referências bibliográficas.
                </p>
                <a href="#" className="text-rose-400 hover:text-rose-300 inline-flex items-center transition-colors" onClick={(e) => {
                  e.preventDefault();
                  alert('Este guia estará disponível em breve!');
                }}>
                  Em breve
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              <div className="border border-gray-700 rounded-lg p-5 bg-gray-800/30 hover:bg-gray-700/40 transition-colors">
                <h4 className="text-lg font-medium text-white mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Comparativo de normas
                </h4>
                <p className="text-gray-300 mb-4">
                  Compare as diferenças entre os principais estilos: ABNT, APA, Vancouver e MLA.
                </p>
                <a href="#" className="text-rose-400 hover:text-rose-300 inline-flex items-center transition-colors" onClick={(e) => {
                  e.preventDefault();
                  alert('Este guia estará disponível em breve!');
                }}>
                  Em breve
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md py-6 text-center text-gray-400 mt-12 border-t border-rose-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          <div className="mt-3 text-sm flex justify-center space-x-6">
            <Link href="/termos-de-uso" className="hover:text-rose-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-rose-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/sobre" className="hover:text-rose-300 transition-colors">
              Sobre
            </Link>
            <Link href="/ajuda" className="text-rose-300 hover:text-rose-200 transition-colors">
              Ajuda
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 