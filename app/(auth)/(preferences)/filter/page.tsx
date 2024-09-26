"use client";

import {
    property_types,
    currencies
} from "../../../types";
import {
    Box,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
    MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type FormValues = {
    propertyType: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    minRooms: number;
    maxRooms: number;
    hasGarage: boolean;
};

export default function Filter() {
    const [propertyType, setPropertyType] = useState<string>("");
    const [minPrice, setMinPrice] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [currency, setCurrency] = useState<string>("");
    const [minRooms, setMinRooms] = useState<number>(0);
    const [maxRooms, setMaxRooms] = useState<number>(0);
    const [hasGarage, setHasGarage] = useState<boolean>(false);
    const router = useRouter();

    const form = useForm<FormValues>({
        defaultValues: {
            propertyType: "",
            minPrice: 0,
            maxPrice: 0,
            currency: "ARS",
            minRooms: 0,
            maxRooms: 0,
            hasGarage: false,
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

    const handleFilterSubmit = (formData: FormValues) => {
        // setPropertyType(formData.propertyType);
        // setMinPrice(formData.minPrice);
        // setMaxPrice(formData.maxPrice);
        // setCurrency(formData.currency);
        // setMinRooms(formData.minRooms);
        // setMaxRooms(formData.maxRooms);
        // setHasGarage(formData.hasGarage);
        localStorage.setItem("propertyType", formData.propertyType.toString());
        localStorage.setItem("minPrice", formData.minPrice.toString());
        localStorage.setItem("maxPrice", formData.maxPrice.toString());
        localStorage.setItem("currency", formData.currency.toString());
        localStorage.setItem("minRooms", formData.minRooms.toString());
        localStorage.setItem("maxPrice", formData.maxRooms.toString());
        localStorage.setItem("hasGarage", formData.hasGarage.toString());
        router.push('../places');
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
            sx={{ bgcolor: 'white' }}
        >
            <Box width='100%' height='100%' display='flex' flexDirection='column' justifyContent='flex-end' alignItems='center' flex='0.3'>
                <Typography sx={{ fontFamily: 'Rubik', fontSize: '300%', color: '#083240' }} variant="h4" gutterBottom>
                    ¡Bienvenido!
                </Typography>
                <Typography sx={{ fontFamily: 'Rubik', color: 'black', fontSize: '150%' }} variant="h4" gutterBottom>
                    ¿Cómo sería tu propiedad ideal?
                </Typography>
            </Box>
            <Box width='100%' flexDirection='column' justifyContent='center' alignItems='center' height='100%' display='flex' flex='0.7' component="form" onSubmit={handleSubmit(handleFilterSubmit)}>
                <Box display='flex' flex='0.7' width='40%' height='100%' justifyContent='center' flexDirection='column'>
                    <TextField
                        fullWidth
                        id="property-type-select"
                        select
                        label="Tipo"
                        {...register("propertyType")}
                        sx={{ marginTop: 2 }}
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
                            sx={{ marginTop: 2, width: '49%' }}
                            onInput={handleInput}
                            label={'Ambientes mínimos'}
                            {...register('minRooms')}
                            error={!!errors.minRooms}
                            helperText={errors.minRooms?.message}
                        />
                        <TextField
                            key='max-rooms'
                            sx={{ marginTop: 2, width: '49%', }}
                            onInput={handleInput}
                            label={'Ambientes máximos'}
                            {...register('maxRooms')}
                            error={!!errors.maxRooms}
                            helperText={errors.maxRooms?.message}
                        />
                    </Box>
                    <FormControlLabel control={<Checkbox {...register('hasGarage')} />} sx={{ color: 'black', fontFamily: 'Rubik' }} label="Cochera" />
                </Box>

                <Box display='flex' flex='0.3' width='100%' height='100%' justifyContent='flex-end'>
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
