import { useEffect } from 'react';
import { Box } from '@mui/material';

interface AgentforceChatProps {
    embedCode?: string;
}

const AgentforceChat = ({ embedCode }: AgentforceChatProps) => {
    useEffect(() => {
        if (!embedCode) return;

        // Inject Salesforce Agentforce embed code
        const script = document.createElement('script');
        script.innerHTML = embedCode;
        document.body.appendChild(script);

        return () => {
            // Cleanup
            document.body.removeChild(script);
        };
    }, [embedCode]);

    if (!embedCode) {
        return (
            <Box sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                bgcolor: '#ec4899',
                color: 'white',
                p: 2,
                borderRadius: 2,
                boxShadow: 3,
                cursor: 'pointer',
                '&:hover': { bgcolor: '#db2777' }
            }}>
                💬 Agentforce Chat (Setup Required)
            </Box>
        );
    }

    return (
        <Box id="agentforce-chat-container">
            {/* Salesforce Agentforce chat widget will render here */}
        </Box>
    );
};

export default AgentforceChat;
