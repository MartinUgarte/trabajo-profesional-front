"use client";

import {
    property_types,
    currencies,
    Preferences
} from "../../../types";
import {
    Box,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    MenuItem,
    Modal,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoadingModal from "../../LoadingModal";

// Estilos comunes para los botones de las flechas
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


type FormValues = {
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    minRooms: number;
    maxRooms: number;
    hasGarage: boolean;
    rental: boolean;
    minM2: number;
    maxM2: number;
};

export default function Filter() {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        defaultValues: {
            propertyType: "",
            minPrice: 0,
            maxPrice: 0,
            currency: "",
            minRooms: 0,
            maxRooms: 0,
            minM2: 0,
            maxM2: 0,
            hasGarage: false,
            rental: true,
        },
    });

    const { register, handleSubmit, formState, reset } = form;
    const { errors } = formState;

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleFilterSubmit = async (formData: FormValues) => {
        const preferences: Preferences = {};

        if (formData.propertyType) preferences.tipo_propiedad = formData.propertyType.toString().toLowerCase();
        if (formData.minPrice) preferences.precio_min = formData.minPrice;
        if (formData.maxPrice) preferences.precio_max = formData.maxPrice;
        if (formData.currency) preferences.tipo_moneda = formData.currency;
        if (formData.minRooms) preferences.ambientes_min = formData.minRooms;
        if (formData.maxRooms) preferences.ambientes_max = formData.maxRooms;
        if (formData.hasGarage) preferences.cochera = formData.hasGarage;
        if (formData.rental) preferences.alquiler = formData.rental;
        if (formData.minM2) preferences.m2_min = formData.minM2;
        if (formData.maxM2) preferences.m2_max = formData.maxM2;

        localStorage.setItem("preferences", JSON.stringify(preferences));

        setLoading(true);

        await sleep(1000);

        router.push('../places');
        setLoading(false);
    };

    const handleInput = (e) => {
        const value = e.target.value;
        e.target.value = value.replace(/[^0-9]/g, '');
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

            <Box width='100%' flexDirection='column' justifyContent='center' alignItems='center' height='100%' display='flex' flex='1' component="form" onSubmit={handleSubmit(handleFilterSubmit)}>

                <Box display='flex' flex='0.7' width='50%' height='100%' justifyContent='center' flexDirection='column' p={3} boxShadow={3} borderRadius={5} bgcolor="white" sx={{ mt: '5%' }}>
                    <Box flexDirection='column' display='flex' flex='0.2' sx={{ justifyContent: 'flex-end', mt: '10%' }}>
                        <Typography sx={{ alignSelf: 'center', fontFamily: 'Rubik', fontSize: '2.5rem', color: 'black', fontWeight: 'bold' }} variant="h4" gutterBottom>
                            Bienvenido
                        </Typography>
                        <Typography sx={{ alignSelf: 'center', fontFamily: 'Rubik', color: 'grey', fontSize: '1.5rem' }} variant="h4" gutterBottom>
                            ¿Cómo sería tu propiedad ideal?
                        </Typography>
                    </Box>
                    <Box display='flex' flex='0.8' flexDirection='column' sx={{ justifyContent: 'center', width: '90%', alignSelf: 'center' }}>
                        <TextField
                            fullWidth
                            id="property-type-select"
                            select
                            label="Tipo"
                            {...register("propertyType")}
                            sx={{
                                marginTop: 2,
                                borderRadius: 2,
                                backgroundColor: 'white',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#005b96',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#007bb5',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#005b96',
                                    },
                                },
                            }}
                            error={!!errors.propertyType}
                            helperText={errors.propertyType?.message}
                        >
                            {property_types.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.value}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box display='flex' width='100%' flexDirection='row' justifyContent='space-between'>
                            <TextField
                                key='min-price'
                                sx={{ marginTop: 2, width: '39%' }}
                                onInput={handleInput}
                                label={'Precio mínimo'}
                                {...register('minPrice')}
                                error={!!errors.minPrice}
                                helperText={errors.minPrice?.message}
                            />
                            <TextField
                                key='max-price'
                                sx={{ marginTop: 2, width: '39%' }}
                                onInput={handleInput}
                                label={'Precio máximo'}
                                {...register('maxPrice')}
                                error={!!errors.maxPrice}
                                helperText={errors.maxPrice?.message}
                            />
                            <TextField
                                fullWidth
                                id="currency-select"
                                select
                                label="$"
                                {...register("currency")}
                                sx={{ marginTop: 2, width: '20%' }}
                                error={!!errors.currency}
                                helperText={errors.currency?.message}
                            >
                                {currencies.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.value}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box display='flex' width='100%' flexDirection='row' justifyContent='space-between'>
                            <TextField
                                key='min-rooms'
                                sx={{ marginTop: 2, width: '24%' }}
                                onInput={handleInput}
                                label={'Ambientes mínimos'}
                                {...register('minRooms')}
                                error={!!errors.minRooms}
                                helperText={errors.minRooms?.message}
                            />
                            <TextField
                                key='max-rooms'
                                sx={{ marginTop: 2, width: '24%', }}
                                onInput={handleInput}
                                label={'Ambientes máximos'}
                                {...register('maxRooms')}
                                error={!!errors.maxRooms}
                                helperText={errors.maxRooms?.message}
                            />
                            <TextField
                                key='min-m2'
                                sx={{ marginTop: 2, width: '24%' }}
                                onInput={handleInput}
                                label={'M2 mínimos'}
                                {...register('minM2')}
                                error={!!errors.minM2}
                                helperText={errors.minM2?.message}
                            />
                            <TextField
                                key='max-m2'
                                sx={{ marginTop: 2, width: '24%', }}
                                onInput={handleInput}
                                label={'M2 máximos'}
                                {...register('maxM2')}
                                error={!!errors.maxM2}
                                helperText={errors.maxM2?.message}
                            />
                        </Box>
                        <Box display='flex' width='100%' flexDirection='row' justifyContent='flex-start' sx={{ mt: '2%' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...register('hasGarage')}
                                        sx={{
                                            color: '#005b96',
                                            '&.Mui-checked': {
                                                color: '#007bb5',
                                            },
                                        }}
                                    />
                                }
                                sx={{ color: '#333', fontFamily: 'Rubik' }}
                                label="Cochera"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        {...register('rental')}
                                        sx={{
                                            color: '#005b96',
                                            '&.Mui-checked': {
                                                color: '#007bb5',
                                            },
                                        }}
                                        defaultChecked
                                    />
                                }
                                sx={{ color: '#333', fontFamily: 'Rubik' }}
                                label="Alquiler"
                            />
                        </Box>
                    </Box>
                </Box>

                <Box display='flex' flex='0.3' width='100%' height='100%' justifyContent='flex-end'>
                    <Box justifyContent='flex-end' sx={{ position: 'absolute', bottom: '5%', right: '5%' }}>
                        <IconButton
                            type="submit"
                            sx={{ ...iconButtonStyles }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
