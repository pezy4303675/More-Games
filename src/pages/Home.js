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
        <li className="tgh">Sobre o More Games</li>
        <br/>
        <br/>
        <li><p><span className="rrt">More Games</span> é um site independente de jogos de navegador, criado com paixão e dedicação por apenas uma pessoa:<span className="rrt"> Daniel Alfredo Nunes</span>. Lançado em <span className="rrt">9 de abril de 2025</span>, o objetivo do site é oferecer uma experiência divertida, acessível e sem complicações para quem ama jogar direto do navegador, sem precisar baixar nada.<br/><br/></p></li> 
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
