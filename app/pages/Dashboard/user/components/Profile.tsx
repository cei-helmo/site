import React from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  const userName = session?.user.name || "";
  const avatarInitials = userName.slice(0, 2).toUpperCase();

  return (
    <>
      <div>
        <div className="border-gray rounded-md border-2 p-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col  gap-4">
              <div>
                <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
                  {avatarInitials}
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h1>
                    <strong>Email :</strong>
                  </h1>
                  <input
                    type="text"
                    value={session?.user.email}
                    className="text-black dark:text-white py-2 px-3 rounded-md border-2 border-gray-500 bg-transparent focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <p>
                    <strong>Nom : </strong>
                  </p>
                  <input
                    type="text"
                    value={session?.user.name || ""}
                    className="text-black dark:text-white py-2 px-3 rounded-md border-2 border-gray-500 bg-transparent focus:outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <p>
                    <strong>Role : </strong>
                  </p>
                  <input
                    type="text"
                    value={session?.user.role}
                    className="text-black dark:text-white py-2 px-3 rounded-md border-2 border-gray-500 bg-transparent "
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
