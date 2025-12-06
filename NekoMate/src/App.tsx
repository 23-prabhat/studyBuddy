
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Dashboard from './Pages/Dashboard'
import Tasktodo from './Pages/Tasktodo'

function App() {
  

  return (
    <>
     {/* <h1 className='text-3xl text-orange-400 text-center'>Hello Mate</h1> */}
       {/* <Dashboard /> */}
       <BrowserRouter >
         <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path = '/task' element ={<Tasktodo />} />
         </Routes>
       </BrowserRouter>
    </>
  )
}

export default App
