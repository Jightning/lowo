import { NextResponse } from "next/server"

export enum StatusType {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed'
}

export enum SnippetType {
    TEXT = 'text',
    CODE = 'code',
    IMAGE = 'image'
}

export interface Snippet {
    // id must be in the format of mongoose.Types.ObjectId
    id: string,
    title: string,
    categoryId: string | null,
    content: {
        type: SnippetType,
        content: string,
        language?: string
    },
    tags?: string[],
    dateCreated: string,
    dateUpdated: string
}
export interface SnippetsState {
    snippetsData: Snippet[],
    status: StatusType,
    error: string | null
}

export interface Category {
    // id must be in the format of mongoose.Types.ObjectId
    id: string,
    name: string,
    color: string,
    icon?: string,

    description?: string,
    dateCreated: string,
    dateUpdated: string
}

export interface CategoriesState {
    categoriesData: Category[],
    status: StatusType,
    error: string | null
} 

export interface User {
    id: string,
    user: string,
}

export interface UserState {
    userData: User,
    isAuthenticated: boolean
    status: StatusType,
    error: string | null
}

export type FormState =
| 	{	
		errors?: {
			name?: string[]
			email?: string[]
			password?: string[]
			registration?: string
		}
		message?: string,
        success?: boolean,
        prevData?: any
	}
| undefined


export type AuthResult = {
	success: true;
	user: any;
} | {
	success: false;
	response: NextResponse;
};

export interface JwtPayload {
    user: {
        id: string
    }
}