import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    subject: yup.string().required(),
    message: yup.string().required().max(500),
  })
  .required();

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async function (data) {
    const res = await fetch("/api/sendgrid", {
      body: JSON.stringify({
        email: data.email,
        fullname: data.name,
        subject: data.subject,
        message: data.message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const { error } = await res.json();
    if (error) {
      setIsError(true);
      console.log(error);
      return;
    }
    setIsSuccess(true);
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      action="#"
      method="POST"
      className="mt-3 md:mt-4 lg:mt-9 grid grid-cols-1 gap-y-6 sm:gap-x-8 text-white"
    >
      <div className="col-span-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            autoComplete="given-name"
            {...register("name")}
            className={
              "block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md text-black" +
              `${errors.name ? " border-red-500 border-2" : ""}`
            }
          />
          <p className="text-sm text-red-500">{errors.name?.message}</p>
        </div>
      </div>
      <div className="col-span-2">
        <label htmlFor="email" className="block text-sm font-medium ">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={
              "block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md text-black" +
              `${errors.email ? " border-red-500 border-2" : ""}`
            }
          />
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        </div>
      </div>

      <div className="col-span-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Subject
        </label>
        <div className="mt-1">
          <input
            id="subject"
            name="subject"
            type="text"
            autoComplete="email"
            {...register("subject")}
            className={
              "block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md text-black" +
              `${errors.subject ? " border-red-500 border-2" : ""}`
            }
          />
          <p className="text-sm text-red-500">{errors.subject?.message}</p>
        </div>
      </div>

      <div className="col-span-2">
        <div className="flex justify-between">
          <label
            htmlFor="how-can-we-help"
            className="block text-sm font-medium "
          >
            How can I help you?
          </label>
          <span
            id="how-can-we-help-description"
            className="text-sm text-gray-500"
          >
            Max. 500 characters
          </span>
        </div>
        <div className="mt-1">
          <textarea
            id="how-can-we-help"
            name="how-can-we-help"
            aria-describedby="how-can-we-help-description"
            // rows={4}
            {...register("message")}
            className={
              "block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-md text-black" +
              `${errors.message ? " border-red-500 border-2" : ""}`
            }
            defaultValue={""}
          />
          <p className="text-sm text-red-500">{errors.message?.message}</p>
        </div>
      </div>

      <div className="text-right col-span-2 mb-4 md:mb-0 flex items-center justify-end">
        {isSuccess && (
          <div className="mr-10  text-lg">
            <p>Message successfully sent!</p>
          </div>
        )}
        {isError && (
          <div className="mr-3 text-red-500 text-lg">
            <p>Something went wrong!</p>
          </div>
        )}
        <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2">
          Submit
        </button>
      </div>
    </form>
  );
}
