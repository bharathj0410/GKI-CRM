import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs";
import { SignJWT } from 'jose';

// Generate JWT token with 2-hour expiration
async function generateToken(userId: string, username: string, role: string) {
  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
  );
  
  const token = await new SignJWT({ userId, username, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h') // Token expires in 2 hours
    .sign(secret);
  
  return token;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { username, password, newPassword } = await req.json()
  const client = await clientPromise
  const db = client.db("GKI")
  const data = await db.collection("employee").find({ username }).toArray()
  
  if (data.length) {
    const hashedPassword = await bcrypt.compare(password, data[0].password);

    if (hashedPassword) {
      // Check if password reset is required
      if (data[0].requirePasswordReset && !newPassword) {
        return NextResponse.json({ 
          requirePasswordReset: true,
          message: 'Password reset required. Please set a new password.',
          userId: data[0]._id 
        }, { "status": 200 })
      }

      // If new password provided during reset
      if (data[0].requirePasswordReset && newPassword) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await db.collection("employee").updateOne(
          { _id: data[0]._id },
          { $set: { password: newHashedPassword, requirePasswordReset: false } }
        );
      }

      // Generate JWT token
      const token = await generateToken(
        data[0]._id.toString(), 
        data[0].username, 
        data[0].role
      );

      // Remove password from response
      const { password: pwd, ...userData } = data[0];
      return NextResponse.json({ 
        message: 'You have logged in successfully. Welcome back!',
        user: { ...userData, requirePasswordReset: false },
        token: token
      }, { "status": 200 })
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { "status": 401 })
    }
  } else {
    return NextResponse.json({ error: "We couldn't find an account with that username. Please check and try again." }, { "status": 404 })
  }

}
