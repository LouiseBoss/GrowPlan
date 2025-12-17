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
    const [isSignUpMode, setIsSignUpMode] = useState(false); // Växlar mellan login/signup
    const navigate = useNavigate();

    const handleAuth = async (isSignUp: boolean, e?: React.FormEvent) => {
        e?.preventDefault();
        setLoading(true);

        if (isSignUp) {
            // --- REGISTRERING ---
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // Sparas i user_metadata för snabb åtkomst
                    },
                },
            });

            if (error) {
                toast.error(`Ett fel uppstod: ${error.message}`);
            } else if (data?.user?.identities?.length === 0) {
                // Om identities är tomt betyder det att e-posten redan finns i Supabase
                toast.error("Denna e-postadress är redan registrerad. Prova att logga in.");
            } else if (data.user) {
                // Spara även i profiles-tabellen
                await supabase.from("profiles").upsert({
                    id: data.user.id,
                    full_name: fullName,
                });
                toast.success("Registrering klar! Du kan nu logga in.");
                setIsSignUpMode(false); // Växla tillbaka till inloggning
            }
        } else {
            // --- INLOGGNING ---
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
                <h2>Välkommen till GreenSpace</h2>
                <p className="auth-subtitle">
                    {isSignUpMode ? "Skapa ditt trädgårdskonto" : "Logga in på ditt konto"}
                </p>

                <form onSubmit={(e) => handleAuth(isSignUpMode, e)}>
                    {isSignUpMode && (
                        <input
                            placeholder="Ditt namn"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            disabled={loading}
                            required
                        />
                    )}
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        disabled={loading}
                        required
                    />
                    <input
                        placeholder="Lösenord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        disabled={loading}
                        required
                    />

                    <div className="auth-actions">
                        {!isSignUpMode ? (
                            <>
                                <button
                                    type="submit"
                                    disabled={loading || !email || !password}
                                    className="btn-login"
                                >
                                    {loading ? 'Loggar in...' : 'Logga in'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSignUpMode(true)}
                                    className="btn-link-toggle"
                                >
                                    Inget konto? Registrera dig här
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="submit"
                                    disabled={loading || !email || !password || !fullName}
                                    className="btn-signup"
                                >
                                    {loading ? 'Skapar konto...' : 'Skapa konto'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsSignUpMode(false)}
                                    className="btn-link-toggle"
                                >
                                    Har du redan ett konto? Logga in
                                </button>
                            </>
                        )}
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