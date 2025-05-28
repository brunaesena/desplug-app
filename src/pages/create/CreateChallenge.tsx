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
import Footer from '../../components/Footer';
import './CreateChallenge.css';

type Difficulty = 'facil' | 'medio' | 'dificil' | '';

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
      case 'facil': return 'success';
      case 'medio': return 'warning';
      case 'dificil': return 'danger';
      default: return 'medium';
    }
  };

  const getDifficultyLabel = (): string => {
    switch (difficulty) {
      case 'facil': return 'Fácil';
      case 'medio': return 'Médio';
      case 'dificil': return 'Difícil';
      default: return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    
    console.log('Desafio criado:', { title, description, difficulty });
    setShowToast(true);
    
    setTimeout(() => {
      router.push('/home', 'root');
    }, 1500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header-toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Criar Desafio</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-intro">
            <IonIcon icon={createOutline} className="form-icon" />
            <h2>Novo Desafio</h2>
            <p>Compartilhe um desafio interessante com a comunidade</p>
          </div>
          
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
              <IonSelectOption value="facil">Fácil</IonSelectOption>
              <IonSelectOption value="medio">Médio</IonSelectOption>
              <IonSelectOption value="dificil">Difícil</IonSelectOption>
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
          message="Desafio criado com sucesso!"
          duration={1500}
          position="bottom"
          color="success"
          cssClass="success-toast"
          icon={checkmarkDoneOutline}
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateChallenge;