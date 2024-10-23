const express = require('express');
const { cargarEstudiantes, exportarEstudiantes, editarEstudiante, eliminarEstudiante } = require('../controllers/studentController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Ruta para la carga masiva de estudiantes
router.post('/carga-masiva', verifyToken, verifyRole(['admin']), cargarEstudiantes);

// Ruta para exportar los estudiantes a Excel
router.get('/exportar', verifyToken, verifyRole(['admin']), exportarEstudiantes);

// Ruta para editar un estudiante
router.put('/editar/:carnet', verifyToken, verifyRole(['admin']), editarEstudiante);

// Ruta para eliminar un estudiante
router.delete('/eliminar/:carnet', verifyToken, verifyRole(['admin']), eliminarEstudiante);

module.exports = router;
