'use client';

import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Popover from '@mui/material/Popover';
import { Box as BoxMUI } from '@mui/material';

import WalletSlot from '@/components/Wallet/WalletSlot';
import VideoComponent from '../Home/VideoComponent/VideoComponent';

export default function AppMenu() {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = (e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget);
  const closeMenu = () => setMenuAnchorEl(null);

  const isOpen = Boolean(menuAnchorEl);
  const id = isOpen ? 'fc-menu-popover' : undefined;

  return (
    <Box sx={{ flexGrow: 1, zIndex: 1500 }}>
      <AppBar position="fixed" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton
            aria-describedby={id}
            aria-label="open menu"
            onClick={openMenu}
            edge="start"
            size="large"
            color="inherit"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }} />

          <WalletSlot />
        </Toolbar>
      </AppBar>

      <Popover
        id={id}
        open={isOpen}
        anchorEl={menuAnchorEl}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        sx={{ '& .MuiPaper-root': { bgcolor: 'rgba(0,0,0,0.85)', borderRadius: 2, p: 1 } }}
      >
        <BoxMUI sx={{ p: { xs: 1, sm: 1.5 } }} onClick={closeMenu}>
          <VideoComponent signatureCompleted={true} />
        </BoxMUI>
      </Popover>
    </Box>
  );
}