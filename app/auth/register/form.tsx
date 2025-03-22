"use client";
import React, { FormEvent, useState, useEffect } from "react";
import * as z from "zod";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(8, "Password must have at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

const updateState = (
  name: string,
  value: string,
  setValues: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; name: string }>
  >,
  setErrors: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; name: string }>
  >,
) => {
  setValues((prevValues) => ({ ...prevValues, [name]: value }));
  setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
};

const handleErrors = (
  error: unknown,
  setErrors: React.Dispatch<
    React.SetStateAction<{ email: string; password: string; name: string }>
  >,
) => {
  if (error instanceof z.ZodError) {
    error.errors.forEach((err) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [err.path[0]]: err.message,
      }));
    });
  } else {
    console.error("Unexpected error:", error);
  }
};

const Form = () => {
  const [values, setValues] = useState({ email: "", password: "", name: "" });
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateState(name, value, setValues, setErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const validationResult = FormSchema.safeParse(values);
      if (!validationResult.success) {
        throw new Error(validationResult.error.errors[0].message);
      }

      const response = await fetch("/api/auth/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Compte créé avec succès !");
        window.location.href = "/auth/signin";
      } else {
        const data = await response.json();
        console.error("Erreur API :", data.message);
      }
    } catch (error) {
      handleErrors(error, setErrors);
    }
  };

  if (!isClient) {
    return null; 
  }

  const emailInputClasses = `block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
    errors.email && "border-red-600 dark:border-red-400"
  }`;

  const passwordInputClasses = `block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
    errors.password && "border-red-600 dark:border-red-400"
  }`;

  const nameInputClasses = `block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
    errors.name && "border-red-600 dark:border-red-400"
  }`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow dark:bg-gray-800"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          Inscription
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Nom d&#39;utilisateur:
          </label>
          <input
            name="name"
            className={nameInputClasses}
            type="text"
            placeholder="Entrez votre nom d'utilisateur..."
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email:
          </label>
          <input
            name="email"
            className={emailInputClasses}
            type="email"
            placeholder="Entrez votre email..."
            value={values.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Mot de passe:
          </label>
          <input
            name="password"
            className={passwordInputClasses}
            type="password"
            placeholder="Entrez votre mot de passe..."
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          S&#39;inscrire
        </button>

        <div className="flex justify-center mt-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Déjà un compte ? </span>
          <Link
            href="/auth/signin"
            className="ml-2 text-blue-600 hover:text-blue-800"
          >
            Se connecter
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Form;
