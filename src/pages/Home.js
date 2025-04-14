import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { posts } from './posts';
import styles from './Produto.module.css';

function Home({ searchQuery }) {
  const [produtos, setProdutos] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca os produtos do Firestore
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const db = getFirestore();
        const produtosCollection = collection(db, 'games');
        const produtosSnapshot = await getDocs(produtosCollection);
        const produtosList = produtosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProdutos(produtosList);
        setFilteredProducts(produtosList);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar os jogos:', err);
        setError('Erro ao carregar os jogos. Por favor, tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  // Filtra os produtos com base na pesquisa
  useEffect(() => {
    if (searchQuery) {
      const filtered = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(produtos);
    }
  }, [searchQuery, produtos]);

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
      <div className="games">
        {filteredProducts.map((produto) => (
          <div className="gamesitem" key={produto.id}>
            <Link to={`/produto/${produto.id}`} className="product-container">
              <div className="image-container">
                <img
                  src={produto.image}
                  alt={produto.nome}
                  className="produto-image"
                  draggable="false"
                />
                <marquee id="namer" className="text-xl font-bold text-overlay">
                  {produto.nome}
                </marquee>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles['info-container']}>
        <h1 className={styles['game-title']}>Posts Recentes</h1>
        
        <div className={styles['info-section']}>
          {posts.map((post) => (
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
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <script async="async" data-cfasync="false" src="//pl26352511.profitableratecpm.com/a96b05239a81b8fdd6c3c31c19786788/invoke.js"></script>
        <div id="container-a96b05239a81b8fdd6c3c31c19786788"></div>

      </div>
    </div>
  );
}

export default Home;
