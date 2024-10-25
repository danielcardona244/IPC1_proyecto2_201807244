import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminCursosCrud() {
  const [cursos, setCursos] = useState([]);
  const [file, setFile] = useState(null); // Estado para el archivo JSON
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('No estás autenticado');
      navigate('/login');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Petición GET para obtener los cursos desde la API
    axios.get('http://localhost:4000/admin/course', config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setCursos([]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los cursos:', error);
      });
  }, [navigate]);

  // Método para eliminar un curso
  const handleEliminar = (codigo) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    axios.delete(`http://localhost:4000/admin/course/eliminar/${codigo}`, config)
      .then(() => {
        alert('Curso eliminado');
        setCursos(cursos.filter(curso => curso.codigo !== codigo));
      })
      .catch((error) => {
        console.error('Error al eliminar el curso:', error);
        alert('Hubo un error al eliminar el curso.');
      });
  };

  // Método para editar un curso
  const handleEditar = (codigo) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const nuevoNombre = prompt('Ingrese el nuevo nombre del curso:');
    const nuevosCreditos = prompt('Ingrese los nuevos créditos del curso:');
    const nuevoProfesor = prompt('Ingrese el nuevo profesor del curso:');

    if (nuevoNombre || nuevosCreditos || nuevoProfesor) {
      const data = {
        ...(nuevoNombre && { nombre: nuevoNombre }),
        ...(nuevosCreditos && { creditos: nuevosCreditos }),
        ...(nuevoProfesor && { profesor: nuevoProfesor })
      };

      axios.put(`http://localhost:4000/admin/course/editar/${codigo}`, data, config)
        .then(() => {
          alert('Curso editado');
          setCursos(cursos.map(curso =>
            curso.codigo === codigo ? { ...curso, ...data } : curso
          ));
        })
        .catch((error) => {
          console.error('Error al editar el curso:', error);
          alert('Hubo un error al editar el curso.');
        });
    }
  };

  // Método para manejar la carga de archivo JSON para la carga masiva de cursos
  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        if (Array.isArray(jsonContent)) {
          setFile(jsonContent);
        } else {
          alert("El archivo JSON debe contener un array de cursos.");
        }
      } catch (error) {
        alert("Error al leer el archivo JSON. Asegúrese de que el archivo tenga el formato correcto:\n" +
              "[{ \"codigo\": \"CS101\", \"nombre\": \"Matemáticas\", \"creditos\": 3, \"profesor\": \"Juan Pérez\" }, ...]");
      }
    };
  };

  // Método para cargar los cursos desde el archivo JSON
  const handleUpload = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    };

    if (!file) {
      alert('Por favor seleccione un archivo');
      return;
    }

    axios.post('http://localhost:4000/admin/course/load', file, config)
      .then((response) => {
        if (Array.isArray(response.data.cursos)) {
          alert('Carga masiva exitosa');
          setCursos([...cursos, ...response.data.cursos]); // Añadir los cursos cargados
        } else {
          alert('Error: La respuesta no contiene un array de cursos.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los cursos:', error);
        alert('Hubo un error al cargar los cursos.');
      });
  };

  // Nueva función para exportar a Excel
  const handleExportarExcel = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    };
    axios.get('http://localhost:4000/admin/course/exportar', config)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'cursos.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => console.error('Error al exportar los cursos:', error));
  };

  // Método para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Gestión de Cursos</h2>

      <button onClick={handleLogout}>Cerrar Sesión</button>
      
      <div>
        <input type="file" onChange={handleFileChange} accept=".json" />
        <button onClick={handleUpload}>Cargar Cursos</button>
        <button onClick={handleExportarExcel}>Exportar a Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Créditos</th>
            <th>Profesor</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(cursos) && cursos.length > 0 ? (
            cursos.map((curso) => (
              <tr key={curso.codigo}>
                <td>{curso.codigo}</td>
                <td>{curso.nombre}</td>
                <td>{curso.creditos}</td>
                <td>{curso.profesor}</td>
                <td>
                  <button onClick={() => handleEditar(curso.codigo)}>Editar</button>
                  <button onClick={() => handleEliminar(curso.codigo)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay cursos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCursosCrud;
