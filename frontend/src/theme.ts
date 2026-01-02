import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1', // Indigo
        },
        secondary: {
            main: '#ec4899', // Pink
        },
        background: {
            default: '#0f172a', // Slate 900
            paper: '#1e293b', // Slate 800
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontWeight: 600,
            letterSpacing: '-0.025em',
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});
