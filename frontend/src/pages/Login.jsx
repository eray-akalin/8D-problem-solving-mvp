import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IxButton, IxCard, IxCardContent, IxTypography } from '@siemens/ix-react';
import './LandingPage.css';

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Canlıya alırken '/api/login.php' olarak kalacak
            const response = await axios.post('/backend/public/api/login.php', {
                username,
                password
            });

            if (response.data.status === 'success') {
                localStorage.setItem('auth_token', response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Kullanıcı adı veya şifre hatalı!');
        }
    };

    return (
        <div className="landing-container" style={{ transform: 'none', opacity: 1, flexDirection: 'row', padding: '0 10%', gap: '50px' }}>

            {/* SOL TARAF: AÇIKLAMA ALANI */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', textAlign: 'left' }}>
                <IxTypography format="h1" style={{ color: 'white', marginBottom: '1rem' }}>
                    8D Problem Çözme Platformu
                </IxTypography>
                <IxTypography format="body" style={{ color: '#ccc', fontSize: '1.2rem', lineHeight: '1.6' }}>
                    Merhaba,
                    kolay deployment ve test edilebilir olması amacıyla,
                    bu prototipte karmaşık JWT/OAuth altyapısı yerine Config-Based Authentication yöntemi tercih ettim.
                    Attığım mailde giriş bilgilerinizi bulabilirsiniz.
                </IxTypography>
            </div>

            {/* SAĞ TARAF: LOGIN KARTI */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IxCard style={{ width: '400px', padding: '20px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <IxCardContent>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                            <img
                                src="/Siemens-logo.svg.png"
                                alt="Siemens Logo"
                                style={{ width: '120px', marginBottom: '10px' }}
                            />

                            <IxTypography format="h4" style={{ color: 'white', margin: 0 }}>
                                Giriş Yap
                            </IxTypography>

                            <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Kullanıcı Adı"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }}
                                />

                                <input
                                    type="password"
                                    placeholder="Şifre"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        maxWidth: '300px',
                                        padding: '12px',
                                        borderRadius: '4px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(0,0,0,0.2)',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '16px',
                                        boxSizing: 'border-box'
                                    }}
                                />

                                {error && (
                                    <div style={{ color: '#ff4d4d', fontSize: '14px', textAlign: 'center' }}>
                                        {error}
                                    </div>
                                )}

                                <IxButton type="submit" variant="primary" style={{ width: '100%', maxWidth: '300px', marginTop: '10px' }}>
                                    Giriş Yap
                                </IxButton>
                            </form>


                        </div>
                    </IxCardContent>
                </IxCard>
            </div>
        </div>
    );
}