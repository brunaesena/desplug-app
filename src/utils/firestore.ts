import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  setDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore'
import { db } from '../firebase'
import type { User, Event, Lecture, Challenge, Appointment, Attendance, DayInfo } from '../types/firestore'

// User Functions
export const createUser = async (uid: string, userData: Omit<User, 'uid' | 'createdAt'>) => {
  await setDoc(doc(db, 'users', uid), {
    ...userData,
    uid,
    createdAt: serverTimestamp()
  })
}

export const getUser = async (uid: string) => {
  const docRef = doc(db, 'users', uid)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as User : null
}

// Event Functions
export const createEvent = async (eventData: Omit<Event, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'events'), {
    ...eventData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getEvent = async (eventId: string) => {
  const docRef = doc(db, 'events', eventId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as Event : null
}

export const getAllEvents = async () => {
  const eventsRef = collection(db, 'events')
  const snapshot = await getDocs(eventsRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event))
}

// Lecture Functions
export const createLecture = async (lectureData: Omit<Lecture, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'lectures'), {
    ...lectureData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getLecture = async (lectureId: string) => {
  const docRef = doc(db, 'lectures', lectureId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as Lecture : null
}

export const getAllLectures = async () => {
  const lecturesRef = collection(db, 'lectures')
  const snapshot = await getDocs(lecturesRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture))
}

// Challenge Functions
export const createChallenge = async (challengeData: Omit<Challenge, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'challenges'), {
    ...challengeData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getChallenge = async (challengeId: string) => {
  const docRef = doc(db, 'challenges', challengeId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as Challenge : null
}

export const getAllChallenges = async () => {
  const challengesRef = collection(db, 'challenges')
  const snapshot = await getDocs(challengesRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge))
}

// Appointment Functions
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(db, 'appointments'), {
    ...appointmentData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getAppointment = async (appointmentId: string) => {
  const docRef = doc(db, 'appointments', appointmentId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as Appointment : null
}

export const getAllAppointments = async () => {
  const appointmentsRef = collection(db, 'appointments')
  const snapshot = await getDocs(appointmentsRef)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment))
}

// Attendance Functions
export const createAttendance = async (attendanceData: Omit<Attendance, 'id' | 'createdAt' | 'status'>) => {
  const docRef = await addDoc(collection(db, 'attendance'), {
    ...attendanceData,
    status: 'confirmed',
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getAttendance = async (attendanceId: string) => {
  const docRef = doc(db, 'attendance', attendanceId)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() as Attendance : null
}

export const getUserAttendances = async (userId: string) => {
  const q = query(
    collection(db, 'attendance'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Attendance)
}

export const getItemAttendances = async (itemType: Attendance['itemType'], itemId: string) => {
  const q = query(
    collection(db, 'attendance'),
    where('itemType', '==', itemType),
    where('itemId', '==', itemId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Attendance)
}

export const updateAttendanceStatus = async (attendanceId: string, status: Attendance['status']) => {
  const docRef = doc(db, 'attendance', attendanceId)
  await updateDoc(docRef, { status })
}

// New functions for user subscriptions
export const subscribeToActivity = async (
  userId: string,
  activityId: string,
  activityType: 'event' | 'lecture' | 'challenge' | 'appointment',
  additionalData?: any
) => {
  const userActivitiesRef = collection(db, 'userActivities')
  const subscriptionData = {
    userId,
    activityId,
    activityType,
    subscribedAt: new Date(),
    ...additionalData
  }

  await addDoc(userActivitiesRef, subscriptionData)

  // Update the activity document to include the user
  const activityRef = doc(db, `${activityType}s`, activityId)
  await updateDoc(activityRef, {
    subscribers: arrayUnion(userId)
  })
}

export const unsubscribeFromActivity = async (
  userId: string,
  activityId: string,
  activityType: 'event' | 'lecture' | 'challenge' | 'appointment'
) => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityId', '==', activityId)
  )
  
  const snapshot = await getDocs(q)
  snapshot.docs.forEach(async (doc) => {
    await deleteDoc(doc.ref)
  })

  // Remove user from activity's subscribers
  const activityRef = doc(db, `${activityType}s`, activityId)
  await updateDoc(activityRef, {
    subscribers: arrayRemove(userId)
  })
}

export const isUserSubscribed = async (
  userId: string,
  activityId: string
): Promise<boolean> => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityId', '==', activityId)
  )
  
  const snapshot = await getDocs(q)
  return !snapshot.empty
}

export const getUserSubscribedEvents = async (userId: string): Promise<Event[]> => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityType', '==', 'event')
  )
  
  const snapshot = await getDocs(q)
  const eventIds = snapshot.docs.map(doc => doc.data().activityId)
  
  const events: Event[] = []
  for (const eventId of eventIds) {
    const eventDoc = await getDoc(doc(db, 'events', eventId))
    if (eventDoc.exists()) {
      events.push({ id: eventDoc.id, ...eventDoc.data() } as Event)
    }
  }
  
  return events
}

export const getUserSubscribedLectures = async (userId: string): Promise<Lecture[]> => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityType', '==', 'lecture')
  )
  
  const snapshot = await getDocs(q)
  const lectureIds = snapshot.docs.map(doc => doc.data().activityId)
  
  const lectures: Lecture[] = []
  for (const lectureId of lectureIds) {
    const lectureDoc = await getDoc(doc(db, 'lectures', lectureId))
    if (lectureDoc.exists()) {
      lectures.push({ id: lectureDoc.id, ...lectureDoc.data() } as Lecture)
    }
  }
  
  return lectures
}

export const getUserSubscribedChallenges = async (userId: string): Promise<Challenge[]> => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityType', '==', 'challenge')
  )
  
  const snapshot = await getDocs(q)
  const challengeIds = snapshot.docs.map(doc => doc.data().activityId)
  
  const challenges: Challenge[] = []
  for (const challengeId of challengeIds) {
    const challengeDoc = await getDoc(doc(db, 'challenges', challengeId))
    if (challengeDoc.exists()) {
      challenges.push({ id: challengeDoc.id, ...challengeDoc.data() } as Challenge)
    }
  }
  
  return challenges
}

export const getUserSubscribedAppointments = async (userId: string): Promise<Appointment[]> => {
  const userActivitiesRef = collection(db, 'userActivities')
  const q = query(
    userActivitiesRef,
    where('userId', '==', userId),
    where('activityType', '==', 'appointment')
  )
  
  const snapshot = await getDocs(q)
  const appointmentIds = snapshot.docs.map(doc => doc.data().activityId)
  
  const appointments: Appointment[] = []
  for (const appointmentId of appointmentIds) {
    const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId))
    if (appointmentDoc.exists()) {
      appointments.push({ id: appointmentDoc.id, ...appointmentDoc.data() } as Appointment)
    }
  }
  
  return appointments
}

export const getCreatedActivities = async (userId: string) => {
  try {
    const [events, lectures, challenges, appointments] = await Promise.all([
      getDocs(query(collection(db, 'events'), where('creatorId', '==', userId))),
      getDocs(query(collection(db, 'lectures'), where('creatorId', '==', userId))),
      getDocs(query(collection(db, 'challenges'), where('creatorId', '==', userId))),
      getDocs(query(collection(db, 'appointments'), where('creatorId', '==', userId)))
    ]);

    return {
      events: events.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)),
      lectures: lectures.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lecture)),
      challenges: challenges.docs.map(doc => ({ id: doc.id, ...doc.data() } as Challenge)),
      appointments: appointments.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment))
    };
  } catch (error) {
    console.error('Erro ao buscar atividades criadas:', error);
    return {
      events: [],
      lectures: [],
      challenges: [],
      appointments: []
    };
  }
};

export const createDayInfo = async (dayInfo: Omit<DayInfo, 'id'>) => {
  const dayInfoRef = collection(db, 'dayInfo');
  const docRef = await addDoc(dayInfoRef, {
    ...dayInfo,
    createdAt: Timestamp.fromDate(dayInfo.createdAt)
  });
  return docRef.id;
};

export const getRandomDayInfo = async (): Promise<DayInfo | null> => {
  const dayInfoRef = collection(db, 'dayInfo');
  const q = query(dayInfoRef);
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }

  const dayInfos = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate()
  })) as DayInfo[];

  // Get a random day info
  const randomIndex = Math.floor(Math.random() * dayInfos.length);
  return dayInfos[randomIndex];
}; 