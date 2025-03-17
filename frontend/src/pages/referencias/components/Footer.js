/**
 * Componente de rodapé para as páginas de referências
 */
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md py-4 sm:py-6 text-center text-gray-400 mt-8 sm:mt-12 border-t border-rose-900/30 relative z-10">
      <div className="container mx-auto px-4">
        <p className="font-medium text-sm sm:text-base">© {new Date().getFullYear()} InovAcadêmico - Tecnologia para pesquisa acadêmica</p>
        <div className="mt-2 sm:mt-3 text-xs sm:text-sm flex flex-wrap justify-center gap-3 sm:gap-6">
          <Link href="/termos-de-uso" className="hover:text-rose-300 transition-colors">
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
  );
};

export default Footer; 