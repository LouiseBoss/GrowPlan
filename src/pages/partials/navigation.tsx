import React, { useState } from 'react'; // Importera useState
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/scss/pages/Nav.scss";

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();

    const [expanded, setExpanded] = useState(false);

    const avatarUrl = user?.user_metadata?.avatar_url;
    const fullName = user?.user_metadata?.full_name;
    const userInitial = fullName ? fullName.charAt(0).toUpperCase() : "?";

    const closeMenu = () => setExpanded(false);

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    return (
        <Navbar
            expand="md"
            className="custom-app-navbar"
            variant="light"
            sticky="top"
            expanded={expanded}
            onToggle={(nextExpanded) => setExpanded(nextExpanded)}
        >
            <Container fluid className="px-4">

                <Navbar.Brand as={Link} to="/" className="navbar-logo" onClick={closeMenu}>
                    <span className="logo-icon">🪴</span>
                    <span className="logo-name">GrowPlan</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center">

                        <Nav.Link as={Link} to="/plants" className="nav-item-link" onClick={closeMenu}>
                            Växter
                        </Nav.Link>

                        {user && (
                            <>
                                <Nav.Link as={Link} to="/overview" className="nav-item-link" onClick={closeMenu}>
                                    Översikt
                                </Nav.Link>

                                <Nav.Link as={Link} to="/garden" className="nav-item-link" onClick={closeMenu}>
                                    Min Trädgård
                                </Nav.Link>

                                <Nav.Link as={Link} to="/calendar" className="nav-item-link" onClick={closeMenu}>
                                    Kalender
                                </Nav.Link>

                                <Nav.Link as={Link} to="/wishlist" className="nav-item-link" onClick={closeMenu}>
                                    Önskelista
                                </Nav.Link>

                                <Nav.Link as={Link} to="/profile" className="nav-item-link profile-nav-link" onClick={closeMenu}>
                                    <div className="nav-avatar-wrapper">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profil" className="nav-avatar-img" />
                                        ) : (
                                            <span className="nav-avatar-initial">{userInitial}</span>
                                        )}
                                    </div>
                                    Profil
                                </Nav.Link>

                                <button onClick={handleLogout} className="btn-logout-nav">
                                    Logga ut
                                </button>
                            </>
                        )}

                        {!user && (
                            <Nav.Link as={Link} to="/auth" className="auth-link btn-login-signup" onClick={closeMenu}>
                                Logga in
                            </Nav.Link>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;