// src/pages/AuthPage.jsx

import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // NY IMPORT
// import "../assets/scss/pages/AuthPage.scss"; // Behåll din styling-import

function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    // Vi behöver inte längre authError state, då toast hanterar felmeddelanden
    const navigate = useNavigate();

    const handleAuth = async (isSignUp: boolean, e?: React.FormEvent) => {
        e?.preventDefault();

        setLoading(true);
        // setAuthError(""); // Raderas

        let data;
        let error;

        if (isSignUp) {
            ({ data, error } = await supabase.auth.signUp({ email, password }));
        } else {
            ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
        }

        if (error) {
            // Visa felmeddelanden som en röd toast
            if (error.message.includes('Invalid login credentials')) {
                toast.error("Felaktig e-postadress eller lösenord.");
            } else {
                toast.error(`Ett fel uppstod: ${error.message}`);
            }
        } else if (data.user) {
            if (isSignUp) {
                // Steg efter lyckad registrering
                await supabase.from("profiles").upsert({
                    id: data.user.id,
                    full_name: email.split('@')[0]
                });
                toast.success("Registrering klar! Du kan nu logga in.");

            } else {
                // ANVÄNDARE INLOGGAD: Visa framgångsmeddelande OCH navigera
                toast.success("Välkommen tillbaka!");
                navigate("/overview");
            }
        } else if (!data.user && isSignUp) {
            // Detta hanterar Supabases "Kolla e-post för bekräftelse"
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
        <div style={{ padding: 30, maxWidth: 400, margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Inloggning / Registrering</h2>

            {/* Inget manuellt felmeddelande-element behövs längre, ToastContainer hanterar det! */}

            <form onSubmit={(e) => handleAuth(false, e)}>
                {/* ... (input fält för email och password förblir desamma) ... */}
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    disabled={loading}
                    style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }}
                />
                <input
                    placeholder="Lösenord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    disabled={loading}
                    style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                    <button
                        type="submit"
                        disabled={loading || !email || !password}
                        style={{ padding: '10px 20px' }}
                    >
                        {loading ? 'Loggar in...' : 'Logga in'}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAuth(true)}
                        disabled={loading || !email || !password}
                        style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}
                    >
                        {loading ? 'Registrerar...' : 'Registrera'}
                    </button>
                </div>
            </form>

            <div style={{ marginTop: '15px' }}>
                <button
                    onClick={handlePasswordReset}
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', padding: 0 }}
                >
                    Glömt lösenord?
                </button>
            </div>
        </div>
    );
}

export default AuthPage;