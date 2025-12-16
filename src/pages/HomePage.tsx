import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/scss/pages/HomePage.scss';

interface FeatureBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureBox: React.FC<FeatureBoxProps> = ({ icon, title, description }) => (
    <div className="feature-box">
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
    </div>
);

const HomePage = () => {
    return (
        <div className="home-page-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Your Personal Garden Companion</h1>
                    <p>
                        Plan, track, and nurture your garden with ease. From seasonal tasks to personal wishlists, 
                        everything you need to grow a thriving garden.
                    </p>
                    <div className="hero-actions">
                        <Link to="/auth" className="btn btn-primary-hero">Start Your Garden</Link>
                        <Link to="/plants" className="btn btn-secondary-hero">Explore Plants</Link>
                    </div>
                </div>
                <div className="hero-image-placeholder">
                    <div className="flower-graphic">🌸</div>
                </div>
            </section>

            <section className="features-section">
                <h2>Everything Your Garden Needs</h2>
                <p className="subtitle">Simple tools to help your plants thrive all year round</p>
                
                <div className="features-grid">
                    <FeatureBox 
                        icon="🗓️" 
                        title="Seasonal Calendar" 
                        description="Stay on top of your garden tasks with our monthly/annual view, covering watering, pruning, and fertilizing."
                    />
                    <FeatureBox 
                        icon="✍️" 
                        title="Personal Tasks" 
                        description="Create custom tasks specific to your needs and track important care activities for your plants."
                    />
                    <FeatureBox 
                        icon="💖" 
                        title="Plant Wishlist" 
                        description="Dream and plan your perfect garden. Save plants you want to acquire with notes and planting details."
                    />
                    <FeatureBox 
                        icon="🏠" 
                        title="Indoor & Outdoor" 
                        description="Manage both your indoor houseplants and outdoor beds with specialized care guides for every environment."
                    />
                    <FeatureBox 
                        icon="❄️" 
                        title="Winter Storage" 
                        description="Protect your plants during cold months. Plan for proper potted plant storage, mulching, and general winter care."
                    />
                    <FeatureBox 
                        icon="📚" 
                        title="Care Guides" 
                        description="Access comprehensive care information and best practices for watering, sunlight, soil, and pests."
                    />
                </div>
            </section>

            <section className="how-it-works-section">
                <h2>How It Works</h2>
                <p className="subtitle">Start your gardening journey in three simple steps</p>
                <div className="steps-grid">
                    <div className="step-card">
                        <span className="step-number">1</span>
                        <h3>Create Your Profile</h3>
                        <p>Sign up, customize your climate zone, and set up your initial garden to track everything for you.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">2</span>
                        <h3>Add Your Plants</h3>
                        <p>Build your garden inventory and add the specific plants you own, getting forecasts of tasks in the future.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-number">3</span>
                        <h3>Watch & Grow</h3>
                        <p>Follow your personalized exercise, complete tasks, and look at your garden thrive throughout the seasons.</p>
                    </div>
                </div>
            </section>
            
        </div>
    );
};

export default HomePage;