const express = require('express');
const { login } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken'); // Importar desde middleware/verifyToken
const verifyRole = require('../middleware/verifyRole');    // Otro middleware

const router = express.Router();

// Rutas protegidas usando verifyToken
router.post('/login', login);
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
    res.send('Bienvenido Administrador');
});
router.get('/profesor', verifyToken, verifyRole(['profesor', 'admin']), (req, res) => {
    res.send('Bienvenido Profesor');
});
router.get('/alumno', verifyToken, verifyRole(['alumno', 'admin']), (req, res) => {
    res.send('Bienvenido Alumno');
});

module.exports = router;
