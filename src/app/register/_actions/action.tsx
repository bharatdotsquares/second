"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { redirect } from "next/navigation";
export const register = async (prevState: string | undefined, formData: FormData) => {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const parsedCredentials = z
        .object({ email: z.string().email().trim(), password: z.string().min(6) })
        .safeParse(data);

    if (!parsedCredentials.success) {
        return {
            errors: parsedCredentials.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { email, password } = data;

    await connectDB();
    const userFound = await User.findOne({ email });
    if (userFound) {
        return {
            errors: [{ email: 'Email Already exists' }],
            message: 'Email Already exists',
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        email,
        password: hashedPassword,
    });
    
    const savedUser = await user.save();
    
    redirect("/login")
};
