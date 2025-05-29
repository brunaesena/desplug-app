import { IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react'
import {
  homeSharp,
  calendarClearSharp,
  personCircleSharp
} from 'ionicons/icons'
import { useNavigate } from 'react-router-dom'
import './Footer.css'

const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <IonFooter>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" onClick={() => navigate('/home')}>
          <IonIcon icon={homeSharp} />
          <IonLabel>Início</IonLabel>
        </IonTabButton>

        <IonTabButton tab="eventos" onClick={() => navigate('/eventos')}>
          <IonIcon icon={calendarClearSharp} />
          <IonLabel>Eventos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" onClick={() => navigate('/profile')}>
          <IonIcon icon={personCircleSharp} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  )
}

export default Footer