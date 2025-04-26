import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Box from '@/components//box'

interface HeaderProps {
  onShowRegistration: () => void
  onShowLogin: () => void
}

const Header: React.FC<HeaderProps> = ({ onShowRegistration, onShowLogin }) => {
  const [mobileNav, setMobileNav] = useState(false)

  const toggleMobileNav = () => {
    setMobileNav(!mobileNav)
  }

  return (
    <header className="bg-gray-900 text-white transition-all duration-300 shadow-lg">
      <nav className="flex justify-between items-center p-4">
        <Box direction="row" className="items-center">
          <img src="/logo_black_50.jpg" alt="black logo" className="mr-3" />
          <h1 className="text-xl">Sport Web</h1>
        </Box>
        <Box direction="row" className="items-center relative">
          {/* Authentication Buttons */}
          <div className="hidden md:flex">
            <button
              className="bg-transparent border border-azure text-azure py-1 px-3 mr-2 transition hover:bg-azure hover:text-green-300"
              onClick={onShowRegistration}
            >
              Registrácia
            </button>
            <button
              className="bg-transparent border border-azure text-azure py-1 px-3 transition hover:bg-azure hover:text-green-300"
              onClick={onShowLogin}
            >
              Prihlásenie
            </button>
          </div>

          {/* Mobile Nav Icon */}
          <Box direction="row" className=" md:hidden cursor-pointer" onClick={toggleMobileNav}>
            <i
              className={`far fa-bars text-2xl transition-transform duration-300 ${mobileNav ? 'transform rotate-180' : ''}`}
            ></i>
          </Box>

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
        </Box>
      </nav>
    </header>
  )
}

export default Header
