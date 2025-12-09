import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { IxModal, IxModalHeader, IxModalContent, IxModalFooter, IxButton, IxInput, IxTextarea } from '@siemens/ix-react';

export default function CreateProblemModal({ show, onClose, onSuccess }) {
    // Form State'leri
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        responsible_team: ''
    });

    const modalRef = useRef(null);

    // Modal açıldığında form temizlensin
    useEffect(() => {
        if (show) {
            setFormData({ title: '', description: '', responsible_team: '' });
        }
    }, [show]);

    // Input değişimi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Kaydetme İşlemi
    const handleSubmit = async () => {
        // Basit validasyon
        if (!formData.title || !formData.description || !formData.responsible_team) {
            alert("Lütfen tüm alanları doldurunuz.");
            return;
        }

        try {
            const response = await axios.post('/backend/public/api/problems.php', formData);
            if (response.data.status === 'success') {
                alert('Problem başarıyla oluşturuldu!');
                onSuccess(); // Dashboard'daki tabloyu yenile
                onClose();   // Modalı kapat
            }
        } catch (error) {
            console.error("Hata:", error);
            alert("Kayıt sırasında bir hata oluştu.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            {/* ix-modal bileşeni */}
            <IxModal ref={modalRef} style={{ display: 'block' }}>
                <IxModalHeader onCloseClick={onClose}>
                    Yeni Problem Tanımla
                </IxModalHeader>

                <IxModalContent>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '300px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Problem Başlığı</label>
                            <input
                                className="ix-input" // iX stili için class
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Örn: Hat 3 Motor Arızası"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Sorumlu Ekip</label>
                            <input
                                className="ix-input"
                                type="text"
                                name="responsible_team"
                                value={formData.responsible_team}
                                onChange={handleChange}
                                placeholder="Örn: Bakım, Üretim"
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Detaylı Açıklama</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Problemi detaylıca tarif ediniz..."
                                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                            />
                        </div>
                    </form>
                </IxModalContent>

                <IxModalFooter>
                    <IxButton outline variant="secondary" onClick={onClose}>
                        İptal
                    </IxButton>
                    <IxButton onClick={handleSubmit}>
                        Kaydet
                    </IxButton>
                </IxModalFooter>
            </IxModal>
        </div>
    );
}