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
  IonCheckbox,
  IonSelect,
  IonSelectOption
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
  
  // Novos estados para campos de prestador de serviço
  const [profession, setProfession] = useState('')
  const [degree, setDegree] = useState('')
  const [graduationYear, setGraduationYear] = useState<number | ''>('')

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
    if (isProvider) {
      if (!profession.trim()) {
        setError('Profissão é obrigatória para prestadores de serviço.')
        return false
      }
      if (!degree.trim()) {
        setError('Graduação é obrigatória para prestadores de serviço.')
        return false
      }
      if (!graduationYear) {
        setError('Ano de graduação é obrigatório para prestadores de serviço.')
        return false
      }
      const currentYear = new Date().getFullYear()
      if (graduationYear > currentYear) {
        setError('Ano de graduação não pode ser maior que o ano atual.')
        return false
      }
    }
    return true
  }

  const handleRegister = async () => {
    setError('')
    if (!validate()) return

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid

      const userData = {
        uid,
        name,
        email,
        phone,
        type: isProvider ? 'admin' : 'user',
        isProvider,
        // Incluir campos de prestador apenas se isProvider for true
        profession: isProvider ? profession : null,
        degree: isProvider ? degree : null,
        graduationYear: isProvider ? Number(graduationYear) : null,
        createdAt: serverTimestamp()
      }

      await setDoc(doc(db, 'users', uid), userData)
      navigate('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Lista de anos para o select de ano de graduação
  const graduationYears = () => {
    const currentYear = new Date().getFullYear()
    const years = []
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year)
    }
    return years
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="register-container">
          <IonImg src="/logo.png" className="logo-img" />

          {error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          <IonItem className="input-field">
            <IonInput
              type="text"
              value={name}
              onIonChange={e => setName(e.detail.value!)}
              required
              clearInput={true}
              placeholder="Nome"
            />
          </IonItem>

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
              type="tel"
              value={phone}
              onIonChange={e => setPhone(e.detail.value!)}
              required
              clearInput={true}
              placeholder="Telefone"
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

          <IonItem className="input-field">
            <IonInput
              type="password"
              value={confirmPassword}
              onIonChange={e => setConfirmPassword(e.detail.value!)}
              required
              clearInput={true}
              placeholder="Confirmar Senha"
            />
          </IonItem>

          <IonItem className="checkbox-item">
            <IonCheckbox
              checked={isProvider}
              onIonChange={e => setIsProvider(e.detail.checked)}
            />
            <IonLabel>Sou prestador de serviço</IonLabel>
          </IonItem>

          {/* Campos adicionais para prestadores de serviço */}
          {isProvider && (
            <>
              <IonItem className="input-field provider-field">
                <IonInput
                  type="text"
                  value={profession}
                  onIonChange={e => setProfession(e.detail.value!)}
                  required
                  clearInput={true}
                  placeholder="Profissão"
                />
              </IonItem>

              <IonItem className="input-field provider-field">
                <IonInput
                  type="text"
                  value={degree}
                  onIonChange={e => setDegree(e.detail.value!)}
                  required
                  clearInput={true}
                  placeholder="Graduação"
                />
              </IonItem>

              <IonItem className="input-field provider-field">
                <IonSelect
                  value={graduationYear}
                  onIonChange={e => setGraduationYear(e.detail.value)}
                  required
                  placeholder="Ano de Graduação"
                  interface="popover"
                >
                  {graduationYears().map(year => (
                    <IonSelectOption key={year} value={year}>
                      {year}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </>
          )}

          <IonButton className="register-btn" expand="block" onClick={handleRegister}>
            Registrar
          </IonButton>

          <div className="text-footer">
            <p>
              Já tem uma conta?{' '}
              <span onClick={() => navigate('/login')}>
                Faça login aqui
              </span>
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Register