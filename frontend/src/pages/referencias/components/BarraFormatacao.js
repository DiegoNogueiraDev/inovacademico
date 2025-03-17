/**
 * Componente de barra de formatação para edição de referências bibliográficas
 */
import { useState, useEffect } from 'react';

const BarraFormatacao = ({ onHelp, formRef }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeField, setActiveField] = useState('titulo');

  // Detectar campo ativo
  useEffect(() => {
    const handleFocus = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        const name = e.target.getAttribute('name');
        if (name) {
          setActiveField(name);
        }
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => {
      document.removeEventListener('focusin', handleFocus);
    };
  }, []);

  // Função para aplicar formatação ao texto selecionado
  const aplicarFormatacao = (tag) => {
    if (!formRef || !formRef.applyFormatting) {
      console.error('Referência do formulário não disponível');
      return;
    }

    const success = formRef.applyFormatting(tag, activeField);
    if (!success) {
      alert('Selecione um texto para formatar');
    }
    
    // Fechar dropdown após aplicar
    setShowDropdown(false);
  };

  // Funções para criar exemplos formatados
  const mostrarExemploLivro = () => {
    if (!formRef || !formRef.applyExample) {
      // Implementação alternativa
      try {
        // Localiza o campo título e autor
        const tituloField = document.querySelector('input[name="titulo"]');
        const autorField = document.querySelector('input[name="autores"]');
        
        if (tituloField) {
          tituloField.value = '<em>Título do Livro: um estudo abrangente</em>';
          // Disparar evento para atualizar o React state
          const event = new Event('input', { bubbles: true });
          tituloField.dispatchEvent(event);
        }
        
        if (autorField) {
          autorField.value = '<b>SOBRENOME</b>, Nome do Autor';
          // Disparar evento para atualizar o React state
          const event = new Event('input', { bubbles: true });
          autorField.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Erro ao mostrar exemplo de livro:', error);
      }
    } else {
      formRef.applyExample('livro');
    }
  };

  const mostrarExemploArtigo = () => {
    if (!formRef || !formRef.applyExample) {
      // Implementação alternativa
      try {
        // Localiza os campos relevantes para artigo
        const tituloField = document.querySelector('input[name="titulo"]');
        const autorField = document.querySelector('input[name="autores"]');
        const revistaField = document.querySelector('input[name="nomePeriodico"]');
        
        if (tituloField) {
          tituloField.value = '"Título do Artigo: uma análise científica"';
          // Disparar evento para atualizar o React state
          const event = new Event('input', { bubbles: true });
          tituloField.dispatchEvent(event);
        }
        
        if (autorField) {
          autorField.value = '<b>SOBRENOME</b>, Nome do Autor';
          // Disparar evento para atualizar o React state
          const event = new Event('input', { bubbles: true });
          autorField.dispatchEvent(event);
        }
        
        if (revistaField) {
          revistaField.value = '<em>Nome da Revista Científica</em>';
          // Disparar evento para atualizar o React state
          const event = new Event('input', { bubbles: true });
          revistaField.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Erro ao mostrar exemplo de artigo:', error);
      }
    } else {
      formRef.applyExample('artigo');
    }
  };

  // Formatações específicas
  const formatarABNT = (texto) => {
    // Exemplo simples de formatação ABNT
    return `<b>SOBRENOME</b>, Nome. <em>${texto}</em>. Local: Editora, Ano.`;
  };

  const formatarAPA = (texto) => {
    // Exemplo simples de formatação APA
    return `Sobrenome, N. (Ano). <em>${texto}</em>. Editora.`;
  };

  const formatarVancouver = (texto) => {
    // Exemplo simples de formatação Vancouver
    return `Sobrenome N. <em>${texto}</em>. Local: Editora; Ano.`;
  };

  return (
    <div className="bg-gray-700/40 border border-gray-600 rounded-lg p-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Formatações básicas */}
        <div className="flex gap-1">
          <button
            onClick={() => aplicarFormatacao('b')}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Negrito"
            type="button"
          >
            {/* Ícone de Negrito (B) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5" viewBox="0 0 16 16">
              <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449z"/>
            </svg>
          </button>
          
          <button
            onClick={() => aplicarFormatacao('em')}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Itálico"
            type="button"
          >
            {/* Ícone de Itálico (I) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5" viewBox="0 0 16 16">
              <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z"/>
            </svg>
          </button>
          
          <button
            onClick={() => aplicarFormatacao('u')}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Sublinhado"
            type="button"
          >
            {/* Ícone de Sublinhado (U) */}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="h-5 w-5" viewBox="0 0 16 16">
              <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9z"/>
            </svg>
          </button>
        </div>
        
        <div className="h-6 w-px bg-gray-600 mx-1"></div>
          
        {/* Formatos específicos - Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            type="button"
          >
            <span>Formatos Específicos</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showDropdown && (
            <div className="absolute z-10 mt-1 w-56 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
              <div className="p-1">
            <button
                  onClick={() => aplicarFormatacao('em-title')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Título em Itálico</span>
            </button>
            
            <button
                  onClick={() => aplicarFormatacao('quote')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Título entre Aspas</span>
            </button>
            
            <button
                  onClick={() => aplicarFormatacao('sup')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Sobrescrito</span>
            </button>
            
            <button
                  onClick={() => aplicarFormatacao('sub')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Subscrito</span>
            </button>
                
                <div className="border-t border-gray-600 my-1"></div>
        
            <button
                  onClick={() => aplicarFormatacao('abnt')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Formato ABNT</span>
            </button>
            
            <button
                  onClick={() => aplicarFormatacao('apa')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
              type="button"
            >
                  <span>Formato APA</span>
            </button>
            
            <button
                  onClick={() => aplicarFormatacao('vancouver')}
                  className="flex w-full items-center px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-700 rounded-md transition-colors"
                  type="button"
                >
                  <span>Formato Vancouver</span>
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-gray-600 mx-1"></div>
        
        {/* Exemplos */}
        <button
          onClick={mostrarExemploLivro}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
          title="Exemplo de formatação para livro"
              type="button"
            >
          Exemplo: Livro
            </button>
            
            <button
          onClick={mostrarExemploArtigo}
          className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors text-sm"
          title="Exemplo de formatação para artigo"
              type="button"
            >
          Exemplo: Artigo
            </button>
        
        <div className="h-6 w-px bg-gray-600 mx-1"></div>
        
        {/* Ajuda */}
          <button
          onClick={onHelp}
          className="p-2 rounded-md bg-rose-800 hover:bg-rose-700 transition-colors flex items-center gap-1 text-sm"
            type="button"
          >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Ajuda</span>
          </button>
        </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Selecione o texto em qualquer campo e aplique a formatação desejada. Use <strong>Itálico</strong> para títulos de livros e <strong>Aspas</strong> para artigos.
      </div>
      <div className="mt-1 text-xs text-gray-400">
        <strong>Campo ativo:</strong> {activeField} - Selecione texto neste campo para formatá-lo
      </div>
    </div>
  );
};

export default BarraFormatacao; 