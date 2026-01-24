import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, orderBy, query, updateDoc, doc, increment } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './Produto.module.css';

const AppItem = ({ app }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [likes, setLikes] = useState(typeof app.likes === 'number' ? app.likes : 0);
  const [liked, setLiked] = useState(() => localStorage.getItem(`liked_app_${app.id}`) === '1');
  // Prepare slides: use slideImages if available, otherwise fallback to imagem, otherwise empty
  const slides = (app.slideImages && app.slideImages.length > 0) 
    ? app.slideImages 
    : (app.imagem ? [app.imagem] : []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const db = getFirestore();
      const appRef = doc(db, 'apps', app.id);
      const change = liked ? -1 : 1;
      setLiked(!liked);
      setLikes(prev => Math.max(0, prev + change));
      localStorage.setItem(`liked_app_${app.id}`, !liked ? '1' : '0');
      await updateDoc(appRef, { likes: increment(change) });
    } catch (err) {
      // Revert on error
      setLiked(liked);
      setLikes(typeof app.likes === 'number' ? app.likes : 0);
      localStorage.setItem(`liked_app_${app.id}`, liked ? '1' : '0');
      console.error('Erro ao atualizar curtidas:', err);
      toast.error('Não foi possível registrar sua curtida.');
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const url = `${window.location.origin}/apps#${app.id}`;
      const shareData = {
        title: app.titulo || 'App',
        text: app.conteudo ? `${app.titulo} — ${app.conteudo.slice(0, 100)}...` : app.titulo,
        url: app.downloadLink || url
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copiado para a área de transferência!');
      } else {
        window.prompt('Copie o link do app:', shareData.url);
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      toast.error('Não foi possível compartilhar.');
    }
  };

  return (
    <div id={app.id} className={styles['info-item']} style={{marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        <div className={styles['post-content']}>
        {slides.length > 0 && (
            <div style={{ position: 'relative', marginBottom: '1rem', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                <img 
                    src={slides[currentSlide]} 
                    alt={app.titulo} 
                    className={styles['post-image']}
                    style={{
                        maxHeight: '300px', 
                        objectFit: 'cover', 
                        width: '100%', 
                        display: 'block'
                    }}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                    }}
                />
                
                {slides.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.preventDefault(); prevSlide(); }}
                            style={{ 
                                position: 'absolute', 
                                left: '10px', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                background: 'rgba(0,0,0,0.6)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                                zIndex: 10
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); nextSlide(); }}
                            style={{ 
                                position: 'absolute', 
                                right: '10px', 
                                top: '50%', 
                                transform: 'translateY(-50%)', 
                                background: 'rgba(0,0,0,0.6)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '50%', 
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                                zIndex: 10
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                        >
                            <ChevronRight size={24} />
                        </button>
                        
                        <div style={{ 
                            position: 'absolute', 
                            bottom: '15px', 
                            left: '50%', 
                            transform: 'translateX(-50%)', 
                            display: 'flex', 
                            gap: '8px',
                            background: 'rgba(0,0,0,0.3)',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            zIndex: 10
                        }}>
                            {slides.map((_, index) => (
                                <div 
                                    key={index} 
                                    style={{ 
                                        width: '8px', 
                                        height: '8px', 
                                        borderRadius: '50%', 
                                        background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.4)',
                                        cursor: 'pointer'
                                    }} 
                                    onClick={() => setCurrentSlide(index)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        )}
        <div className={styles['post-details']}>
            <h2 className={styles['info-header']} style={{fontSize: '1.8rem'}}>{app.titulo}</h2>
            
            <div className={styles['post-meta']} style={{marginBottom: '1rem', color: '#aaa', fontSize: '0.9rem'}}>
            <span>
                {app.createdAt?.seconds ? new Date(app.createdAt.seconds * 1000).toLocaleDateString('pt-BR') : 'Data desconhecida'}
            </span>
            </div>

            <div className={styles['post-description']} style={{color: '#ddd', whiteSpace: 'pre-wrap', marginBottom: '1rem'}}>
                {app.conteudo}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleLike}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '8px 12px',
                  background: liked ? '#ff4d6d' : 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <Heart size={18} strokeWidth={2} color="#fff" fill={liked ? '#ff4d6d' : 'none'} /> {liked ? 'Curtido' : 'Curtir'}
              </button>
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>{likes} curtidas</span>
              <button 
                onClick={handleShare}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.12)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                <Share2 size={18} /> Compartilhar
              </button>
            </div>
            
            {app.downloadLink && (
                <a 
                    href={app.downloadLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#6842ff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                >
                    Baixar App
                </a>
            )}
        </div>
        </div>
    </div>
  );
};

function Apps() {
  const [appsList, setAppsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const loadApps = async () => {
      try {
        const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const appsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAppsList(appsData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os apps:', err);
        try {
            const querySnapshot = await getDocs(collection(db, 'apps'));
            const appsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAppsList(appsData);
            setLoading(false);
        } catch (retryErr) {
             setError('Erro ao carregar os apps. Por favor, tente novamente mais tarde.');
             setLoading(false);
        }
      }
    };

    loadApps();
  }, [db]);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>Carregando apps...</div>;
  if (error) return <div style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>{error}</div>;

  return (
    <div>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>Apps Recentes</h1>
        
        {appsList.length === 0 ? (
             <p style={{color: 'white'}}>Nenhum app encontrado.</p>
        ) : (
            <div className={styles['info-section']}>
            {appsList.map((app) => (
                <AppItem key={app.id} app={app} />
            ))}
            </div>
        )}
      </div>
    </div>
  );
}

export default Apps;
