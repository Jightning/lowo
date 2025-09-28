'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAppDispatch } from '@/lib/hooks/hooks'
import { setIsAuthenticated } from '@/lib/features/UserSlice'
import { signin } from './action'

export default function Page() {
	const dispatch = useAppDispatch()
	const router = useRouter()
	const [state, action, pending] = useActionState(signin, undefined)

	useEffect(() => {
		if (state?.success) {
			dispatch(setIsAuthenticated(true))

			router.push("/")
		}
	}, [state, dispatch])

	return (
		<div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				{/* Header */}
				<div className="text-center">
					<h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
					<p className="text-gray-400">Sign in to your account to continue</p>
				</div>

				{/* Form */}
				<form action={action} className="mt-8 space-y-6">
					<div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-xl">
						{/* Error Message */}
						{state?.errors && (
							<div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md">
								<p className="text-red-300 text-sm">{state?.errors?.registration || "Problem logging in, please try again"}</p>
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
									defaultValue={state?.prevData?.email || ''}
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
									defaultValue={state?.prevData?.password || ''}
								/>
							</div>
						</div>

						{/* Submit Button */}
						<div className="mt-6">
							<button
								type="submit"
								disabled={pending}
								className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors ${
									pending
										? 'bg-gray-500 cursor-not-allowed'
										: 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
								}`}
							>
								{pending ? (
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