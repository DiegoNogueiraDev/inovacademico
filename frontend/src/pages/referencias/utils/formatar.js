/**
 * Utilitários para formatação de referências
 */

// Função auxiliar para formatar autores no padrão ABNT
export const formatarAutores = (autoresString) => {
  if (!autoresString) return '';
  
  // Dividir múltiplos autores separados por ponto e vírgula
  const autores = autoresString.split(';').map(autor => autor.trim());
  
  // Processar cada autor
  const autoresFormatados = autores.map(autor => {
    // Verificar se o autor já está no formato Sobrenome, Nome
    if (autor.includes(',')) {
      // Pegar a primeira parte (sobrenome) e transformar em maiúsculas
      const partes = autor.split(',');
      return `${partes[0].toUpperCase()}${partes.slice(1).join(',')}`;
    } else {
      // Tentar separar o nome quando há espaços
      const partes = autor.split(' ');
      if (partes.length > 1) {
        // Último elemento é o sobrenome
        const sobrenome = partes.pop();
        return `${sobrenome.toUpperCase()}, ${partes.join(' ')}`;
      }
      
      // Se não houver formato claro, retornar como está, mas em maiúsculas
      return autor.toUpperCase();
    }
  });
  
  return autoresFormatados.join('; ');
};

// Função para gerar o HTML formatado conforme a ABNT, baseado no tipo de referência
export const gerarHTMLFormatado = (formData, editarHTML, stateOverride = null, updateReactState = false, setFormData = null) => {
  // Usar o estado fornecido ou o estado atual
  const state = stateOverride || formData;
  
  // Verificar se já existe um HTML formatado e se estamos no modo de edição HTML
  if (state.htmlFormatado && editarHTML) {
    return state.htmlFormatado;
  }
  
  try {
    // Iniciar o HTML formatado com base no tipo de referência
    let html = '';
    
    // Processar diferentes tipos de referências
    switch (state.tipo) {
      case 'livro': {
        // Verificar se temos os campos essenciais
        if (!state.titulo || !state.autores) {
          return '';
        }
        
        // Formatar autores (transformar primeiro autor para Sobrenome, Nome)
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir a referência no formato ABNT
        html = `<p>${autoresFormatados}. <b>${state.titulo}</b>`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Adicionar edição, se houver
        if (state.edicao) {
          html += `. ${state.edicao}. ed.`;
        }
        
        // Adicionar local e editora, se houver
        if (state.local || state.editora) {
          html += '. ';
          if (state.local) html += `${state.local}: `;
          if (state.editora) html += state.editora;
        }
        
        // Adicionar ano
        if (state.ano) {
          html += `, ${state.ano}`;
        }
        
        // Adicionar página, se houver
        if (state.paginas) {
          html += `. ${state.paginas} p.`;
        }
        
        // Adicionar ISBN, se houver
        if (state.isbn) {
          html += ` ISBN: ${state.isbn}`;
        }
        
        // Adicionar DOI, se houver
        if (state.doi) {
          html += `. DOI: ${state.doi}`;
        }
        
        // Adicionar disponibilidade (URL), se houver
        if (state.url) {
          html += `. Disponível em: ${state.url}`;
          
          // Adicionar data de acesso para recursos online
          if (state.dataAcesso) {
            html += `. Acesso em: ${state.dataAcesso}`;
          }
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
      }
      
      case 'artigo': {
        // Verificar se temos os campos essenciais
        if (!state.titulo || !state.autores || !state.revista) {
          return '';
        }
        
        // Formatar autores
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir a referência no formato ABNT
        html = `<p>${autoresFormatados}. ${state.titulo}`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Adicionar revista (em negrito)
        html += `. <b>${state.revista}</b>`;
        
        // Adicionar local, se houver
        if (state.local) {
          html += `, ${state.local}`;
        }
        
        // Adicionar volume, número e páginas
        if (state.volume || state.numero || state.paginas || state.mes || state.ano) {
          html += ', ';
          
          // Volume
          if (state.volume) {
            html += `v. ${state.volume}`;
          }
          
          // Número
          if (state.numero) {
            html += `, n. ${state.numero}`;
          }
          
          // Fascículo
          if (state.fasciculo) {
            html += `, fasc. ${state.fasciculo}`;
          }
          
          // Páginas (ou página inicial e final)
          if (state.paginas) {
            html += `, p. ${state.paginas}`;
          } else if (state.paginaInicial && state.paginaFinal) {
            html += `, p. ${state.paginaInicial}-${state.paginaFinal}`;
          }
          
          // Mês
          if (state.mes) {
            html += `, ${state.mes.toLowerCase()}`;
          }
          
          // Ano
          if (state.ano) {
            html += `, ${state.ano}`;
          }
        }
        
        // Adicionar DOI, se houver
        if (state.doi) {
          html += `. DOI: ${state.doi}`;
        }
        
        // Adicionar URL, se houver
        if (state.url) {
          html += `. Disponível em: ${state.url}`;
          
          // Adicionar data de acesso
          if (state.dataAcesso) {
            html += `. Acesso em: ${state.dataAcesso}`;
          }
        }
        
        // Adicionar notas adicionais, se houver
        if (state.notaAdicional) {
          html += `. ${state.notaAdicional}`;
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
      }
      
      case 'site': {
        // Verificar campos essenciais
        if (!state.titulo || !state.autores) {
          return '';
        }
        
        // Formatar autores
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir a referência
        html = `<p>${autoresFormatados}. <b>${state.titulo}</b>`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Adicionar ano
        if (state.ano) {
          html += `. ${state.ano}`;
        }
        
        // Adicionar URL
        if (state.url) {
          html += `. Disponível em: ${state.url}`;
        }
        
        // Adicionar data de acesso
        if (state.dataAcesso) {
          html += `. Acesso em: ${state.dataAcesso}`;
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
      }
      
      case 'conferencia': {
        // Verificar campos essenciais
        if (!state.titulo || !state.autores || !state.evento) {
          return '';
        }
        
        // Formatar autores
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir a referência
        html = `<p>${autoresFormatados}. ${state.titulo}`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Adicionar informações do evento
        html += `. In: <b>${state.evento}</b>`;
        
        // Adicionar número da edição, se houver
        if (state.edicao) {
          html += `, ${state.edicao}`;
        }
        
        // Adicionar ano
        if (state.ano) {
          html += `, ${state.ano}`;
        }
        
        // Adicionar local
        if (state.local) {
          html += `, ${state.local}`;
        }
        
        // Adicionar detalhes da publicação
        html += '. Anais [...]';
        
        // Adicionar local e editora, se houver
        if (state.local || state.editora) {
          html += '. ';
          if (state.local) html += `${state.local}: `;
          if (state.editora) html += state.editora;
        }
        
        // Adicionar ano novamente para a publicação
        if (state.ano) {
          html += `, ${state.ano}`;
        }
        
        // Adicionar páginas
        if (state.paginas) {
          html += `. p. ${state.paginas}`;
        } else if (state.paginaInicial && state.paginaFinal) {
          html += `. p. ${state.paginaInicial}-${state.paginaFinal}`;
        }
        
        // Adicionar DOI, se houver
        if (state.doi) {
          html += `. DOI: ${state.doi}`;
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
      }
      
      case 'dissertacao':
      case 'tese': {
        // Verificar campos essenciais
        if (!state.titulo || !state.autores || !state.ano || !state.instituicao) {
          return '';
        }
        
        // Formatar autores
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir a referência
        html = `<p>${autoresFormatados}. <b>${state.titulo}</b>`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Ano
        if (state.ano) {
          html += `. ${state.ano}`;
        }
        
        // Número de páginas
        if (state.paginas) {
          html += `. ${state.paginas} f.`;
        }
        
        // Tipo de trabalho e programa
        const tipoTrabalho = state.tipoTrabalho || (state.tipo === 'tese' ? 'Tese (Doutorado)' : 'Dissertação (Mestrado)');
        html += ` ${tipoTrabalho}`;
        
        if (state.programa) {
          html += ` - ${state.programa}`;
        }
        
        // Instituição
        if (state.instituicao) {
          html += `, ${state.instituicao}`;
        }
        
        // Local
        if (state.local) {
          html += `, ${state.local}`;
        }
        
        // Ano novamente para a instituição
        if (state.ano) {
          html += `, ${state.ano}`;
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
      }
      
      // Adicione mais casos para outros tipos de referência conforme necessário
      
      default:
        // Formato genérico para tipos não especificados
        if (!state.titulo || !state.autores) {
          return '';
        }
        
        // Formatar autores
        const autoresFormatados = formatarAutores(state.autores);
        
        // Construir uma referência genérica
        html = `<p>${autoresFormatados}. <b>${state.titulo}</b>`;
        
        // Adicionar subtítulo, se houver
        if (state.subtitulo) {
          html += `: ${state.subtitulo}`;
        }
        
        // Adicionar local e editora, se houver
        if (state.local || state.editora) {
          html += '. ';
          if (state.local) html += `${state.local}: `;
          if (state.editora) html += state.editora;
        }
        
        // Adicionar ano
        if (state.ano) {
          html += `, ${state.ano}`;
        }
        
        // Fechar o parágrafo
        html += '.</p>';
        break;
    }
    
    // Se precisar atualizar o estado diretamente
    if (updateReactState && setFormData) {
      setFormData(prevState => ({
        ...prevState,
        htmlFormatado: html
      }));
    }
    
    return html;
  } catch (error) {
    console.error('Erro ao gerar HTML formatado:', error);
    return '<p>Erro ao gerar o formato HTML. Verifique os campos preenchidos.</p>';
  }
}; 