/**
 * File: inovacademico/backend/src/routes/referenceRoutes.js
 * Rotas para gerenciar referências bibliográficas
 */
const express = require('express');
const multer = require('multer');
const referenceController = require('../controllers/referenceController');
const logger = require('../utils/logger');

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limite de 10MB
});

/**
 * @route   GET /api/references
 * @desc    Buscar lista de referências com filtros opcionais
 * @access  Public
 */
router.get('/', referenceController.getReferences);

/**
 * @route   POST /api/references
 * @desc    Salvar novas referências bibliográficas
 * @access  Public
 */
router.post('/', referenceController.saveReferences);

/**
 * @route   POST /api/references/upload
 * @desc    Upload e processamento de arquivo de referências
 * @access  Public
 */
router.post('/upload', upload.single('file'), referenceController.uploadReferences);

/**
 * @route   POST /api/references/validate
 * @desc    Validar referência de acordo com norma específica
 * @access  Public
 */
router.post('/validate', referenceController.validateReference);

/**
 * @route   POST /api/references/import-json
 * @desc    Importar referências a partir de arquivo JSON
 * @access  Public
 */
router.post('/import-json', referenceController.importReferencesFromJson);

/**
 * @route   GET /api/references/:id
 * @desc    Buscar uma referência específica por ID
 * @access  Public
 */
router.get('/:id', referenceController.getReferenceById);

/**
 * @route   PUT /api/references/:id
 * @desc    Atualizar uma referência existente
 * @access  Public
 */
router.put('/:id', referenceController.updateReference);

/**
 * @route   DELETE /api/references/:id
 * @desc    Remover uma referência existente
 * @access  Public
 */
router.delete('/:id', referenceController.deleteReference);

// Middleware de erro específico para rotas de referências
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    logger.error('Erro no upload de arquivo', { error: err });
    
    // Mapear erros do Multer para mensagens amigáveis
    let message = 'Erro no upload do arquivo';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'O arquivo excede o tamanho máximo permitido (10MB)';
    }
    
    return res.status(400).json({ success: false, message });
  }
  next(err);
});

module.exports = router; 