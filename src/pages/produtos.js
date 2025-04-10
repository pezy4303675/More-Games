
const produtos = [
    {
      id: 1,
      image: "https://imgs.crazygames.com/murder-mafia_16x9/20230915113149/murder-mafia_16x9-cover?metadata=none&quality=40&width=1200&height=630&fit=crop",
      nome: "Murder Mafia",
      descricao: "Murder Mafia é um jogo casual de um botão que o desafia a eliminar a grande máfia! Cuidado com os possíveis traidores! Explore vários cenários que podem ocorrer no jogo e tente vivenciá-los enquanto domina a arte da decepção.",
      creditos: "Panda Games.",
      tags: ["io", "multiplayer", "snake", "battle"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet), App Store(iOS)",
      lancado: "agosto de 2023",
      link: "https://www.crazygames.com.br/embed/murder-mafia"
    },{
      id: 2,
      image: "https://images.crazygames.com/man-runner-2048_16x9/20250306040019/man-runner-2048_16x9-cover?auto=format,compress&q=75&cs=strip",
      nome: "Man Runner 2048",
      descricao: "Man Runner 2048 é um jogo casual e divertido onde você corre e combina homens para alcançar a marca de 2048. Seu objetivo é obter a maior pontuação possível em cada nível para ganhar mais poder e enfrentar os monstros.",
      creditos: "GMR Bros.",
      tags: ["arcade", "stickman", "merge", "2048", "correr"],
      tecnologia: "HTML5 (Unity WebGL)",
      plataforma: "Browser (desktop, mobile, tablet), App Store(Android)",
      lancado: "agosto de 2023",
      link: "https://www.crazygames.com.br/embed/man-runner-2048"
    },{
      id: 3,
      image: "https://images.crazygames.com/sky-riders-buk_16x9/20240206045724/sky-riders-buk_16x9-cover?auto=format,compress&q=75&cs=strip",
      nome: "Sky Riders",
      descricao: "Sky Riders é um emocionante jogo casual de condução em alta velocidade. Teste suas habilidades de direção enquanto completa uma variedade de pistas desafiadoras. Mantenha o foco e evite quedas! Seja pilotando um carro ou uma motocicleta, prepare-se para uma aventura cheia de adrenalina e momentos de corrida inesquecíveis. Esteja pronto para superar desafios difíceis e experimentar a emoção do Sky Riders!",
      creditos: "Crazy Games.",
      tags: ["3d", "Corrida", "carro", "duas rodas", "rapidez"],
      tecnologia: "HTML5 (Unity WebGL)",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "junho de 2023",
      link: "https://www.crazygames.com.br/embed/sky-riders-buk"
    },{
      id: 4,
      image: "https://imgs.crazygames.com/games/bloxdhop-io/cover_16x9-1709115453824.png?metadata=none&quality=40&width=1200&height=630&fit=crop",
      nome: "Bloxd.io",
      descricao: "O Bloxd.io é um jogo on-line com gráficos do Minecraft e vários modos de jogo. Os modos de jogo incluem parkour, criatividade sandbox e combate, dependendo do modo que você escolher para jogar.",
      creditos: "Arthur.",
      tags: [".io", "mobile", "minecraft", "construção", "multiplayer", "com amigos"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "março de 2021",
      link: "https://www.crazygames.com.br/embed/bloxdhop-io"
    },{
      id: 5,
      image: "https://cdn.dekudeals.com/images/8d82edab05cf7c649e3c2d6b66b442a1db87a167/w500.jpg",
      nome: "Thief Puzzle",
      descricao: "Thief Puzzle é um jogo de lógica e quebra-cabeças em 2D que põe à prova sua estratégia e resolução de problemas. Você controla a mão de um ladrão sorrateiro que busca tesouros valiosos, mas o caminho está repleto de armadilhas complexas, sistemas de segurança a laser e obstáculos complicados. Você tem o que é preciso para ser mais esperto do que cada armadilha que aparece em seu caminho?",
      creditos: "Famobi.",
      tags: ["2d", "mobile", "stickman", "lógica", "puzzle", "brain"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "setembro de 2024",
      link: "https://www.crazygames.com.br/embed/thief-puzzle"
    },{
      id: 6,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQitmx4mg9M6oLN5micGVAoqGXjs9Cqk7SVRuIHlGy99iYJd7jXIxif0ZkPGNsvUFTPP84&usqp=CAU",
      nome: "Cubes 2048.io",
      descricao: "Cubes 2048.io é um jogo online viciante que combina elementos de Snake e2048. Obtenha um número maior coletando cubos grátis e devorando outros jogadores com um número menor do que o seu. Seus cubos com o mesmo valor que se chocam irão se fundir.",
      creditos: "Crazy Games.",
      tags: [".io", "um botão", "3d", "arena", "mouse", "sobrevivência", "cobrinha"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "dezembro de 2022",
      link: "https://www.crazygames.com.br/embed/cubes-2048-io"
    },{
      id: 7,
      image: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=204,height=204,fit=cover,f=auto/9c9e529b14731be871b07b89660bbc2a.png",
      nome: "Smash Karts",
      descricao: "Smash Karts é um jogo de batalha de kart multijogador 3D. Dirija seu kart, pegue suas armas e exploda outros karts para vencer! Continue jogando para subir de nível e desbloquear novos personagens e prêmios.",
      creditos: "Crazy Games.",
      tags: [".io", "Mobile", "3D", "Top-Down", "Batalha", "Arena", "Destruir", "Carro", "Com os amigos", "Controller", "Multiplayer", "Arcade", "Rapidez"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "maio de 2020",
      link: "https://www.crazygames.com.br/embed/smash-karts"
    },{
      id: 8,
      image: "https://spacewaves.io/upload/imgs/options/space-waves.jpg",
      nome: "Space Waves",
      descricao: "O Space Waves é um jogo de arcade em que você precisa controlar uma seta para evitar obstáculos até chegar ao final. Há 33 níveis no jogo, e você pode escolher qualquer nível que quiser jogar a qualquer momento. Todos os níveis variam em dificuldade e são rotulados de acordo com os rostos; dessa forma, você pode decidir o quão corajoso quer ser.",
      creditos: "do.games",
      tags: ["Casual", "Um Botão", "Mobile", "Difícil", "Mouse", "Arcade", "2D", "Pezy"],
      tecnologia: "HTML5 (Unity WebGL)",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "abril de 2024",
      link: "https://www.crazygames.com.br/embed/space-waves"
    },{
      id: 9,
      image: "https://holey-io.com/wp-content/uploads/2023/09/In-Holey-io-Battle-Royale-become-the-master-of-a-relentless-black-hole-2.webp",
      nome: "Holey.io Battle Royale",
      descricao: "O Holey.io é um jogo multijogador de battle royale em que você consome vários itens e adversários menores. Você ficará maior à medida que engolir! O mapa encolherá continuamente, forçando os jogadores a entrar em um ambiente mais estreito até que reste apenas uma pessoa de pé. Consuma, cresça e torne-se o último buraco negro em pé na arena!",
      creditos: "Crazy Games.",
      tags: [".io", "Crescer", "Mobile", "Top-Down", "Mouse", "Arena", "Battle Royale",],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet)",
      lancado: "agosto de 2023",
      link: "https://www.crazygames.com.br/embed/holey-io-battle-royale"
    },{
      id: 10,
      image: "https://tcf.admeen.org/game/18500/18052/400x246/helix-jump.jpg",
      nome: "Helix Jump",
      descricao: "O Helix Jump é um jogo casual com uma mecânica simples e viciante. No jogo, você guia uma bola quicando continuamente por uma série de plataformas circulares até cair. Caia pelas fendas e evite aterrissar nas zonas proibidas!",
      creditos: "Voodoo.",
      tags: ["Casual", "Um Botão", "Evitar", "1 jogador", "Mouse", "Plataforma", "Arcade","Habilidades","Bola", "Mini"],
      tecnologia: "HTML5",
      plataforma: "Browser (desktop, mobile, tablet), App Store(iOS, Android)",
      lancado: "maio de 2022",
      link: "https://www.crazygames.com.br/embed/helix-jump"
    },
  
    
  ];
  


  export default produtos;
  