import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import "../assets/scss/pages/ProfilePage.scss";

// Importera bilderna så att Vite hittar dem korrekt
import avatar1 from "../assets/images/avatar1.png";
import avatar2 from "../assets/images/avatar2.png";
import avatar3 from "../assets/images/avatar3.png";
import avatar4 from "../assets/images/avatar4.png";
import avatar5 from "../assets/images/avatar5.png";

const avatarOptions = [
    { id: "avatar1", src: avatar1 },
    { id: "avatar2", src: avatar2 },
    { id: "avatar3", src: avatar3 },
    { id: "avatar4", src: avatar4 },
    { id: "avatar5", src: avatar5 },
];

const ProfilePage = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const [fullName, setFullName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.user_metadata) {
            setFullName(user.user_metadata.full_name || "");
            setSelectedAvatar(user.user_metadata.avatar_url || null);
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);

        try {
            // 1. Uppdatera Auth Metadata (för att det ska synas i useAuth direkt)
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: selectedAvatar
                }
            });

            // 2. Uppdatera profiles-tabellen
            const { error: dbError } = await supabase
                .from("profiles")
                .update({
                    full_name: fullName,
                    avatar_url: selectedAvatar
                })
                .eq("id", user.id);

            if (authError || dbError) {
                toast.error("Kunde inte uppdatera profilen.");
            } else {
                toast.success("Profilen är uppdaterad!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Ett oväntat fel uppstod.");
        }
        finally {
            setIsSaving(false);
        }
    };

    if (authLoading) {
        return <div className="loading-container">Laddar profil...</div>;
    }

    return (
        <div className="profile-page-container">
            <header className="page-header">
                <h1>Din Profil</h1>
                <p>Anpassa din närvaro i GrowPlan</p>
            </header>

            <div className="profile-card">
                <div className="avatar-section">
                    <div className="profile-avatar-display">
                        {selectedAvatar ? (
                            <img src={selectedAvatar} alt="Profil" />
                        ) : (
                            <div className="avatar-placeholder">
                                {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                            </div>
                        )}
                    </div>
                    <p className="user-email">{user?.email}</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="profile-form">
                    {/* AVATAR PICKER */}
                    <div className="form-group">
                        <label>Välj en visningsbild</label>
                        <div className="avatar-grid">
                            {avatarOptions.map((avatar) => (
                                <div
                                    key={avatar.id}
                                    className={`avatar-option ${selectedAvatar === avatar.src ? "selected" : ""}`}
                                    onClick={() => setSelectedAvatar(avatar.src)}
                                >
                                    <img src={avatar.src} alt={avatar.id} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">Ditt Namn</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Skriv ditt namn här..."
                            disabled={isSaving}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>E-post</label>
                        <input type="email" value={user?.email || ""} disabled className="disabled-input" />
                    </div>

                    <div className="profile-actions">
                        <button type="submit" className="btn-save" disabled={isSaving}>
                            {isSaving ? "Sparar..." : "Spara ändringar"}
                        </button>
                    </div>
                </form>

                <div className="danger-zone">
                    <button onClick={logout} className="btn-logout">
                        Logga ut
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;