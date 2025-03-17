/**
 * Componente de cabeçalho para as páginas de referências
 */
import Link from 'next/link';

const Header = () => {
  return (
    <header className="relative z-10 bg-gradient-to-r from-rose-900/80 to-gray-900/80 backdrop-blur-md shadow-lg border-b border-rose-900/30">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mr-2 sm:mr-3">
            <img src="/graduation-cap-theme.svg" alt="InovAcadêmico Logo" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">InovAcadêmico</h1>
            <div className="relative">
              <p className="text-rose-400 text-xs font-medium">Correção de bibliografias</p>
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header; 