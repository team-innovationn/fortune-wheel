// Define accepted images format
export const CSVFileype = "^.+\.(xlsx|xls|csv)$";

export interface JsonData {
    [key: string]: string | number | boolean | null; // Adjust the type based on your CSV structure
}

export type WinnerType = {
    name: string,
    email: string,
    accountNumber: string,
    phoneNumber: string,
    branchName: string,
    division?: string,
    region?: string
}

export type User = {
    id: string,
    username: string,
    password: string
}

export type ErrorResponse = {
    apiPath: string,
    errorCode: string,
    errorMessage: string,
    errorTime: Date
}

export type APIResponse<T> = {
    status: boolean,
    data: T | ErrorResponse | string | any
}

export type AuthResponse = {
    email: string
};

export type Session = AuthResponse & { SESSION_EXPIRY: number };