// rutas para crud de cursos en el modulo de admin

const express = require('express');
const { cargarCursos, exportarCursos, editarCurso, eliminarCurso } = require('../controllers/courseController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Rutas para el CRUD de cursos
router.post('/load', verifyToken, verifyRole(['admin']), cargarCursos);
router.get('/exportar', verifyToken, verifyRole(['admin']), exportarCursos);
router.put('/editar/:codigo', verifyToken, verifyRole(['admin']), editarCurso);
router.delete('/eliminar/:codigo', verifyToken, verifyRole(['admin']), eliminarCurso);

module.exports = router;
