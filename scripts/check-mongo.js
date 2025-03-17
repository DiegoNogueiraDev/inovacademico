/**
 * Script para verificar se o MongoDB está rodando
 */
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inovacademico';

async function checkMongoConnection() {
  console.log('\n🔍 Verificando conexão com MongoDB...');
  
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 5000, // Timeout de 5 segundos
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    
    // Testar a conexão
    await client.db().admin().ping();
    
    console.log('✅ MongoDB está rodando em: ' + MONGODB_URI);
    console.log('✅ Banco de dados pronto para uso!\n');
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB!');
    console.error('🔴 MongoDB não está disponível em: ' + MONGODB_URI);
    console.error('⚠️  Erro: ' + error.message);
    console.error('\n📋 Instruções:');
    console.error('1. Certifique-se de que o serviço do MongoDB está rodando');
    console.error('2. Verifique a URI de conexão no arquivo .env');
    console.error('3. Se estiver usando MongoDB Atlas, verifique sua conexão com a internet');
    console.error('\n⚠️  A aplicação pode falhar ao tentar salvar ou carregar dados!\n');
    
    // Não abortar o processo para permitir desenvolvimento mesmo sem MongoDB
    return false;
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// Executar a verificação
checkMongoConnection()
  .catch(err => {
    console.error('Erro inesperado:', err);
  }); 