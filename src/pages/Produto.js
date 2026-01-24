import { Link, useParams } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { Heart, Eye } from 'lucide-react';
import logo from '../imgs/logo.png';
import styles from './Produto.module.css';

export default function Produto() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const db = getFirestore();
    const frameContainerRef = useRef(null);

    useEffect(() => {
        const handleFsChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFsChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFsChange);
        };
    }, []);

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const docRef = doc(db, 'games', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = { id: docSnap.id, ...docSnap.data() };
                    setProduto(data);
                    setLikes(typeof data.likes === 'number' ? data.likes : 0);
                    setViews(typeof data.views === 'number' ? data.views : 0);
                    setLiked(localStorage.getItem(`liked_game_${docSnap.id}`) === '1');
                    const viewedKey = `viewed_game_${docSnap.id}`;
                    const sessionKey = `viewed_session_${docSnap.id}`;
                    const lastViewed = parseInt(localStorage.getItem(viewedKey) || '0', 10);
                    const sessionMarked = sessionStorage.getItem(sessionKey) === '1';
                    const now = Date.now();
                    const dayMs = 24 * 60 * 60 * 1000;
                    if (!sessionMarked && (!lastViewed || now - lastViewed >= dayMs)) {
                        // Marca imediatamente para evitar execução duplicada em StrictMode
                        sessionStorage.setItem(sessionKey, '1');
                        localStorage.setItem(viewedKey, String(now));
                        try {
                            await updateDoc(docRef, { views: increment(1) });
                            setViews(prev => prev + 1);
                        } catch (err) {
                            console.error('Erro ao incrementar views:', err);
                            // Em caso de erro, limpa as marcas
                            sessionStorage.removeItem(sessionKey);
                            localStorage.removeItem(viewedKey);
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar o jogo:', error);
                setLoading(false);
            }
        };
        
        fetchProduto();
    }, [id, db]);

    const handleLike = async (e) => {
        e.preventDefault();
        if (!produto) return;
        try {
            const change = liked ? -1 : 1;
            setLiked(!liked);
            setLikes(prev => Math.max(0, prev + change));
            localStorage.setItem(`liked_game_${produto.id}`, !liked ? '1' : '0');
            const docRef = doc(db, 'games', produto.id);
            await updateDoc(docRef, { likes: increment(change) });
        } catch (err) {
            setLiked(liked);
            setLikes(prev => prev);
            console.error('Erro ao atualizar curtidas:', err);
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (!produto) return <p>Produto não encontrado.</p>;
  
    return (
      <div className={styles['produto-container']}>
        <div ref={frameContainerRef} style={{ position: 'relative' }}>
          <iframe 
            src={produto.link} 
            className={`${styles['game-frame']} ${isFullscreen ? styles['game-frame-fullscreen'] : ''}`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad *;"
            allowFullScreen
            loading="lazy"
            title={produto.nome}
            onLoad={(e) => {
              try {
                const frame = e.target;
                const handleMediaElements = () => {
                  try {
                    const mediaElements = frame.contentWindow.document.querySelectorAll('video, audio');
                    mediaElements.forEach(media => {
                      media.addEventListener('play', () => {
                        media.playbackRate = 1;
                        media.volume = 1;
                      });
                      media.addEventListener('error', () => {
                        media.load();
                      });
                      media.addEventListener('pause', (event) => {
                        if (!event.isTrusted) {
                          media.play().catch(() => {});
                        }
                      });
                    });
                  } catch {}
                };
                handleMediaElements();
                const observer = new MutationObserver(handleMediaElements);
                observer.observe(frame.contentWindow.document.body, {
                  childList: true,
                  subtree: true
                });
              } catch {}
            }}
          ></iframe>
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', pointerEvents: 'auto' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Eye size={18} color="#fff" /> <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{views}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Heart size={18} color="#fff" fill={liked ? '#ff4d6d' : 'none'} /> <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{likes}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', pointerEvents: 'auto' }}>
              <button 
                onClick={handleLike}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 14px',
                  background: liked ? '#ff4d6d' : '#6842ff',
                  color: 'white',
                  border: liked ? 'none' : '1px solid #8b6dff',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}
              >
                <Heart size={18} color="#fff" fill={liked ? '#ff4d6d' : 'none'} /> {liked ? 'Curtido' : 'Curtir'}
              </button>
              <button
                onClick={() => {
                  const el = frameContainerRef.current;
                  if (!el) return;
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else if (el.requestFullscreen) {
                    el.requestFullscreen();
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.6)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.95rem'
                }}
              >
                {document.fullscreenElement ? 'Sair da tela cheia' : 'Tela cheia'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles['info-container']}>
          <h1 className={styles['game-title']}>{produto.nome}</h1>
          
          <div className={styles['info-section']}>
            <h2 className={styles['info-header']}>Informações</h2>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Créditos:</span>
              <span className={styles['info-value']}>{produto.creditos}</span>
            </div>
            
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tags:</span>
              <div className={styles['tag-container']}>
                {produto.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tecnologia:</span>
              <span className={styles['info-value']}>{produto.tecnologia}</span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Plataforma:</span>
              <span className={styles['info-value']}>{produto.plataforma}</span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Lançamento:</span>
              <span className={styles['info-value']}>{produto.lancado}</span>
            </div>
          </div>

          <div className={styles['info-section']}>
            <h2 className={styles['info-header']}>Descrição</h2>
            <p className={styles.description}>{produto.descricao}</p>
          </div>
        </div>

<br/>

        <div className={styles['about-section']}>
          <h2 className={styles['info-header']}>Sobre o More Games</h2>
          <p className={styles.description}>
            <span className={styles.highlight}>More Games</span> é um site independente de jogos de navegador, 
            criado com paixão e dedicação por apenas uma pessoa: 
            <span className={styles.highlight}> Daniel Alfredo Nunes</span>. 
            Lançado em <span className={styles.highlight}>9 de abril de 2025</span>, 
            o objetivo do site é oferecer uma experiência divertida, acessível e sem complicações 
            para quem ama jogar direto do navegador, sem precisar baixar nada.
            <br/><br/>
            Aqui, cada jogo é escolhido ou desenvolvido com cuidado, pensando em trazer variedade 
            e entretenimento para todas as idades. Seja você fã de ação, estratégia, puzzle ou jogos casuais, 
            o <span className={styles.highlight}>More Games</span> tem sempre algo novo para experimentar.
            <br/><br/>
            Este projeto nasceu da vontade de criar um espaço leve e divertido, onde qualquer pessoa pode 
            relaxar e se divertir com apenas alguns cliques. Como é mantido por uma única pessoa, o site 
            está em constante evolução — e toda sugestão ou apoio faz a diferença!
            <br/><br/>
            Obrigado por fazer parte dessa jornada. Divirta-se, jogue e volte sempre!
          </p>
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
