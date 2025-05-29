import React, { useState, useEffect } from 'react';
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
  IonIcon,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonButton,
  IonToast,
} from '@ionic/react';
import { timeOutline, createOutline } from 'ionicons/icons';
import { auth } from '../../firebase';
import {
  getUserSubscribedEvents,
  getUserSubscribedLectures,
  getUserSubscribedChallenges,
  getUserSubscribedAppointments,
  getCreatedActivities
} from '../../utils/firestore';
import type { Event, Lecture, Challenge, Appointment } from '../../types/firestore';
import Footer from '../../components/Footer';
import { useHistory } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import './activities.css';

const Activities: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string | number>('all');
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [createdActivities, setCreatedActivities] = useState<{
    events: Event[];
    lectures: Lecture[];
    challenges: Challenge[];
    appointments: Appointment[];
  }>({
    events: [],
    lectures: [],
    challenges: [],
    appointments: []
  });

  const history = useHistory();
  const { isAdmin, loading: authLoading } = useAuthState();

  useEffect(() => {
    const fetchUserActivities = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error('Usuário não autenticado');
        }

        console.log('Is admin:', isAdmin); // Debug log

        const [eventsData, lecturesData, challengesData, appointmentsData] = await Promise.all([
          getUserSubscribedEvents(userId),
          getUserSubscribedLectures(userId),
          getUserSubscribedChallenges(userId),
          getUserSubscribedAppointments(userId)
        ]);

        setEvents(eventsData);
        setLectures(lecturesData);
        setChallenges(challengesData);
        setAppointments(appointmentsData);

        // Fetch created activities if user is admin
        if (isAdmin) {
          console.log('Fetching created activities for admin'); // Debug log
          const created = await getCreatedActivities(userId);
          console.log('Created activities:', created); // Debug log
          setCreatedActivities(created);
        }
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch activities when auth state is determined
    if (!authLoading) {
      fetchUserActivities();
    }
  }, [isAdmin, authLoading]);

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

  const getDifficultyColor = (difficulty: Challenge['difficulty']): string => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  };

  const getDifficultyLabel = (difficulty: Challenge['difficulty']): string => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return '';
    }
  };

  const handleEdit = (type: string, id: string) => {
    setShowToast(true);
  };

  const renderCreatedActivities = () => {
    if (!isAdmin) return null;

    const hasNoCreatedActivities = 
      createdActivities.events.length === 0 && 
      createdActivities.lectures.length === 0 && 
      createdActivities.challenges.length === 0 && 
      createdActivities.appointments.length === 0;

    if (hasNoCreatedActivities) {
      return (
        <div className="empty-state">
          <p>Você ainda não criou nenhuma atividade.</p>
        </div>
      );
    }

    return (
      <div className="created-activities-section">
        <h2>Atividades Criadas</h2>
        
        {createdActivities.events.length > 0 && (
          <>
            <h3>Eventos</h3>
            {createdActivities.events.map(event => (
              <IonCard key={event.id}>
                <IonCardHeader>
                  <IonCardTitle>{event.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{event.description}</p>
                  <p className="event-details">
                    <strong>Data e Hora:</strong> {formatDateTime(event.date)}
                  </p>
                  <p className="event-details">
                    <strong>Local:</strong> {event.location}
                  </p>
                  <IonButton 
                    className="edit-button"
                    onClick={() => handleEdit('event', event.id)}
                  >
                    <IonIcon slot="start" icon={createOutline} />
                    Editar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}

        {createdActivities.lectures.length > 0 && (
          <>
            <h3>Palestras</h3>
            {createdActivities.lectures.map(lecture => (
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
                  <IonButton 
                    className="edit-button"
                    onClick={() => handleEdit('lecture', lecture.id)}
                  >
                    <IonIcon slot="start" icon={createOutline} />
                    Editar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}

        {createdActivities.challenges.length > 0 && (
          <>
            <h3>Desafios</h3>
            {createdActivities.challenges.map(challenge => (
              <IonCard key={challenge.id}>
                <IonCardHeader>
                  <IonCardTitle>{challenge.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{challenge.description}</p>
                  <div className="difficulty-info">
                    <IonBadge color={getDifficultyColor(challenge.difficulty)}>
                      {getDifficultyLabel(challenge.difficulty)}
                    </IonBadge>
                  </div>
                  <IonButton 
                    className="edit-button"
                    onClick={() => handleEdit('challenge', challenge.id)}
                  >
                    <IonIcon slot="start" icon={createOutline} />
                    Editar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}

        {createdActivities.appointments.length > 0 && (
          <>
            <h3>Consultorias</h3>
            {createdActivities.appointments.map(appointment => (
              <IonCard key={appointment.id}>
                <IonCardHeader>
                  <IonCardTitle>{appointment.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{appointment.description}</p>
                  <div className="time-slots">
                    <h4>
                      <IonIcon icon={timeOutline} /> Horários:
                    </h4>
                    {appointment.availableTimeSlots.map((slot, index) => (
                      <div key={index} className="time-slot-info">
                        <IonBadge color="primary">
                          {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                        </IonBadge>
                      </div>
                    ))}
                  </div>
                  <IonButton 
                    className="edit-button"
                    onClick={() => handleEdit('appointment', appointment.id)}
                  >
                    <IonIcon slot="start" icon={createOutline} />
                    Editar
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="loading-state">
          <IonSpinner />
          <p>Carregando suas atividades...</p>
        </div>
      );
    }

    if (selectedSegment === 'created') {
      return renderCreatedActivities();
    }

    const hasNoActivities = 
      events.length === 0 && 
      lectures.length === 0 && 
      challenges.length === 0 && 
      appointments.length === 0;

    if (hasNoActivities) {
      return (
        <div className="empty-state">
          <p>Você ainda não está inscrito em nenhuma atividade.</p>
        </div>
      );
    }

    return (
      <>
        {(selectedSegment === 'all' || selectedSegment === 'events') && events.map(event => (
          <IonCard key={event.id}>
            <IonCardHeader>
              <IonCardTitle>{event.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{event.description}</p>
              <p className="event-details">
                <strong>Data e Hora:</strong> {formatDateTime(event.date)}
              </p>
              <p className="event-details">
                <strong>Local:</strong> {event.location}
              </p>
            </IonCardContent>
          </IonCard>
        ))}

        {(selectedSegment === 'all' || selectedSegment === 'lectures') && lectures.map(lecture => (
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
            </IonCardContent>
          </IonCard>
        ))}

        {(selectedSegment === 'all' || selectedSegment === 'challenges') && challenges.map(challenge => (
          <IonCard key={challenge.id}>
            <IonCardHeader>
              <IonCardTitle>{challenge.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{challenge.description}</p>
              <div className="difficulty-info">
                <IonBadge color={getDifficultyColor(challenge.difficulty)}>
                  {getDifficultyLabel(challenge.difficulty)}
                </IonBadge>
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        {(selectedSegment === 'all' || selectedSegment === 'appointments') && appointments.map(appointment => (
          <IonCard key={appointment.id}>
            <IonCardHeader>
              <IonCardTitle>{appointment.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{appointment.description}</p>
              <div className="time-slots">
                <h4>
                  <IonIcon icon={timeOutline} /> Horários:
                </h4>
                {appointment.availableTimeSlots.map((slot, index) => (
                  <div key={index} className="time-slot-info">
                    <IonBadge color="primary">
                      {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                    </IonBadge>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        ))}
      </>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Minhas Atividades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment value={selectedSegment} onIonChange={e => setSelectedSegment(e.detail.value!)}>
          <IonSegmentButton value="all">
            <IonLabel>Todos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="events">
            <IonLabel>Eventos</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="lectures">
            <IonLabel>Palestras</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="challenges">
            <IonLabel>Desafios</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="appointments">
            <IonLabel>Consultorias</IonLabel>
          </IonSegmentButton>
          {isAdmin && (
            <IonSegmentButton value="created">
              <IonLabel>Criadas</IonLabel>
            </IonSegmentButton>
          )}
        </IonSegment>

        <div className="ion-content-inner">
          {renderContent()}
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message="Funcionalidade em desenvolvimento. Em breve você poderá editar suas atividades!"
          duration={2000}
          position="bottom"
          color="warning"
        />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Activities;
