import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Trash2 } from 'lucide-react';

function RedeemCodeManager() {
  const [codes, setCodes] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [reward, setReward] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const fetchCodes = async () => {
    const codesSnapshot = await getDocs(collection(db, 'redeemCodes'));
    setCodes(codesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchCodes();
  }, [db]);

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setNewCode(code);
  };

  const handleAddCode = async () => {
    if (newCode && reward) {
      await addDoc(collection(db, 'redeemCodes'), { 
        code: newCode, 
        reward, 
        used: false,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        createdAt: new Date()
      });
      fetchCodes();
      setNewCode('');
      setReward('');
      setExpiryDate('');
      alert('Código adicionado com sucesso!');
    }
  };

  const handleDeleteCode = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar este código?')) {
      await deleteDoc(doc(db, 'redeemCodes', id));
      setCodes(codes.filter(c => c.id !== id));
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Gerar Novo Código Promocional</h2>
        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>Crie códigos que dão tempo de site para os usuários.</p>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <input 
            type="text" 
            value={reward} 
            onChange={(e) => setReward(e.target.value)} 
            placeholder="Recompensa (ex: 2 para 2 horas)" 
            style={inputStyle}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Expiração (Opcional):</label>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <input type="text" value={newCode} readOnly placeholder="Clique em gerar..." style={{ ...inputStyle, flex: 1 }} />
            <button onClick={generateCode} style={{ ...buttonStyle, background: '#444' }}>GERAR</button>
          </div>
          <button onClick={handleAddCode} style={{ ...buttonStyle, gridColumn: '1 / -1' }}>ADICIONAR CÓDIGO AO SISTEMA</button>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '10px' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Códigos Ativos</h2>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {codes.filter(c => !c.used).length === 0 && <p style={{ color: '#666' }}>Nenhum código ativo encontrado.</p>}
          {codes.filter(c => !c.used).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '5px' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#6842ff', marginRight: '1rem' }}>{c.code}</span>
                <span style={{ fontSize: '0.9rem' }}>{c.reward} horas</span>
              </div>
              <button 
                onClick={() => handleDeleteCode(c.id)}
                style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: '0.5rem' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0, 0, 0, 0.2)',
  color: 'white',
  outline: 'none',
  fontSize: '0.9rem'
};

const buttonStyle = {
  padding: '0.8rem 1.2rem',
  background: '#6842ff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.8rem'
};

export default RedeemCodeManager;
