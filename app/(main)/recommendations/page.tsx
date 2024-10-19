"use client";

import { Box, Card, CardContent, Typography, Button, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Recommendation } from "@/app/types";
import PropertyCard from "./PropertyCard";

export default function Recommendations() {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [images, setImages] = useState<{ [key: string]: string[] }>({});

    const getRecommendations = () => {
        let recos = localStorage.getItem('recommendations');
        if (!recos) {
            return;
        }
        setRecommendations(JSON.parse(recos));
        console.log('RECOMMENDATIONS A: ', JSON.parse(recos));
    };

    const apiKey = 'AIzaSyAfPFEbgK7iwpufDlShVKoGKrwQqkXElww';

    const fetchPropertyImages = async (property_folder_id: string) => {
        try {
            const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${property_folder_id}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`);
            const data = await response.json();
            const imageLinks = data.files
                .filter(file => file.mimeType.startsWith('image/'))
                .map(file => `${file.id}`); // Enlace directo a la imagen
            if (property_folder_id == '161W2uA7kqcGkpzxcrHihvrWmSoPZQxBK') { 
                console.log('SOY VERA AL 100', imageLinks);
            }
            return imageLinks;
        } catch (error) {
            console.error('Error al cargar imágenes:', error);
        }
    };

    useEffect(() => {
        getRecommendations();
    }, []); // Este solo corre al montar el componente

    useEffect(() => {
        const fetchImagesForRecommendations = async () => {
            for (const recommendation of recommendations) {
                if (recommendation.drive_id != undefined) {
                    const propertyImages = await fetchPropertyImages(recommendation.drive_id);
                    setImages(prevImages => ({
                        ...prevImages,
                        [recommendation.id]: propertyImages
                    }));
                }
            }
        };

        if (recommendations.length > 0) {
            fetchImagesForRecommendations();
        }
    }, [recommendations]); 

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                bgcolor: '#f5f5f5',
                padding: '2%',
                height: '100vh',
                overflow: 'hidden',
                backgroundImage: 'linear-gradient(45deg, rgba(33, 150, 243, 0.6) 30%, rgba(33, 203, 243, 0.2) 90%), url(https://i.imgur.com/2bUXNNG.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}
        >
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
                {recommendations.map((recommendation) => (
                    <Box key={recommendation.id} sx={{ marginBottom: '3%' }}>
                        <PropertyCard
                            recommendation={recommendation}
                            images={images}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
