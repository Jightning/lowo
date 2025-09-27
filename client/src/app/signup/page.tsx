'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
// import { useAppDispatch } from '@/lib/hooks/hooks'
// import { setIsAuthenticated } from '@/lib/features/ProfileSlice'

const db = process.env.NEXT_PUBLIC_DB_ROUTE

export default function Page() {
    // Initialize the router
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        // const dispatch = useAppDispatch()
        event.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        try {
            const response = await fetch(`${db}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            console.log(response)

            // Check if the registration was successful (status code 200-299)
            if (response.ok) {
                // Parse the JSON response to get the data object
                const data = await response.json()

                // Store the token in localStorage for future use
                localStorage.setItem('token', data.token)

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
                
                // Redirect the user to their dashboard or another page
                router.push('/')
                // dispatch(setIsAuthenticated(true))
            } else {
                // If the server returns an error, notify the user
                const errorData = await response.json()
                console.log(errorData)
                setError(errorData.message || 'Registration failed. Please check your information.')
            }
        } catch (error) {
            // Handle network errors or other issues with the fetch call
            console.error('An error occurred:', error)
            setError('An error occurred during registration. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400">Sign up to start saving your snippets</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
                                    isLoading
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </div>

                        {/* Sign In Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{' '}
                                <Link href="/signin" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}