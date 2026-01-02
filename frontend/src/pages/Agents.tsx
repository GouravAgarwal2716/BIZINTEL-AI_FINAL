import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, CardActions, Button, Box, List, ListItem, ListItemText, Divider, Chip, CircularProgress } from '@mui/material';
import { salesforceApi } from '../services/api';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import DecisionLog from '../components/DecisionLog';

const agents = [
    { id: 'onboarding', name: 'Onboarding Agent', description: 'Monitors new accounts and schedules welcome tasks.' },
    { id: 'sales', name: 'Sales Agent', description: 'Identifies stale leads and creates re-engagement tasks.' },
    { id: 'retention', name: 'Retention Agent', description: 'Detects churn signals and creates risk cases.' },
    { id: 'market_scout', name: 'Market Scout', description: 'Real-time Web Intelligence. Finds news & alerts sales.' },
    { id: 'vendor', name: 'Vendor Agent', description: 'Tracks contract renewals and alerts legal.' },
    { id: 'executive', name: 'Executive Agent', description: 'Generates business health reports.' },
];

const AgentsPage = () => {
    const [running, setRunning] = useState<string | null>(null);
    const [logs, setLogs] = useState<any[]>([]);

    // Load logs from localStorage on mount
    useEffect(() => {
        const savedLogs = localStorage.getItem('agent_activity_logs');
        if (savedLogs) {
            try {
                setLogs(JSON.parse(savedLogs));
            } catch (e) {
                console.error('Failed to parse saved logs');
            }
        }
    }, []);

    // Save logs to localStorage whenever they change
    useEffect(() => {
        if (logs.length > 0) {
            localStorage.setItem('agent_activity_logs', JSON.stringify(logs.slice(0, 100))); // Keep last 100 logs
        }
    }, [logs]);

    const handleRun = async (agentId: string) => {
        setRunning(agentId);
        try {
            const { data } = await salesforceApi.runAgent(agentId);
            // Backend now returns { logs: [...] } where logs are rich objects
            // We want to add them to our state
            const newLogs = data.logs.reverse(); // Newest first
            setLogs(prev => [...newLogs, ...prev]);
        } catch (err) {
            console.error(err);
            // Add error log
            setLogs(prev => [{
                message: `❌ Failed to run ${agentId} agent`,
                timestamp: new Date().toISOString(),
                agent: agentId,
                stage: "ERROR",
                details: { error: String(err) }
            }, ...prev]);
        } finally {
            setRunning(null);
        }
    };

    const handleClearLogs = () => {
        if (window.confirm('Clear all activity logs?')) {
            setLogs([]);
            localStorage.removeItem('agent_activity_logs');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">Agentforce Command Center</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Autonomous Agents observing your Salesforce Organization.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        {agents.map((agent) => (
                            <Grid item xs={12} key={agent.id}>
                                <Card
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        mb: 2,
                                        bgcolor: 'rgba(30, 41, 59, 0.7)', // Dark semi-transparent
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 3,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 10px 30px -10px rgba(236, 72, 153, 0.3)', // Pink glow
                                            border: '1px solid rgba(236, 72, 153, 0.5)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                borderRadius: '12px',
                                                bgcolor: 'rgba(236, 72, 153, 0.1)',
                                                mr: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <SmartToyIcon sx={{ fontSize: 32, color: '#ec4899' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>{agent.name}</Typography>
                                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{agent.description}</Typography>
                                        </Box>
                                    </Box>
                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            startIcon={running === agent.id ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                                            onClick={() => handleRun(agent.id)}
                                            disabled={!!running}
                                            sx={{
                                                bgcolor: '#ec4899',
                                                '&:hover': { bgcolor: '#db2777' },
                                                borderRadius: '20px',
                                                px: 3,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            {running === agent.id ? 'Running...' : 'Run Now'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Paper sx={{ height: '100%', minHeight: 600, maxHeight: 800, bgcolor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="white">Atlas Decision Engine</Typography>
                            {logs.length > 0 && (
                                <Button
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleClearLogs}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Clear
                                </Button>
                            )}
                        </Box>
                        <Box sx={{ p: 2, overflow: 'auto', flexGrow: 1 }}>
                            {logs.length === 0 && (
                                <Box sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography color="text.secondary">
                                        Waiting for agent execution...
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" >
                                        Run an agent to see Atlas reasoning traces.
                                    </Typography>
                                </Box>
                            )}
                            {logs.map((log, index) => (
                                // Handle both old string logs and new object logs safely
                                typeof log.message === 'string' && !log.stage ? (
                                    <Paper key={index} sx={{ p: 1.5, mb: 1, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                        <Typography variant="body2">{log.message}</Typography>
                                    </Paper>
                                ) : (
                                    <DecisionLog key={index} log={log} />
                                )
                            ))}
                        </Box>
                    </Paper>
                </Grid>

            </Grid>
        </Container>
    );
};

export default AgentsPage;
