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
            }
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
            }
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