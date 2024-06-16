import { useAuth } from "@/libs/contexts/auth";

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      {!isAuthenticated ? (
        "Not authenticated"
      ) : (
        <div className="text-center">
          <div>{user?.name}</div>
          <div>{user?.email}</div>
          <button className="mt-5 bg-red-600 text-white px-6 py-2" onClick={() => logout()}>Logout</button>
        </div>
      )}
    </main>
  );
}
