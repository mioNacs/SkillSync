import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import Home from './pages/Home'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import Mentorship from './pages/Mentorship'
import Explore from './pages/Explore'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="projects" element={<Projects />} />
          <Route path="mentorship" element={<Mentorship />} />
          <Route path="explore" element={<Explore />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
