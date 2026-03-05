import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Trash2, LogOut, Plus, Save, X, Heart, Eye } from 'lucide-react';

import AddRewardForm from '../components/AddRewardForm';

import RedeemCodeManager from '../components/RedeemCodeManager';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('games');
  
  // Games State
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
  const [editingGame, setEditingGame] = useState(null);
  const [analyticsGames, setAnalyticsGames] = useState([]);

  // News State
  const [newNews, setNewNews] = useState({
    titulo: '',
    imagem: '',
    conteudo: '',
    downloadLink: '',
    slideImages: '' // Stores comma-separated URLs for the form
  });
  const [newsList, setNewsList] = useState([]);
  const [editingNews, setEditingNews] = useState(null);

  // Rewards State
  const [rewards, setRewards] = useState([]);
  const [editingReward, setEditingReward] = useState(null);

  const navigate = useNavigate();

  // Authentication Check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch Data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (activeTab === 'games') {
          const querySnapshot = await getDocs(collection(db, 'games'));
          const gamesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setGames(gamesData);
        } else if (activeTab === 'news') {
          const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));
          // Fallback if index not created yet, simpler query
          try {
             const querySnapshot = await getDocs(q);
             const newsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
             }));
             setNewsList(newsData);
          } catch (e) {
             console.warn("Index may be missing, fetching without order", e);
             const querySnapshot = await getDocs(collection(db, 'apps'));
             const newsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
             }));
             setNewsList(newsData);
          }
        } else if (activeTab === 'analytics') {
          const querySnapshot = await getDocs(collection(db, 'games'));
          const gamesData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAnalyticsGames(gamesData);
        } else if (activeTab === 'rewards') {
          const querySnapshot = await getDocs(collection(db, 'rewards'));
          const rewardsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setRewards(rewardsData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, [db, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // Games Handlers
  const handleGameInputChange = (e) => {
    const { name, value } = e.target;
    if (editingGame) {
        setEditingGame(prev => ({ ...prev, [name]: value }));
    } else {
        setNewGame(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGameSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGame) {
          const gameRef = doc(db, 'games', editingGame.id);
          const { id, ...gameData } = editingGame;
          await updateDoc(gameRef, gameData);
          setGames(prev => prev.map(g => g.id === id ? editingGame : g));
          setEditingGame(null);
          toast.success('Jogo atualizado com sucesso!');
      } else {
          const docRef = await addDoc(collection(db, 'games'), {
            ...newGame,
            createdAt: new Date()
          });
          setGames(prev => [...prev, { ...newGame, id: docRef.id }]);
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
      }
    } catch (error) {
      console.error('Erro ao salvar jogo:', error);
      toast.error('Erro ao salvar jogo.');
    }
  };

  const handleGameDelete = async (gameId) => {
    if (window.confirm('Tem certeza que deseja excluir este jogo?')) {
      try {
        await deleteDoc(doc(db, 'games', gameId));
        setGames(prev => prev.filter(game => game.id !== gameId));
        toast.success('Jogo excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir jogo:', error);
        toast.error('Erro ao excluir jogo.');
      }
    }
  };

  const startEditGame = (game) => {
      setEditingGame(game);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditGame = () => {
      setEditingGame(null);
  };

  // News Handlers
  const handleNewsInputChange = (e) => {
    const { name, value } = e.target;
    if (editingNews) {
        setEditingNews(prev => ({ ...prev, [name]: value }));
    } else {
        setNewNews(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process slide images from string to array
      const processSlides = (slidesStr) => {
        if (!slidesStr) return [];
        if (Array.isArray(slidesStr)) return slidesStr; // Already array (shouldn't happen with form logic but safe)
        return slidesStr.split(',').map(s => s.trim()).filter(s => s);
      };

      if (editingNews) {
          const newsRef = doc(db, 'apps', editingNews.id);
          const { id, ...newsData } = editingNews;
          
          // Ensure slideImages is saved as array
          const finalData = {
            ...newsData,
            slideImages: processSlides(newsData.slideImages)
          };

          await updateDoc(newsRef, finalData);
          
          // Update local list - keep slideImages as array for display, but form uses string
          // We need to fetch or reconstruct the object correctly
          setNewsList(prev => prev.map(n => n.id === id ? { ...finalData, id } : n));
          setEditingNews(null);
          toast.success('App atualizado com sucesso!');
      } else {
          const slides = processSlides(newNews.slideImages);
          const docData = {
            ...newNews,
            slideImages: slides,
            createdAt: new Date()
          };

          const docRef = await addDoc(collection(db, 'apps'), docData);
          setNewsList(prev => [{ ...docData, id: docRef.id, createdAt: { seconds: Date.now() / 1000 } }, ...prev]);
          setNewNews({
            titulo: '',
            imagem: '',
            conteudo: '',
            downloadLink: '',
            slideImages: ''
          });
          toast.success('App postado com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar app:', error);
      toast.error('Erro ao salvar app.');
    }
  };

  const handleNewsDelete = async (newsId) => {
    if (window.confirm('Tem certeza que deseja excluir este app?')) {
      try {
        await deleteDoc(doc(db, 'apps', newsId));
        setNewsList(prev => prev.filter(item => item.id !== newsId));
        toast.success('App excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir app:', error);
        toast.error('Erro ao excluir app.');
      }
    }
  };

  const startEditNews = (news) => {
      // Convert array of slides back to comma-separated string for editing
      const slideImagesStr = Array.isArray(news.slideImages) 
          ? news.slideImages.join(', ') 
          : (news.slideImages || '');
      
      setEditingNews({
          ...news,
          slideImages: slideImagesStr
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditNews = () => {
      setEditingNews(null);
  };

  // Rewards Handlers
  const handleRewardDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta recompensa?')) {
      try {
        await deleteDoc(doc(db, 'rewards', id));
        setRewards(prev => prev.filter(r => r.id !== id));
        toast.success('Recompensa excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir:', error);
        toast.error('Erro ao excluir recompensa.');
      }
    }
  };

  const startEditReward = (reward) => {
    setEditingReward(reward);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onRewardFinish = () => {
    setEditingReward(null);
    // Refresh rewards list
    const fetchRewards = async () => {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      setRewards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchRewards();
  };

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px', backdropFilter: 'blur(10px)' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', background: 'linear-gradient(90deg, #fff, #aaa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</h1>
        <button 
          onClick={handleLogout}
          style={{ ...buttonStyle, background: '#ff4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <LogOut size={18} /> Sair
        </button>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => { setActiveTab('games'); setEditingGame(null); }}
          style={{
            ...tabButtonStyle,
            background: activeTab === 'games' ? '#6842ff' : 'rgba(255,255,255,0.1)',
            border: activeTab === 'games' ? '1px solid #8b6dff' : '1px solid transparent'
          }}
        >
          Gerenciar Jogos
        </button>
        <button 
          onClick={() => { setActiveTab('news'); setEditingNews(null); }}
          style={{
            ...tabButtonStyle,
            background: activeTab === 'news' ? '#6842ff' : 'rgba(255,255,255,0.1)',
            border: activeTab === 'news' ? '1px solid #8b6dff' : '1px solid transparent'
          }}
        >
          Gerenciar Apps
        </button>
        <button 
          onClick={() => { setActiveTab('analytics'); }}
          style={{
            ...tabButtonStyle,
            background: activeTab === 'analytics' ? '#6842ff' : 'rgba(255,255,255,0.1)',
            border: activeTab === 'analytics' ? '1px solid #8b6dff' : '1px solid transparent'
          }}
        >
          Análises
        </button>
        <button 
          onClick={() => { setActiveTab('rewards'); }}
          style={{
            ...tabButtonStyle,
            background: activeTab === 'rewards' ? '#6842ff' : 'rgba(255,255,255,0.1)',
            border: activeTab === 'rewards' ? '1px solid #8b6dff' : '1px solid transparent'
          }}
        >
          Gerenciar Recompensas
        </button>
        <button 
          onClick={() => { setActiveTab('redeemCodes'); }}
          style={{
            ...tabButtonStyle,
            background: activeTab === 'redeemCodes' ? '#6842ff' : 'rgba(255,255,255,0.1)',
            border: activeTab === 'redeemCodes' ? '1px solid #8b6dff' : '1px solid transparent'
          }}
        >
          Códigos de Resgate
        </button>
      </div>

      <div style={{ background: 'rgba(20, 20, 30, 0.6)', padding: '2rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
        {activeTab === 'games' ? (
          <div>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {editingGame ? <><Edit size={24} color="#6842ff" /> Editar Jogo</> : <><Plus size={24} color="#6842ff" /> Adicionar Novo Jogo</>}
                </h2>
                <form onSubmit={handleGameSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <input name="nome" value={editingGame ? editingGame.nome : newGame.nome} onChange={handleGameInputChange} placeholder="Nome do Jogo" required style={inputStyle} />
                    <input name="image" value={editingGame ? editingGame.image : newGame.image} onChange={handleGameInputChange} placeholder="URL da Imagem" required style={inputStyle} />
                    <input name="author" value={editingGame ? editingGame.author : newGame.author} onChange={handleGameInputChange} placeholder="Autor/Créditos" style={inputStyle} />
                    <input name="tecnologia" value={editingGame ? editingGame.tecnologia : newGame.tecnologia} onChange={handleGameInputChange} placeholder="Tecnologia" style={inputStyle} />
                    <input name="plataforma" value={editingGame ? editingGame.plataforma : newGame.plataforma} onChange={handleGameInputChange} placeholder="Plataforma" style={inputStyle} />
                    <input name="lancado" value={editingGame ? editingGame.lancado : newGame.lancado} onChange={handleGameInputChange} placeholder="Data de Lançamento" style={inputStyle} />
                    <input name="link" value={editingGame ? editingGame.link : newGame.link} onChange={handleGameInputChange} placeholder="Link do Jogo" style={inputStyle} />
                    <textarea name="descricao" value={editingGame ? editingGame.descricao : newGame.descricao} onChange={handleGameInputChange} placeholder="Descrição" required style={{...inputStyle, minHeight: '100px', gridColumn: '1 / -1'}} />
                    
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{...buttonStyle, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                            <Save size={18} /> {editingGame ? 'Atualizar Jogo' : 'Adicionar Jogo'}
                        </button>
                        {editingGame && (
                            <button type="button" onClick={cancelEditGame} style={{...buttonStyle, background: '#555', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                                <X size={18} /> Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Jogos Cadastrados ({games.length})</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {games.map(game => (
                <div key={game.id} style={cardStyle}>
                  <img src={game.image} alt={game.nome} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{game.nome}</h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{game.descricao}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditGame(game)} style={{...actionButtonStyle, background: '#4CAF50'}}>
                            <Edit size={16} /> Editar
                        </button>
                        <button onClick={() => handleGameDelete(game.id)} style={{...actionButtonStyle, background: '#ff4444'}}>
                            <Trash2 size={16} /> Excluir
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'news' ? (
          <div>
             <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {editingNews ? <><Edit size={24} color="#6842ff" /> Editar App</> : <><Plus size={24} color="#6842ff" /> Adicionar Novo App</>}
                </h2>
                <form onSubmit={handleNewsSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <input name="titulo" value={editingNews ? editingNews.titulo : newNews.titulo} onChange={handleNewsInputChange} placeholder="Nome do App" required style={inputStyle} />
                    <input name="imagem" value={editingNews ? editingNews.imagem : newNews.imagem} onChange={handleNewsInputChange} placeholder="URL da Imagem (Opcional)" style={inputStyle} />
                    <input name="downloadLink" value={editingNews ? editingNews.downloadLink : newNews.downloadLink} onChange={handleNewsInputChange} placeholder="Link de Download" required style={{...inputStyle, gridColumn: '1 / -1'}} />
                    <textarea name="slideImages" value={editingNews ? editingNews.slideImages : newNews.slideImages} onChange={handleNewsInputChange} placeholder="URLs das Imagens do Slide (separadas por vírgula)" style={{...inputStyle, gridColumn: '1 / -1', minHeight: '80px'}} />
                    <textarea name="conteudo" value={editingNews ? editingNews.conteudo : newNews.conteudo} onChange={handleNewsInputChange} placeholder="Descrição do App" required style={{...inputStyle, minHeight: '200px', gridColumn: '1 / -1'}} />
                    
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" style={{...buttonStyle, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                            <Save size={18} /> {editingNews ? 'Atualizar App' : 'Publicar App'}
                        </button>
                         {editingNews && (
                            <button type="button" onClick={cancelEditNews} style={{...buttonStyle, background: '#555', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
                                <X size={18} /> Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Apps Cadastrados ({newsList.length})</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {newsList.map(news => {
                const displayImage = news.imagem || (news.slideImages && news.slideImages.length > 0 ? news.slideImages[0] : null);
                return (
                <div key={news.id} style={cardStyle}>
                  {displayImage && <img src={displayImage} alt={news.titulo} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />}
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{news.titulo}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '1rem' }}>
                        {news.createdAt?.seconds ? new Date(news.createdAt.seconds * 1000).toLocaleDateString() : 'Data N/A'}
                    </div>
                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditNews(news)} style={{...actionButtonStyle, background: '#4CAF50'}}>
                            <Edit size={16} /> Editar
                        </button>
                        <button onClick={() => handleNewsDelete(news.id)} style={{...actionButtonStyle, background: '#ff4444'}}>
                            <Trash2 size={16} /> Excluir
                        </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'analytics' ? (
          <div>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Painel de Análises</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '2rem' }}>
              <div style={{ ...cardStyle, padding: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Eye size={20} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#bbb' }}>Visualizações</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                      {analyticsGames.reduce((sum, g) => sum + (typeof g.views === 'number' ? g.views : 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ ...cardStyle, padding: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Heart size={20} />
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#bbb' }}>Curtidas</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                      {analyticsGames.reduce((sum, g) => sum + (typeof g.likes === 'number' ? g.likes : 0), 0)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ ...cardStyle, padding: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#bbb' }}>Jogos</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{analyticsGames.length}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div style={{ ...cardStyle }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  Top por Visualizações
                </div>
                <div style={{ padding: '0.5rem 1rem' }}>
                  {analyticsGames
                    .slice()
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((g) => (
                      <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>{g.nome}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Eye size={16} /> {typeof g.views === 'number' ? g.views : 0}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <div style={{ ...cardStyle }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  Top por Curtidas
                </div>
                <div style={{ padding: '0.5rem 1rem' }}>
                  {analyticsGames
                    .slice()
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .slice(0, 5)
                    .map((g) => (
                      <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>{g.nome}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Heart size={16} /> {typeof g.likes === 'number' ? g.likes : 0}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'rewards' ? (
          <div>
            <div style={{ marginBottom: '3rem' }}>
              <AddRewardForm rewardToEdit={editingReward} onFinish={onRewardFinish} />
            </div>

            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Recompensas Cadastradas ({rewards.length})</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {rewards.map(reward => (
                <div key={reward.id} style={cardStyle}>
                  <img src={reward.image} alt={reward.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{reward.title}</h3>
                    <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{reward.value}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.8rem', color: '#ccc' }}>
                      <span>Custo: {reward.requiredHours}h</span>
                      <span>Estoque: {reward.availableCount}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditReward(reward)} style={{...actionButtonStyle, background: '#4CAF50'}}>
                            <Edit size={16} /> Editar
                        </button>
                        <button onClick={() => handleRewardDelete(reward.id)} style={{...actionButtonStyle, background: '#ff4444'}}>
                            <Trash2 size={16} /> Excluir
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'redeemCodes' ? (
          <div>
            <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Gerenciar Códigos de Resgate</h2>
            <RedeemCodeManager />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '1rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  width: '100%',
  fontSize: '1rem',
  transition: 'border-color 0.3s',
  outline: 'none'
};

const buttonStyle = {
  padding: '0.8rem 1.5rem',
  background: '#6842ff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'transform 0.2s, background 0.2s'
};

const tabButtonStyle = {
    padding: '1rem 2rem',
    color: 'white',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    flex: 1
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.05)',
  overflow: 'hidden',
  transition: 'transform 0.2s',
  display: 'flex',
  flexDirection: 'column'
};

const actionButtonStyle = {
  padding: '0.5rem',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.9rem',
  fontWeight: '500'
};

export default Dashboard;
