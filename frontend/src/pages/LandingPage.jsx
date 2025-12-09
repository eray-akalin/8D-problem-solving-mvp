import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IxButton } from '@siemens/ix-react';
import '../pages/LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('hasSeenIntro')) {
            navigate('/login');
        }
    }, [navigate]);

    const handleStart = () => {
        sessionStorage.setItem('hasSeenIntro', 'true');
        navigate('/login');
    };

    return (
        <div className="landing-container">
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
                    onClick={handleStart}
                    style={{ padding: '0 40px', fontSize: '18px' }}
                >
                    Giriş Yap
                </IxButton>

                <div style={{ marginTop: '50px', bottom: '30px', fontSize: '12px', color: '#555' }}>
                    Built by Musa Eray Akalın.
                </div>
            </div>
        </div>
    );
}