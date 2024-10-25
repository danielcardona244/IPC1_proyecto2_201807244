import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';  
import Dashboard from './components/Dashboard';
import AdminProfesoresCrud from './components/adminProfesoresCrud';
import AdminEstudiantesCrud from './components/adminEstudiantesCrud';
import AdminCursosCrud from './components/adminCursosCrud';
//home
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/*modulo admin*/}
        {/* Rutas para los CRUD con prefijo 'admin' */}
        <Route path="/admin" element={<AdminProfesoresCrud />} />
        <Route path="/admin/students" element={<AdminEstudiantesCrud />} />
        <Route path="/admin/course" element={<AdminCursosCrud />} />
      </Routes>
    </Router>
  );
}

export default App;
