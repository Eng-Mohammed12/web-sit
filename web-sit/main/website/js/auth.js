// Authentication and User Management

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة مستخدم افتراضي إذا لم يكن هناك أي مستخدمين
    initializeDefaultUser();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const newUserForm = document.getElementById('newUserForm');
    if (newUserForm) {
        newUserForm.addEventListener('submit', handleCreateNewUser);
    }
    
    const logoutButton = document.getElementById('logoutButton');
    if(logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

/**
 * يقوم بإنشاء حساب مدير افتراضي عند أول تشغيل للموقع.
 */
function initializeDefaultUser() {
    const users = getFromLocalStorage('users') || [];
    if (users.length === 0) {
        const defaultAdmin = {
            id: generateId(),
            username: 'admin',
            password: '123' // كلمة مرور بسيطة للمثال
        };
        saveToLocalStorage('users', [defaultAdmin]);
    }
}

/**
 * يتحقق مما إذا كان المستخدم قد سجل دخوله.
 */
function isLoggedIn() {
    return localStorage.getItem('loggedInUser') !== null;
}

/**
 * حماية صفحات لوحة التحكم من الوصول المباشر.
 */
function protectDashboardPages() {
    if (!isLoggedIn()) {
        // إذا لم يسجل المستخدم دخوله، يتم تحويله إلى صفحة الدخول
        window.location.href = '../login.html';
    }
}

/**
 * معالجة عملية تسجيل الدخول.
 */
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    clearFieldError('username');
    clearFieldError('password');

    const users = getFromLocalStorage('users') || [];
    const foundUser = users.find(user => user.username === username && user.password === password);

    if (foundUser) {
        showToast('تم تسجيل الدخول بنجاح!', 'success');
        localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
        setTimeout(() => {
            window.location.href = 'dashboard/overview.html';
        }, 1000);
    } else {
        showToast('اسم المستخدم أو كلمة المرور غير صحيحة', 'error');
        showFieldError('username', ' ');
        showFieldError('password', 'اسم المستخدم أو كلمة المرور غير صحيحة');
    }
}

/**
 * معالجة إنشاء مستخدم جديد من صفحة الإعدادات.
 */
function handleCreateNewUser(e) {
    e.preventDefault();
    const newUsername = document.getElementById('newUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value;

    clearFieldError('newUsername');
    clearFieldError('newPassword');

    if (newUsername.length < 4) {
        showFieldError('newUsername', 'اسم المستخدم يجب أن يكون 4 أحرف على الأقل');
        return;
    }
    if (newPassword.length < 3) {
        showFieldError('newPassword', 'كلمة المرور يجب أن تكون 3 أحرف على الأقل');
        return;
    }

    let users = getFromLocalStorage('users') || [];
    const isUserExists = users.some(user => user.username === newUsername);

    if (isUserExists) {
        showToast('اسم المستخدم هذا موجود بالفعل', 'error');
        showFieldError('newUsername', 'اسم المستخدم هذا موجود بالفعل');
        return;
    }

    const newUser = {
        id: generateId(),
        username: newUsername,
        password: newPassword
    };

    users.push(newUser);
    saveToLocalStorage('users', users);
    showToast('تم إنشاء المستخدم الجديد بنجاح!', 'success');
    e.target.reset();
}

/**
 * معالجة تسجيل الخروج.
 */
function handleLogout() {
    localStorage.removeItem('loggedInUser');
    showToast('تم تسجيل الخروج بنجاح.', 'info');
    setTimeout(() => {
        window.location.href = '../login.html';
    }, 1000);
}
