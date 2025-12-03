import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // Anpassa sökvägen till din klient

function AuthPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAuth = async (isSignUp: boolean) => {
        setLoading(true);
        let error;
        let data;

        if (isSignUp) {
            ({ data, error } = await supabase.auth.signUp({ email, password }));
        } else {
            ({ data, error } = await supabase.auth.signInWithPassword({ email, password }));
        }

        if (error) {
            alert(`Fel: ${error.message}`);
        } else if (data.user && isSignUp) {
            await supabase.from("profiles").upsert({
                id: data.user.id,
                full_name: email.split('@')[0] 
            });
            alert("Registrering klar! Du kan nu logga in.");
        } else if (data.user && !isSignUp) {
            alert("Inloggad!");
        } else {
            alert("Kolla din e-post (och skräppost) för bekräftelselänk.");
        }

        setLoading(false);
    };


    const handlePasswordReset = async () => {
        if (!email) {
            alert("Vänligen ange din e-postadress först.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/update-password`
        });

        if (error) {
            alert(`Fel vid återställning: ${error.message}`);
        } else {
            alert("Länk för lösenordsåterställning har skickats till din e-post.");
        }
    };

    return (
        <div style={{ padding: 30, maxWidth: 400, margin: '50px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Inloggning / Registrering</h2>
            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <input
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button
                    onClick={() => handleAuth(false)}
                    disabled={loading || !email || !password}
                    style={{ padding: '10px 20px' }}
                >
                    {loading && !email.includes('@') ? 'Loggar in...' : 'Logga in'}
                </button>
                <button
                    onClick={() => handleAuth(true)}
                    disabled={loading || !email || !password}
                    style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}
                >
                    {loading && email.includes('@') ? 'Registrerar...' : 'Registrera'}
                </button>
            </div>
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