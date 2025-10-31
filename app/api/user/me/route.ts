import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(req: NextRequest) {
	try {
		dbConnect()
		const token = (await cookies()).get('token')?.value

		if (!token) {
			return NextResponse.json(
				{ message: 'Unauthorized: No token provided' },
				{ status: 401 },
			)
		}

		let decoded
		try {
			decoded = jwt.verify(token, JWT_SECRET)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			;(await cookies()).set('token', '')

			return NextResponse.json(
				{ message: 'Unauthorized: Invalid token' },
				{ status: 401 },
			)
		}

		const user = await User.findById(
			typeof decoded === 'object' && decoded !== null
				? decoded.userId
				: undefined,
		).select('-password')

		if (!user) {
			return NextResponse.json(
				{ message: 'User not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ user }, { status: 200 })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'An error occurred', error: error.message },
			{ status: 500 },
		)
	}
}
