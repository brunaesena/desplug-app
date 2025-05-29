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
  IonButtons,
  IonBackButton,
  IonBadge,
  IonSpinner
} from '@ionic/react';
import { shareSocialOutline, chevronBackOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { getAllChallenges, subscribeToActivity, isUserSubscribed } from '../../utils/firestore';
import { auth } from '../../firebase';
import type { Challenge } from '../../types/firestore';
import Footer from '../../components/Footer';
import './shared-styles.css'

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [subscribedChallenges, setSubscribedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const challengesData = await getAllChallenges();
        setChallenges(challengesData);

        // Check subscription status for each challenge
        const userId = auth.currentUser?.uid;
        if (userId) {
          const subscriptionPromises = challengesData.map(challenge => 
            isUserSubscribed(userId, challenge.id)
          );
          const subscriptionResults = await Promise.all(subscriptionPromises);
          const subscribedIds = new Set(
            challengesData
              .filter((_, index) => subscriptionResults[index])
              .map(challenge => challenge.id)
          );
          setSubscribedChallenges(subscribedIds);
        }
      } catch (error) {
        console.error('Erro ao buscar desafios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  useEffect(() => {
    if (selectedChallenge) {
      setShowAlert(true);
    }
  }, [selectedChallenge]);

  const handleParticipar = async (challenge: Challenge) => {
    if (!auth.currentUser?.uid) {
      alert('Você precisa estar logado para participar de desafios.');
      return;
    }

    try {
      await subscribeToActivity(auth.currentUser.uid, challenge.id, 'challenge');
      setSubscribedChallenges(prev => new Set([...prev, challenge.id]));
      setSelectedChallenge(challenge);
    } catch (error) {
      console.error('Erro ao se inscrever no desafio:', error);
      alert('Erro ao confirmar inscrição. Tente novamente.');
    }
  };

  const handleCompartilhar = (challengeTitle: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Desafio Desplug',
        text: `Participe comigo do desafio: "${challengeTitle}" no app Desplug!`,
        url: window.location.href
      }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
      alert(`Compartilhe este desafio: "${challengeTitle}"`);
    }
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Desafios</IonTitle>
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
              <p>Carregando desafios...</p>
            </div>
          ) : challenges.length === 0 ? (
            <div className="ion-text-center ion-padding">
              <p>Nenhum desafio disponível no momento.</p>
            </div>
          ) : (
            challenges.map((challenge) => (
              <IonCard key={challenge.id} className="challenge-card">
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
                  <div className="challenge-buttons">
                    {subscribedChallenges.has(challenge.id) ? (
                      <IonButton expand="block" color="success" disabled>
                        Inscrito
                      </IonButton>
                    ) : (
                      <IonButton expand="block" onClick={() => handleParticipar(challenge)}>
                        Inscrever-se
                      </IonButton>
                    )}
                    <IonButton
                      fill="clear"
                      onClick={() => handleCompartilhar(challenge.title)}
                    >
                      <IonIcon icon={shareSocialOutline} slot="icon-only" />
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Inscrição realizada!"
          message={selectedChallenge ? `Você se inscreveu no desafio: "${selectedChallenge.title}"` : ''}
          buttons={['OK']}
        />
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Challenges;
