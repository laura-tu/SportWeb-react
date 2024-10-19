import './index.css'
import React from 'react'
import LoginRegistration from './components/login-form/index.tsx'
import LoginForm from './components/login-vue/index.tsx'
import Header from './components/header/index.tsx'

const App: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false)

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  return (
    <div>
      {/*<h1>Welcome to the App</h1>
      <button
        onClick={openLoginModal}
        className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Open Login
      </button>
      <LoginRegistration />
      {isLoginModalOpen && <LoginForm />}*/}
      <Header />
    </div>
  )
}

export default App
