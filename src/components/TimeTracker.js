import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

function TimeTracker() {
  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    // Sincronizar tempo do Firestore para LocalStorage quando o usuário logar
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const dbTime = userDoc.data().timeOnSite || 0;
          const localTime = parseInt(localStorage.getItem('timeOnSite') || '0', 10);
          // Se o banco tiver mais tempo (ex: logou em outro PC), atualiza local
          if (dbTime > localTime) {
            localStorage.setItem('timeOnSite', dbTime);
          }
        }
      }
    });

    const saveTime = async () => {
      // 1. Sempre incrementa no LocalStorage
      const localMinutes = parseInt(localStorage.getItem('timeOnSite') || '0', 10);
      const newMinutes = localMinutes + 1;
      localStorage.setItem('timeOnSite', newMinutes);

      // 2. Se estiver logado, salva também no Firestore
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        try {
          await setDoc(userRef, { timeOnSite: newMinutes }, { merge: true });
        } catch (error) {
          console.error("Erro ao salvar tempo no Firestore:", error);
        }
      }
    };

    const interval = setInterval(saveTime, 60000); // Incrementa a cada minuto

    return () => {
      clearInterval(interval);
      unsubscribeAuth();
    };
  }, []);

  return null;
}

export default TimeTracker;
