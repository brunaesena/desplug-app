import { IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton } from '@ionic/react'
import {
  homeOutline,
  searchOutline,
  calendarOutline,
  personOutline
} from 'ionicons/icons'
import { useHistory } from 'react-router'

const Footer: React.FC = () => {
  const history = useHistory()

  return (
    <IonFooter>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" onClick={() => history.push('/home')}>
          <IonIcon icon={homeOutline} />
          <IonLabel>Início</IonLabel>
        </IonTabButton>

        <IonTabButton tab="buscar" onClick={() => history.push('/buscar')}>
          <IonIcon icon={searchOutline} />
          <IonLabel>Buscar</IonLabel>
        </IonTabButton>

        <IonTabButton tab="eventos" onClick={() => history.push('/eventos')}>
          <IonIcon icon={calendarOutline} />
          <IonLabel>Eventos</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" onClick={() => history.push('/profile')}>
          <IonIcon icon={personOutline} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  )
}

export default Footer
