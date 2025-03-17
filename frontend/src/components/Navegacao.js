import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const Navegacao = () => {
  const router = useRouter();

  const isActive = (path) => {
    return router.pathname === path ? 'font-bold text-blue-600' : 'text-gray-600 hover:text-blue-500';
  };

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1 md:space-x-4">
            <Link href="/" className={`text-sm md:text-base ${isActive('/')}`}>
              Início
            </Link>
            <Link href="/correcao" className={`text-sm md:text-base ${isActive('/correcao')}`}>
              Correção
            </Link>
            <Link href="/biblioteca" className={`text-sm md:text-base ${isActive('/biblioteca')}`}>
              Biblioteca
            </Link>
            <Link href="/referencias" className={`text-sm md:text-base ${isActive('/referencias')}`}>
              Referências
            </Link>
          </div>
          <div>
            <Link href="/perfil" className={`text-sm md:text-base ${isActive('/perfil')}`}>
              Meu Perfil
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navegacao; 