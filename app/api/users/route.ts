import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// Middleware to verify academics role
async function verifyAcademics(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "academics") {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

// GET - List all students and faculty
export async function GET(req: Request) {
  const user = await verifyAcademics(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const users = await User.find(
      { role: { $in: ["student", "faculty"] } },
      { password: 0 } // Exclude password
    ).sort({ createdAt: -1 });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new student or faculty
export async function POST(req: Request) {
  const user = await verifyAcademics(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, password, role, regNo, mobile } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    if (!["student", "faculty"].includes(role)) {
      return NextResponse.json(
        { message: "Role must be student or faculty" },
        { status: 400 }
      );
    }

    if (role === "student" && !regNo) {
      return NextResponse.json(
        { message: "Registration number is required for students" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, ...(regNo ? [{ regNo }] : [])],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email or regNo already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      regNo: role === "student" ? regNo : undefined,
      mobile,
    });

    return NextResponse.json(
      {
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          regNo: newUser.regNo,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create user error:", error);
    return NextResponse.json(
      { message: "Failed to create user", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a user
export async function DELETE(req: Request) {
  const user = await verifyAcademics(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update user details
export async function PATCH(req: Request) {
  const user = await verifyAcademics(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { _id, name, email, mobile, regNo, course, branch, semester, session, year, fatherName, motherName, dob, admissionDate, expectedCompletionYear } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email or regNo is already taken by another user
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: _id } },
        { $or: [{ email }, ...(regNo ? [{ regNo }] : [])] }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or Registration Number already in use by another user" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      email,
      mobile,
    };

    // Only update academic fields if provided (and maybe check if role is student, but frontend should handle that visibility)
    if (regNo !== undefined) updateData.regNo = regNo;
    if (course !== undefined) updateData.course = course;
    if (branch !== undefined) updateData.branch = branch;
    if (semester !== undefined) updateData.semester = semester;
    if (session !== undefined) updateData.session = session;
    if (year !== undefined) updateData.year = year;
    if (fatherName !== undefined) updateData.fatherName = fatherName;
    if (motherName !== undefined) updateData.motherName = motherName;
    if (dob !== undefined) updateData.dob = dob;
    if (admissionDate !== undefined) updateData.admissionDate = admissionDate;
    if (expectedCompletionYear !== undefined) updateData.expectedCompletionYear = expectedCompletionYear;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Failed to update user", error: error.message },
      { status: 500 }
    );
  }
}
