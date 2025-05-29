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
  IonSelect,
  IonSelectOption,
  IonButton,
  IonToast,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonBadge,
  useIonRouter,
} from '@ionic/react';
import { checkmarkDoneOutline, createOutline } from 'ionicons/icons';
import { auth } from '../../../../firebase';
import { createChallenge } from '../../../../utils/firestore';
import Footer from '../../../../components/Footer';
import './CreateChallenge.css';

type Difficulty = 'easy' | 'medium' | 'hard' | '';

interface FormErrors {
  title?: string;
  description?: string;
  difficulty?: string;
}

const CreateChallenge: React.FC = () => {
  const router = useIonRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState<'success' | 'danger'>('success');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isTouched, setIsTouched] = useState({
    title: false,
    description: false,
    difficulty: false,
  });

  const validateField = (field: keyof FormErrors, value: string) => {
    const newErrors = {...formErrors};
    
    switch (field) {
      case 'title':
        newErrors.title = value.trim().length < 3 ? 
          'O título deve ter pelo menos 3 caracteres' : undefined;
        break;
      case 'description':
        newErrors.description = value.trim().length < 10 ? 
          'A descrição deve ter pelo menos 10 caracteres' : undefined;
        break;
      case 'difficulty':
        newErrors.difficulty = !value ? 
          'Selecione uma dificuldade' : undefined;
        break;
    }
    
    setFormErrors(newErrors);
  };

  const handleInputChange = (field: keyof FormErrors, value: string) => {
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'difficulty':
        setDifficulty(value as Difficulty);
        break;
    }
    
    validateField(field, value);
  };

  const handleBlur = (field: keyof typeof isTouched) => {
    setIsTouched({...isTouched, [field]: true});
  };

  const isFormValid = 
    title.trim().length >= 3 && 
    description.trim().length >= 10 && 
    difficulty !== '';

  const getDifficultyColor = (): string => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  };

  const getDifficultyLabel = (): string => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marca todos os campos como tocados para mostrar erros
    setIsTouched({
      title: true,
      description: true,
      difficulty: true,
    });
    
    // Valida todos os campos
    validateField('title', title);
    validateField('description', description);
    validateField('difficulty', difficulty);
    
    if (!isFormValid) {
      console.log('Formulário inválido', formErrors);
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error('Usuário não autenticado');
      }

      const challengeData = {
        creatorId: auth.currentUser.uid,
        title: title.trim(),
        description: description.trim(),
        difficulty: difficulty as 'easy' | 'medium' | 'hard'
      };

      await createChallenge(challengeData);
      setToastMessage('Desafio criado com sucesso!');
      setToastColor('success');
      setShowToast(true);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDifficulty('');
      setIsTouched({
        title: false,
        description: false,
        difficulty: false,
      });
      setFormErrors({});

    } catch (error) {
      console.error('Erro ao criar desafio:', error);
      setToastMessage(error instanceof Error ? error.message : 'Erro ao criar desafio');
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
          <IonTitle>Criar Desafio</IonTitle>
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
              placeholder="Digite o título do desafio"
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
              placeholder="Digite a descrição do desafio"
              rows={4}
              className="custom-textarea"
            />
            {isTouched.description && formErrors.description && (
              <div className="error-message" aria-live="polite">
                {formErrors.description}
              </div>
            )}
          </IonItem>

          <IonItem 
            className={`custom-item ${isTouched.difficulty && formErrors.difficulty ? 'ion-invalid' : ''}`}
          >
            <IonLabel position="stacked">Dificuldade</IonLabel>
            <IonSelect
              value={difficulty}
              onIonChange={e => handleInputChange('difficulty', e.detail.value)}
              onIonBlur={() => handleBlur('difficulty')}
              placeholder="Selecione a dificuldade"
              className="custom-select"
              interface="popover"
            >
              <IonSelectOption value="easy">Fácil</IonSelectOption>
              <IonSelectOption value="medium">Médio</IonSelectOption>
              <IonSelectOption value="hard">Difícil</IonSelectOption>
            </IonSelect>
            {isTouched.difficulty && formErrors.difficulty && (
              <div className="error-message" aria-live="polite">
                {formErrors.difficulty}
              </div>
            )}
          </IonItem>

          {difficulty && (
            <div className="difficulty-preview">
              <span>Visualização:</span>
              <IonBadge color={getDifficultyColor()} className="difficulty-badge">
                {getDifficultyLabel()}
              </IonBadge>
            </div>
          )}

          <IonButton 
            expand="block" 
            type="submit" 
            className="submit-button"
            disabled={!isFormValid}
          >
            <IonIcon icon={checkmarkDoneOutline} slot="start" />
            Criar Desafio
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

export default CreateChallenge;