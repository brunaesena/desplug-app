import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonText,
    IonItem,
    IonImg,
    IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './forgot-password.css';

const ForgotPassword: React.FC = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowToast(true);
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div className="forgot-password-container">
                    <IonImg src="/logo.png" className="logo-img" />

                    <p className="subtitle">
                        Digite seu e-mail abaixo e enviaremos instruções para recuperar sua senha.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <IonItem className="input-field">
                            <IonInput
                                type="email"
                                value={email}
                                onIonChange={e => setEmail(e.detail.value!)}
                                required
                                clearInput={true}
                                placeholder="Digite seu e-mail"
                            />
                        </IonItem>

                        <IonButton
                            expand="block"
                            type="submit"
                            className="login-btn"
                        >
                            Enviar instruções
                        </IonButton>

                        <IonButton
                            expand="block"
                            fill="clear"
                            className="back-to-login-btn"
                            onClick={() => history.push('/login')}
                        >
                            Voltar para o login
                        </IonButton>
                    </form>
                </div>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message="Se o seu e-mail existir na nossa base de dados, enviamos um e-mail de recuperação para você"
                    duration={3000}
                    position="bottom"
                />
            </IonContent>
        </IonPage>
    );
};

export default ForgotPassword;