/**
 * Componente para renderizar campos específicos por tipo de referência
 */
const ReferenceTypeFields = ({ formData, handleChange }) => {
  switch (formData.tipo) {
    case 'livro':
      return (
        <>
          <div className="mb-4">
            <label htmlFor="editora" className="block text-gray-300 mb-1 font-medium">Editora*</label>
            <input
              type="text"
              id="editora"
              name="editora"
              value={formData.editora}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="local" className="block text-gray-300 mb-1 font-medium">Local de Publicação*</label>
              <input
                type="text"
                id="local"
                name="local"
                value={formData.local}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="edicao" className="block text-gray-300 mb-1 font-medium">Edição</label>
              <input
                type="text"
                id="edicao"
                name="edicao"
                value={formData.edicao}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="isbn" className="block text-gray-300 mb-1 font-medium">ISBN</label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Ex: 978-3-16-148410-0"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paginas" className="block text-gray-300 mb-1 font-medium">Número de Páginas</label>
              <input
                type="text"
                id="paginas"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                placeholder="Ex: 350"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
        </>
      );
    
    case 'artigo':
      return (
        <>
          <div className="mb-4">
            <label htmlFor="revista" className="block text-gray-300 mb-1 font-medium">Revista/Periódico*</label>
            <input
              type="text"
              id="revista"
              name="revista"
              value={formData.revista}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label htmlFor="volume" className="block text-gray-300 mb-1 font-medium">Volume</label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="numero" className="block text-gray-300 mb-1 font-medium">Número</label>
              <input
                type="text"
                id="numero"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paginas" className="block text-gray-300 mb-1 font-medium">Páginas</label>
              <input
                type="text"
                id="paginas"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                placeholder="Ex: 45-67"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="doi" className="block text-gray-300 mb-1 font-medium">DOI</label>
              <input
                type="text"
                id="doi"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="Ex: 10.1000/xyz123"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="issn" className="block text-gray-300 mb-1 font-medium">ISSN</label>
              <input
                type="text"
                id="issn"
                name="issn"
                value={formData.issn}
                onChange={handleChange}
                placeholder="Ex: 2049-3630"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
        </>
      );
      
    case 'revista':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Nome do Periódico</label>
              <input
                type="text"
                name="nomePeriodico"
                onChange={handleChange}
                value={formData.nomePeriodico || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Revista Brasileira de Ciências"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Volume</label>
              <input
                type="text"
                name="volume"
                onChange={handleChange}
                value={formData.volume || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Vol. 12"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Número/Edição</label>
              <input
                type="text"
                name="numero"
                onChange={handleChange}
                value={formData.numero || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Número 3"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Páginas</label>
              <input
                type="text"
                name="paginas"
                onChange={handleChange}
                value={formData.paginas || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: 45-67"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">ISSN</label>
              <input
                type="text"
                name="issn"
                onChange={handleChange}
                value={formData.issn || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: 1234-5678"
              />
            </div>
          </div>
        </>
      );
      
    case 'site':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">URL</label>
              <input
                type="url"
                name="url"
                onChange={handleChange}
                value={formData.url || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="https://exemplo.com/pagina"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Data de Acesso</label>
              <input
                type="date"
                name="dataAcesso"
                onChange={handleChange}
                value={formData.dataAcesso || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Instituição/Organização</label>
              <input
                type="text"
                name="instituicao"
                onChange={handleChange}
                value={formData.instituicao || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Universidade Federal do Brasil"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Páginas</label>
              <input
                type="text"
                name="paginas"
                onChange={handleChange}
                value={formData.paginas || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: pp. 45-67 (se aplicável)"
              />
            </div>
          </div>
        </>
      );
      
    case 'conferencia':
      return (
        <>
          <div className="mb-4">
            <label htmlFor="evento" className="block text-gray-300 mb-1 font-medium">Nome do Evento*</label>
            <input
              type="text"
              id="evento"
              name="evento"
              value={formData.evento}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="local" className="block text-gray-300 mb-1 font-medium">Local*</label>
              <input
                type="text"
                id="local"
                name="local"
                value={formData.local}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paginas" className="block text-gray-300 mb-1 font-medium">Páginas</label>
              <input
                type="text"
                id="paginas"
                name="paginas"
                value={formData.paginas}
                onChange={handleChange}
                placeholder="Ex: 45-67"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="doi" className="block text-gray-300 mb-1 font-medium">DOI</label>
            <input
              type="text"
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              placeholder="Ex: 10.1000/xyz123"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
            />
          </div>
        </>
      );

    case 'lei':
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Número da Lei</label>
              <input
                type="text"
                name="numeroLei"
                onChange={handleChange}
                value={formData.numeroLei || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Lei nº 12.345"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Data de Publicação</label>
              <input
                type="date"
                name="dataPublicacao"
                onChange={handleChange}
                value={formData.dataPublicacao || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Publicado em</label>
              <input
                type="text"
                name="publicadoEm"
                onChange={handleChange}
                value={formData.publicadoEm || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Diário Oficial da União"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Seção/Páginas</label>
              <input
                type="text"
                name="paginas"
                onChange={handleChange}
                value={formData.paginas || ''}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                placeholder="Ex: Seção 1, p. 123-124"
              />
            </div>
          </div>
        </>
      );

    case 'dissertacao':
      return (
        <>
          <div className="mb-4">
            <label htmlFor="universidade" className="block text-gray-300 mb-1 font-medium">Universidade/Instituição*</label>
            <input
              type="text"
              id="universidade"
              name="universidade"
              value={formData.universidade}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="local" className="block text-gray-300 mb-1 font-medium">Local*</label>
              <input
                type="text"
                id="local"
                name="local"
                value={formData.local}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="paginasTotais" className="block text-gray-300 mb-1 font-medium">Número de Páginas</label>
              <input
                type="text"
                id="paginasTotais"
                name="paginasTotais"
                value={formData.paginasTotais}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="curso" className="block text-gray-300 mb-1 font-medium">Programa/Curso</label>
            <input
              type="text"
              id="curso"
              name="curso"
              value={formData.curso}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white"
            />
          </div>
        </>
      );
      
    default:
      return null;
  }
};

export default ReferenceTypeFields; 