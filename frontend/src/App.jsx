import { useState } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/Login'
import NotFoundPage from './pages/NoFoundPage'
import Dashboard from './pages/Dashboard'
import ContactPage from './pages/Contact'
import AboutUsPage from './pages/About'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/about-us' element={<AboutUsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
