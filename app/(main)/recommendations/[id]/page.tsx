"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, IconButton } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import KingBedIcon from '@mui/icons-material/KingBed';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SellIcon from '@mui/icons-material/Sell';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import StarIcon from '@mui/icons-material/Star';
import DirectionsSubwayIcon from '@mui/icons-material/DirectionsSubway';
import { Recommendation, LugarFrecuentado } from '@/app/types';
import L from 'leaflet';
import RatingModal from './RatingModal';
import LoadingModal from '@/app/(auth)/LoadingModal';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';

export const subtes_imgs = {
    "A": "https://emova.com.ar/wp-content/uploads/2021/11/past-a-60.png",
    "B": "https://emova.com.ar/wp-content/uploads/2021/11/past-b-60.png",
    "C": "https://emova.com.ar/wp-content/uploads/2021/11/past-c-60.png",
    "D": "https://emova.com.ar/wp-content/uploads/2021/11/past-d-60.png",
    "E": "https://emova.com.ar/wp-content/uploads/2021/11/past-e-60.png",
    "H": "https://emova.com.ar/wp-content/uploads/2021/11/past-h-60.png",
};

const iconButtonStyles = {
    color: 'white',
    marginRigth: '5%',
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
    const router = useRouter();
    const [recommendation, setRecommendation] = useState<Recommendation>({
        id: '',
        tipo_propiedad: '',
        m2: 0,
        ambientes: 0,
        cochera: false,
        precio: '',
        tipo_moneda: '',
        alquiler: false,
        link: '',
        direccion: '',
        lat: 0,
        long: 0,
        expensas: '',
        tipo_moneda_expensas: '',
        estacion_cercana: [],
        drive_id: '',
    });

    const [images, setImages] = useState<string[]>(['https://i.imgur.com/XyVJU8I.png']);
    const [lugaresFrecuentados, setLugaresFrecuentados] = useState<LugarFrecuentado[]>([{
        direccion: '',
        longitud: 0,
        id: 0,
        user_id: 0,
        latitud: 0,
        estaciones_cercanas: []
    }]);

    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); 

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

    const getFrequentedPlaces = async () => {
        let jwtToken = localStorage.getItem('jwtToken');
        if (!jwtToken) {
            return;
        }

        setLoading(true);

        fetch(`http://localhost:8000/frequented-places`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer ' + jwtToken,
            },
        }).then((res) => {

            return res.json();
        })
            .then((data) => {
                setLugaresFrecuentados(data);
            })

        setLoading(false)
    }

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
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('es-AR').format(parseInt(price));
    };

    useEffect(() => {
        getRecommendation();
        getFrequentedPlaces();
    }, []);

    const shownLines: Set<string> = new Set();

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <Box sx={{
            flexGrow: 1, padding: 3, display: 'flex', flexDirection: 'column', gap: 2, backgroundImage: 'linear-gradient(45deg, rgba(33, 150, 243, 0.4) 30%, rgba(33, 203, 243, 0.1) 90%), url(https://i.imgur.com/2bUXNNG.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
        }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper elevation={3} sx={{ width: '60%' }}>
                    <Carousel showThumbs={false} showStatus={false} dynamicHeight>
                        {images.length > 0
                            ? images.map((link, index) => (
                                <div key={index}>
                                    <img
                                        src={`https://drive.google.com/thumbnail?id=${link}&sz=w10000`}
                                        alt={`Imagen ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '400px',
                                            objectFit: 'cover',
                                        }}
                                        onError={(e) => {
                                            e.target.src = "https://i.imgur.com/XyVJU8I.png";
                                        }}
                                    />
                                </div>
                            ))
                            : [
                                <div key="default-image">
                                    <img
                                        src="https://i.imgur.com/XyVJU8I.png"
                                        alt="Imagen por defecto"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '400px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </div>,
                            ]}
                    </Carousel>

                </Paper>


                <Paper elevation={3} sx={{ flex: 1, padding: 2 }}>
                    <Box sx={{ marginBottom: 2 }}>
                        <Box display='flex' flexDirection='row' width='100%' alignItems='center'>
                            <Box display='flex' flexDirection='column' justifyContent='flex-start' flex='0.7' alignItems='flex-start'>
                                <Box display='flex' flex='0.5' flexDirection='row' alignItems='flex-end'>
                                    <Typography sx={{ fontWeight: 'bold', color: '#1976d2', mr: '5%' }} component="div" variant="h4">
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
                                    onClick={handleOpenModal}
                                >
                                    <StarIcon sx={{ color: '#FFB700' }} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ fontSize: '1rem' }}>{recommendation.direccion}</Typography>
                    </Box>

                    <Box sx={{ mt: '6%', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <ApartmentIcon fontSize="large" />
                            <Typography>{recommendation.tipo_propiedad}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SellIcon fontSize="large" />
                            <Typography>{recommendation.alquiler ? 'alquiler' : 'venta'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <KingBedIcon fontSize="large" />
                            <Typography>{recommendation.ambientes} ambientes</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <SquareFootIcon fontSize="large" />
                            <Typography>{recommendation.m2} m2</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <DriveEtaIcon fontSize="large" />
                            <Typography>{recommendation.cochera ? 'Con cochera' : 'Sin cochera'}</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <DirectionsSubwayIcon fontSize="large" />
                            {Array.isArray(recommendation.estacion_cercana) && recommendation.estacion_cercana.length > 0 ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                    {Array.from(new Set(recommendation.estacion_cercana.map(estacion => estacion.linea))).map((linea, index) => (
                                        <img
                                            key={index}
                                            src={subtes_imgs[linea]}
                                            alt={`Línea ${linea}`}
                                            style={{ height: '24px', width: '24px', marginBottom: '5px' }}
                                        />
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="caption">No hay estaciones cercanas</Typography>
                            )}

                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Box sx={{ width: '100%', height: '400px' }}>
                {recommendation.lat !== 0 && recommendation.long !== 0 && (
                    <MapContainer center={[recommendation.lat, recommendation.long]} zoom={14} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        <Marker position={[recommendation.lat, recommendation.long]} icon={propertyIcon}>
                            <Popup>{recommendation.direccion}</Popup>
                        </Marker>

                        {lugaresFrecuentados.map((lugar, index) => (
                            lugar.latitud !== 0 && lugar.longitud !== 0 && (
                                <React.Fragment key={`lugar-${index}`}>
                                    <Marker position={[lugar.latitud, lugar.longitud]} icon={starIcon}>
                                        <Popup>{lugar.direccion}</Popup>
                                    </Marker>

                                    {lugar.estaciones_cercanas && lugar.estaciones_cercanas.map((estacion, estacionIndex) => (
                                        <Marker
                                            key={`estacion-${index}-${estacionIndex}`}
                                            position={[estacion.lat, estacion.long]}
                                            icon={new L.Icon({
                                                iconUrl: subtes_imgs[estacion.linea],
                                                iconSize: [32, 32],
                                                iconAnchor: [16, 32],
                                                popupAnchor: [0, -32],
                                            })}
                                        >
                                            <Popup>{estacion.estacion} - {Math.round(estacion.distancia)} m</Popup>
                                        </Marker>
                                    ))}
                                </React.Fragment>
                            )
                        ))}


                        {/* Mapeo de las estaciones cercanas */}
                        {recommendation.estacion_cercana?.map((estacion, index) => (
                            <React.Fragment key={index}>
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
                            </React.Fragment>

                        ))}
                    </MapContainer>)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                <IconButton
                    onClick={() => { router.back() }}
                    sx={{ ...iconButtonStyles }}
                >
                    <ArrowBackIosIcon />
                </IconButton>
                <Button
                    variant="contained"
                    sx={{
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        borderRadius: '20px',
                        padding: '5px 15px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                            backgroundColor: '#1976D2',
                            boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',
                            transform: 'scale(1.05)',
                        },
                    }}
                    href={recommendation.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Visitar Sitio de la Propiedad
                </Button>

            </Box>

            <RatingModal
                open={modalOpen}
                onClose={handleCloseModal}
                loading={loading}
                setLoading={setLoading}
                propertyId={recommendation.id}
            />

            <LoadingModal open={loading} />

        </Box>
    );
}
