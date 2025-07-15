
export const EnvConfiguration = ()  => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGODB || 'Sin DB',
    port: process.env.PORT || 3002,
    defaultLimit: process.env.DEFAULT_LIMIT || 2
});

//Lo de arriba es equivalente a lo de abajop :D
/*
const envfb = () => {
    return {

    }
} */