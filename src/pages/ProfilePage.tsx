import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";
import "../assets/scss/pages/ProfilePage.scss";

const ProfilePage = () => {
    const { user, loading: authLoading, logout } = useAuth();
    const [fullName, setFullName] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user?.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
        }
    }, [user?.id, user?.user_metadata?.full_name]); // Nu är ESLint nöjd

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);

        try {
            // 1. Uppdatera Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: { full_name: fullName }
            });

            // 2. Uppdatera profiles-tabellen i databasen
            const { error: dbError } = await supabase
                .from("profiles")
                .update({ full_name: fullName })
                .eq("id", user.id);

            if (authError || dbError) {
                toast.error("Kunde inte uppdatera profilen.");
            } else {
                toast.success("Profilen är uppdaterad!");
            }
        } catch {
            // Tog bort (err) eftersom den inte användes
            toast.error("Ett oväntat fel uppstod.");
        } finally {
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
                <p>Hantera dina uppgifter i GrowPlan</p>
            </header>

            <div className="profile-card">
                <div className="avatar-section">
                    <div className="profile-avatar">
                        {fullName ? fullName.charAt(0).toUpperCase() : "?"}
                    </div>
                    <p className="user-email">{user?.email}</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="profile-form">
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