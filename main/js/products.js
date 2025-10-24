// Products Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    initializeProductsPage();
});

function initializeProductsPage() {
    const productsGrid = document.getElementById('productsGrid');
    const modal = document.getElementById('productModal');
    if (!productsGrid || !modal) return;

    // جلب المنتجات من LocalStorage
    const products = getFromLocalStorage('dashboardData') || [];
    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; width: 100%;">لا توجد منتجات لعرضها حالياً. أضف منتجاً من لوحة التحكم.</p>';
        return;
    }

    // إنشاء بطاقة لكل منتج
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 100)}...</p>
                <div class="product-price">${formatNumber(product.value)} ريال</div>
            </div>
        `;
        card.addEventListener('click', () => showProductModal(product));
        productsGrid.appendChild(card);
    });

    // تهيئة النافذة المنبثقة (Modal)
    const closeModalBtn = document.getElementById('closeModal');
    closeModalBtn.addEventListener('click', hideProductModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideProductModal();
        }
    });
}

function showProductModal(product) {
    const modal = document.getElementById('productModal');
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `${formatNumber(product.value)} ريال`;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}


