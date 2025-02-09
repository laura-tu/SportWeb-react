import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useFetchUserById from '../../utils/api/useFetchUserById'
import LoadingOverlay from '../loading/loading-overlay'

interface DemoPageProps {
  userId: string
}

const DemoPageContent: React.FC<DemoPageProps> = ({ userId }) => {
  const { data: userData, isLoading, error } = useFetchUserById(userId)

  if (isLoading) {
    return <LoadingOverlay />
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {String(error)}
      </Typography>
    )
  }

  return (
    <Box className=" m-5">
      <Box className="flex flex-row p-2">
        <Typography
          sx={{ color: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
          className="font-bold  text-3xl!"
        >
          Vitaj, {userData?.name}
        </Typography>
      </Box>

      <Box className="flex flex-row gap-2 m-2">
        <Box
          sx={{ borderColor: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
          className="border-2  h-[25rem] flex-2"
        >
          1
        </Box>

        <Box className="flex-1 flex flex-col h-[25rem] gap-2">
          <Box
            sx={{ borderColor: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
            className="border-2 flex-1 flex justify-center items-center"
          >
            2
          </Box>

          <Box
            sx={{ borderColor: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
            className="border-2 flex-1 flex justify-center items-center"
          >
            3
          </Box>
        </Box>
      </Box>

      <Box className="flex flex-row gap-2 m-2">
        <Box
          sx={{ borderColor: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
          className="border-2 h-[23rem] flex-1"
        >
          4
        </Box>
        <Box
          sx={{ borderColor: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
          className="border-2  h-[23rem] flex-1"
        >
          5
        </Box>
      </Box>
    </Box>
  )
}

export default DemoPageContent
