import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonToggle,
  IonButton,
  IonToast,
  useIonRouter,
} from '@ionic/react';
import Footer from '../../components/Footer';
import './CreateLecture.css';

const CreateLecture: React.FC = () => {
  const router = useIonRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [location, setLocation] = useState('');
  const [isAvailableForSchools, setIsAvailableForSchools] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Combine date and time
    const dateTime = selectedDate && selectedTime 
      ? `${selectedDate.split('T')[0]}T${selectedTime.split('T')[1]}`
      : '';
      
    // Here you would typically send the data to your backend
    console.log({
      title,
      description,
      dateTime,
      location,
      isAvailableForSchools,
    });
    setShowToast(true);
    setTimeout(() => {
      router.push('/home', 'root');
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Criar Palestra</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} className="create-form">
          <IonItem>
            <IonLabel position="stacked">Título</IonLabel>
            <IonInput
              value={title}
              onIonChange={e => setTitle(e.detail.value!)}
              required
              placeholder="Digite o título da palestra"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descrição</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={e => setDescription(e.detail.value!)}
              required
              placeholder="Digite a descrição da palestra"
              rows={4}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Data</IonLabel>
            <IonDatetime
              value={selectedDate}
              onIonChange={e => setSelectedDate(e.detail.value as string)}
              presentation="date"
              preferWheel={true}
              min={new Date().toISOString()}
              locale="pt-BR"
            >
              <span slot="title">Selecione a data</span>
            </IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Horário</IonLabel>
            <IonDatetime
              value={selectedTime}
              onIonChange={e => setSelectedTime(e.detail.value as string)}
              presentation="time"
              preferWheel={true}
              locale="pt-BR"
              hourCycle="h23"
            >
              <span slot="title">Selecione o horário</span>
            </IonDatetime>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Local</IonLabel>
            <IonInput
              value={location}
              onIonChange={e => setLocation(e.detail.value!)}
              required
              placeholder="Digite o local da palestra"
            />
          </IonItem>

          <IonItem>
            <IonLabel>Disponível para escolas</IonLabel>
            <IonToggle
              checked={isAvailableForSchools}
              onIonChange={e => setIsAvailableForSchools(e.detail.checked)}
            />
          </IonItem>

          <IonButton expand="block" type="submit" className="submit-button">
            Criar Palestra
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Palestra criada com sucesso!"
          duration={1500}
          position="bottom"
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateLecture; 