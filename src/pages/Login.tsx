import { useRegister } from "~/hooks/useQuery/useQueryaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
export default function Login() {
  const { mutate, isError, isPending } = useRegister();

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(12),
    // email: z.string().email("Enter email"),
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
          <div className="bg-white rounded-xl p-5">
            <div className="mt-7 flex flex-col w-full items-center">
              <div>
                <h1 className="text-[28px]  flex items-center gap-3 flex-col font-bold">
                  <span className="flex items-center text-[25px] font-bold gap-3 mb-5">
                    <img
                      className="w-[50px] h-[50px]"
                      src="/logo/logoRegister.png"
                      alt="logo"
                    />
                    Datagaze All in one
                  </span>
                  Log in
                </h1>
              </div>

              <div className="w-full flex-1 p-3 mt-8">
                <div className="mx-auto w-[300px]">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                      value={"superadmin"}
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Username"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-500 text-sm">{errors.username.message}</p>
                    )}

                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
                      value={"superadmin"}
                      placeholder="Password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">{errors.password.message}</p>
                    )}

                    <button
                      type="submit"
                      className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <span className="ml-3">
                        {isError || isPending ? (
                          <CircularProgress size={25} color="primary" />
                        ) : (
                          "Log in"
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
