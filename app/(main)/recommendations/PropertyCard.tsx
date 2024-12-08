// Código completo del componente PropertyCard
import { EstacionCercana, Recommendation, subtes_imgs } from "@/app/types";
import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PropertyCardProps = {
    recommendation: Recommendation;
    images: { [key: string]: string[] };
}

export default function PropertyCard({ recommendation, images }: PropertyCardProps) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);
    const [imageLinks, setImageLinks] = useState<string[]>([]);

    useEffect(() => {
        if (recommendation.id in images) {
            setImageLinks(images[recommendation.id]);
        }
    }, [images]);
    // Función para formatear el precio
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('es-AR').format(parseInt(price));
    };

    const handleDetails = () => {
        localStorage.setItem("property", JSON.stringify(recommendation));
        localStorage.setItem("propertyImages", JSON.stringify(imageLinks || []));
        router.push(`recommendations/${recommendation.id}`);
    };

    return (
        <Card sx={{ display: 'flex', height: '20%' }}>
            {/* Imagen de la propiedad */}
            <CardMedia
                component="img"
                sx={{ width: 250, height: 250, objectFit: 'cover' }}
                image={
                    recommendation.drive_id == null || !imageLinks[0]
                        ? 'https://i.imgur.com/XyVJU8I.png'
                        : `https://drive.google.com/thumbnail?id=${imageLinks[0]}`
                }
                alt="Imagen de propiedad"
                onError={(e) => {
                    e.currentTarget.src = 'https://i.imgur.com/XyVJU8I.png'; // Imagen de respaldo
                }}
            />

            {/* Contenido de la Card con flex para dividir */}
            <Box sx={{ display: 'flex', flex: 1 }}>
                <CardContent sx={{ flex: 1, display: 'flex' }}>
                    {/* Información de la propiedad (lado izquierdo) */}
                    <Box sx={{ flex: 1, paddingRight: '2%' }}>
                        <Box display='flex' flexDirection='row'>
                            <Typography sx={{ mr: '2%' }} component="div" variant="h6">
                                ${formatPrice(recommendation.precio)}
                            </Typography>
                            <Typography sx={{ color: 'grey' }} component="div" variant="h6">
                                {recommendation.tipo_moneda}
                            </Typography>
                        </Box>

                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            {recommendation.direccion}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component="div">
                            {recommendation.m2} m² - {recommendation.ambientes} ambientes
                        </Typography>
                        <Typography sx={{ mt: '2%', color: '#00abe4' }} variant="body1" color="text.secondary" component="div">
                            {Math.round(recommendation._final_rating / 5 * 100)}% match
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                borderRadius: '20px',
                                padding: '5px 15px',
                                color: 'white',
                                mt: '5%',
                                fontWeight: 'bold',
                                fontSize: '0.875rem',
                                boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    backgroundColor: '#1976D2',
                                    boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',
                                    transform: 'scale(1.05)',
                                },
                            }}
                            onClick={() => handleDetails()}
                        >
                            Ver más
                        </Button>
                    </Box>

                    {/* Estaciones cercanas (lado derecho) */}
                    <Box sx={{ flex: 1 }}>
                        {recommendation.estacion_cercana.length > 0 && (
                            <Box
                                sx={{
                                    backgroundColor: '#E3F2FD',  // Color azul claro para contraste
                                    borderRadius: '8px',
                                    padding: '16px',
                                    mt: '1.4%',
                                    boxShadow: 3,
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                <Typography variant="body2" color="text.primary" component="div" sx={{ marginBottom: '1%' }}>
                                    Estaciones cercanas:
                                </Typography>
                                {recommendation.estacion_cercana.map((estacion: EstacionCercana, index) => (
                                    <Box key={index} display="flex" alignItems="center" sx={{ marginBottom: '8px' }}>
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
    );
}
