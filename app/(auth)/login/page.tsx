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

        // Mostrar el modal de carga
        setLoading(true);

        // Espera 1 segundo antes de continuar
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
                } else if (res.status != 200) {
                    return res.json().then((data) => {
                        setErrorText(data.message || "Error desconocido en el servidor.");
                        setShowErrorModal(true);
                    });
                }
                return res.json();
            })
            .then((data) => {
                if (data.access_token) {
                    localStorage.setItem("jwtToken", data.access_token);
                    router.push('../filter');
                }
            })
            .catch((error) => {
                setErrorText("El email o la contraseña son incorrectos.");
                setShowErrorModal(true);
            })
            .finally(() => {
                // Ocultar el modal de carga cuando finalice el fetch
                setLoading(false);
            });
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
                            height: '70%',
                            width: '70%',
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
                        width='70%'
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
                                sx={{ width: '45%', height: '30%', borderRadius: '20px' }}
                            >
                                Iniciar sesión
                            </Button>
                            <Button
                                href="../register"
                                variant="contained"
                                sx={{ width: '45%', height: '30%', borderRadius: '20px' }}
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
