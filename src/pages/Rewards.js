import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import styles from './Rewards.module.css';

function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [userTime, setUserTime] = useState(parseInt(localStorage.getItem('timeOnSite') || '0', 10));
  const [lastRedeemedCode, setLastRedeemedCode] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      const rewardsCollection = collection(db, 'rewards');
      const rewardsSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRewards(rewardsList);
    };

    fetchRewards();

    // Atualiza o tempo local a cada 30 segundos na tela
    const interval = setInterval(() => {
      setUserTime(parseInt(localStorage.getItem('timeOnSite') || '0', 10));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRedeem = async (reward) => {
    // O custo é em horas, mas userTime está em minutos. 
    const requiredMinutes = reward.requiredHours * 60;

    if (userTime >= requiredMinutes && reward.availableCount > 0) {
      const rewardRef = doc(db, 'rewards', reward.id);
      
      try {
        await updateDoc(rewardRef, { availableCount: reward.availableCount - 1 });

        const newLocalTime = userTime - requiredMinutes;
        localStorage.setItem('timeOnSite', newLocalTime);
        setUserTime(newLocalTime);
        
        const localRedeemed = JSON.parse(localStorage.getItem('redeemedRewards') || '[]');
        localStorage.setItem('redeemedRewards', JSON.stringify([...localRedeemed, { rewardId: reward.id, code: reward.gameCode, date: new Date() }]));

        setLastRedeemedCode(reward.gameCode);
        alert(`Sucesso! Seu código de resgate é: ${reward.gameCode}. Copie-o abaixo.`);
      } catch (error) {
        console.error("Erro ao resgatar:", error);
        alert("Erro ao processar o resgate.");
      }
    } else {
        alert("Tempo insuficiente ou recompensa esgotada.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Código copiado para a área de transferência!");
  };

  return (
    <div className={styles.rewardsContainer}>
      <h1 className={styles.title}>Página de Recompensas</h1>
      
      <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '10px', marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ fontSize: '1.2rem', margin: 0 }}>Seu tempo acumulado: <strong>{userTime} minutos</strong> ({Math.floor(userTime / 60)}h {userTime % 60}m)</p>
      </div>

      {lastRedeemedCode && (
        <div style={{ 
          background: 'rgba(104, 66, 255, 0.2)', 
          padding: '1.5rem', 
          borderRadius: '10px', 
          marginBottom: '2rem', 
          textAlign: 'center',
          border: '2px dashed #6842ff' 
        }}>
          <h2 style={{ margin: '0 0 1rem 0' }}>Último Código Resgatado:</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '2px', color: '#6842ff' }}>{lastRedeemedCode}</span>
            <button 
              onClick={() => copyToClipboard(lastRedeemedCode)}
              style={{ padding: '0.5rem 1rem', borderRadius: '5px', border: 'none', background: '#6842ff', color: 'white', cursor: 'pointer' }}
            >
              COPIAR
            </button>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#aaa' }}>Resgate este código dentro do jogo!</p>
        </div>
      )}
      
      <div className={styles.rewardsGrid}>
        {rewards.map((reward) => {
          const requiredMinutes = reward.requiredHours * 60;
          
          // Check for expiration
          let isExpired = false;
          if (reward.expiryDate) {
            const expiry = reward.expiryDate.seconds ? new Date(reward.expiryDate.seconds * 1000) : new Date(reward.expiryDate);
            if (expiry < new Date()) isExpired = true;
          }

          const canRedeem = userTime >= requiredMinutes && reward.availableCount > 0 && !isExpired;
          
          return (
            <div key={reward.id} className={styles.card} style={{ opacity: isExpired ? 0.6 : 1 }}>
              <img src={reward.image} alt={reward.title} className={styles.cardImage} />
              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{reward.title}</h2>
                <p className={styles.cardValue}>{reward.value}</p>
                <p className={styles.cardHours} style={{ fontWeight: 'bold', color: isExpired ? '#ff4444' : '#6842ff' }}>
                  {isExpired ? 'EXPIRADO' : `Custo: ${reward.requiredHours} Horas`}
                </p>
                <p className={styles.cardAvailable}>Disponíveis: {reward.availableCount}</p>
                {reward.expiryDate && !isExpired && (
                  <p style={{ fontSize: '0.8rem', color: '#ffcc00', marginTop: '0.5rem' }}>
                    Expira em: {new Date(reward.expiryDate.seconds * 1000).toLocaleDateString()}
                  </p>
                )}
                <button 
                  onClick={() => handleRedeem(reward)} 
                  disabled={!canRedeem}
                  style={{
                    background: canRedeem ? '#6842ff' : '#444',
                    cursor: canRedeem ? 'pointer' : 'not-allowed',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    color: 'white',
                    border: 'none',
                    width: '100%',
                    marginTop: '1rem'
                  }}
                >
                  {isExpired ? 'Expirado' : (reward.availableCount === 0 ? 'Esgotado' : 'Resgatar')}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Rewards;