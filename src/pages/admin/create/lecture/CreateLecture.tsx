import React, { useState, useRef, useEffect } from 'react';
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
import { Timestamp } from 'firebase/firestore';
import { auth } from '../../../../firebase';
import { createLecture } from '../../../../utils/firestore';
import Footer from '../../../../components/Footer';
import './CreateLecture.css';

const CreateLecture: React.FC = () => {
  const router = useIonRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [isLocationFlexible, setIsLocationFlexible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const datePickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDatePicker &&
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDatePicker]);

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
      }

      if (!selectedDate || !selectedTime) {
        throw new Error('Data e hora são obrigatórios');
      }

      const date = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split('T')[1].split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);

      if (isNaN(date.getTime())) {
        throw new Error('Data ou hora inválida');
      }

      const lectureData = {
        creatorId: auth.currentUser.uid,
        title,
        description,
        date: Timestamp.fromDate(date),
        location,
        isLocationFlexible,
      };

      await createLecture(lectureData);
      setToastMessage('Palestra criada com sucesso!');
      setIsError(false);
      setShowToast(true);

      setTimeout(() => {
        router.push('/home', 'root');
      }, 1500);
    } catch (error) {
      console.error('Erro ao criar palestra:', error);
      setToastMessage(error instanceof Error ? error.message : 'Erro ao criar palestra. Tente novamente.');
      setIsError(true);
      setShowToast(true);
    }
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

          <IonItem onClick={() => setShowDatePicker(true)}>
            <IonLabel position="stacked">Data</IonLabel>
            <IonInput
              className={selectedDate ? 'date-time-selected' : 'date-time-placeholder'}
              value={selectedDate ? formatDate(selectedDate) : 'Clique para selecionar'}
              readonly
              placeholder="Selecione a data"
            />
          </IonItem>

          <div className="datetime-wrapper">
            {showDatePicker && (
              <IonDatetime
                presentation="date"
                preferWheel={true}
                min={new Date().toISOString()}
                locale="pt-BR"
                value={selectedDate}
                onIonChange={e => {
                  setSelectedDate(e.detail.value as string);
                  setShowDatePicker(false);
                }}
                showDefaultButtons={true}
                doneText="Confirmar"
                cancelText="Cancelar"
                onIonCancel={() => setShowDatePicker(false)}
              />
            )}
          </div>

          <IonItem onClick={() => setShowTimePicker(true)}>
            <IonLabel position="stacked">Horário</IonLabel>
            <IonInput
              className={selectedTime ? 'date-time-selected' : 'date-time-placeholder'}
              value={selectedTime ? formatTime(selectedTime) : 'Clique para selecionar'}
              readonly
              placeholder="Selecione o horário"
            />
          </IonItem>

          <div className="datetime-wrapper">
            {showTimePicker && (
              <IonDatetime
                presentation="time"
                preferWheel={true}
                locale="pt-BR"
                value={selectedTime}
                onIonChange={e => {
                  setSelectedTime(e.detail.value as string);
                  setShowTimePicker(false);
                }}
                showDefaultButtons={true}
                doneText="Confirmar"
                cancelText="Cancelar"
                onIonCancel={() => setShowTimePicker(false)}
                hourCycle="h23"
              />
            )}
          </div>

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
              checked={isLocationFlexible}
              onIonChange={e => setIsLocationFlexible(e.detail.checked)}
            />
          </IonItem>

          <IonButton expand="block" type="submit" className="submit-button">
            Criar Palestra
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={1500}
          position="bottom"
          color={isError ? 'danger' : 'success'}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default CreateLecture; 