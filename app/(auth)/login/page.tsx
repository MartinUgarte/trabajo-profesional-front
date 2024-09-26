"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import CustomModal from "@app/CustomModal";
// import LoadingModal from "@app/LoadingModal";
import { createTheme } from "@mui/material";
import '@fontsource/rubik';

type FormValues = {
    email: string;
    password: string;
};

const titleTheme = createTheme({
    typography: {
        fontFamily: 'Rubik'
    },
});

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [showLoading, setShowLoading] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const handleFormSubmit = (formData: FormValues) => {
        setShowLoading(true);
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
                console.log(res);
                if (res.status == 401) {
                    setErrorText("User not found");
                    setShowErrorModal(true);
                    setShowLoading(false);
                } else if (res.status == 200) {
                    setShowLoading(false);
                }
                return res.json();
            })
            .then((data) => {
                console.log("La data: ", data);
                if (data.access_token) {
                    console.log("Got data from login id: ", data);
                    localStorage.setItem("jwtToken", data.access_token);
                    router.push('../filter' )
                }
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
                backgroundSize: 'cover' // Cambio para que el degradado se dirija hacia la esquina inferior derecha
            }}

        >
            {/* {showErrorModal && (
                <CustomModal
                    open={showErrorModal}
                    onClick={() => setShowErrorModal(false)}
                    onClose={() => setShowErrorModal(false)}
                    text="Usuario o contraseña incorrectos"
                    buttonText="OK"
                />
            )}
            <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} /> */}
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
                                    border: 'none', // Eliminar el borde del TextField
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                                  transform: 'translate(20px, 0) scale(0.7)', // Ajusta la posición y el tamaño de la etiqueta
                                },
                              }}
                            {...register("email", {
                                required: "Enter you email",
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Enter a valid email",
                                },
                            })}
                            error={!!errors.email}
                            helperText={errors.email?.message}
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
                                    border: 'none', // Eliminar el borde del TextField
                                  },
                                },
                                '& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-shrink': {
                                  transform: 'translate(20px, 0) scale(0.7)', // Ajusta la posición y el tamaño de la etiqueta
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
                            {...register("password", {
                                required: "Ingresa la contraseña",
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Box width='100%' sx={{marginTop: "5%"}} display='flex' flexDirection='row' justifyContent='space-around' alignItems='center'>
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
                        sx={{ width:'45%', height: '30%', borderRadius: '20px'}}
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