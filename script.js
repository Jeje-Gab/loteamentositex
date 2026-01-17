// ===== DADOS DOS TERRENOS =====
const terrenosData = {
    1: {
        titulo: "Lote 01 - Quadra A",
        metragem: "300 m²",
        valorTotal: "R$ 150.000,00",
        entrada: "R$ 15.000,00"
    },
    2: {
        titulo: "Lote 02 - Quadra A",
        metragem: "350 m²",
        valorTotal: "R$ 175.000,00",
        entrada: "R$ 17.500,00"
    },
    3: {
        titulo: "Lote 03 - Quadra B",
        metragem: "400 m²",
        valorTotal: "R$ 200.000,00",
        entrada: "R$ 20.000,00"
    },
    4: {
        titulo: "Lote 04 - Quadra B (Esquina)",
        metragem: "450 m²",
        valorTotal: "R$ 250.000,00",
        entrada: "R$ 25.000,00"
    },
    5: {
        titulo: "Lote 05 - Quadra C",
        metragem: "320 m²",
        valorTotal: "R$ 160.000,00",
        entrada: "R$ 16.000,00"
    },
    6: {
        titulo: "Lote 06 - Quadra C (Esquina)",
        metragem: "500 m²",
        valorTotal: "R$ 300.000,00",
        entrada: "R$ 30.000,00"
    }
};

// ===== NAVBAR =====
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fechar menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }

    lastScroll = currentScroll;
});

// ===== CARROSSEL =====
const carousel = document.querySelector('.carousel');
const track = document.querySelector('.carousel-track');
const cards = document.querySelectorAll('.terreno-card');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let cardsPerView = getCardsPerView();

function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
}

// Criar dots
function createDots() {
    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(cards.length / cardsPerView);

    for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    const activeDot = Math.floor(currentIndex / cardsPerView);

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDot);
    });
}

function updateCarousel() {
    const cardWidth = cards[0].offsetWidth + 30; // width + gap
    const offset = currentIndex * cardWidth;
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
}

function goToSlide(slideIndex) {
    currentIndex = slideIndex * cardsPerView;
    if (currentIndex >= cards.length) {
        currentIndex = cards.length - cardsPerView;
    }
    updateCarousel();
}

function nextSlide() {
    const maxIndex = cards.length - cardsPerView;
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
}

function prevSlide() {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Touch/Swipe support
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Recalcular no resize
window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    createDots();
    currentIndex = 0;
    updateCarousel();
});

// Inicializar carrossel
createDots();

// ===== MODAL =====
const modal = document.getElementById('terrenoModal');
const modalTitle = document.getElementById('modalTitle');
const modalSize = document.getElementById('modalSize');
const modalTotal = document.getElementById('modalTotal');
const modalEntrada = document.getElementById('modalEntrada');
const modalClose = document.querySelector('.modal-close');
const modalCta = document.querySelector('.modal-cta');

// Abrir modal ao clicar no card ou botão
cards.forEach(card => {
    card.addEventListener('click', () => {
        const terrenoId = card.dataset.terreno;
        openModal(terrenoId);
    });
});

function openModal(terrenoId) {
    const terreno = terrenosData[terrenoId];

    if (terreno) {
        modalTitle.textContent = terreno.titulo;
        modalSize.textContent = terreno.metragem;
        modalTotal.textContent = terreno.valorTotal;
        modalEntrada.textContent = terreno.entrada;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

modalCta.addEventListener('click', () => {
    closeModal();
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// ===== FORMULÁRIO =====
const contatoForm = document.getElementById('contatoForm');

contatoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        interesse: document.getElementById('interesse').value,
        mensagem: document.getElementById('mensagem').value
    };

    // Validação básica
    if (!formData.nome || !formData.email || !formData.telefone) {
        showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    // Simular envio (aqui você integraria com seu backend)
    console.log('Dados do formulário:', formData);

    // Mostrar mensagem de sucesso
    showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');

    // Limpar formulário
    contatoForm.reset();
});

// Máscara de telefone
const telefoneInput = document.getElementById('telefone');
telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length <= 11) {
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + '-' + value.slice(10);
        }
    }

    e.target.value = value;
});

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'success') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Criar notificação
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : '✕'}</span>
        <span class="notification-message">${message}</span>
    `;

    // Estilos inline para a notificação
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2d7a4f' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;

    // Adicionar animação CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remover após 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== SCROLL REVEAL =====
function reveal() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

// Adicionar classe reveal aos elementos
document.querySelectorAll('.sobre-content, .terreno-card, .contato-content, .feature-item').forEach(el => {
    el.classList.add('reveal');
});

window.addEventListener('scroll', reveal);
reveal(); // Executar na carga inicial

// ===== SMOOTH SCROLL PARA LINKS DA NAVBAR =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE LINK NA NAVBAR =====
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#2d7a4f';
            } else {
                navLink.style.color = '';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);
highlightNavLink();

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar animação de entrada
    document.body.style.opacity = '0';

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});
