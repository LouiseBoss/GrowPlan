import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/scss/pages/Navigation.scss';

const Navigation: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <Navbar expand="md" className="custom-app-navbar" variant="light">
            <Container fluid className="px-4">

                {/* LOGO */}
                <Navbar.Brand as={Link} to="/" className="navbar-logo">
                    <span className="logo-icon">🪴</span>
                    <span className="logo-name">GrowPlan</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto main-nav-links">

                        <Nav.Link as={Link} to="/plants" className="plants-link">
                            Växter
                        </Nav.Link>

                        {user && (
                            <>
                                <Nav.Link as={Link} to="/overview">
                                    Översikt
                                </Nav.Link>

                                <Nav.Link as={Link} to="/garden">
                                    Min Trädgård
                                </Nav.Link>

                                <Nav.Link as={Link} to="/calendar">
                                    Kalender
                                </Nav.Link>

                                <Nav.Link as={Link} to="/wishlist">
                                    Önskelista
                                </Nav.Link>

                                <Nav.Link
                                    as="button"
                                    onClick={logout}
                                    className="auth-link btn-logout"
                                >
                                    Logga ut
                                </Nav.Link>
                            </>
                        )}

                        {!user && (
                            <Nav.Link
                                as={Link}
                                to="/auth"
                                className="auth-link btn-login-signup"
                            >
                                Logga in / Skapa konto
                            </Nav.Link>
                        )}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Navigation;