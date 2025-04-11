import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function Dashboard() {
  const [newGame, setNewGame] = useState({
    nome: '',
    image: '',
    descricao: '',
    creditos: '',
    tags: [],
    tecnologia: '',
    plataforma: '',
    lancado: '',
    link: ''
  });
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const db = getFirestore();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'games'));
        const gamesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGames(gamesData);
      } catch (error) {
        console.error('Erro ao carregar jogos:', error);
      }
    };
    fetchGames();
  }, [db]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'games'), {
        ...newGame,
        createdAt: new Date()
      });
      const gameToAdd = {
        ...newGame,
        id: docRef.id
      };
      setGames(prev => [...prev, gameToAdd]);
      setNewGame({
        nome: '',
        image: '',
        descricao: '',
        creditos: '',
        tags: [],
        tecnologia: '',
        plataforma: '',
        lancado: '',
        link: ''
      });
      toast.success('Jogo adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar jogo:', error);
      toast.error('Erro ao adicionar jogo. Tente novamente.');
    }
  };

  const handleDelete = async (gameId) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      try {
        await deleteDoc(doc(db, 'games', gameId));
        setGames(prev => prev.filter(game => game.id !== gameId));
        toast.success('Jogo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir jogo:', error);
        toast.error('Erro ao excluir jogo. Tente novamente.');
      }
    }
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
                name="creditos"
                value={newGame.creditos}
                onChange={handleInputChange}
                placeholder="Créditos (desenvolvedor/estúdio)"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="tags"
                value={newGame.tags.join(', ')}
                onChange={(e) => setNewGame(prev => ({
                  ...prev,
                  tags: e.target.value.split(',').map(tag => tag.trim())
                }))}
                placeholder="Tags (separadas por vírgula)"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="tecnologia"
                value={newGame.tecnologia}
                onChange={handleInputChange}
                placeholder="Tecnologia (ex: HTML5, Unity WebGL)"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="plataforma"
                value={newGame.plataforma}
                onChange={handleInputChange}
                placeholder="Plataforma (ex: Browser, mobile, tablet)"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="lancado"
                value={newGame.lancado}
                onChange={handleInputChange}
                placeholder="Data de lançamento"
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
                <img src={game.image} alt={game.nome} className="game-image" draggable="false" />
                <div className="game-info">
                  <h3>{game.nome}</h3>
                  <div className="game-description">{game.descricao}</div>
                  <div className="game-details">
                    <p><strong>Créditos:</strong> {game.creditos}</p>
                    <p><strong>Tecnologia:</strong> {game.tecnologia}</p>
                    <p><strong>Plataforma:</strong> {game.plataforma}</p>
                    <p><strong>Lançamento:</strong> {game.lancado}</p>
                  </div>
                  <div className="game-tags">
                    {game.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="delete-button"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />

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
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .game-card {
          background: rgba(19, 20, 30, 0.7);
          border-radius: 1rem;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }
        .game-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 25px rgba(104, 66, 255, 0.2);
        }
        .game-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .game-info {
          padding: 1.25rem;
        }
        .game-info h3 {
          margin: 0 0 0.75rem 0;
          font-size: 1.2rem;
          color: #fff;
        }
        .game-description {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .game-details {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 1rem;
        }
        .game-details p {
          margin: 0.25rem 0;
        }
        .game-details strong {
          color: rgba(255, 255, 255, 0.9);
        }
        .game-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tag {
          background: rgba(104, 66, 255, 0.2);
          color: #6842ff;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;