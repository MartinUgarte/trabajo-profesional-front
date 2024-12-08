"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorModal from "../ErrorModal";
import LoadingModal from "../LoadingModal";
import { Preferences } from "@/app/types";

type FormValues = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [loading, setLoading] = useState(false);  // Estado para el modal de carga
    const [errorText, setErrorText] = useState("");

    const form = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    // Función para el delay de 1 segundo
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchRecommendations = async (jwtToken: string, preferences) => {
        console.log('About to fetch recos from login')

        fetch(`http://localhost:8000/hybrid/recommend`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },

            body: JSON.stringify(
                preferences
            ),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                localStorage.setItem("recommendations", JSON.stringify(data.recommendations));
                localStorage.setItem("totalCount", data.total_count);
                localStorage.setItem("frequentedPlaces", JSON.stringify(preferences.lugares_frecuentados));
                router.push('../recommendations');
            })
            .catch((error) => {
                console.error("Error fetching recommendations:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const saveLocalPreferences  = (token: string, data) => {
        const preferences: Preferences = {};

        if (data.tipo_propiedad) preferences.tipo_propiedad = data.tipo_propiedad.toString().toLowerCase();
        if (data.precio_min) preferences.precio_min = data.precio_min;
        if (data.precio_max) preferences.precio_max = data.precio_max;
        if (data.tipo_moneda) preferences.tipo_moneda = data.tipo_moneda;
        if (data.ambientes_min) preferences.ambientes_min = data.ambientes_min;
        if (data.ambientes_max) preferences.ambientes_max = data.ambientes_max;
        if (data.cochera) preferences.cochera = data.cochera;
        if (data.alquiler) preferences.alquiler = data.alquiler;
        if (data.m2_min) preferences.m2_min = data.m2_min;
        if (data.m2_max) preferences.m2_max = data.m2_max;
        if (data.lugares_frecuentados) preferences.lugares_frecuentados = data.lugares_frecuentados;

        localStorage.setItem("preferences", JSON.stringify(preferences));

        fetchRecommendations(token, preferences);
    }

    const checkPreferences = async(token: string) => {

        fetch(`http://localhost:8000/user-preference`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            if(data == null) {
                setLoading(false);
                router.push('/filter');
                
            } else{
                saveLocalPreferences(token, data);
                
            }
        })
        .catch((error) => {
            setErrorText(`Error al obtener las preferences: ${error}`);
            setShowErrorModal(true);
            setLoading(false);
        })
    }

    const handleFormSubmit = async (formData: FormValues) => {
        if (!formData.email) {
            setErrorText("Debe ingresar un email.");
            setShowErrorModal(true);
            return;
        }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)) {
            setErrorText("El formato del email es incorrecto.");
            setShowErrorModal(true);
            return;
        }
        if (!formData.password) {
            setErrorText("Debe ingresar una contraseña.");
            setShowErrorModal(true);
            return;
        }

        setLoading(true);

        await sleep(1000);

        fetch(`http://localhost:8000/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        })
            .then((res) => {
                if (res.status == 401) {
                    setErrorText("Usuario o contraseña incorrectos.");
                    setShowErrorModal(true);
                    setLoading(false);
                } else if (res.status != 200) {
                    return res.json().then((data) => {
                        setErrorText(data.message || "Error desconocido en el servidor.");
                        setShowErrorModal(true);
                        setLoading(false);
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (data.access_token) {
                    localStorage.setItem("jwtToken", data.access_token);
                    checkPreferences(data.access_token);
                }
            })
            .catch((error) => {
                setErrorText("El email o la contraseña son incorrectos.");
                setShowErrorModal(true);
                setLoading(false)
            })
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <Box
            display="flex"
            flex="1"
            flexDirection="column"
            height="100vh"
            alignItems="center"
            justifyContent="center"
            sx={{
                backgroundImage: 'url(https://i.imgur.com/2bUXNNG.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }}
        >
            <ErrorModal
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                text={errorText}
            />

            <LoadingModal open={loading} /> 

            <Box
                display="flex"
                flex="1"
                flexDirection="row"
                width="90%"
                justifyContent="space-around"
                alignItems="center"
            >
                <Box
                    display="flex"
                    flex="0.4"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    width="100%"
                >
                    <Box
                        component="img"
                        sx={{
                            height: '70%', // Manteniendo el tamaño relativo
                            width: '70%',  // Manteniendo el tamaño relativo
                            marginBottom: '1%',
                            marginTop: '1%'
                        }}
                        alt="The house from the offer."
                        src="https://i.imgur.com/wE0iUm5.png"
                    />
                </Box>
                <Box
                    display="flex"
                    flex="0.6"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems='center'
                >
                    <Box
                        component="form"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width='70%' // Cambiando a porcentaje
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <TextField
                            id="email"
                            label="Email"
                            sx={{
                                marginTop: '3%',
                                bgcolor: 'white',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                                    transform: 'translate(20px, 0) scale(0.7)',
                                },
                            }}
                            {...register("email")}
                        />
                        <TextField
                            label="Contraseña"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            sx={{
                                marginTop: '3%',
                                bgcolor: 'white',
                                borderRadius: '20px',
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 'none',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                                    transform: 'translate(20px, 0) scale(0.7)',
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            {...register("password")}
                        />
                        <Box width='100%' sx={{ marginTop: "5%" }} display='flex' flexDirection='row' justifyContent='space-around' alignItems='center'>
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradiente azul
                                    borderRadius: '20px',  // Bordes redondeados
                                    width: '45%',
                                    padding: '2%',
                                    color: 'white',  // Texto blanco para contraste
                                    fontWeight: 'bold',  // Texto en negrita
                                    fontSize: '1rem', // Tamaño de fuente
                                    boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',  // Sombra suave
                                    transition: 'transform 0.2s, box-shadow 0.2s',  // Transiciones suaves para el hover
                                    '&:hover': {
                                        backgroundColor: '#1976D2',  // Color de fondo más oscuro al pasar el cursor
                                        boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',  // Sombra más intensa en hover
                                        transform: 'scale(1.05)',  // Efecto de agrandamiento
                                    },
                                }}
                            >
                                Iniciar sesión
                            </Button>
                            <Button
                                href="../register"
                                variant="contained"
                                sx={{
                                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradiente azul
                                    borderRadius: '20px',  // Bordes redondeados
                                    width: '45%',
                                    padding: '2%',
                                    color: 'white',  // Texto blanco para contraste
                                    fontWeight: 'bold',  // Texto en negrita
                                    fontSize: '1rem', // Tamaño de fuente
                                    boxShadow: '0 2px 4px 2px rgba(33, 203, 243, .3)',  // Sombra suave
                                    transition: 'transform 0.2s, box-shadow 0.2s',  // Transiciones suaves para el hover
                                    '&:hover': {
                                        backgroundColor: '#1976D2',  // Color de fondo más oscuro al pasar el cursor
                                        boxShadow: '0 4px 8px 2px rgba(33, 203, 243, .5)',  // Sombra más intensa en hover
                                        transform: 'scale(1.05)',  // Efecto de agrandamiento
                                    },
                                }}
                            >
                                Registrarse
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
