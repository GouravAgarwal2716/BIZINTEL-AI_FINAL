import { Box, Typography, Grid, Paper, Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const Intelligence = () => {
    // Mock Data for Visualization
    const churnData = [
        { name: 'Week 1', risk: 12 },
        { name: 'Week 2', risk: 19 },
        { name: 'Week 3', risk: 15 },
        { name: 'Week 4', risk: 25 }, // Spike
        { name: 'Week 5', risk: 22 },
        { name: 'Week 6', risk: 18 },
    ];

    const revenueData = [
        { name: 'Q1', revenue: 4000, target: 2400 },
        { name: 'Q2', revenue: 3000, target: 1398 },
        { name: 'Q3', revenue: 2000, target: 5000 }, // Miss
        { name: 'Q4', revenue: 2780, target: 3908 },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Intelligence Atlas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Unified Data Cloud Analytics & Churn Prediction
            </Typography>

            <Grid container spacing={3}>

                {/* 1. Churn Prediction */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, bgcolor: '#1e293b', height: 400 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Churn Risk Trends (AI Detected)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={churnData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
                                <Line type="monotone" dataKey="risk" stroke="#ec4899" strokeWidth={3} dot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* 2. Key Insights */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card sx={{ bgcolor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}>
                                <CardContent>
                                    <Typography color="error" gutterBottom variant="overline">
                                        High Priority Risk
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#fca5a5' }}>
                                        3 Accounts
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#fca5a5', mt: 1 }}>
                                        Vertex AI, Globex Corp showing usage drop {'>'} 15%.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card sx={{ bgcolor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}>
                                <CardContent>
                                    <Typography color="success.main" gutterBottom variant="overline">
                                        Expansion Opportunity
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#86efac' }}>
                                        $450k
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#86efac', mt: 1 }}>
                                        Identified cross-sell targets in Enterprise segment.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* 3. Revenue vs Target */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#1e293b', height: 400 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Revenue Performance (Data Cloud Sync)
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#3b82f6" name="Actual Revenue" />
                                <Bar dataKey="target" fill="#64748b" name="Target" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

            </Grid>
        </Box>
    );
};

export default Intelligence;
