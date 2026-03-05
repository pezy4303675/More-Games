import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';

import './App.css';
import './index';

// Layout
import Container from './layout/Container';
import Navbar from './layout/Navbar';

// Pages
import AppDetalhe from './pages/AppDetalhe';
import Apps from './pages/Apps';
import Contacto from './pages/Contacto';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Jogosdownload from './pages/Jogosdownload';
import Login from './pages/Login';
import Pagames from './pages/Pagames';
import Privacidade from './pages/Privacidade';
import Privacidadeflappycopter from './pages/Privacidadeflappycopter';
import Produto from './pages/Produto';
import Rewards from './pages/Rewards';
import Sobre from './pages/Sobre';
import TimeTracker from './components/TimeTracker';
import Redeem from './pages/Redeem';

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
      <TimeTracker />
      <div className='Appitem'>
      <Navbar setSearchQuery={setSearchQuery}/>
      <Container>
        <Routes>
          <Route exact path='/' element={<Home searchQuery={searchQuery}/>}/>
          <Route path='/privacidade' element={<Privacidade/>}/>
          <Route path='/contacto' element={<Contacto/>}/>
          <Route path="/produto/:id" element={<Produto />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/app/:id" element={<AppDetalhe />} />
          <Route path="/jogos" element={<Pagames />} />
          <Route path="/jogos/:id" element={<Jogosdownload />} />
          <Route path="/politicaflappycopter" element={<Privacidadeflappycopter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/redeem" element={<Redeem />} />
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
