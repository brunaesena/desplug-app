import { Switch, Route, Redirect } from 'react-router-dom'
import { IonApp, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import Home from './pages/Home'
import Login from './pages/auth/login'
import Register from './pages/auth/register'
import Profile from './pages/profile/profile'
import Challenges from './pages/home/challenges'
import Events from './pages/home/events'
import Appointments from './pages/home/appointments'
import Lectures from './pages/home/lectures'
import Activities from './pages/activity/activities'
import CreateEvent from './pages/admin/create/event/CreateEvent'
import CreateLecture from './pages/admin/create/lecture/CreateLecture'
import CreateChallenge from './pages/admin/create/challenge/CreateChallenge'
import CreateAppointment from './pages/admin/create/appointment/CreateAppointment'
import CreateDayInfo from './pages/admin/create/day-info/createDayInfo'
import Create from './pages/admin/create/create'

import '@ionic/react/css/core.css'
import './theme/variables.css'
import './App.css'

setupIonicReact()

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <Switch>
        {/* Rotas de autenticação */}
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        
        {/* Rotas principais */}
        <Route path="/home" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/desafios" component={Challenges} />
        <Route path="/eventos" component={Events} />
        <Route path="/consultorias" component={Appointments} />
        <Route path="/palestras" component={Lectures} />
        <Route path="/atividades" component={Activities} />
        
        {/* Rotas administrativas */}
        <Route path="/admin/criar" exact component={Create} />
        <Route path="/admin/criar/evento" component={CreateEvent} />
        <Route path="/admin/criar/palestra" component={CreateLecture} />
        <Route path="/admin/criar/desafio" component={CreateChallenge} />
        <Route path="/admin/criar/consulta" component={CreateAppointment} />
        <Route path="/admin/criar/informacao-dia" component={CreateDayInfo} />
        
        {/* Rota padrão */}
        <Route exact path="/" render={() => <Redirect to="/login" />} />
      </Switch>
    </IonReactRouter>
  </IonApp>
)

export default App
