import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export const useAuthState = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
  
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setIsAdmin(userData.type?.toLowerCase() === 'admin');
            } else {
              console.warn('Documento do usuário não encontrado.');
              setIsAdmin(false);
            }
          } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
  
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    return { isAdmin, loading };
  };  