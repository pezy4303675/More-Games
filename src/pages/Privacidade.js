import React from "react";

function Privacidade() {
  return (
    <div className="ifo animate-fade-in">
      <h1 className="gamename mb-6">Política de Privacidade</h1>
      
      <div className="space-y-6">
        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">Coleta de Dados</h2>
          <p className="tjh">
            No <span className="text-white font-medium">More Games</span>, respeitamos sua privacidade como prioridade.
            Não coletamos dados pessoais diretamente, mas utilizamos <span className="text-white font-medium">cookies</span> e
            <span className="text-white font-medium"> dados anônimos</span> (como IP e tipo de navegador) para melhorar
            sua experiência no site.
          </p>
        </section>

        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">Jogos e Anúncios de Terceiros</h2>
          <p className="tjh">
            Alguns jogos e anúncios podem ser fornecidos por terceiros, que podem ter suas próprias
            políticas de privacidade. Recomendamos que você as consulte quando necessário para
            entender melhor como seus dados são tratados por esses parceiros.
          </p>
        </section>

        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">Segurança</h2>
          <p className="tjh">
            Nosso site é projetado com sua segurança em mente. No entanto, lembramos que é importante
            nunca compartilhar informações pessoais enquanto joga online. Mantenha seus dados seguros
            e aproveite nossos jogos com tranquilidade.
          </p>
        </section>

        <section className="transform hover:scale-[1.02] transition-all duration-300">
          <h2 className="tgh text-blue-400 mb-3">Atualizações da Política</h2>
          <p className="tjh">
            Esta política pode ser atualizada periodicamente para refletir melhorias em nossas
            práticas de privacidade. Recomendamos que você visite esta página regularmente para
            se manter informado sobre quaisquer mudanças.
          </p>
        </section>

        <div className="mt-8 p-4 bg-blue-600/20 rounded-lg backdrop-blur-sm">
          <p className="tjh text-center">
            Ao usar o More Games, você concorda com nossa Política de Privacidade.
            Se tiver dúvidas, entre em contato conosco através da nossa página de
            <a href="/contacto" className="text-blue-400 hover:text-blue-300 ml-1 transition-colors duration-300">
              Contacto
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacidade;
  