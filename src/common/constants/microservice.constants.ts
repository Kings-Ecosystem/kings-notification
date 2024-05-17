/* eslint-disable prettier/prettier */
export enum MICROSERVICES {
    NOTIFICATIONS = "NOTIFICATIONS",
    CORE = "CORE",
    STATISTICS = "STATISTICS"
}

export enum MICROSERVICE_EVENTS {
    USER_CREATION = "USER_CREATION",
    PRODUCT_THRESHOLD_REACHED = "PRODUCT_THRESHOLD_REACHED",
    STOCK_UPDATE = "STOCK_UPDATE",
    PURCHASE_MADE = "PURCHASE_MADE",
    SALES_STATS = "SALES_STATS",
    STOCK_STATS = "STOCK_STATS",
    PRODUCTS_STATS = "PRODUCTS_STATS",
    CUSTOMER_STATS = "CUSTOMER_STATS",
    EMPLOYEE_STATS = "EMPLOYEE_STATS",

    // Kingsschool events
    SEND_USER_EMAIL="SEND_USER_EMAIL"
}

export const MicroServices = {
    CORE: {
        PORT: 7000,
        NAME: 'CORE'
    },
    NOTIFICATIONS: {
        PORT: 7001,
        NAME: 'NOTIFICATIONS'
    },
    REPORTING: {
        PORT: 7002,
        NAME: 'REPORTING'
    },
    LOGGER: {
        PORT: 7003,
        NAME: 'LOGGER'
    },
    AUTHZ: {
        PORT: 7004,
        NAME: 'AUTHZ'
    },
    FILES: {
        PORT: 7005,
        NAME: 'FILES'
    }
}