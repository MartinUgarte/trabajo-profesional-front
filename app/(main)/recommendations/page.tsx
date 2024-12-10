"use client";

import { Box, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Preferences, Recommendation } from "@/app/types";
import PropertyCard from "./PropertyCard";
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import KingBedIcon from '@mui/icons-material/KingBed';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SellIcon from '@mui/icons-material/Sell';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PlaceIcon from '@mui/icons-material/Place';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries = 5, delayTime = 200) => {
    for (let i = 0; i < retries; i++) {
        try {
           
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
    

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (i === retries - 1) {
                throw error; 
            }
            await delay(delayTime * 2 ** i); 
        }
    }
};

export default function Recommendations() {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [totalCount, setTotalCount] = useState<string>('');
    const [preferences, setPreferences] = useState<Preferences>({});
    const [images, setImages] = useState<{ [key: string]: string[] }>({});
    const [loading, setLoading] = useState<boolean>(false);

    const getRecommendations = () => {
        const recos = localStorage.getItem('recommendations');
        if (!recos) return;

        setRecommendations(JSON.parse(recos));

        const totalCount = localStorage.getItem('totalCount');
        if (totalCount) setTotalCount(totalCount);

        const preferences = localStorage.getItem('preferences');
        if (preferences) setPreferences(JSON.parse(preferences));
    };

    const apiKey = 'AIzaSyAfPFEbgK7iwpufDlShVKoGKrwQqkXElww';

    const fetchPropertyImages = async (property_folder_id: string) => {
        const url = `https://www.googleapis.com/drive/v3/files?q='${property_folder_id}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)&pageSize=10`;
        try {
            const data = await fetchWithRetry(url);
            return data.files
                .filter((file: { mimeType: string }) => file.mimeType.startsWith('image/'))
                .map((file: { id: string }) => file.id);
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
            return [];
        }
    };

    useEffect(() => {
        getRecommendations();
    }, []);

    useEffect(() => {
        const fetchImagesForRecommendations = async () => {
            for (const recommendation of recommendations) {
                if (recommendation.drive_id) {
                    const propertyImages = await fetchPropertyImages(recommendation.drive_id);
                    setImages(prevImages => ({
                        ...prevImages,
                        [recommendation.id]: propertyImages,
                    }));
                }
            }
        };

        if (recommendations.length > 0) {
            fetchImagesForRecommendations();
        }
    }, [recommendations]);

    const handleResearch = async () => {
        const jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }

        const preferences = localStorage.getItem("preferences")
        if (!preferences) {
            return;
        }

        setLoading(true)
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
                kbrs: JSON.parse(preferences)
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("recommendations", JSON.stringify(data.recommendations));
                localStorage.setItem("totalCount", data.total_count);
                getRecommendations();
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                bgcolor: '#0a0a0a',
                padding: '2%',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: 'linear-gradient(45deg, rgba(33, 150, 243, 0.4) 30%, rgba(33, 203, 243, 0.1) 90%), url(https://i.imgur.com/2bUXNNG.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
            <Box width='90%' height='10%' display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                <Box
                    width='10%' height='100%' display='flex' flex='0.9' flexDirection='row' justifyContent='center' alignItems='center'
                    sx={{
                        mb: '1%',
                        cursor: 'pointer',
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                            transform: 'scale(1.02)',
                        },
                    }}
                    onClick={() => router.push('/filter')}
                >
                    <Box flex='0.7' display='flex' flexDirection='row' width='100%' height='100%' justifyContent='space-between' alignItems='center'>
                        <Box sx={{ textAlign: 'center', ml: '4%' }}>
                            <ApartmentIcon fontSize="large" />
                            <Typography>
                                {preferences.tipo_propiedad ? preferences.tipo_propiedad : '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SellIcon fontSize="large" />
                            <Typography>{preferences.alquiler ? 'alquiler' : 'venta'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <KingBedIcon fontSize="large" />
                            <Typography>
                                {preferences.ambientes_min && preferences.ambientes_max
                                    ? `${preferences.ambientes_min} - ${preferences.ambientes_max} ambientes`
                                    : preferences.ambientes_min
                                        ? `> ${preferences.ambientes_min} ambientes`
                                        : preferences.ambientes_max
                                            ? `< ${preferences.ambientes_max} ambientes`
                                            : '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SquareFootIcon fontSize="large" />
                            <Typography>
                                {preferences.m2_min && preferences.m2_max
                                    ? `${preferences.m2_min} - ${preferences.m2_max} m2`
                                    : preferences.m2_min
                                        ? `> ${preferences.m2_min} m2`
                                        : preferences.m2_max
                                            ? `< ${preferences.m2_max} m2`
                                            : '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <AttachMoneyIcon fontSize="large" />
                            <Typography>
                                {preferences.precio_min && preferences.precio_max
                                    ? `$${new Intl.NumberFormat('es-ES').format(preferences.precio_min)} - $${new Intl.NumberFormat('es-ES').format(preferences.precio_max)}`
                                    : preferences.precio_min
                                        ? `> $${new Intl.NumberFormat('es-ES').format(preferences.precio_min)}`
                                        : preferences.precio_max
                                            ? `< $${new Intl.NumberFormat('es-ES').format(preferences.precio_max)}`
                                            : '-'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <DriveEtaIcon fontSize="large" />
                            <Typography>{preferences.cochera ? 'con cochera' : 'sin cochera'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <PlaceIcon fontSize="large" />
                            <Typography>cerca de {preferences.lugares_frecuentados?.join(', ')}</Typography>
                        </Box>
                    </Box>

                    <Box flex='0.3' display='flex' flexDirection='row' alignItems='center' justifyContent='center'>
                        <Typography sx={{ mr: '2%', alignSelf: 'center', alignContent: 'center' }}>¡Se han encontrado</Typography>
                        <Typography sx={{ mr: '2%', alignSelf: 'center', alignContent: 'center', color: '#21C1F3' }} variant='h5'>{totalCount}</Typography>
                        <Typography sx={{ alignSelf: 'center', alignContent: 'center' }}>propiedades!</Typography>
                    </Box>
                </Box>
                <Box
                    width='10%' height='100%' display='flex' flex='0.1'
                    sx={{
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease', // Transición suave
                        '&:hover': {
                            transform: 'scale(1.2)', // Aumenta el tamaño al 120%
                        },
                    }}
                    justifyContent='center'
                    alignItems='center'
                    onClick={() => handleResearch()}
                >
                    <RestartAltIcon fontSize="large" />
                </Box>
            </Box>


            <Box
                sx={{
                    height: '80vh',
                    overflowY: 'scroll',
                    width: '100%',
                    maxWidth: '90%',
                    padding: '2%',
                    '&::-webkit-scrollbar': {
                        width: '12px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(0, 92, 179, 0.7)', // Color del pulgar de la barra
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(0, 92, 179, 1)', // Color del pulgar al pasar el ratón
                    },
                }}
            >
                {loading ? ( // Mostrar CircularProgress mientras se carga
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
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
                ) : (
                    recommendations.length > 0 &&
                    recommendations.map((recommendation) => (
                        <Box key={recommendation.id} sx={{ marginBottom: '3%' }}>
                            <PropertyCard
                                recommendation={recommendation}
                                images={images}
                            />
                        </Box>
                    ))
                )}

            </Box>
        </Box>
    );
}