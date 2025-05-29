import React, { useState, useEffect } from 'react';
import {
  IonPage,
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
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { getAllLectures, subscribeToActivity, isUserSubscribed } from '../../utils/firestore';
import { auth } from '../../firebase';
import type { Lecture } from '../../types/firestore';
import Footer from '../../components/Footer';
import './shared-styles.css'

const Lectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');
  const [subscribedLectures, setSubscribedLectures] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lecturesData = await getAllLectures();
        setLectures(lecturesData);

        // Check subscription status for each lecture
        const userId = auth.currentUser?.uid;
        if (userId) {
          const subscriptionPromises = lecturesData.map(lecture => 
            isUserSubscribed(userId, lecture.id)
          );
          const subscriptionResults = await Promise.all(subscriptionPromises);
          const subscribedIds = new Set(
            lecturesData
              .filter((_, index) => subscriptionResults[index])
              .map(lecture => lecture.id)
          );
          setSubscribedLectures(subscribedIds);
        }
      } catch (error) {
        console.error('Erro ao buscar palestras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  const handleSubscribe = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedLecture || !auth.currentUser?.uid) return;

    try {
      await subscribeToActivity(
        auth.currentUser.uid,
        selectedLecture.id,
        'lecture',
        isRepresentative ? {
          isRepresentative,
          contactPhone,
          preferredLocation: location
        } : undefined
      );

      setSubscribedLectures(prev => new Set([...prev, selectedLecture.id]));
      alert(`Inscrição confirmada para: ${selectedLecture.title}`);
    } catch (error) {
      console.error('Erro ao se inscrever na palestra:', error);
      alert('Erro ao confirmar inscrição. Tente novamente.');
    }

    // Reset form
    setShowModal(false);
    setIsRepresentative(false);
    setContactPhone('');
    setLocation('');
  };

  const formatDateTime = (timestamp: any) => {
    const date = timestamp.toDate();
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Palestras</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Link to="/home" className="back-button">
          <IonIcon icon={chevronBackOutline} />
          Voltar
        </Link>
        <div className="ion-content-inner">
          {loading ? (
            <div className="ion-text-center ion-padding">
              <IonSpinner />
              <p>Carregando palestras...</p>
            </div>
          ) : lectures.length === 0 ? (
            <div className="ion-text-center ion-padding">
              <p>Nenhuma palestra disponível no momento.</p>
            </div>
          ) : (
            lectures.map((lecture) => (
              <IonCard key={lecture.id}>
                <IonCardHeader>
                  <IonCardTitle>{lecture.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{lecture.description}</p>
                  <p className="event-details">
                    <strong>Data e Hora:</strong> {formatDateTime(lecture.date)}
                  </p>
                  <p className="event-details">
                    <strong>Local:</strong> {lecture.location}
                  </p>
                  {lecture.isLocationFlexible && (
                    <p className="event-details ion-text-info">
                      Esta palestra pode ser realizada em outras instituições
                    </p>
                  )}
                  {subscribedLectures.has(lecture.id) ? (
                    <IonButton expand="block" color="success" disabled>
                      Inscrito
                    </IonButton>
                  ) : (
                    <IonButton expand="block" onClick={() => handleSubscribe(lecture)}>
                      Inscrever-se
                    </IonButton>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Inscrição em palestra</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedLecture && (
              <>
                <p>Deseja se inscrever na palestra: <strong>{selectedLecture.title}</strong>?</p>
                <p>Data: {formatDateTime(selectedLecture.date)}</p>
                <p>Local: {selectedLecture.location}</p>

                {selectedLecture.isLocationFlexible && (
                  <IonItem>
                    <IonCheckbox
                      checked={isRepresentative}
                      onIonChange={(e) => setIsRepresentative(e.detail.checked)}
                    />
                    <IonLabel className="ion-margin-start">
                      Sou professor/representante e desejo realizar a palestra na minha instituição
                    </IonLabel>
                  </IonItem>
                )}

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
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Lectures;
