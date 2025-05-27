import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { IonApp, setupIonicReact } from '@ionic/react'
import Home from './pages/Home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Profile from './pages/profile/profile'
import Challenges from './pages/home/challenges'
import Events from './pages/home/events'
import Appointments from './pages/home/appointments'
import Lectures from './pages/home/lectures'
import CreateEvent from './pages/create/CreateEvent'
import CreateLecture from './pages/create/CreateLecture'
import CreateChallenge from './pages/create/CreateChallenge'
import CreateConsultation from './pages/create/CreateConsultation'

import '@ionic/react/css/core.css'
import './theme/variables.css'
import './App.css'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/desafios" element={<Challenges />} />
        <Route path="/eventos" element={<Events />} />
        <Route path="/consultorias" element={<Appointments />} />
        <Route path="/palestras" element={<Lectures />} />
        <Route path="/criar/evento" element={<CreateEvent />} />
        <Route path="/criar/palestra" element={<CreateLecture />} />
        <Route path="/criar/desafio" element={<CreateChallenge />} />
        <Route path="/criar/consultoria" element={<CreateConsultation />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </IonApp>
)

export default App
