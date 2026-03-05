import React, { useState, useEffect } from "react";
import { NavbarData } from "./NavbarData";
import { Link, NavLink } from "react-router-dom";
import { User, RefreshCcw, X } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import favicon from '../imgs/ChatGPT_Image_9_04_2025__13_54_52-removebg-preview.png'
import logo from '../imgs/logo.png'

function Navbar({ setSearchQuery }) {
  const [query, setQuery] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [recoverId, setRecoverId] = useState("");
  const [recoverError, setRecoverError] = useState("");

  useEffect(() => {
    // Busca o ID do Jogador gerado pelo TimeTracker
    const id = localStorage.getItem('playerId');
    if (id) setPlayerId(id);

    // Listener para mudanças no localStorage (caso o TimeTracker gere um novo ID)
    const handleStorageChange = () => {
      const newId = localStorage.getItem('playerId');
      if (newId) setPlayerId(newId);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleRecoverAccount = async () => {
    setRecoverError("");
    if (!recoverId.trim()) return;

    try {
      const userRef = doc(db, 'playerAccounts', recoverId.trim().toUpperCase());
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        localStorage.setItem('playerId', data.playerId);
        localStorage.setItem('timeOnSite', data.timeOnSite);
        setPlayerId(data.playerId);
        setShowRecoverModal(false);
        setRecoverId("");
        alert(`Conta recuperada com sucesso! Você tem ${Math.floor(data.timeOnSite / 60)}h ${data.timeOnSite % 60}min.`);
        window.location.reload(); // Recarrega para atualizar o contador global
      } else {
        setRecoverError("ID de Jogador não encontrado.");
      }
    } catch (error) {
      console.error("Erro ao recuperar conta:", error);
      setRecoverError("Erro ao procurar conta. Tente novamente.");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-left">
          <Link to="/" className="logo-container">
            <img src={logo} alt="Logo" className="logo" draggable="false" />
          </Link>
        </div>

        <div className="navbar-center">
          <div className="searchbar">
            <img src={favicon} alt="Search icon" className="search-icon" draggable="false" />
            <input
              type="text"
              placeholder="O que quer jogar hoje..."
              value={query}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="navbar-right">
          <div className="nav-links">
            {NavbarData.map((val, key) => (
              <NavLink
                to={val.link}
                key={key}
                className="nav-link"
                title={val.link.replace('/', '') || 'Início'}
              >
                {val.icon}
              </NavLink>
            ))}
          </div>

          <div className="player-id-badge">
            <div className="id-info">
              <User size={14} />
              <span className="id-text">{playerId || "..."}</span>
            </div>
            <button onClick={() => setShowRecoverModal(true)} className="recover-btn" title="Recuperar Horas">
              <RefreshCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {showRecoverModal && (
        <div className="modal-overlay">
          <div className="recover-modal">
            <div className="modal-header">
              <h3>Recuperar Conta</h3>
              <button onClick={() => setShowRecoverModal(false)} className="close-btn">
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <p className="modal-description">
                Perdeu o acesso? Introduza o seu <strong>ID de Jogador</strong> para restaurar o seu tempo acumulado.
              </p>
              
              <div className="input-group">
                <label>ID de Jogador</label>
                <input 
                  type="text" 
                  placeholder="EX: MORE-A1B2C3D" 
                  value={recoverId} 
                  onChange={(e) => setRecoverId(e.target.value)} 
                  className="recover-input"
                />
              </div>

              {recoverError && (
                <div className="error-badge">
                  {recoverError}
                </div>
              )}

              <button onClick={handleRecoverAccount} className="confirm-recover-btn">
                RESTAURAR AGORA
              </button>
              
              <p className="modal-footer-text">
                O seu ID atual será substituído pelo ID recuperado.
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 2rem;
          background: rgba(19, 20, 30, 0.85);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 10px;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin: 0 15px;
          border-radius: 18px;
          gap: 1.5rem;
        }

        .navbar-left {
          flex: 0 0 auto;
        }

        .navbar-center {
          flex: 1;
          display: flex;
          justify-content: center;
          max-width: 500px;
        }

        .navbar-right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .logo {
          width: 90px;
          height: auto;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .searchbar {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 0.6rem 1.2rem;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .searchbar:focus-within {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(104, 66, 255, 0.5);
          box-shadow: 0 0 20px rgba(104, 66, 255, 0.15);
          transform: translateY(-1px);
        }

        .search-icon {
          width: 18px;
          height: 18px;
          margin-right: 0.8rem;
          opacity: 0.6;
        }

        .search-input {
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          font-size: 0.9rem;
          outline: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.6);
          padding: 0.6rem;
          border-radius: 10px;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-link:hover, .nav-link.active {
          color: white;
          background: rgba(104, 66, 255, 0.15);
        }

        .player-id-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, rgba(104, 66, 255, 0.25), rgba(104, 66, 255, 0.1));
          padding: 0.5rem 0.9rem;
          border-radius: 12px;
          border: 1px solid rgba(104, 66, 255, 0.4);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .id-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 700;
        }

        .recover-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.35rem;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .recover-btn:hover {
          background: #6842ff;
          transform: rotate(180deg);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10, 11, 18, 0.92);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(10px);
          padding: 20px;
        }

        .recover-modal {
          background: #1a1b26;
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          border: 1px solid rgba(104, 66, 255, 0.4);
          box-shadow: 0 30px 60px rgba(0,0,0,0.5);
          animation: modalAppear 0.3s ease-out;
        }

        @keyframes modalAppear {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-header {
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modal-body { padding: 2rem; }
        .modal-description { color: #9499c3; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .input-group label { display: block; color: #6842ff; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem; }
        
        .recover-input {
          width: 100%;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border: 2px solid rgba(104, 66, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-family: monospace;
          font-size: 1.1rem;
          text-transform: uppercase;
        }

        .confirm-recover-btn {
          width: 100%;
          padding: 1rem;
          background: #6842ff;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: 0.3s;
        }

        .confirm-recover-btn:hover { background: #7c5cff; transform: translateY(-2px); }

        @media (max-width: 1100px) {
          .navbar-center { max-width: 300px; }
          .id-text { display: none; }
          .player-id-badge { padding: 0.5rem; }
        }

        @media (max-width: 768px) {
          .navbar {
            padding: 0.8rem 1rem;
            margin: 0;
            border-radius: 0;
            top: 0;
            gap: 0.5rem;
          }
          .navbar-center { display: none; }
          .nav-links { gap: 0.25rem; }
          .logo { width: 70px; }
        }
      `}</style>
    </>
  );
}

export default Navbar;
