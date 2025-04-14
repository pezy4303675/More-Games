import logo from '../imgs/logo.png';
import { posts } from './posts';
import styles from './Produto.module.css';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Postes() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const foundPost = posts.find(p => p.id === parseInt(id));
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Post não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar o post');
      console.error('Erro ao processar o post:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!post) return <div>Post não encontrado</div>;

  return (
    <div className={styles['produto-container']}>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>{post.nome}</h1>
        
        <div className={styles['info-section']}>
          <div className={styles['info-item']}>
            <img 
              src={post.image} 
              alt={post.nome} 
              className={styles['post-image']}
              style={{ width: '100%', height: 'auto', maxHeight: '400px' }}
              loading="lazy"
            />
            <br/>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Créditos:</span>
              <span className={styles['info-value']}>{post.author}</span>
            </div>
            
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Data:</span>
              <span className={styles['info-value']}>
                {new Date(post.date).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Descrição:</span>
              <span className={styles['info-value']}>{post.description}</span>
            </div>


            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tags:</span>
              <div className={styles['tag-container']}>
                {post.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

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
