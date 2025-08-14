document.addEventListener('DOMContentLoaded', () => {
    const slotImage = document.querySelector('.hero-img[src="assets/Kazino/main/slot.png"]');
    if (slotImage) {
        slotImage.addEventListener('click', () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500); // Длительность анимации
        });
    }

    const bonusImage = document.getElementById('bonus-img');
    if (bonusImage) {
        bonusImage.addEventListener('click', () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 500); // Длительность анимации
        });
    }

    // Добавьте обработчик события для плавного появления страницы
    document.body.classList.add('fade-in');
});
