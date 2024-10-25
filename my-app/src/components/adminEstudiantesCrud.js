import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminEstudiantesCrud() {
  const [estudiantes, setEstudiantes] = useState([]);
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

    // Petición GET para obtener los estudiantes desde la API
    axios.get('http://localhost:4000/admin/students', config)
      .then((response) => {
        // Si la respuesta es un array vacío, manejamos eso también
        if (Array.isArray(response.data)) {
          setEstudiantes(response.data);
        } else {
          setEstudiantes([]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los estudiantes:', error);
        alert('Hubo un error al obtener los estudiantes.');
      });
  }, [navigate]);

  // Método para eliminar un estudiante
  const handleEliminar = (carnet) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    // Petición DELETE para eliminar el estudiante por su carnet
    axios.delete(`http://localhost:4000/admin/students/eliminar/${carnet}`, config)
      .then(() => {
        alert('Estudiante eliminado');
        setEstudiantes(estudiantes.filter(estudiante => estudiante.carnet !== carnet));
      })
      .catch((error) => {
        console.error('Error al eliminar el estudiante:', error);
        alert('Hubo un error al eliminar el estudiante.');
      });
  };

  // Método para editar un estudiante
  const handleEditar = (carnet) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    const nuevoNombre = prompt('Ingrese el nuevo nombre del estudiante:');
    const nuevoCorreo = prompt('Ingrese el nuevo correo del estudiante:');
    const nuevaContrasenia = prompt('Ingrese la nueva contraseña del estudiante:');

    if (nuevoNombre || nuevoCorreo || nuevaContrasenia) {
      const data = {
        ...(nuevoNombre && { nombre: nuevoNombre }),
        ...(nuevoCorreo && { correo: nuevoCorreo }),
        ...(nuevaContrasenia && { contrasenia: nuevaContrasenia })
      };

      // Petición PUT para actualizar los datos del estudiante
      axios.put(`http://localhost:4000/admin/students/editar/${carnet}`, data, config)
        .then(() => {
          alert('Estudiante editado');
          setEstudiantes(estudiantes.map(estudiante =>
            estudiante.carnet === carnet ? { ...estudiante, ...data } : estudiante
          ));
        })
        .catch((error) => {
          console.error('Error al editar el estudiante:', error);
          alert('Hubo un error al editar el estudiante.');
        });
    }
  };

  // Método para manejar la carga de archivo JSON para la carga masiva de estudiantes
  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        if (Array.isArray(jsonContent)) {
          setFile(jsonContent);
        } else {
          alert("El archivo JSON debe contener un array de estudiantes.");
        }
      } catch (error) {
        alert("Error al leer el archivo JSON. Asegúrese de que el archivo tenga el formato correcto:\n" +
              "[{ \"carnet\": \"20190001\", \"nombre\": \"Juan\", \"correo\": \"juan@example.com\", \"genero\": \"m\", \"contrasenia\": \"1234\" }, ...]");
      }
    };
  };

  // Método para cargar los estudiantes desde el archivo JSON
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

    // Petición POST para cargar los estudiantes desde el archivo JSON
    axios.post('http://localhost:4000/admin/students/carga-masiva', file, config)
    .then((response) => {
      if (Array.isArray(response.data.estudiantes)) {
        alert('Carga masiva exitosa');
        setEstudiantes([...estudiantes, ...response.data.estudiantes]); // Añadir los estudiantes cargados
      } else {
        alert('Error: La respuesta no contiene un array de estudiantes.');
      }
    })
    .catch((error) => {
      console.error('Error al cargar los estudiantes:', error);
      alert('Hubo un error al cargar los estudiantes.');
    });
  };


    // Nueva función para exportar a Excel
    const handleExportarExcel = () => {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      };
      axios.get('http://localhost:4000/admin/students/exportar', config)
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'estudiantes.xlsx');
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => console.error('Error al exportar los estudiantes:', error));
    };

  // Método para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Gestión de Estudiantes</h2>

      <button onClick={handleLogout}>Cerrar Sesión</button>
      
      <div>
        <input type="file" onChange={handleFileChange} accept=".json" />
        <button onClick={handleUpload}>Cargar Estudiantes</button>
        <button onClick={handleExportarExcel}>Exportar a Excel</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Carnet</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Género</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(estudiantes) && estudiantes.length > 0 ? (
            estudiantes.map((estudiante) => (
              <tr key={estudiante.carnet}>
                <td>{estudiante.carnet}</td>
                <td>{estudiante.nombre}</td>
                <td>{estudiante.correo}</td>
                <td>{estudiante.genero}</td>
                <td>
                  <button onClick={() => handleEditar(estudiante.carnet)}>Editar</button>
                  <button onClick={() => handleEliminar(estudiante.carnet)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay estudiantes disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEstudiantesCrud;
