import { Box, Button, Modal, Typography } from "@mui/material";

export default function ErrorModal({ open, onClose, text }) {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    p: 4,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#D32F2F' }}>
                    Error
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'black' }}>
                    {text}
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={onClose}
                    sx={{
                        mt: 2,
                        bgcolor: '#D32F2F',
                        '&:hover': { bgcolor: '#b71c1c' },
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                    }}
                >
                    OK
                </Button>
            </Box>
        </Modal>
    );
}
