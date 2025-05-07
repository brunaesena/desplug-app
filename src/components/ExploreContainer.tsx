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
import { useHistory } from 'react-router-dom';

import './ExploreContainer.css'; // Importe o CSS

const dailyInfo = {
    title: "Benefícios da Meditação Mindfulness",
    content: "Descubra como a prática regular de mindfulness pode reduzir o estresse e melhorar o foco.",
    link: "/artigo-mindfulness", // Rota para o artigo
};

const ExploreContainer: React.FC = () => {
    const history = useHistory();

    const navigateTo = (path: string) => {
        history.push(path);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle className="app-title">
                        {/* Use um caminho relativo para a imagem */}
                        <img src="/logo.png" alt="Desplug logo" className="app-logo" />
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <IonSearchbar
                    placeholder="Busque por eventos"
                    showClearButton="focus"
                />

                <h2 className="activities-title">Atividades disponíveis</h2>

                <IonCard
                    className="activity-card info-card"
                    onClick={() => navigateTo(dailyInfo.link)}
                >
                    <IonCardContent>
                        <h3 className="activity-name">{dailyInfo.title}</h3>
                        <p className="activity-details">
                            {dailyInfo.content}
                            <span className="learn-more">Saiba mais</span>
                        </p>
                    </IonCardContent>
                </IonCard>

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
            </IonContent>
        </IonPage>
    );
};

export default ExploreContainer;
