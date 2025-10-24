// Add/Edit Data Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addDataForm');
    const imageInput = document.getElementById('itemImageFile');
    const imagePreview = document.getElementById('imagePreview');
    const editItemId = localStorage.getItem('editItemId');

    // معالجة معاينة الصورة
    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // التحقق إذا كنا في وضع التعديل
    if (editItemId) {
        document.querySelector('h1').textContent = 'تعديل المنتج';
        const data = getFromLocalStorage('dashboardData') || [];
        const itemToEdit = data.find(item => item.id == editItemId);

        if (itemToEdit) {
            document.getElementById('itemName').value = itemToEdit.name;
            document.getElementById('itemDescription').value = itemToEdit.description;
            document.getElementById('itemValue').value = itemToEdit.value;
            document.getElementById('showInSlider').checked = itemToEdit.showInSlider;
            
            imagePreview.src = itemToEdit.image;
            imagePreview.style.display = 'block';
            
            // في وضع التعديل، الصورة ليست مطلوبة إجبارياً
            imageInput.required = false;
        }
    }

    form.addEventListener('submit', handleSave);
});

function handleSave(e) {
    e.preventDefault();
    const editItemId = localStorage.getItem('editItemId');
    const imageFile = document.getElementById('itemImageFile').files[0];

    // في وضع الإضافة، الصورة مطلوبة
    if (!editItemId && !imageFile) {
        showToast('يرجى اختيار صورة للمنتج', 'error');
        return;
    }

    if (imageFile) {
        // إذا تم اختيار صورة جديدة (سواء في الإضافة أو التعديل)
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => {
            saveData(reader.result); // reader.result هو نص Base64
        };
        reader.onerror = () => {
            showToast('حدث خطأ أثناء قراءة الصورة', 'error');
        };
    } else {
        // هذا يحدث فقط في وضع التعديل إذا لم يتم تغيير الصورة
        const data = getFromLocalStorage('dashboardData') || [];
        const itemToEdit = data.find(item => item.id == editItemId);
        if (itemToEdit) {
            saveData(itemToEdit.image); // استخدم الصورة القديمة
        }
    }
}

function saveData(imageBase64) {
    const editItemId = localStorage.getItem('editItemId');
    let data = getFromLocalStorage('dashboardData') || [];

    const name = document.getElementById('itemName').value;
    const description = document.getElementById('itemDescription').value;
    const value = document.getElementById('itemValue').value;

    if (!name || !description || !value) {
        showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }

    if (editItemId) {
        // وضع التعديل
        const itemIndex = data.findIndex(item => item.id == editItemId);
        if (itemIndex > -1) {
            data[itemIndex].name = name;
            data[itemIndex].description = description;
            data[itemIndex].value = value;
            data[itemIndex].image = imageBase64;
            data[itemIndex].showInSlider = document.getElementById('showInSlider').checked;
            data[itemIndex].updatedAt = new Date().toISOString();
        }
        localStorage.removeItem('editItemId'); // تنظيف بعد الحفظ
        showToast('تم تحديث المنتج بنجاح!', 'success');
    } else {
        // وضع الإضافة
        const newItem = {
            id: generateId(),
            name,
            description,
            value,
            image: imageBase64,
            showInSlider: document.getElementById('showInSlider').checked,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.push(newItem);
        showToast('تمت إضافة المنتج بنجاح!', 'success');
    }

    saveToLocalStorage('dashboardData', data);
    
    // الانتقال إلى صفحة العرض بعد ثانية
    setTimeout(() => { window.location.href = 'overview.html'; }, 1000);
}



// // Add Data Page JavaScript
// document.addEventListener('DOMContentLoaded', function () {
//   initializeAddDataForm();
//   // initializePreview(); // يمكنك إزالة هذه إذا لم تعد تستخدمها

//   // كود جديد لمعاينة الصورة المختارة
//   const imageInput = document.getElementById('itemImageFile');
//   const imagePreview = document.getElementById('imagePreview');
//     const form = document.getElementById('addDataForm');
//     const editItemId = localStorage.getItem('editItemId');


//   // if (imageInput) {
//   //   imageInput.addEventListener('change', function () {
//   //     const file = this.files[0];
//   //     if (file) {
//   //       const reader = new FileReader();
//   //       reader.onload = function (e) {
//   //         imagePreview.src = e.target.result;
//   //         imagePreview.style.display = 'block';
//   //       };
//   //       reader.readAsDataURL(file); // تحويل الصورة إلى Base64 للمعاينة
//   //     }
//    imageInput.addEventListener('change', function() {
//         const file = this.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = e => {
//                 imagePreview.src = e.target.result;
//                 imagePreview.style.display = 'block';
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     // التحقق إذا كنا في وضع التعديل
//     if (editItemId) {
//         document.querySelector('h1').textContent = 'تعديل المنتج';
//         const data = getFromLocalStorage('dashboardData') || [];
//         const itemToEdit = data.find(item => item.id == editItemId);

//         if (itemToEdit) {
//             document.getElementById('itemName').value = itemToEdit.name;
//             document.getElementById('itemDescription').value = itemToEdit.description;
//             document.getElementById('itemValue').value = itemToEdit.value;
//             document.getElementById('showInSlider').checked = itemToEdit.showInSlider;
            
//             // إظهار الصورة الحالية
//             imagePreview.src = itemToEdit.image;
//             imagePreview.style.display = 'block';
            
//             // جعل حقل الصورة اختيارياً
//             imageInput.required = false;
//         }
//     }

//     form.addEventListener('submit', handleSave);
// });

// // function handleSave(e) {
// //     e.preventDefault();
// //     const editItemId = localStorage.getItem('editItemId');
// //     const imageFile = document.getElementById('itemImageFile').files[0];

// //     // إذا كان في وضع الإضافة والصورة غير موجودة
// //     if (!editItemId && !imageFile) {
// //         showToast('يرجى اختيار صورة للمنتج', 'error');
// //         return;
// //     }

// //     if (imageFile) {
// //         // إذا تم اختيار صورة جديدة (في وضع الإضافة أو التعديل)
// //         const reader = new FileReader();
// //         reader.readAsDataURL(imageFile);
// //         reader.onload = () => {
// //             saveData(reader.result); // reader.result هو نص Base64
// //         };
// //     } else {
// //         // إذا كان في وضع التعديل ولم يتم اختيار صورة جديدة
// //         const data = getFromLocalStorage('dashboardData') || [];
// //         const itemToEdit = data.find(item => item.id == editItemId);
// //         saveData(itemToEdit.image); // استخدم الصورة القديمة
// //     }
// // }

// // function saveData(imageBase64) {
// //     const editItemId = localStorage.getItem('editItemId');
// //     let data = getFromLocalStorage('dashboardData') || [];

// //     const itemData = {
// //         id: editItemId ? Number(editItemId) : Date.now(),
// //         name: document.getElementById('itemName').value,
// //         description: document.getElementById('itemDescription').value,
// //         value: document.getElementById('itemValue').value,
// //         showInSlider: document.getElementById('showInSlider').checked,
// //         image: imageBase64, // الصورة الجديدة أو القديمة
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString()
// //     };

// //     if (editItemId) {
// //         const itemIndex = data.findIndex(item => item.id == editItemId);
// //         data[itemIndex] = itemData;
// //         localStorage.removeItem('editItemId');
// //         showToast('تم تحديث المنتج بنجاح!', 'success');
// //     } else {
// //         data.push(itemData);
// //         showToast('تمت إضافة المنتج بنجاح!', 'success');
// //     }

// //     saveToLocalStorage('dashboardData', data);
// //     setTimeout(() => { window.location.href = 'overview.html'; }, 1000);
// // }

// // document.addEventListener('DOMContentLoaded', function() {
// //     initializeAddDataForm();
// //     initializePreview();
// // });
// function handleSave(e) {
//   e.preventDefault();
//   const editItemId = localStorage.getItem('editItemId');
//   const imageFile = document.getElementById('itemImageFile').files[0];

//   // يمكنك إضافة دالة التحقق من الحقول هنا إذا أردت
//   // if (!validateAllFields()) {
//   //     showToast('يرجى ملء الحقول المطلوبة', 'error');
//   //     return;
//   // }

//   if (!editItemId && !imageFile) {
//     showToast('يرجى اختيار صورة للمنتج', 'error');
//     return;
//   }

//   if (imageFile) {
//     const reader = new FileReader();
//     reader.readAsDataURL(imageFile);
//     reader.onload = () => saveData(reader.result); // حفظ مع الصورة الجديدة
//   } else {
//     // هذا الجزء يعمل فقط في وضع التعديل
//     const itemToEdit = (getFromLocalStorage('dashboardData') || []).find(
//       (item) => item.id == editItemId,
//     );
//     if (itemToEdit) {
//       saveData(itemToEdit.image); // حفظ مع الصورة القديمة
//     }
//   }
// }

// function saveData(imageBase64) {
//   const editItemId = localStorage.getItem('editItemId');
//   let data = getFromLocalStorage('dashboardData') || [];

//   // استعادة تاريخ الإنشاء الأصلي عند التعديل
//   let createdAt = new Date().toISOString();
//   if (editItemId) {
//     const oldItem = data.find((i) => i.id == editItemId);
//     if (oldItem) createdAt = oldItem.createdAt;
//   }

//   const itemData = {
//     id: editItemId ? Number(editItemId) : generateId(),
//     name: document.getElementById('itemName').value,
//     description: document.getElementById('itemDescription').value,
//     value: document.getElementById('itemValue').value,
//     showInSlider: document.getElementById('showInSlider').checked,
//     image: imageBase64,
//     createdAt: createdAt,
//     updatedAt: new Date().toISOString(),
//   };

//   if (editItemId) {
//     const itemIndex = data.findIndex((item) => item.id == editItemId);
//     data[itemIndex] = itemData;
//     localStorage.removeItem('editItemId');
//     showToast('تم تحديث المنتج بنجاح!', 'success');
//   } else {
//     // استخدم دالة saveDataItem الموجودة لديك للإضافة
//     saveDataItem(itemData); // هذا يفترض أن دالتك تضيف العنصر وتحفظ
//     showToast('تمت إضافة المنتج بنجاح!', 'success');
//   }

//   // إذا لم تكن دالة saveDataItem تحفظ، استخدم هذا السطر بدلاً منها
//   if (!editItemId) saveToLocalStorage('dashboardData', data);

//   setTimeout(() => {
//     window.location.href = 'overview.html';
//   }, 1000);
// }
// function initializeAddDataForm() {
//     const form = document.getElementById('addDataForm');
//     if (!form) return;
    
//     // Add real-time validation
//     const fields = ['itemName', 'itemDescription', 'itemValue'];
//     fields.forEach(fieldId => {
//         const field = document.getElementById(fieldId);
//         if (field) {
//             field.addEventListener('blur', () => validateField(fieldId));
//             field.addEventListener('input', () => {
//                 clearFieldError(fieldId);
//                 updatePreview();
//             });
//         }
//     });
    
//     // Handle form submission
//     // form.addEventListener('submit', handleAddDataSubmission);
//     form.addEventListener('submit', handleSave);

//     // Initialize preview
//     updatePreview();
// }

// function validateField(fieldId) {
//     const field = document.getElementById(fieldId);
//     if (!field) return false;
    
//     const value = field.value.trim();
//     let isValid = true;
//     let errorMessage = '';
    
//     switch (fieldId) {
//         case 'itemName':
//             if (!validateRequired(value)) {
//                 errorMessage = 'اسم العنصر مطلوب';
//                 isValid = false;
//             } else if (!validateMinLength(value, 2)) {
//                 errorMessage = 'اسم العنصر يجب أن يكون أكثر من حرفين';
//                 isValid = false;
//             } else if (value.length > 100) {
//                 errorMessage = 'اسم العنصر يجب أن يكون أقل من 100 حرف';
//                 isValid = false;
//             }
//             break;
            
//         case 'itemDescription':
//             if (!validateRequired(value)) {
//                 errorMessage = 'الوصف مطلوب';
//                 isValid = false;
//             } else if (!validateMinLength(value, 10)) {
//                 errorMessage = 'الوصف يجب أن يكون أكثر من 10 أحرف';
//                 isValid = false;
//             } else if (value.length > 500) {
//                 errorMessage = 'الوصف يجب أن يكون أقل من 500 حرف';
//                 isValid = false;
//             }
//             break;
            
//         case 'itemValue':
//             const numValue = parseFloat(value);
//             if (!validateRequired(value)) {
//                 errorMessage = 'القيمة مطلوبة';
//                 isValid = false;
//             } else if (!validateNumber(numValue)) {
//                 errorMessage = 'القيمة يجب أن تكون رقم صحيح';
//                 isValid = false;
//             } else if (numValue <= 0) {
//                 errorMessage = 'القيمة يجب أن تكون أكبر من صفر';
//                 isValid = false;
//             } else if (numValue > 999999999) {
//                 errorMessage = 'القيمة كبيرة جداً';
//                 isValid = false;
//             }
//             break;
//     }
    
//     if (!isValid) {
//         showFieldError(fieldId, errorMessage);
//     } else {
//         clearFieldError(fieldId);
//     }
    
//     return isValid;
// }

// function validateAllFields() {
//     const fields = ['itemName', 'itemDescription', 'itemValue'];
//     let allValid = true;
    
//     fields.forEach(fieldId => {
//         if (!validateField(fieldId)) {
//             allValid = false;
//         }
//     });
    
//     return allValid;
// }

// // function handleAddDataSubmission(e) {
// //     e.preventDefault();
    
// //     // Clear previous errors
// //     clearAllErrors(['itemName', 'itemDescription', 'itemValue']);
    
// //     // Validate all fields
// //     if (!validateAllFields()) {
// //         showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
// //         return;
// //     }
    
// //     // Check for duplicate names
// //     const name = document.getElementById('itemName').value.trim();
// //     if (isDuplicateName(name)) {
// //         showFieldError('itemName', 'يوجد عنصر بنفس الاسم مسبقاً');
// //         showToast('اسم العنصر موجود مسبقاً', 'error');
// //         return;
// //     }
    
// //     // Get form data
// //     const formData = {
// //         id: generateId(),
// //         name: name,
// //         description: document.getElementById('itemDescription').value.trim(),
// //         value: parseFloat(document.getElementById('itemValue').value),
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString()
// //     };
    
// //     // Show loading state
// //     const submitBtn = document.querySelector('.submit-btn');
// //     const originalText = submitBtn.innerHTML;
// //     addLoadingToButton(submitBtn, originalText);
    
// //     // Simulate saving process
// //     setTimeout(() => {
// //         // Save to localStorage
// //         if (saveDataItem(formData)) {
// //             // Show success message
// //             showToast('تم حفظ البيانات بنجاح!', 'success');
            
// //             // Reset form
// //             document.getElementById('addDataForm').reset();
// //             updatePreview();
            
// //             // Redirect to overview after a short delay
// //             setTimeout(() => {
// //                 window.location.href = 'overview.html';
// //             }, 2000);
// //         } else {
// //             showToast('حدث خطأ في حفظ البيانات', 'error');
// //         }
        
// //         // Remove loading state
// //         removeLoadingFromButton(submitBtn, originalText);
        
// //     }, 1500); // Simulate network delay
// // }

// // === استبدل دالة handleAddDataSubmission بالكامل بهذه النسخة ===




// // function handleAddDataSubmission(e) {
// //     e.preventDefault();

// //     // يمكنك الاحتفاظ بالتحقق المتقدم من صحة الحقول
// //     if (!validateAllFields()) { // افترض أن هذه الدالة لديك
// //         showToast('يرجى تصحيح الأخطاء في النموذج', 'error');
// //         return;
// //     }

// //     const imageFile = document.getElementById('itemImageFile').files[0];
// //     if (!imageFile) {
// //         showToast('يرجى اختيار صورة للمنتج', 'error');
// //         return;
// //     }

// //     const submitBtn = document.querySelector('.submit-btn');
// //     const originalText = submitBtn.innerHTML;
// //     addLoadingToButton(submitBtn, originalText);

// //     // تحويل الصورة إلى Base64 قبل الحفظ
// //     const reader = new FileReader();
// //     reader.readAsDataURL(imageFile);
// //     reader.onload = function () {
// //         // الآن لدينا الصورة كنص Base64 في reader.result
// //         const imageBase64 = reader.result;

// //         // جهّز بيانات المنتج للحفظ
// //         const formData = {
// //             id: generateId(), // استخدم دالتك لتوليد ID
// //             name: document.getElementById('itemName').value.trim(),
// //             description: document.getElementById('itemDescription').value.trim(),
// //             value: parseFloat(document.getElementById('itemValue').value),
// //             image: imageBase64, // <-- حفظ الصورة كنص Base64
// //             showInSlider: document.getElementById('showInSlider').checked,
// //             createdAt: new Date().toISOString(),
// //             updatedAt: new Date().toISOString()
// //         };

// //         // حفظ البيانات في LocalStorage
// //         if (saveDataItem(formData)) { // افترض أن هذه الدالة لديك
// //             showToast('تم حفظ البيانات بنجاح!', 'success');
// //             document.getElementById('addDataForm').reset();
// //             setTimeout(() => {
// //                 window.location.href = 'overview.html';
// //             }, 2000);
// //         } else {
// //             showToast('حدث خطأ في حفظ البيانات', 'error');
// //         }
        
// //         removeLoadingFromButton(submitBtn, originalText);
// //     };

// //     reader.onerror = function (error) {
// //         console.error('Error reading file: ', error);
// //         showToast('حدث خطأ أثناء قراءة الصورة', 'error');
// //         removeLoadingFromButton(submitBtn, originalText);
// //     };
// // }

// function isDuplicateName(name) {
//     const existingData = getFromLocalStorage('dashboardData') || [];
//     return existingData.some(item => item.name.toLowerCase() === name.toLowerCase());
// }

// function saveDataItem(itemData) {
//     try {
//         // Get existing data
//         let data = getFromLocalStorage('dashboardData') || [];
        
//         // Add new item
//         data.unshift(itemData);
        
//         // Keep only last 100 items to prevent localStorage overflow
//         if (data.length > 100) {
//             data = data.slice(0, 100);
//         }
        
//         // Save back to localStorage
//         return saveToLocalStorage('dashboardData', data);
//     } catch (error) {
//         console.error('Error saving data item:', error);
//         return false;
//     }
// }

// function initializePreview() {
//     const previewSection = document.getElementById('previewSection');
//     if (!previewSection) return;
    
//     // Show preview section
//     previewSection.style.display = 'block';
    
//     // Update preview initially
//     updatePreview();
// }

// function updatePreview() {
//     const name = document.getElementById('itemName').value.trim();
//     const description = document.getElementById('itemDescription').value.trim();
//     const value = document.getElementById('itemValue').value;
    
//     const previewName = document.getElementById('previewName');
//     const previewDescription = document.getElementById('previewDescription');
//     const previewValue = document.getElementById('previewValue');
    
//     if (previewName) {
//         previewName.textContent = name || 'اسم العنصر';
//     }
    
//     if (previewDescription) {
//         previewDescription.textContent = description || 'وصف العنصر';
//     }
    
//     if (previewValue) {
//         if (value && !isNaN(parseFloat(value))) {
//             previewValue.textContent = formatNumber(parseFloat(value));
//         } else {
//             previewValue.textContent = '0.00';
//         }
//     }
    
//     // Show/hide preview based on content
//     const previewSection = document.getElementById('previewSection');
//     if (previewSection) {
//         const hasContent = name || description || value;
//         previewSection.style.opacity = hasContent ? '1' : '0.5';
//     }
// }

// function formatNumber(value) {
//     return new Intl.NumberFormat('ar-SA', {
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2
//     }).format(value);
// }

// // Auto-save draft functionality
// let autoSaveTimeout;

// function autoSaveDraft() {
//     clearTimeout(autoSaveTimeout);
    
//     autoSaveTimeout = setTimeout(() => {
//         const name = document.getElementById('itemName').value.trim();
//         const description = document.getElementById('itemDescription').value.trim();
//         const value = document.getElementById('itemValue').value;
        
//         if (name || description || value) {
//             const draft = { name, description, value, timestamp: Date.now() };
//             localStorage.setItem('addDataDraft', JSON.stringify(draft));
//         }
//     }, 2000);
// }

// function loadDraft() {
//     const draft = localStorage.getItem('addDataDraft');
//     if (!draft) return;
    
//     try {
//         const draftData = JSON.parse(draft);
//         const timeDiff = Date.now() - draftData.timestamp;
        
//         // Load draft if it's less than 24 hours old
//         if (timeDiff < 24 * 60 * 60 * 1000) {
//             if (confirm('تم العثور على مسودة محفوظة. هل تريد استكمالها؟')) {
//                 document.getElementById('itemName').value = draftData.name || '';
//                 document.getElementById('itemDescription').value = draftData.description || '';
//                 document.getElementById('itemValue').value = draftData.value || '';
//                 updatePreview();
//             }
//         } else {
//             // Remove old draft
//             localStorage.removeItem('addDataDraft');
//         }
//     } catch (error) {
//         console.error('Error loading draft:', error);
//         localStorage.removeItem('addDataDraft');
//     }
// }

// function clearDraft() {
//     localStorage.removeItem('addDataDraft');
// }

// // Initialize auto-save
// document.addEventListener('DOMContentLoaded', function() {
//     // Load draft on page load
//     setTimeout(loadDraft, 500);
    
//     // Set up auto-save
//     const fields = ['itemName', 'itemDescription', 'itemValue'];
//     fields.forEach(fieldId => {
//         const field = document.getElementById(fieldId);
//         if (field) {
//             field.addEventListener('input', autoSaveDraft);
//         }
//     });
    
//     // Clear draft on successful submission
//     const form = document.getElementById('addDataForm');
//     if (form) {
//         form.addEventListener('submit', () => {
//             setTimeout(clearDraft, 3000); // Clear after successful save
//         });
//     }
// });

// // Character counters
// function initializeCharacterCounters() {
//     const nameField = document.getElementById('itemName');
//     const descriptionField = document.getElementById('itemDescription');
    
//     if (nameField) {
//         addCharacterCounter(nameField, 100);
//     }
    
//     if (descriptionField) {
//         addCharacterCounter(descriptionField, 500);
//     }
// }

// function addCharacterCounter(field, maxLength) {
//     const counter = document.createElement('div');
//     counter.className = 'character-counter';
//     counter.style.cssText = `
//         text-align: left;
//         font-size: 0.8rem;
//         color: var(--secondary-color);
//         margin-top: 0.25rem;
//     `;
    
//     field.parentNode.appendChild(counter);
    
//     function updateCounter() {
//         const currentLength = field.value.length;
//         counter.textContent = `${currentLength}/${maxLength}`;
        
//         if (currentLength > maxLength * 0.9) {
//             counter.style.color = 'var(--warning-color)';
//         } else if (currentLength > maxLength) {
//             counter.style.color = 'var(--danger-color)';
//         } else {
//             counter.style.color = 'var(--secondary-color)';
//         }
//     }
    
//     field.addEventListener('input', updateCounter);
//     updateCounter();
// }

// // Initialize character counters
// document.addEventListener('DOMContentLoaded', initializeCharacterCounters);

