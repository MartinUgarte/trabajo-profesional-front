"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ErrorModal from "../ErrorModal";

type FormValues = {
    username: string;
    email: string;
    password: string;
};

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState("");

    const form = useForm<FormValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit } = form;

    const handleFormSubmit = (formData: FormValues) => {
        // Validaciones del lado del cliente
        if (!formData.username) {
            setErrorText("Debe ingresar un nombre de usuario.");
            setShowErrorModal(true);
            return;
        }
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

        setShowLoading(true);
        console.log(formData);
        fetch(`http://localhost:3000/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            }),
        })
            .then((res) => {
                setShowLoading(false);
                if (res.status === 201) {
                    router.push("../filter");
                } else {
                    // Si la respuesta no es 201, intenta obtener el mensaje de error
                    return res.json().then((data) => {
                        setErrorText(data.msg || "Error desconocido en el servidor.");
                        setShowErrorModal(true);
                    });
                }
            })
            .catch((error) => {
                // Capturar errores del lado del cliente o problemas de conexión
                setErrorText(error.message || "Error en la conexión con el servidor.");
                setShowErrorModal(true);
                setShowLoading(false);
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
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <ErrorModal
                open={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                text={errorText}
            />

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
                            height: "70%",
                            width: "70%",
                            marginBottom: "1%",
                            marginTop: "1%",
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
                    alignItems="center"
                >
                    <Box
                        component="form"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        width="70%"
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <TextField
                            id="name"
                            label="Nombre"
                            sx={{
                                marginTop: "3%",
                                bgcolor: "white",
                                borderRadius: "20px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink": {
                                    transform: "translate(20px, 0) scale(0.7)",
                                },
                            }}
                            {...register("username")}
                        />
                        <TextField
                            id="email"
                            label="Email"
                            sx={{
                                marginTop: "3%",
                                bgcolor: "white",
                                borderRadius: "20px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink": {
                                    transform: "translate(20px, 0) scale(0.7)",
                                },
                            }}
                            {...register("email")}
                        />
                        <TextField
                            label="Contraseña"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            sx={{
                                marginTop: "3%",
                                bgcolor: "white",
                                borderRadius: "20px",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        border: "none",
                                    },
                                },
                                "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink": {
                                    transform: "translate(20px, 0) scale(0.7)",
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
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', // Gradiente azul
                                borderRadius: '20px',  // Bordes redondeados
                                padding: '5px 15px',  // Tamaño del botón más pequeño
                                color: 'white',  // Texto blanco para contraste
                                fontWeight: 'bold',  // Texto en negrita
                                mt: '5%',
                                height: '30%',
                                fontSize: '1rem', // Tamaño de fuente más pequeño (puedes ajustar según prefieras)
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
    );
}
