import React from 'react';
import {
    IonContent,
    IonPage,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonIcon,
    IonRippleEffect,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
    trophyOutline,
    calendarOutline,
    peopleOutline,
    micOutline,
} from 'ionicons/icons';
import DayInfo from './DayInfo';
import './ExploreContainer.css';

const ExploreContainer: React.FC = () => {
    const history = useHistory();

    const navigateTo = (path: string) => {
        history.push(path);
    };

    return (
        <IonPage>
            <IonContent>
                <div className="ion-content-inner">
                    <div className="header-section">
                        <div className="greeting-container">
                            <h1>Bem-vindo ao Desplug</h1>
                            <p className="welcome-text">Onde a vida acontece fora da tela</p>
                        </div>
                    </div>

                    <div className="search-container">
                        <IonSearchbar
                            placeholder="O que você procura hoje?"
                            className="custom-searchbar"
                            showClearButton="focus"
                        />
                    </div>

                    <div className="featured-section">
                        <DayInfo />
                    </div>

                    <div className="categories-section">
                        <h2>Explore</h2>
                        <div className="category-grid">
                            <IonCard 
                                className="category-card desafios ion-activatable"
                                onClick={() => navigateTo("/desafios")}
                            >
                                <IonCardContent>
                                    <div className="category-content">
                                        <div className="icon-container">
                                            <IonIcon icon={trophyOutline} />
                                        </div>
                                        <span>Desafios</span>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>

                            <IonCard 
                                className="category-card eventos ion-activatable"
                                onClick={() => navigateTo("/eventos")}
                            >
                                <IonCardContent>
                                    <div className="category-content">
                                        <div className="icon-container">
                                            <IonIcon icon={calendarOutline} />
                                        </div>
                                        <span>Eventos</span>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>

                            <IonCard 
                                className="category-card consultoria ion-activatable"
                                onClick={() => navigateTo("/consultorias")}
                            >
                                <IonCardContent>
                                    <div className="category-content">
                                        <div className="icon-container">
                                            <IonIcon icon={peopleOutline} />
                                        </div>
                                        <span>Consultoria</span>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>

                            <IonCard 
                                className="category-card palestras ion-activatable"
                                onClick={() => navigateTo("/palestras")}
                            >
                                <IonCardContent>
                                    <div className="category-content">
                                        <div className="icon-container">
                                            <IonIcon icon={micOutline} />
                                        </div>
                                        <span>Palestras</span>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>

                    <div className="upcoming-section">
                        <h2>Próximos eventos</h2>
                        <div className="events-list">
                            <IonCard className="event-card ion-activatable">
                                <IonCardContent>
                                    <div className="event-date">
                                        <span className="day">15</span>
                                        <span className="month">Mai</span>
                                    </div>
                                    <div className="event-info">
                                        <h4>Workshop de Meditação</h4>
                                        <p>15:00 - 16:30</p>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>

                            <IonCard className="event-card ion-activatable">
                                <IonCardContent>
                                    <div className="event-date">
                                        <span className="day">22</span>
                                        <span className="month">Mai</span>
                                    </div>
                                    <div className="event-info">
                                        <h4>Palestra: Equilíbrio Emocional</h4>
                                        <p>19:00 - 20:30</p>
                                    </div>
                                    <IonRippleEffect />
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ExploreContainer;
