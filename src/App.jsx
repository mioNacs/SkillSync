import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'

// Layouts
import MainLayout from './layouts/MainLayout'

// Pages
import Home from './pages/Home'
import Profile from './pages/Profile'
import Projects from './pages/Projects'
import Mentorship from './pages/Mentorship'
import Explore from './pages/Explore'
import NotFound from './pages/NotFound'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Signup from './pages/Signup'
// New pages
import Jobs from './pages/Jobs'
import Talents from './pages/Talents' 
import OfferMentorship from './pages/OfferMentorship'
import ContactTalents from './pages/ContactTalents'
import ConnectTalents from './pages/ConnectTalents'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="mentorship" element={<Mentorship />} />
            <Route path="explore" element={<Explore />} />
            <Route path="notifications" element={<Notifications />} />
            
            {/* New routes */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="talents" element={<Talents />} />
            <Route path="offer-mentorship" element={<OfferMentorship />} />
            <Route path="contact-talents" element={<ContactTalents />} />
            <Route path="connect-talents" element={<ConnectTalents />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
