document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login');
    const regBtn = document.getElementById('register');
    const msg = document.getElementById('msg');

    function showMessage(t){ msg.textContent = t; }

    async function postJson(url, body){
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return res.json();
    }

    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        if (!username || !password) return showMessage('Введите логин и пароль');
        showMessage('Отправка...');
        try {
            const data = await postJson('http://localhost:3001/login', { username, password });
            if (data && data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } else {
                showMessage(data.error || 'Ошибка входа');
            }
        } catch (e) { showMessage('Сервер недоступен'); }
    });

    regBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        if (!username || !password) return showMessage('Введите логин и пароль');
        showMessage('Отправка...');
        try {
            const data = await postJson('http://localhost:3001/register', { username, password });
            if (data && data.token) {
                localStorage.setItem('authToken', data.token);
                window.location.href = 'index.html';
            } else {
                showMessage(data.error || 'Ошибка регистрации');
            }
        } catch (e) { showMessage('Сервер недоступен'); }
    });
});
