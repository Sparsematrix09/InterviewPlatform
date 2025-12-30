import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton , useUser} from '@clerk/clerk-react'
import {Route, Routes, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage'
import { Toaster } from 'react-hot-toast'
import './index.css';

  function App() {
    const {isSignedIn,isLoaded} = useUser();
    if(!isLoaded) return null;
  return (
    <>
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/Dashboard"} />} />
      <Route path="/Dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
      <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
    </Routes>

    <Toaster/>
    </>
  )
}

export default App
