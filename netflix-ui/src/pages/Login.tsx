import { useState } from "react";
import BackgroundImage from "../components/BackgroundImage"
import Header from "../components/Header"
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

type FormField = z.infer<typeof schema>

type logIn = {
    login: string;
}

const Login = ({ login }: logIn) => {

    const navigate = useNavigate();

    const [formvalues, setFormvalue] = useState<FormField>({
        email: "",
        password: "",
    });

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormField>({
        resolver: zodResolver(schema)
    });

    const onSubmit: SubmitHandler<FormField> = async () => {
        try {
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            const { email, password } = formvalues;
            await signInWithEmailAndPassword(firebaseAuth, email, password);
            // alert("User signed up successfully!");
        } catch (error) {
            {
                errors ? setError("email", {
                    message: "✨This email already use✨"
                }) :
                    setError("password", {
                        message: "✨This password wrong✨",
                    })
            }
            console.log(error);
        }
    }

    onAuthStateChanged(firebaseAuth, (currentUser) => {
        if (currentUser) navigate("/");
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormvalue({ ...formvalues, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <div className="relative overflow-hidden ">
                <BackgroundImage />
                <div className="absolute top-0 ">
                    <Header login={login} />
                    {/* <div className="flex flex-col items-center justify-center gap-3 px-10 text-center text-white mt-9"> */}
                    {/* <div className="font-extrabold px-80">
                            <span className="md:text-5xl">Unlimited movies, TV shows and more</span>
                            <span className="md:text-3xl">watch anywhere. Cancel anytime.</span>
                            <span className="md:text-2xl" >
                                Ready to watch ? Enter your email to create or restart membership.
                            </span>
                        </div> */}
                    <div className="flex flex-col gap-3 px-10 my-40 text-center text-white  mr-[460px] ml-[460px] ">
                        <form onSubmit={handleSubmit(onSubmit)}
                            className="gap-2 p-12 bg-[#000000b0] ">

                            <input {...register("email",)} type="text" placeholder="Email"
                                onChange={handleInputChange}
                                value={formvalues.email}
                                className="my-2 text-black w-[70%] h-5"
                                required
                            /> <br />
                            {errors.email && <div className="font-extrabold text-red-600 ">{errors.email.message}</div>}

                            <input {...register("password")} type="text" placeholder="Password"
                                onChange={handleInputChange}
                                value={formvalues.password}
                                className="mt-1 mb-3 text-black"
                                required
                            /> <br />
                            {errors.password && <div className="mb-5 font-extrabold text-red-600">{errors.password.message}</div>}

                            <button
                                disabled={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                                type="submit"
                                className="px-5 py-2 m-auto font-extrabold bg-red-900 rounded-lg "
                            >
                                {isSubmitting ? "Loading..." : "Log In"}
                            </button>

                        </form>
                    </div>
                    {/* </div> */}
                </div>

            </div>
        </div>
    )
}

export default Login