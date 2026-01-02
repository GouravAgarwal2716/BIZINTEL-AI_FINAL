import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert, CircularProgress, Card, CardContent } from '@mui/material';
import { salesforceApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const SalesforceConnect = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [connectedOrg, setConnectedOrg] = useState<any>(null);

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        security_token: '',
        domain: 'login' // or test
    });

    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            const { data } = await salesforceApi.getStatus();
            if (data.is_connected) {
                setConnectedOrg(data.org_metadata);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const { data } = await salesforceApi.connect(formData);
            setSuccess(`Successfully connected to ${data.org.organization_name}`);
            setConnectedOrg(data.org);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        try {
            await salesforceApi.disconnect();
            setConnectedOrg(null);
            setSuccess('Disconnected successfully');
            setFormData({ username: '', password: '', security_token: '', domain: 'login' });
        } catch (err) {
            setError('Failed to disconnect');
        } finally {
            setLoading(false);
        }
    }

    if (connectedOrg) {
        return (
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                    <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Connected to Salesforce
                    </Typography>
                    <Card variant="outlined" sx={{ mb: 3, textAlign: 'left', bgcolor: 'background.default' }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">Organization Name</Typography>
                            <Typography variant="h6">{connectedOrg.organization_name}</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Org ID</Typography>
                                <Typography variant="body1">{connectedOrg.organization_id}</Typography>
                            </Box>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" color="text.secondary">Type</Typography>
                                <Typography variant="body1">{connectedOrg.type}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                    <Button variant="outlined" color="error" onClick={handleDisconnect} disabled={loading}>
                        Disconnect
                    </Button>
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={() => navigate('/dashboard')}>
                            Go to Dashboard
                        </Button>
                    </Box>
                </Paper>
            </Container>
        )
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
                    Connect Salesforce
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Enter your credentials to enable autonomous agents.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Salesforce Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Security Token"
                        name="security_token"
                        type="password"
                        value={formData.security_token}
                        onChange={handleChange}
                        margin="normal"
                        helperText="Reset via Salesforce settings if unknown"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Domain"
                        name="domain"
                        select
                        SelectProps={{ native: true }}
                        value={formData.domain}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <option value="login">Production (login.salesforce.com)</option>
                        <option value="test">Sandbox (test.salesforce.com)</option>
                    </TextField>

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        size="large"
                        disabled={loading}
                        sx={{ mt: 3 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Connect Organization'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default SalesforceConnect;
