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

// // Dashboard Overview JavaScript

// // document.addEventListener('DOMContentLoaded', function () {
// //   initializeDashboard();
// //   initializeDeleteModal();
// //   checkNewMessages();
// //   loadMessagesToTable();
// // });

// // let currentEditingId = null;
// // let currentDeletingId = null;
// document.addEventListener('DOMContentLoaded', function () {
//   loadDashboardData();
//   initializeModals();
//   checkNewMessages();
//   loadMessagesToTable();
// });

// let currentActionItemId = null;
// function initializeDashboard() {
//   loadDashboardData();
//   updateStats();
// }

// // function loadDashboardData() {
// //     const data = getFromLocalStorage('dashboardData') || [];
// //     const tableBody = document.getElementById('dataTableBody');
// //     const noDataMessage = document.getElementById('noDataMessage');
// //     const dataTable = document.getElementById('dataTable');

// //     if (!tableBody) return;

// //     // Clear existing rows
// //     tableBody.innerHTML = '';

// //     if (data.length === 0) {
// //         if (dataTable) dataTable.style.display = 'none';
// //         if (noDataMessage) noDataMessage.style.display = 'block';
// //         return;
// //     }

// //     if (dataTable) dataTable.style.display = 'table';
// //     if (noDataMessage) noDataMessage.style.display = 'none';

// //     // Sort data by creation date (newest first)
// //     data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

// //     // Generate table rows
// //     data.forEach((item, index) => {
// //         const row = createTableRow(item, index + 1);
// //         tableBody.appendChild(row);
// //     });

// //     // Add event listeners to action buttons
// //     addActionButtonListeners();
// // }
// // function loadDashboardData() {
// //   const data = getFromLocalStorage('dashboardData') || [];
// //   const tableBody = document.getElementById('dataTableBody');
// //   tableBody.innerHTML = '';

// //   data.forEach((item, index) => {
// //     const row = tableBody.insertRow();
// //     row.innerHTML = `
// //             <td>${index + 1}</td>
// //             <td><img src="${item.image}" class="table-image"></td>
// //             <td>${item.name}</td>
// //              <td>${item.description}</td>
// //               <td>${item.value}</td>
// //                <td>${formatDate(item.createdAt)}</td>
// //             <td>
// //                 <div class="action-buttons">
// //                     <button class="view-btn" onclick="viewItem('${item.id}')">عرض</button>
// //                     <button class="edit-btn" onclick="editItem('${item.id}')">تعديل</button>
// //                     <button class="delete-btn" onclick="showDeleteConfirmation('${
// //                       item.id
// //                     }')">حذف</button>
// //                 </div>
// //             </td>
// //         `;
// //   });
// //   updateStats(data.length);
  
  
// // }

// // function viewItem(itemId) {
// //   const data = getFromLocalStorage('dashboardData') || [];
// //   const item = data.find((d) => d.id == itemId);
// //   if (item) {
// //     // نستخدم نفس نافذة تأكيد الحذف لعرض المنتج
// //     const modal = document.getElementById('deleteModal');
// //     modal.querySelector('h3').textContent = item.name;
// //     modal.querySelector('p').innerHTML = `
// //             <img src="${item.image}" style="max-width: 100%; border-radius: 8px; margin-bottom: 1rem;">
// //             <strong>الوصف:</strong> ${item.description}<br>
// //             <strong>السعر:</strong> ${item.value} ريال
// //         `;
// //     // إخفاء أزرار الحذف وإظهار زر إغلاق
// //     modal.querySelector('.modal-actions').innerHTML =
// //       '<button id="closeView" class="cancel-btn">إغلاق</button>';
// //     modal.style.display = 'block';
// //     document.getElementById('closeView').onclick = hideDeleteModal;
// //   }
// // }

// // function editItem(itemId) {
// //   localStorage.setItem('editItemId', itemId);
// //   window.location.href = 'add.html';
// // }

// // function showDeleteConfirmation(itemId) {
// //   currentDeletingId = itemId;
// //   const modal = document.getElementById('deleteModal');
// //   // إعادة محتوى النافذة لوضع الحذف
// //   modal.querySelector('h3').textContent = 'تأكيد الحذف';
// //   modal.querySelector('p').textContent =
// //     'هل أنت متأكد من حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.';
// //   modal.querySelector('.modal-actions').innerHTML = `
// //         <button id="confirmDelete" class="delete-btn">حذف</button>
// //         <button id="cancelDelete" class="cancel-btn">إلغاء</button>
// //     `;
// //   modal.style.display = 'block';
// //   // إعادة ربط الأحداث
// //   document.getElementById('confirmDelete').onclick = () => {
// //     deleteItem(currentDeletingId);
// //     hideDeleteModal();
// //   };
// //   document.getElementById('cancelDelete').onclick = hideDeleteModal;
// // }

// // function deleteItem(itemId) {
// //   let data = getFromLocalStorage('dashboardData') || [];
// //   const updatedData = data.filter((item) => item.id != itemId);
// //   saveToLocalStorage('dashboardData', updatedData);
// //   loadDashboardData(); // إعادة تحميل الجدول
// //   showToast('تم حذف العنصر بنجاح', 'success');
// // }
// function loadDashboardData() {
//   const data = getFromLocalStorage('dashboardData') || [];
//   const tableBody = document.getElementById('dataTableBody');
//   tableBody.innerHTML = '';

//   data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

//   data.forEach((item, index) => {
//     const row = tableBody.insertRow();
//     row.innerHTML = `
//             <td>${index + 1}</td>
//             <td><img src="${item.image}" class="table-image"></td>
//             <td>${item.name}</td>
//             <td>${item.description.substring(0, 40)}...</td>
//             <td>${formatNumber(item.value)}</td>
//             <td>${formatDate(item.createdAt)}</td>
//             <td>
//                 <div class="action-buttons">
//                     <button class="view-btn" onclick="viewItem('${item.id}')">عرض</button>
//                     <button class="edit-btn" onclick="editItem('${item.id}')">تعديل</button>
//                     <button class="delete-btn" onclick="showDeleteConfirmation('${
//                       item.id
//                     }')">حذف</button>
//                 </div>
//             </td>
//         `;
//   });
//   updateStats(); // استدعاء دالتك الأصلية
// }

// function viewItem(itemId) {
//   const item = (getFromLocalStorage('dashboardData') || []).find((d) => d.id == itemId);
//   if (!item) return;

//   const modal = document.getElementById('viewModal');
//   modal.querySelector('#viewModalImage').src = item.image;
//   modal.querySelector('#viewModalTitle').textContent = item.name;
//   modal.querySelector('#viewModalDescription').textContent = item.description;
//   modal.querySelector('#viewModalPrice').textContent = `${item.value} ريال`;
//   modal.style.display = 'block';
// }

// function editItem(itemId) {
//   localStorage.setItem('editItemId', itemId);
//   window.location.href = 'add.html';
// }

// function showDeleteConfirmation(itemId) {
//   currentActionItemId = itemId;
//   const modal = document.getElementById('deleteModal');
//   modal.style.display = 'block';
// }

// function deleteItem() {
//   if (!currentActionItemId) return;
//   let data = getFromLocalStorage('dashboardData') || [];
//   const updatedData = data.filter((item) => item.id != currentActionItemId);
//   saveToLocalStorage('dashboardData', updatedData);
//   loadDashboardData();
//   hideModal('deleteModal');
//   showToast('تم حذف العنصر بنجاح', 'success');
// }



// function createTableRow(item, rowNumber) {
//   const row = document.createElement('tr');
//   row.dataset.itemId = item.id;

//   row.innerHTML = `
//     <td>${rowNumber}</td>
//     <td><img src="${item.image}" alt="${
//     item.name
//   }" class="table-image"></td> <!-- === الخلية الجديدة للصورة === -->
//     <td>${item.name}</td>
//     <td>${item.description.substring(0, 40)}...</td>
//     <td>${formatNumber(item.value)}</td>
//     <td>${formatDate(item.createdAt)}</td>
//     <td>
//     <div class="action-buttons">
//         <button class="edit-btn" onclick="editItem('${item.id}')">تعديل</button>
//         <button class="delete-btn" onclick="showDeleteConfirmation('${item.id}')">حذف</button>
//     </div>
// </td>
// `;

//   return row;
// }

// function addActionButtonListeners() {
//   // Edit buttons
//   const editButtons = document.querySelectorAll('.edit-btn');
//   editButtons.forEach((button) => {
//     button.addEventListener('click', function () {
//       const itemId = this.dataset.id;
//       editItem(itemId);
//     });
//   });

//   // Delete buttons
//   const deleteButtons = document.querySelectorAll('.delete-btn');
//   deleteButtons.forEach((button) => {
//     button.addEventListener('click', function () {
//       const itemId = this.dataset.id;
//       showDeleteConfirmation(itemId);
//     });
//   });
// }

// function editItem(itemId) {
//   const data = getFromLocalStorage('dashboardData') || [];
//   const item = data.find((d) => d.id === itemId);

//   if (!item) {
//     showToast('العنصر غير موجود', 'error');
//     return;
//   }

//   // Store the editing ID
//   currentEditingId = itemId;

//   // Create edit modal
//   const modal = createEditModal(item);
//   document.body.appendChild(modal);

//   // Show modal
//   setTimeout(() => {
//     modal.style.opacity = '1';
//     modal.querySelector('.modal-content').style.transform = 'scale(1)';
//   }, 100);
// }

// function createEditModal(item) {
//   const modal = document.createElement('div');
//   modal.className = 'modal edit-modal';
//   modal.style.cssText = `
//         display: block;
//         opacity: 0;
//         transition: opacity 0.3s ease;
//     `;

//   modal.innerHTML = `
//         <div class="modal-content" style="
//             transform: scale(0.8);
//             transition: transform 0.3s ease;
//             max-width: 500px;
//             padding: 2rem;
//         ">
//             <span class="close edit-close">&times;</span>
//             <h3 style="margin-bottom: 2rem; text-align: center;">تعديل العنصر</h3>
//             <form id="editForm">
//                 <div class="form-group">
//                     <label for="editName">الاسم *</label>
//                     <input type="text" id="editName" value="${item.name}" required>
//                     <span class="error-message" id="editNameError"></span>
//                 </div>
//                 <div class="form-group">
//                     <label for="editDescription">الوصف *</label>
//                     <textarea id="editDescription" rows="3" required>${item.description}</textarea>
//                     <span class="error-message" id="editDescriptionError"></span>
//                 </div>
//                 <div class="form-group">
//                     <label for="editValue">القيمة *</label>
//                     <input type="number" id="editValue" step="0.01" value="${item.value}" required>
//                     <span class="error-message" id="editValueError"></span>
//                 </div>
//                 <div class="form-actions">
//                     <button type="submit" class="submit-btn">حفظ التغييرات</button>
//                     <button type="button" class="cancel-btn edit-cancel">إلغاء</button>
//                 </div>
//             </form>
//         </div>
//     `;

//   // Add event listeners
//   const closeBtn = modal.querySelector('.edit-close');
//   const cancelBtn = modal.querySelector('.edit-cancel');
//   const form = modal.querySelector('#editForm');

//   closeBtn.addEventListener('click', () => closeEditModal(modal));
//   cancelBtn.addEventListener('click', () => closeEditModal(modal));

//   modal.addEventListener('click', (e) => {
//     if (e.target === modal) {
//       closeEditModal(modal);
//     }
//   });

//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     handleEditSubmission(modal);
//   });

//   return modal;
// }

// function closeEditModal(modal) {
//   modal.style.opacity = '0';
//   modal.querySelector('.modal-content').style.transform = 'scale(0.8)';

//   setTimeout(() => {
//     if (modal.parentNode) {
//       modal.parentNode.removeChild(modal);
//     }
//   }, 300);

//   currentEditingId = null;
// }

// function handleEditSubmission(modal) {
//   const name = document.getElementById('editName').value.trim();
//   const description = document.getElementById('editDescription').value.trim();
//   const value = parseFloat(document.getElementById('editValue').value);

//   // Validate fields
//   let isValid = true;

//   if (!validateRequired(name)) {
//     showFieldError('editName', 'الاسم مطلوب');
//     isValid = false;
//   }

//   if (!validateRequired(description)) {
//     showFieldError('editDescription', 'الوصف مطلوب');
//     isValid = false;
//   }

//   if (!validateNumber(value) || value <= 0) {
//     showFieldError('editValue', 'القيمة يجب أن تكون رقم موجب');
//     isValid = false;
//   }

//   if (!isValid) return;

//   // Update data
//   const data = getFromLocalStorage('dashboardData') || [];
//   const itemIndex = data.findIndex((d) => d.id === currentEditingId);

//   if (itemIndex === -1) {
//     showToast('حدث خطأ في التحديث', 'error');
//     return;
//   }

//   data[itemIndex] = {
//     ...data[itemIndex],
//     name,
//     description,
//     value,
//     updatedAt: new Date().toISOString(),
//   };

//   // Save to localStorage
//   saveToLocalStorage('dashboardData', data);

//   // Reload dashboard
//   loadDashboardData();
//   updateStats();

//   // Close modal
//   closeEditModal(modal);

//   // Show success message
//   showToast('تم تحديث العنصر بنجاح', 'success');
// }

// function initializeDeleteModal() {
//   const modal = document.getElementById('deleteModal');
//   const confirmBtn = document.getElementById('confirmDelete');
//   const cancelBtn = document.getElementById('cancelDelete');

//   if (!modal || !confirmBtn || !cancelBtn) return;

//   confirmBtn.addEventListener('click', function () {
//     if (currentDeletingId) {
//       deleteItem(currentDeletingId);
//       hideDeleteModal();
//     }
//   });

//   cancelBtn.addEventListener('click', hideDeleteModal);

//   modal.addEventListener('click', function (e) {
//     if (e.target === modal) {
//       hideDeleteModal();
//     }
//   });
// }

// function showDeleteConfirmation(itemId) {
//   currentDeletingId = itemId;
//   const modal = document.getElementById('deleteModal');

//   if (modal) {
//     modal.style.display = 'block';
//     setTimeout(() => {
//       modal.style.opacity = '1';
//     }, 10);
//   }
// }

// function hideDeleteModal() {
//   const modal = document.getElementById('deleteModal');

//   if (modal) {
//     modal.style.opacity = '0';
//     setTimeout(() => {
//       modal.style.display = 'none';
//     }, 300);
//   }

//   currentDeletingId = null;
// }

// function deleteItem(itemId) {
//   const data = getFromLocalStorage('dashboardData') || [];
//   const filteredData = data.filter((item) => item.id !== itemId);

//   // Save updated data
//   saveToLocalStorage('dashboardData', filteredData);

//   // Reload dashboard
//   loadDashboardData();
//   updateStats();

//   // Show success message
//   showToast('تم حذف العنصر بنجاح', 'success');
// }

// function updateStats() {
//   const data = getFromLocalStorage('dashboardData') || [];
//   const totalItemsElement = document.getElementById('totalItems');
//   const lastUpdateElement = document.getElementById('lastUpdate');

//   if (totalItemsElement) {
//     totalItemsElement.textContent = data.length;
//   }

//   if (lastUpdateElement) {
//     if (data.length > 0) {
//       const lastUpdate = data.reduce((latest, item) => {
//         const itemDate = new Date(item.updatedAt || item.createdAt);
//         return itemDate > latest ? itemDate : latest;
//       }, new Date(0));

//       lastUpdateElement.textContent = formatDate(lastUpdate);
//     } else {
//       lastUpdateElement.textContent = 'لا يوجد';
//     }
//   }
// }

// function formatNumber(value) {
//   return new Intl.NumberFormat('ar-SA', {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(value);
// }
// function checkNewMessages() {
//   const messages = getFromLocalStorage('contactMessages') || [];
//   const unreadCount = messages.filter((msg) => msg.status === 'unread').length;
//   const notificationCount = document.getElementById('notificationCount');
//   const bellIcon = document.querySelector('.notification-bell svg');

//   if (notificationCount && unreadCount > 0) {
//     notificationCount.textContent = unreadCount;
//     notificationCount.style.display = 'block';
//     if (bellIcon) bellIcon.classList.add('bell-shake');
//   } else if (notificationCount) {
//     notificationCount.style.display = 'none';
//     if (bellIcon) bellIcon.classList.remove('bell-shake');
//   }
// }

// function loadMessagesToTable() {
//   const messagesBody = document.getElementById('messagesTableBody');
//   if (!messagesBody) return;

//   let messages = getFromLocalStorage('contactMessages') || [];
//   messagesBody.innerHTML = '';
//   messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

//   messages.forEach((msg) => {
//     const row = messagesBody.insertRow();
//     if (msg.status === 'unread') row.style.backgroundColor = '#fff3cd';
//     row.innerHTML = `
//             <td>${msg.name}</td>
//             <td><a href="mailto:${msg.email}">${msg.email}</a></td>
//             <td>${msg.message}</td>
//             <td>${formatDate(msg.timestamp)}</td>
//             <td>
//                 ${
//                   msg.status === 'unread'
//                     ? `<button class="edit-btn" onclick="markAsRead('${msg.id}')">مقروء</button>`
//                     : ''
//                 }
//                 <button class="delete-btn" onclick="deleteMessage('${msg.id}')">حذف</button>
//             </td>
//         `;
//   });
// }

// function markAsRead(messageId) {
//   let messages = getFromLocalStorage('contactMessages') || [];
//   const msgIndex = messages.findIndex((m) => m.id == messageId);
//   if (msgIndex !== -1) {
//     messages[msgIndex].status = 'read';
//     saveToLocalStorage('contactMessages', messages);
//     loadMessagesToTable();
//     checkNewMessages();
//   }
// }

// function deleteMessage(messageId) {
//   if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
//   let messages = getFromLocalStorage('contactMessages') || [];
//   const updatedMessages = messages.filter((msg) => msg.id != messageId);
//   saveToLocalStorage('contactMessages', updatedMessages);
//   loadMessagesToTable();
//   checkNewMessages();
//   showToast('تم حذف الرسالة', 'success');
// }
// function initializeModals() {
//   document.querySelectorAll('.modal').forEach((modal) => {
//     const closeButton = modal.querySelector('.close, .cancel-btn');
//     if (closeButton) {
//       closeButton.onclick = () => hideModal(modal.id);
//     }
//     modal.onclick = (e) => {
//       if (e.target.id === modal.id) {
//         hideModal(modal.id);
//       }
//     };
//   });

//   const confirmDeleteBtn = document.getElementById('confirmDelete');
//   if (confirmDeleteBtn) {
//     confirmDeleteBtn.onclick = deleteItem;
//   }
// }

// function hideModal(modalId) {
//   const modal = document.getElementById(modalId);
//   if (modal) modal.style.display = 'none';
// }

// // function checkNewMessages() {
// //   const messages = getFromLocalStorage('contactMessages') || [];
// //   const unreadCount = messages.filter((msg) => msg.status === 'unread').length;
// //   const notificationCount = document.getElementById('notificationCount');
// //   const bellIcon = document.querySelector('.notification-bell svg');

// //   if (notificationCount && unreadCount > 0) {
// //     notificationCount.textContent = unreadCount;
// //     notificationCount.style.display = 'block';
// //     if (bellIcon) bellIcon.classList.add('bell-shake'); // إضافة كلاس النبض
// //   } else if (notificationCount) {
// //     notificationCount.style.display = 'none';
// //     if (bellIcon) bellIcon.classList.remove('bell-shake'); // إزالة كلاس النبض
// //   }
// // }

// // function loadMessagesToTable() {
// //   const messagesBody = document.getElementById('messagesTableBody');
// //   if (!messagesBody) return;

// //   let messages = getFromLocalStorage('contactMessages') || [];
// //   messagesBody.innerHTML = '';
// //   messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

// //   messages.forEach((msg) => {
// //     const row = messagesBody.insertRow();
// //     if (msg.status === 'unread') row.style.backgroundColor = '#fff3cd';
// //     row.innerHTML = `
// //             <td>${msg.name}</td>
// //             <td><a href="mailto:${msg.email}">${msg.email}</a></td>
// //             <td>${msg.message}</td>
// //              <td>${new Date(msg.timestamp).toLocaleString('ar-SA')}</td>
// //             <td>
// //                 ${
// //                   msg.status === 'unread'
// //                     ? `<button class="edit-btn" onclick="markAsRead('${msg.id}')">وضع كمقروء</button>`
// //                     : 'مقروءة'
// //                 }
// //             </td>
// //         `;
// //   });
// // }

// // function markAsRead(messageId) {
// //   let messages = getFromLocalStorage('contactMessages') || [];
// //   const msgIndex = messages.findIndex((m) => m.id == messageId);
// //   if (msgIndex !== -1) {
// //     messages[msgIndex].status = 'read';
// //     saveToLocalStorage('contactMessages', messages);
// //     loadMessagesToTable();
// //     checkNewMessages();
// //   }
// // }
// // Export functions for use in other dashboard pages
// window.dashboardUtils = {
//   loadDashboardData,
//   updateStats,
//   deleteItem,
//   editItem,
// };
