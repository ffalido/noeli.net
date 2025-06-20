// Sistema de Gerenciamento de Posts
class PostManager {
    constructor() {
        this.posts = JSON.parse(localStorage.getItem('blogPosts')) || [];
        this.init();
    }
    
    init() {
        // Carregar posts de exemplo se não houver nenhum
        if (this.posts.length === 0) {
            this.loadSamplePosts();
        }
    }
    
    loadSamplePosts() {
        this.posts = [
            {
                id: Date.now(),
                title: 'Bem-vindo ao Dashboard!',
                content: 'Este é seu primeiro post. Edite ou exclua para começar.',
                image: 'https://via.placeholder.com/800x400?text=Primeiro+Post',
                date: this.formatDate(new Date()),
                status: 'published',
                views: 0
            }
        ];
        this.savePosts();
    }
    
    savePosts() {
        localStorage.setItem('blogPosts', JSON.stringify(this.posts));
    }
    
    addPost(post) {
        this.posts.unshift(post);
        this.savePosts();
        return post;
    }
    
    updatePost(id, updates) {
        const index = this.posts.findIndex(p => p.id === id);
        if (index !== -1) {
            this.posts[index] = {...this.posts[index], ...updates};
            this.savePosts();
            return this.posts[index];
        }
        return null;
    }
    
    deletePost(id) {
        this.posts = this.posts.filter(p => p.id !== id);
        this.savePosts();
    }
    
    getPost(id) {
        return this.posts.find(p => p.id === id);
    }
    
    getAllPosts() {
        return [...this.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    getPublishedPosts() {
        return this.getAllPosts().filter(p => p.status === 'published');
    }
    
    getDraftPosts() {
        return this.getAllPosts().filter(p => p.status === 'draft');
    }
    
    formatDate(date) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
}

// Sistema de Configurações
class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('dashboardSettings')) || this.getDefaultSettings();
    }
    
    getDefaultSettings() {
        return {
            blogTitle: "Blog de Atualizações",
            blogDescription: "Fique por dentro das últimas novidades",
            postsPerPage: 10,
            adminEmail: "the.godkskd@gmail.com",
            allowComments: true,
            notifyNewPosts: true,
            customCSS: "",
            analyticsCode: ""
        };
    }
    
    saveSettings() {
        localStorage.setItem('dashboardSettings', JSON.stringify(this.settings));
    }
    
    updateSettings(newSettings) {
        this.settings = {...this.settings, ...newSettings};
        this.saveSettings();
        return this.settings;
    }
    
    resetSettings() {
        this.settings = this.getDefaultSettings();
        this.saveSettings();
        return this.settings;
    }
}

// Sistema de Autenticação
class AuthManager {
    constructor() {
        this.authState = JSON.parse(localStorage.getItem('dashboardAuthState')) || {};
    }
    
    validateSession() {
        if (!this.authState.email || !this.authState.token || !this.authState.dashboard) {
            return false;
        }
        return true;
    }
    
    logout() {
        localStorage.removeItem('dashboardAuthState');
        window.location.href = "../login.html";
    }
}

// Sistema de Análises
class AnalyticsManager {
    constructor() {
        this.analyticsData = JSON.parse(localStorage.getItem('analyticsData')) || {
            totalViews: 0,
            postsViews: {},
            trafficSources: {
                direct: 0,
                search: 0,
                social: 0,
                referral: 0
            },
            dailyStats: {}
        };
    }
    
    recordView(postId) {
        this.analyticsData.totalViews++;
        
        if (postId) {
            if (!this.analyticsData.postsViews[postId]) {
                this.analyticsData.postsViews[postId] = 0;
            }
            this.analyticsData.postsViews[postId]++;
        }
        
        this.saveData();
    }
    
    recordTrafficSource(source) {
        const validSources = ['direct', 'search', 'social', 'referral'];
        if (validSources.includes(source)) {
            this.analyticsData.trafficSources[source]++;
            this.saveData();
        }
    }
    
    saveData() {
        localStorage.setItem('analyticsData', JSON.stringify(this.analyticsData));
    }
    
    getAnalytics() {
        return this.analyticsData;
    }
}

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', () => {
    const postManager = new PostManager();
    const settingsManager = new SettingsManager();
    const authManager = new AuthManager();
    const analyticsManager = new AnalyticsManager();
    
    // Verificar sessão
    if (!authManager.validateSession()) {
        authManager.logout();
        return;
    }
    
    // Tornar os managers globais para acesso fácil
    window.Dashboard = {
        posts: postManager,
        settings: settingsManager,
        auth: authManager,
        analytics: analyticsManager
    };
    
    // Configurar evento de logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        Dashboard.auth.logout();
    });
    
    // Atualizar estatísticas
    updateStats();
    
    // Carregar posts
    loadPosts();
    
    // Configurar formulários
    setupForms();
});

function updateStats() {
    // Implementar atualização de estatísticas na UI
}

function loadPosts() {
    // Implementar carregamento de posts na UI
}

function setupForms() {
    // Implementar configuração de formulários
}