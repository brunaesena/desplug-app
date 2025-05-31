import React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonCard,
    IonCardContent,
} from '@ionic/react';
import { useHistory } from 'react-router-dom'
import DayInfo from './DayInfo';
import './ExploreContainer.css'; 

const ExploreContainer: React.FC = () => {
    const history = useHistory()

    const navigateTo = (path: string) => {
        history.push(path);
    };

    return (
        <IonPage>
            <IonContent>
                <div className="ion-content-inner">
                    <IonSearchbar
                        placeholder="Busque por eventos"
                        showClearButton="focus"
                    />

                    <h2 className="activities-title">Atividades disponíveis</h2>

                    <DayInfo />

                    <IonCard
                        className="activity-card challenges-card"
                        onClick={() => navigateTo("/desafios")}
                    >
                        <IonCardContent>
                            <h3 className="activity-name">Desafios</h3>
                        </IonCardContent>
                    </IonCard>

                    <IonCard
                        className="activity-card events-card"
                        onClick={() => navigateTo("/eventos")}
                    >
                        <IonCardContent>
                            <h3 className="activity-name">Eventos</h3>
                        </IonCardContent>
                    </IonCard>

                    <IonCard
                        className="activity-card consultancies-card"
                        onClick={() => navigateTo("/consultorias")}
                    >
                        <IonCardContent>
                            <h3 className="activity-name">Consultoria</h3>
                        </IonCardContent>
                    </IonCard>

                    <IonCard
                        className="activity-card lectures-card"
                        onClick={() => navigateTo("/palestras")}
                    >
                        <IonCardContent>
                            <h3 className="activity-name">Palestras</h3>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ExploreContainer;
