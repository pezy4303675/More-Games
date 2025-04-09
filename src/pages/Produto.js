import { Link, useParams } from "react-router-dom";
import produtos from "./produtos";
import logo from '../imgs/logo.png'


export default function Produto() {
    const { id } = useParams();
    const produto = produtos.find((p) => p.id === parseInt(id));
  
    if (!produto) return <p>Produto não encontrado.</p>;
  
    return (
      <div className="p-6">
       
        <iframe src={produto.link}  className="w-[100%] h-[70vh] m-[0 auto] rounded-[10px]"  frameborder="0" allow="gamepad *;"></iframe>
        <br/>
        <div className="ifo">
          <ul>
          <li><h1 className="gamename">{produto.nome}</h1></li>
          <br/>
            <li className="tgh">Informações</li>
            <li className="tjh">Creditos: <span className="infogt">{produto.creditos}</span></li>
            <li className="tjh" id="poit">
  Tags: 
  {produto.tags.map((tag, index) => (
    <span id="gtr" key={index} className="infogt">{tag}</span>
  ))}
</li>

            <li className="tjh">Tecnologia: <span className="infogt">{produto.tecnologia}</span></li>
            <li className="tjh">Plataforma: <span className="infogt">{produto.plataforma}</span></li>
            <li className="tjh">Lançado: <span className="infogt">{produto.lancado}</span></li>
            <br/>
            <li className="tgh">Descrição</li>
            <li><p>{produto.descricao}</p></li> 
          </ul>          
        </div>

<br/>

        <div className="ifof" id="popo">
          <ul>
        <li className="tgh">Sobre o More Games</li>
        <br/>
        <br/>
        <li><p><span className="rrt">More Games</span> é um site independente de jogos de navegador, criado com paixão e dedicação por apenas uma pessoa:<span className="rrt"> Daniel Alfredo Nunes</span>. Lançado em <span className="rrt">9 de abril de 2025</span>, o objetivo do site é oferecer uma experiência divertida, acessível e sem complicações para quem ama jogar direto do navegador, sem precisar baixar nada.<br/><br/>

Aqui, cada jogo é escolhido ou desenvolvido com cuidado, pensando em trazer variedade e entretenimento para todas as idades. Seja você fã de ação, estratégia, puzzle ou jogos casuais, o <span className="rrt">More Games</span> tem sempre algo novo para experimentar.<br/><br/>

Este projeto nasceu da vontade de criar um espaço leve e divertido, onde qualquer pessoa pode relaxar e se divertir com apenas alguns cliques. Como é mantido por uma única pessoa, o site está em constante evolução — e toda sugestão ou apoio faz a diferença!

Obrigado por fazer parte dessa jornada. Divirta-se, jogue e volte sempre!</p></li> 
</ul>
        </div>
        <br/>
        <br/>
        <div className="ifog">
          <div className="wewe">
         <img width="150px" src={logo}/>
         <ul className="poii">
          <li>
           <Link to="/privacidade">Politica de privacidade</Link>
          </li>
          <li>
           <Link to="/contacto">Contacto</Link>
          </li>
          <li>
          </li>
         </ul>
         </div>
         <h3 className="lolo">© 2025 More Games. Todos direitos reservados.</h3>
        </div>
      </div>
    );
}
