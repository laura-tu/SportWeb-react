import React, { useState, useRef, useEffect } from 'react'
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import SuccessModal from '@/components/success-modal'
import ErrorModal from '@/components/error-modal'
import useFetchUser from '../hooks/useFetchUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUserData } from '@/services/user'
import { useFormValidation } from '../user/hook'

interface FormData {
  name: string
  email: string
  changedPassword: string
  changedPasswordConfirm: string
}

const AccountSettings = ({ userId }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<FormData | null>(null)
  const { validate } = useFormValidation()

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    changedPassword: '',
    changedPasswordConfirm: '',
  })

  const { user: userData, isFetchingUser, userError } = useFetchUser()

  // Load user data into formData
  useEffect(() => {
    if (userData) {
      console.log('Fetched User Data:', userData)
      const initialData: FormData = {
        name: userData.name || '',
        email: userData.email || '',
        changedPassword: '',
        changedPasswordConfirm: '',
      }
      setFormData(initialData)
      originalDataRef.current = initialData
    }
  }, [userData])

  const mutation = useMutation({
    mutationKey: ['update_user_data'],
    mutationFn: ({ userId, updateData }: { userId: string; updateData: Record<string, any> }) =>
      updateUserData(userId, updateData),
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })

  const getModifiedData = () => {
    const modifiedData: Record<string, any> = {}

    if (!originalDataRef.current) {
      return modifiedData
    }

    for (const key in formData) {
      if (formData[key as keyof FormData] !== originalDataRef.current[key as keyof FormData]) {
        modifiedData[key] = formData[key as keyof FormData]
      }
    }

    console.log('Modified fields:', modifiedData)
    return modifiedData
  }

  const handleInputChange = (field: string, value: string) => {
    console.log(`Updating ${field} to`, value)
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  /* const resetPasswordMutation = useMutation({
    mutationKey: ['reset_password'],
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const res = await fetch(`http://localhost:3000/api/users/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        throw new Error('Failed to reset password')
      }

      return res.json()
    },
    onSuccess: () => {
      setSuccessModalOpen(true)
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
    onError: () => {
      setErrorModalOpen(true)
    },
  })*/

  const handleSaveChanges = () => {
    const { email, changedPassword, changedPasswordConfirm, ...otherFields } = formData

    // Validate only non-empty fields
    const { valid, errors: validationErrors } = validate({ email, ...otherFields })

    if (!valid) {
      console.log('Validation errors:', validationErrors)
      setErrors(validationErrors || {})
      return
    }

    // Skip password validation if user is not changing it
    if (changedPassword || changedPasswordConfirm) {
      if (changedPassword !== changedPasswordConfirm) {
        console.log('Heslá sa nezhodujú')
        setErrors({ changedPasswordConfirm: 'Heslá sa nezhodujú' })
        setErrorModalOpen(true)
        return
      }

      if (changedPassword.length < 8) {
        console.log('Heslo musí mať minimálne 8 znakov')
        setErrors({ changedPassword: 'Heslo musí mať minimálne 8 znakov' })
        setErrorModalOpen(true)
        return
      }
    }

    // Get modified fields
    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length === 0) {
      console.log('Žiadne zmeny')
      return
    }

    mutation.mutate(
      {
        userId,
        updateData: modifiedData,
      },
      {
        onSuccess: data => console.log('Update Success:', data),
        onError: error => console.error('Update Failed:', error),
      },
    )
  }

  if (isFetchingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (userError) {
    return (
      <Typography color="error" sx={{ mt: 3 }}>
        Nepodarilo sa načítať údaje
      </Typography>
    )
  }

  return (
    <div className="box-border w-[60vw]">
      <div className="flex flex-col w-full py-2 px-2 mx-3 md:py-4 md:px-4 md:mx-0 lg:py-8 lg:px-8 lg:mx-3">
        <Box
          className="flex flex-wrap"
          sx={{ width: { xs: '80%', sm: '60%', md: 'auto', lg: 700 } }}
        >
          <div className="flex flex-col  w-full ">
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Nastavenie účtu
              </Typography>
              <Box sx={{ mt: 2 }}>
                <div className="flex flex-col md:flex-row gap-4">
                  <TextField
                    label="Meno"
                    variant="outlined"
                    fullWidth
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    }}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="pt-6">
                  <Typography variant="body2" color="textSecondary">
                    Zmeniť heslo
                  </Typography>

                  <div className="flex flex-col md:flex-row gap-4 ">
                    <TextField
                      label="Hesloo"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      value={formData.changedPassword}
                      onChange={e => handleInputChange('changedPassword', e.target.value)}
                    />
                    <TextField
                      label="Potvrdenie heslaa"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      value={formData.changedPasswordConfirm}
                      onChange={e => handleInputChange('changedPasswordConfirm', e.target.value)}
                    />
                  </div>
                </div>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                sx={{ mt: 3 }}
              >
                {mutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
              </Button>
            </Box>

            <SuccessModal
              open={successModalOpen}
              onClose={() => setSuccessModalOpen(false)}
              text="Údaje boli úspešne aktualizované!"
            />

            <ErrorModal
              open={errorModalOpen}
              onClose={() => setErrorModalOpen(false)}
              text="aktualizácií údajov"
            />
          </div>
        </Box>
      </div>
    </div>
  )
}

export default AccountSettings
