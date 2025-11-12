import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Members from './pages/Members';
import Events from './pages/Events';

// Internal Pages
import InternalLayout from './components/Internal/InternalLayout';
import InternalDashboard from './pages/Internal/Dashboard';
import InternalReports from './pages/Internal/Reports';
import InternalAvailability from './pages/Internal/Availability';
import InternalFinance from './pages/Internal/Finance';
import InternalGallery from './pages/Internal/Gallery';
import Login from './pages/Login';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <div className="App min-h-screen flex flex-col">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/about" element={
              <>
                <Navbar />
                <About />
                <Footer />
              </>
            } />
            <Route path="/gallery" element={
              <>
                <Navbar />
                <Gallery />
                <Footer />
              </>
            } />
            <Route path="/members" element={
              <>
                <Navbar />
                <Members />
                <Footer />
              </>
            } />
            <Route path="/events" element={
              <>
                <Navbar />
                <Events />
                <Footer />
              </>
            } />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Internal Routes */}
            <Route path="/internal" element={<InternalLayout />}>
              <Route index element={<InternalDashboard />} />
              <Route path="reports" element={<InternalReports />} />
              <Route path="availability" element={<InternalAvailability />} />
              <Route path="finance" element={<InternalFinance />} />
              <Route path="gallery" element={<InternalGallery />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

