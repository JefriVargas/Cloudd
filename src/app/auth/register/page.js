"use client";
import { registerUser } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const userData = {
      username: formData.get("username"),
      names: formData.get("names"),
      lastnames: formData.get("lastnames"),
      email: formData.get("email"),
      password: formData.get("password"),
      age: formData.get("age"),
      phone_number: formData.get("phone_number"),
      birthday: formData.get("birthday"),
    };

    try {
      const response = await registerUser(userData);
      console.log("Usuario registrado:", response);
      router.push("/auth/login");

    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Hubo un error en el registro. Por favor prueba con otros datos.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="names" className="block text-sm font-medium text-gray-700">Names:</label>
            <input
              type="text"
              id="names"
              name="names"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastnames" className="block text-sm font-medium text-gray-700">Last Names:</label>
            <input
              type="text"
              id="lastnames"
              name="lastnames"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday:</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
          </div>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-300">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
