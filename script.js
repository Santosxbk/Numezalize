// Alternar tema claro/escuro
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

// Verificar preferência salva ou do sistema
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Menu Hamburger
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuSidebar = document.getElementById('menuSidebar');
const menuClose = document.getElementById('menuClose');

function toggleMenu() {
    menuOverlay.classList.toggle('active');
    menuSidebar.classList.toggle('active');
    
    // Impedir rolagem do corpo quando o menu está aberto
    if (menuSidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

menuToggle.addEventListener('click', toggleMenu);
menuOverlay.addEventListener('click', toggleMenu);
menuClose.addEventListener('click', toggleMenu);

// Modal Devs - CORREÇÃO APLICADA
const devsLink = document.getElementById('devs-link');
const devsModal = document.getElementById('devs-modal');
const closeModal = document.querySelector('.close-modal');

devsLink.addEventListener('click', function(e) {
    e.preventDefault();
    toggleMenu(); // Fecha o menu
    devsModal.style.display = 'block';
    // Impede que o conteúdo principal seja rolável quando o modal estiver aberto
    document.body.style.overflow = 'hidden';
});

closeModal.addEventListener('click', function() {
    devsModal.style.display = 'none';
    // Restaura a rolagem do conteúdo principal
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
    if (e.target === devsModal) {
        devsModal.style.display = 'none';
        // Restaura a rolagem do conteúdo principal
        document.body.style.overflow = 'auto';
    }
});

// Fechar menu ao clicar em um link (exceto o link Devs)
document.querySelectorAll('.menu-nav a:not(#devs-link)').forEach(link => {
    link.addEventListener('click', toggleMenu);
});

// Controle de múltiplos transportes
document.getElementById('adicionarTransporte').addEventListener('click', function() {
    document.getElementById('segundoTransporte').style.display = 'block';
    document.getElementById('adicionarTransporte').style.display = 'none';
    document.getElementById('removerTransporte').style.display = 'inline-block';
});

document.getElementById('removerTransporte').addEventListener('click', function() {
    document.getElementById('segundoTransporte').style.display = 'none';
    document.getElementById('adicionarTransporte').style.display = 'inline-block';
    document.getElementById('removerTransporte').style.display = 'none';
    // Limpar valores do segundo transporte
    document.getElementById('transporte2').selectedIndex = 0;
    document.getElementById('distancia2').value = '';
});

// Calculadora de emissões de transporte
function calcularEmissaoTransporte() {
    // Obter dados do primeiro transporte
    const fator1 = parseFloat(document.getElementById('transporte1').value);
    const distancia1 = parseFloat(document.getElementById('distancia1').value);
    
    if (isNaN(distancia1) || distancia1 <= 0) {
        alert("Por favor, preencha a distância do primeiro transporte.");
        return;
    }
    
    // Calcular emissão do primeiro transporte
    const emissao1 = distancia1 * fator1;
    
    // Obter nome do transporte selecionado
    const nomeTransporte1 = document.getElementById('transporte1').options[document.getElementById('transporte1').selectedIndex].text;
    
    let resultadoHTML = `<p><strong>Primeiro transporte (${nomeTransporte1}):</strong> ${emissao1.toFixed(2)} kg de CO₂</p>`;
    let emissaoTotal = emissao1;
    
    // Verificar se há segundo transporte
    const segundoTransporteVisivel = document.getElementById('segundoTransporte').style.display !== 'none';
    
    if (segundoTransporteVisivel) {
        const fator2 = parseFloat(document.getElementById('transporte2').value);
        const distancia2 = parseFloat(document.getElementById('distancia2').value);
        
        if (!isNaN(distancia2) && distancia2 > 0) {
            const emissao2 = distancia2 * fator2;
            const nomeTransporte2 = document.getElementById('transporte2').options[document.getElementById('transporte2').selectedIndex].text;
            
            resultadoHTML += `<p><strong>Segundo transporte (${nomeTransporte2}):</strong> ${emissao2.toFixed(2)} kg de CO₂</p>`;
            emissaoTotal += emissao2;
        }
    }
    
    // Adicionar total
    resultadoHTML += `<p style="margin-top: 10px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px;">Emissão total: ${emissaoTotal.toFixed(2)} kg de CO₂</p>`;
    
    // Adicionar contexto
    const arvoresNecessarias = (emissaoTotal / 21.77).toFixed(1); // Uma árvore absorve ~21.77kg de CO2 por ano
    
    resultadoHTML += `<p style="margin-top: 15px; font-size: 0.9rem;">Para compensar estas emissões, você precisaria plantar aproximadamente <strong>${arvoresNecessarias} árvores</strong>.</p>`;
    
    document.getElementById('detalhesEmissao').innerHTML = resultadoHTML;
    document.getElementById('resultadoTransporte').classList.add('show');
    
    // Atualizar visualização de impacto
    const impactoVisual = document.getElementById('impactoVisual');
    let corImpacto;
    
    if (emissaoTotal < 5) {
        corImpacto = '#4CAF50'; // Verde (baixo impacto)
    } else if (emissaoTotal < 20) {
        corImpacto = '#FFC107'; // Amarelo (médio impacto)
    } else {
        corImpacto = '#F44336'; // Vermelho (alto impacto)
    }
    
    // Ajustar a largura da barra baseada na emissão (com um máximo de 100%)
    const percentual = Math.min(emissaoTotal / 2, 100);
    impactoVisual.innerHTML = `<div style="height: 100%; width: ${percentual}%; background: ${corImpacto}; border-radius: 10px;"></div>`;
}

// Scroll suave para navegação
document.querySelectorAll('.menu-nav a:not(#devs-link)').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
    });
});

// Animação de scroll
function checkScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.classList.add('is-visible');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('load', checkScroll);

// Melhorar a experiência em dispositivos móveis
document.addEventListener('touchstart', function() {}, {passive: true});
