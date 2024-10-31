"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Badge from '@mui/material/Badge/Badge';
import { createContext, useEffect, useState } from 'react';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Link from 'next/link';

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
                <AppBar position="fixed" sx={{
                    zIndex: 2000,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' // Gradiente azul
                }}>
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
                        <Box sx={{ flexGrow: 1 }} /> {/* Espacio flexible para empujar el icono a la derecha */}
                        <Link href="/login" passHref>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'transform 0.3s ease', // Transición suave
                                    '&:hover': {
                                        transform: 'scale(1.2)', // Aumenta el tamaño al 120%
                                    },
                                }}
                            >
                                <LogoutIcon sx={{ color: 'white', fontSize: 30 }} />
                            </Box>
                        </Link>
                    </Toolbar>
                </AppBar>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        paddingTop: '64px'
                    }}
                >
                    {children}
                </Box>
            </body>
        </html>
    );
}