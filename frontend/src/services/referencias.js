/**
 * Serviço para manipulação de referências bibliográficas
 * 
 * Este serviço encapsula as chamadas para o backend relacionadas a referências
 */

// URL base do backend
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Busca todas as referências bibliográficas
 * @param {Object} filtros - Filtros opcionais (tipo, autor, titulo)
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function buscarReferencias(filtros = {}) {
  try {
    // Construir query string para os filtros
    const queryParams = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${BACKEND_URL}/references${queryString}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar referências:', error);
    return {
      success: false,
      message: 'Erro ao buscar referências',
      error: error.message
    };
  }
}

/**
 * Busca uma referência específica por ID
 * @param {string} id - ID da referência
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function buscarReferenciaPorId(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/references/${id}`);
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error(`Erro ao buscar referência com ID ${id}:`, error);
    return {
      success: false,
      message: 'Erro ao buscar referência',
      error: error.message
    };
  }
}

/**
 * Salva uma nova referência
 * @param {Object} referencia - Dados da referência a ser salva
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function salvarReferencia(referencia) {
  try {
    console.log(`Enviando requisição para o backend: POST ${BACKEND_URL}/references`);
    
    // Primeiro convertemos para array se necessário
    const referencesArray = Array.isArray(referencia) ? referencia : [referencia];
    
    // Depois empacotamos dentro do objeto com propriedade 'references' como esperado pelo backend
    const payload = {
      references: referencesArray
    };
    
    console.log('Dados enviados (formatados para API):', JSON.stringify(payload));
    
    const response = await fetch(`${BACKEND_URL}/references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    console.log(`Resposta do backend: ${response.status}`, data);
    
    if (!response.ok) {
      console.error('Erro retornado pelo backend:', data);
      return {
        success: false,
        message: data.message || `Erro do servidor: ${response.status}`,
        error: data.error || 'Erro desconhecido'
      };
    }
    
    return {
      ...data,
      success: true
    };
  } catch (error) {
    console.error('Erro ao salvar referência:', error);
    return {
      success: false,
      message: 'Erro ao salvar referência: Problema de conexão ou servidor indisponível',
      error: error.message
    };
  }
}

/**
 * Atualiza uma referência existente
 * @param {string} id - ID da referência
 * @param {Object} referencia - Dados atualizados da referência
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function atualizarReferencia(id, referencia) {
  try {
    const response = await fetch(`${BACKEND_URL}/references/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(referencia),
    });
    
    const data = await response.json();
    
    return {
      ...data,
      success: response.ok
    };
  } catch (error) {
    console.error(`Erro ao atualizar referência com ID ${id}:`, error);
    return {
      success: false,
      message: 'Erro ao atualizar referência',
      error: error.message
    };
  }
}

/**
 * Remove uma referência
 * @param {string} id - ID da referência
 * @returns {Promise<Object>} - Resultado da operação
 */
export async function removerReferencia(id) {
  try {
    console.log(`Removendo referência com ID: ${id}`);
    
    const response = await fetch(`${BACKEND_URL}/references/${id}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    console.log(`Resposta do backend: ${response.status}`, data);
    
    if (!response.ok) {
      console.error('Erro retornado pelo backend:', data);
      return {
        success: false,
        message: data.message || `Erro do servidor: ${response.status}`,
        error: data.error || 'Erro desconhecido'
      };
    }
    
    return {
      ...data,
      success: true
    };
  } catch (error) {
    console.error(`Erro ao remover referência com ID ${id}:`, error);
    return {
      success: false,
      message: 'Erro ao remover referência: Problema de conexão ou servidor indisponível',
      error: error.message
    };
  }
} 