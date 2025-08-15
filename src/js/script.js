document.addEventListener('DOMContentLoaded', () => {
    const symbols = ['assets/Kazino/bot/1.png', 'assets/Kazino/bot/2.png', 'assets/Kazino/bot/3.png', 'assets/Kazino/bot/4.png', 'assets/Kazino/bot/5.png', 'assets/Kazino/bot/6.png', 'assets/Kazino/bot/7.png'];
    const spinButton = document.getElementById('spin-button');
    const logButton = document.getElementById('log-button');
    const closeLogButton = document.getElementById('close-log-button');
    const reels = document.querySelectorAll('.reel');
    const logSection = document.querySelector('.log');
    const heroSection = document.querySelector('.hero');
    const logTable = document.getElementById('log-table');
    const container = document.querySelector('.container');
    // Выбираем все кнопки, кроме навигационных стрелок и кнопок закрытия модалок,
    // чтобы они не блокировались во время анимации слотов.
    const buttons = document.querySelectorAll('button:not(.side-arrow-btn):not(.close-button):not(.close-slot-button)');
    let isSpinning = false;
    let winLog = [];

    const slotMachineButton = document.getElementById('slot-machine-button');
    const slotListSection = document.querySelector('.slot-list');
    const slotListContainer = document.querySelector('.slot-list .slot-hidden');
    const closeSlotListButton = document.getElementById('close-slot-list-button');

    if (!spinButton || reels.length === 0) {
        console.error('Не удалось найти необходимые элементы на странице.');
        return;
    }

    const spinReels = () => {
        if (isSpinning) return;
        isSpinning = true;

        buttons.forEach(button => button.disabled = true); // Отключить кнопки

        reels.forEach(reel => {
            const img = reel.querySelector('img');
            img.style.animation = 'none'; // Сброс анимации
            img.offsetHeight; // Триггер перерисовки
            img.style.animation = ''; // Восстановление анимации
            reel.classList.add('spinning');
        });

        reels.forEach((reel, index) => {
            const changeImageSpeed = 200; // Увеличьте значение для более медленной смены

            let previousIndex = -1;
            let changeImageInterval = setInterval(() => {
                const img = reel.querySelector('img');
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * symbols.length);
                } while (randomIndex === previousIndex);
                previousIndex = randomIndex;
                img.src = symbols[randomIndex];
            }, changeImageSpeed);

            setTimeout(() => {
                clearInterval(changeImageInterval);
                reel.classList.remove('spinning');
                const img = reel.querySelector('img');
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * symbols.length);
                } while (randomIndex === previousIndex);
                img.src = symbols[randomIndex];
                if (index === reels.length - 1) {
                    isSpinning = false;
                    logWin();
                    buttons.forEach(button => button.disabled = false); // Включить кнопки
                }
            }, 9000 + index * 1000); // Увеличьте значение для более медленной смены
        });
    };

    const logWin = () => {
        const result = Array.from(reels).map(reel => reel.querySelector('img').src);
        winLog.push(result);
        if (winLog.length > 10) {
            winLog.shift();
        }
    };

    const showLog = () => {
        logTable.innerHTML = '';
        if (winLog.length === 0) {
            logTable.innerHTML = '<tr><td>Лог пуст!</td></tr>';
        } else {
            winLog.forEach((win, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>Выигрыш ${index + 1}:</td>` + win.map(src => `<td><div class="reel"><img src="${src}" alt="Выигрыш"></div></td>`).join('');
                logTable.appendChild(row);
            });
        }
        container.classList.add('hidden');
        logSection.classList.remove('hidden');
    };

    const hideLog = () => {
        logSection.classList.add('hidden');
        container.classList.remove('hidden');
    };

    const showSlotList = () => {
        slotListContainer.innerHTML = '';
        for (let i = 1; i <= 7; i++) {
            const slotButton = document.createElement('button');
            slotButton.innerHTML = `<img src="assets/Kazino/bot/${i}.png" alt="Слот ${i}" style="width: 150px; height: 150px;">`; // Увеличьте размер
            slotListContainer.appendChild(slotButton);
        }
        container.classList.add('hidden');
        slotListSection.classList.remove('hidden');
    };

    const hideSlotList = () => {
        slotListSection.classList.add('hidden');
        container.classList.remove('hidden');
    };

    spinButton.addEventListener('click', spinReels);
    logButton.addEventListener('click', showLog);
    closeLogButton.addEventListener('click', hideLog);
    slotMachineButton.addEventListener('click', showSlotList);
    closeSlotListButton.addEventListener('click', hideSlotList);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            spinReels();
        }
    });

    const exitButton = document.getElementById('exit-button');
    if (exitButton) {
        exitButton.addEventListener('click', () => {
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 500); // Длительность анимации
        });
    }

    // Добавьте обработчик события для плавного появления страницы
    document.body.classList.add('fade-in');

});

// --- Balance panel logic ---
// Fetch balance from server endpoint and update UI. If server is not available, show a placeholder.
async function fetchBalance() {
    const balanceEl = document.getElementById('balance-value');
    if (!balanceEl) return;
    try {
        const resp = await fetch('/api/balance', { method: 'GET' });
        if (!resp.ok) throw new Error('Network response not ok');
        const data = await resp.json();
        if (typeof data.balance === 'number') {
            balanceEl.textContent = data.balance.toFixed(2);
        } else if (typeof data.balance === 'string') {
            balanceEl.textContent = data.balance;
        } else {
            balanceEl.textContent = '—';
        }
    } catch (err) {
        // Сервер может быть локальным; показываем безопасный placeholder
        balanceEl.textContent = 'N/A';
        // console.debug(err);
    }
}

function initBalancePanel() {
    const refreshBtn = document.getElementById('balance-refresh');
    if (refreshBtn) refreshBtn.addEventListener('click', fetchBalance);
    // initial load
    fetchBalance();
}

// init when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBalancePanel);
} else {
    initBalancePanel();
}