import React from 'react'
import { createTheme, useColorScheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Tooltip from '@mui/material/Tooltip'
import SettingsIcon from '@mui/icons-material/Settings'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

export const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#ffffff', //vnutorne okno
          paper: '#f5f5f5', //menu
        },
        text: {
          primary: '#000000', // Default text color
          secondary: '#555555', // Less prominent text
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#131614', //black,vnutorne okno
          paper: '#1D201E', //menu
        },
        text: {
          primary: '#fffffe',
          secondary: '#ffffff', // white
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
})

export function CustomThemeSwitcher() {
  const { setMode } = useColorScheme()

  const handleThemeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMode(event.target.value as 'light' | 'dark' | 'system')
    },
    [setMode],
  )

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(null)

  const toggleMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMenuAnchorEl(isMenuOpen ? null : event.currentTarget)
      setIsMenuOpen(previousIsMenuOpen => !previousIsMenuOpen)
    },
    [isMenuOpen],
  )

  return (
    <React.Fragment>
      <Tooltip title="Settings" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="settings" onClick={toggleMenu}>
            <SettingsIcon />
          </IconButton>
        </div>
      </Tooltip>
      <Popover
        open={isMenuOpen}
        anchorEl={menuAnchorEl}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        disableAutoFocus
      >
        <Box sx={{ p: 2 }}>
          <FormControl>
            <FormLabel id="custom-theme-switcher-label">Theme</FormLabel>
            <RadioGroup
              aria-labelledby="custom-theme-switcher-label"
              defaultValue="system"
              name="custom-theme-switcher"
              onChange={handleThemeChange}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="system" control={<Radio />} label="System" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Popover>
    </React.Fragment>
  )
}
