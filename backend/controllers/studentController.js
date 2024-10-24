/*
controladores que usare en el crud
de estudiantes en el modulo de admin
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const xlsx = require('xlsx');

// Array para almacenar los estudiantes en memoria temporalmente
const estudiantes = [];

// Cargar estudiantes desde un archivo JSON
exports.cargarEstudiantes = (req, res) => {
    const nuevosEstudiantes = req.body;
    
    nuevosEstudiantes.forEach(estudiante => {
        const hashedPassword = bcrypt.hashSync(estudiante.contrasenia, 10);
        estudiantes.push({
            carnet: estudiante.carnet,
            nombre: estudiante.nombre,
            correo: estudiante.correo,
            genero: estudiante.genero,
            contrasenia: hashedPassword
        });
    });
    res.json({ message: 'Estudiantes cargados correctamente' });
};

// Exportar estudiantes a un archivo Excel
exports.exportarEstudiantes = (req, res) => {
    const archivoEstudiantes = xlsx.utils.book_new();
    const hoja = xlsx.utils.json_to_sheet(estudiantes);
    xlsx.utils.book_append_sheet(archivoEstudiantes, hoja, 'Estudiantes');
    
    const archivoPath = './estudiantes.xlsx';
    xlsx.writeFile(archivoEstudiantes, archivoPath);
    
    res.download(archivoPath, 'estudiantes.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
        } else {
            fs.unlinkSync(archivoPath); // Eliminar el archivo después de enviarlo
        }
    });
};

// Editar un estudiante por su carnet
exports.editarEstudiante = (req, res) => {
    const { carnet } = req.params;
    const { nombre, correo, contrasenia } = req.body;

    const estudiante = estudiantes.find(e => e.carnet === carnet);
    
    if (!estudiante) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    if (nombre) estudiante.nombre = nombre;
    if (correo) estudiante.correo = correo;
    if (contrasenia) estudiante.contrasenia = bcrypt.hashSync(contrasenia, 10); // Encriptar la nueva contraseña
    
    res.json({ message: 'Estudiante actualizado correctamente' });
};

// Eliminar un estudiante por su carnet
exports.eliminarEstudiante = (req, res) => {
    const { carnet } = req.params;
    const index = estudiantes.findIndex(e => e.carnet === carnet);

    if (index === -1) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    
    estudiantes.splice(index, 1);
    res.json({ message: 'Estudiante eliminado correctamente' });
};
