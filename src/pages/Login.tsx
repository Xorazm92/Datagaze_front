import { useRegister } from "~/hooks/useQuery/useQueryaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export default function Login() {
  const { mutate, isError, isPending } = useRegister();
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
      <div className="min-h-screen  text-gray-900 flex items-center justify-center">
        <div>
          <div className=" rounded-xl p-5">
            <div className="flex  justify-center gap-2  flex-col w-full items-center">
              <img className="w-[50px] h-[50px]" src="/logo/logo_data.svg" alt="logo" />
              <h4 className="text-[20px] font-500 text-white">
                Secure. Robust. Scalable.
              </h4>
              <h4 className="text-[14px] font-400 text-white">
                Effortless Data Management for Seamless Operations.
              </h4>
              <div className="w-full flex-1 p-3 mt-8">
                <div className="mx-auto w-[350px]">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-4 "
                    aria-required
                  >
                    <label className="text-white">
                      Username <span className="text-red">*</span>
                      <input
                        className="w-[100%] px-2 py-2 h-[40px] rounded-lg text-[black] font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
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
                          className="w-full px-2 py-2 h-[40px] rounded-lg text-black font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-10"
                          type={showPassword ? "text" : "password"} // Password yoki Text
                          placeholder="Enter password"
                          {...register("password", { required: "Password majburiy" })}
                        />
                        <button
                          type="button"
                          onClick={togglePassword}
                          className="absolute right-3 top-3 text-gray-600"
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
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-[#1380ED] text-gray-100 w-full h-[40px] rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <span className="ml-3">
                        {isError || isPending ? (
                          <CircularProgress size={25} color="primary" />
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
