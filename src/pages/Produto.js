import { Link, useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import logo from '../imgs/logo.png';
import styles from './Produto.module.css';

export default function Produto() {
    const { id } = useParams();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const db = getFirestore();

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const docRef = doc(db, 'games', id);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    setProduto({ id: docSnap.id, ...docSnap.data() });
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar o jogo:', error);
                setLoading(false);
            }
        };
        
        fetchProduto();
    }, [id, db]);

    if (loading) return <div>Carregando...</div>;
    if (!produto) return <p>Produto não encontrado.</p>;
  
    return (
      <div className={styles['produto-container']}>
        <iframe 
          src={produto.link} 
          className={styles['game-frame']} 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; gamepad *;"
          allowFullScreen
          loading="lazy"
          title={produto.nome}
        ></iframe>

        <div className={styles['info-container']}>
          <h1 className={styles['game-title']}>{produto.nome}</h1>
          
          <div className={styles['info-section']}>
            <h2 className={styles['info-header']}>Informações</h2>
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Créditos:</span>
              <span className={styles['info-value']}>{produto.creditos}</span>
            </div>
            
            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tags:</span>
              <div className={styles['tag-container']}>
                {produto.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Tecnologia:</span>
              <span className={styles['info-value']}>{produto.tecnologia}</span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Plataforma:</span>
              <span className={styles['info-value']}>{produto.plataforma}</span>
            </div>

            <div className={styles['info-item']}>
              <span className={styles['info-label']}>Lançamento:</span>
              <span className={styles['info-value']}>{produto.lancado}</span>
            </div>
          </div>

          <div className={styles['info-section']}>
            <h2 className={styles['info-header']}>Descrição</h2>
            <p className={styles.description}>{produto.descricao}</p>
          </div>
        </div>

<br/>

        <div className={styles['about-section']}>
          <h2 className={styles['info-header']}>Sobre o More Games</h2>
          <p className={styles.description}>
            <span className={styles.highlight}>More Games</span> é um site independente de jogos de navegador, 
            criado com paixão e dedicação por apenas uma pessoa: 
            <span className={styles.highlight}> Daniel Alfredo Nunes</span>. 
            Lançado em <span className={styles.highlight}>9 de abril de 2025</span>, 
            o objetivo do site é oferecer uma experiência divertida, acessível e sem complicações 
            para quem ama jogar direto do navegador, sem precisar baixar nada.
            <br/><br/>
            Aqui, cada jogo é escolhido ou desenvolvido com cuidado, pensando em trazer variedade 
            e entretenimento para todas as idades. Seja você fã de ação, estratégia, puzzle ou jogos casuais, 
            o <span className={styles.highlight}>More Games</span> tem sempre algo novo para experimentar.
            <br/><br/>
            Este projeto nasceu da vontade de criar um espaço leve e divertido, onde qualquer pessoa pode 
            relaxar e se divertir com apenas alguns cliques. Como é mantido por uma única pessoa, o site 
            está em constante evolução — e toda sugestão ou apoio faz a diferença!
            <br/><br/>
            Obrigado por fazer parte dessa jornada. Divirta-se, jogue e volte sempre!
          </p>
        </div>

        <div className={styles.footer}>
          <div className={styles['footer-content']}>
            <img width="150" src={logo} alt="More Games Logo" draggable="false" />
            <div className={styles['footer-links']}>
              <Link to="/privacidade" className={styles['footer-link']}>Política de privacidade</Link>
              <Link to="/contacto" className={styles['footer-link']}>Contato</Link>
            </div>
          </div>
          <h3 className={styles.copyright}>© 2025 More Games. Todos direitos reservados.</h3>
        </div>
      </div>
    );
}
