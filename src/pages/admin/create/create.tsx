import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/react';
import {
  calendarOutline,
  megaphoneOutline,
  medicalOutline,
  informationCircleOutline,
  trophyOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import Footer from '../../../components/Footer';
import './create.css';

const Create: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Criar Atividade</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="create-options">
          <IonButton 
            expand="block"
            className="create-button"
            onClick={() => history.push('/admin/criar/evento')}
          >
            <IonIcon slot="start" icon={calendarOutline} />
            Criar Evento
          </IonButton>

          <IonButton
            expand="block" 
            className="create-button"
            onClick={() => history.push('/admin/criar/palestra')}
          >
            <IonIcon slot="start" icon={megaphoneOutline} />
            Criar Palestra
          </IonButton>

          <IonButton
            expand="block"
            className="create-button"
            onClick={() => history.push('/admin/criar/consulta')}
          >
            <IonIcon slot="start" icon={medicalOutline} />
            Criar Consulta
          </IonButton>

          <IonButton
            expand="block"
            className="create-button"
            onClick={() => history.push('/admin/criar/desafio')}
          >
            <IonIcon slot="start" icon={trophyOutline} />
            Criar Desafio
          </IonButton>

          <IonButton
            expand="block"
            className="create-button"
            disabled
          >
            <IonIcon slot="start" icon={informationCircleOutline} />
            Criar Informação do Dia
          </IonButton>
        </div>
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Create;