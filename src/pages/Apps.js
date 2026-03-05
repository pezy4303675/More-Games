import React, { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import styles from './Produto.module.css';

const AppItem = ({ app }) => {
  const cover = (Array.isArray(app.slideImages) && app.slideImages.length > 0)
    ? app.slideImages[0]
    : (app.imagem || '');

  return (
    <Link to={`/app/${app.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div 
        id={app.id} 
        className={styles['info-item']} 
        style={{ 
          padding: '1rem', 
          borderBottom: 'none', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '0.75rem' 
        }}
      >
        {cover && (
          <img 
            src={cover} 
            alt={app.titulo} 
            style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 16 }}
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        )}
        <div style={{ width: '100%', textAlign: 'center' }}>
          <LinesEllipsis
            text={app.titulo}
            maxLine={2}
            basedOn="letters"
            component="h2"
            className={styles['info-header']}
          />
        </div>
      </div>
    </Link>
  );
};

function Apps() {
  const [appsList, setAppsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadApps = async () => {
      try {
        let appsData = [];
        try {
          const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));
          const querySnapshot = await getDocs(q);
          appsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        } catch (orderErr) {
          const querySnapshot = await getDocs(collection(db, 'apps'));
          appsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        }
        appsData = appsData.map(app => {
          let slideImages = app.slideImages;
          if (typeof slideImages === 'string') {
            slideImages = slideImages.split(',').map(s => s.trim()).filter(Boolean);
          }
          if (!Array.isArray(slideImages)) slideImages = [];
          return { ...app, slideImages };
        });

        setAppsList(appsData);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os apps:', err);
        setError('Erro ao carregar os apps. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>Carregando apps...</div>;
  if (error) return <div style={{color: 'white', textAlign: 'center', marginTop: '20px'}}>{error}</div>;

  return (
    <div>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>Apps Recentes</h1>
        
        {appsList.length === 0 ? (
             <p style={{color: 'white'}}>Nenhum app encontrado.</p>
        ) : (
            <div className={styles['info-section']} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
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
