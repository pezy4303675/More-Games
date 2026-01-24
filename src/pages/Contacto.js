import React from "react";

function Contacto() {
  return (
    <div className="ifo animate-fade-in">
      <h1 className="gamename mb-6">Contato</h1>
      <p className="tjh mb-8">
        Tem alguma pergunta sobre More Games? Vamos adorar te ouvir! 🤗
      </p>
      
      <div className="max-w-lg mx-auto p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
        <div className="text-center space-y-4">
          <h2 className="tgh text-blue-400">Entre em Contato</h2>
          <p className="tjh">
            Você pode nos contatar diretamente através do e-mail:
          </p>
          <a
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 block text-lg"
            href="mailto:dn4303676@gmail.com"
          >
            dn4303676@gmail.com
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="tjh text-sm text-white/70">
            Faremos o possível para responder sua mensagem o mais rápido possível.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contacto;
  