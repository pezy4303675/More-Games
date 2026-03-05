import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

function TimeTracker() {
  const [showAfkCheck, setShowAfkCheck] = useState(false);
  const [afkTimer, setAfkTimer] = useState(null);

  useEffect(() => {
    // 1. Gerar ou recuperar Player ID
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = 'MORE-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      localStorage.setItem('playerId', playerId);
    }

    // 2. Função para salvar tempo com Anti-AFK
    const saveTime = async () => {
      // Verifica se a aba está visível (Evita farmar com aba em segundo plano)
      if (document.hidden) return;

      const localMinutes = parseInt(localStorage.getItem('timeOnSite') || '0', 10);
      const newMinutes = localMinutes + 1;
      
      // Atualiza localmente
      localStorage.setItem('timeOnSite', newMinutes);

      // Sincroniza com Firestore usando o Player ID
      try {
        const userRef = doc(db, 'playerAccounts', playerId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, { 
            timeOnSite: newMinutes,
            lastActive: new Date()
          });
        } else {
          await setDoc(userRef, { 
            playerId: playerId,
            timeOnSite: newMinutes,
            createdAt: new Date(),
            lastActive: new Date()
          });
        }
      } catch (error) {
        console.error("Erro ao sincronizar tempo:", error);
      }

      // 3. Sistema de Teste de Atividade (A cada 20 minutos de jogo real)
      if (newMinutes % 20 === 0) {
        setShowAfkCheck(true);
        // Se não clicar em 1 minuto, o tempo para (o intervalo continua, mas o if(showAfkCheck) bloqueia)
      }
    };

    const interval = setInterval(() => {
      if (!showAfkCheck) {
        saveTime();
      }
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, [showAfkCheck]);

  const handleStillHere = () => {
    setShowAfkCheck(false);
  };

  if (!showAfkCheck) return null;

  return (
    <div style={afkModalStyle}>
      <div style={afkBoxStyle}>
        <h3>Verificação de Atividade</h3>
        <p>Ainda estás aí a jogar? Clique no botão abaixo para continuar a ganhar horas!</p>
        <button onClick={handleStillHere} style={afkButtonStyle}>ESTOU AQUI!</button>
      </div>
    </div>
  );
}

const afkModalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.9)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
  backdropFilter: 'blur(10px)'
};

const afkBoxStyle = {
  background: '#1a1b26',
  padding: '2rem',
  borderRadius: '15px',
  textAlign: 'center',
  border: '2px solid #6842ff',
  maxWidth: '300px',
  color: 'white'
};

const afkButtonStyle = {
  background: '#6842ff',
  color: 'white',
  border: 'none',
  padding: '1rem 2rem',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '1rem',
  width: '100%'
};

export default TimeTracker;
