import React, { useState } from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centra horizontalmente
    },
    text: {
        color: 'black', // Cambia el color del texto a negro
        textAlign: 'center', // Centra el texto
    },
    button: {
        marginTop: 2, // Espacio superior para el botón
    },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface RatingModalProps {
    open: boolean;
    onClose: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    propertyId: string;
}

const RatingModal = ({ open, onClose, loading, propertyId, setLoading }: RatingModalProps) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleStarClick = (value) => {
        setRating(value);
    };

    const handleSubmit = async () => {
        let jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }

        setLoading(true);

        await sleep(1000);

        const response = await fetch('http://localhost:8000/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`
            },
            body: JSON.stringify({
                user_id: 1,
                property_id: propertyId,
                rating: rating,
            }),
        });

        if (response.ok) {
            setSubmitted(true);
        } else {
            console.error('Error submitting rating:', response.statusText);
        }

        setLoading(false)
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={styles.modalBox}>
                {submitted ? (
                    <>
                        <Typography variant="h6" sx={styles.text}>
                            Tu calificación ha sido enviada.
                        </Typography>
                        <Button onClick={onClose} sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradiente azul
                                    borderRadius: '20px',  // Bordes redondeados
                                    padding: '5px 15px',  // Tamaño del botón más pequeño
                                    color: 'white',  // Texto blanco para contraste
                                    fontWeight: 'bold',  // Texto en negrita
                                    marginTop: '5%',
                                    fontSize: '1rem', // Tamaño de fuente más pequeño (puedes ajustar según prefieras)
                                    boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',  // Sombra suave
                                    transition: 'transform 0.2s, box-shadow 0.2s',  // Transiciones suaves para el hover
                                    '&:hover': {
                                        backgroundColor: '#1976D2',  // Color de fondo más oscuro al pasar el cursor
                                        boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',  // Sombra más intensa en hover
                                        transform: 'scale(1.05)',  // Efecto de agrandamiento
                                    },
                                }}>
                            Cerrar
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" sx={styles.text}>
                            Califica este inmueble:
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
                            {[1, 2, 3, 4, 5].map((value) => (
                                <IconButton key={value} onClick={() => handleStarClick(value)}>
                                    <StarIcon color={value <= rating ? 'primary' : 'disabled'} />
                                </IconButton>
                            ))}
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={rating === 0} // Disable if no rating selected
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradiente azul
                                borderRadius: '20px',  // Bordes redondeados
                                padding: '5px 15px',  // Tamaño del botón más pequeño
                                color: 'white',  // Texto blanco para contraste
                                fontWeight: 'bold',  // Texto en negrita
                                fontSize: '1rem', // Tamaño de fuente más pequeño (puedes ajustar según prefieras)
                                boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',  // Sombra suave
                                transition: 'transform 0.2s, box-shadow 0.2s',  // Transiciones suaves para el hover
                                '&:hover': {
                                    backgroundColor: '#1976D2',  // Color de fondo más oscuro al pasar el cursor
                                    boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',  // Sombra más intensa en hover
                                    transform: 'scale(1.05)',  // Efecto de agrandamiento
                                },
                            }}
                        >
                            Enviar
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default RatingModal;
