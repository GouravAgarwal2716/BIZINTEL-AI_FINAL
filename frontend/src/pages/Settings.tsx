import { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Grid, Divider, Alert, Switch, FormControlLabel } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { salesforceApi } from '../services/api';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Settings = () => {
    const { user } = useAuth();
    const [connectionStatus, setConnectionStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const { data } = await salesforceApi.getStatus();
            setConnectionStatus(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDisconnect = async () => {
        if (window.confirm('Are you sure you want to disconnect Salesforce? This will stop all autonomous agents.')) {
            try {
                setLoading(true);
                await salesforceApi.disconnect();
                setConnectionStatus({ is_connected: false });
            } catch (err) {
                alert('Disconnect failed');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Settings & Configuration
            </Typography>

            <Grid container spacing={4} sx={{ mt: 1 }}>

                {/* 1. Account Info */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            User Profile
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Authentication Provider: Supabase
                        </Typography>
                        <TextField
                            label="Email Address"
                            value={user?.email || ''}
                            fullWidth
                            disabled
                            variant="filled"
                            sx={{ mt: 2 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            User ID: {user?.id}
                        </Typography>
                    </Paper>
                </Grid>

                {/* 2. Salesforce Connection */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Salesforce Connection
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        {connectionStatus?.is_connected ? (
                            <Box>
                                <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#66bb6a' }}>
                                    Connected to <strong>{connectionStatus.org_metadata?.organization_name}</strong>
                                </Alert>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Org ID:</strong> {connectionStatus.org_metadata?.organization_id}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 3 }}>
                                    <strong>Type:</strong> {connectionStatus.org_metadata?.type}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<CloudOffIcon />}
                                    onClick={handleDisconnect}
                                    disabled={loading}
                                >
                                    Disconnect Organization
                                </Button>
                            </Box>
                        ) : (
                            <Box>
                                <Alert severity="warning" sx={{ mb: 3, bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#ffa726' }}>
                                    No Salesforce Organization Connected
                                </Alert>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => window.location.href = '/connect'}
                                >
                                    Connect Now
                                </Button>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* 3. Appearance (Placeholder) */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 4, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Platform Preferences
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <FormControlLabel control={<Switch defaultChecked />} label="Enable Dark Mode (System Default)" />
                        <FormControlLabel control={<Switch defaultChecked />} label="Show Real-time Agent Logs" />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Settings;
