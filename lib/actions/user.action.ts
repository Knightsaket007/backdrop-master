import Createuser from "@/app/models/CreateUser";
import { connectToDB } from "@/lib/mongodb";

interface UserData {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
}

export async function createUser(user: UserData) {
  try {
    await connectToDB();

    const existingUser = await Createuser.findOne({ clerkId: user.clerkId });
    if (existingUser) {
      console.log("User already exists");
      return existingUser;
    }

    const newUser = await Createuser.create({
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: 0, // default balance
      createdAt: Date.now(),
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDB()
    const deletedUser = await Createuser.findOneAndDelete({ clerkId });
    return deletedUser;
  } catch (err) {
    console.error("❌ Failed to delete user from DB:", err);
    throw err;
  }
}

export async function updateUser(clerkId: string, updatedData: Partial<{
  username: string;
  firstName: string;
  lastName: string;
}>) {
  try {
    await connectToDB();

    const updatedUser = await Createuser.findOneAndUpdate(
      { clerkId },
      { $set: updatedData },
      { new: true }
    );

    if (!updatedUser) {
      console.warn("User not found for update:", clerkId);
      return null;
    }

    console.log("✅ User updated successfully:", updatedUser);
    return updatedUser;
  } catch (err) {
    console.error("❌ Failed to update user in DB:", err);
    throw err;
  }
}
