// components/LoadingModal.tsx
import React from "react";
import { Box, CircularProgress, Modal } from "@mui/material";

type LoadingModalProps = {
    open: boolean;
};

export default function LoadingModal({ open }: LoadingModalProps) {
    return (
        <Modal open={open}>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo gris semitransparente
                    position: 'relative', // Posición relativa para que el CircularProgress e imagen estén alineados
                }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        display: 'inline-flex', // Esto permite superponer el CircularProgress sobre la imagen
                    }}
                >
                    {/* Imagen que será rodeada */}
                    <Box
                        component="img"
                        src="https://i.imgur.com/wE0iUm5.png" // Aquí va tu imagen
                        alt="Loading Image"
                        sx={{
                            width: 100, // Puedes ajustar el tamaño de la imagen
                            height: 100,
                            borderRadius: '50%', // Si quieres que sea circular
                        }}
                    />
                    
                    {/* CircularProgress que rodea la imagen */}
                    <CircularProgress
                        size={120} // Asegúrate de que el size sea un poco más grande que la imagen para que la rodee
                        sx={{
                            position: 'absolute',
                            top: '-10px', // Ajusta la posición si es necesario
                            left: '-10px',
                            zIndex: 1, // Asegura que el CircularProgress esté sobre la imagen
                        }}
                    />
                </Box>
            </Box>
        </Modal>
    );
}
