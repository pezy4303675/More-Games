import React, { useState } from "react";
import produtos from "./produtos";
import { Link } from "react-router-dom";

function Home({ searchQuery }) {
  const [filteredProducts, setFilteredProducts] = useState(produtos);

  // Filtra os produtos com base na pesquisa
  React.useEffect(() => {
    if (searchQuery) {
      const filtered = produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(produtos); // Se não houver busca, mostra todos os produtos
    }
  }, [searchQuery]);

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
