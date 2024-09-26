"use client";

import {
    Box,
    TextField,
    Typography,
    IconButton,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type FormValues = {
    frequentedPlaces: string[];
};

export default function Filter() {
    const [frequentedPlaces, setFrequentedPlaces] = useState<string[]>([""]);
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

    const handlePlacesSubmit = (formData: FormValues) => {
        let jwtToken = localStorage.getItem('jwtToken')
        if (!jwtToken) {
            return 
        }
        // Actualiza el estado con los valores del formulario
        let property_type = localStorage.getItem("propertyType");
        let min_price = localStorage.getItem("minPrice");
        let max_price = localStorage.getItem("maxPrice");
        let currency = localStorage.getItem("currency");
        let min_rooms = localStorage.getItem("minRooms");
        let max_rooms = localStorage.getItem("maxPrice");
        let has_garage = localStorage.getItem("hasGarage");
        console.log('aa: ', frequentedPlaces)
        console.log('property type: ', property_type)
        console.log('min_price: ', min_price)
        console.log('max price: ', max_price)
        console.log('currency: ', currency)
        console.log('min rooms: ', min_rooms)
        console.log('max romos: ', max_rooms)
        console.log('has garage: ', has_garage)
        fetch(`http://localhost:8000/collaborative/recommend?user_id=${5}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
        })
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then((data) => {
                console.log("La data: ", data);
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
            height="100vh" // Ocupa toda la altura de la pantalla
            sx={{ bgcolor: 'white' }}
        >
            <Box width='100%' height='100%' display='flex' flexDirection='column' justifyContent='flex-end' alignItems='center' flex='0.3'>
                <Typography sx={{ fontFamily: 'Rubik', fontSize: '300%', color: '#083240' }} variant="h4" gutterBottom>
                    ¡Bienvenido!
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
                        maxHeight: '250px',  // Altura máxima del área con scroll
                        overflowY: 'auto',   // Scroll automático
                        padding: '20px',
                    }}
                >
                    {/* Mapeo de los lugares frecuentados */}
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
                <Box display="flex"
                    flexDirection="column"
                    width="15%"
                    flex="0.1">
                    <IconButton onClick={handleAddPlace} sx={{ color: '#083240', marginTop: 2 }}>
                        <AddIcon />
                        Añadir lugar
                    </IconButton>
                </Box>
                <Box display="flex" flex="0.3" width="100%" height="100%" justifyContent="space-between">
                    <IconButton
                        onClick={() => router.push('../filter')}
                        sx={{
                            ml: '5%',
                            mb: '1%',
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
                    <IconButton
                        type="submit"
                        sx={{
                            mr: '5%',
                            mb: '1%',
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
    );
}
