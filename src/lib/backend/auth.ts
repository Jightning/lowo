import { z } from "zod"
import { SignupFormSchema } from "../definitions"
import axios from "axios"
import { FormState } from "@/types"
import { createSession } from '../session'

const db = process.env.NEXT_PUBLIC_DB_ROUTE

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
    // Validate form fields
    const unValidatedFields = {
        email: formData.get('email'),
        password: formData.get('password'),
    }
    const validatedFields = SignupFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    // If any form fields are invalid, return early
    if (!validatedFields.success) {
        return {
            errors: z.flattenError(validatedFields.error).fieldErrors,
            prevData: unValidatedFields
        }
    }

    const { email, password } = validatedFields.data

    try {
        const response = await fetch(`${db}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        // Check if the registration was successful (status code 200-299)
        if (response.ok) {
            // Parse the JSON response to get the data object
            const data = await response.json()

            // Store the token in localStorage for future use
            // localStorage.setItem('token', data.token)
            createSession(data.token)

            // Initial Class
            const basic = {
                id: "basic",
                name: "Basic",
                color: "#FFF",
                icon: "",
                description: "",
                dateCreated: "2025-09-21T05:53:00.000Z",
                dateUpdated: "2025-09-21T05:53:00.000Z"
            }
            
            await axios.post(`${db}/api/categories`, JSON.stringify(basic), {
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': data.token
                },
            })
        } else {
            // If the server returns an error, notify the user
            const errorData = await response.json()
            return {
                success: false,
                errors: { registration: errorData.message || 'Registration failed. Please check your information.' },
                prevData: unValidatedFields
            }
        }
    } catch (error) {
        // Handle network errors or other issues with the fetch call
        console.error('An error occurred:', error)
        return {
            success: false,
            errors: { registration: 'An error occurred during registration. Please try again.' },
            prevData: unValidatedFields
        }
    }

    return {
        success: true
    }
}

export async function signin(state: FormState, formData: FormData): Promise<FormState> {
    const fields = {
        email: formData.get('email'),
        password: formData.get('password'),
    }

    try {
        const response = await fetch(`${db}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...fields}),
        })

        // Check if the registration was successful (status code 200-299)
        if (response.ok) {
            // Parse the JSON response to get the data object
            const data = await response.json()

            // Store the token in localStorage for future use
            // localStorage.setItem('token', data.token)
            createSession(data.token)

            // Initial Class
            const basic = {
                id: "basic",
                name: "Basic",
                color: "#FFF",
                icon: "",
                description: "",
                dateCreated: "2025-09-21T05:53:00.000Z",
                dateUpdated: "2025-09-21T05:53:00.000Z"
            }
            
            await axios.post(`${db}/api/categories`, JSON.stringify(basic), {
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': data.token
                },
            })
        } else {
            // If the server returns an error, notify the user
            const errorData = await response.json()
            return {
                success: false,
                errors: { registration: errorData.message || 'Registration failed. Please check your information.' },
                prevData: fields
            }
        }
    } catch (error) {
        // Handle network errors or other issues with the fetch call
        console.error('An error occurred:', error)
        return {
            success: false,
            errors: { registration: 'An error occurred during registration. Please try again.' },
            prevData: fields
        }
    }

    return {
        success: true
    }
}
