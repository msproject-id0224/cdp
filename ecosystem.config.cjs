module.exports = {
    apps: [
        {
            name: 'inertia-ssr',
            script: './bootstrap/ssr/ssr.js',
            cwd: '/home/cdp-project/htdocs/mitra-project.com',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '256M',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
