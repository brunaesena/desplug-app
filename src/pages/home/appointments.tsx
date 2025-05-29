import React, { useEffect, useState } from 'react';
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
  IonButton,
  IonAlert,
  IonIcon,
  IonSpinner,
  IonBadge
} from '@ionic/react';
import { chevronBackOutline, timeOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { getAllAppointments, subscribeToActivity, isUserSubscribed } from '../../utils/firestore';
import { auth } from '../../firebase';
import type { Appointment } from '../../types/firestore';
import Footer from '../../components/Footer';
import './shared-styles.css'

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [subscribedAppointments, setSubscribedAppointments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsData = await getAllAppointments();
        setAppointments(appointmentsData);

        // Check subscription status for each appointment
        const userId = auth.currentUser?.uid;
        if (userId) {
          const subscriptionPromises = appointmentsData.map(appointment => 
            isUserSubscribed(userId, appointment.id)
          );
          const subscriptionResults = await Promise.all(subscriptionPromises);
          const subscribedIds = new Set(
            appointmentsData
              .filter((_, index) => subscriptionResults[index])
              .map(appointment => appointment.id)
          );
          setSubscribedAppointments(subscribedIds);
        }
      } catch (error) {
        console.error('Erro ao buscar consultorias:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleParticipar = async (appointment: Appointment) => {
    if (!auth.currentUser?.uid) {
      alert('Você precisa estar logado para agendar uma consultoria.');
      return;
    }

    try {
      await subscribeToActivity(auth.currentUser.uid, appointment.id, 'appointment');
      setSubscribedAppointments(prev => new Set([...prev, appointment.id]));
      setSelectedAppointment(appointment);
      setShowAlert(true);
    } catch (error) {
      console.error('Erro ao se inscrever na consultoria:', error);
      alert('Erro ao confirmar inscrição. Tente novamente.');
    }
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);
    setSelectedAppointment(null);
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
          <IonTitle>Consultorias</IonTitle>
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
              <p>Carregando consultorias...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="ion-text-center ion-padding">
              <p>Nenhuma consultoria disponível no momento.</p>
            </div>
          ) : (
            appointments.map((appointment) => (
              <IonCard key={appointment.id} className="appointment-card">
                <IonCardHeader>
                  <IonCardTitle>{appointment.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{appointment.description}</p>
                  <div className="time-slots">
                    <h4>
                      <IonIcon icon={timeOutline} /> Horários Disponíveis:
                    </h4>
                    {appointment.availableTimeSlots.map((slot, index) => (
                      <div key={index} className="time-slot-info">
                        <IonBadge color="primary">
                          {formatDateTime(slot.startTime)} - {formatDateTime(slot.endTime)}
                        </IonBadge>
                      </div>
                    ))}
                  </div>
                  {subscribedAppointments.has(appointment.id) ? (
                    <IonButton expand="block" color="success" disabled>
                      Inscrito
                    </IonButton>
                  ) : (
                    <IonButton expand="block" onClick={() => handleParticipar(appointment)}>
                      Inscrever-se
                    </IonButton>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertDismiss}
          header="Inscrição realizada!"
          message={selectedAppointment ? `Você se inscreveu na consultoria: "${selectedAppointment.title}"` : ''}
          buttons={['OK']}
        />
      </IonContent>

      <Footer />
    </IonPage>
  );
};

export default Appointments;