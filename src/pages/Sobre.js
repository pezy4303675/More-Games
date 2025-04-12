import React from "react";

function Sobre() {
return (
<div className="ifo animate-fade-in">
      <h1 className="gamename mb-6">Sobre o More Games</h1>
      
      <div className="space-y-6">
        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">Coleta de Dados</h2>
          <p className="tjh">
          Bem-vindo ao <span className="text-white font-medium">More Games</span>  – seu portal definitivo para jogos de browser gratuitos, divertidos e acessíveis a qualquer hora, em qualquer lugar!
          <br/>
          <br/>
          Nosso objetivo é simples:<span className="text-white font-medium"> levar entretenimento de qualidade para todos</span>, sem precisar baixar nada ou fazer cadastros complicados. Aqui, você encontra uma seleção variada de jogos online, perfeitos para passar o tempo, desafiar seus reflexos ou testar suas habilidades estratégicas.
          </p>
        </section>

        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">🎮 O que você encontra por aqui?</h2>
          <p className="tjh">
            <ul className="listcategoria">
                <li>Jogos de ação, corrida, quebra-cabeça, arcade e muito mais.</li>
                <li>Interface simples e intuitiva, para que você comece a jogar em segundos.</li>
                <li>Atualizações frequentes com novos jogos e melhorias na experiência do usuário.</li>
            </ul>
          </p>
        </section>

        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">💡 Nosso compromisso</h2>
          <p className="tjh">
          Acreditamos que jogar deve ser fácil, divertido e seguro. Por isso, cuidamos de cada detalhe da plataforma para garantir uma navegação leve e uma jogabilidade fluida, seja no computador ou no celular.
          </p>
        </section>
        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">🌍 Para todos os gostos e idades</h2>
          <p className="tjh">
          O More Games foi pensado para jogadores casuais e apaixonados por diversão. Nossa missão é reunir os melhores jogos em um só lugar, acessíveis para todos que querem dar uma pausa no dia e se divertir.
          </p>
        </section>

      </div>
    </div>
)}

export default Sobre;
