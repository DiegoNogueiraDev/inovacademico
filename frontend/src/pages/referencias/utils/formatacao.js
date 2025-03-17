/**
 * Funções de formatação de texto para referências
 */

// Função que aplica a formatação ao texto selecionado
export const aplicarFormatacao = (tipoFormatacao, campoEspecifico = null, textoPersonalizado = null, ultimoCampoUsado, setUltimoCampoUsado, setMessage, formData, setFormData, gerarHTMLFormatado) => {
  try {
    // Lista de campos comuns que podem receber formatação
    const camposFormatacao = [
      'titulo', 'subtitulo', 'autores', 'revista', 'editora', 
      'notaAdicional', 'evento', 'instituicao', 'tipoTrabalho',
      'local', 'ementa', 'htmlFormatado'
    ];
    
    // Verifica se o tipo de formatação é combinado (contém +)
    const tiposFormatacao = tipoFormatacao.split('+');
    
    // Elemento de texto que receberá a formatação
    let elementoTexto = null;
    
    // Se um campo específico foi fornecido, tenta encontrá-lo
    if (campoEspecifico) {
      // Busca pelo ID do campo
      elementoTexto = document.getElementById(campoEspecifico);
      
      // Se não encontrou pelo ID, busca por outros seletores
      if (!elementoTexto) {
        elementoTexto = document.querySelector(`[name="${campoEspecifico}"], [data-field="${campoEspecifico}"]`);
      }
      
      // Se encontrou o elemento, foca nele
      if (elementoTexto) {
        elementoTexto.focus();
      } else {
        setMessage({type: 'info', text: `Campo ${campoEspecifico} não encontrado. Selecione um campo manualmente.`});
        return;
      }
    }
    // Caso contrário, usa o elemento atualmente em foco
    else {
      // Verifica se o elemento atualmente em foco é um campo de texto
      if (document.activeElement && 
          (document.activeElement.tagName === 'TEXTAREA' || 
           document.activeElement.tagName === 'INPUT')) {
        elementoTexto = document.activeElement;
      } 
      // Se não houver um campo de texto em foco, tenta encontrar um campo visível
      else {
        // Primeiro tenta encontrar o último campo usado
        elementoTexto = ultimoCampoUsado;
        
        // Se não encontrou ou não está visível, tenta encontrar um campo visível
        if (!elementoTexto || !elementoTexto.offsetParent) {
          // Busca por qualquer campo de texto visível
          for (const campo of camposFormatacao) {
            const elemento = document.getElementById(campo) || 
                            document.querySelector(`[name="${campo}"], [data-field="${campo}"]`);
            
            if (elemento && elemento.offsetParent) {
              elementoTexto = elemento;
              break;
            }
          }
          
          // Se ainda não encontrou, usa o campo de título como último recurso
          if (!elementoTexto) {
            elementoTexto = document.getElementById('titulo');
          }
        }
        
        // Se encontrou um elemento, foca nele
        if (elementoTexto) {
          elementoTexto.focus();
        } else {
          // Se mesmo assim não encontrou nenhum campo, exibe mensagem de erro
          setMessage({type: 'error', text: 'Selecione um campo de texto antes de aplicar a formatação.'});
          return;
        }
      }
    }
    
    // Salva referência ao último campo usado
    setUltimoCampoUsado(elementoTexto);
    
    // Obtém os valores de início e fim da seleção
    const inicio = elementoTexto.selectionStart;
    const fim = elementoTexto.selectionEnd;
    
    // Se não há texto selecionado e não foi fornecido um texto personalizado, exibe uma mensagem
    if (inicio === fim && !textoPersonalizado) {
      const campoNome = elementoTexto.id || elementoTexto.name || 'atual';
      setMessage({
        type: 'info', 
        text: `Selecione o texto que deseja formatar no campo ${campoNome} (clique e arraste para selecionar).`
      });
      return;
    }
    
    // Obtém o texto completo do campo
    const textoCompleto = elementoTexto.value;
    
    // Define o texto a ser formatado (selecionado ou personalizado)
    const textoSelecionado = textoPersonalizado || textoCompleto.substring(inicio, fim);
    
    // Aplica todas as formatações solicitadas ao texto
    let textoFormatado = textoSelecionado;
    
    for (const tipo of tiposFormatacao) {
      const tipoLimpo = tipo.trim();
      
      // Define as tags de acordo com o tipo de formatação
      let tagAbertura, tagFechamento;
      
      switch (tipoLimpo.toLowerCase()) {
        case 'negrito':
          tagAbertura = '<b>';
          tagFechamento = '</b>';
          break;
        case 'italico':
          tagAbertura = '<em>';
          tagFechamento = '</em>';
          break;
        case 'sublinhado':
          tagAbertura = '<u>';
          tagFechamento = '</u>';
          break;
        default:
          // Tipo desconhecido, pula
          continue;
      }
      
      // Aplica a tag ao texto
      textoFormatado = tagAbertura + textoFormatado + tagFechamento;
    }
    
    // Atualiza o valor do campo com o texto formatado
    const novoValor = textoCompleto.substring(0, inicio) + textoFormatado + textoCompleto.substring(fim);
    elementoTexto.value = novoValor;
    
    // Atualiza o React state a partir do elemento atualizado
    const event = new Event('input', { bubbles: true });
    elementoTexto.dispatchEvent(event);
    
    // Restaura a seleção após a formatação
    const novaSelecaoInicio = inicio;
    const novaSelecaoFim = inicio + textoFormatado.length;
    elementoTexto.setSelectionRange(novaSelecaoInicio, novaSelecaoFim);
    
    // Força a atualização do estado para campos específicos
    const fieldName = elementoTexto.id || elementoTexto.name;
    if (fieldName) {
      setFormData(prevState => ({ 
        ...prevState, 
        [fieldName]: novoValor 
      }));
    }
    
    // Atualiza a geração do HTML formatado
    gerarHTMLFormatado(null, true);
    
    // Exibe mensagem de sucesso
    let mensagemSucesso = 'Formatação aplicada com sucesso!';
    if (tiposFormatacao.length > 1) {
      mensagemSucesso = `Formatações ${tiposFormatacao.join(' + ')} aplicadas com sucesso!`;
    }
    
    setMessage({
      type: 'success',
      text: mensagemSucesso
    });
  } catch (error) {
    console.error('Erro ao aplicar formatação:', error);
    setMessage({
      type: 'error',
      text: 'Ocorreu um erro ao aplicar a formatação. Tente novamente.'
    });
  }
};

// Função que mostra um exemplo automático de formatação
export const mostrarExemploFormatacao = (tipoFormatacao, setFormData, setMessage, aplicarFormatacao) => {
  try {
    // Tenta encontrar e focar no campo de título
    const campoTitulo = document.getElementById('titulo');
    
    if (campoTitulo) {
      // Foca no campo
      campoTitulo.focus();
      
      // Se o campo estiver vazio, insere um texto de exemplo
      if (!campoTitulo.value.trim()) {
        campoTitulo.value = 'A Era da Informação';
        
        // Atualiza o estado do React
        setFormData(prevState => ({ 
          ...prevState, 
          titulo: 'A Era da Informação' 
        }));
      }
      
      // Seleciona todo o texto
      campoTitulo.select();
      
      // Aplica a formatação após um pequeno intervalo para garantir que a seleção foi aplicada
      setTimeout(() => {
        aplicarFormatacao(tipoFormatacao, 'titulo');
      }, 50);
      
      // Exibe mensagem de sucesso
      setMessage({
        type: 'success',
        text: 'Exemplo criado! Formatação aplicada automaticamente.'
      });
    } else {
      // Se não encontrou o campo, exibe mensagem de erro
      setMessage({
        type: 'error',
        text: 'Campo de título não encontrado. Por favor, tente outro campo.'
      });
    }
  } catch (error) {
    console.error('Erro ao mostrar exemplo de formatação:', error);
    setMessage({
      type: 'error',
      text: 'Ocorreu um erro ao mostrar o exemplo. Tente novamente.'
    });
  }
}; 