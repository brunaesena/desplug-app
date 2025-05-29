import { useEffect, useState } from 'react'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonText,
  IonSpinner,
  IonIcon,
  IonCard,
  IonCardContent
} from '@ionic/react'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useHistory } from 'react-router-dom'
import { personCircleOutline, mailOutline, callOutline, schoolOutline, navigate } from 'ionicons/icons'
import { auth, db } from '../../firebase'
import Footer from '../../components/Footer'
import './profile.css'

interface UserData {
  name: string
  email: string
  phone: string
  type: 'admin' | 'user'
  isProvider: boolean
  profession?: string | null
  degree?: string | null
  graduationYear?: number | null
}

const Profile = () => {
  const history = useHistory()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false)
        history.push('/login')
        return
      }

      try {
        const ref = doc(db, 'users', user.uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data() as UserData
          setUserData(data)
        } else {
          setUserData({
            name: 'Desconhecido',
            email: user.email || '',
            phone: '',
            type: 'user',
            isProvider: false
          })
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err)
        setError('Erro ao carregar informações do perfil.')
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await signOut(auth)
    history.push('/login')
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        {loading ? (
          <div className="loading-container">
            <IonSpinner name="crescent" />
          </div>
        ) : error ? (
          <div className="error-container">
            <IonText color="danger"><p>{error}</p></IonText>
          </div>
        ) : (
          <div className="profile-container">
            <IonCard className="profile-card">
              <IonCardContent>
                <div className="profile-header">
                  <IonIcon icon={personCircleOutline} className="profile-avatar" />
                  <h2>{userData?.name}</h2>
                  <IonText color="medium">
                    <p>{userData?.isProvider ? 'Prestador de Serviço' : 'Usuário'}</p>
                  </IonText>
                </div>

                <div className="profile-info">
                  <div className="info-item">
                    <IonIcon icon={mailOutline} />
                    <p>{userData?.email}</p>
                  </div>

                  <div className="info-item">
                    <IonIcon icon={callOutline} />
                    <p>{userData?.phone || 'Não informado'}</p>
                  </div>

                  {userData?.isProvider && (
                    <>
                      <div className="info-item">
                        <IonIcon icon={schoolOutline} />
                        <p>{userData.profession || 'Não informado'}</p>
                      </div>
                      <div className="info-item">
                        <IonIcon icon={schoolOutline} />
                        <p>{`${userData.degree || 'Não informado'} ${userData.graduationYear ? `(${userData.graduationYear})` : ''}`}</p>
                      </div>
                    </>
                  )}
                </div>
              </IonCardContent>
            </IonCard>

            <div className="profile-actions">

              <IonButton expand="block" color="danger" onClick={handleLogout}>
                Sair da conta
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
      <Footer/>
    </IonPage>
  )
}

export default Profile
