declare global {
    namespace Express {
        export interface Request {
            accessToken?: string
            fingerprint?: string
        }
    }
}

export {}
