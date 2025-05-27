import { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonText,
  IonImg
} from '@ionic/react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/home')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent>
        <div className="login-container">
          <IonImg src="/logo.png" className="logo-img" />

          <IonInput
            placeholder="E-mail"
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
            className="input-field"
            clearInput
          />

          <IonInput
            placeholder="Senha"
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
            className="input-field"
            clearInput
          />

          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center' }}>{error}</p>
            </IonText>
          )}

          <IonButton expand="full" onClick={handleLogin} className="login-button">
            Entrar
          </IonButton>

          <IonText className="text-footer">
            <p>
              Não tem uma conta? <span onClick={() => navigate('/register')} style={{ color: '#4fcdfc', cursor: 'pointer' }}>Registre-se aqui</span>
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
