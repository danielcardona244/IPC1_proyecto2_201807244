// routes/modStudentRoutes.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const studentController = require('../controllers/modStudentController');

// Ruta para mostrar los cursos del estudiante
router.get('/home', verifyToken, studentController.home);

// Ruta para mostrar las actividades de un curso
router.get('/course/:codigo', verifyToken, studentController.getCurso);

// Ruta para exportar notas en Excel
router.get('/course/:codigo/exportar', verifyToken, studentController.exportarNotas);

// Ruta para generar reporte de notas
router.get('/course/:codigo/reportes', verifyToken, studentController.generarReporte);

module.exports = router;
