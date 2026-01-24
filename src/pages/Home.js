import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import styles from './Produto.module.css';
import Anuncio from "./Anuncio";

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
            <div style={{ display: 'flex', gap: '0.9rem', marginTop: '0.6rem', color: 'white', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                <Eye size={18} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>{typeof produto.views === 'number' ? produto.views : 0}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '8px 12px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
                <Heart size={18} /> <span style={{ fontSize: '1rem', fontWeight: 600 }}>{typeof produto.likes === 'number' ? produto.likes : 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="container-a96b05239a81b8fdd6c3c31c19786788"></div>
<script src="anuncio.js"></script>


    
      

    </div>
  );
}

export default Home;
