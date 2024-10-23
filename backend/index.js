const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Importar las rutas de autenticación
const authRoutes = require('./routes/authRoutes');

// Usar las rutas de autenticación
app.use('/', authRoutes);

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
