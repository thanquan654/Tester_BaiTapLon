import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function POST(req: NextRequest) {
	await dbConnect()

	try {
		const { email, password, keepLoggedIn } = await req.json()

		if (!email || !password) {
			return NextResponse.json(
				{ message: 'Email and password are required' },
				{ status: 400 },
			)
		}

		const user = await User.findOne({ email })

		if (!user) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 },
			)
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return NextResponse.json(
				{ message: 'Invalid credentials' },
				{ status: 401 },
			)
		}

		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || 'your-secret-key',
			{
				expiresIn: keepLoggedIn ? '7d' : '2s',
			},
		)

		;(await cookies()).set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: keepLoggedIn && 7 * 24 * 60 * 60 * 1000,
			path: '/',
		})

		return NextResponse.json({ message: 'Logged in successfully' })
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'An error occurred', error: error.message },
			{ status: 500 },
		)
	}
}
