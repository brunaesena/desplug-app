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
  useIonRouter,
} from '@ionic/react';
import Footer from '../../components/Footer';
import './CreateChallenge.css';

const CreateChallenge: React.FC = () => {
  const router = useIonRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({
      title,
      description,
      difficulty,
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
          <IonTitle>Criar Desafio</IonTitle>
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
              placeholder="Digite o título do desafio"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descrição</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={e => setDescription(e.detail.value!)}
              required
              placeholder="Digite a descrição do desafio"
              rows={4}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Dificuldade</IonLabel>
            <IonSelect
              value={difficulty}
              onIonChange={e => setDifficulty(e.detail.value)}
              placeholder="Selecione a dificuldade"
              required
            >
              <IonSelectOption value="facil">Fácil</IonSelectOption>
              <IonSelectOption value="medio">Médio</IonSelectOption>
              <IonSelectOption value="dificil">Difícil</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonButton expand="block" type="submit" className="submit-button">
            Criar Desafio
          </IonButton>
        </form>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Desafio criado com sucesso!"
          duration={1500}
          position="bottom"
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default CreateChallenge; 