export const property_types = [
    {
        value: "Departamento",
        label: "Departamento",
    },
    {
        value: "PH",
        label: "PH",
    },
    {
        value: "Casa",
        label: "Casa",
    },
];

export const currencies = [
    {
        value: "ARS",
        label: "ARS",
    },
    {
        value: "USD",
        label: "USD",
    },
]

export const subtes_imgs = {
    "A": "https://emova.com.ar/wp-content/uploads/2021/11/past-a-60.png",
    "B": "https://emova.com.ar/wp-content/uploads/2021/11/past-b-60.png",
    "C": "https://emova.com.ar/wp-content/uploads/2021/11/past-c-60.png",
    "D": "https://emova.com.ar/wp-content/uploads/2021/11/past-d-60.png",
    "E": "https://emova.com.ar/wp-content/uploads/2021/11/past-e-60.png",
    "H": "https://emova.com.ar/wp-content/uploads/2021/11/past-h-60.png",
}

export type EstacionCercana = {
    estacion: string;
    linea: string;
    distancia: number;
};
  
export type Recommendation = {
    id: string;
    tipo_propiedad: string;
    m2: number;
    ambientes: number;
    cochera: boolean;
    precio: string;
    tipo_moneda: string;
    alquiler: boolean;
    link: string;
    direccion: string;
    expensas: string;
    tipo_moneda_expensas: string;
    estacion_cercana: EstacionCercana[];
};