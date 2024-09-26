"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
// import CustomModal from 'app/CustomModal';
// import LoadingModal from 'app/LoadingModal';


type FormValues = {
    username: string;
    email: string;
    password: string;
};

type ResponseError = {
    msg: string
}

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState('');

    const form = useForm<FormValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const handleFormSubmit = (formData: FormValues) => {
        setShowLoading(true);
        fetch(`http://localhost:3000/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: formData.username,
                email: formData.email,
                password: formData.password
            })
        })
            .then((res) => {
                setShowLoading(false)
                if (res.status == 201) {
                    //router.push('../events');
                }
                return res.json()
            })
            .then((data) => {
                console.log('Data: ', data)
                router.push("../filter");
            })
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    function setError(newError: any) {
        throw new Error("Function not implemented.");
    }

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
                            id="name"
                            label="Nombre"
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
                            {...register("username", {
                                required: "Enter your username",
                            })}
                            error={!!errors.username}
                            helperText={errors.username?.message}
                        />
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
                                required: "Ingrese su email",
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
                                required: "Enter your password",
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ marginTop: '5%', height: '30%', borderRadius: '20px' }}
                        >
                            Registrarse
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}