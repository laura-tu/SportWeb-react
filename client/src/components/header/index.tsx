import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import RegistrationForm from '../registration-form/index.tsx'
import LoginForm from '../login-form/index.tsx'

const Header = () => {
  const [scrollPosition, setScrollPosition] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [showRegis, setShowRegis] = useState(false)
  const [showLog, setShowLog] = useState(false)

  const toggleMobileNav = () => {
    setMobileNav(!mobileNav)
  }

  const showRegistration = () => {
    setShowRegis(true)
  }

  const showLogin = () => {
    setShowLog(true)
  }

  const closeRegistration = () => {
    setShowRegis(false)
  }

  const closeLogin = () => {
    setShowLog(false)
  }

  const handleNext = (userId: string, user: any) => {
    console.log('User registered:', userId, user)
    // Add your registration logic here
    closeRegistration() // Optionally close the registration after success
  }

  return (
    <header
      className={`bg-gray-900 text-white transition-all duration-300 ${scrollPosition ? 'shadow-lg' : ''}`}
    >
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/logo_black_50.jpg" alt="black logo" className="mr-3" />
          <h1 className="text-xl">Sport Web</h1>
        </div>
        <div className="flex items-center relative">
          {/* Authentication Buttons */}
          <div className="hidden md:flex">
            <button
              className="bg-transparent border border-azure text-azure py-1 px-3 mr-2 transition hover:bg-azure hover:text-green-300"
              onClick={showRegistration}
            >
              Registrácia
            </button>
            <button
              className="bg-transparent border border-azure text-azure py-1 px-3 transition hover:bg-azure hover:text-green-300"
              onClick={showLogin}
            >
              Prihlásenie
            </button>
          </div>

          {/* Mobile Nav Icon */}
          <div className="flex md:hidden cursor-pointer" onClick={toggleMobileNav}>
            <i
              className={`far fa-bars text-2xl transition-transform duration-300 ${mobileNav ? 'transform rotate-180' : ''}`}
            ></i>
          </div>

          {/* Mobile Navigation */}
          {mobileNav && (
            <ul className="absolute top-full right-0 bg-gray-800 text-azure p-4 rounded shadow-lg">
              <li className="mb-2">
                <Link className="block" to="/" onClick={() => setMobileNav(false)}>
                  Vitajte
                </Link>
              </li>
              <li className="mb-2">
                <Link className="block" to="/about" onClick={() => setMobileNav(false)}>
                  O nás
                </Link>
              </li>
              <li className="mb-2">
                <Link className="block" to="/tests" onClick={() => setMobileNav(false)}>
                  Testy
                </Link>
              </li>
              <li>
                <Link className="block" to="/contact" onClick={() => setMobileNav(false)}>
                  Kontakt
                </Link>
              </li>
            </ul>
          )}

          {/* Registration Form Popup */}
          {showRegis && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <RegistrationForm onClose={closeRegistration} onNext={handleNext} />
            </div>
          )}

          {/* Login Form Popup */}
          {showLog && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <LoginForm />
              {/*onClose={closeLogin}*/}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
