import React from 'react'
import { Checkbox } from '@mui/material'
import { withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'

interface GreenCheckboxProps extends React.ComponentProps<typeof Checkbox> {}

const StyledCheckbox = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: GreenCheckboxProps) => <Checkbox color="default" {...props} />)

const GreenCheckbox: React.FC<GreenCheckboxProps> = props => {
  return <StyledCheckbox {...props} />
}

export default GreenCheckbox
