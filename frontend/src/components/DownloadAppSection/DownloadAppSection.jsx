import React from 'react';
import './DownloadAppSection.css';
// 1. YOUR REQUIRED IMPORTS
import AppStore from '../../assets/app_store.png';
import PlayStore from '../../assets/play_store.png';

// Import other assets you might need (QR code, phone frame, etc.)
// import QRCodeImage from '../../assets/qr_code.png';

const DownloadAppSection = () => {
    return (
        <section className='download-app-section'>
            <div className='download-app-content'>
                
                {/* LEFT COLUMN: Text and Store Buttons */}
                <div className='app-text-column'>
                    <h1>Download the app now!</h1>
                    <p>Experience seamless online ordering only on the Gofood app</p>
                    
                    <div className='store-buttons'>
                        {/* 2. USING THE IMPORTED IMAGES */}
                        <img 
                            src={PlayStore} 
                            alt="Get it on Google Play" 
                            className="store-badge google" 
                        />
                        <img 
                            src={AppStore} 
                            alt="Download on the App Store" 
                            className="store-badge apple" 
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: Phone Mockup and QR Code */}
                <div className='app-visual-column'>
                    <div className='phone-frame'> 
                        <div className='qr-code-content'>
                            <p>Scan the QR code to download the app</p>
                            
                            {/* You would use your QR code image here */}
                            <div className='qr-image-placeholder'>QR Code</div> 
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default DownloadAppSection;