import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';

import { IxButton, IxApplicationHeader } from '@siemens/ix-react';
import DeleteModal from '../components/DeleteModal';

import { iconAddCircle } from '@siemens/ix-icons/icons';
// Grid Modüllerini Al
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Siemens Entegrasyonu
import { getIxTheme } from '@siemens/ix-aggrid';
import * as agGrid from 'ag-grid-community';

import CreateProblemModal from '../components/CreateProblemModal';
import { useNavigate } from 'react-router-dom';
import { iconTrashcan } from '@siemens/ix-icons/icons';
import LandingPage from '../pages/LandingPage';

// Modülleri kaydet
ModuleRegistry.registerModules([AllCommunityModule]);

export default function Dashboard() {
    // Veri (RowData) ve Ayarlar (GridOptions) için ayrı state'ler
    const [gridOptions, setGridOptions] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const [deleteConfig, setDeleteConfig] = useState({
        isOpen: false,
        idToDelete: null
    });

    const [showLanding, setShowLanding] = useState(() => {
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        return !hasSeenIntro; // İzlediyse (true) -> showLanding (false) olur.
    });

    const handleStartApp = () => {
        setShowLanding(false);
        // Tarayıcı hafızasına kaydet, intro görüldü
        sessionStorage.setItem('hasSeenIntro', 'true');
    };


    const fetchProblems = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/problems.php');
            setRowData(response.data); // Sadece veriyi güncelle
        } catch (error) {
            console.error("Veri çekme hatası:", error);
        }
    };


    //Grid Ayarlarını (Tema, Kolonlar) Başlatan Fonksiyon
    const initializeGridConfig = () => {
        const ixTheme = getIxTheme(agGrid);

        setGridOptions({
            theme: ixTheme, // Tema ayarı

            onCellClicked: (event) => {
                // Tıklanan sütunun başlığı 'İşlem' ise fonksiyonu durdur (return).
                if (event.colDef.headerName === 'İşlem') {
                    return;
                }

                const problemId = event.data.id;
                navigate(`/problem/${problemId}`);
            },

            columnDefs: [
                { field: 'id', headerName: 'ID', width: 80 },
                { field: 'title', headerName: 'Problem Başlığı', flex: 2 },
                { field: 'responsible_team', headerName: 'Sorumlu Ekip', flex: 1 },
                {
                    field: 'status',
                    headerName: 'Durum',
                    width: 120,
                    cellRenderer: (params) => (

                        <span style={{
                            color: params.value === 'open' ? '#ff4d4d' : '#2ecc71',
                            fontWeight: 'bold'
                        }}>
                            {params.value ? params.value.toUpperCase() : ''}
                        </span>
                    )
                },
                { field: 'created_at', headerName: 'Tarih', width: 200 },
                {
                    headerName: 'İşlem',
                    width: 120,
                    cellRenderer: (params) => (
                        <IxButton
                            icon={iconTrashcan}
                            variant="outline"
                            ghost
                            onClick={() => openDeleteModal(params.data.id)}
                        />
                    )
                }
            ],
            animateRows: true,
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true
            }
        });
    };

    // Sayfa Yüklendiğinde 1 kere çalışır
    useEffect(() => {
        initializeGridConfig(); // Ayarları yükle
        fetchProblems();        // Veriyi çek
    }, []);

    // Modal kapandığında sadece veriyi yenile
    const handleSuccess = () => {
        fetchProblems();
    };

    const openDeleteModal = (id) => {
        setDeleteConfig({
            isOpen: true,
            idToDelete: id
        });
    };

    const confirmDelete = async () => {
        const id = deleteConfig.idToDelete;
        if (!id) return;

        try {
            await axios.delete(`http://localhost:8000/api/problems.php?id=${id}`);
            fetchProblems(); // Tabloyu yenile
            setDeleteConfig({ isOpen: false, idToDelete: null }); // Modalı kapat
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Silinemedi.");
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            <LandingPage
                isVisible={showLanding}
                onStart={handleStartApp}
            />

            {/* HEADER GÜNCELLEMESİ */}
            <IxApplicationHeader
                name="Teknik Case Study - 8D Problem Çözme Platformu"
                style={{ height: '64px', zIndex: 100 }}
                hide-bottom-border="true"
            >
                <div slot="logo" style={{ width: '80px', display: 'flex', alignItems: 'center' }}>
                    <img
                        src="/Siemens-logo.svg.png"
                        alt="Siemens Logo"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </div>


                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                    <IxButton
                        icon={iconAddCircle}
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Yeni Problem Ekle
                    </IxButton>
                </div>
            </IxApplicationHeader>


            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: 'var(--theme-color-std-text)' }}>Problem Listesi</h2>
                </div>

                <div style={{ height: '100%', width: '100%' }}>
                    {gridOptions && (
                        <AgGridReact
                            gridOptions={gridOptions}
                            rowData={rowData}
                        />
                    )}
                </div>
            </div>

            <CreateProblemModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
            />
            <DeleteModal
                show={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, idToDelete: null })}
                onConfirm={confirmDelete}
                message="Bu problemi ve bağlı tüm analizleri silmek istediğinize emin misiniz?"
            />
        </div>
    );
}