document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('login');
    const regBtn = document.getElementById('register');
    const msg = document.getElementById('msg');
    const msgText = document.getElementById('msg-text');
    const authBox = document.getElementById('auth-box');

    function showMessage(t, kind){
        msgText.textContent = t;
        msg.classList.remove('success','error');
        if (kind === 'success') msg.classList.add('success');
        if (kind === 'error') msg.classList.add('error');
    }

    function setLoading(on){
        [loginBtn, regBtn].forEach(b=>b.disabled = on);
        if (on) {
            msgText.innerHTML = '<span class="spinner"></span> Пожалуйста, подождите...';
        } else {
            // clear spinner if disabling loading
            // keep message as-is
        }
    }

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
    if (!username || !password) return showMessage('Введите логин и пароль', 'error');
    setLoading(true);
        try {
            const data = await postJson('http://localhost:3001/login', { username, password });
            if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        showMessage('Успешный вход', 'success');
    authBox.classList.add('auth-success');
    document.getElementById('checkmark').classList.add('show');
    setTimeout(()=> window.location.href = 'index.html', 700);
            } else {
    showMessage(data.error || 'Ошибка входа', 'error');
    setLoading(false);
    document.getElementById('checkmark').classList.remove('show');
            }
        } catch (e) { showMessage('Сервер недоступен'); }
    });

    regBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
    if (!username || !password) return showMessage('Введите логин и пароль', 'error');
    setLoading(true);
        try {
            const data = await postJson('http://localhost:3001/register', { username, password });
            if (data && data.token) {
        localStorage.setItem('authToken', data.token);
        showMessage('Регистрация успешна', 'success');
    authBox.classList.add('auth-success');
    document.getElementById('checkmark').classList.add('show');
    setTimeout(()=> window.location.href = 'index.html', 900);
            } else {
    showMessage(data.error || 'Ошибка регистрации', 'error');
    setLoading(false);
    document.getElementById('checkmark').classList.remove('show');
            }
        } catch (e) { showMessage('Сервер недоступен'); }
    });
});
