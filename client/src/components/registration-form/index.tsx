import React, { useState } from 'react'
import axios from 'axios'
import ErrorModal from '../error-modal/index.tsx'
import SuccessModal from '../success-modal/index.tsx'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import GreenCheckbox from '../green-checkbox/index.tsx'
import CustomTextField from '../custom-textfield/index.tsx'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Button } from '@material-ui/core'

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
  //const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState('')
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
      alert('Heslá sa nezhodujú.') //todo: replace with warning component
      return
    }

    try {
      // Create a new object without `terms` and `passwordConf`
      const { passwordConf, terms, ...userData } = user
      const response = await axios.post('http://localhost:3000/api/users', userData)
      const userId = response.data.doc.id
      setUserId(userId)
      setFormSubmitted(true)
      //setSuccessModalVisible(true)

      onNext(userId, user)
    } catch (error) {
      console.error('Error registering user:', error)
      // Check if the error response has a specific error for the email field
      let errorMessage = 'Chyba pri registrácii používateľa.'
      if (
        error.response &&
        error.response.data.errors &&
        Array.isArray(error.response.data.errors)
      ) {
        const emailError = error.response.data.errors.find(
          err => err.name === 'ValidationError' && err.data.some(d => d.field === 'email'),
        )
        if (emailError) {
          // Custom message for email already registered
          errorMessage = emailError.data.find(d => d.field === 'email').message
        }
      }

      // Display the custom error message in the ErrorModal
      setErrorModalVisible(true)
      setErrorModalMessage(errorMessage) // Update the error modal message
    }
  }

  const handleNext = () => {
    onNext(userId, user)
  }

  return (
    <div className="registration-form fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="box-border bg-white p-6 rounded-lg shadow-lg border border-black max-w-lg w-full">
        <div className="headerX flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-black text-bold ">Vytvoriť účet</h1>
          <button className="text-red-600 text-2xl " onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={registerUser}>
          <div className="form-row my-4 text-black">
            <CustomTextField
              label="Meno"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
              maxLength={20}
              icon={<PersonAddAlt1OutlinedIcon />}
            />
          </div>

          <div className="form-row mb-8 text-black">
            <CustomTextField
              label="E-mail"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              icon={<AlternateEmailOutlinedIcon />}
            />
          </div>

          <div className="form-row mb-4 text-black relative">
            <CustomTextField
              label="Heslo"
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              minLength={8}
              icon={<KeyIcon />}
            />
            <button
              type="button"
              className="absolute right-2 top-6 text-gray-500"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </button>
          </div>

          <div className="form-row mb-8 text-black relative">
            <CustomTextField
              label="Potvrdenie hesla"
              type={passwordConfVisible ? 'text' : 'password'}
              name="passwordConf"
              value={user.passwordConf}
              onChange={handleChange}
              required
              minLength={8}
              icon={<KeyIcon />}
            />

            <button
              type="button"
              className="absolute right-2 top-6 text-gray-500"
              onClick={() => setPasswordConfVisible(!passwordConfVisible)}
            >
              {passwordConfVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </button>
          </div>

          {user.password !== user.passwordConf && (
            <div className="text-red-600 text-sm mb-4">Heslá sa nezhodujú.</div>
          )}

          <div className="form-row mb-8 text-black">
            <FormLabel component="legend" required>
              Rola
            </FormLabel>
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
              {/*<FormControlLabel
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
              />*/}
            </div>
          </div>

          {/**nechat? */}
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
              <Button
                variant="contained"
                type="button"
                onClick={handleNext}
                disabled={
                  !user.name || !user.email || !user.password || !user.passwordConf || !user.terms
                }
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                POKRAČOVAŤ
              </Button>
            )}
          </div>

          {/* Show error message when form is invalid */}
          {formSubmitted && !user.name && (
            <div className="text-red-600 text-sm mt-2">Prosím, vyplňte všetky povinné polia.</div>
          )}
        </form>

        {/*{successModalVisible && (
          <SuccessModal
            open={successModalVisible}
            onClose={() => setSuccessModalVisible(false)}
            text={"Používateľ zaregistrovaný. Prosím stlačte tlačidlo 'POKRAČOVAŤ'"}
          />
        )}*/}

        {errorModalVisible && (
          <ErrorModal
            onClose={() => setErrorModalVisible(false)}
            text={'registrovaní používateľa'}
            errorModalMessage={errorModalMessage}
            open={errorModalVisible}
          />
        )}
      </div>
    </div>
  )
}

export default RegistrationForm
