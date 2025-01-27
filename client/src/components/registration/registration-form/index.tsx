import React, { useState } from 'react'
import ErrorModal from '../../error-modal/index'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import GreenCheckbox from '../../green-checkbox/index'
import CustomTextField from '../../custom-textfield/index'
import KeyIcon from '@mui/icons-material/Key'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import AlternateEmailOutlinedIcon from '@mui/icons-material/AlternateEmailOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
import { Button } from '@mui/material'
import { Box } from '@mui/material'
import { registerUser } from '../../../services/user'
import { UserRole } from '../../homeview/index'

const RegistrationForm: React.FC<{
  onClose: () => void
  onNext: (userId: string, user: any) => void
}> = ({ onClose, onNext }) => {
  const initialState = {
    name: '',
    role: UserRole.USER,
    email: '',
    password: '',
    passwordConf: '',
    terms: false,
  }

  const [user, setUser] = useState(initialState)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfVisible, setPasswordConfVisible] = useState(false)
  const [passwordError, setPasswordError] = useState('')

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

  const registerUserHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (user.password !== user.passwordConf) {
      setPasswordError('Heslá sa nezhodujú.') // Set password error if they don't match
      return
    }
    setPasswordError('')

    try {
      const { passwordConf, terms, role, ...userData } = user
      const formattedUserData = {
        ...userData,
        roles: [role],
      }

      const responseData = await registerUser(formattedUserData)
      const userId = responseData.doc.id
      setFormSubmitted(true)

      onNext(userId, user)
    } catch (error) {
      console.error('Chyba pri registrácii používateľa:', error)
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
          errorMessage = emailError.data.find(d => d.field === 'email').message
        }
      }

      setErrorModalVisible(true)
      setErrorModalMessage(errorMessage)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <Box className="bg-white p-6 rounded-lg shadow-lg border border-black max-w-lg w-full">
        <div className="headerX flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold text-black text-bold ">Vytvoriť účet</h1>
          <button className="text-red-600 text-2xl hover:cursor-pointer" onClick={onClose}>
            <CloseOutlinedIcon />
          </button>
        </div>

        <form onSubmit={registerUserHandler}>
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
              className="absolute right-3 top-4 text-gray-500"
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
              className="absolute right-3 top-4 text-gray-500"
              onClick={() => setPasswordConfVisible(!passwordConfVisible)}
            >
              {passwordConfVisible ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
            </button>
          </div>

          {passwordError && <div className="text-red-600 text-sm mb-4">{passwordError}</div>}

          <div className="form-row mb-8 text-black">
            <FormLabel component="legend" required>
              Rola
            </FormLabel>
            <div className="flex space-x-4">
              <FormControlLabel
                control={
                  <Radio
                    checked={user.role === UserRole.USER}
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
                    checked={user.role === UserRole.COACH}
                    onChange={handleChange}
                    value="sportCoach"
                    name="role"
                    inputProps={{ 'aria-label': 'Coach' }}
                  />
                }
                label="Tréner"
              />
              {/*<FormControlLabel
                control={
                  <Radio
                    checked={user.role === UserRole.ADMIN}
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
            <Button
              type="submit"
              variant="contained"
              color="success"
              fullWidth
              className=" text-white py-2 px-4 rounded hover:bg-green-600"
            >
              POTVRDIŤ
            </Button>
          </div>

          {formSubmitted && !user.name && (
            <div className="text-red-600 text-sm mt-2">Prosím, vyplňte všetky povinné polia.</div>
          )}
        </form>
      </Box>

      {errorModalVisible && (
        <ErrorModal
          onClose={() => setErrorModalVisible(false)}
          text={'registrovaní používateľa'}
          errorModalMessage={errorModalMessage}
          open={errorModalVisible}
        />
      )}
    </div>
  )
}

export default RegistrationForm
