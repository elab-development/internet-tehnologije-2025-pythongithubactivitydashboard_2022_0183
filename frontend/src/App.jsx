import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useAuthStore } from './store/auth.store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import RequireGuest from './components/RequireGuest';
import LoadingOverlay from './components/LoadingOverlay';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isLoading = useAuthStore((s) => s.isLoading);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <LoadingOverlay visible={isLoading} text='Loading GitDash…' />

      <div className='min-h-screen flex flex-col bg-gray-50'>
        <Navbar />

        <main className='flex-1'>
          <div className='max-w-7xl mx-auto px-4 py-6'>
            <Routes>
              <Route path='/' element={<Home />} />

              {/* samo GUEST */}
              <Route element={<RequireGuest />}>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Route>

              {/* samo AUTH */}
              <Route element={<RequireAuth />}>
                <Route path='/profile' element={<Profile />} />
              </Route>
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
