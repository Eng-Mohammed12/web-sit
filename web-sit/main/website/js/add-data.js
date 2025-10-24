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
