import  Home  from './pages/Home';
import { useState } from 'react';
import './App.css';
import './index'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from './layout/Container';
import Navbar from './layout/Navbar';
import Produto from './pages/Produto';
import Privacidade from './pages/Privacidade';
import Contacto from './pages/Contacto';

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div className='Appitem'>
      <Navbar setSearchQuery={setSearchQuery}/>
      <Container>
        <Routes>
        <Route exact path='/' element={<Home searchQuery={searchQuery}/>}/>
        <Route  path='/privacidade' element={<Privacidade/>}/>
        <Route  path='/contacto' element={<Contacto/>}/>
        <Route path="/produto/:id" element={<Produto />} />
      </Routes>
      </Container>
      </div>
    </Router>
  );
}

export default App;
