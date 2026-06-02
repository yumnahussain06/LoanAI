import { cookies } from "next/headers";
import { AuthProvider } from "./auth/AuthContext";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;

  return (
    <html lang="en">
      <body>
        <AuthProvider initialToken={token}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}