import bcrypt from 'bcrypt';
import {prisma} from '../../../lib/prisma.js';

export class AuthService {
  async registerUser(email: string, passwordRaw: string, name?: string) {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordRaw, salt);

    // 3. Create the user
    return prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
      },
      // Security: We "select" only what we want to return. NEVER return the password hash!
      select: {
        id: true,
        email: true,
        name: true,
      }
    });
  }
}