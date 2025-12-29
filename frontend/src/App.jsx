import './App.css'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/clerk-react'

  function App() {

  return (
    <>
      <h1>Welcome to Interveasy!</h1>
    <SignedOut>
      <SignInButton>
        <button className=''>Sign In</button>
      </SignInButton>
    </SignedOut>
    
    <SignedIn>
      <SignOutButton/>
    </SignedIn>

    <UserButton/>
    </>
  )
}

export default App
