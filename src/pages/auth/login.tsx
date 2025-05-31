import { useState } from 'react'
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonText,
  IonItem,
  IonImg
} from '@ionic/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase'
import './login.css'
import { useHistory } from 'react-router-dom'

const Login = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      history.push('/home');
    } catch (err: any) {
      const errorCode = err.code;
    
      const userFriendlyMessage = (() => {
        switch (errorCode) {
          case 'auth/invalid-email':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            return 'E-mail ou senha incorretos.';
          case 'auth/too-many-requests':
            return 'Muitas tentativas. Tente novamente mais tarde.';
          default:
            return 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
        }
      })();
    
      setError(userFriendlyMessage);
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="login-container">
          <IonImg src="/logo.png" className="logo-img" />

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          <IonItem className="input-field">
            <IonInput
              type="email"
              value={email}
              onIonChange={e => setEmail(e.detail.value!)}
              required
              clearInput={true}
              placeholder="Email"
            />
          </IonItem>

          <IonItem className="input-field">
            <IonInput
              type="password"
              value={password}
              onIonChange={e => setPassword(e.detail.value!)}
              required
              clearInput={true}
              placeholder="Senha"
            />
          </IonItem>

          <div className="forgot-password" onClick={() => history.push('/forgot-password')}>
            Esqueceu a senha?
          </div>

          <IonButton className="login-btn" expand="block" onClick={handleLogin}>
            Entrar
          </IonButton>

          <div className="text-footer">
            <p>
              Não tem uma conta?{' '}
              <span onClick={() => history.push('/register')}>
                Cadastre-se aqui
              </span>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
