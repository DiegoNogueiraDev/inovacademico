/**
 * Componente de Modal de Ajuda para formatação de referências
 */
import { useState } from 'react';

const ModalAjuda = ({ show, setShow }) => {
  const [guiaAtiva, setGuiaAtiva] = useState('formatacoes');

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Cabeçalho do modal */}
        <div className="bg-gradient-to-r from-rose-800 to-gray-800 px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <h2 className="text-xl text-white font-bold">Ajuda para Formatação de Referências</h2>
          <button
            onClick={() => setShow(false)}
            className="text-gray-300 hover:text-white bg-black/30 hover:bg-black/50 rounded-full p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Abas de navegação */}
        <div className="bg-gray-900 px-6 py-2 flex border-b border-gray-700">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              guiaAtiva === 'formatacoes' ? 'bg-rose-700 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setGuiaAtiva('formatacoes')}
          >
            Como Formatar
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              guiaAtiva === 'tipos' ? 'bg-rose-700 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setGuiaAtiva('tipos')}
          >
            Tipos de Referência
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              guiaAtiva === 'exemplos' ? 'bg-rose-700 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
            onClick={() => setGuiaAtiva('exemplos')}
          >
            Exemplos
          </button>
        </div>

        {/* Conteúdo da ajuda */}
        <div className="p-6 overflow-y-auto text-gray-300">
          {guiaAtiva === 'formatacoes' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Como usar a barra de formatação</h3>
              
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600">
                <p className="mb-2">Para aplicar formatação ao texto em seus campos de referência:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Selecione o texto que deseja formatar em qualquer campo</li>
                  <li>Clique em um dos botões de formatação (negrito, itálico, etc.)</li>
                  <li>O texto selecionado será formatado com a opção escolhida</li>
                </ol>
              </div>
              
              <h4 className="text-md font-medium text-white mb-2">Formatações disponíveis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  <h5 className="font-medium text-rose-400 mb-1">Formatação Básica</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Negrito</strong> - Destaca palavras importantes</li>
                    <li><em>Itálico</em> - Para títulos de livros, revistas, etc.</li>
                    <li><u>Sublinhado</u> - Para destacar informações</li>
                  </ul>
                </div>
                
                <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-600">
                  <h5 className="font-medium text-rose-400 mb-1">Formatos Específicos</h5>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><em>Título em Itálico</em> - Para livros/periódicos</li>
                    <li>"Título entre Aspas" - Para artigos/capítulos</li>
                    <li>Formato ABNT - Aplica normas ABNT</li>
                    <li>Formato APA - Aplica normas APA</li>
                  </ul>
                </div>
              </div>
              
              <h4 className="text-md font-medium text-white mb-2">Dicas de uso</h4>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Use <strong>itálico</strong> para títulos de livros, revistas e periódicos</li>
                <li>Use "aspas" para títulos de artigos e capítulos de livros</li>
                <li>Nomes de autores geralmente são formatados com sobrenome em maiúsculas ou em negrito</li>
                <li>Ao usar o botão "Exemplo", um formato pré-preenchido será aplicado para demonstração</li>
              </ul>
            </div>
          )}

          {guiaAtiva === 'tipos' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Tipos de Referência e Campos Necessários</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Livro</h4>
                  <p className="mb-2">Campos obrigatórios:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Título</li>
                    <li>Autor(es)</li>
                    <li>Editora</li>
                    <li>Local de publicação</li>
                    <li>Ano</li>
                  </ul>
                  <p className="text-sm text-gray-400">Campos adicionais recomendados: Edição, ISBN, número de páginas</p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Artigo Científico</h4>
                  <p className="mb-2">Campos obrigatórios:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Título</li>
                    <li>Autor(es)</li>
                    <li>Revista/Periódico</li>
                    <li>Ano</li>
                  </ul>
                  <p className="text-sm text-gray-400">Campos adicionais recomendados: Volume, número, páginas, DOI, ISSN</p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Site/Página Web</h4>
                  <p className="mb-2">Campos obrigatórios:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Título</li>
                    <li>Autor(es) ou Instituição</li>
                    <li>URL</li>
                    <li>Data de acesso</li>
                  </ul>
                  <p className="text-sm text-gray-400">Campos adicionais: Ano de publicação ou atualização</p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Lei/Legislação</h4>
                  <p className="mb-2">Campos obrigatórios:</p>
                  <ul className="list-disc pl-5 mb-2">
                    <li>Número da Lei</li>
                    <li>Data de publicação</li>
                    <li>Publicado em (ex: Diário Oficial)</li>
                    <li>Título ou Ementa</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {guiaAtiva === 'exemplos' && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Exemplos de Formatação por Norma</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Formato ABNT</h4>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Livro:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    SOBRENOME, Nome. <strong><em>Título do livro</em></strong>: subtítulo. Edição. Local: Editora, Ano. Número de páginas.
                  </p>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Artigo:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    SOBRENOME, Nome. <strong>Título do artigo</strong>. <em>Nome da revista</em>, Local, v. X, n. Y, p. XX-YY, mês ano.
                  </p>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Site:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    SOBRENOME, Nome. <strong>Título da página</strong>. Ano. Disponível em: &lt;URL&gt;. Acesso em: dia mês. ano.
                  </p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Formato APA</h4>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Livro:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    Sobrenome, N. (Ano). <em>Título do livro</em>. Editora.
                  </p>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Artigo:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    Sobrenome, N. (Ano). Título do artigo. <em>Nome da revista, Volume</em>(Número), XX-YY. https://doi.org/xxxx
                  </p>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Site:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    Sobrenome, N. (Ano, Mês Dia). <em>Título da página</em>. Nome do site. URL
                  </p>
                </div>
                
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600">
                  <h4 className="text-md font-medium text-rose-400 mb-2">Formato Vancouver</h4>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Livro:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    Sobrenome N. <em>Título do livro</em>. Edição. Local: Editora; Ano.
                  </p>
                  
                  <h5 className="font-medium text-white mt-3 mb-1">Artigo:</h5>
                  <p className="bg-gray-800 p-3 rounded-md">
                    Sobrenome N. Título do artigo. <em>Nome da revista</em>. Ano;Volume(Número):Páginas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do modal */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={() => setShow(false)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAjuda; 