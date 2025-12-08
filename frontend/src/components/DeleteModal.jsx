import React from 'react';
import { IxModal, IxModalHeader, IxModalContent, IxModalFooter, IxButton, IxTypography } from '@siemens/ix-react';
import { iconTrashcan } from '@siemens/ix-icons/icons';

export default function DeleteModal({ show, onClose, onConfirm, message }) {
    if (!show) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 3000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <IxModal style={{ display: 'block', width: '400px', maxWidth: '90vw' }}>
                <IxModalHeader onCloseClick={onClose} icon={iconTrashcan}>
                    Silme Onayı
                </IxModalHeader>

                <IxModalContent>
                    <div style={{ padding: '10px 0' }}>

                        <IxTypography format="body" style={{ fontSize: '16px', color: '#fff' }}>
                            {message || "Bu kaydı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."}
                        </IxTypography>
                    </div>
                </IxModalContent>

                <IxModalFooter>
                    <IxButton outline variant="secondary" onClick={onClose}>
                        Vazgeç
                    </IxButton>
                    <IxButton
                        variant="primary"
                        onClick={onConfirm}
                    >
                        Evet, Sil
                    </IxButton>
                </IxModalFooter>
            </IxModal>
        </div>
    );
}