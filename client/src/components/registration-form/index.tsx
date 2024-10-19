import React, { useState } from 'react'
import axios from 'axios'
import ErrorModal from '../error-modal/index.tsx'
import SuccessModal from '../success-modal/index.tsx'
import { RiCloseLargeFill, RiEyeFill, RiEyeOffFill } from 'react-icons/ri'

const RegistrationForm: React.FC<{
  onClose: () => void
  onNext: (userId: string, user: any) => void
}> = ({ onClose, onNext }) => {
  const initialState = {
    name: '',
    surname: '',
    role: 'athlete',
    email: '',
    password: '',
    passwordConf: '',
    terms: false,
  }

  const [user, setUser] = useState(initialState)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [userId, setUserId] = useState('')
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfVisible, setPasswordConfVisible] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, type, value } = e.target

    // Check if the input is a checkbox
    if (type === 'checkbox') {
      // Type assertion to ensure e.target is HTMLInputElement
      setUser(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked, // Access 'checked' safely
      }))
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (user.password !== user.passwordConf) {
      alert('Heslá sa nezhodujú.')
      return
    }

    try {
      const response = await axios.post('http://localhost:4000/api/user/create', user)
      setUserId(response.data.userId)
      setFormSubmitted(true)
      setSuccessModalVisible(true)
    } catch (error) {
      console.error('Error registering user:', error)
      setErrorModalVisible(true)
    }
  }

  const handleNext = () => {
    onNext(userId, user)
  }

  return (
    <div className="registration-form fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="box-border bg-white p-6 rounded-lg shadow-lg border border-black max-w-md w-full">
        <div className="headerX flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-black text-bold">Vytvoriť účet</h1>
          <button className="text-red-600 text-2xl" onClick={onClose}>
            <RiCloseLargeFill />
          </button>
        </div>

        <form onSubmit={registerUser}>
          <div className="form-row flex flex-wrap mb-4">
            <div className="form-col flex-1 mr-2 text-black">
              <label className="block mb-1" htmlFor="name">
                Meno
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                required
                maxLength={20}
              />
            </div>
            <div className="form-col flex-1 text-black">
              <label className="block mb-1" htmlFor="surname">
                Priezvisko
              </label>
              <input
                className="w-full p-2 border border-gray-300 rounded-md"
                type="text"
                name="surname"
                value={user.surname}
                onChange={handleChange}
                required
                maxLength={20}
              />
            </div>
          </div>

          <div className="form-row mb-4 text-black">
            <label className="block mb-1" htmlFor="email">
              E-mail
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row mb-4 text-black relative">
            <label className="block mb-1" htmlFor="password">
              Heslo
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-2 top-10 text-black"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <RiEyeFill /> : <RiEyeOffFill />}
            </button>
          </div>

          <div className="form-row mb-4 text-black relative">
            <label className="block mb-1" htmlFor="passwordConf">
              Potvrdenie hesla
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md pr-10"
              type={passwordConfVisible ? 'text' : 'password'}
              name="passwordConf"
              value={user.passwordConf}
              onChange={handleChange}
              required
              minLength={8}
            />
            <button
              type="button"
              className="absolute right-2 top-10 text-black"
              onClick={() => setPasswordConfVisible(!passwordConfVisible)} 
            >
              {passwordConfVisible ? <RiEyeFill /> : <RiEyeOffFill />} 
            </button>
          </div>

          {/* Error message for mismatched passwords */}
          {user.password !== user.passwordConf && (
            <div className="text-red-600 text-sm mb-4">Heslá sa nezhodujú.</div>
          )}

          <div className="form-row mb-4 text-black">
            <label className="block mb-1">Role</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="athlete"
                  checked={user.role === 'athlete'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Športovec</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="coach"
                  checked={user.role === 'coach'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Tréner</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="tester"
                  checked={user.role === 'tester'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Tester</span>
              </label>
            </div>
          </div>

          <div className="form-row mb-4 text-black">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="terms"
                checked={user.terms}
                onChange={handleChange}
                required
                className="form-checkbox"
              />
              <span className="ml-2">Súhlasím s podmienkami</span>
            </label>
          </div>

          <div className="flex justify-between mt-4 ">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              POTVRDIŤ
            </button>

            {formSubmitted && (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  !user.name ||
                  !user.surname ||
                  !user.email ||
                  !user.password ||
                  !user.passwordConf ||
                  !user.terms
                }
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                POKRAČOVAŤ
              </button>
            )}
          </div>

          {/* Show error message when form is invalid */}
          {formSubmitted && !user.name && (
            <div className="text-red-600 text-sm mt-2">Prosím, vyplňte všetky povinné polia.</div>
          )}
        </form>

        {successModalVisible && (
          <SuccessModal
            onClose={() => setSuccessModalVisible(false)}
            text={"Používateľ zaregistrovaný. Prosím stlačte tlačidlo 'POKRAČOVAŤ'"}
          />
        )}

        {errorModalVisible && (
          <ErrorModal
            onClose={() => setErrorModalVisible(false)}
            text={'registrovaní používateľa'}
          />
        )}
      </div>
    </div>
  )
}

export default RegistrationForm
