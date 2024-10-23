const express = require('express');
const { cargarProfesores, exportarProfesores, editarProfesor, eliminarProfesor } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Ruta para la carga masiva de profesores
router.post('/load', verifyToken, verifyRole(['admin']), cargarProfesores);

// Ruta para exportar los profesores a un archivo Excel
router.get('/exportar', verifyToken, verifyRole(['admin']), exportarProfesores);

// Ruta para editar un profesor por su código
router.put('/editar/:codigo', verifyToken, verifyRole(['admin']), editarProfesor);

// Ruta para eliminar un profesor por su código
router.delete('/eliminar/:codigo', verifyToken, verifyRole(['admin']), eliminarProfesor);

module.exports = router;
