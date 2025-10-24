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

/**
 * دالة لإنشاء وإظهار نافذة النجاح المنبثقة.
 */
// function showSuccessModal(userName) {
//     // إزالة أي نافذة قديمة أولاً
//     const oldModal = document.querySelector('.success-modal');
//     if (oldModal) oldModal.remove();

//     const modal = document.createElement('div');
//     modal.className = 'success-modal';
//     modal.style.cssText = `
//         position: fixed; top: 0; left: 0; width: 100%; height: 100%;
//         background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center;
//         align-items: center; z-index: 3000; opacity: 0; transition: opacity 0.3s ease;
//     `;
    
//     modal.innerHTML = `
//         <div style="background: var(--bg-color); color: var(--text-color); padding: 2rem; border-radius: var(--border-radius); text-align: center; max-width: 400px; transform: scale(0.9); transition: transform 0.3s ease;">
//             <h2 style="margin-bottom: 1rem;">شكراً لك، ${userName}!</h2>
//             <p style="margin-bottom: 2rem;">تم استلام رسالتك بنجاح. سنتواصل معك قريباً.</p>
//             <button class="close-success-btn" style="background: var(--primary-color); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">حسناً</button>
//         </div>
//     `;

//     document.body.appendChild(modal);

//     // إظهار النافذة مع تأثير بسيط
//     setTimeout(() => {
//         modal.style.opacity = '1';
//         modal.querySelector('div').style.transform = 'scale(1)';
//     }, 10);

//     // وظيفة إغلاق النافذة
//     const close = () => {
//         modal.style.opacity = '0';
//         modal.querySelector('div').style.transform = 'scale(0.9)';
//         setTimeout(() => modal.remove(), 300);
//     };

//     modal.querySelector('.close-success-btn').addEventListener('click', close);
//     modal.addEventListener('click', (e) => {
//         if (e.target === modal) close();
//     });
// }


// // Contact Page JavaScript

// document.addEventListener('DOMContentLoaded', function() {
//     const contactForm = document.getElementById('contactForm');
//     if (contactForm) {
//         contactForm.addEventListener('submit', handleContactFormSubmit);
//     }
// });

// function handleContactFormSubmit(e) {
//     e.preventDefault();
    
//     const name = document.getElementById('name').value.trim();
//     const email = document.getElementById('email').value.trim();
//     const message = document.getElementById('message').value.trim();
//     let isValid = true;

//     // التحقق من الحقول
//     if (name.length < 2) {
//         showFieldError('name', 'الاسم مطلوب');
//         isValid = false;
//     } else {
//         clearFieldError('name');
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         showFieldError('email', 'البريد الإلكتروني غير صحيح');
//         isValid = false;
//     } else {
//         clearFieldError('email');
//     }

//     if (message.length < 10) {
//         showFieldError('message', 'الرسالة يجب أن تكون 10 أحرف على الأقل');
//         isValid = false;
//     } else {
//         clearFieldError('message');
//     }

//     if (!isValid) {
//         showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
//         return;
//     }

//     // تجهيز بيانات الرسالة
//     const messageData = {
//         id: generateId(),
//         name,
//         email,
//         message,
//         timestamp: new Date().toISOString(),
//         status: 'unread' // حالة الرسالة: غير مقروءة
//     };

//     // حفظ الرسالة في LocalStorage
//     const messages = getFromLocalStorage('contactMessages') || [];
//     messages.unshift(messageData); // إضافة الرسالة الجديدة في البداية
//     saveToLocalStorage('contactMessages', messages);

//     showToast('تم إرسال رسالتك بنجاح!', 'success');
//     e.target.reset();
// }


// // // Contact Page JavaScript

// // document.addEventListener('DOMContentLoaded', function() {
// //     initializeContactForm();
// // });

// // function initializeContactForm() {
// //     const contactForm = document.getElementById('contactForm');
// //     if (!contactForm) return;
    
// //     // Add real-time validation
// //     const fields = ['name', 'email', 'message'];
// //     fields.forEach(fieldId => {
// //         const field = document.getElementById(fieldId);
// //         if (field) {
// //             field.addEventListener('blur', () => validateField(fieldId));
// //             field.addEventListener('input', () => clearFieldError(fieldId));
// //         }
// //     });
    
// //     // Handle form submission
// //     contactForm.addEventListener('submit', handleFormSubmission);
// // }

// // function validateField(fieldId) {
// //     const field = document.getElementById(fieldId);
// //     if (!field) return false;
    
// //     const value = field.value.trim();
// //     let isValid = true;
// //     let errorMessage = '';
    
// //     switch (fieldId) {
// //         case 'name':
// //             if (!validateRequired(value)) {
// //                 errorMessage = 'الاسم مطلوب';
// //                 isValid = false;
// //             } else if (!validateMinLength(value, 2)) {
// //                 errorMessage = 'الاسم يجب أن يكون أكثر من حرفين';
// //                 isValid = false;
// //             } else if (!validateName(value)) {
// //                 errorMessage = 'الاسم يجب أن يحتوي على أحرف فقط';
// //                 isValid = false;
// //             }
// //             break;
            
// //         case 'email':
// //             if (!validateRequired(value)) {
// //                 errorMessage = 'البريد الإلكتروني مطلوب';
// //                 isValid = false;
// //             } else if (!validateEmail(value)) {
// //                 errorMessage = 'البريد الإلكتروني غير صحيح';
// //                 isValid = false;
// //             }
// //             break;
            
// //         case 'message':
// //             if (!validateRequired(value)) {
// //                 errorMessage = 'الرسالة مطلوبة';
// //                 isValid = false;
// //             } else if (!validateMinLength(value, 10)) {
// //                 errorMessage = 'الرسالة يجب أن تكون أكثر من 10 أحرف';
// //                 isValid = false;
// //             } else if (value.length > 1000) {
// //                 errorMessage = 'الرسالة يجب أن تكون أقل من 1000 حرف';
// //                 isValid = false;
// //             }
// //             break;
// //     }
    
// //     if (!isValid) {
// //         showFieldError(fieldId, errorMessage);
// //     } else {
// //         clearFieldError(fieldId);
// //     }
    
// //     return isValid;
// // }

// // function validateName(name) {
// //     // Allow Arabic and English letters, spaces, and common name characters
// //     const nameRegex = /^[\u0600-\u06FFa-zA-Z\s\-'\.]+$/;
// //     return nameRegex.test(name);
// // }

// // function validateAllFields() {
// //     const fields = ['name', 'email', 'message'];
// //     let allValid = true;
    
// //     fields.forEach(fieldId => {
// //         if (!validateField(fieldId)) {
// //             allValid = false;
// //         }
// //     });
    
// //     return allValid;
// // }

// // function handleFormSubmission(e) {
// //     e.preventDefault();
    
// //     // Clear previous errors
// //     clearAllErrors(['name', 'email', 'message']);
    
// //     // Validate all fields
// //     if (!validateAllFields()) {
// //         showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
// //         return;
// //     }
    
// //     // Get form data
// //     // const formData = {
// //     //     name: document.getElementById('name').value.trim(),
// //     //     email: document.getElementById('email').value.trim(),
// //     //     message: document.getElementById('message').value.trim(),
// //     //     timestamp: new Date().toISOString(),
// //     //     id: generateId()
// //     // };
// //     const formData = {
// //       id: generateId(),
// //       name: document.getElementById('name').value.trim(),
// //       email: document.getElementById('email').value.trim(),
// //       message: document.getElementById('message').value.trim(),
// //       timestamp: new Date().toISOString(),
// //       status: 'unread', // <-- الحالة الجديدة
// //     };
    
// //     // Show loading state
// //     const submitBtn = document.querySelector('.submit-btn');
// //     const originalText = submitBtn.innerHTML;
// //     addLoadingToButton(submitBtn, originalText);
    
// //     // Simulate form submission (in real app, this would be an API call)
// //     setTimeout(() => {
// //         // Save message to localStorage (for demo purposes)
// //         saveContactMessage(formData);
        
// //         // Show success message
// //         showSuccessMessage(formData.name);
        
// //         // Reset form
// //         document.getElementById('contactForm').reset();
        
// //         // Remove loading state
// //         removeLoadingFromButton(submitBtn, originalText);
        
// //         // Show success toast
// //         showToast('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success', 5000);
        
// //     }, 2000); // Simulate network delay
// // }

// // function saveContactMessage(messageData) {
// //     // Get existing messages
// //     let messages = getFromLocalStorage('contactMessages') || [];
    
// //     // Add new message
// //     messages.unshift(messageData);
    
// //     // Keep only last 50 messages
// //     if (messages.length > 50) {
// //         messages = messages.slice(0, 50);
// //     }
    
// //     // Save back to localStorage
// //     saveToLocalStorage('contactMessages', messages);
// // }

// // function showSuccessMessage(userName) {
// //     // Create and show a modal or toast with personalized message
// //     const modal = createSuccessModal(userName);
// //     document.body.appendChild(modal);
    
// //     // Show modal
// //     setTimeout(() => {
// //         modal.style.opacity = '1';
// //         modal.style.transform = 'scale(1)';
// //     }, 100);
    
// //     // Auto-close after 5 seconds
// //     setTimeout(() => {
// //         closeSuccessModal(modal);
// //     }, 5000);
// // }

// // function createSuccessModal(userName) {
// //     const modal = document.createElement('div');
// //     modal.className = 'success-modal';
// //     modal.style.cssText = `
// //         position: fixed;
// //         top: 0;
// //         left: 0;
// //         width: 100%;
// //         height: 100%;
// //         background: rgba(0, 0, 0, 0.5);
// //         display: flex;
// //         justify-content: center;
// //         align-items: center;
// //         z-index: 3000;
// //         opacity: 0;
// //         transform: scale(0.8);
// //         transition: all 0.3s ease;
// //     `;
    
// //     modal.innerHTML = `
// //         <div class="success-content" style="
// //             background: var(--white);
// //             padding: 3rem;
// //             border-radius: var(--border-radius);
// //             text-align: center;
// //             max-width: 500px;
// //             margin: 0 20px;
// //             box-shadow: var(--shadow);
// //         ">
// //             <div style="
// //                 width: 80px;
// //                 height: 80px;
// //                 background: var(--success-color);
// //                 border-radius: 50%;
// //                 display: flex;
// //                 align-items: center;
// //                 justify-content: center;
// //                 margin: 0 auto 2rem;
// //                 font-size: 2.5rem;
// //             ">✓</div>
// //             <h2 style="color: var(--text-color); margin-bottom: 1rem;">شكراً لك ${userName}!</h2>
// //             <p style="color: var(--secondary-color); margin-bottom: 2rem;">
// //                 تم استلام رسالتك بنجاح. سنقوم بالرد عليك في أقرب وقت ممكن.
// //             </p>
// //             <button class="close-success-btn" style="
// //                 background: var(--primary-color);
// //                 color: white;
// //                 border: none;
// //                 padding: 12px 24px;
// //                 border-radius: var(--border-radius);
// //                 cursor: pointer;
// //                 font-size: 1rem;
// //                 transition: var(--transition);
// //             ">حسناً</button>
// //         </div>
// //     `;
    
// //     // Add close event listener
// //     const closeBtn = modal.querySelector('.close-success-btn');
// //     closeBtn.addEventListener('click', () => closeSuccessModal(modal));
    
// //     // Close on backdrop click
// //     modal.addEventListener('click', (e) => {
// //         if (e.target === modal) {
// //             closeSuccessModal(modal);
// //         }
// //     });
    
// //     return modal;
// // }

// // function closeSuccessModal(modal) {
// //     modal.style.opacity = '0';
// //     modal.style.transform = 'scale(0.8)';
    
// //     setTimeout(() => {
// //         if (modal.parentNode) {
// //             modal.parentNode.removeChild(modal);
// //         }
// //     }, 300);
// // }

// // // Character counter for message field
// // function initializeCharacterCounter() {
// //     const messageField = document.getElementById('message');
// //     if (!messageField) return;
    
// //     const maxLength = 1000;
// //     const counter = document.createElement('div');
// //     counter.className = 'character-counter';
// //     counter.style.cssText = `
// //         text-align: left;
// //         font-size: 0.9rem;
// //         color: var(--secondary-color);
// //         margin-top: 0.5rem;
// //     `;
    
// //     messageField.parentNode.appendChild(counter);
    
// //     function updateCounter() {
// //         const currentLength = messageField.value.length;
// //         counter.textContent = `${currentLength}/${maxLength}`;
        
// //         if (currentLength > maxLength * 0.9) {
// //             counter.style.color = 'var(--warning-color)';
// //         } else if (currentLength > maxLength) {
// //             counter.style.color = 'var(--danger-color)';
// //         } else {
// //             counter.style.color = 'var(--secondary-color)';
// //         }
// //     }
    
// //     messageField.addEventListener('input', updateCounter);
// //     updateCounter(); // Initial count
// // }

// // // Auto-resize textarea
// // function initializeAutoResize() {
// //     const messageField = document.getElementById('message');
// //     if (!messageField) return;
    
// //     function autoResize() {
// //         messageField.style.height = 'auto';
// //         messageField.style.height = messageField.scrollHeight + 'px';
// //     }
    
// //     messageField.addEventListener('input', autoResize);
// //     messageField.addEventListener('focus', autoResize);
// // }

// // // Initialize additional features
// // document.addEventListener('DOMContentLoaded', function() {
// //     initializeCharacterCounter();
// //     initializeAutoResize();
// // });

// // // Export functions for potential use in other scripts
// // window.contactFormUtils = {
// //     validateField,
// //     validateAllFields,
// //     saveContactMessage,
// //     showSuccessMessage
// // };

