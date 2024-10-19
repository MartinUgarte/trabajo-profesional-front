"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import KingBedIcon from '@mui/icons-material/KingBed';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SellIcon from '@mui/icons-material/Sell';
import GarageIcon from '@mui/icons-material/Garage';
import StarIcon from '@mui/icons-material/Star';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import { Recommendation } from '@/app/types';
import L from 'leaflet';
import RatingModal from './RatingModal';
import LoadingModal from '@/app/(auth)/LoadingModal';

export const subtes_imgs = {
    "A": "https://emova.com.ar/wp-content/uploads/2021/11/past-a-60.png",
    "B": "https://emova.com.ar/wp-content/uploads/2021/11/past-b-60.png",
    "C": "https://emova.com.ar/wp-content/uploads/2021/11/past-c-60.png",
    "D": "https://emova.com.ar/wp-content/uploads/2021/11/past-d-60.png",
    "E": "https://emova.com.ar/wp-content/uploads/2021/11/past-e-60.png",
    "H": "https://emova.com.ar/wp-content/uploads/2021/11/past-h-60.png",
};

const iconButtonStyles = {
    color: 'rgba(33, 150, 243, 0.6)',
    padding: 0,
    borderRadius: '50%',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.1)',
    },
    '& .MuiSvgIcon-root': {
        fontSize: 60,
        padding: '12px',
    },
};

export default function RecommendationDetail() {
    const [recommendation, setRecommendation] = useState<Recommendation>({});
    const [images, setImages] = useState<string[]>(['https://i.imgur.com/XyVJU8I.png']);
    const [lugaresFrecuentados, setLugaresFrecuentados] = useState<{ direccion: string; lat: number; long: number }[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Estado de carga

    const geocodeAddress = async (direccion: string): Promise<{ lat: number; long: number } | null> => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(direccion)}&format=json`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                return { lat: parseFloat(lat), long: parseFloat(lon) };
            }
        } catch (error) {
            console.error("Error geocoding address:", error);
        }
        return null;
    };

    const propertyIcon = new L.Icon({
        iconUrl: 'https://i.imgur.com/QIh0JOI.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const starIcon = new L.Icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/541/541415.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    const getRecommendation = () => {
        let reco = localStorage.getItem('property');
        let recoImages = localStorage.getItem('propertyImages');

        if (!reco) {
            return;
        }

        setRecommendation(JSON.parse(reco));

        if (recoImages) {
            setImages(JSON.parse(recoImages));
        }

        console.log('RECOMMENDATION: ', JSON.parse(reco));
        console.log('IMAGES: ', JSON.parse(recoImages));
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('es-AR').format(parseInt(price));
    };

    useEffect(() => {
        getRecommendation();

        const fetchFrequentedPlaces = async () => {
            const storedPlaces = localStorage.getItem('frequentedPlaces');
            if (!storedPlaces) {
                return;
            }

            const parsedPlaces: string[] = JSON.parse(storedPlaces);
            const initialPlaces = parsedPlaces.map((direccion) => ({
                direccion,
                lat: 0,
                long: 0
            }));

            setLugaresFrecuentados(initialPlaces);

            const updatedPlaces = await Promise.all(
                initialPlaces.map(async (place) => {
                    const coordinates = await geocodeAddress(place.direccion);
                    return coordinates ? { ...place, ...coordinates } : place;
                })
            );

            setLugaresFrecuentados(updatedPlaces);
        };

        fetchFrequentedPlaces();
    }, []);

    useEffect(() => {
        console.log('Lugares frecuentados:', lugaresFrecuentados);
    }, [lugaresFrecuentados]);

    const shownLines: Set<string> = new Set();

    // Función para abrir el modal
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{
            flexGrow: 1, padding: 3, display: 'flex', flexDirection: 'column', gap: 2, backgroundImage: 'linear-gradient(45deg, rgba(33, 150, 243, 0.6) 30%, rgba(33, 203, 243, 0.2) 90%), url(https://i.imgur.com/2bUXNNG.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper elevation={3} sx={{ width: '60%' }}>
                <Carousel showThumbs={false} showStatus={false} dynamicHeight>
    {recommendation.drive_id == null ? (
        // Envolviendo el elemento en un array
        [ 
            <div key="null-image"> {/* Agregando un key para evitar warnings */}
                <img
                    src={'https://i.imgur.com/XyVJU8I.png'}
                    alt={`Imagen null`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'cover',
                    }}
                />
            </div>
        ]
    ) : (
        images.map((src, index) => (
            <div key={index}>
                <img
                    src={`https://drive.google.com/thumbnail?id=${src}&sz=w2000`}
                    alt={`Imagen ${index + 1}`}
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '400px',
                        objectFit: 'cover',
                    }}
                />
            </div>
        ))
    )}
</Carousel>

                </Paper>


                <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
                    <Box sx={{ marginBottom: 2 }}>
                        <Box display='flex' flexDirection='row' width='100%' alignItems='center'>
                            <Box display='flex' flexDirection='column' justifyContent='flex-start' flex='0.7' alignItems='flex-start'>
                                <Box display='flex' flex='0.5' flexDirection='row' alignItems='flex-start'>
                                    <Typography sx={{ mr: '5%' }} component="div" variant="h6">
                                        ${formatPrice(recommendation.precio)}
                                    </Typography>
                                    <Typography sx={{ color: 'grey' }} component="div" variant="h6">
                                        {recommendation.tipo_moneda}
                                    </Typography>
                                </Box>
                                <Box display='flex' flexDirection='row' flex='0.5' justifyContent='flex-start' alignItems='flex-start'>
                                    <Typography variant="body2" sx={{ color: 'gray', fontSize: '0.75rem' }}>
                                        ${formatPrice(recommendation.expensas)} {recommendation.tipo_moneda_expensas} expensas
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display='flex' flex='0.3' justifyContent='flex-end'>
                                <IconButton
                                    sx={{ ...iconButtonStyles }}
                                    onClick={handleOpenModal} // Abrir modal al hacer clic
                                >
                                    <StarIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>{recommendation.direccion}</Typography>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <ApartmentIcon fontSize="large" />
                            <Typography>{recommendation.tipo_propiedad}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SellIcon fontSize="large" />
                            <Typography>{recommendation.alquiler ? 'Alquiler' : 'Venta'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <KingBedIcon fontSize="large" />
                            <Typography>{recommendation.cant_dormitorios}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SquareFootIcon fontSize="large" />
                            <Typography>{recommendation.metros_cuadrados}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <GarageIcon fontSize="large" />
                            <Typography>{recommendation.cant_garages}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <DirectionsSubwayIcon fontSize="large" />
                            <Typography>{recommendation.lineas_subte}</Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ width: '100%', height: '400px' }}>
                {recommendation.lat !== undefined && recommendation.long !== undefined && (
                    <MapContainer center={[recommendation.lat, recommendation.long]} zoom={14} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <Marker position={[recommendation.lat, recommendation.long]} icon={propertyIcon}>
                            <Popup>{recommendation.direccion}</Popup>
                        </Marker>

                        {lugaresFrecuentados.map((lugar, index) => (
                            lugar.lat !== 0 && lugar.long !== 0 && (
                                <Marker key={index} position={[lugar.lat, lugar.long]} icon={starIcon}>
                                    <Popup>{lugar.direccion}</Popup>
                                </Marker>
                            )
                        ))}

                        {/* Mapeo de las estaciones cercanas */}
                        {recommendation.estacion_cercana?.map((estacion, index) => (
                            <Marker
                                key={index}
                                position={[estacion.lat, estacion.long]}
                                icon={new L.Icon({
                                    iconUrl: subtes_imgs[estacion.linea],
                                    iconSize: [32, 32],
                                    iconAnchor: [16, 32],
                                    popupAnchor: [0, -32],
                                })}
                            >
                                <Popup>
                                    {estacion.estacion} - {estacion.distancia} m
                                    <DirectionsSubwayIcon sx={{ marginLeft: 1 }} />
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <Button
                    variant="contained"
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
                    href={recommendation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visitar Sitio de la Propiedad
                </Button>

            </Box>

            {/* Aquí se agrega el modal */}
            <RatingModal
                open={modalOpen}
                onClose={handleCloseModal}
                loading={loading} // Pasar el estado de carga al modal
                setLoading={setLoading} // Pasar la función setLoading al modal
                propertyId={recommendation.id}
            />

            <LoadingModal open={loading} />

        </Box>
    );
}
