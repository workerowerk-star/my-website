document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const nodes = document.querySelectorAll('.node');
    let currentIndex = 0;
    
    if (!slider) return;
    
    const totalSlides = nodes.length;
    let isAnimating = false;
    let isMobile = window.innerWidth <= 900; // Проверяем ширину окна

    window.addEventListener('resize', () => {
        isMobile = window.innerWidth <= 900;
        if (isMobile) {
            slider.style.transform = 'none'; // Сбрасываем смещение на мобильных
        } else {
            goToSlide(currentIndex); // Восстанавливаем позицию на десктопе
        }
    });

    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide !== null && !isMobile) {
        currentIndex = parseInt(savedSlide);
        slider.style.transition = 'none';
        goToSlide(currentIndex);
        setTimeout(() => {
            slider.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
        }, 50);
    } else if (isMobile && savedSlide !== null) {
        // На мобильных плавно скроллим к нужной секции
        const slides = document.querySelectorAll('.slide');
        if (slides[savedSlide]) {
            setTimeout(() => {
                slides[savedSlide].scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    function goToSlide(index) {
        if (isMobile) return; // На мобильных не работает горизонтальный скролл
        if (index < 0 || index >= totalSlides) return;
        currentIndex = index;
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}vw)`;
        
        nodes.forEach(node => node.classList.remove('active'));
        nodes[currentIndex].classList.add('active');
        
        localStorage.setItem('currentSlide', currentIndex);
        
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, 800); 
    }

    nodes.forEach(node => {
        node.addEventListener('click', () => {
            if (isAnimating || isMobile) return;
            const index = parseInt(node.getAttribute('data-index'));
            goToSlide(index);
        });
    });

    // Десктопные события
    let startX = 0;
    let endX = 0;

    window.addEventListener('touchstart', (e) => {
        if (isMobile) return; // Игнорируем свайпы на мобильных
        startX = e.touches[0].clientX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isMobile) return; // Игнорируем свайпы на мобильных
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (isAnimating || isMobile) return;
        const diff = startX - endX;
        const threshold = 50;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }

    window.addEventListener('wheel', (e) => {
        if (isAnimating || isMobile) return; // Игнорируем колесико на мобильных (там обычный скролл)
        if (e.deltaY > 0) {
            goToSlide(currentIndex + 1);
        } else if (e.deltaY < 0) {
            goToSlide(currentIndex - 1);
        }
    }, { passive: true });
});
