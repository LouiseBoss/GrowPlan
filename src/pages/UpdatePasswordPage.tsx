import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

function UpdatePasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("Ange ditt nya lösenord.");
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            setMessage(`Kunde inte uppdatera: ${error.message}`);
        } else {
            setMessage("Lösenordet uppdaterat! Du kan nu logga in.");
            setNewPassword(""); 
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: 30, maxWidth: 400, margin: '50px auto' }}>
            <h2>Lösenordsåterställning</h2>
            <p>{message}</p>

            {message.includes("Lösenordet uppdaterat") ? null : (
                <>
                    <input
                        placeholder="Nytt Lösenord"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0' }}
                    />
                    <button
                        onClick={handleUpdatePassword}
                        disabled={loading || newPassword.length < 6}
                        style={{ padding: '10px 20px' }}
                    >
                        {loading ? 'Uppdaterar...' : 'Uppdatera Lösenord'}
                    </button>
                </>
            )}
        </div>
    );
}

export default UpdatePasswordPage;