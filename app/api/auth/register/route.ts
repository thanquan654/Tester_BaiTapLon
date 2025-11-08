import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect' // Import hàm kết nối DB
import User from '@/models/User' // Import User model

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
	await dbConnect()

	try {
		const { name, email, password } = await req.json()

		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: 'All fields are required' },
				{ status: 400 },
			)
		}

		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ message: 'Invalid email format' },
				{ status: 400 },
			)
		}

		// Kiểm tra xem user đã tồn tại trong DB chưa
		const userExists = await User.findOne({ email })

		if (userExists) {
			return NextResponse.json(
				{ message: 'User already exists' },
				{ status: 400 },
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)

		// Tạo user mới và lưu vào DB
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		})

		await newUser.save()

		return NextResponse.json(
			{ message: 'User registered successfully' },
			{ status: 201 },
		)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		return NextResponse.json(
			{ message: 'An error occurred', error: error.message },
			{ status: 500 },
		)
	}
}
