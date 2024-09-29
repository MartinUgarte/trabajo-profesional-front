"use client";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    CardMedia,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recommendation, EstacionCercana } from "@/app/types";

// Mapeo de imágenes de subtes
export const subtes_imgs = {
    "A": "https://emova.com.ar/wp-content/uploads/2021/11/past-a-60.png",
    "B": "https://emova.com.ar/wp-content/uploads/2021/11/past-b-60.png",
    "C": "https://emova.com.ar/wp-content/uploads/2021/11/past-c-60.png",
    "D": "https://emova.com.ar/wp-content/uploads/2021/11/past-d-60.png",
    "E": "https://emova.com.ar/wp-content/uploads/2021/11/past-e-60.png",
    "H": "https://emova.com.ar/wp-content/uploads/2021/11/past-h-60.png",
};

export default function Recommendations() {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

    const getRecommendations = () => {
        let recos = localStorage.getItem('recommendations');
        if (!recos) {
            return;
        }
        setRecommendations(JSON.parse(recos));
    };

    useEffect(() => {
        getRecommendations();
    }, []);

    // Función para formatear el precio
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('es-AR').format(parseInt(price));
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: '#f5f5f5', padding: '2%', height: '100vh', overflow: 'hidden' }}
        >
            <Box 
                sx={{ 
                    height: '70vh', 
                    overflowY: 'scroll', 
                    width: '100%', 
                    maxWidth: '70%', 
                    padding: '2%',
                    mt: '4%'
                }}
            >
                {recommendations.map((recommendation) => (
                    <Box key={recommendation.id} sx={{ marginBottom: '3%' }}>
                        <Card sx={{ display: 'flex', maxHeight: '30%' }}>
                            {/* Imagen de la propiedad */}
                            <CardMedia
                                component="img"
                                sx={{ width: '20%' }}
                                image="https://drive.google.com/uc?id=1--Tq4KABUf1aLSXIFRHVBiZvmaZ-JK21"
                                alt="Imagen de propiedad"
                            />
                            
                            {/* Contenido de la Card con flex para dividir */}
                            <Box sx={{ display: 'flex', flex: 1 }}>
                                <CardContent sx={{ flex: 1, display: 'flex' }}>
                                    
                                    {/* Información de la propiedad (lado izquierdo) */}
                                    <Box sx={{ flex: 1, paddingRight: '2%' }}>
                                        <Typography component="div" variant="h6">
                                            ${formatPrice(recommendation.precio)}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary" component="div">
                                            {recommendation.direccion}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" component="div">
                                            {recommendation.m2} m² - {recommendation.ambientes} ambientes
                                        </Typography>
                                        <Button 
                                            variant="contained" 
                                            sx={{ marginTop: '1%' }}
                                            onClick={() => router.push(recommendation.link)}
                                        >
                                            Ver más detalles
                                        </Button>
                                    </Box>

                                    {/* Estaciones cercanas (lado derecho) */}
                                    <Box sx={{ flex: 1 }}>
                                        {recommendation.estacion_cercana.length > 0 && (
                                            <Box>
                                                <Typography variant="body2" color="text.primary" component="div" sx={{ marginBottom: '1%' }}>
                                                    Estaciones cercanas:
                                                </Typography>
                                                {recommendation.estacion_cercana.map((estacion: EstacionCercana, index) => (
                                                    <Box key={index} display="flex" alignItems="center">
                                                        {/* Imagen de la línea de subte */}
                                                        {subtes_imgs[estacion.linea] && (
                                                            <img 
                                                                src={subtes_imgs[estacion.linea]} 
                                                                alt={`Línea ${estacion.linea}`} 
                                                                style={{ width: '5%', height: 'auto', marginRight: '2%' }} 
                                                            />
                                                        )}
                                                        <Typography 
                                                            variant="body2" 
                                                            color="text.secondary" 
                                                            component="div"
                                                        >
                                                            {estacion.estacion} ({estacion.distancia} metros)
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Box>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
