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
  IonImg,
  IonItem,
  IonLabel,
  IonCheckbox
} from '@ionic/react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../../firebase'
import './register.css'

const Register = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [isProvider, setIsProvider] = useState(false)
  const [error, setError] = useState('')

  const validate = () => {
    if (!email.includes('@')) {
      setError('Email inválido.')
      return false
    }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(name)) {
      setError('Nome deve conter apenas letras.')
      return false
    }
    if (password.length < 6) {
      setError('Senha deve conter no mínimo 6 caracteres.')
      return false
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return false
    }
    return true
  }

  const handleRegister = async () => {
    setError('')
    if (!validate()) return

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      await setDoc(doc(db, 'users', uid), {
        uid,
        name,
        email,
        phone,
        type: isProvider ? 'provider' : 'consumer',
        createdAt: serverTimestamp()
      })

      navigate('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <IonPage>
      <IonHeader />
      <IonContent>
        <div className="register-container">
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
            placeholder="Nome completo"
            type="text"
            value={name}
            onIonChange={(e) => setName(e.detail.value!)}
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
          <IonInput
            placeholder="Confirmar senha"
            type="password"
            value={confirmPassword}
            onIonChange={(e) => setConfirmPassword(e.detail.value!)}
            className="input-field"
            clearInput
          />
          <IonInput
            placeholder="Telefone"
            type="tel"
            value={phone}
            onIonChange={(e) => setPhone(e.detail.value!)}
            className="input-field"
            clearInput
          />

          <IonItem lines="none" className="checkbox-item">
            <IonCheckbox
              checked={isProvider}
              onIonChange={(e) => setIsProvider(e.detail.checked)}
              slot="start"
            />
            <IonLabel>Sou prestador de serviço</IonLabel>
          </IonItem>

          {error && (
            <IonText color="danger">
              <p style={{ textAlign: 'center' }}>{error}</p>
            </IonText>
          )}

          <IonButton expand="full" onClick={handleRegister} className="register-btn">
            Criar Conta
          </IonButton>

          <IonText className="text-footer">
            <p>
              Já tem uma conta?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#4fcdfc', cursor: 'pointer' }}>
                Faça login aqui
              </span>
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Register