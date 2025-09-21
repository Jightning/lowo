'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useDispatch } from 'react-redux'

export default function Page() {
	// Initialize the router
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsLoading(true)
		setError('')

		const formData = new FormData(event.currentTarget)
		const email = formData.get('email')
		const password = formData.get('password')

		try {
			const response = await fetch(`http://3.141.114.4:5000/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			// Check if the login was successful (status code 200-299)
			if (response.ok) {
				// Parse the JSON response to get the data object
				const data = await response.json()

				// Store the token in localStorage for future use
				localStorage.setItem('token', data.token)

				// Redirect the user to their dashboard or another page
				router.push('/')
			} else {
				// If the server returns an error, notify the user
				const errorData = await response.json()
				setError(errorData.message || 'Login failed. Please check your credentials.')
			}
		} catch (error) {
			// Handle network errors or other issues with the fetch call
			console.error('An error occurred:', error)
			setError('An error occurred during login. Please try again later.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
					<p className="text-gray-400">Sign in to your account to continue</p>
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
									placeholder="Enter your password"
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
										Signing in...
									</div>
								) : (
									'Sign In'
								)}
							</button>
						</div>

						{/* Sign Up Link */}
						<div className="mt-6 text-center">
							<p className="text-gray-400">
								Don't have an account?{' '}
								<Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
									Sign up here
								</Link>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}