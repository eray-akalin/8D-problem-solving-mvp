import React from 'react';
import { IxButton } from '@siemens/ix-react';
import '../pages/LandingPage.css';

export default function LandingPage({ onStart, isVisible }) {
    return (
        <div className={`landing-container ${!isVisible ? 'slide-up' : ''}`}>
            <div className="landing-content">
                <img
                    src="/Siemens-logo.svg.png"
                    alt="Siemens Logo"
                    className="landing-logo"
                />

                <h1 className="landing-title">
                    8D Problem Çözme <br />
                    <span>Platformu</span>
                </h1>

                <p className="landing-subtitle">
                    Bu prototip, endüstriyel problemleri analiz etmenize, kök nedenleri tespit etmenize ve
                    kalıcı çözümler üretmenize yardım eder.
                </p>


                <IxButton
                    variant="primary"
                    size="lg" // Büyük
                    onClick={onStart}
                    style={{ padding: '0 40px', fontSize: '18px' }}
                >
                    Devam Etmek İçin Tıklayın
                </IxButton>

                <div style={{ marginTop: '50px', bottom: '30px', fontSize: '12px', color: '#555' }}>
                    Built by Eray Akalın.
                </div>
            </div>
        </div>
    );
}