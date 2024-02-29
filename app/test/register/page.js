
export default function RegisterPage() {
  return (
    <main className="flex flex-col items-center justify-center p-24">
      
      <form method="POST" action="/users" className="flex flex-col space-y-6">
        <label>Firstname: <input type="text" name="firstName" /></label>
        <label>Lastname: <input type="text" name="lastName" /></label>
        <label>Email: <input type="email" name="email" required/></label>
        <label>Password: <input type="password" name="password" required /></label>
        <label>Confirm Password: <input type="password" name="confirmPassword" required /></label>

        <label>Role: <select name="role" required>
            <option value="">--Please choose a role--</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </label>


        <button type="submit" className="bg-amber-950 text-amber-500">Create an account</button>
      </form>
    </main>
  );
}
