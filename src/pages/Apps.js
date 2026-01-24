import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Produto.module.css';

const AppItem = ({ app }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
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
