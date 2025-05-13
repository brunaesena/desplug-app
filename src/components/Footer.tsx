import { IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react'
import {
  homeOutline,
  searchOutline,
  calendarOutline,
  personOutline
} from 'ionicons/icons'
import { useNavigate } from 'react-router-dom'

const Footer: React.FC = () => {
  const navigate = useNavigate()

  return (
    <IonFooter>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" onClick={() => navigate('/home')}>
          <IonIcon icon={homeOutline} />
          <IonLabel>Início</IonLabel>
        </IonTabButton>

        <IonTabButton tab="buscar" onClick={() => navigate('/buscar')}>
          <IonIcon icon={searchOutline} />
          <IonLabel>Buscar</IonLabel>
        </IonTabButton>

        <IonTabButton tab="eventos" onClick={() => navigate('/eventos')}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>Eventos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" onClick={() => navigate('/profile')}>
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  )
}

export default Footer
