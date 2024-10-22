const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middleware global
app.use(bodyParser.json());
app.use(cors());

// Importar las rutas
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);  // Usar las rutas de autenticación

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
