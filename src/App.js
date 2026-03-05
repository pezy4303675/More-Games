import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './firebase';

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

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <TimeTracker />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
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
