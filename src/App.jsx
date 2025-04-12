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
import ExplorePage from './pages/ExplorePage'
import NotFound from './pages/NotFound'
import Notifications from './pages/Notifications'
import Login from './pages/Login'
import Signup from './pages/Signup'
// New pages
import OfferMentorship from './pages/OfferMentorship'
// Error Boundary
import ErrorBoundary from './components/ErrorBoundary'

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
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="mentorship" element={
              <ErrorBoundary>
                <Mentorship />
              </ErrorBoundary>
            } />
            <Route path="explore" element={<ExplorePage />} />
            <Route path="notifications" element={<Notifications />} />
            
            {/* New routes */}
            <Route path="offer-mentorship" element={<OfferMentorship />} />
            
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
