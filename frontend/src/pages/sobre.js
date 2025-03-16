/**
 * File: inovacademico/frontend/src/pages/sobre.js
 * Página Sobre o projeto
 */
import Head from 'next/head';
import Link from 'next/link';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>Sobre - InovAcadêmico</title>
        <meta name="description" content="Sobre o InovAcadêmico, ferramenta inteligente para correção de bibliografias acadêmicas" />
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
            <h2 className="text-3xl font-bold text-white mb-8 relative inline-block">
              Sobre o InovAcadêmico
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
            </h2>

            <div className="prose prose-invert prose-rose max-w-none">
              <p className="lead text-gray-300">
                O InovAcadêmico é uma ferramenta inovadora de inteligência artificial projetada para auxiliar estudantes, pesquisadores e acadêmicos na formatação precisa de referências bibliográficas.
              </p>
              <br />  

              <h3 className="text-xl font-bold text-white mb-4 relative inline-block">Nossa Missão</h3>
              <p className="text-gray-300">
                Simplificar e otimizar o processo de formatação bibliográfica, permitindo que acadêmicos foquem no que realmente importa: a pesquisa e o conteúdo. Acreditamos que a tecnologia deve servir como um facilitador do trabalho acadêmico, reduzindo tarefas repetitivas e propensas a erros.
              </p>
              <br />
              <h3 className="text-xl font-bold text-white mb-4 relative inline-block">Como Funciona</h3>
              <p className="text-gray-300">
                O InovAcadêmico utiliza modelos avançados de processamento de linguagem natural para analisar suas referências bibliográficas, identificar elementos estruturais e reformatá-los de acordo com as normas acadêmicas específicas (ABNT, APA, Vancouver e MLA).
              </p>

              <p className="text-gray-300">O processo envolve várias etapas:</p>
              <ol className="text-gray-300">
                <li>Análise do texto da referência fornecida</li>
                <li>Identificação dos elementos bibliográficos (autores, título, ano, etc.)</li>
                <li>Detecção de possíveis erros ou informações faltantes</li>
                <li>Reformatação segundo a norma selecionada</li>
                <li>Apresentação do resultado formatado com destaque para as alterações</li>
              </ol>
              <br />

              <h3 className="text-xl font-bold text-white mb-4 relative inline-block">Tecnologias Utilizadas</h3>
              <p className="text-gray-300">
                Nossa plataforma é construída com tecnologias modernas para garantir desempenho, segurança e uma experiência de usuário excepcional:
              </p>
              <ul className="text-gray-300">
                <li>Modelos de IA para processamento de texto e correção bibliográfica</li>
                <li>Frontend desenvolvido com Next.js e React</li>
                <li>Design responsivo com Tailwind CSS</li>
                <li>Backend em Node.js com Express</li>
                <li>Banco de dados MongoDB para armazenamento eficiente</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-bold text-white mb-4 relative inline-block">
                Equipe
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-transparent rounded-full"></div>
              </h3>

              <div className="prose prose-invert prose-rose max-w-none">
                <p className="text-gray-300">
                  O InovAcadêmico foi desenvolvido por uma equipe dedicada de profissionais apaixonados por tecnologia e educação:
                </p>

                <div className="mt-6 space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                      DN
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Diego Nogueira</h4>
                      <p className="text-gray-400 text-sm">Fundador & Desenvolvedor Principal</p>
                      <p className="text-gray-300 text-sm mt-1">
                        Especialista em IA e desenvolvimento fullstack com foco em aplicações acadêmicas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8">
              <h3 className="text-xl font-bold text-white mb-4 relative inline-block">
                Contato
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-500 to-transparent rounded-full"></div>
              </h3>

              <div className="prose prose-invert prose-rose max-w-none">
                <p className="text-gray-300">
                  Estamos sempre abertos a feedback, sugestões e dúvidas sobre o InovAcadêmico. Não hesite em entrar em contato conosco:
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href="mailto:devnogueiradiego@gmail.com" className="text-gray-300 hover:text-rose-300 transition-colors">
                      devnogueiradiego@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                    <a href="https://twitter.com/devnogueira_" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rose-300 transition-colors">
                      @devnogueira_
                    </a>
                  </div>

                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <a href="https://github.com/diegonogueiradev" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-rose-300 transition-colors">
                      github.com/inovacademico
                    </a>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">
                    Sugestões e relatos de problemas também podem ser enviados diretamente pelo botão de feedback presente na página de resultados após realizar uma correção.
                  </p>
                </div>
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
            <Link href="/sobre" className="text-rose-300 hover:text-rose-200 transition-colors">
              Sobre
            </Link>
            <Link href="/ajuda" className="hover:text-rose-300 transition-colors">
              Ajuda
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 