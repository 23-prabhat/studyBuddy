
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard'
import Tasktodo from './Pages/Tasktodo'
import LoginPage from './Pages/LoginPage'
import Analytics from './Pages/Analytics'
import Profile from './Pages/Profile'
import TimerPage from './Pages/TimerPage'
import ChatbotPage from './Pages/ChatbotPage'

function App() {
  

  return (
    <>
       <BrowserRouter >
         <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/task' element={<Tasktodo />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/timer' element={<TimerPage />} />
          <Route path='/chatbot' element={<ChatbotPage />} />
         </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
