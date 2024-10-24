// rutas para el modulo de profesores

const express = require('express');
const { home, cargarAlumnos, cargarActividades, reportes } = require('../controllers/teacherController');
const verifyToken = require('../middleware/verifyToken');
const verifyRole = require('../middleware/verifyRole');

const router = express.Router();

// Ruta para mostrar los cursos que imparte el profesor
router.get('/home', verifyToken, verifyRole(['profesor']), home);

// Ruta para cargar alumnos a un curso
router.post('/cargar-alumnos/:codigoCurso', verifyToken, verifyRole(['profesor']), cargarAlumnos);

// Ruta para cargar actividades y notas
router.post('/cargar-actividades/:codigoCurso', verifyToken, verifyRole(['profesor']), cargarActividades);

// Ruta para obtener reportes de los mejores y peores estudiantes
router.get('/reportes/:codigoCurso', verifyToken, verifyRole(['profesor']), reportes);

module.exports = router;
