// Configurações do sistema
const CONFIG = {
    ADMIN_EMAIL: "the.godkskd@gmail.com",
    ADMIN_TOKEN: "1533",
    DASHBOARD_CODE: "281988",
    VALID_DASHBOARDS: {
        "281988": {
            name: "Dashboard Principal",
            redirect: "../admin/index.html",
            permissions: ["posts", "analytics", "settings"]
        },
        "123456": {
            name: "Dashboard de Conteúdo",
            redirect: "../content/index.html",
            permissions: ["posts"]
        }
    }
};

// Elementos do DOM
const emailForm = document.getElementById('emailForm');
const tokenForm = document.getElementById('tokenForm');
const dashboardForm = document.getElementById('dashboardForm');
const loginEmail = document.getElementById('loginEmail');
const loginToken = document.getElementById('loginToken');
const dashboardCode = document.getElementById('dashboardCode');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');
const backToEmail = document.getElementById('backToEmail');
const backToToken = document.getElementById('backToToken');
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const stepProgress = document.getElementById('stepProgress');

// Estado da autenticação
let authState = {
    email: "",
    token: "",
    dashboard: ""
};

// Event Listeners
emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value.trim();
    
    // Validação do email
    if (!validateEmail(email)) {
        showError("Por favor, insira um e-mail válido.");
        return;
    }
    
    // Verificar se é o email administrativo
    if (email !== CONFIG.ADMIN_EMAIL) {
        showError("E-mail administrativo não reconhecido.");
        return;
    }
    
    authState.email = email;
    showSuccess("E-mail verificado com sucesso!");
    nextStep(1);
});

tokenForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const token = loginToken.value.trim();
    
    if (token !== CONFIG.ADMIN_TOKEN) {
        showError("Token de acesso incorreto.");
        return;
    }
    
    authState.token = token;
    showSuccess("Token validado com sucesso!");
    nextStep(2);
});

dashboardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = dashboardCode.value.trim();
    
    if (!CONFIG.VALID_DASHBOARDS[code]) {
        showError("Código do dashboard inválido.");
        return;
    }
    
    authState.dashboard = code;
    showSuccess(`Acessando ${CONFIG.VALID_DASHBOARDS[code].name}...`);
    
    // Redirecionar após 1 segundo
    setTimeout(() => {
        window.location.href = CONFIG.VALID_DASHBOARDS[code].redirect;
    }, 1000);
});

backToEmail.addEventListener('click', () => {
    prevStep(1);
});

backToToken.addEventListener('click', () => {
    prevStep(2);
});

// Funções de navegação
function nextStep(currentStep) {
    // Esconder formulário atual
    document.querySelector(`.auth-form.active`).classList.remove('active');
    
    // Atualizar progresso
    if (currentStep === 1) {
        step1.classList.remove('active');
        step1.classList.add('completed');
        step2.classList.add('active');
        stepProgress.style.width = '33%';
        tokenForm.classList.add('active');
    } else if (currentStep === 2) {
        step2.classList.remove('active');
        step2.classList.add('completed');
        step3.classList.add('active');
        stepProgress.style.width = '66%';
        dashboardForm.classList.add('active');
    }
}

function prevStep(targetStep) {
    // Esconder formulário atual
    document.querySelector(`.auth-form.active`).classList.remove('active');
    
    // Atualizar progresso
    if (targetStep === 1) {
        step2.classList.remove('active');
        step1.classList.add('active');
        step1.classList.remove('completed');
        stepProgress.style.width = '0%';
        emailForm.classList.add('active');
    } else if (targetStep === 2) {
        step3.classList.remove('active');
        step2.classList.add('active');
        step2.classList.remove('completed');
        stepProgress.style.width = '33%';
        tokenForm.classList.add('active');
    }
}

// Funções de validação
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Funções de mensagens
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    successMessage.style.display = 'none';
    
    // Esconder após 5 segundos
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    successText.textContent = message;
    successMessage.style.display = 'flex';
    errorMessage.style.display = 'none';
    
    // Esconder após 3 segundos
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Conexão com o site principal
function connectWithMainSite() {
    // Verificar se estamos no iframe do site principal
    if (window.parent !== window) {
        try {
            // Enviar mensagem para o site principal
            window.parent.postMessage({
                type: 'DASHBOARD_AUTH',
                payload: {
                    email: authState.email,
                    token: authState.token,
                    dashboard: authState.dashboard
                }
            }, '*');
        } catch (e) {
            console.error("Erro ao conectar com o site principal:", e);
        }
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há estado salvo
    const savedState = localStorage.getItem('dashboardAuthState');
    if (savedState) {
        authState = JSON.parse(savedState);
        
        if (authState.email) {
            loginEmail.value = authState.email;
            nextStep(1);
        }
        
        if (authState.token) {
            loginToken.value = authState.token;
            nextStep(2);
        }
    }
    
    // Conectar com o site principal
    connectWithMainSite();
});