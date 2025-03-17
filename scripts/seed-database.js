/**
 * Script para popular o banco de dados com dados iniciais
 * Execute com: npm run db:seed
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Recupera a string de conexão do arquivo .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devnogueira';
const DB_NAME = process.env.DB_NAME || 'devnogueira';

// Dados iniciais para popular o banco
const seedData = {
  users: [
    {
      name: 'Administrador',
      email: 'admin@devnogueira.com',
      role: 'admin',
      createdAt: new Date(),
    },
    {
      name: 'Usuário Teste',
      email: 'usuario@devnogueira.com',
      role: 'user',
      createdAt: new Date(),
    },
  ],
  projects: [
    {
      title: 'Projeto Exemplo',
      description: 'Um projeto de exemplo para demonstração',
      status: 'active',
      createdAt: new Date(),
    },
  ],
  // Adicione mais coleções conforme necessário
};

async function seedDatabase() {
  console.log('🌱 Iniciando população do banco de dados...');
  
  let client;
  try {
    // Conecta ao MongoDB
    client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    const db = client.db(DB_NAME);
    
    // Itera sobre todas as coleções em seedData
    for (const [collectionName, documents] of Object.entries(seedData)) {
      const collection = db.collection(collectionName);
      
      // Verifica se a coleção já possui documentos
      const count = await collection.countDocuments();
      
      if (count > 0) {
        console.log(`🔄 A coleção '${collectionName}' já possui ${count} documentos. Pulando...`);
        continue;
      }
      
      // Insere os documentos na coleção
      const result = await collection.insertMany(documents);
      console.log(`✅ Inseridos ${result.insertedCount} documentos na coleção '${collectionName}'`);
    }
    
    console.log('🎉 Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao popular o banco de dados:');
    console.error(error);
    process.exit(1);
  } finally {
    // Fecha a conexão se foi estabelecida
    if (client) {
      await client.close();
      console.log('🔒 Conexão com o MongoDB fechada');
    }
  }
}

// Executa a função principal
seedDatabase().catch(console.error); 