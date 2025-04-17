import React, { useState, useEffect } from "react";
import { jogosdown } from './jogosdown';
import { Link } from 'react-router-dom';
import LinesEllipsis from 'react-lines-ellipsis';
import styles from './Produto.module.css';

function Pagames() {
  const [jogosList, setJogosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadJogos = () => {
      try {
        if (!Array.isArray(jogosdown) || !jogosdown.every(jogo => 
          jogo && 
          typeof jogo === 'object' && 
          'id' in jogo && 
          'nome' in jogo && 
          'image' in jogo && 
          'date' in jogo && 
          'author' in jogo && 
          'description' in jogo
        )) {
          throw new Error('Formato dos jogos inválido');
        }
        setJogosList(jogosdown);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os jogos:', err);
        setError('Erro ao carregar os jogos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadJogos();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div className="ifofr" id="popo">
        <ul>
          <li><p>Mais Jogos – Jogue grátis, sem login! Diversão instantânea com bolsas de jogos online direto no navegador. Sem downloads, sem cadastro. É só entrar e jogar!</p></li> 
        </ul>
      </div>
      <script async="async" data-cfasync="false" src="//pl26352511.profitableratecpm.com/a96b05239a81b8fdd6c3c31c19786788/invoke.js"></script>
      <div id="container-a96b05239a81b8fdd6c3c31c19786788"></div>
      <br/>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>Jogos prontos para baixar!</h1>
        <div className={styles['info-section']}>
          {jogosList.map((jogo) => (
            <div key={jogo.id} className={styles['info-item']}>
              <Link to={`/jogos/${jogo.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles['post-content']}>
                  <img 
                    src={jogo.image} 
                    alt={jogo.nome} 
                    className={styles['post-image']}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Imagem+não+disponível';
                    }}
                  />
                  <div className={styles['post-details']}>
                  <LinesEllipsis  maxLine = '1' ellipsis = '...' text={jogo.nome}  className={styles['info-header']} />
                    <div className={styles['post-meta']}>
                      <span className={styles['info-label']}>Autor:</span>
                      <span className={styles['info-value']}>{jogo.author}</span>
                    </div>
                    <div className={styles['post-meta']}>
                      <span className={styles['info-label']}>Data:</span>
                      <span className={styles['info-value']}>
                        {new Date(jogo.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <LinesEllipsis  maxLine = '1' ellipsis = '...' text={jogo.description}  className={styles['post-description']} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pagames;
