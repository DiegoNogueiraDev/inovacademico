/**
 * Componente para exibir o banner informativo no topo da página
 */
const InfoBanner = ({ title, description }) => {  
  return (
    <div className="relative bg-gradient-to-r from-rose-900/80 via-gray-800/90 to-gray-900/80 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-start sm:items-center mb-3 sm:mb-0 pr-8 sm:pr-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-300 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            {title && <h2 className="font-bold text-rose-200 mb-0.5">{title}</h2>}
            <p className="text-xs sm:text-sm">
              {description || "Você pode usar o chatGPT ou outra, mas nenhuma é 100% precisa, por isso estamos convidando você a ajudar a gente a melhorar cada vez mais. Cadastre suas referências em nossa plataforma e usaremos elas como base para aprimorar o nosso modelo."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner; 