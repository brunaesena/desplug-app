import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonTextarea,
  IonInput,
  IonLabel,
  IonItem,
  IonIcon,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { createDayInfo } from '../../../../utils/firestore';
import { auth } from '../../../../firebase';
import './createDayInfo.css';

const CreateDayInfo: React.FC = () => {
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!auth.currentUser) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    if (description.length > 200) {
      setError('A descrição deve ter no máximo 200 caracteres');
      setLoading(false);
      return;
    }

    try {
      await createDayInfo({
        description,
        link,
        createdBy: auth.currentUser.uid,
        createdAt: new Date()
      });

      // Reset form
      setDescription('');
      setLink('');
      alert('Informação do dia criada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar informação do dia:', err);
      setError('Erro ao criar informação do dia. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/admin/criar" />
          </IonButtons>
          <IonTitle>Criar Informação do Dia</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding">
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Descrição (máx. 200 caracteres)</IonLabel>
              <IonTextarea
                value={description}
                onIonChange={e => setDescription(e.detail.value!)}
                maxlength={200}
                rows={4}
                required
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Link do artigo</IonLabel>
              <IonInput
                type="url"
                value={link}
                onIonChange={e => setLink(e.detail.value!)}
                required
              />
            </IonItem>

            {error && <p className="error-message">{error}</p>}

            <IonButton
              expand="block"
              type="submit"
              disabled={loading}
              className="ion-margin-top"
            >
              {loading ? 'Criando...' : 'Criar Informação do Dia'}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateDayInfo;
