import React, { useState } from 'react'
import axios from 'axios'
import ErrorModal from '../error-modal/index.tsx'
import SuccessModal from '../success-modal/index.tsx'
import { RiCloseLargeFill, RiEyeFill, RiEyeOffFill } from 'react-icons/ri'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import GreenCheckbox from '../green-checkbox/index.tsx'

const RegistrationForm: React.FC<{
  onClose: () => void
  onNext: (userId: string, user: any) => void
}> = ({ onClose, onNext }) => {
  const initialState = {
    name: '',
    role: 'user',
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
      const target = e.target as HTMLInputElement // Type assertion

      // Update the user state for checkbox
      setUser(prev => ({
        ...prev,
        [name]: target.checked,
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
      // Create a new object without `terms` and `passwordConf`
      const { passwordConf, terms, ...userData } = user
      const response = await axios.post('http://localhost:3000/api/users', userData)

      setUserId(response.data.userId)
      setFormSubmitted(true)
      setSuccessModalVisible(true)
    } catch (error) {
      console.error('Error registering user:', error)
      console.error(error.message)
      setErrorModalVisible(true)
    }
  }

  const handleNext = () => {
    onNext(userId, user)
  }

  return (
    <div className="registration-form fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="box-border bg-white p-6 rounded-lg shadow-lg border border-black max-w-lg w-full">
        <div className="headerX flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-black text-bold">Vytvoriť účet</h1>
          <button className="text-red-600 text-2xl" onClick={onClose}>
            <RiCloseLargeFill />
          </button>
        </div>

        <form onSubmit={registerUser}>
          <div className="form-row flex flex-wrap mb-4">
            <div className="form-col flex-1 mr-2 text-black">
              <FormLabel>Meno</FormLabel>
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
          </div>

          <div className="form-row mb-4 text-black">
            <FormLabel>E-mail</FormLabel>
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
            <FormLabel>Heslo</FormLabel>
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
            <FormLabel>Potvrdenie hesla</FormLabel>
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
            <FormLabel component="legend">Rola</FormLabel>
            <div className="flex space-x-4">
              <FormControlLabel
                control={
                  <Radio
                    checked={user.role === 'user'}
                    onChange={handleChange}
                    value="user"
                    name="role"
                    inputProps={{ 'aria-label': 'User' }}
                  />
                }
                label="Používateľ(Športovec)"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={user.role === 'coach'}
                    onChange={handleChange}
                    value="coach"
                    name="role"
                    inputProps={{ 'aria-label': 'Coach' }}
                  />
                }
                label="Tréner"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={user.role === 'admin'}
                    onChange={handleChange}
                    value="admin"
                    name="role"
                    inputProps={{ 'aria-label': 'Admin' }}
                  />
                }
                label="Admin(tester)"
              />
            </div>
          </div>

          <div className="form-row mb-4 text-black">
            <FormControlLabel
              control={<GreenCheckbox checked={user.terms} onChange={handleChange} name="terms" />}
              label="Súhlasím s podmienkami"
            />
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
                  !user.name || !user.email || !user.password || !user.passwordConf || !user.terms
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
