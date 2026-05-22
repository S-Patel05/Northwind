
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react'
import PageLoader from "./components/PageLoader";
import { useAuth } from '@clerk/react';
import Layout from './components/Layout';

function App() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <PageLoader />;
   return (
      <Layout>
      <header>
        <Show when="signed-out">
          <SignInButton mode='modal'/>
          <SignUpButton mode='modal'/>
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
          <h1 className="text-red-500 text-3xl font-bold underline">
    Hello world!
  </h1>
  <button className='btn btn-primary'>click me</button>
      </header>
  </Layout>
  )  
}

export default App
