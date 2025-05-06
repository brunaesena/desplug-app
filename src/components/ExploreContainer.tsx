import './ExploreContainer.css';
import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonSearchbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent
  
} from '@ionic/react';
import {
  homeOutline,
  searchOutline,
  chatbubbleEllipsesOutline,
  calendarOutline,
  personOutline,
  filterOutline
  
  
} from 'ionicons/icons';

import './ExploreContainer.css';

const categories = [
  { name: 'Cultura', color: '#2d4a2e' },
  { name: 'Educação', color: '#cc6657' },
  { name: 'Bem-estar', color: '#d8629e' },
  { name: 'Mindfulness', color: '#ec6ea1' },
  { name: 'Socialização', color: '#558ca6' },
  { name: 'Ar Livre', color: '#f3cb39' },
  { name: 'Cidadania', color: '#ce9442' },
  { name: 'Esportes', color: '#27423a' },
];

const ExploreContainer: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonTitle className="app-title">
        <img src="/logo.png" alt="Desplug logo" className="app-logo" />
        </IonTitle>

        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar placeholder="Busque por eventos" showClearButton="focus" />
        <div className="filter-buttons">
          <IonButton size="small">Eventos</IonButton>
          <IonButton size="small" fill="outline">Consultorias</IonButton>
          <IonButton size="small" fill="clear">
            <IonIcon icon={filterOutline} />
          </IonButton>
        </div>

        <IonGrid>
          <IonRow>
            {categories.map((cat, index) => (
              <IonCol size="6" key={index}>
                <IonCard style={{ backgroundColor: cat.color }} className="event-card">
                  <IonCardContent>
                    <h3>{cat.name}</h3>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>

      <IonFooter>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Início</IonLabel>
          </IonTabButton>
          <IonTabButton tab="buscar">
            <IonIcon icon={searchOutline} /> 
            <IonLabel>Buscar</IonLabel>
          </IonTabButton>
          <IonTabButton tab="eventos">
            <IonIcon icon={calendarOutline} />
            <IonLabel>Eventos</IonLabel>
          </IonTabButton>
          <IonTabButton tab="perfil">
            <IonIcon icon={personOutline} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>
  );
};

export default ExploreContainer;

