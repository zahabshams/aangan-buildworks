// Session boundary: auth is an httpOnly cookie the backend owns; the frontend's one
// duty is wiping the react-query cache so one account's data never renders for the next.
import { queryClient } from "@/lib/queryClient";
import { apiPost } from "@/lib/api";

// Call after every successful login/signup.
export function beginSession(): void {
  queryClient.clear();
}

// Call from every sign-out control; clearing the cache prevents stale leads between sessions.
export async function endSession(): Promise<void> {
  try {
    await apiPost<void>("/auth/logout");
  } finally {
    queryClient.clear();
  }
}
