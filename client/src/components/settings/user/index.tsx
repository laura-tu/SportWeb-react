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
    const { valid, errors: validationErrors } = validate(formData)

    if (!valid) {
      setErrors(validationErrors || {})
      return
    }

    // Handle password reset
    if (formData.changedPassword) {
      if (formData.changedPassword !== formData.changedPasswordConfirm) {
        console.log('Heslá sa nezhodujú')
        setErrorModalOpen(true)
        return
      }

      if (formData.changedPassword.length < 8) {
        console.log('Heslo musú mať minimálne 8 znakov')
        setErrorModalOpen(true)
        return
      }

      return
    }

    // Handle other updates
    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length === 0) {
      console.log('Žiadne zmeny')
      return
    }

    mutation.mutate({
      userId,
      updateData: modifiedData,
    })
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
        'Nepodarilo sa načítať údaje'
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        py: 4,
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        textAlign: 'left',
        width: '100%',
        marginLeft: 3,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Informácie o používateľovi
      </Typography>

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
      />

      <Box sx={{ mt: 2, borderTop: '1px solid #ccc', pt: 2, width: '100%' }}>
        <Typography variant="body2" color="textSecondary">
          Zmeniť heslo
        </Typography>
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
      </Box>

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSaveChanges}
        /*disabled={mutation.isPending}*/
        disabled
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
    </Box>
  )
}

export default SettingsUser
