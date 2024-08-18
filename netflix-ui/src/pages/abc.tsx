// AuthForm.tsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase";
// import { auth } from "../utils/firebase";

const AuthForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await createUserWithEmailAndPassword(firebaseAuth,email, password);
            alert('User signed up successfully!');
        } catch (error) {
            setError(error.message);
            console.log("hii");
            
        }
    };

    const handleSignIn = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(firebaseAuth,email, password);
            alert('User signed in successfully!');
        } catch (error) {
            setError(error.message);
            console.log("bbb");
            
        }
    };

    return (
        <div>
            <h2>Authentication Form</h2>
            <form onSubmit={handleSignIn}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Sign In</button>
                <button type="button" onClick={handleSignUp}>Sign Up</button>
            </form>
        </div>
    );
};

export default AuthForm;
