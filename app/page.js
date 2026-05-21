"use client"
import { useActionState } from "react";
import { AlertCircle } from "lucide-react";

//Server-Action
import { loginAction } from "@/app/actions/loginAction"

//Components
import PasswordInput from "@/components/PasswordInput";
import SubmitButton from "@/components/SubmitButton";
import FormInput from "@/components/FormInput";

const initialState = {
  message: "",
  fieldErrors: { phone: "", password: "" },
  values: { phone: "", password: "" },
};

export default function Login() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  const handleTitleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Enter" || e.key === "NumpadEnter")
    ) {
      e.preventDefault();
      e.currentTarget.form.requestSubmit();
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      {/* Left Side: Hero / Brand Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-cover bg-center mix-blend-normal" style={{ backgroundImage: "url('/loginPageImage.png')", }}>
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full backdrop-blur-[5px]"></div>
        </div>
        <div className="relative z-10 w-full flex flex-col justify-center px-16 text-gray-900 dark:text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined select-none">medical_services</span>
            </div>
            <span className="text-2xl font-bold tracking-tight">MedCore HMS</span>
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-white">
            Your Health <br />
            <span className="text-blue-600">Secured</span>
          </h1>
          <div className="mt-12 flex items-center gap-4 bg-white/50 dark:bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/50 w-fit">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                D1
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                D2
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                +50
              </div>
            </div>
            <span className="text-sm font-medium">Trusted by leading medical professionals</span>
          </div>
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side: Authentication Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md">

          {/* Error */}
          {state.message && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                {state.message}
              </p>
            </div>
          )}

          {/* form Input */}
          <form action={formAction} onKeyDown={handleTitleKeyDown} className="space-y-6">
            {/* Telephone number Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <FormInput
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="01XXX-XXXXXX"
                  defaultValue={state.values.phone}
                  disabled={pending}
                  error={state.fieldErrors.phone}
                />
              </div>
              {state.fieldErrors.phone && (
                <p className="mt-1.5 text-sm text-red-500">
                  {state.fieldErrors.phone}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <PasswordInput
                placeholder="••••••••"
                error={state.fieldErrors.password}
                name="password"
                disabled={pending}
                defaultValue={state.values.password}
                required
              />
            </div>

            {/* <div className="flex items-center">
                  <input
                    className="h-4 w-4 text-blue-600 focus:ring-blue-600 border-gray-300 dark:border-gray-700 rounded transition-all"
                    id="remember"
                    type="checkbox"
                  />
                  <label className="ml-2 block text-sm text-gray-600 dark:text-gray-400" htmlFor="remember">
                    Remember me for 30 days
                  </label>
                </div> */}
            <SubmitButton />
          </form>
        </div>
      </div>
    </div>
  );
}



