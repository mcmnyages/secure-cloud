import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {prisma} from '../../lib/prisma.js';
export class AuthService {
  async registerUser(email: string, passwordRaw: string, name?: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passwordRaw, salt);

    return prisma.user.create({
      data: { email, password: hashedPassword, name: name ?? null },
      select: { id: true, email: true, name: true }
    });
  }

  async loginUser(email: string, passwordRaw: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return { user: { id: user.id, email: user.email, name: user.name, isVerifed:user.verified }, token };
  }
}