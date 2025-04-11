import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import produtos from './produtos';

function Dashboard() {
  const [newGame, setNewGame] = useState({
    nome: '',
    image: '',
    descricao: '',
    categoria: '',
    link: ''
  });
  const [games, setGames] = useState(produtos);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = games.length + 1;
    const gameToAdd = {
      ...newGame,
      id: newId
    };
    setGames(prev => [...prev, gameToAdd]);
    setNewGame({
      nome: '',
      image: '',
      descricao: '',
      categoria: '',
      link: ''
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard de Jogos</h1>
        <button onClick={handleLogout} className="logout-button">
          Sair
        </button>
      </div>

      <div className="dashboard-content">
        <div className="add-game-form">
          <h2>Adicionar Novo Jogo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="nome"
                value={newGame.nome}
                onChange={handleInputChange}
                placeholder="Nome do Jogo"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="image"
                value={newGame.image}
                onChange={handleInputChange}
                placeholder="URL da Imagem"
                required
              />
            </div>
            <div className="form-group">
              <textarea
                name="descricao"
                value={newGame.descricao}
                onChange={handleInputChange}
                placeholder="Descrição"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="categoria"
                value={newGame.categoria}
                onChange={handleInputChange}
                placeholder="Categoria"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="link"
                value={newGame.link}
                onChange={handleInputChange}
                placeholder="Link do Jogo"
                required
              />
            </div>
            <button type="submit" className="add-button">
              Adicionar Jogo
            </button>
          </form>
        </div>

        <div className="games-list">
          <h2>Jogos Cadastrados</h2>
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card">
                <img src={game.image} alt={game.nome} />
                <h3>{game.nome}</h3>
                <p>{game.categoria}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-container {
          padding: 2rem;
          color: white;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .dashboard-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 2rem;
        }
        .logout-button {
          background: #ff4444;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
        }
        .dashboard-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
        }
        .add-game-form {
          background: rgba(19, 20, 30, 0.7);
          padding: 2rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-family: 'Poppins', sans-serif;
        }
        .add-button {
          background: #6842ff;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          width: 100%;
          cursor: pointer;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .add-button:hover {
          background: #5636cc;
          transform: translateY(-2px);
        }
        .games-list {
          background: rgba(19, 20, 30, 0.7);
          padding: 2rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
        }
        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .game-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 1rem;
          text-align: center;
        }
        .game-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .game-card h3 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          margin: 0.5rem 0;
        }
        .game-card p {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;