import React, { useState, useEffect, useRef } from 'react';
import { IxModal, IxModalHeader, IxModalContent, IxModalFooter, IxButton } from '@siemens/ix-react';

export default function TreeActionModal({ show, type, onClose, onSubmit }) {
    const [inputValue, setInputValue] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        if (show) {
            setInputValue('');
        }
    }, [show]);

    const handleSubmit = () => {
        if (!inputValue.trim()) {
            alert("Lütfen bir değer giriniz.");
            return;
        }
        onSubmit(inputValue);
        onClose();
    };

    if (!show) return null;

    const isAddMode = type === 'add';
    const title = isAddMode ? "Yeni Neden Ekle" : "Kök Neden Çözümü";
    const label = isAddMode ? "Bu durumun sebebi nedir?" : "Kalıcı Çözüm (Action) Nedir?";
    const placeholder = isAddMode ? "Örn: Filtre tıkandığı için..." : "Örn: Filtreyi aylık bakıma ekle...";

    // DARK MODE İÇİN GÜNCELLENMİŞ STİL
    const inputStyle = {
        width: '100%',
        padding: '12px',
        fontSize: '15px',
        borderRadius: '4px',
        border: '1px solid #999',
        backgroundColor: 'transparent',
        color: '#fff',
        boxSizing: 'border-box',
        outline: 'none',
        fontFamily: 'inherit'
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 2000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <IxModal ref={modalRef} style={{ display: 'block', width: '600px', maxWidth: '90vw' }}>
                <IxModalHeader onCloseClick={onClose}>
                    {title}
                </IxModalHeader>

                <IxModalContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>

                        <label style={{ fontWeight: 'bold', color: '#fff' }}>{label}</label>

                        <textarea
                            rows={4}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            style={{ ...inputStyle, resize: 'vertical' }}
                            autoFocus
                        />
                    </div>
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