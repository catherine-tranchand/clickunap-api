
export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center p-24">
      
      <form method="POST" action="/auth/login" className="flex flex-col space-y-6">
        <label>Email: <input type="email" name="email" required/></label>
        <label>Password: <input type="password" name="password" required /></label>

        <button type="submit" className="bg-amber-950 text-amber-500">LOGIN</button>
      </form>
    </main>
  );
}
