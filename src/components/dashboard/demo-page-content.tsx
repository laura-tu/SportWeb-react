import React from 'react'
import Box from '@/components/box'
import Typography from '@mui/material/Typography'
import useFetchUserById from '../../utils/api/useFetchUserById'
import LoadingSpinner from '../loading/loading-spinner'

interface DemoPageProps {
  userId: string
}

const DemoPageContent: React.FC<DemoPageProps> = ({ userId }) => {
  const { data: userData, isLoading, error } = useFetchUserById(userId)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        {String(error)}
      </Typography>
    )
  }

  return (
    <div className="m-5">
      <Box direction="row" className="p-2">
        <Typography
          sx={{ color: theme => (theme.palette.mode === 'dark' ? 'white' : 'black') }}
          className="font-bold  text-3xl!"
        >
          Vitaj, {userData?.name}
        </Typography>
      </Box>

      <Box direction="row" className="gap-2 m-2">
        <Box direction="col" className="border-2 h-[25rem] flex-2">
          1
        </Box>

        <Box direction="col" className="flex-1 h-[25rem] gap-2">
          <Box direction="col" className="border-2 flex-1 flex justify-center items-center">
            2
          </Box>

          <Box direction="col" className="border-2 flex-1  justify-center items-center">
            3
          </Box>
        </Box>
      </Box>

      <Box direction="row" className="gap-2 m-2">
        <Box direction="col" className="border-2 h-[23rem] flex-1">
          4
        </Box>
        <Box direction="col" className="border-2 h-[23rem] flex-1">
          5
        </Box>
      </Box>
    </div>
  )
}

export default DemoPageContent
