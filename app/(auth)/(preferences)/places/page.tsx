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

const iconButtonStyles = {
    bgcolor: '#005b96',
    color: 'white',
    padding: 0,
    borderRadius: '50%',
    transition: 'transform 0.3s ease-in-out', // Agregar transición
    '&:hover': {
        bgcolor: '#007bb5',
        transform: 'scale(1.2)', // Escalar al 120% en hover
    },
    '& .MuiSvgIcon-root': {
        fontSize: 50,
        padding: '12px',
    },
};

const addButtonStyles = {
    color: '#005b96',
    marginTop: 2,
    transition: 'transform 0.3s ease-in-out', // Agregar transición
    '&:hover': {
        transform: 'scale(1.1)', // Escalar al 120% en hover
    },
};

const deleteButtonStyles = {
    transition: 'transform 0.3s ease-in-out', // Transición para el efecto de agrandarse
    '&:hover': {
        transform: 'scale(1.1)', // Escalar al 120% en hover
    },
};

export default function Filter() {
    const [frequentedPlaces, setFrequentedPlaces] = useState<string[]>([""]);
    const [loading, setLoading] = useState(false); // Estado para el modal de carga
    const router = useRouter();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const handlePlacesSubmit = async () => {
        let jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }
        
        setLoading(true);

        await sleep(1000);

        fetch(`http://localhost:8000/hybrid/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },

            body: JSON.stringify({
                collab: {
                    user_id: 1
                },
                kbrs: {
                    //tipo_propiedad: localStorage.getItem("propertyType"),
                    // cochera: localStorage.getItem("hasGarage"),
                    // m2_min: localStorage.getItem("minArea"),
                    // m2_max: localStorage.getItem("maxArea"),
                    // m2: localStorage.getItem("area"),
                    ambientes_min: localStorage.getItem("minRooms"),
                    ambientes_max: localStorage.getItem("maxRooms"),
                    // precio_min: localStorage.getItem("minPrice"),
                    // precio_max: localStorage.getItem("maxPrice"),
                    // alquiler: localStorage.getItem("rental"),
                    // tipo_moneda: localStorage.getItem("currency"),
                    lugares_frecuentados: frequentedPlaces

                }
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("recommendations", JSON.stringify(data));
                localStorage.setItem("frequentedPlaces", JSON.stringify(frequentedPlaces));
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
            sx={{
                backgroundImage: 'linear-gradient(45deg, rgba(33, 150, 243, 0.6) 30%, rgba(33, 203, 243, 0.9) 90%), url(https://i.imgur.com/2bUXNNG.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}

        >
            <LoadingModal open={loading} />

            <Box width='100%' flexDirection='column' justifyContent='center' alignItems='center' height='100%' display='flex' flex='1' >

                <Box display='flex' flex='0.7' width='50%' height='100%' justifyContent='center' flexDirection='column' p={3} boxShadow={3} borderRadius={2} bgcolor="white" sx={{ mt: '5%' }}>
                    <Box flexDirection='column' display='flex' flex='0.2'>
                        <Typography sx={{ alignSelf: 'center', fontFamily: 'Rubik', fontSize: '2.5rem', color: 'black', fontWeight: 'bold' }} variant="h4" gutterBottom>
                            ¡Ya falta poco!
                        </Typography>
                        <Typography sx={{ alignSelf: 'center', fontFamily: 'Rubik', color: 'grey', fontSize: '1.5rem' }} variant="h4" gutterBottom>
                            ¿Qué lugares frecuentás?
                        </Typography>
                    </Box>
                    <Box display='flex' flex='0.7' flexDirection='column' alignItems='center' sx={{ maxHeight: '120px', overflowY: 'auto', paddingTop: '2%', '&::-webkit-scrollbar': {
        width: '8px', // Cambia el ancho de la barra de desplazamiento
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#005b96', // Cambia el color del pulgar de la barra de desplazamiento
        borderRadius: '10px', // Bordes redondeados para el pulgar
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Cambia el color del track
        borderRadius: '10px', // Bordes redondeados para el track
      }, }}>
                        {frequentedPlaces.map((place, index) => (
                            <Box key={index} display="flex" alignItems="center" sx={{ width: '90%', marginBottom: 2 }}>
                                <TextField
                                    fullWidth
                                    label={`Lugar ${index + 1}`}
                                    value={place}
                                    onChange={(e) => handlePlaceChange(e, index)}
                                    sx={{ marginRight: 2 }}
                                />
                                <IconButton sx={deleteButtonStyles} onClick={() => handleRemovePlace(index)}>
                                    <DeleteIcon sx={{ fontSize: '120%' }} color="grey" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Box width='10%' flexDirection='column' display='flex' flex='0.1' sx={{ alignSelf: 'center' }}>
                        <IconButton onClick={handleAddPlace} sx={addButtonStyles}>
                            <AddIcon sx={{ fontSize: '120%' }} />
                        </IconButton>
                    </Box>
                </Box>

                <Box display='flex' flex='0.3' width='100%' height='100%' justifyContent='flex-end'>
                    <Box justifyContent='flex-end' sx={{ position: 'absolute', bottom: '5%', right: '5%' }}>
                        <IconButton
                            sx={{ ...iconButtonStyles }}
                            onClick={() => handlePlacesSubmit()}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}
