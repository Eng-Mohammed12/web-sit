// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
});

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;

    // التحقق من الحقول
    if (name.length < 2) {
        showFieldError('name', 'الاسم مطلوب');
        isValid = false;
    } else {
        clearFieldError('name');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFieldError('email', 'البريد الإلكتروني غير صحيح');
        isValid = false;
    } else {
        clearFieldError('email');
    }

    if (message.length < 10) {
        showFieldError('message', 'الرسالة يجب أن تكون 10 أحرف على الأقل');
        isValid = false;
    } else {
        clearFieldError('message');
    }

    if (!isValid) {
        showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
        return;
    }

    // تجهيز بيانات الرسالة
    const messageData = {
        id: generateId(),
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        status: 'unread'
    };

    // حفظ الرسالة في LocalStorage
    const messages = getFromLocalStorage('contactMessages') || [];
    messages.unshift(messageData);
    saveToLocalStorage('contactMessages', messages);

    // *** الحل هنا: إظهار نافذة النجاح المخصصة ***
    showSuccessModal(name);
    e.target.reset();
}
function showSuccessModal(userName) {
    const oldModal = document.querySelector('.success-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center;
        align-items: center; z-index: 3000; opacity: 0; transition: opacity 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: var(--bg-color); color: var(--text-color); padding: 2rem; border-radius: var(--border-radius); text-align: center; max-width: 400px; width: 90%; transform: scale(0.9); transition: transform 0.3s ease;">
            <!-- *** الحل هنا: إضافة أيقونة الصح *** -->
            <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--success-color); color: white; font-size: 3rem; line-height: 70px; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center;">✓</div>
            <h2 style="margin-bottom: 1rem;">شكراً لك، ${userName}!</h2>
            <p style="color: var(--secondary-color); margin-bottom: 2rem;">تم استلام رسالتك بنجاح. سنتواصل معك قريباً.</p>
            <button class="close-success-btn" style="background: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">حسناً</button>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    }, 10);

    const close = () => {
        modal.style.opacity = '0';
        modal.querySelector('div').style.transform = 'scale(0.9)';
        setTimeout(() => modal.remove(), 300);
    };

    modal.querySelector('.close-success-btn').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}
