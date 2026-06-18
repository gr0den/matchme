import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(
{
    plugins: [react()],

    server:
    {
        host: true,

        port: 5173,

        proxy:
        {
            '/api':
            {
                target: 'http://matchme-backend:8080',
                changeOrigin: true,
            },
            '/ws':
            {
                target: 'http://matchme-backend:8080',
                ws: true, // CRITICAL: Instructs Vite to pass the WebSocket protocol upgrade
                changeOrigin: true,
            },
        },

        watch:
        {
            usePolling: true,
        },

        hmr:
        {
            clientPort: 3000,
        },
    },
});