/**
 * Script para realizar migrações no banco de dados
 * Execute com: npm run db:migrate
 */
require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Recupera a string de conexão do arquivo .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/devnogueira';
const DB_NAME = process.env.DB_NAME || 'devnogueira';

// Diretório onde as migrações estão armazenadas
const MIGRATIONS_DIR = path.join(__dirname, '../migrations');

// Nome da coleção que armazena o histórico de migrações
const MIGRATION_COLLECTION = 'migrations';

async function runMigrations() {
  console.log('🔄 Iniciando processo de migração do banco de dados...');
  
  // Verifica se o diretório de migrações existe
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('📁 Criando diretório de migrações...');
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
    console.log('✅ Diretório de migrações criado com sucesso!');
    console.log('ℹ️  Nenhuma migração encontrada.');
    return;
  }
  
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
    const migrationsCollection = db.collection(MIGRATION_COLLECTION);
    
    // Garante que a coleção de migrações existe e tem o índice necessário
    await migrationsCollection.createIndex({ name: 1 }, { unique: true });
    
    // Obtém as migrações já executadas
    const executedMigrations = await migrationsCollection.find({}).toArray();
    const executedMigrationNames = executedMigrations.map(m => m.name);
    
    // Obtém todos os arquivos de migração
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
      .filter(file => file.endsWith('.js'))
      .sort(); // Ordena para garantir a execução na ordem correta
    
    if (migrationFiles.length === 0) {
      console.log('ℹ️  Nenhum arquivo de migração encontrado.');
      return;
    }
    
    // Filtra as migrações que ainda não foram executadas
    const pendingMigrations = migrationFiles.filter(file => !executedMigrationNames.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ Nenhuma migração pendente para executar.');
      return;
    }
    
    console.log(`🔍 Encontradas ${pendingMigrations.length} migrações pendentes.`);
    
    // Executa cada migração pendente
    for (const migrationFile of pendingMigrations) {
      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile);
      console.log(`⚙️  Executando migração: ${migrationFile}`);
      
      try {
        const migration = require(migrationPath);
        
        if (typeof migration.up !== 'function') {
          throw new Error(`A migração ${migrationFile} não exporta uma função 'up'.`);
        }
        
        // Executa a migração
        await migration.up(db);
        
        // Registra a migração como executada
        await migrationsCollection.insertOne({
          name: migrationFile,
          executedAt: new Date()
        });
        
        console.log(`✅ Migração ${migrationFile} executada com sucesso!`);
      } catch (error) {
        console.error(`❌ Erro ao executar a migração ${migrationFile}:`);
        console.error(error);
        throw error; // Interrompe o processo em caso de erro
      }
    }
    
    console.log('🎉 Processo de migração concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de migração:');
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
runMigrations().catch(console.error); 