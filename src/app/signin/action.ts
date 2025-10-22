import { FormState } from "@/types"
import { createSession } from '@/lib/session'

const db = process.env.NEXT_PUBLIC_DB_ROUTE

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

        if (response.ok) {
            const data = await response.json()

            await createSession(data.token)
        } else {
            const errorData = await response.json()
            return {
                success: false,
                errors: { registration: errorData.message || 'Registration failed. Please check your information.' },
                prevData: fields
            }
        }
    } catch (error) {
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
