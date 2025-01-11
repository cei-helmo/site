import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function GestionUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users/user");
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-black dark:text-white px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="border text-black rounded-md focus:outline-none p-2 w-full sm:w-80 md:w-96 lg:w-1/2 xl:w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border p-2 text-left">ID</th>
              <th className="border p-2 text-left">Nom</th>
              <th className="border p-2 text-left">Email</th>
              <th className="border p-2 text-left">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border p-2">{user.id}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
