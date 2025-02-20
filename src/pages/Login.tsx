import { useRegister } from "~/hooks/useQuery/useQueryaction";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CircularProgress from "@mui/material/CircularProgress";
export default function Login() {
  const { mutate } = useRegister();

  const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(12),
    email: z.string().email("Enter email"),
    password: z.string().min(4, "Password must contain at least 4 characters").max(22)
  });

  type RegisterForm = z.infer<typeof registerSchema>;

  const [Loading, Setloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (e: RegisterForm) => {
    // Setloading(true);
    // setTimeout(() => {
    //   Setloading(false);
    //   // mutate({ data });
    // }, 3000);

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
                      src="../../../public/logo/logoRegister.png"
                      alt="logo"
                    />
                    Datagaze All in one
                  </span>
                  Sign up
                </h1>
              </div>

              <div className="w-full flex-1  mt-8">
                <div className="mx-auto w-[300px]">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <input
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
                      type="email"
                      placeholder="Email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}

                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                      type="password"
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
                        {!Loading ? (
                          "Sign Up"
                        ) : (
                          <CircularProgress size={25} color="warning" />
                        )}
                      </span>
                    </button>
                  </form>

                  <p className="mt-6 text-xs text-gray-600 text-center">
                    I agree to abide by templatana's
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Terms of Service
                    </a>
                    and its
                    <a href="#" className="border-b border-gray-500 border-dotted">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
