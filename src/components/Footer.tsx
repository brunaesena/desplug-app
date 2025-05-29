import { IonFooter, IonIcon, IonLabel, IonTabBar, IonTabButton, IonButton } from '@ionic/react'
import {
  homeSharp,
  calendarClearSharp,
  personCircleSharp,
  addCircleOutline
} from 'ionicons/icons'
import { useLocation, useHistory } from 'react-router-dom'
import { useAuthState } from '../hooks/useAuthState'
import './Footer.css'

const Footer: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { isAdmin, loading } = useAuthState();

  const navigateTo = (path: string) => {
    history.push(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <IonFooter>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" onClick={() => navigateTo('/home')}>
          <IonIcon icon={homeSharp} />
          <IonLabel>Início</IonLabel>
        </IonTabButton>

        {!loading && isAdmin && (
          <IonTabButton tab="criar" onClick={() => navigateTo('/admin/criar')}>
            <IonIcon icon={addCircleOutline} />
            <IonLabel>Criar</IonLabel>
          </IonTabButton>
        )}

        <IonTabButton tab="inscricoes" onClick={() => navigateTo('/atividades')}>
          <IonIcon icon={calendarClearSharp} />
          <IonLabel>Minhas Atividades</IonLabel>
        </IonTabButton>

        <IonTabButton tab="perfil" onClick={() => navigateTo('/profile')}>
          <IonIcon icon={personCircleSharp} />
          <IonLabel>Perfil</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonFooter>
  )
}

export default Footer