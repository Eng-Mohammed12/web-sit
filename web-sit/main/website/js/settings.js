// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeSettingsPage();
    loadCurrentSettings();
});

function initializeSettingsPage() {
    // ربط الأحداث مع عناصر التحكم
    document.getElementById('themeToggle')?.addEventListener('change', handleThemeToggle);
    document.getElementById('primaryColor')?.addEventListener('input', (e) => applyPrimaryColor(e.target.value));
    document.querySelectorAll('.preset-color').forEach(button => {
        button.addEventListener('click', (e) => {
            const color = e.target.dataset.color;
            document.getElementById('primaryColor').value = color;
            applyPrimaryColor(color);
        });
    });
    document.getElementById('autoSlide')?.addEventListener('change', handleAutoSlideToggle);
    
    // أزرار الحفظ والإعادة
    document.getElementById('saveSettings')?.addEventListener('click', handleSaveSettings);
    document.getElementById('resetSettings')?.addEventListener('click', handleResetSettings);
}

function loadCurrentSettings() {
    // تحميل الثيم
    const theme = localStorage.getItem('theme') || 'light';
    document.getElementById('themeToggle').checked = theme === 'dark';
    document.getElementById('themeLabel').textContent = theme === 'dark' ? 'داكن' : 'فاتح';
    
    // تحميل اللون الأساسي
    const primaryColor = localStorage.getItem('primaryColor') || '#007bff';
    document.getElementById('primaryColor').value = primaryColor;

    // تحميل اسم الموقع
    const siteName = localStorage.getItem('siteName') || 'موقعي';
    document.getElementById('siteName').value = siteName;

    // تحميل إعداد السلايدر
    const autoSlide = localStorage.getItem('autoSlide') !== 'false';
    document.getElementById('autoSlide').checked = autoSlide;
    document.getElementById('autoSlideLabel').textContent = autoSlide ? 'مفعل' : 'معطل';
}

// --- دوال تطبيق التغييرات الفورية ---

function handleThemeToggle(e) {
    const newTheme = e.target.checked ? 'dark' : 'light';
    document.getElementById('themeLabel').textContent = newTheme === 'dark' ? 'داكن' : 'فاتح';
    applyTheme(newTheme);
}

function handleAutoSlideToggle(e) {
    const enabled = e.target.checked;
    document.getElementById('autoSlideLabel').textContent = enabled ? 'مفعل' : 'معطل';
}

// --- دوال الحفظ والإعادة ---

/**
 * *** الحل هنا: حفظ كل الإعدادات دفعة واحدة ***
 */
function handleSaveSettings() {
    // 1. جمع كل القيم الحالية من الصفحة
    const theme = document.getElementById('themeToggle').checked ? 'dark' : 'light';
    const primaryColor = document.getElementById('primaryColor').value;
    const siteName = document.getElementById('siteName').value.trim() || 'موقعي';
    const autoSlide = document.getElementById('autoSlide').checked.toString();

    // 2. حفظها في LocalStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('siteName', siteName);
    localStorage.setItem('autoSlide', autoSlide);

    // 3. تطبيق التغييرات على الصفحة الحالية (للتأكيد)
    applyTheme(theme);
    applyPrimaryColor(primaryColor);
    applySiteName(siteName);

    showToast('تم حفظ جميع الإعدادات بنجاح!', 'success');
}

function handleResetSettings() {
    if (!confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
        return;
    }

    // القيم الافتراضية
    const defaults = {
        theme: 'light',
        primaryColor: '#007bff',
        siteName: 'موقعي',
        autoSlide: 'true'
    };

    // حفظ وتطبيق القيم الافتراضية
    localStorage.setItem('theme', defaults.theme);
    localStorage.setItem('primaryColor', defaults.primaryColor);
    localStorage.setItem('siteName', defaults.siteName);
    localStorage.setItem('autoSlide', defaults.autoSlide);

    applyTheme(defaults.theme);
    applyPrimaryColor(defaults.primaryColor);
    applySiteName(defaults.siteName);

    // إعادة تحميل واجهة الإعدادات لتعكس التغييرات
    loadCurrentSettings();

    showToast('تم إعادة تعيين الإعدادات بنجاح!', 'success');
}
