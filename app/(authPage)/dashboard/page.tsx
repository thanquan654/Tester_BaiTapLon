'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
	const [user, setUser] = useState<{
		name: string
		email: string
	} | null>(null)
	const [isLoading, setLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const getUserInfo = async () => {
			setLoading(true)
			const res = await fetch('/api/user/me', {
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (res.ok) {
				const data = await res.json()
				console.log('🚀 ~ data:', data)
				setUser(data.user)
			}
			setLoading(false)
		}

		getUserInfo()
	}, [])

	const handleLogout = async () => {
		const res = await fetch('/api/auth/logout')
		if (res.ok) {
			router.push('/login')
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
				<h1 className="text-2xl font-bold text-center text-black">
					Dashboard
				</h1>
				<p className="text-center">Welcome!</p>
				<div className="bg-slate-300 rounded-md flex justify-center items-center py-2">
					{user && (
						<div>
							<p>Name: {user.name}</p>
							<p>Email: {user.email}</p>
						</div>
					)}
					{isLoading && <p>Getting user infomation ...</p>}
					{!isLoading && !user && (
						<p>Error when get user infomation</p>
					)}
				</div>
				<button
					onClick={handleLogout}
					className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
				>
					Logout
				</button>
			</div>
		</div>
	)
}
