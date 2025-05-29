import React, { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardContent, IonButton, IonInput, IonLabel, IonItem, IonModal,
  IonCheckbox, IonList, IonHeader, IonToolbar, IonTitle, IonIcon,
  IonSpinner
} from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import { getAllEvents, subscribeToActivity, isUserSubscribed } from '../../utils/firestore';
import { auth } from '../../firebase';
import type { Event } from '../../types/firestore';
import './shared-styles.css'

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isRepresentative, setIsRepresentative] = useState(false);
  const [contactPhone, setContactPhone] = useState('');
  const [location, setLocation] = useState('');
  const [subscribedEvents, setSubscribedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);

        // Check subscription status for each event
        const userId = auth.currentUser?.uid;
        if (userId) {
          const subscriptionPromises = eventsData.map(event => 
            isUserSubscribed(userId, event.id)
          );
          const subscriptionResults = await Promise.all(subscriptionPromises);
          const subscribedIds = new Set(
            eventsData
              .filter((_, index) => subscriptionResults[index])
              .map(event => event.id)
          );
          setSubscribedEvents(subscribedIds);
        }
      } catch (error) {
        console.error('Erro ao buscar eventos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSubscribe = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedEvent || !auth.currentUser?.uid) return;

    try {
      await subscribeToActivity(
        auth.currentUser.uid,
        selectedEvent.id,
        'event',
        isRepresentative ? {
          isRepresentative,
          contactPhone,
          preferredLocation: location
        } : undefined
      );

      setSubscribedEvents(prev => new Set([...prev, selectedEvent.id]));
      alert(`Inscrição confirmada para: ${selectedEvent.title}`);
    } catch (error) {
      console.error('Erro ao se inscrever no evento:', error);
      alert('Erro ao confirmar inscrição. Tente novamente.');
    }

    // Reset form
    setShowModal(false);
    setIsRepresentative(false);
    setContactPhone('');
    setLocation('');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
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
          <IonTitle>Eventos</IonTitle>
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
              <p>Carregando eventos...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="ion-text-center ion-padding">
              <p>Nenhum evento disponível no momento.</p>
            </div>
          ) : (
            events.map((event) => (
              <IonCard key={event.id}>
                <IonCardHeader>
                  <IonCardTitle>{event.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{event.description}</p>
                  <p className="event-details">
                    <strong>Data e Hora:</strong> {formatDate(event.date.toDate())}
                  </p>
                  <p className="event-details">
                    <strong>Local:</strong> {event.location}
                  </p>
                  {event.isLocationFlexible && (
                    <p className="event-details ion-text-info">
                      Este evento pode ser realizado em outras instituições
                    </p>
                  )}
                  {subscribedEvents.has(event.id) ? (
                    <IonButton expand="block" color="success" disabled>
                      Inscrito
                    </IonButton>
                  ) : (
                    <IonButton expand="block" onClick={() => handleSubscribe(event)}>
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
              <IonTitle>Inscrição em evento</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedEvent && (
              <>
                <p>Deseja se inscrever no evento: <strong>{selectedEvent.title}</strong>?</p>
                <p>Data: {formatDate(selectedEvent.date.toDate())}</p>
                <p>Local: {selectedEvent.location}</p>

                {selectedEvent.isLocationFlexible && (
                  <IonItem>
                    <IonCheckbox
                      checked={isRepresentative}
                      onIonChange={(e) => setIsRepresentative(e.detail.checked)}
                    />
                    <IonLabel className="ion-margin-start">
                      Sou professor/representante e desejo realizar o evento na minha instituição
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

export default Events;
