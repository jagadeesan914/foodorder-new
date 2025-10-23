import React from 'react';
import './Footer.css';

// Import your image assets
import logo from '../../assets/logo1.webp'; // Assuming your logo is in assets
import play_store from '../../assets/play_store.png'; // Assuming Play Store icon is in assets
import app_store from '../../assets/app_store.png'; // Assuming App Store icon is in assets



const Footer = () => {
    // Helper component for rendering footer columns
    const FooterColumn = ({ title, links }) => (
        <div className="footer-col">
            <h5 className="col-title">{title}</h5>
            <ul>
                {links.map((link, index) => (
                    <li key={index}><a href="#">{link}</a></li>
                ))}
            </ul>
        </div>
    );

    return (
        <footer className="footer-section">
            <div className="footer-content">
                
                {/* 1. Logo (Using your imported logo image) */}
                <div className="footer-header">
                    <img src={logo} alt="Foodic Logo" className="footer-logo-img" /> {/* Use <img> tag */}
                </div>

                <div className="footer-links-container">
                    
                    {/* 2. FOR RESTAURANTS */}
                    <FooterColumn
                        title="For Restaurants"
                        links={["Partner With Us", "Apps For You"]}
                    />

                    {/* 3. FOR DELIVERY PARTNERS */}
                    <FooterColumn
                        title="For Delivery Partners"
                        links={["Partner With Us", "Apps For You"]}
                    />

                    {/* 4. LEARN MORE */}
                    <FooterColumn
                        title="Learn More"
                        links={["Privacy", "Security", "Terms of Service", "Help & Support", "Report a Fraud", "Blog"]}
                    />
                    
                    {/* 5. SOCIAL LINKS & App Badges */}
                    <div className="footer-col social-links-col">
                        <h5 className="col-title">Social Links</h5>
                        <div className="social-icons">
                            {/* Placeholder spans for social icons (replace with <img> if you have assets) */}
                            <span className="social-icon placeholder-linkedin" title="LinkedIn">in</span>
                            <span className="social-icon placeholder-facebook" title="Facebook">f</span>
                            <span className="social-icon placeholder-twitter" title="Twitter">t</span>
                            
                            {/* Example if you had image assets: */}
                            {/* <img src={linkedin_icon} alt="LinkedIn" className="social-icon-img" /> */}
                        </div>

                        {/* App Download Badges (Using your imported images) */}
                        <div className="app-badges">
                            <img src={app_store} alt="Download on the App Store" className="app-badge-img" />
                            <img src={play_store} alt="Get it on Google Play" className="app-badge-img" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="footer-divider"></div>

            {/* Bottom Copyright/Legal Text */}
            <div className="footer-bottom">
                <p className="copyright-text">
                    By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content Policies. All trademarks are properties of their respective owners 2023 Foodic™ Ltd. 
                </p>
            </div>
        </footer>
    );
};

export default Footer;
