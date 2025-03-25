import { useRegister } from "~/hooks/useQuery/useQueryaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useState } from "react";

export default function Login() {
  const { mutate, isPending } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(12),
    password: z.string().min(4, "Password must contain at least 4 characters").max(22)
  });

  type RegisterForm = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (e: RegisterForm) => {
    await mutate({ data: e });
  };

  return (
    <div style={{ background: "linear-gradient(to bottom, rgb(6, 70, 246), #ffffff)" }}>
      <div className="min-h-screen text-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl p-5 md:p-6">
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <img
                className="w-12 h-12 md:w-[50px] md:h-[50px]"
                src="/logo/logo_data.svg"
                alt="logo"
              />
              <h4 className="text-lg md:text-[20px] font-medium text-white text-center">
                Secure. Robust. Scalable.
              </h4>
              <h4 className="text-sm md:text-[14px] font-normal text-white text-center">
                Effortless Data Management for Seamless Operations.
              </h4>
              <div className="w-full p-3 mt-6 md:mt-8">
                <div className="mx-auto w-full max-w-[350px]">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                    aria-required
                  >
                    <label className="text-white">
                      Username <span className="text-red-500">*</span>
                      <input
                        className="w-full px-2 py-2 h-10 rounded-lg text-black font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                        type="text"
                        placeholder="Enter username"
                        {...register("username")}
                      />
                    </label>
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}

                    <label className="text-white relative">
                      Password <span className="text-red-500">*</span>
                      <div className="relative">
                        <input
                          className="w-full px-2 py-2 h-10 rounded-lg text-black font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        >
                          {showPassword ? (
                            <AiOutlineEyeInvisible size={20} />
                          ) : (
                            <AiOutlineEye size={20} />
                          )}
                        </button>
                      </div>
                    </label>
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    <button
                      className={`${isPending && "w-full h-10  rounded-lg"} mt-5 tracking-wide font-semibold bg-[#1380ED] text-gray-100 w-full h-10 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
                      disabled={isPending}
                    >
                      <span className="ml-3 flex items-center justify-center">
                        {isPending ? (
                          <CircularProgress size={30} className="!text-[black]" />
                        ) : (
                          "Sign in"
                        )}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
