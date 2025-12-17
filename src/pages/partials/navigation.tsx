import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/scss/pages/Nav.scss";

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();
    
    // Hämta första bokstaven för en liten "avatar-ikon" i menyn
    const userInitial = user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "👤";

    return (
        <Navbar expand="md" className="custom-app-navbar" variant="light" sticky="top">
            <Container fluid className="px-4">

                {/* LOGO */}
                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    <span className="logo-icon">🪴</span>
                    <span className="logo-name">GrowPlan</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-center">

                        <Nav.Link as={Link} to="/plants" className="nav-item-link">
                            Växter
                        </Nav.Link>

                        {user && (
                            <>
                                <Nav.Link as={Link} to="/overview" className="nav-item-link">
                                    Översikt
                                </Nav.Link>

                                <Nav.Link as={Link} to="/garden" className="nav-item-link">
                                    Min Trädgård
                                </Nav.Link>

                                <Nav.Link as={Link} to="/calendar" className="nav-item-link">
                                    Kalender
                                </Nav.Link>

                                <Nav.Link as={Link} to="/wishlist" className="nav-item-link">
                                    Önskelista
                                </Nav.Link>

                                {/* PROFIL-LÄNK */}
                                <Nav.Link as={Link} to="/profile" className="nav-item-link profile-nav-link">
                                    <span className="nav-avatar">{userInitial}</span>
                                    Profil
                                </Nav.Link>

                                <button
                                    onClick={logout}
                                    className="btn-logout-nav"
                                >
                                    Logga ut
                                </button>
                            </>
                        )}

                        {!user && (
                            <Nav.Link
                                as={Link}
                                to="/auth"
                                className="auth-link btn-login-signup"
                            >
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