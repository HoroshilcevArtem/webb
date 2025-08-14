document.querySelector('.spin-button').addEventListener('click', () => {
    const wheel = document.querySelector('.roulette-wheel');
    const resultElement = document.querySelector('.result');
    const spinButton = document.querySelector('.spin-button');

    // Блокировка кнопки
    spinButton.disabled = true;

    // Сброс анимации
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';

    // Перезапуск анимации с разной скоростью и углом
    const duration = Math.random() * 4 + 4; // случайная длительность от 4 до 8 секунд
    const totalAngle = 3600 + Math.random() * 360; // полные обороты плюс случайный угол
    setTimeout(() => {
        wheel.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        wheel.style.transform = `rotate(${totalAngle}deg)`;
    }, 0);

    resultElement.textContent = '';

    setTimeout(() => {
        // Определение результата
        const finalAngle = totalAngle % 360;
        let result;
        if ((finalAngle >= 0 && finalAngle < 88.2) || (finalAngle >= 176.4 && finalAngle < 264.6)) { // Красное
            result = 'Красное';
        } else if ((finalAngle >= 88.2 && finalAngle < 176.4) || (finalAngle >= 264.6 && finalAngle < 319.8)) { // Черное
            result = 'Черное';
        } else { // Зеленое
            result = 'Зеленое';
        }

        resultElement.textContent = `Результат: ${result}`;
        // Разблокировка кнопки
        spinButton.disabled = false;
    }, duration * 1000); // длительность анимации
});