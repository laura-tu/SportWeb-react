import React from 'react'
import { Checkbox } from '@mui/material'
import { styled } from '@mui/material/styles'
import { green } from '@mui/material/colors'

interface GreenCheckboxProps extends React.ComponentProps<typeof Checkbox> {}

const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: green[400],
  '&.Mui-checked': {
    color: green[600],
  },
}))

const GreenCheckbox: React.FC<GreenCheckboxProps> = props => {
  return <StyledCheckbox color="default" {...props} />
}

export default GreenCheckbox
