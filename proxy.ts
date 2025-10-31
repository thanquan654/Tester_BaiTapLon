import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(req: NextRequest) {
	const token = req.cookies.get('token')?.value

	if (!token) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	try {
		const secret = new TextEncoder().encode('your-secret-key')
		await jwtVerify(token, secret)
		return NextResponse.next()
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return NextResponse.redirect(new URL('/login', req.url))
	}
}

export const config = {
	matcher: '/dashboard/:path*',
}
