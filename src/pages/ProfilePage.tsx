import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import { IoPersonOutline, IoMailOutline, IoCameraOutline, IoLogOutOutline } from "react-icons/io5";
import "../assets/scss/pages/ProfilePage.scss";

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
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName, avatar_url: selectedAvatar }
            });

            const { error: dbError } = await supabase
                .from("profiles")
                .update({ full_name: fullName, avatar_url: selectedAvatar })
                .eq("id", user.id);

            if (authError || dbError) throw new Error();
            toast.success("Profilen är uppdaterad!");
        } catch (err) {
            console.error("Fel vid radering:", err);
            toast.error("Kunde inte uppdatera profilen.");
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading) return <div className="loading-state">Laddar profil...</div>;

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container">
                <header className="profile-header">
                    <h1>Din Profil</h1>
                    <p>Hantera ditt konto och din trädgårds-persona</p>
                </header>

                <div className="profile-main-card">
                    <div className="avatar-hero">
                        <div className="current-avatar-circle">
                            {selectedAvatar ? (
                                <img src={selectedAvatar} alt="Profil" />
                            ) : (
                                <span className="initials">{fullName.charAt(0) || "?"}</span>
                            )}
                            <div className="camera-badge"><IoCameraOutline /></div>
                        </div>
                        <h3>{fullName || "Ditt Namn"}</h3>
                        <span className="email-tag">{user?.email}</span>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="form-section">
                            <label className="section-label">Välj profilbild</label>
                            <div className="avatar-selection-grid">
                                {avatarOptions.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        type="button"
                                        className={`avatar-btn ${selectedAvatar === avatar.src ? "active" : ""}`}
                                        onClick={() => setSelectedAvatar(avatar.src)}
                                    >
                                        <img src={avatar.src} alt="Välj avatar" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="input-group">
                            <label><IoPersonOutline /> Fullständigt namn</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="T.ex. Anna Andersson"
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label><IoMailOutline /> E-post (kan ej ändras)</label>
                            <input type="email" value={user?.email || ""} disabled className="read-only" />
                        </div>

                        <button type="submit" className="save-button" disabled={isSaving}>
                            {isSaving ? "Sparar..." : "Spara ändringar"}
                        </button>
                    </form>

                    <div className="profile-footer">
                        <button onClick={logout} className="logout-link">
                            <IoLogOutOutline /> Logga ut från GrowPlan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;