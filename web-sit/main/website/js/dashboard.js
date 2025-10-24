// Dashboard Overview JavaScript

document.addEventListener('DOMContentLoaded', function () {
  loadDashboardData();
  initializeModals();
  loadMessagesToTable();
  checkNewMessages();
});

let currentActionItemId = null; // لتخزين ID العنصر المراد حذفه

/**
* تحميل وعرض بيانات المنتجات في الجدول.
*/
function loadDashboardData() {
  const data = getFromLocalStorage('dashboardData') || [];
  const tableBody = document.getElementById('dataTableBody');
  const noDataMessage = document.getElementById('noDataMessage');
  const dataTable = document.getElementById('dataTable');

  tableBody.innerHTML = '';

  if (data.length === 0) {
      dataTable.style.display = 'none';
      noDataMessage.style.display = 'block';
  } else {
      dataTable.style.display = 'table';
      noDataMessage.style.display = 'none';
      
      data.sort((a, b) => b.createdAt - a.createdAt); // عرض الأحدث أولاً

      data.forEach((item, index) => {
          const row = tableBody.insertRow();
          row.innerHTML = `
              <td>${index + 1}</td>
              <td><img src="${item.image}" class="table-image"></td>
              <td>${item.name}</td>
              <td>${item.description.substring(0, 40)}...</td>
              <td>${formatNumber(item.value)}</td>
              <td>${formatDate(item.createdAt)}</td>
              <td>
                  <div class="action-buttons">
                      <button class="view-btn" onclick="viewItem(${item.id})">عرض</button>
                      <button class="edit-btn" onclick="editItem(${item.id})">تعديل</button>
                      <button class="delete-btn" onclick="showDeleteConfirmation(${item.id})">حذف</button>
                  </div>
              </td>
          `;
      });
  }
  updateStats(data.length, data.length > 0 ? data[0].updatedAt : null);
}

/**
* عرض تفاصيل المنتج في نافذة منبثقة.
*/
function viewItem(itemId) {
  const item = (getFromLocalStorage('dashboardData') || []).find(d => d.id === itemId);
  if (!item) return;

  const modal = document.getElementById('viewModal');
  modal.querySelector('#viewModalImage').src = item.image;
  modal.querySelector('#viewModalTitle').textContent = item.name;
  modal.querySelector('#viewModalDescription').textContent = item.description;
  modal.querySelector('#viewModalPrice').textContent = `${formatNumber(item.value)} ريال`;
  modal.style.display = 'block';
}

/**
* الانتقال إلى صفحة التعديل مع حفظ ID المنتج.
*/
function editItem(itemId) {
  localStorage.setItem('editItemId', itemId);
  window.location.href = 'add.html';
}

/**
* إظهار نافذة تأكيد الحذف.
*/
function showDeleteConfirmation(itemId) {
  currentActionItemId = itemId;
  const modal = document.getElementById('deleteModal');
  modal.style.display = 'block';
}

/**
* تنفيذ عملية الحذف.
*/
function deleteItem() {
  if (!currentActionItemId) return;
  let data = getFromLocalStorage('dashboardData') || [];
  const updatedData = data.filter(item => item.id !== currentActionItemId);
  saveToLocalStorage('dashboardData', updatedData);
  
  loadDashboardData(); // إعادة تحميل الجدول
  hideModal('deleteModal');
  showToast('تم حذف العنصر بنجاح', 'success');
  currentActionItemId = null;
}

/**
* تهيئة النوافذ المنبثقة (Modals).
*/
function initializeModals() {
  document.querySelectorAll('.modal').forEach(modal => {
      const closeButton = modal.querySelector('.close, .cancel-btn');
      if (closeButton) {
          closeButton.onclick = () => hideModal(modal.id);
      }
      modal.addEventListener('click', e => {
          if (e.target.id === modal.id) hideModal(modal.id);
      });
  });

  const confirmDeleteBtn = document.getElementById('confirmDelete');
  if (confirmDeleteBtn) {
      confirmDeleteBtn.onclick = deleteItem;
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

/**
* تحديث بطاقات الإحصائيات.
*/
function updateStats(total, lastUpdate) {
  document.getElementById('totalItems').textContent = total;
  document.getElementById('lastUpdate').textContent = lastUpdate ? formatDate(lastUpdate) : 'لا يوجد';
}

// --- قسم الرسائل ---

function checkNewMessages() {
  const messages = getFromLocalStorage('contactMessages') || [];
  const unreadCount = messages.filter(msg => msg.status === 'unread').length;
  const notificationCount = document.getElementById('notificationCount');
  const bellIcon = document.querySelector('.notification-bell');

  if (notificationCount && unreadCount > 0) {
      notificationCount.textContent = unreadCount;
      notificationCount.style.display = 'block';
      bellIcon.classList.add('bell-shake');
  } else if (notificationCount) {
      notificationCount.style.display = 'none';
      bellIcon.classList.remove('bell-shake');
  }
}

function loadMessagesToTable() {
  const messagesBody = document.getElementById('messagesTableBody');
  if (!messagesBody) return;

  let messages = getFromLocalStorage('contactMessages') || [];
  messagesBody.innerHTML = '';
  messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  messages.forEach(msg => {
      const row = messagesBody.insertRow();
      if (msg.status === 'unread') {
          row.style.backgroundColor = 'var(--warning-color-light, #fff3cd)';
          row.style.fontWeight = 'bold';
      }
      row.innerHTML = `
          <td>${msg.name}</td>
          <td><a href="mailto:${msg.email}">${msg.email}</a></td>
          <td>${msg.message}</td>
          <td>${formatDate(msg.timestamp)}</td>
          <td>
              ${msg.status === 'unread' ? `<button class="edit-btn" onclick="markAsRead(${msg.id})">مقروء</button>` : 'مقروءة'}
              <button class="delete-btn" onclick="deleteMessage(${msg.id})">حذف</button>
          </td>
      `;
  });
}

function markAsRead(messageId) {
  let messages = getFromLocalStorage('contactMessages') || [];
  const msgIndex = messages.findIndex(m => m.id === messageId);
  if (msgIndex !== -1) {
      messages[msgIndex].status = 'read';
      saveToLocalStorage('contactMessages', messages);
      loadMessagesToTable();
      checkNewMessages();
  }
}

function deleteMessage(messageId) {
  if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
  let messages = getFromLocalStorage('contactMessages') || [];
  const updatedMessages = messages.filter(msg => msg.id !== messageId);
  saveToLocalStorage('contactMessages', updatedMessages);
  loadMessagesToTable();
  checkNewMessages();
  showToast('تم حذف الرسالة', 'success');
}
