import logo from '../imgs/logo.png';
import { jogosdown } from './jogosdown';
import styles from './Produto.module.css';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Jogosdownload() {
  const { id } = useParams();
  const [jogos, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const foundJogos = jogosdown.find(p => p.id === parseInt(id));
      if (foundJogos) {
        setPost(foundJogos);
      } else {
        setError('Jogo não encontrado');
      }
    } catch (err) {
      setError('Erro ao carregar o jogo');
      console.error('Erro ao processar o jogo:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!jogos) return <div>Jogo não encontrado</div>;

  return (
    <div className={styles['produto-container']}>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>{jogos.nome}</h1>
        
        <div className={styles['info-section']}>
          <div className={styles['info-item']}>
            <img 
              src={jogos.image} 
              alt={jogos.nome} 
              className={styles['post-image']}
              style={{ width: '100%', height: 'auto', maxHeight: '400px' }}
              loading="lazy"
            />
            <br/>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Créditos:</span>
              <span className={styles['info-value']}>{jogos.author}</span>
            </div>
            
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Data:</span>
              <span className={styles['info-value']}>
                {new Date(jogos.date).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Descrição:</span>
              <span className={styles['info-value']}>{jogos.description}</span>
            </div>


            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tags:</span>
              <div className={styles['tag-container']}>
                {jogos.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Baixar:</span>
              <button className={styles['dsdadada']}><a href={jogos.link} download>Download</a></button>
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
