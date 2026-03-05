import React, { useState } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function Redeem() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const db = getFirestore();
  const auth = getAuth();

  const handleRedeem = async () => {
    if (!code) return;
    setLoading(true);
    setMessage('');

    try {
      const codesRef = collection(db, 'redeemCodes');
      const q = query(codesRef, where('code', '==', code.toUpperCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage('Código inválido.');
        setLoading(false);
        return;
      }

      const codeDoc = querySnapshot.docs[0];
      const codeData = codeDoc.data();

      if (codeData.used === true) {
        setMessage('Este código já foi utilizado.');
        setLoading(false);
        return;
      }

      // Check for expiration
      if (codeData.expiryDate) {
        const expiry = codeData.expiryDate.seconds ? new Date(codeData.expiryDate.seconds * 1000) : new Date(codeData.expiryDate);
        if (expiry < new Date()) {
          setMessage('Este código já expirou.');
          setLoading(false);
          return;
        }
      }

      const user = auth.currentUser;

      // Se a recompensa for um número, tratamos como HORAS
      const rewardValue = parseFloat(codeData.reward);
      const isTimeReward = !isNaN(rewardValue);

      if (isTimeReward) {
        const rewardMinutes = rewardValue * 60;
        const currentLocalTime = parseInt(localStorage.getItem('timeOnSite') || '0', 10);
        const newTotalMinutes = currentLocalTime + rewardMinutes;

        // Atualiza LocalStorage
        localStorage.setItem('timeOnSite', newTotalMinutes);

        // Se estiver logado, atualiza o Firestore também
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { timeOnSite: newTotalMinutes }, { merge: true });
        }
        
        setMessage(`Sucesso! Você ganhou ${rewardValue} horas de tempo.`);
      } else {
        // Se for outro tipo de recompensa (ex: "Gift Card"), apenas mostramos
        setMessage(`Código resgatado! Sua recompensa: ${codeData.reward}`);
      }

      // Marcar o código como utilizado
      await updateDoc(doc(db, 'redeemCodes', codeDoc.id), { 
        used: true, 
        usedBy: user ? user.uid : 'guest',
        usedAt: new Date()
      });

      setCode('');
    } catch (error) {
      console.error("Erro ao resgatar:", error);
      setMessage('Erro ao processar o resgate. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Resgatar Código</h1>
      <p>Insira um código promocional para ganhar horas ou outras recompensas.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          value={code} 
          onChange={(e) => setCode(e.target.value)} 
          placeholder="INSIRA O CÓDIGO AQUI"
          style={{
            padding: '1rem',
            fontSize: '1.2rem',
            textAlign: 'center',
            borderRadius: '10px',
            border: '2px solid #6842ff',
            background: 'rgba(0,0,0,0.1)',
            color: 'white',
            textTransform: 'uppercase'
          }}
        />
        <button 
          onClick={handleRedeem} 
          disabled={loading || !code}
          style={{
            padding: '1rem',
            fontSize: '1.1rem',
            borderRadius: '10px',
            border: 'none',
            background: loading || !code ? '#444' : '#6842ff',
            color: 'white',
            cursor: loading || !code ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Processando...' : 'RESGATAR AGORA'}
        </button>
      </div>
      
      {message && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          borderRadius: '10px', 
          background: message.includes('Sucesso') ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${message.includes('Sucesso') ? '#4CAF50' : '#f44336'}`,
          color: message.includes('Sucesso') ? '#4CAF50' : '#f44336'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Redeem;
