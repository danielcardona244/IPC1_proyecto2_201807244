/*
controladores que usare en el crud
de cursos en el modulo de admin
 */

const cursos = []; // Cursos almacenados temporalmente en memoria
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Carga masiva de cursos desde un archivo JSON
exports.cargarCursos = (req, res) => {
    const nuevosCursos = req.body;
    nuevosCursos.forEach((curso) => {
        curso.alumnos = 0; // Inicializar con 0 alumnos por defecto
        cursos.push({
            codigo: curso.codigo,
            nombre: curso.nombre,
            creditos: curso.creditos,
            profesor: curso.profesor,
            alumnos: curso.alumnos
        });
    });
    res.json({ message: 'Cursos cargados correctamente' });
};

// Exportar los cursos a un archivo Excel
exports.exportarCursos = (req, res) => {
    const archivoPath = path.join(__dirname, '..', 'cursos.xlsx');
    const wb = xlsx.utils.book_new();
    const hoja = xlsx.utils.json_to_sheet(cursos);
    xlsx.utils.book_append_sheet(wb, hoja, 'Cursos');
    xlsx.writeFile(wb, archivoPath);

    res.download(archivoPath, 'cursos.xlsx', (err) => {
        if (err) {
            console.error('Error al descargar el archivo:', err);
        } else {
            fs.unlinkSync(archivoPath); // Borrar el archivo después de enviarlo
        }
    });
};

// Editar un curso por su código
exports.editarCurso = (req, res) => {
    const { codigo } = req.params;
    const { nombre, creditos, profesor } = req.body;

    const curso = cursos.find(c => c.codigo === codigo);
    if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    if (nombre) curso.nombre = nombre;
    if (creditos) curso.creditos = creditos;
    if (profesor) curso.profesor = profesor;

    res.json({ message: 'Curso actualizado correctamente' });
};

// Eliminar un curso por su código
exports.eliminarCurso = (req, res) => {
    const { codigo } = req.params;
    const index = cursos.findIndex(c => c.codigo === codigo);
    if (index === -1) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    cursos.splice(index, 1);
    res.json({ message: 'Curso eliminado correctamente' });
};
