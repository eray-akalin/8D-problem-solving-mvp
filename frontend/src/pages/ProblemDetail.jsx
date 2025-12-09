import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { IxButton, IxTypography, IxApplicationHeader, IxCard, IxCardContent, IxIcon, IxCheckbox } from '@siemens/ix-react';
import { iconChevronLeft, iconPlus, iconTrashcan, iconAddCircle, iconInfo } from '@siemens/ix-icons/icons';

import './Tree.css';
import TreeActionModal from '../components/TreeActionModal';
import DeleteModal from '../components/DeleteModal';

// RECURSIVE NODE 
const CauseNode = ({ node, onAddChild, onSetRoot, onDelete }) => {
    const isRoot = node.is_root_cause == 1;

    return (
        <li>
            <div className={`tree-node-card ${isRoot ? 'root-cause-card' : ''}`}>
                <IxTypography format="h6" style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                    {node.description}
                </IxTypography>

                {isRoot && (
                    <div style={{ fontSize: '12px', color: '#2ecc71', marginBottom: '10px', fontStyle: 'italic' }}>
                        {node.solution_action}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
                    {!isRoot && (
                        <IxButton
                            outline
                            size="small"
                            icon={iconAddCircle}
                            variant='primary'
                            onClick={() => onAddChild(node)}
                        >
                            Neden Ekle
                        </IxButton>
                    )}

                    {!isRoot && (
                        <IxButton
                            ghost
                            size="small"
                            variant="primary"
                            onClick={() => onSetRoot(node)}
                            style={{ marginLeft: '5px' }}
                        >
                            Kök Neden!
                        </IxButton>
                    )}

                    <IxButton
                        ghost
                        size="small"
                        variant="secondary"
                        icon={iconTrashcan}
                        onClick={() => onDelete(node.id)}
                        style={{ marginLeft: '5px' }}
                    >
                    </IxButton>
                </div>
            </div>

            {node.children && node.children.length > 0 && (
                <ul>
                    {node.children.map(child => (
                        <CauseNode
                            key={child.id}
                            node={child}
                            onAddChild={onAddChild}
                            onSetRoot={onSetRoot}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

// ANA SAYFA
export default function ProblemDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [problem, setProblem] = useState(null);

    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        type: null,
        activeNode: null
    });

    const [deleteConfig, setDeleteConfig] = useState({
        isOpen: false,
        nodeIdToDelete: null
    });

    const fetchData = async () => {
        try {
            // GET istekleri normal çalışır
            const [treeRes, problemRes] = await Promise.all([
                axios.get(`/backend/public/api/causes.php?problem_id=${id}`),
                axios.get(`/backend/public/api/problems.php?id=${id}`)
            ]);

            setTreeData(treeRes.data);
            setProblem(problemRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Hata:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchData();
    }, [id]);

    const openDeleteModal = (nodeId) => {
        setDeleteConfig({
            isOpen: true,
            nodeIdToDelete: nodeId
        });
    };

    // --- SİLME İŞLEMİ (GÜNCELLENDİ: Method Spoofing) ---
    const confirmDeleteNode = () => {
        const nodeId = deleteConfig.nodeIdToDelete;
        if (!nodeId) return;

        // DELETE yerine POST + _method=DELETE
        axios.post(`/backend/public/api/causes.php?id=${nodeId}&_method=DELETE`)
            .then(() => {
                fetchData();
                setDeleteConfig({ isOpen: false, nodeIdToDelete: null });
            })
            .catch(err => console.error("Silme hatası:", err));
    };

    const openAddModal = (node) => {
        setModalConfig({
            isOpen: true,
            type: 'add',
            activeNode: node
        });
    };

    const openRootModal = (node) => {
        setModalConfig({
            isOpen: true,
            type: 'root',
            activeNode: node
        });
    };

    const handleModalSubmit = (inputValue) => {
        const { type, activeNode } = modalConfig;

        if (type === 'add') {
            // Ekleme zaten POST olduğu için sorun yok
            axios.post('/backend/public/api/causes.php', {
                problem_id: id,
                parent_id: activeNode ? activeNode.id : null,
                description: inputValue
            }).then(() => fetchData());

        } else if (type === 'root') {
            // --- KÖK NEDEN SEÇİMİ (GÜNCELLENDİ: Method Spoofing) ---
            // PUT yerine POST + _method=PUT
            axios.post(`/backend/public/api/causes.php?_method=PUT`, {
                id: activeNode.id,
                problem_id: id,
                is_root_cause: 1,
                solution_action: inputValue
            }).then(() => fetchData());
        }

        setModalConfig({ ...modalConfig, isOpen: false });
    };

    // --- PROBLEM DURUM GÜNCELLEME (GÜNCELLENDİ: Method Spoofing) ---
    const handleStatusChange = async (e) => {
        const newStatus = e.target.checked ? 'closed' : 'open';
        try {
            // PUT yerine POST + _method=PUT
            await axios.post(`/backend/public/api/problems.php?_method=PUT`, {
                id: problem.id,
                status: newStatus
            });
            setProblem({ ...problem, status: newStatus });
        } catch (error) {
            console.error("Status güncelleme hatası:", error);
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

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
                        icon={iconChevronLeft}
                        variant="primary"
                        outline
                        onClick={() => navigate('/dashboard')}
                        style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                    >
                        Listeye Dön
                    </IxButton>
                    <IxButton
                        ghost
                        variant="secondary"
                        onClick={() => {
                            localStorage.removeItem('auth_token');
                            navigate('/login');
                        }}
                    >
                        Çıkış
                    </IxButton>
                </div>
            </IxApplicationHeader>

            <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <h2 style={{ margin: 0, color: 'var(--theme-color-std-text)' }}>
                            Problem Analizi (ID: {id})
                        </h2>
                        {problem && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <IxCheckbox
                                    checked={problem.status === 'closed'}
                                    onCheckedChange={handleStatusChange}
                                    label="Problem Çözüldü"
                                ></IxCheckbox>
                            </div>
                        )}
                    </div>
                </div>

                {problem && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <IxCard variant="outline" style={{ width: '100%', pointerEvents: 'none' }}>
                            <IxCardContent>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                    <IxIcon name={iconInfo} size="24" style={{ color: '#00cccc' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <IxTypography format="h5" bold style={{ margin: 0 }}>
                                                {problem.title}
                                            </IxTypography>
                                        </div>
                                        <IxTypography format="body" style={{ marginTop: '0.5rem', color: 'var(--theme-color-weak-text)' }}>
                                            {problem.description}
                                        </IxTypography>
                                        <div style={{ marginTop: '1rem', fontSize: '12px', color: '#666', display: 'flex', gap: '20px' }}>
                                            <span><strong>Sorumlu Ekip:</strong> {problem.responsible_team}</span>
                                            <span><strong>Tarih:</strong> {problem.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                            </IxCardContent>
                        </IxCard>
                    </div>
                )}
                <span style={{ color: '#888', fontSize: '14px' }}>Kök neden analizi ağacını aşağıdan yönetebilirsiniz.</span>
                <br></br>

                <div style={{
                    flex: 1,
                    overflow: 'auto',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    backgroundColor: 'var(--theme-color-1--active)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '50px'
                }}>
                    <div className="tree">
                        <ul>
                            {loading ? (
                                <p style={{ color: 'white' }}>Yükleniyor...</p>
                            ) : treeData.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#ccc' }}>
                                    <IxButton icon={iconPlus} onClick={() => openAddModal(null)}>
                                        Analizi Başlat
                                    </IxButton>
                                </div>
                            ) : (
                                treeData.map(node => (
                                    <CauseNode
                                        key={node.id}
                                        node={node}
                                        onAddChild={openAddModal}
                                        onSetRoot={openRootModal}
                                        onDelete={openDeleteModal}
                                    />
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <TreeActionModal
                show={modalConfig.isOpen}
                type={modalConfig.type}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onSubmit={handleModalSubmit}
            />
            <DeleteModal
                show={deleteConfig.isOpen}
                onClose={() => setDeleteConfig({ isOpen: false, nodeIdToDelete: null })}
                onConfirm={confirmDeleteNode}
                message="Bu nedeni ve altındaki tüm nedenleri silmek istediğinize emin misiniz?"
            />
        </div>
    );
}