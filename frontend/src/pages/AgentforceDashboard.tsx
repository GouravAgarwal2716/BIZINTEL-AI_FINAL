import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, Chip, List, ListItem, ListItemText, Avatar, Divider, CircularProgress } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { agentforceApi } from '../services/agentforceApi';

const AgentforceDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [agentStatus, setAgentStatus] = useState<any>(null);
    const [recentActivity, setRecentActivity] = useState<any>(null);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [statusRes, activityRes] = await Promise.all([
                agentforceApi.getStatus(),
                agentforceApi.getActivity()
            ]);
            setAgentStatus(statusRes.data);
            setRecentActivity(activityRes.data);
        } catch (err) {
            console.error('Failed to fetch Agentforce data', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    const getAgentColor = (type: string) => {
        switch (type) {
            case 'service': return '#3b82f6';
            case 'sales': return '#10b981';
            default: return '#ec4899';
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Agentforce Command Center
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Real-time monitoring of autonomous Salesforce agents
            </Typography>

            {/* Agent Status Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {agentStatus?.agents?.map((agent: any, idx: number) => (
                    <Grid item xs={12} md={4} key={idx}>
                        <Card sx={{
                            bgcolor: '#1e293b',
                            border: '1px solid rgba(255,255,255,0.05)',
                            position: 'relative',
                            overflow: 'visible'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: -10,
                                right: 20,
                                bgcolor: getAgentColor(agent.type),
                                borderRadius: '50%',
                                p: 1,
                                boxShadow: 3
                            }}>
                                <SmartToyIcon sx={{ color: 'white' }} />
                            </Box>
                            <CardContent sx={{ pt: 4 }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">
                                    {agent.name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 16, mr: 0.5 }} />
                                    <Typography variant="caption" sx={{ color: '#10b981', textTransform: 'uppercase' }}>
                                        {agent.status}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    <strong>Topics:</strong> {agent.topics.length}
                                </Typography>
                                <Chip
                                    label={`${agent.actions_today} actions today`}
                                    size="small"
                                    sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa' }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Activity Feed */}
            <Paper sx={{ p: 3, bgcolor: '#1e293b', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Recent Agent Actions
                    </Typography>
                    <Chip
                        label={`${recentActivity?.total_actions || 0} total`}
                        size="small"
                        color="primary"
                    />
                </Box>

                {recentActivity?.activities?.length > 0 ? (
                    <List>
                        {recentActivity.activities.slice(0, 10).map((activity: any, idx: number) => (
                            <Box key={activity.id}>
                                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                    <Avatar sx={{ bgcolor: '#ec4899', mr: 2, mt: 0.5 }}>
                                        <SmartToyIcon fontSize="small" />
                                    </Avatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {activity.agent}
                                                </Typography>
                                                <Chip
                                                    label={activity.status}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                                                    {activity.action}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Target: {activity.target}
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                    <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(activity.timestamp).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                {idx < recentActivity.activities.length - 1 && <Divider sx={{ my: 2 }} />}
                            </Box>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No agent activity recorded yet. Run agents to see actions here.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default AgentforceDashboard;
