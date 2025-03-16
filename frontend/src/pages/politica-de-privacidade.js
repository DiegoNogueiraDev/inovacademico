/**
 * File: inovacademico/frontend/src/pages/politica-de-privacidade.js
 * Página de Política de Privacidade
 */
import Head from 'next/head';
import Link from 'next/link';

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900">
      <Head>
        <title>Política de Privacidade - InovAcadêmico</title>
        <meta name="description" content="Política de Privacidade do InovAcadêmico, ferramenta para correção de bibliografias" />
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
            Política de Privacidade
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-orange-500 to-transparent rounded-full"></div>
          </h2>

          <div className="prose prose-invert prose-rose max-w-none">
            <p className="lead text-gray-300">
              Esta Política de Privacidade descreve como suas informações pessoais são coletadas, usadas e compartilhadas quando você utiliza o InovAcadêmico.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">1. Informações que Coletamos</h3>
            <p className="text-gray-300">
              Quando você utiliza o InovAcadêmico, coletamos automaticamente certas informações sobre seu dispositivo, incluindo informações sobre seu navegador web, endereço IP, fuso horário e alguns dos cookies instalados em seu dispositivo.
            </p>
            <p className="text-gray-300">
              Além disso, coletamos dados sobre as referências bibliográficas que você submete para correção. Estes dados são armazenados para melhorar nosso serviço e oferecer estatísticas sobre o uso da plataforma.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">2. Como Usamos Suas Informações</h3>
            <p className="text-gray-300">
              Utilizamos as informações que coletamos para:
            </p>
            <ul className="text-gray-300">
              <li>Fornecer, operar e manter nossos serviços;</li>
              <li>Melhorar, personalizar e expandir nossos serviços;</li>
              <li>Compreender e analisar como você utiliza nossos serviços;</li>
              <li>Desenvolver novos produtos, serviços e funcionalidades;</li>
              <li>Processar suas transações;</li>
              <li>Prevenir e resolver problemas técnicos ou de segurança;</li>
              <li>Responder às suas solicitações, comentários e perguntas.</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">3. Compartilhamento de Dados</h3>
            <p className="text-gray-300">
              Não compartilhamos seus dados pessoais com terceiros, exceto:
            </p>
            <ul className="text-gray-300">
              <li>Quando necessário para cumprir leis e regulamentações aplicáveis;</li>
              <li>Para proteger os direitos, a privacidade, a segurança ou a propriedade nossa ou de terceiros;</li>
              <li>Para responder a requisições legais de autoridades públicas, incluindo para atender requisitos de segurança nacional ou de aplicação da lei;</li>
              <li>Com nossos fornecedores de serviços que precisam processar seus dados para fornecer funcionalidades do serviço (como hospedagem, análise de dados e serviços de IA).</li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">4. Segurança de Dados</h3>
            <p className="text-gray-300">
              Implementamos medidas de segurança para proteger suas informações pessoais. Utilizamos métodos padrão da indústria para proteger seus dados, mas nenhum método de transmissão pela Internet ou de armazenamento eletrônico é 100% seguro.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">5. Retenção de Dados</h3>
            <p className="text-gray-300">
              Mantemos seus dados pelo tempo necessário para fornecer os serviços solicitados, cumprir nossas obrigações legais, resolver disputas e fazer cumprir nossos acordos.
            </p>
            <p className="text-gray-300">
              As referências bibliográficas submetidas para correção são armazenadas para melhorar nosso serviço, mas você pode solicitar a exclusão a qualquer momento.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">6. Seus Direitos</h3>
            <p className="text-gray-300">
              Se você é residente no Brasil, você tem direitos em relação aos seus dados pessoais, incluindo:
            </p>
            <ul className="text-gray-300">
              <li>Direito de acesso aos seus dados pessoais;</li>
              <li>Direito de retificação de dados incompletos, inexatos ou desatualizados;</li>
              <li>Direito de eliminação dos dados pessoais;</li>
              <li>Direito de portabilidade dos dados;</li>
              <li>Direito de informação sobre compartilhamento de seus dados;</li>
              <li>Direito de revogar o consentimento.</li>
            </ul>
            <p className="text-gray-300">
              Para exercer esses direitos, entre em contato conosco através dos canais disponíveis em nossa página "Sobre".
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">7. Uso de Cookies</h3>
            <p className="text-gray-300">
              Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, personalizar conteúdo e ofertas, e analisar como nossos sites são utilizados. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">8. Uso por Menores</h3>
            <p className="text-gray-300">
              Nossos serviços não se destinam a pessoas com menos de 13 anos. Não coletamos intencionalmente informações pessoais de crianças com menos de 13 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança com menos de 13 anos, tomaremos medidas para remover essas informações.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">9. Alterações nesta Política</h3>
            <p className="text-gray-300">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando a nova Política de Privacidade nesta página. Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.
            </p>

            <h3 className="text-xl font-bold text-white mb-4 relative inline-block">10. Contato</h3>
            <p className="text-gray-300">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco através dos canais disponíveis em nossa página "Sobre".
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
            <Link href="/termos-de-uso" className="hover:text-rose-300 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/politica-de-privacidade" className="text-rose-300 hover:text-rose-200 transition-colors">
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