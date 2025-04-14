import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { posts } from "./posts";
import styles from './Produto.module.css';

function Comunidade() {
  const [postsList, setPostsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = () => {
      try {
        if (!Array.isArray(posts) || !posts.every(post => 
          post && 
          typeof post === 'object' && 
          'id' in post && 
          'nome' in post && 
          'image' in post && 
          'date' in post && 
          'author' in post && 
          'description' in post
        )) {
          throw new Error('Formato dos posts inválido');
        }
        setPostsList(posts);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os posts:', err);
        setError('Erro ao carregar os posts. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    loadPosts();
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
      <br/>
      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>Posts da Comunidade</h1>
        <div className={styles['info-section']}>
          {postsList.map((post) => (
            <div key={post.id} className={styles['info-item']}>
              <Link to={`/postes/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles['post-content']}>
                  <img 
                    src={post.image} 
                    alt={post.nome} 
                    className={styles['post-image']}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x200?text=Imagem+não+disponível';
                    }}
                  />
                  <div className={styles['post-details']}>
                    <h2 className={styles['info-header']}>{post.nome}</h2>
                    <div className={styles['post-meta']}>
                      <span className={styles['info-label']}>Autor:</span>
                      <span className={styles['info-value']}>{post.author}</span>
                    </div>
                    <div className={styles['post-meta']}>
                      <span className={styles['info-label']}>Data:</span>
                      <span className={styles['info-value']}>
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className={styles['post-description']}>{post.description}</p>
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

export default Comunidade;
