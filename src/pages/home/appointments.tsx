import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAlert
} from '@ionic/react';
import Footer from '../../components/Footer';

const appointments = [
  {
    title: 'Como lidar com um dependente de internet em casa',
    description: 'Aprenda estratégias para orientar e apoiar alguém com uso excessivo da internet.'
  },
  {
    title: 'Como diminuir a quantidade de tela na educação infantil doméstica',
    description: 'Dicas e práticas para promover menos tempo de tela e mais atividades presenciais com crianças.'
  },
  {
    title: 'Organizando a rotina digital da família',
    description: 'Entenda como criar limites saudáveis de tempo online para todos em casa.'
  }
];

const Appointments: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (selectedAppointment) {
      setShowAlert(true);
    }
  }, [selectedAppointment]);

  const handleParticipar = (title: string) => {
    setSelectedAppointment(title);
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);
    setSelectedAppointment(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="app-title">Consultorias</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {appointments.map((item, index) => (
          <IonCard key={index} className="appointment-card">
            <IonCardHeader>
              <IonCardTitle>{item.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{item.description}</p>
              <IonButton expand="block" onClick={() => handleParticipar(item.title)}>
                Participar
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertDismiss}
          header="Inscrição realizada!"
          message={`Você se inscreveu na consultoria: "${selectedAppointment}"`}
          buttons={['OK']}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Appointments;