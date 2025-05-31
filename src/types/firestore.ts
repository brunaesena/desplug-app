import { Timestamp } from 'firebase/firestore'

export interface User {
  uid: string
  name: string
  email: string
  phone: string
  type: 'admin' | 'user'
  createdAt: Timestamp
  // Campos específicos para prestadores de serviço
  profession?: string | null
  degree?: string | null
  graduationYear?: number | null
  isProvider: boolean
}

export interface Event {
  id: string
  creatorId: string // ID do usuário que criou
  title: string
  description: string
  date: Timestamp
  location: string
  isLocationFlexible: boolean // true se disponível para escolas
  createdAt: Timestamp
}

export interface Lecture {
  id: string
  creatorId: string
  title: string
  description: string
  date: Timestamp
  location: string
  isLocationFlexible: boolean
  createdAt: Timestamp
}

export interface Challenge {
  id: string
  creatorId: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  createdAt: Timestamp
}

export interface Appointment {
  id: string
  creatorId: string
  title: string
  description: string
  availableTimeSlots: {
    startTime: Timestamp
    endTime: Timestamp
  }[]
  createdAt: Timestamp
}

// Tabela intermediária para registrar presenças/inscrições
export interface Attendance {
  id: string
  userId: string // ID do usuário que se inscreveu
  creatorId: string // ID do usuário que criou o evento/palestra/etc
  itemType: 'event' | 'lecture' | 'challenge' | 'appointment'
  itemId: string // ID do evento/palestra/desafio/consultoria
  status: 'confirmed' | 'cancelled' | 'completed'
  createdAt: Timestamp
}

export interface Service {
  id: string
  providerId: string // ID do usuário provider
  title: string
  description: string
  price: number
  duration: number // duração em minutos
  category: string
  available: boolean
  createdAt: Timestamp
}

export interface Review {
  id: string
  appointmentId: string
  serviceId: string
  providerId: string
  clientId: string
  rating: number // 1-5
  comment: string
  createdAt: Timestamp
}

export interface DayInfo {
  id?: string;
  description: string;
  link: string;
  createdBy: string;
  createdAt: Date;
} 