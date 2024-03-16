declare global {
    namespace Express {
        export interface Request {
            userId?: number
            accessToken?: string
            fingerprint?: string
        }
    }
}

export {}
