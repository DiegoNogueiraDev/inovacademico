/**
 * Script para verificar a conexão com o MongoDB
 * Este script é executado antes do comando 'npm run dev'
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Recupera a string de conexão do arquivo .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devnogueira';

async function checkMongoConnection() {
  console.log('🔍 Verificando conexão com o MongoDB...');
  
  let client;
  try {
    // Tenta conectar ao MongoDB
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout após 5 segundos
    });
    
    await client.connect();
    
    // Verifica se o servidor está respondendo
    await client.db().command({ ping: 1 });
    
    console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:');
    console.error(`   ${error.message}`);
    console.log('\n📋 Verifique se:');
    console.log('   1. O serviço MongoDB está em execução');
    console.log('   2. A string de conexão no arquivo .env está correta');
    console.log('   3. As credenciais de acesso estão corretas\n');
    
    // Não interrompe o início do servidor de desenvolvimento,
    // apenas exibe o aviso
    return false;
  } finally {
    // Fecha a conexão se foi estabelecida
    if (client) {
      await client.close();
    }
  }
}

// Executa a verificação
checkMongoConnection()
  .then(() => {
    console.log('🚀 Iniciando o servidor de desenvolvimento...\n');
  })
  .catch((err) => {
    console.error('❌ Erro inesperado:', err);
    process.exit(1);
  }); 