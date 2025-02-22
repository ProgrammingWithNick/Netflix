import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackgroundImage from "../components/BackgroundImage";
import Header from "../components/Header";
import { onAuthStateChanged, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
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
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");

    const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormField>({
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormField> = async (data) => {
        try {
            await signInWithEmailAndPassword(firebaseAuth, data.email, data.password);
        } catch (error: any) {
            console.error("Login error:", error.code);
            if (error.code === "auth/user-not-found") {
                setError("email", { message: "No account found with this email address" });
            } else if (error.code === "auth/wrong-password") {
                setError("password", { message: "Incorrect password. Please try again." });
            } else {
                setError("email", { message: "No account found. password is incorrect." });
            }
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
            if (currentUser) navigate("/");
        });
        return () => unsubscribe();
    }, [navigate]);

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(firebaseAuth, resetEmail);
            setResetMessage("Password reset email sent! Check your inbox.");
        } catch (error: any) {
            setResetMessage("Error sending reset email. Please try again.");
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-black">
            <BackgroundImage />
            <div className="absolute top-0 w-full">
                <Header login={isSubmitting} />
                <motion.div
                    className="flex flex-col items-center justify-center w-full px-6 py-12 mx-auto mt-20 text-white bg-black rounded-lg bg-opacity-70 md:w-1/3 sm:w-2/3"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="mb-6 text-2xl font-bold text-center">LogIn</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <motion.div className="flex flex-col gap-4">
                            <motion.input
                                {...register("email")}
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 text-black rounded-md"
                                required
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            <motion.input
                                {...register("password")}
                                type="password"
                                placeholder="Password"
                                className="w-full p-3 text-black rounded-md"
                                required
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 font-bold text-white bg-red-600 rounded-md hover:bg-red-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSubmitting ? "Logging in..." : "Log In"}
                            </motion.button>
                        </motion.div>
                    </form>
                    <button onClick={() => setShowResetModal(true)} className="mt-4 text-sm text-gray-300 hover:underline">
                        Forgot Password?
                    </button>
                </motion.div>
            </div>
            
            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showResetModal && (
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="p-6 text-white bg-gray-900 rounded-lg shadow-lg w-96"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                        >
                            <h2 className="mb-4 text-xl font-bold">Reset Password</h2>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="w-full p-2 text-black rounded-md"
                            />
                            <button 
                                onClick={handlePasswordReset} 
                                className="w-full py-2 mt-4 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Send Reset Email
                            </button>
                            {resetMessage && <p className="mt-2 text-sm text-gray-300">{resetMessage}</p>}
                            <button 
                                onClick={() => setShowResetModal(false)} 
                                className="mt-4 text-sm text-red-400 hover:underline"
                            >
                                Close
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Login;
