import React, { useState, useEffect, useRef } from 'react'
import { Box, Typography, Button, CircularProgress, TextField } from '@mui/material'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import SuccessModal from '../../success-modal/index.tsx'
import ErrorModal from '../../error-modal/index.tsx'
import { updateUserData } from '../../../services/user.ts'
import useFetchUser from '../hooks/useFetchUser.ts'

interface UserFormData {
  name: string
  email: string
}

const SettingsUser = ({ userId }: { userId: string }) => {
  const queryClient = useQueryClient()
  const originalDataRef = useRef<UserFormData | null>(null)

  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
  })

  // Fetch user data
  const { user: userData, isFetchingUser, userError } = useFetchUser()

  // Load user data into formData
  useEffect(() => {
    if (userData) {
      const initialData: UserFormData = {
        name: userData.name || '',
        email: userData.email || '',
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

  const handleSaveChanges = () => {
    if (!userData) return

    const modifiedData = getModifiedData()

    if (Object.keys(modifiedData).length === 0) {
      console.log('No changes to save.')
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

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={handleSaveChanges}
        disabled={mutation.isPending}
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
