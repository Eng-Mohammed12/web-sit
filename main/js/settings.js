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


// // Settings Page JavaScript

// document.addEventListener('DOMContentLoaded', function() {
//     initializeSettings();
//     loadCurrentSettings();
// });

// function initializeSettings() {
//     // Theme toggle
//     const themeToggle = document.getElementById('themeToggle');
//     if (themeToggle) {
//         themeToggle.addEventListener('change', handleThemeToggle);
//     }
    
//     // Primary color picker
//     const primaryColor = document.getElementById('primaryColor');
//     if (primaryColor) {
//         primaryColor.addEventListener('change', handlePrimaryColorChange);
//         primaryColor.addEventListener('input', debounce(handlePrimaryColorChange, 300));
//     }
    
//     // Preset colors
//     const presetColors = document.querySelectorAll('.preset-color');
//     presetColors.forEach(button => {
//         button.addEventListener('click', function() {
//             const color = this.dataset.color;
//             handlePresetColorSelection(color);
//         });
//     });
    
//     // Site name
//     const siteName = document.getElementById('siteName');
//     if (siteName) {
//         siteName.addEventListener('input', debounce(handleSiteNameChange, 500));
//         siteName.addEventListener('blur', handleSiteNameChange);
//     }
    
//     // Auto slide toggle
//     const autoSlide = document.getElementById('autoSlide');
//     if (autoSlide) {
//         autoSlide.addEventListener('change', handleAutoSlideToggle);
//     }
    
//     // Save settings button
//     const saveSettings = document.getElementById('saveSettings');
//     if (saveSettings) {
//         saveSettings.addEventListener('click', handleSaveSettings);
//     }
    
//     // Reset settings button
//     const resetSettings = document.getElementById('resetSettings');
//     if (resetSettings) {
//         resetSettings.addEventListener('click', handleResetSettings);
//     }
// }

// function loadCurrentSettings() {
//     // Load theme
//     const currentTheme = localStorage.getItem('theme') || 'light';
//     const themeToggle = document.getElementById('themeToggle');
//     const themeLabel = document.getElementById('themeLabel');
    
//     if (themeToggle) {
//         themeToggle.checked = currentTheme === 'dark';
//     }
    
//     if (themeLabel) {
//         themeLabel.textContent = currentTheme === 'dark' ? 'داكن' : 'فاتح';
//     }
    
//     // Load primary color
//     const currentColor = localStorage.getItem('primaryColor') || '#007bff';
//     const primaryColor = document.getElementById('primaryColor');
//     const colorPreview = document.getElementById('colorPreview');
    
//     if (primaryColor) {
//         primaryColor.value = currentColor;
//     }
    
//     if (colorPreview) {
//         colorPreview.style.backgroundColor = currentColor;
//     }
    
//     // Update preset color selection
//     updatePresetColorSelection(currentColor);
    
//     // Load site name
//     const currentSiteName = localStorage.getItem('siteName') || 'موقعي';
//     const siteName = document.getElementById('siteName');
    
//     if (siteName) {
//         siteName.value = currentSiteName;
//     }
    
//     // Load auto slide setting
//     const autoSlideEnabled = localStorage.getItem('autoSlide') !== 'false';
//     const autoSlide = document.getElementById('autoSlide');
//     const autoSlideLabel = document.getElementById('autoSlideLabel');
    
//     if (autoSlide) {
//         autoSlide.checked = autoSlideEnabled;
//     }
    
//     if (autoSlideLabel) {
//         autoSlideLabel.textContent = autoSlideEnabled ? 'مفعل' : 'معطل';
//     }
// }

// function handleThemeToggle() {
//     const themeToggle = document.getElementById('themeToggle');
//     const themeLabel = document.getElementById('themeLabel');
    
//     if (!themeToggle) return;
    
//     const newTheme = themeToggle.checked ? 'dark' : 'light';
    
//     // Apply theme immediately
//     applyTheme(newTheme);
    
//     // Update label
//     if (themeLabel) {
//         themeLabel.textContent = newTheme === 'dark' ? 'داكن' : 'فاتح';
//     }
    
//     // Show feedback
//     showToast(`تم تغيير المظهر إلى الوضع ${newTheme === 'dark' ? 'الداكن' : 'الفاتح'}`, 'success');
// }

// function handlePrimaryColorChange() {
//     const primaryColor = document.getElementById('primaryColor');
//     const colorPreview = document.getElementById('colorPreview');
    
//     if (!primaryColor) return;
    
//     const newColor = primaryColor.value;
    
//     // Apply color immediately
//     applyPrimaryColor(newColor);
    
//     // Update preview
//     if (colorPreview) {
//         colorPreview.style.backgroundColor = newColor;
//     }
    
//     // Update preset selection
//     updatePresetColorSelection(newColor);
// }

// function handlePresetColorSelection(color) {
//     const primaryColor = document.getElementById('primaryColor');
//     const colorPreview = document.getElementById('colorPreview');
    
//     // Update color picker
//     if (primaryColor) {
//         primaryColor.value = color;
//     }
    
//     // Apply color
//     applyPrimaryColor(color);
    
//     // Update preview
//     if (colorPreview) {
//         colorPreview.style.backgroundColor = color;
//     }
    
//     // Update preset selection
//     updatePresetColorSelection(color);
    
//     // Show feedback
//     showToast('تم تغيير اللون الأساسي', 'success');
// }

// function updatePresetColorSelection(selectedColor) {
//     const presetColors = document.querySelectorAll('.preset-color');
    
//     presetColors.forEach(button => {
//         if (button.dataset.color === selectedColor) {
//             button.classList.add('active');
//         } else {
//             button.classList.remove('active');
//         }
//     });
// }

// function handleSiteNameChange() {
//     const siteName = document.getElementById('siteName');
    
//     if (!siteName) return;
    
//     const newName = siteName.value.trim() || 'موقعي';
    
//     // Apply site name immediately
//     applySiteName(newName);
    
//     // Update input if it was empty
//     if (!siteName.value.trim()) {
//         siteName.value = newName;
//     }
// }

// function handleAutoSlideToggle() {
//     const autoSlide = document.getElementById('autoSlide');
//     const autoSlideLabel = document.getElementById('autoSlideLabel');
    
//     if (!autoSlide) return;
    
//     const enabled = autoSlide.checked;
    
//     // Save setting
//     localStorage.setItem('autoSlide', enabled.toString());
    
//     // Update label
//     if (autoSlideLabel) {
//         autoSlideLabel.textContent = enabled ? 'مفعل' : 'معطل';
//     }
    
//     // Show feedback
//     showToast(`تم ${enabled ? 'تفعيل' : 'إلغاء'} التشغيل التلقائي للشرائح`, 'success');
// }

// function handleSaveSettings() {
//     const saveBtn = document.getElementById('saveSettings');
//     const originalText = saveBtn.innerHTML;
    
//     // Show loading
//     addLoadingToButton(saveBtn, originalText);
    
//     // Simulate save process
//     setTimeout(() => {
//         // All settings are already saved in real-time, so just show confirmation
//         showToast('تم حفظ جميع الإعدادات بنجاح!', 'success', 3000);
        
//         // Remove loading
//         removeLoadingFromButton(saveBtn, originalText);
        
//         // Create success animation
//         createSuccessAnimation(saveBtn);
        
//     }, 1000);
// }

// function handleResetSettings() {
//     if (!confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟')) {
//         return;
//     }
    
//     const resetBtn = document.getElementById('resetSettings');
//     const originalText = resetBtn.innerHTML;
    
//     // Show loading
//     addLoadingToButton(resetBtn, originalText);
    
//     setTimeout(() => {
//         // Reset to default values
//         const defaultSettings = {
//             theme: 'light',
//             primaryColor: '#007bff',
//             siteName: 'موقعي',
//             autoSlide: 'true'
//         };
        
//         // Apply defaults
//         Object.keys(defaultSettings).forEach(key => {
//             localStorage.setItem(key, defaultSettings[key]);
//         });
        
//         // Apply changes
//         applyTheme(defaultSettings.theme);
//         applyPrimaryColor(defaultSettings.primaryColor);
//         applySiteName(defaultSettings.siteName);
        
//         // Reload settings UI
//         loadCurrentSettings();
        
//         // Remove loading
//         removeLoadingFromButton(resetBtn, originalText);
        
//         // Show success message
//         showToast('تم إعادة تعيين جميع الإعدادات بنجاح!', 'success', 3000);
        
//     }, 1500);
// }

// function createSuccessAnimation(button) {
//     const originalBg = button.style.backgroundColor;
//     const originalTransform = button.style.transform;
    
//     button.style.backgroundColor = 'var(--success-color)';
//     button.style.transform = 'scale(1.05)';
    
//     setTimeout(() => {
//         button.style.backgroundColor = originalBg;
//         button.style.transform = originalTransform;
//     }, 500);
// }

// // Export settings for other pages
// function exportSettings() {
//     return {
//         theme: localStorage.getItem('theme') || 'light',
//         primaryColor: localStorage.getItem('primaryColor') || '#007bff',
//         siteName: localStorage.getItem('siteName') || 'موقعي',
//         autoSlide: localStorage.getItem('autoSlide') !== 'false'
//     };
// }

// // Import settings from backup
// function importSettings(settings) {
//     try {
//         Object.keys(settings).forEach(key => {
//             localStorage.setItem(key, settings[key]);
//         });
        
//         // Apply imported settings
//         applyTheme(settings.theme);
//         applyPrimaryColor(settings.primaryColor);
//         applySiteName(settings.siteName);
        
//         // Reload UI
//         loadCurrentSettings();
        
//         showToast('تم استيراد الإعدادات بنجاح!', 'success');
//         return true;
//     } catch (error) {
//         console.error('Error importing settings:', error);
//         showToast('حدث خطأ في استيراد الإعدادات', 'error');
//         return false;
//     }
// }

// // Backup settings to file
// function backupSettings() {
//     const settings = exportSettings();
//     const dataStr = JSON.stringify(settings, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
//     const exportFileDefaultName = `website-settings-${new Date().toISOString().split('T')[0]}.json`;
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
    
//     showToast('تم تصدير الإعدادات بنجاح!', 'success');
// }

// // Add backup and restore buttons (if needed)
// function addBackupRestoreButtons() {
//     const settingsActions = document.querySelector('.settings-actions');
//     if (!settingsActions) return;
    
//     const backupBtn = document.createElement('button');
//     backupBtn.textContent = 'نسخ احتياطي';
//     backupBtn.className = 'backup-btn';
//     backupBtn.style.cssText = `
//         background-color: var(--info-color);
//         color: var(--white);
//         border: none;
//         padding: 12px 30px;
//         border-radius: var(--border-radius);
//         cursor: pointer;
//         font-size: 1rem;
//         transition: var(--transition);
//     `;
    
//     backupBtn.addEventListener('click', backupSettings);
//     settingsActions.appendChild(backupBtn);
    
//     const restoreBtn = document.createElement('button');
//     restoreBtn.textContent = 'استعادة';
//     restoreBtn.className = 'restore-btn';
//     restoreBtn.style.cssText = backupBtn.style.cssText.replace('var(--info-color)', 'var(--secondary-color)');
    
//     restoreBtn.addEventListener('click', () => {
//         const input = document.createElement('input');
//         input.type = 'file';
//         input.accept = '.json';
//         input.onchange = (e) => {
//             const file = e.target.files[0];
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onload = (e) => {
//                     try {
//                         const settings = JSON.parse(e.target.result);
//                         importSettings(settings);
//                     } catch (error) {
//                         showToast('ملف الإعدادات غير صحيح', 'error');
//                     }
//                 };
//                 reader.readAsText(file);
//             }
//         };
//         input.click();
//     });
    
//     settingsActions.appendChild(restoreBtn);
// }
// // Settings Page JavaScript

// document.addEventListener('DOMContentLoaded', function() {
//     initializeSettingsPage();
//     loadCurrentSettings();
// });

// function initializeSettingsPage() {
//     // عناصر التحكم في المظهر
//     document.getElementById('themeToggle')?.addEventListener('change', handleThemeToggle);
//     document.getElementById('primaryColor')?.addEventListener('input', handlePrimaryColorChange);
//     document.querySelectorAll('.preset-color').forEach(button => {
//         button.addEventListener('click', (e) => handlePresetColorSelection(e.target.dataset.color));
//     });

//     // عناصر التحكم العامة
//     document.getElementById('siteName')?.addEventListener('input', handleSiteNameChange);
//     document.getElementById('autoSlide')?.addEventListener('change', handleAutoSlideToggle);

//     // أزرار الحفظ والإعادة
//     document.getElementById('saveSettings')?.addEventListener('click', handleSaveSettings);
//     document.getElementById('resetSettings')?.addEventListener
// }

// // Initialize backup/restore if needed
// // document.addEventListener('DOMContentLoaded', addBackupRestoreButtons);

// // Make functions available globally
// window.settingsUtils = {
//     exportSettings,
//     importSettings,
//     backupSettings
// };

