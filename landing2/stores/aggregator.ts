import {PrismaClient} from "@prisma/client";

export const isServer = typeof window === "undefined";


let db: PrismaClient = null;

export function getDb() {
    if (typeof window !== "undefined") {
        return null;
    }
    if (db === null) {
        db = new PrismaClient({
            //log: ['query', 'info', `warn`, `error`],
        })

    }
    return db;
}

