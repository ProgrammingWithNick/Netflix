import { useEffect } from "react";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormField = z.infer<typeof schema>;

const Signup = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormField>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormField> = async (data) => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, data.email, data.password);
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                setError("email", { message: "This email is already in use" });
            } else if (error.code === "auth/weak-password") {
                setError("password", { message: "Weak password! Try a stronger one" });
            } else {
                console.error("Signup error:", error);
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
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-black">
            <BackgroundImage />
            <div className="absolute inset-0 bg-black/60"></div>
            
            {/* Header */}
            <div className="absolute top-0 w-full">
                <Header login={isSubmitting} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col items-center w-full px-4 text-center text-white sm:px-10 md:max-w-2xl">
                <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                    Unlimited movies, TV shows, and more
                </h1>
                <h4 className="mt-2 text-lg sm:text-xl md:text-2xl">
                    Watch anywhere. Cancel anytime.
                </h4>
                <p className="mt-2 text-sm sm:text-base md:text-lg">
                    Ready to watch? Enter your email to create or restart membership.
                </p>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md p-6 mt-6 rounded-lg shadow-lg bg-black/70 backdrop-blur-md"
                >
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className="w-full h-12 p-3 mb-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    {errors.email && <p className="mb-2 text-sm text-red-500">{errors.email.message}</p>}

                    <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        className="w-full h-12 p-3 mb-3 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                    />
                    {errors.password && <p className="mb-2 text-sm text-red-500">{errors.password.message}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 text-lg font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        {isSubmitting ? "Loading..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
