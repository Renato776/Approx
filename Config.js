const config={
    "bisect":{
        MAX_DOMAIN_INTENTS : 3000,
        MAX_BISECT_INTENTS : 10000,
        MAX_ROOT_SEARCH_INTENTS : 10000,
        gap : 1,
        exactness: Math.pow(10,-6)
    },
    "disparo lineal":{
        exactness: Math.pow(10,-6),
        gap:1
    },
    "Runge-Kutta para sistemas":{
        extra_debug: false
    },
    "adams_moulton":{
        solve:'bisect'
    }
};