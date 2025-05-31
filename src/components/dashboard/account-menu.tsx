import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout'

export function AccountMenu({ session, authentication }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const user = session?.user

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const avatarUrl = user?.avatar?.url
  const fallback = user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <Avatar src={avatarUrl} sx={{ width: 36, height: 36 }}>
          {!avatarUrl && fallback}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { sx: { px: 2, py: 1.5, minWidth: 220 } } }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
          <Avatar src={avatarUrl} sx={{ width: 48, height: 48 }}>
            {!avatarUrl && fallback}
          </Avatar>
          <Typography variant="subtitle1" fontWeight={500}>
            {user?.name}
          </Typography>
        </Stack>

        <Button
          variant="outlined"
          fullWidth
          size="small"
          startIcon={<LogoutIcon />}
          onClick={() => {
            handleClose()
            authentication.signOut()
          }}
        >
          Odhlásiť sa
        </Button>
      </Menu>
    </>
  )
}
