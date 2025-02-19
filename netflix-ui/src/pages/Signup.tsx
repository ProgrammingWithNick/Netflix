import { useEffect } from "react";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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
            if (currentUser) navigate("/");
        });
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
            <BackgroundImage />
            <div className="absolute inset-0 bg-black/60"></div>
            <Header login={isSubmitting} />
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="z-10 flex flex-col items-center w-full px-4 text-center text-white sm:px-10 md:max-w-2xl"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-3xl font-bold text-transparent  sm:text-5xl md:text-6xl bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text"
                >
                    Unlimited movies, TV shows, and more
                </motion.h1>
                <motion.h4
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-4 text-xl font-medium sm:text-2xl md:text-3xl"
                >
                    Watch anywhere. Cancel anytime.
                </motion.h4>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="mt-4 text-lg sm:text-xl md:text-2xl"
                >
                    Ready to watch? Enter your email to create or restart membership.
                </motion.p>

                <motion.form
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md p-8 mt-8 border rounded-lg shadow-2xl bg-black/80 backdrop-blur-lg border-white/10"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div>
                            <input {...register("email")} type="email" placeholder="Email" className="w-full px-4 py-3 text-lg text-white transition-all duration-300 rounded-md bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500" required />
                            {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-red-500">{errors.email.message}</motion.p>}
                        </div>
                        <div>
                            <input {...register("password")} type="password" placeholder="Password" className="w-full px-4 py-3 text-lg text-white transition-all duration-300 rounded-md bg-white/10 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500" required />
                            {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-sm text-red-500">{errors.password.message}</motion.p>}
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={isSubmitting} className="w-full px-6 py-3 text-lg font-bold text-white transition-all duration-300 rounded-md bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">{isSubmitting ? "Loading..." : "Sign Up"}</motion.button>
                    </motion.div>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default Signup;
