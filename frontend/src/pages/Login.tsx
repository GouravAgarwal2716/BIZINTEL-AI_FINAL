import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { supabase } from '../services/supabase';

const Login = () => {
    const { signInWithGoogle } = useAuth();
    // const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            alert(error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                    BizIntel AI
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Enterprise Decision Intelligence
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    onClick={signInWithGoogle}
                    sx={{ mb: 3, py: 1.5 }}
                >
                    Sign in with Google
                </Button>

                <Typography variant="body2" sx={{ my: 2 }}>
                    OR
                </Typography>

                <form onSubmit={handleMagicLink}>
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5 }}
                    >
                        {loading ? 'Sending Link...' : 'Sign in with Email'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
