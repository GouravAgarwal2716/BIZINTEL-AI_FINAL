import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SalesforceConnect from './pages/SalesforceConnect';
import Agents from './pages/Agents';
import Intelligence from './pages/Intelligence';
import Settings from './pages/Settings';
import AgentforceDashboard from './pages/AgentforceDashboard';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#ec4899' },
        secondary: { main: '#3b82f6' },
        background: { default: '#0f172a', paper: '#1e293b' }
    },
    typography: { fontFamily: 'Inter, system-ui, sans-serif' }
});

function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/connect" element={<SalesforceConnect />} />

                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/agents" element={<Agents />} />
                                <Route path="/agentforce" element={<AgentforceDashboard />} />
                                <Route path="/intelligence" element={<Intelligence />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Route>
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
