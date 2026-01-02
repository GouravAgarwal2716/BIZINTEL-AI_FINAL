import React from 'react';
import { Box, Typography, Paper, Chip, Divider, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FactCheckIcon from '@mui/icons-material/FactCheck';

interface LogProps {
    log: {
        stage: string;
        timestamp: string;
        message: string;
        reasoning_trace?: string[];
        data_citations?: string[];
        confidence_score?: number;
        ai_signals_used?: any[];
        details?: any;
    };
}

const DecisionLog: React.FC<LogProps> = ({ log }) => {
    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'OBSERVE': return 'info';
            case 'REASON': return 'warning';
            case 'ACT': return 'success';
            default: return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.03)', borderLeft: '4px solid', borderColor: `${getStageColor(log.stage)}.main` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={log.stage} color={getStageColor(log.stage) as any} size="small" sx={{ fontWeight: 'bold' }} />
                    <Typography variant="body2" color="text.secondary">
                        {new Date(log.timestamp).toLocaleTimeString()}
                    </Typography>
                </Box>
                {log.confidence_score && (
                    <Chip
                        icon={<VerifiedUserIcon />}
                        label={`Confidence: ${(log.confidence_score * 100).toFixed(0)}%`}
                        size="small"
                        color="success"
                        variant="outlined"
                    />
                )}
            </Box>

            <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                {log.message}
            </Typography>

            {/* Reasoning Trace */}
            {log.reasoning_trace && log.reasoning_trace.length > 0 && (
                <Box sx={{ mt: 1, p: 1.5, bgcolor: 'rgba(237, 108, 2, 0.1)', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AutoAwesomeIcon fontSize="small" color="warning" />
                        <Typography variant="subtitle2" color="warning.main">Reasoning Trace</Typography>
                    </Box>
                    <List dense disablePadding>
                        {log.reasoning_trace.map((trace, idx) => (
                            <ListItem key={idx} disablePadding>
                                <ListItemText primary={`• ${trace}`} primaryTypographyProps={{ variant: 'body2', fontFamily: 'monospace' }} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* AI Signals / Einstein */}
            {log.ai_signals_used && log.ai_signals_used.length > 0 && (
                <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {log.ai_signals_used.map((signal, idx) => (
                            <Chip
                                key={idx}
                                icon={<AutoAwesomeIcon />}
                                label={`${signal.source}: ${signal.score}`}
                                size="small"
                                sx={{ bgcolor: 'rgba(147, 51, 234, 0.2)', color: '#d8b4fe' }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* Data Citations */}
            {log.data_citations && log.data_citations.length > 0 && (
                <Accordion sx={{ mt: 1, bgcolor: 'transparent', boxShadow: 'none', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />} sx={{ minHeight: 32, p: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FactCheckIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">Data Citations used as Context</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, pt: 1 }}>
                        <List dense disablePadding>
                            {log.data_citations.map((cite, idx) => (
                                <ListItem key={idx} disablePadding>
                                    <ListItemText primary={cite} primaryTypographyProps={{ variant: 'caption', color: 'text.secondary', fontFamily: 'monospace' }} />
                                </ListItem>
                            ))}
                        </List>
                    </AccordionDetails>
                </Accordion>
            )}
        </Paper>
    );
};

export default DecisionLog;
