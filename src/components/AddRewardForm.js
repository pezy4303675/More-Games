import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, updateDoc, doc } from 'firebase/firestore';

function AddRewardForm({ rewardToEdit, onFinish }) {
  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [requiredHours, setRequiredHours] = useState('');
  const [availableCount, setAvailableCount] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    if (rewardToEdit) {
      setTitle(rewardToEdit.title || '');
      setValue(rewardToEdit.value || '');
      setImage(rewardToEdit.image || '');
      setCategory(rewardToEdit.category || '');
      setRequiredHours(rewardToEdit.requiredHours || '');
      setAvailableCount(rewardToEdit.availableCount || '');
      setGameCode(rewardToEdit.gameCode || '');
      
      if (rewardToEdit.expiryDate) {
        const date = rewardToEdit.expiryDate.seconds 
          ? new Date(rewardToEdit.expiryDate.seconds * 1000) 
          : new Date(rewardToEdit.expiryDate);
        setExpiryDate(date.toISOString().split('T')[0]);
      } else {
        setExpiryDate('');
      }
    } else {
      resetForm();
    }
  }, [rewardToEdit]);

  const resetForm = () => {
    setTitle('');
    setValue('');
    setImage('');
    setCategory('');
    setRequiredHours('');
    setAvailableCount('');
    setGameCode('');
    setExpiryDate('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getFirestore();
    try {
      const rewardData = {
        title,
        value,
        image,
        category,
        requiredHours: Number(requiredHours),
        availableCount: Number(availableCount),
        gameCode,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      };

      if (rewardToEdit) {
        await updateDoc(doc(db, 'rewards', rewardToEdit.id), rewardData);
        alert('Recompensa atualizada com sucesso!');
      } else {
        await addDoc(collection(db, 'rewards'), {
          ...rewardData,
          createdAt: new Date()
        });
        alert('Recompensa adicionada com sucesso!');
      }
      
      resetForm();
      if (onFinish) onFinish();
    } catch (error) {
      console.error('Erro ao salvar recompensa: ', error);
      alert('Erro ao salvar recompensa.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
      <h2 style={{ gridColumn: '1 / -1' }}>{rewardToEdit ? 'Editar Recompensa' : 'Adicionar Nova Recompensa'}</h2>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título (ex: 100 Dimas)" required style={inputStyle} />
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Subtítulo (ex: Free Fire)" required style={inputStyle} />
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="URL da Imagem" required style={inputStyle} />
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Categoria" required style={inputStyle} />
      <input type="number" value={requiredHours} onChange={(e) => setRequiredHours(e.target.value)} placeholder="Custo em Horas" required style={inputStyle} />
      <input type="number" value={availableCount} onChange={(e) => setAvailableCount(e.target.value)} placeholder="Estoque (Quantidade)" required style={inputStyle} />
      <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Data de Expiração (Opcional):</label>
        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} style={inputStyle} />
      </div>
      <input type="text" value={gameCode} onChange={(e) => setGameCode(e.target.value)} placeholder="Código do Jogo (O que o usuário vai copiar)" required style={{ ...inputStyle, gridColumn: '1 / -1' }} />
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
        <button type="submit" style={{ ...buttonStyle, flex: 1 }}>{rewardToEdit ? 'ATUALIZAR' : 'ADICIONAR'}</button>
        {rewardToEdit && (
          <button type="button" onClick={() => onFinish()} style={{ ...buttonStyle, background: '#444' }}>CANCELAR</button>
        )}
      </div>
    </form>
  );
}

const inputStyle = {
  padding: '0.8rem',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(0,0,0,0.2)',
  color: 'white',
  outline: 'none'
};

const buttonStyle = {
  padding: '1rem',
  background: '#6842ff',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default AddRewardForm;
