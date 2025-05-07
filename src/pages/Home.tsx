import React from 'react';
import { IonFooter, IonPage, IonContent } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import Footer from '../components/Footer';


const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen={false}>
        <ExploreContainer />
      </IonContent>
      <Footer />
    </IonPage>
  );
};

export default Home;