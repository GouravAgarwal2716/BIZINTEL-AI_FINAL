import { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Grid, Card, CardContent, Chip, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { salesforceApi } from '../services/api';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudOffIcon from '@mui/icons-material/CloudOff';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState<any>(null);
    const [dataStatus, setDataStatus] = useState<any>(null);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        checkConnection();
    }, []);

    const checkConnection = async () => {
        try {
            const { data } = await salesforceApi.getStatus();
            setConnectionStatus(data);

            // Only check data if connected
            if (data.is_connected) {
                await checkData();
            }
        } catch (err) {
            console.error("Error fetching connection status", err);
        } finally {
            setLoading(false);
        }
    };

    const checkData = async () => {
        try {
            const { data } = await salesforceApi.checkDataStatus();
            console.log("Data status response:", data); // Debug log
            setDataStatus(data);
        } catch (err) {
            console.error("Error fetching data status", err);
        }
    };

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const response = await salesforceApi.seedData();
            console.log("Seed response:", response.data); // Debug log

            // Force refresh data status after seeding
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s for Salesforce to process
            await checkData();

            alert('✅ Demo data seeded successfully! Check your Salesforce org.');
        } catch (err: any) {
            console.error("Seed error:", err);
            alert(`Failed to seed data: ${err.response?.data?.detail || err.message}`);
        } finally {
            setSeeding(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
        </Box>
    );

    const isConnected = connectionStatus?.is_connected;
    const hasData = dataStatus?.has_data;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Command Center
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Autonomous Revenue Intelligence Platform
            </Typography>

            {/* Connection Status Banner */}
            {isConnected ? (
                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                    <strong>Connected:</strong> {connectionStatus.org_metadata?.organization_name} ({connectionStatus.org_metadata?.type})
                </Alert>
            ) : (
                <Alert severity="error" icon={<CloudOffIcon />} sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.1)' }}>
                    <strong>Not Connected:</strong> Connect your Salesforce org to enable AI agents.
                    <Button size="small" variant="outlined" color="error" onClick={() => navigate('/connect')} sx={{ ml: 2 }}>
                        Connect Now
                    </Button>
                </Alert>
            )}

            {/* Data Seeding CTA */}
            {isConnected && !hasData && (
                <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(236,72,153,0.1)', border: '1px solid #ec4899' }}>
                    <Typography variant="h6" color="#ec4899" gutterBottom>
                        🎯 Empty Org Detected
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Your Salesforce org has no demo data. Seed intelligent data to activate autonomous agents.
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleSeed} disabled={seeding}>
                        {seeding ? 'Seeding...' : '🚀 Seed Intelligence Data'}
                    </Button>
                </Paper>
            )}

            {/* Stats Grid */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6">Pipeline Health</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {dataStatus?.counts?.Opportunity || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Active Opportunities</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <WarningIcon color="warning" sx={{ mr: 1 }} />
                                <Typography variant="h6">Risk Detection</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {dataStatus?.counts?.Case || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Open Risk Cases</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6">Lead Velocity</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {dataStatus?.counts?.Lead || 0}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">New Leads this week</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Agent Activity Preview */}
            <Paper sx={{ mt: 4, p: 3, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Recent Autonomous Actions</Typography>
                    <Button size="small" variant="outlined" onClick={() => navigate('/agents')}>View Console</Button>
                </Box>
                {hasData ? (
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Chip label="Sales Agent: Updated Lead Status" color="primary" variant="outlined" />
                        <Chip label="Retention Agent: Flagged Churn Risk" color="warning" variant="outlined" />
                        <Chip label="Onboarding: Sent Welcome Email" color="success" variant="outlined" />
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        No agent activity yet. Seed data and run agents to see actions here.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default Dashboard;
