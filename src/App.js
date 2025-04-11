import Home from './pages/Home';
import { useState, useEffect } from 'react';
import './App.css';
import './index'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Container from './layout/Container';
import Navbar from './layout/Navbar';
import Produto from './pages/Produto';
import Privacidade from './pages/Privacidade';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className='Appitem'>
      <Navbar setSearchQuery={setSearchQuery}/>
      <Container>
        <Routes>
          <Route exact path='/' element={<Home searchQuery={searchQuery}/>}/>
          <Route path='/privacidade' element={<Privacidade/>}/>
          <Route path='/contacto' element={<Contacto/>}/>
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            localStorage.getItem('isAuthenticated') ? 
            <Dashboard /> : 
            <Navigate to="/login" replace />
          } />
        </Routes>
      </Container>
      </div>
    </Router>
  );
}

export default App;
