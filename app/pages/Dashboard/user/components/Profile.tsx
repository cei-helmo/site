import React from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const{data : session} = useSession();
  return (
    <>
      <div>
        <div className="border-gray rounded-md border-2 p-3">
          <div className="flex flex-col gap-3">
            <h1><strong>Email :</strong> {session?.user.email}</h1>
            <p><strong>Nom : </strong> {session?.user.name}</p>
            <p><strong>Rôle : </strong> {session?.user.role}</p>
          </div>
        </div>
      </div>
    </>
  );
}
