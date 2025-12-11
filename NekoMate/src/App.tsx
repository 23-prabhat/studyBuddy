
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard'
import Tasktodo from './Pages/Tasktodo'
import LoginPage from './Pages/LoginPage'
import Analytics from './Pages/Analytics'
import Profile from './Pages/Profile'
import TimerPage from './Pages/TimerPage'
import ChatbotPage from './Pages/ChatbotPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  

  return (
    <>
       <BrowserRouter >
         <Routes>
          <Route path='/' element={<LoginPage />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/task' element={
            <ProtectedRoute>
              <Tasktodo />
            </ProtectedRoute>
          } />
          <Route path='/analytics' element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path='/timer' element={
            <ProtectedRoute>
              <TimerPage />
            </ProtectedRoute>
          } />
          <Route path='/chatbot' element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          } />
         </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
