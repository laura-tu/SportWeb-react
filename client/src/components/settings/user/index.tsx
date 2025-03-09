import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import SuccessModal from '../../success-modal/index'
import ErrorModal from '../../error-modal/index'
import { updateUserData } from '../../../services/user'
import useFetchUser from '../hooks/useFetchUser'
import { useFormValidation } from './hook'

interface UserFormData {
  name: string
  email: string
  changedPassword: string
  changedPasswordConfirm: string
}

const SettingsUser = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<UserFormData | null>(null)
  const { validate } = useFormValidation()

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    changedPassword: '',
    changedPasswordConfirm: '',
  })

  // Fetch user data
  const { user: userData, isFetchingUser, userError } = useFetchUser()

  // Load user data into formData
  useEffect(() => {
    if (userData) {
      //console.log('Fetched User Data:', userData)
      const initialData: UserFormData = {
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
      if (
        formData[key as keyof UserFormData] !== originalDataRef.current[key as keyof UserFormData]
      ) {
        modifiedData[key] = formData[key as keyof UserFormData]
      }
    }

    return modifiedData
  }

  const handleInputChange = (field: string, value: string) => {
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
    const { changedPassword, changedPasswordConfirm, ...otherFields } = formData

    // Validate only non-empty fields
    const { valid, errors: validationErrors } = validate(otherFields)

    if (!valid) {
      //console.log('Validation errors:', validationErrors)
      setErrors(validationErrors || {})
      return
    }

    // Skip password validation if user is not changing it
    if (changedPassword || changedPasswordConfirm) {
      if (changedPassword !== changedPasswordConfirm) {
        //console.log('Heslá sa nezhodujú')
        setErrors({ changedPasswordConfirm: 'Heslá sa nezhodujú' })
        setErrorModalOpen(true)
        return
      }

      if (changedPassword.length < 8) {
        //console.log('Heslo musí mať minimálne 8 znakov')
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
    <div className="flex flex-col  w-full ">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Používateľ
      </Typography>

      <div className="flex flex-col md:flex-row w-auto gap-3">
        <TextField
          label="Meno"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={e => handleInputChange('name', e.target.value)}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={e => handleInputChange('email', e.target.value)}
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }}
        />
      </div>

      <div className="flex flex-col w-full mt-2 border-t-2 border-gray-300 pt-2">
        <Typography variant="body2" color="textSecondary">
          Zmeniť heslo
        </Typography>
        <div className="flex flex-col md:flex-row w-full gap-4">
          <TextField
            label="Heslo"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            disabled
            value={formData.changedPassword}
            onChange={e => handleInputChange('changedPassword', e.target.value)}
          />
          <TextField
            label="Potvrdenie hesla"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            disabled
            value={formData.changedPasswordConfirm}
            onChange={e => handleInputChange('changedPasswordConfirm', e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width: 'fit-content' }}
        onClick={handleSaveChanges}
        // disabled={mutation.isPending}
        //disabled
      >
        {mutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
      </Button>
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
  )
}

export default SettingsUser
