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
import { initializeApp } from 'firebase/app';
import Sobre from './pages/Sobre';
import Comunidade from './pages/Comunidade';
import Postes from './pages/Postes';
import Pagames from './pages/Pagames';
import Jogosdownload from './pages/Jogosdownload';
import Privacidadeflappycopter from './pages/Privacidadeflappycopter';

const firebaseApp = initializeApp( {
  apiKey: "AIzaSyDbiHiwceuMS6x0zybmYMVL_Do7h4IYTuE",
  authDomain: "gameslint.firebaseapp.com",
  projectId: "gameslint",
  storageBucket: "gameslint.firebasestorage.app",
  messagingSenderId: "103155088844",
  appId: "1:103155088844:web:d9d31d4eefacbdfe5e7169",
  measurementId: "G-Q2LVWV74BR"
});

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
          <Route path="/postes/:id" element={<Postes />} />
          <Route path="/jogos/:id" element={<Jogosdownload />} />
          <Route path="/politicaflappycopter" element={<Privacidadeflappycopter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/comunidade" element={<Comunidade />} />
          <Route path="/pagames" element={<Pagames />} />
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
