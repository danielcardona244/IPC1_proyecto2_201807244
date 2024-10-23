
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// ruta de login
const authRoutes = require('./routes/authRoutes');

// Importar las rutas de admin
const adminRoutes = require('./routes/adminRoutes');

//ruta de autenticacion
app.use(authRoutes);
// Usar las rutas
app.use('/admin', adminRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
