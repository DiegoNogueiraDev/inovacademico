/**
 * File: inovacademico/frontend/src/pages/termos-de-uso.js
 * Página de Termos de Uso
 */
import Head from 'next/head';
import Link from 'next/link';

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>Termos de Uso - InovAcadêmico</title>
        <meta name="description" content="Termos de uso do InovAcadêmico, ferramenta para correção de bibliografias" />
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
        <div className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 p-8">
          <h2 className="text-3xl font-bold text-white mb-8 relative inline-block">
            Termos de Uso
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
          </h2>

          <div className="prose prose-invert prose-rose max-w-none">
            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">1. Aceitação dos Termos</h3>
            <p className="text-gray-300">
              Ao acessar e utilizar o InovAcadêmico, você concorda em cumprir e estar sujeito a estes Termos de Uso. Se você não concordar com algum aspecto destes termos, por favor, não utilize o serviço.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">2. Descrição do Serviço</h3>
            <p className="text-gray-300">
              O InovAcadêmico é uma ferramenta de auxílio à formatação de referências bibliográficas que utiliza inteligência artificial para corrigir e formatar citações de acordo com diferentes normas acadêmicas.
            </p>
            <p className="text-gray-300">
              Nosso serviço processa os dados fornecidos pelos usuários e utiliza modelos de IA para analisar e corrigir as referências conforme as regras específicas solicitadas.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">3. Uso do Serviço</h3>
            <p className="text-gray-300">
              O usuário concorda em utilizar o InovAcadêmico apenas para fins legais e de acordo com estes termos. O usuário não poderá:
            </p>
            <ul className="text-gray-300">
              <li>Utilizar o serviço para qualquer finalidade ilícita ou não autorizada;</li>
              <li>Interferir ou interromper a integridade ou o desempenho do serviço;</li>
              <li>Tentar obter acesso não autorizado ao serviço, contas de outros usuários ou sistemas computacionais;</li>
              <li>Utilizar o serviço para criar conteúdo que infrinja direitos autorais, marcas, patentes ou outros direitos de propriedade intelectual;</li>
              <li>Automatizar o acesso ao serviço sem autorização expressa;</li>
              <li>Realizar engenharia reversa ou tentar extrair o código-fonte do aplicativo.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">4. Limitações do Serviço</h3>
            <p className="text-gray-300">
              O InovAcadêmico utiliza tecnologia de inteligência artificial para processar e corrigir referências bibliográficas, porém:
            </p>
            <ul className="text-gray-300">
              <li>Não garantimos 100% de precisão nas correções fornecidas;</li>
              <li>É responsabilidade do usuário verificar e validar o resultado final antes de utilizá-lo em trabalhos acadêmicos;</li>
              <li>O serviço pode estar sujeito a interrupções ou limitações temporárias.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">5. Propriedade Intelectual</h3>
            <p className="text-gray-300">
              Todo o conteúdo presente no InovAcadêmico, incluindo código, design, logotipos, marcas, e outros elementos visuais, é de propriedade exclusiva do InovAcadêmico e está protegido por leis de propriedade intelectual.
            </p>
            <p className="text-gray-300">
              Você não está autorizado a copiar, modificar, distribuir, vender, alugar ou explorar comercialmente qualquer parte do serviço sem autorização expressa.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">6. Privacidade</h3>
            <p className="text-gray-300">
              Nossa Política de Privacidade descreve como coletamos, utilizamos e protegemos suas informações pessoais. Ao utilizar o InovAcadêmico, você concorda com nossas práticas de dados conforme descritas na Política de Privacidade.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">7. Alterações nos Termos</h3>
            <p className="text-gray-300">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor assim que forem publicadas nesta página. É responsabilidade do usuário verificar periodicamente estas condições.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">8. Isenção de Responsabilidade</h3>
            <p className="text-gray-300">
              O InovAcadêmico é fornecido "como está", sem garantias de qualquer tipo, expressas ou implícitas. Não nos responsabilizamos por quaisquer danos diretos, indiretos, incidentais ou consequenciais resultantes do uso do serviço.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">9. Lei Aplicável</h3>
            <p className="text-gray-300">
              Estes Termos de Uso serão regidos e interpretados de acordo com as leis brasileiras, independentemente dos princípios de conflitos de leis.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">10. Contato</h3>
            <p className="text-gray-300">
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através dos canais disponíveis em nossa página "Sobre".
            </p>

            <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md py-6 text-center text-gray-400 mt-12 border-t border-rose-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <p className="font-medium">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
          <div className="mt-3 text-sm flex justify-center space-x-6">
            <Link href="/termos-de-uso" className="text-rose-300 hover:text-rose-200 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="hover:text-rose-300 transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/sobre" className="hover:text-rose-300 transition-colors">
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