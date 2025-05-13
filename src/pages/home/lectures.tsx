import React, { useState } from 'react';
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
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonCheckbox,
  IonList
} from '@ionic/react';
import Footer from '../../components/Footer';

const lectures = [
  {
    title: 'A Importância da Desconexão Digital',
    description: 'Entenda como o uso excessivo de tecnologia impacta a saúde mental e estratégias para equilibrar.'
  },
  {
    title: 'Tecnologia e Bem-Estar na Juventude',
    description: 'Palestra voltada para estudantes sobre como criar hábitos saudáveis com o uso de telas.'
  },
  {
    title: 'Famílias e o Desafio da Era Digital',
    description: 'Um olhar para os conflitos e soluções familiares relacionados ao uso constante de dispositivos.'
  }
];

const Lectures: React.FC = () => {
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');

  const handleSubscribe = (title: string) => {
    setSelectedLecture(title);
    setShowModal(true);
  };

  const handleConfirm = () => {
    // Aqui você pode salvar no banco ou enviar para API
    console.log('Palestra:', selectedLecture);
    if (isRepresentative) {
      console.log('Telefone:', contactPhone);
      console.log('Local desejado:', location);
    }
    // Resetar
    setShowModal(false);
    setIsRepresentative(false);
    setContactPhone('');
    setLocation('');
    alert(`Inscrição confirmada para: ${selectedLecture}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="app-title">Palestras</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {lectures.map((lecture, index) => (
          <IonCard key={index}>
            <IonCardHeader>
              <IonCardTitle>{lecture.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{lecture.description}</p>
              <IonButton expand="block" onClick={() => handleSubscribe(lecture.title)}>
                Inscrever-se
              </IonButton>
            </IonCardContent>
          </IonCard>
        ))}

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Inscrição em palestra</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <p>Deseja se inscrever na palestra: <strong>{selectedLecture}</strong>?</p>

            <IonItem>
              <IonCheckbox
                checked={isRepresentative}
                onIonChange={(e) => setIsRepresentative(e.detail.checked)}
              />
              <IonLabel className="ion-margin-start">
                Sou professor/representante e desejo realizar a palestra na minha instituição
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

export default Lectures;
