// Datos de usuarios
export const userData = {
    "julieta": {
        name: "Julieta",
        email: "julieta@gmail.com",
        goals: {
            dailyCalls: 20,
            agreements: 5,
        },

        currentDay: {
            calls: 0,
            agreements: 0,
            totalCalls: 0,
            totalAgreements: 0,
            answeredCalls: 0,
            callDurations: [],
        },

        historical: {
            lastDay: {
                calls: 17,
                agreements: 4,
                totalCalls: 17,
                totalAgreements: 4,
                answeredCalls: 12,
                avgDuration: 25.8
            },
            historicalByWeek: [
                { semana: 1, llamadas: 30, acuerdos: 7, contestadas: 20, duracionPromedio: 22.5 },
                { semana: 2, llamadas: 25, acuerdos: 5, contestadas: 18, duracionPromedio: 20.1 },
                { semana: 3, llamadas: 28, acuerdos: 6, contestadas: 21, duracionPromedio: 24.0 },
                { semana: 4, llamadas: 32, acuerdos: 8, contestadas: 25, duracionPromedio: 23.2 }
            ]
        }
    },
    "andrea": {
        name: "Andrea",
        email: "andrea@gmail.com",
        goals: {
            dailyCalls: 25,
            agreements: 6,
        },

        currentDay: {
            calls: 0,
            agreements: 0,
            totalCalls: 0,
            totalAgreements: 0,
            answeredCalls: 0,
            callDurations: [],
        },

        historical: {
            lastDay: {
                calls: 23,
                agreements: 6,
                totalCalls: 23,
                totalAgreements: 6,
                answeredCalls: 18,
                avgDuration: 22.3
            },
            historicalByWeek: [
                { semana: 1, llamadas: 40, acuerdos: 10, contestadas: 30, duracionPromedio: 21.5 },
                { semana: 2, llamadas: 35, acuerdos: 8, contestadas: 28, duracionPromedio: 19.8 },
                { semana: 3, llamadas: 38, acuerdos: 9, contestadas: 31, duracionPromedio: 22.7 },
                { semana: 4, llamadas: 36, acuerdos: 7, contestadas: 29, duracionPromedio: 20.9 }
            ]
        }
    }
};

// Usuario actual (esto será manejado por el sistema de login más adelante)
export let currentUser = "julieta";

export const getCurrentUserData = () => {
    return userData[currentUser];
};

export const updateUserData = (userId, newData) => {
    if (userData[userId]) {
        userData[userId] = { ...userData[userId], ...newData };
    }
};