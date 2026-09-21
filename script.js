// Анимация появления текста и кнопок снизу вверх
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Как только элемент появляется на экране, добавляем ему класс visible
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 }); // Срабатывает, когда видно хотя бы 10% элемента

// Находим все элементы с классом fade-up и начинаем за ними следить
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));


// Анимация отрисовки линий метро при скролле
window.addEventListener('scroll', () => {
    // Вычисляем, насколько процентов прокручена страница
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    let scrollPercent = 0;
    if (scrollHeight > 0) {
        scrollPercent = scrollTop / scrollHeight;
    }

    // Длина нашей нарисованной линии (максимум 2000, как в CSS)
    const drawLength = 2000 * scrollPercent;

    // Применяем изменения к каждой линии
    document.querySelectorAll('.metro-line').forEach(line => {
        // Уменьшаем смещение, чтобы линия начала показываться
        line.style.strokeDashoffset = 2000 - drawLength;
    });
});