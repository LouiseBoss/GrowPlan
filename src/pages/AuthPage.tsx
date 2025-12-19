import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import "../assets/scss/pages/AuthPage.scss";

function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (isSignUp: boolean, e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                toast.error(`Ett fel uppstod: ${error.message}`);
            } else if (data?.user?.identities?.length === 0) {
                toast.error("Denna e-postadress är redan registrerad. Prova att logga in.");
            } else if (data.user) {
                await supabase.from("profiles").upsert({
                    id: data.user.id,
                    full_name: fullName,
                });
                toast.success("Registrering klar! Du kan nu logga in.");
                setIsSignUpMode(false);
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Invalid login credentials')) {
                    toast.error("Felaktig e-postadress eller lösenord.");
                } else {
                    toast.error(`Inloggningsfel: ${error.message}`);
                }
            } else if (data.user) {
                toast.success("Välkommen tillbaka!");
                navigate("/overview");
            }
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
                <div className="auth-header">
                    <h2>GreenSpace 🌿</h2>
                    <p className="auth-quote">
                        {isSignUpMode
                            ? "Börja din gröna resa hos oss idag."
                            : "Välkommen hem till din digitala trädgård."}
                    </p>
                </div>

                <form onSubmit={(e) => handleAuth(isSignUpMode, e)} className="auth-form">
                    {isSignUpMode && (
                        <div className="input-group">
                            <label>Namn</label>
                            <input
                                placeholder="Ditt fullständiga namn"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                type="text"
                                disabled={loading}
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>E-post</label>
                        <input
                            placeholder="din.mail@exempel.se"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Lösenord</label>
                        <input
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="auth-main-action">
                        <button
                            type="submit"
                            disabled={loading || !email || !password || (isSignUpMode && !fullName)}
                            className="plant-btn btn-primary-green"
                        >
                            {loading
                                ? (isSignUpMode ? 'Skapar konto...' : 'Loggar in...')
                                : (isSignUpMode ? 'Skapa konto' : 'Logga in')}
                        </button>
                    </div>

                    <div className="auth-secondary-actions">
                        <button
                            type="button"
                            onClick={() => setIsSignUpMode(!isSignUpMode)}
                            className="btn-toggle-mode"
                        >
                            {isSignUpMode
                                ? "Har du redan ett konto? Logga in"
                                : "Inget konto än? Registrera dig här"}
                        </button>

                        {!isSignUpMode && (
                            <button
                                type="button"
                                onClick={handlePasswordReset}
                                disabled={loading}
                                className="btn-forgot-password"
                            >
                                Glömt lösenordet?
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthPage;