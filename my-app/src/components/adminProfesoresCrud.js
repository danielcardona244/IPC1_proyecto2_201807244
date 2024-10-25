import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminProfesoresCrud() {
  const [profesores, setProfesores] = useState([]);
  const [file, setFile] = useState(null);
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

    // Petición GET para obtener los profesores desde la API
    axios.get('http://localhost:4000/admin', config)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProfesores(response.data);
        } else {
          setProfesores([]);
        }
      })
      .catch((error) => {
        console.error('Error al obtener los profesores:', error);
      });
  }, [navigate]);


  // Método para eliminar un profesor
  const handleEliminar = (codigo) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Petición DELETE para eliminar el profesor por su código
    axios.delete(`http://localhost:4000/admin/eliminar/${codigo}`, config)
      .then(() => {
        alert('Profesor eliminado');
        setProfesores(profesores.filter(profesor => profesor.codigo !== codigo));
      })
      .catch((error) => {
        console.error('Error al eliminar el profesor:', error);
        alert('Hubo un error al eliminar el profesor.');
      });
  };

  // Método para editar el nombre de un profesor
  const handleEditar = (codigo) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    //pide al usuario los datos a editar
    const nuevoNombre = prompt('Ingrese el nuevo nombre del profesor:');
    const nuevoCorreo = prompt('Ingrese el nuevo correo del profesor:');
    const nuevaContrasenia = prompt('Ingrese la nueva contraseña del profesor:');

    if (nuevoNombre || nuevoCorreo || nuevaContrasenia) {
      const data = {
        ...(nuevoNombre && { nombre: nuevoNombre }),
        ...(nuevoCorreo && { correo: nuevoCorreo }),
        ...(nuevaContrasenia && { contrasenia: nuevaContrasenia })
      };
      // Petición PUT para actualizar el nombre del profesor
      axios.put(`http://localhost:4000/admin/editar/${codigo}`, data, config)
        .then(() => {
          alert('Profesor editado');
          setProfesores(profesores.map(profesor =>
            profesor.codigo === codigo ? { ...profesor, ...data } : profesor
          ));
        })
        .catch((error) => {
          console.error('Error al editar el profesor:', error);
          alert('Hubo un error al editar el profesor.');
        });
    }
  };

  // Método para manejar la carga de archivo JSON para la carga masiva de profesores
  const handleFileChange = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      try {
        const jsonContent = JSON.parse(e.target.result);
        setFile(jsonContent);
      } catch (error) {
        alert("Error al leer el archivo JSON. Asegúrese de que el archivo tenga el formato correcto.");
      }
    };
  };

  // Método para subir los profesores desde el archivo JSON
  const handleUpload = () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Asegurar el envío como JSON
      }
    };
  
    if (!file) {
      alert('Por favor seleccione un archivo');
      return;
    }
  
    // Petición POST para cargar los profesores desde el archivo JSON
    axios.post('http://localhost:4000/admin/load', file, config) 
      .then((response) => {
        if (Array.isArray(response.data.profesores)) {
          alert('Carga masiva exitosa');
          setProfesores([...profesores, ...response.data.profesores]); // Añadir los profesores cargados a la lista existente
        } else {
          alert('Error: La respuesta no contiene un array de profesores.');
        }
      })
      .catch((error) => {
        console.error('Error al cargar los profesores:', error);
        alert('Hubo un error al cargar los profesores.');
      });
  };
  

    // Método para cerrar sesión y redirigir al login
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
    <h2>Gestión de Profesores</h2>

    <button onClick={handleLogout}>Cerrar Sesión</button>

    <div>
      <input type="file" onChange={handleFileChange} accept=".json" />
      <button onClick={handleUpload}>Cargar Profesores</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Género</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(profesores) && profesores.length > 0 ? (
          profesores.map((profesor) => (
            <tr key={profesor.codigo}>
              <td>{profesor.nombre}</td>
              <td>{profesor.correo}</td>
              <td>{profesor.genero}</td>
              <td>
                <button onClick={() => handleEditar(profesor.codigo)}>Editar</button>
                <button onClick={() => handleEliminar(profesor.codigo)}>Eliminar</button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No hay profesores disponibles</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
}

export default AdminProfesoresCrud;
