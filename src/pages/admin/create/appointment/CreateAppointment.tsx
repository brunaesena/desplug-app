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
  IonButton,
  IonToast,
  IonIcon,
  IonBackButton,
  IonButtons,
  useIonRouter,
} from '@ionic/react';
import { checkmarkDoneOutline } from 'ionicons/icons';
import { auth } from '../../../../firebase';
import { createAppointment } from '../../../../utils/firestore';
import { Timestamp } from 'firebase/firestore';
import Footer from '../../../../components/Footer';
import './CreateAppointment.css';

interface FormErrors {
  title?: string;
  description?: string;
  timeSlots?: string;
}

const CreateAppointment: React.FC = () => {
  const router = useIonRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSlots, setTimeSlots] = useState<{ startTime: string; endTime: string }[]>([
    { startTime: '', endTime: '' }
  ]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState({
    title: false,
    description: false,
    timeSlots: false,
  });

  const validateField = (field: keyof FormErrors, value: any) => {
    const newErrors = { ...formErrors };

    switch (field) {
      case 'title':
        newErrors.title = value.trim().length < 3 ?
          'O título deve ter pelo menos 3 caracteres' : undefined;
        break;
      case 'description':
        newErrors.description = value.trim().length < 10 ?
          'A descrição deve ter pelo menos 10 caracteres' : undefined;
        break;
      case 'timeSlots':
        newErrors.timeSlots = value.some((slot: any) => !slot.startTime || !slot.endTime) ?
          'Todos os horários devem ser preenchidos' : undefined;
        break;
    }

    setFormErrors(newErrors);
  };

  const handleInputChange = (field: keyof FormErrors, value: any) => {
    switch (field) {
      case 'title':
        setTitle(value);
        validateField('title', value);
        break;
      case 'description':
        setDescription(value);
        validateField('description', value);
        break;
      case 'timeSlots':
        setTimeSlots(value);
        validateField('timeSlots', value);
        break;
    }
  };

  const handleBlur = (field: keyof typeof isTouched) => {
    setIsTouched({ ...isTouched, [field]: true });
  };

  const handleTimeSlotChange = (index: number, type: 'startTime' | 'endTime', value: string) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[index] = {
      ...newTimeSlots[index],
      [type]: value
    };
    handleInputChange('timeSlots', newTimeSlots);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: '', endTime: '' }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      const newTimeSlots = timeSlots.filter((_, i) => i !== index);
      handleInputChange('timeSlots', newTimeSlots);
    }
  };

  const isFormValid =
    title.trim().length >= 3 &&
    description.trim().length >= 10 &&
    timeSlots.every(slot => slot.startTime && slot.endTime);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsTouched({
      title: true,
      description: true,
      timeSlots: true,
    });

    validateField('title', title);
    validateField('description', description);
    validateField('timeSlots', timeSlots);

    if (!isFormValid) {
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const appointmentData = {
        creatorId: auth.currentUser.uid,
        title: title.trim(),
        description: description.trim(),
        availableTimeSlots: timeSlots.map(slot => ({
          startTime: Timestamp.fromDate(new Date(slot.startTime)),
          endTime: Timestamp.fromDate(new Date(slot.endTime))
        }))
      };

      await createAppointment(appointmentData);
      
      // Reset form
      setTitle('');
      setDescription('');
      setTimeSlots([{ startTime: '', endTime: '' }]);
      setIsTouched({
        title: false,
        description: false,
        timeSlots: false,
      });
      setFormErrors({});
      
      setToastMessage('Consultoria criada com sucesso!');
      setToastColor('success');
      setShowToast(true);
    } catch (error) {
      console.error('Erro ao criar consultoria:', error);
      setToastMessage(error instanceof Error ? error.message : 'Erro ao criar consultoria');
      setToastColor('danger');
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Criar Consultoria</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} className="create-form">
          <IonItem
            className={`custom-item ${isTouched.title && formErrors.title ? 'ion-invalid' : ''}`}
          >
            <IonLabel position="stacked">Título</IonLabel>
            <IonInput
              value={title}
              onIonChange={e => handleInputChange('title', e.detail.value!)}
              onIonBlur={() => handleBlur('title')}
              placeholder="Digite o título da consultoria"
              className="custom-input"
            />
            {isTouched.title && formErrors.title && (
              <div className="error-message" aria-live="polite">
                {formErrors.title}
              </div>
            )}
          </IonItem>

          <IonItem
            className={`custom-item ${isTouched.description && formErrors.description ? 'ion-invalid' : ''}`}
          >
            <IonLabel position="stacked">Descrição</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={e => handleInputChange('description', e.detail.value!)}
              onIonBlur={() => handleBlur('description')}
              placeholder="Digite a descrição da consultoria"
              rows={4}
              className="custom-textarea"
            />
            {isTouched.description && formErrors.description && (
              <div className="error-message" aria-live="polite">
                {formErrors.description}
              </div>
            )}
          </IonItem>

          <div className="time-slots-section">
            <IonLabel>Horários Disponíveis</IonLabel>
            {timeSlots.map((slot, index) => (
              <div key={index} className="time-slot">
                <IonItem>
                  <IonLabel position="stacked">Início</IonLabel>
                  <IonDatetime
                    value={slot.startTime}
                    onIonChange={e => handleTimeSlotChange(index, 'startTime', e.detail.value?.toString() || '')}
                    presentation="time-date"
                    min={new Date().toISOString()}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Fim</IonLabel>
                  <IonDatetime
                    value={slot.endTime}
                    onIonChange={e => handleTimeSlotChange(index, 'endTime', e.detail.value?.toString() || '')}
                    presentation="time-date"
                    min={slot.startTime || new Date().toISOString()}
                  />
                </IonItem>
                {timeSlots.length > 1 && (
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => removeTimeSlot(index)}
                  >
                    Remover
                  </IonButton>
                )}
              </div>
            ))}
            <IonButton
              fill="clear"
              onClick={addTimeSlot}
              className="add-slot-button"
            >
              Adicionar Horário
            </IonButton>
            {isTouched.timeSlots && formErrors.timeSlots && (
              <div className="error-message" aria-live="polite">
                {formErrors.timeSlots}
              </div>
            )}
          </div>

          <IonButton
            expand="block"
            type="submit"
            className="submit-button"
            disabled={!isFormValid}
          >
            <IonIcon icon={checkmarkDoneOutline} slot="start" />
            Criar Consultoria
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={1500}
          position="bottom"
          color={toastColor}
          cssClass="custom-toast"
          icon={toastColor === 'success' ? checkmarkDoneOutline : undefined}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateAppointment; 