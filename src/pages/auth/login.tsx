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
import { useHistory } from 'react-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'

const Login = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')

    if (!email.includes('@')) {
      setError('Email inválido.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      history.push('/home')
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

          <IonButton expand="full" onClick={handleLogin} className="login-btn">
            Entrar
          </IonButton>

          <IonText className="text-footer">
            <p>
              Não tem uma conta? <span onClick={() => history.push('/register')} style={{ color: '#4fcdfc', cursor: 'pointer' }}>Registre-se aqui</span>
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
