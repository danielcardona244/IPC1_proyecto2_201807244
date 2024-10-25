/*
controladores que usare en el crud
de profesores en el modulo de admin
 */
const bcrypt = require('bcrypt');
const xlsx = require('xlsx');
const fs = require('fs');

// Simulamos una base de datos temporal en memoria
const profesores = [];

// Cargar profesores desde un JSON (Carga masiva)
exports.cargarProfesores = (req, res) => {
    const nuevosProfesores = req.body; // El array de profesores viene en el body como JSON

    if (!Array.isArray(nuevosProfesores)) {
        return res.status(400).json({ message: 'Formato de archivo incorrecto. Se esperaba un array de profesores.' });
    }

    nuevosProfesores.forEach(profesor => {
        // Validar que el campo 'genero' exista y sea válido ('m' o 'f')
        if (!profesor.genero || (profesor.genero !== 'm' && profesor.genero !== 'f')) {
            return res.status(400).json({ message: `El campo 'genero' es obligatorio y debe ser 'm' o 'f'. Profesor con código ${profesor.codigo} tiene un valor incorrecto.` });
        }

        // Encriptar la contraseña antes de almacenarla
        const hashedPassword = bcrypt.hashSync(profesor.contrasenia, 10);
        profesor.contrasenia = hashedPassword;
        
        // Agregar el profesor al array en memoria
        profesores.push(profesor);
    });

    res.json({ message: 'Profesores cargados correctamente', profesores: nuevosProfesores });
};

// Exportar profesores a un archivo Excel
exports.exportarProfesores = (req, res) => {
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(profesores);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Profesores');

    const excelPath = './profesores.xlsx';
    xlsx.writeFile(workbook, excelPath);

    res.download(excelPath, 'profesores.xlsx', err => {
        if (err) {
            console.error('Error al enviar el archivo:', err);
        }
        // Eliminar el archivo después de enviarlo
        fs.unlinkSync(excelPath);
    });
};

// Editar un profesor por su código (sin modificar el campo 'genero')
exports.editarProfesor = (req, res) => {
    const { codigo } = req.params;
    const { nombre, correo, contrasenia } = req.body;
    
    const profesor = profesores.find(p => p.codigo === codigo);
    if (!profesor) {
        return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    if (nombre) profesor.nombre = nombre;
    if (correo) profesor.correo = correo;
    if (contrasenia) profesor.contrasenia = bcrypt.hashSync(contrasenia, 10); // Encriptar la nueva contraseña
    
    res.json({ message: 'Profesor actualizado correctamente' });
};

// Eliminar un profesor por su código
exports.eliminarProfesor = (req, res) => {
    const { codigo } = req.params;
    const index = profesores.findIndex(p => p.codigo === codigo);

    if (index === -1) {
        return res.status(404).json({ message: 'Profesor no encontrado' });
    }

    profesores.splice(index, 1); // Eliminar el profesor del array en memoria

    res.json({ message: 'Profesor eliminado correctamente' });
};
