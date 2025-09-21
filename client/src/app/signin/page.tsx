'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/router'

export default function Page() {	
	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const IP = process.env.NEXT_PUBLIC_API_URL;
		const formData = new FormData(event.currentTarget)
		const email = formData.get('email')
		const password = formData.get('password')
		
		const response = await fetch(`${IP}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		})

		console.log(response)
	}
	
	return (
		<form onSubmit={handleSubmit}>
			<input type="email" name="email" placeholder="Email" required />
			<input type="password" name="password" placeholder="Password" required />
			<button type="submit">Login</button>
		</form>
	)
}