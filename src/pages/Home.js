import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
    </div>
  );
}

export default Home;
