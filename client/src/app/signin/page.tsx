'use client'

import { FormEvent } from 'react'
// For the App Router, useRouter is imported from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function Page() {
	// Initialize the router
	const router = useRouter()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

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
				console.log(JSON.stringify(data))

				// Store the token in localStorage for future use
				localStorage.setItem('token', data)
				console.log(localStorage.getItem('token'))

				// Redirect the user to their dashboard or another page
				router.push('/')
			} else {
				// If the server returns an error, notify the user
				alert('Login failed. Please check your credentials.')
			}
		} catch (error) {
			// Handle network errors or other issues with the fetch call
			console.error('An error occurred:', error)
			alert('An error occurred during login. Please try again later.')
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input type="email" name="email" placeholder="Email" required />
			<input type="password" name="password" placeholder="Password" required />
			<button type="submit">Login</button>
		</form>
	)
}