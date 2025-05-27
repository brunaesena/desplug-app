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
  setDoc
} from 'firebase/firestore'
import { db } from '../firebase'
import type { User, Event, Lecture, Challenge, Appointment, Attendance } from '../types/firestore'

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
  const q = query(
    collection(db, 'events'),
    orderBy('date', 'asc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Event)
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
  const q = query(
    collection(db, 'lectures'),
    orderBy('date', 'asc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Lecture)
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
  const q = query(
    collection(db, 'challenges'),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Challenge)
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
  const q = query(
    collection(db, 'appointments'),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Appointment)
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