import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../assets/scss/pages/AuthPage.scss";

function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (isSignUp: boolean, e?: React.FormEvent) => {
        e?.preventDefault();

        setLoading(true);

        let data;
        let error;

        if (isSignUp) {
            ({ data, error } = await supabase.auth.signUp({ email, password }));
        } else {
            ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
        }

        if (error) {
            if (error.message.includes('Invalid login credentials')) {
                toast.error("Felaktig e-postadress eller lösenord.");
            } else {
                toast.error(`Ett fel uppstod: ${error.message}`);
            }
        } else if (data.user) {
            if (isSignUp) {
                await supabase.from("profiles").upsert({
                    id: data.user.id,
                    full_name: email.split('@')[0]
                });
                toast.success("Registrering klar! Du kan nu logga in.");

            } else {
                toast.success("Välkommen tillbaka!");
                navigate("/overview");
            }
        } else if (!data.user && isSignUp) {
            toast.info("Kolla din e-post (och skräppost) för bekräftelselänk.");
        }

        setLoading(false);
    };

    const handlePasswordReset = async () => {
        if (!email) {
            toast.warn("Vänligen ange din e-postadress först.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`
        });

        if (error) {
            toast.error(`Fel vid återställning: ${error.message}`);
        } else {
            toast.info("Länk för lösenordsåterställning har skickats till din e-post.");
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <h2>Välkommen till GreenSpace</h2>

                <form onSubmit={(e) => handleAuth(false, e)}>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        disabled={loading}
                    />
                    <input
                        placeholder="Lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        disabled={loading}
                    />

                    <div className="auth-actions">
                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="btn-login"
                        >
                            {loading ? 'Loggar in...' : 'Logga in'}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleAuth(true)}
                            disabled={loading || !email || !password}
                            className="btn-signup"
                        >
                            {loading ? 'Registrerar...' : 'Registrera'}
                        </button>
                    </div>
                </form>

                <div className="reset-password-container">
                    <button
                        onClick={handlePasswordReset}
                        disabled={loading}
                        className="btn-reset-password"
                    >
                        Glömt lösenord?
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;