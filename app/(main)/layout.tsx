"use client";

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

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
                        <Box sx={{ flexGrow: 1 }} /> {}
                        <Link href="/login" passHref>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    transition: 'transform 0.3s ease', 
                                    '&:hover': {
                                        transform: 'scale(1.2)',
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