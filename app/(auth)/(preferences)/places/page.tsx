"use client";

import {
    Box,
    TextField,
    Typography,
    IconButton,
    Modal,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingModal from "../../LoadingModal";

type FormValues = {
    frequentedPlaces: string[];
};

// Función sleep para retrasar la ejecución por un tiempo especificado
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Filter() {
    const [frequentedPlaces, setFrequentedPlaces] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false); // Estado para el modal de carga
    const router = useRouter();

    const form = useForm<FormValues>({
        defaultValues: {
            frequentedPlaces: [""],
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Cambiamos esta función a async para poder usar await
    const handlePlacesSubmit = async (formData: FormValues) => {
        let jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }

        setLoading(true);

        await sleep(1000);

        fetch(`http://localhost:8000/collaborative/recommend?user_id=${5}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("recommendations", JSON.stringify(data));
                router.push('../recommendations');
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
            })
            .finally(() => {
                // Ocultar modal de carga
                setLoading(false);
            });
    };

    const handleAddPlace = () => {
        setFrequentedPlaces([...frequentedPlaces, ""]);
    };

    const handleRemovePlace = (index: number) => {
        const newPlaces = frequentedPlaces.filter((_, i) => i !== index);
        setFrequentedPlaces(newPlaces);
    };

    const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const newPlaces = frequentedPlaces.map((place, i) =>
            i === index ? e.target.value : place
        );
        setFrequentedPlaces(newPlaces);
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            sx={{ bgcolor: 'white' }}
        >
            <LoadingModal open={loading} />

            <Box width='100%' height='100%' display='flex' flexDirection='column' justifyContent='flex-end' alignItems='center' flex='0.3'>
                <Typography sx={{ fontFamily: 'Rubik', fontSize: '300%', color: '#083240' }} variant="h4" gutterBottom>
                    ¡Genial!
                </Typography>
                <Typography sx={{ fontFamily: 'Rubik', color: 'black', fontSize: '150%' }} variant="h4" gutterBottom>
                    ¿Qué lugares frecuentas?
                </Typography>
            </Box>

            <Box component="form" width='100%' height='100%' flexDirection='column' justifyContent='center' alignItems='center' display='flex' flex='0.7' onSubmit={handleSubmit(handlePlacesSubmit)}>
                <Box
                    display="flex"
                    flexDirection="column"
                    width="40%"
                    flex="0.6"
                    sx={{
                        maxHeight: '250px',
                        overflowY: 'auto',
                        padding: '20px',
                    }}
                >
                    {frequentedPlaces.map((place, index) => (
                        <Box key={index} display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
                            <TextField
                                fullWidth
                                label={`Lugar ${index + 1}`}
                                value={place}
                                onChange={(e) => handlePlaceChange(e, index)}
                                sx={{ marginRight: 2 }}
                            />
                            <IconButton onClick={() => handleRemovePlace(index)}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
                <Box display="flex" flexDirection="column" width="15%" height='100%' flex="0.1">
                    <IconButton onClick={handleAddPlace} sx={{ color: '#083240', marginTop: 2 }}>
                        <AddIcon />
                        Añadir lugar
                    </IconButton>
                </Box>
                <Box display="flex" flex="0.3" width="100%" height="100%" justifyContent="space-between" alignItems="flex-end" sx={{ paddingBottom: '1%' }}>
                    <Box sx={{ height: '50%', width: '10%' }}>
                        <IconButton
                            onClick={() => router.push('../filter')}
                            sx={{
                                ml: '5%',
                                color: '#083240',
                                padding: 0,
                                '& .MuiSvgIcon-root': {
                                    fontSize: 50,
                                    padding: '12px',
                                },
                            }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{ height: '50%', width: '10%' }}>
                        <IconButton
                            type="submit"
                            sx={{
                                mr: '5%',
                                color: '#083240',
                                padding: 0,
                                '& .MuiSvgIcon-root': {
                                    fontSize: 50,
                                    padding: '12px',
                                },
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
