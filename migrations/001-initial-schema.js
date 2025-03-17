/**
 * Migração inicial para configurar o esquema do banco de dados
 * Versão: 001
 * Data: 17/03/2025
 */

/**
 * Executa a migração (aplicar alterações)
 * @param {import('mongodb').Db} db - Instância do banco de dados MongoDB
 */
async function up(db) {
  console.log('🏗️  Criando coleções e índices iniciais...');
  
  // Cria a coleção de usuários
  await db.createCollection('users');
  // Cria índices para a coleção de usuários
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ createdAt: 1 });
  
  // Cria a coleção de projetos
  await db.createCollection('projects');
  // Cria índices para a coleção de projetos
  await db.collection('projects').createIndex({ title: 1 });
  await db.collection('projects').createIndex({ status: 1 });
  await db.collection('projects').createIndex({ createdAt: 1 });
  
  // Cria a coleção de tarefas
  await db.createCollection('tasks');
  // Cria índices para a coleção de tarefas
  await db.collection('tasks').createIndex({ projectId: 1 });
  await db.collection('tasks').createIndex({ status: 1 });
  await db.collection('tasks').createIndex({ assignedTo: 1 });
  await db.collection('tasks').createIndex({ dueDate: 1 });
  
  console.log('✅ Esquema inicial criado com sucesso!');
}

/**
 * Reverte a migração (desfazer alterações)
 * @param {import('mongodb').Db} db - Instância do banco de dados MongoDB
 */
async function down(db) {
  console.log('🔄 Revertendo esquema inicial...');
  
  // Remove as coleções criadas
  await db.collection('tasks').drop();
  await db.collection('projects').drop();
  await db.collection('users').drop();
  
  console.log('✅ Esquema inicial revertido com sucesso!');
}

module.exports = { up, down }; 