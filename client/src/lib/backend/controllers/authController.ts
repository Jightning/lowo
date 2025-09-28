import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req: NextRequest) => {
    const { email, password }: any = (await req.json());
 
    try {
        let user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ msg: 'User already exists' }, { status: 400 });
        }
        
        user = new User({ email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined.");
            return NextResponse.json({ msg: 'Server configuration error' }, { status: 500 });
        }

        const payload = { user: { id: user.id } };
        const token = await new Promise<string>((resolve, reject) => {
            jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
                if (err) reject(err);
                resolve(token as string);
            });
        });

        return NextResponse.json({ token }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req: NextRequest) => {
    const { email, password }: any = (await req.json());

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ msg: 'Invalid credentials' }, { status: 400 });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined.");
            return NextResponse.json({ msg: 'Server configuration error' }, { status: 500 });
        }

        const payload = { user: { id: user.id } };
        const token = await new Promise<string>((resolve, reject) => {
            jwt.sign(payload, jwtSecret, { expiresIn: '5h' }, (err, token) => {
                if (err) reject(err);
                resolve(token as string);
            });
        });

        return NextResponse.json({ token }, { status: 200 });
    } catch (err) {
        console.error((err as Error).message);
        return NextResponse.json({ msg: 'Server Error' }, { status: 500 });
    }
};