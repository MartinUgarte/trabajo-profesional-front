"use client";

import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Badge from '@mui/material/Badge/Badge';
import { createContext, useEffect, useState } from 'react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';


const DRAWER_WIDTH = 240;

const LINKS = [
    { text: 'Grupos', href: '/groups', icon: GroupsIcon },
    { text: 'Perfil', href: '/profile', icon: PersonIcon },
    { text: 'Invitaciones', href: '/invitations', icon: PersonAddAlt1Icon },
    { text: 'Notificaciones', href: '/notifications', icon: NotificationsIcon },
    { text: 'Gastos', href: '/expenses', icon: AttachMoneyIcon },
    { text: 'Deudas', href: '/debts', icon: CurrencyExchangeIcon }
];

const PLACEHOLDER_LINKS = [
    { text: 'Cerrar Sesión', href: '/login', icon: LogoutIcon },
];


export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body>
                <AppBar position="fixed" sx={{ zIndex: 2000 }}>
                    <Toolbar>
                        <Box
                            component="img"
                            sx={{
                                height: 40,
                                width: 40,
                                marginRight: 2
                            }}
                            alt="The house from the offer."
                            src="https://i.imgur.com/wE0iUm5.png"
                        />
                        <Typography variant="h6" noWrap component="div" color="white" sx={{ marginTop: 0.5 }}>
                            Propia
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                    }}
                >
                    {children}
                </Box>
            </body>
        </html>
    );
}
