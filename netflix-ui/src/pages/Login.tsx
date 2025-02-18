import { useEffect } from "react";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type FormField = z.infer<typeof schema>;

const Login = () => {
    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormField>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormField> = async (data) => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                setError("email", { message: "No account found with this email address" });
            } else if (error.code === "auth/wrong-password") {
                setError("password", { message: "Incorrect password. Please try again." });
            } else {
                console.error("Login error:", error);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) navigate("/"); // Navigate to home if logged in
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black">
            <BackgroundImage />
            <div className="absolute top-0 w-full">
                <Header login={isSubmitting} />
                <div className="flex flex-col items-center justify-center w-full px-6 py-12 mx-auto text-white bg-black rounded-lg bg-opacity-70 md:w-1/3 sm:w-2/3">
                    <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="flex flex-col gap-4">
                            <input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 text-black rounded-md"
                                required
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            <input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 text-black rounded-md"
                                required
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
