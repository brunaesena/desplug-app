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
  useIonRouter
} from '@ionic/react';
import { shareSocialOutline } from 'ionicons/icons';
import Footer from '../../components/Footer';
//import '../Home.css';

const challenges = [
  {
    title: '24h Offline',
    description: 'Passe um dia inteiro sem acessar redes sociais, apenas para atividades essenciais.'
  },
  {
    title: 'Não é permitido telefone nas refeições',
    description: 'Evite qualquer uso de dispositivos conectados durante as refeições.'
  },
  {
    title: 'Caminhada Sem Celular',
    description: 'Faça uma caminhada de pelo menos 30 minutos deixando o celular em casa.'
  },
  {
    title: 'Silêncio Digital',
    description: 'Ative o modo “não perturbe” por 2 horas seguidas e aproveite o momento presente.'
  }
];

const Challenges: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const router = useIonRouter();

  useEffect(() => {
    if (selectedChallenge) {
      setShowAlert(true);
    }
  }, [selectedChallenge]);

  const handleParticipar = (title: string) => {
    setSelectedChallenge(title);
  };

  const handleAlertDismiss = () => {
    setShowAlert(false);
    setTimeout(() => {
      router.push('/home', 'root');
    }, 300);
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="app-title">Desafios</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {challenges.map((challenge, index) => (
          <IonCard key={index} className="challenge-card">
            <IonCardHeader>
              <IonCardTitle>{challenge.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{challenge.description}</p>
              <div className="card-buttons">
                <IonButton expand="block" onClick={() => handleParticipar(challenge.title)}>
                  Participar
                </IonButton>
                <IonButton
                  fill="clear"
                  color="medium"
                  onClick={() => handleCompartilhar(challenge.title)}
                >
                  <IonIcon icon={shareSocialOutline} slot="icon-only" />
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        ))}

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={handleAlertDismiss}
          header="Inscrição realizada!"
          message={`Você se inscreveu no desafio: "${selectedChallenge || ''}"`}
          buttons={['OK']}
        />
      </IonContent>
      <Footer/>
    </IonPage>
  );
};

export default Challenges;
