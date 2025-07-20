import { NextRequest } from "next/server";
import { UserController } from "@/controllers/users.controller"; // Adjust path

// Define params type for route handlers
interface UserRouteParams {
  params: {
    id: string;
  };
}

/**
 * Handles GET requests to retrieve a single user by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the user ID.
 * @returns A JSON response with user data or an error.
 */
export async function GET(request: NextRequest, { params }: UserRouteParams) {
  return UserController.getUserById(params.id);
}

/**
 * Handles PUT requests to update an existing user by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the user ID.
 * @returns A JSON response with the updated user data or an error.
 */
export async function PUT(request: NextRequest, { params }: UserRouteParams) {
  try {
    const body = await request.json();
    return UserController.updateUser(params.id, body);
  } catch (error) {
    console.error(
      `Failed to parse request body for user update (ID: ${params.id}):`,
      error
    );
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Handles DELETE requests to delete a user by ID.
 * @param request The NextRequest object.
 * @param params The route parameters containing the user ID.
 * @returns A JSON response indicating success or an error.
 */
export async function DELETE(
  request: NextRequest,
  { params }: UserRouteParams
) {
  return UserController.deleteUser(params.id);
}
