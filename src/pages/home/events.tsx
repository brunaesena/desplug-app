import React, { useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonInput, IonLabel, IonItem, IonModal,
  IonCheckbox, IonList
} from '@ionic/react';
import Footer from '../../components/Footer';

const events = [
  {
    title: 'Roda de Conversa sobre Ansiedade',
    description: 'Participe de um encontro com especialistas para discutir como lidar com a ansiedade.'
  },
  {
    title: 'Workshop de Respiração e Relaxamento',
    description: 'Aprenda técnicas de respiração consciente para reduzir o estresse.'
  },
  {
    title: 'Palestra sobre Saúde Mental nas Universidades',
    description: 'Debata a importância do cuidado psicológico no ambiente acadêmico.'
  }
];

const Events: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSubscribe = (title: string) => {
    setSelectedEvent(title);
    setShowModal(true);
  };

  const handleConfirm = () => {
    // Aqui você pode salvar no banco ou enviar para API
    console.log('Evento:', selectedEvent);
    if (isRepresentative) {
      console.log('Telefone:', contactPhone);
      console.log('Local desejado:', location);
    }
    // Resetar
    setShowModal(false);
    setIsRepresentative(false);
    setContactPhone('');
    setLocation('');
    alert(`Inscrição confirmada para: ${selectedEvent}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="app-title">Eventos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {events.map((event, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>{event.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{event.description}</p>
              <IonButton expand="block" onClick={() => handleSubscribe(event.title)}>
                Inscrever-se
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Inscrição em evento</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p>Deseja se inscrever no evento: <strong>{selectedEvent}</strong>?</p>

            <IonItem>
              <IonCheckbox
                checked={isRepresentative}
                onIonChange={(e) => setIsRepresentative(e.detail.checked)}
              />
              <IonLabel className="ion-margin-start">
                Sou professor/representante e desejo realizar o evento na minha instituição
              </IonLabel>
            </IonItem>

            {isRepresentative && (
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Telefone para contato</IonLabel>
                  <IonInput
                    type="tel"
                    value={contactPhone}
                    onIonChange={(e) => setContactPhone(e.detail.value!)}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Local desejado</IonLabel>
                  <IonInput
                    value={location}
                    onIonChange={(e) => setLocation(e.detail.value!)}
                  />
                </IonItem>
              </IonList>
            )}

            <div className="ion-padding-top">
              <IonButton expand="block" onClick={handleConfirm}>Confirmar</IonButton>
              <IonButton expand="block" fill="clear" onClick={() => setShowModal(false)}>Cancelar</IonButton>
            </div>
          </IonContent>
        </IonModal>
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Events;
