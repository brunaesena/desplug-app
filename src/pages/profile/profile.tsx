import { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonSpinner
} from '@ionic/react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useHistory } from 'react-router'
import { auth, db } from '../../firebase'

const Profile = () => {
  const history = useHistory()
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false)
        history.replace('/login')
        return
      }

      try {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data()
          setUserData({
            name: data.name,
            email: data.email,
          })
        } else {
          setUserData({
            name: 'Desconhecido',
            email: user.email || '',
          })
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err)
        setError('Erro ao carregar informações do perfil.')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [history])

  const handleLogout = async () => {
    await signOut(auth)
    history.replace('/login')
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <IonText color="danger"><p>{error}</p></IonText>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <IonText>
              <h2>{userData?.name}</h2>
              <p>{userData?.email}</p>
            </IonText>

            <IonButton expand="block" color="medium" onClick={() => alert('Função ainda não implementada')}>
              Editar informações
            </IonButton>

            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Sair da conta
            </IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  )
}

export default Profile
