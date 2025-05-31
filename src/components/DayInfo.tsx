import React, { useState, useEffect } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSpinner } from '@ionic/react';
import { getRandomDayInfo } from '../utils/firestore';
import type { DayInfo } from '../types/firestore';
import './DayInfo.css';

const DayInfo: React.FC = () => {
  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDayInfo = async () => {
      try {
        const info = await getRandomDayInfo();
        setDayInfo(info);
      } catch (error) {
        console.error('Erro ao buscar informação do dia:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDayInfo();
  }, []);

  if (loading) {
    return (
      <div className="day-info-loading">
        <IonSpinner />
      </div>
    );
  }

  if (!dayInfo) {
    return null;
  }

  return (
    <IonCard className="day-info-card">
      <IonCardHeader>
        <IonCardTitle>Informação do dia:</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p className="day-info-description">{dayInfo.description}</p>
        <a href={dayInfo.link} target="_blank" rel="noopener noreferrer" className="day-info-link">
          Saiba mais
        </a>
      </IonCardContent>
    </IonCard>
  );
};

export default DayInfo;
