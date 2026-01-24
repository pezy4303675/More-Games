import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './Produto.module.css';
import logo from '../imgs/logo.png';

export default function AppDetalhe() {
  const { id } = useParams();
  const db = getFirestore();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avgRating, setAvgRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [ratingSum, setRatingSum] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadApp = async () => {
      try {
        const appRef = doc(db, 'apps', id);
        const snap = await getDoc(appRef);
        if (!snap.exists()) {
          setError('App não encontrada');
          setLoading(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        setApp(data);
        const rSum = typeof data.ratingSum === 'number' ? data.ratingSum : 0;
        const rCount = typeof data.ratingCount === 'number' ? data.ratingCount : 0;
        setRatingSum(rSum);
        setRatingCount(rCount);
        setAvgRating(rCount > 0 ? (rSum / rCount) : 0);
        setLikes(typeof data.likes === 'number' ? data.likes : 0);
        setLiked(localStorage.getItem(`liked_app_${snap.id}`) === '1');
        const storedRating = parseInt(localStorage.getItem(`rated_app_${snap.id}`) || '0', 10);
        setUserRating(storedRating);
        try {
          const cRef = collection(db, 'apps', snap.id, 'comments');
          const qRef = query(cRef, orderBy('createdAt', 'desc'));
          const cSnap = await getDocs(qRef);
          const list = cSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setComments(list);
        } catch (e) {
          console.error('Erro ao carregar comentários do app:', e);
        }
        setLoading(false);
      } catch (e) {
        console.error('Erro ao carregar app:', e);
        setError('Erro ao carregar app');
        setLoading(false);
      }
    };
    loadApp();
  }, [db, id]);

  const handleLike = async () => {
    if (!app) return;
    try {
      const change = liked ? -1 : 1;
      setLiked(!liked);
      setLikes(prev => Math.max(0, prev + change));
      localStorage.setItem(`liked_app_${app.id}`, !liked ? '1' : '0');
      const appRef = doc(db, 'apps', app.id);
      await updateDoc(appRef, { likes: increment(change) });
    } catch (e) {
      console.error('Erro ao curtir app:', e);
    }
  };

  const handleRate = async (stars) => {
    if (!app) return;
    try {
      const appRef = doc(db, 'apps', app.id);
      const prev = parseInt(localStorage.getItem(`rated_app_${app.id}`) || '0', 10);
      if (!prev) {
        await updateDoc(appRef, { ratingSum: increment(stars), ratingCount: increment(1) });
        setRatingSum(s => s + stars);
        setRatingCount(c => c + 1);
        setAvgRating(() => {
          const newSum = ratingSum + stars;
          const newCount = ratingCount + 1;
          return newCount > 0 ? (newSum / newCount) : 0;
        });
      } else {
        const diff = stars - prev;
        await updateDoc(appRef, { ratingSum: increment(diff) });
        setRatingSum(s => s + diff);
        setAvgRating(() => {
          const newSum = ratingSum + diff;
          return Math.max(ratingCount, 1) > 0 ? (newSum / Math.max(ratingCount, 1)) : 0;
        });
      }
      setUserRating(stars);
      localStorage.setItem(`rated_app_${app.id}`, String(stars));
    } catch (e) {
      console.error('Erro ao avaliar app:', e);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!app || !newComment.trim()) return;
    try {
      const cRef = collection(db, 'apps', app.id, 'comments');
      const data = { text: newComment.trim(), createdAt: serverTimestamp() };
      const docRes = await addDoc(cRef, data);
      setComments(prev => [{ id: docRes.id, text: data.text, createdAt: { seconds: Date.now()/1000 } }, ...prev]);
      setNewComment('');
    } catch (e) {
      console.error('Erro ao comentar app:', e);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!app) return <div>App não encontrada</div>;

  const slides = (() => {
    let arr = app.slideImages;
    if (typeof arr === 'string') {
      arr = arr.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (!Array.isArray(arr) || arr.length === 0) {
      return app.imagem ? [app.imagem] : [];
    }
    return arr;
  })();

  return (
    <div className={styles['produto-container']}>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>{app.titulo}</h1>
        {slides.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '1rem', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
            <img 
              src={slides[currentSlide]} 
              alt={app.titulo} 
              className={styles['post-image']}
              style={{ width: '100%', height: 'auto', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            {slides.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
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
                  onClick={() => setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
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

        <div className={styles['info-section']}>
          <h2 className={styles['info-header']}>Descrição</h2>
          <p className={styles.description}>{app.conteudo}</p>
        </div>

        <div className={styles['info-section']}>
          <h2 className={styles['info-header']}>Ações</h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={handleLike}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '10px 14px', background: liked ? '#ff4d6d' : '#6842ff', color: 'white', border: liked ? 'none' : '1px solid #8b6dff', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
            >
              <Heart size={18} color="#fff" fill={liked ? '#ff4d6d' : 'none'} /> {liked ? 'Curtido' : 'Curtir'} ({likes})
            </button>
            {app.downloadLink && (
              <a 
                href={app.downloadLink} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'inline-block', padding: '10px 14px', backgroundColor: '#6842ff', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}
              >
                Baixar App
              </a>
            )}
          </div>
        </div>

        <div className={styles['info-section']}>
          <h2 className={styles['info-header']}>Avaliação</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  onClick={() => handleRate(n)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: n <= (userRating || Math.round(avgRating)) ? '#ffd166' : '#777', fontSize: '1.4rem' }}
                  aria-label={`Avaliar com ${n} estrela${n>1?'s':''}`}
                >
                  ★
                </button>
              ))}
            </div>
            <div style={{ color: '#fff' }}>
              {avgRating.toFixed(1)} / 5 ({ratingCount} avaliações)
            </div>
          </div>
        </div>

        <div className={styles['info-section']}>
          <h2 className={styles['info-header']}>Comentários</h2>
          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
            />
            <button type="submit" style={{ padding: '0.8rem 1rem', borderRadius: '8px', background: '#6842ff', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Comentar
            </button>
          </form>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {comments.length === 0 && <div style={{ color: '#bbb' }}>Seja o primeiro a comentar.</div>}
            {comments.map(c => (
              <div key={c.id} style={{ background: 'rgba(19,20,30,0.9)', borderRadius: '8px', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ color: '#fff' }}>{c.text}</div>
                <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  {c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleString('pt-BR') : 'Agora'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles['footer-content']}>
          <img width="150" src={logo} alt="More Games Logo" draggable="false" />
          <div className={styles['footer-links']}>
            <Link to="/privacidade" className={styles['footer-link']}>Política de privacidade</Link>
            <Link to="/contacto" className={styles['footer-link']}>Contato</Link>
            <Link to="/sobre" className={styles['footer-link']}>Sobre</Link>
          </div>
        </div>
        <h3 className={styles.copyright}>© 2025 More Games. Todos direitos reservados.</h3>
      </div>
    </div>
  );
}
