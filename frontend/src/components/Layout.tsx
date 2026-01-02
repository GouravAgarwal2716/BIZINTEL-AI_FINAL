import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InsightsIcon from '@mui/icons-material/Insights';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import SalesforceChat from './SalesforceChat';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260;

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose();
        await signOut();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Command Center', icon: <DashboardIcon />, path: '/' },
        { text: 'Agentforce', icon: <SmartToyIcon />, path: '/agentforce' },
        { text: 'Agent Console', icon: <SmartToyIcon />, path: '/agents' },
        { text: 'Intelligence Atlas', icon: <InsightsIcon />, path: '/intelligence' },
        { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    ];

    const drawer = (
        <Box sx={{ bgcolor: '#0f172a', height: '100%', color: 'white' }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                <SmartToyIcon sx={{ mr: 1, color: '#ec4899' }} />
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                    BizIntel AI
                </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <List sx={{ mt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(236, 72, 153, 0.15)',
                                    borderRight: '3px solid #ec4899',
                                    '&:hover': { bgcolor: 'rgba(236, 72, 153, 0.25)' }
                                },
                                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: location.pathname === item.path ? '#ec4899' : 'gray' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: location.pathname === item.path ? 600 : 400 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: '#1e293b',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {menuItems.find(i => i.path === location.pathname)?.text || 'Dashboard'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ mr: 2, display: { xs: 'none', sm: 'block' }, color: 'text.secondary' }}>
                            {user?.email}
                        </Typography>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#ec4899' }}>{user?.email?.charAt(0).toUpperCase()}</Avatar>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>Profile</MenuItem>
                            <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0f172a' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.05)' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: '#0f172a' }}
            >
                <Toolbar />
                <Outlet />
            </Box>
            {/* Salesforce Chat Widget */}
            <SalesforceChat />
        </Box>
    );
};

export default Layout;
