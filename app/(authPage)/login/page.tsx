'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [keepLoggedIn, setKeepLoggedIn] = useState(false)
	const [errors, setErrors] = useState({ email: '', password: '', form: '' })
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const newErrors = { email: '', password: '', form: '' }

		if (!email) {
			newErrors.email = 'Email is required.'
		} else if (!/\S+@\S+\.\S+/.test(email)) {
			newErrors.email = 'Email address is invalid.'
		}

		if (!password) {
			newErrors.password = 'Password is required.'
		}

		if (newErrors.email || newErrors.password) {
			setErrors(newErrors)
			return
		}

		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password, keepLoggedIn }),
		})

		if (res.ok) {
			router.push('/dashboard')
		} else {
			const data = await res.json()
			setErrors({ ...newErrors, form: data.message })
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-slate-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center text-black">
					Login
				</h1>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							type="text"
							value={email}
							onChange={(e) => {
								setEmail(e.target.value)
								if (errors.email)
									setErrors({ ...errors, email: '' })
							}}
							className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
						/>
						{errors.email && (
							<p className="text-sm text-red-500">
								{errors.email}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value)
								if (errors.password)
									setErrors({ ...errors, password: '' })
							}}
							className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
						/>
						{errors.password && (
							<p className="text-sm text-red-500">
								{errors.password}
							</p>
						)}
					</div>
					<div className="flex items-center">
						<input
							id="keepLoggedIn"
							type="checkbox"
							checked={keepLoggedIn}
							onChange={(e) => setKeepLoggedIn(e.target.checked)}
							className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
						/>
						<label
							htmlFor="keepLoggedIn"
							className="block ml-2 text-sm text-gray-900"
						>
							Keep me logged in
						</label>
					</div>
					{errors.form && (
						<p className="text-sm text-red-500">{errors.form}</p>
					)}
					<button
						type="submit"
						className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Login
					</button>
				</form>
				<p className="text-sm text-center text-gray-600">
					Don&apos;t have an account?{' '}
					<Link
						href="/register"
						className="font-medium text-indigo-600 hover:text-indigo-500"
					>
						Register
					</Link>
				</p>
			</div>
		</div>
	)
}
