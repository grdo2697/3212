
(function() {
  'use strict';

  // ---------- Initial Data (Defaults) ----------
  const defaultEmployees = [
    { id: 1, firstName: 'أحمد', lastName: 'محمد', img: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'ahmed@smartnet.com', phone: '+9647801234567', familyPhone: '+9647801234568 (الأب)', nationality: 'عراقي', job: 'مبرمج', department: 'تطوير البرمجيات', hireDate: '2021-03-10', salary: 1500000, status: 'نشط' },
    { id: 2, firstName: 'سارة', lastName: 'عبدالله', img: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'sara@smartnet.com', phone: '+9647802345678', familyPhone: '+9647802345679 (الأخ)', nationality: 'عراقي', job: 'مصممة', department: 'التصميم الجرافيكي', hireDate: '2020-11-15', salary: 1200000, status: 'نشط' },
    { id: 3, firstName: 'خالد', lastName: 'سعيد', img: 'https://randomuser.me/api/portraits/men/22.jpg', email: 'khaled@smartnet.com', phone: '+9647803456789', familyPhone: '+9647803456780 (الزوجة)', nationality: 'عراقي', job: 'مدير مشاريع', department: 'إدارة المشاريع', hireDate: '2019-07-22', salary: 2500000, status: 'إجازة' }
  ];

  const defaultContracts = [
    { id: 1, employeeId: 1, number: 'CT-2023-001', type: 'دائم', startDate: '2023-01-01', endDate: '2026-01-01', notes: 'عقد عمل دائم لمدة 3 سنوات', status: 'نشط' },
    { id: 2, employeeId: 2, number: 'CT-2023-002', type: 'مؤقت', startDate: '2023-03-15', endDate: '2023-09-15', notes: 'عقد مؤقت لمشروع خاص', status: 'ينتهي قريباً' },
    { id: 3, employeeId: 3, number: 'CT-2022-045', type: 'دائم', startDate: '2022-05-10', endDate: '2025-05-10', notes: 'عقد دائم مع حوافز إضافية', status: 'نشط' }
  ];

  const defaultEvaluations = [
    { id: 1, employeeId: 1, period: 'الربع الثالث 2023', operationsEvaluation: 95, overallEvaluation: 92, evaluationDays: 30, notes: 'أداء ممتاز في إنجاز المهام', evaluator: 'مدير القسم' },
    { id: 2, employeeId: 2, period: 'الربع الثالث 2023', operationsEvaluation: 88, overallEvaluation: 85, evaluationDays: 28, notes: 'تحسن ملحوظ في الأداء', evaluator: 'مدير القسم' },
    { id: 3, employeeId: 3, period: 'الربع الثالث 2023', operationsEvaluation: 75, overallEvaluation: 78, evaluationDays: 25, notes: 'يحتاج إلى تحسين في سرعة الإنجاز', evaluator: 'مدير الموارد البشرية' }
  ];

  const defaultFines = [
    { id: 1, employeeId: 1, amount: 50000, date: '2023-07-10', reason: 'تأخير متكرر', status: 'معلقة' },
    { id: 2, employeeId: 2, amount: 30000, date: '2023-07-15', reason: 'عدم إنجاز المهام المطلوبة', status: 'مدفوعة' },
    { id: 3, employeeId: 3, amount: 75000, date: '2023-07-20', reason: 'عدم حضور اجتماع مهم', status: 'معلقة' }
  ];

  // ---------- State & Storage ----------
  let employees = JSON.parse(localStorage.getItem('employees')) || defaultEmployees;
  let contracts = JSON.parse(localStorage.getItem('contracts')) || defaultContracts;
  let evaluations = JSON.parse(localStorage.getItem('evaluations')) || defaultEvaluations;
  let fines = JSON.parse(localStorage.getItem('fines')) || defaultFines;

  function saveData() {
    try {
      localStorage.setItem('employees', JSON.stringify(employees));
      localStorage.setItem('contracts', JSON.stringify(contracts));
      localStorage.setItem('evaluations', JSON.stringify(evaluations));
      localStorage.setItem('fines', JSON.stringify(fines));
    } catch (e) {
      console.error('خطأ أثناء حفظ البيانات:', e);
    }
    updateDashboard();
    populateEmployeeDropdowns();
  }

  // ---------- Utilities ----------
  const fmt = new Intl.NumberFormat('ar-IQ');
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function openModal(id) { const el = $(id); if (el) el.style.display = 'flex'; }
  function closeModal(id) { const el = $(id); if (el) el.style.display = 'none'; }

  function switchTab(tabName) {
    $$('.tab-pane').forEach(t => t.classList.remove('active'));
    $(`#${tabName}-tab`).classList.add('active');
    $$('#mainTabs .nav-link').forEach(l => l.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  }

  function nextId(list) { return list.length ? Math.max(...list.map(x => x.id)) + 1 : 1; }
  function findEmployeeName(id) {
    const e = employees.find(x => x.id === id);
    return e ? `${e.firstName} ${e.lastName}` : '—';
  }

  // ---------- Dashboard ----------
  function updateDashboard() {
    // Employees
    const total = employees.length;
    const active = employees.filter(e => e.status === 'نشط').length;
    const vacation = employees.filter(e => e.status === 'إجازة').length;
    const inactive = employees.filter(e => e.status === 'غير نشط').length;
    $('#total-count').textContent = total;
    $('#active-count').textContent = active;
    $('#vacation-count').textContent = vacation;
    $('#inactive-count').textContent = inactive;

    // Contracts
    $('#contracts-count').textContent = contracts.length;
    $('#active-contracts').textContent = contracts.filter(c => c.status === 'نشط').length;
    $('#expiring-contracts').textContent = contracts.filter(c => c.status === 'ينتهي قريباً').length;
    $('#expired-contracts').textContent = contracts.filter(c => c.status === 'منتهي').length;

    // Evaluations
    $('#total-evaluations').textContent = evaluations.length;
    $('#excellent-evaluations').textContent = evaluations.filter(e => e.overallEvaluation >= 90).length;
    $('#good-evaluations').textContent = evaluations.filter(e => e.overallEvaluation >= 75 && e.overallEvaluation < 90).length;
    $('#poor-evaluations').textContent = evaluations.filter(e => e.overallEvaluation < 75).length;

    // Fines
    $('#total-fines').textContent = fines.length;
    $('#paid-fines').textContent = fines.filter(f => f.status === 'مدفوعة').length;
    $('#pending-fines').textContent = fines.filter(f => f.status === 'معلقة').length;

    const totalAmount = fines.reduce((s, f) => s + (Number(f.amount) || 0), 0);
    $('#fines-amount').textContent = fmt.format(totalAmount);

    const pendingAmount = fines.filter(f => f.status === 'معلقة').reduce((s, f) => s + (Number(f.amount) || 0), 0);
    const paidAmount = fines.filter(f => f.status === 'مدفوعة').reduce((s, f) => s + (Number(f.amount) || 0), 0);
    $('#fines-stats-value').textContent = fmt.format(pendingAmount) + ' د.ع';
    $('#payments-stats-value').textContent = fmt.format(paidAmount) + ' د.ع';

    // Top employees by fines
    const totals = {};
    fines.forEach(f => { totals[f.employeeId] = (totals[f.employeeId] || 0) + Number(f.amount || 0); });
    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 3);

    let html = '';
    sorted.forEach(([empId, amount]) => {
      const emp = employees.find(e => e.id === Number(empId));
      if (emp) {
        html += `
          <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
            <div><strong>${emp.firstName} ${emp.lastName}</strong><div class="text-muted">${emp.job}</div></div>
            <div class="badge bg-danger">${fmt.format(amount)} د.ع</div>
          </div>`;
      }
    });
    if (!html) html = '<p class="text-center text-muted">لا توجد بيانات</p>';
    $('#top-employees-list').innerHTML = html;
  }

  // ---------- Employees ----------
  function renderEmployees(list = employees) {
    const tbody = $('#employees-table-body');
    if (!list.length) {
      $('#no-employees').classList.remove('d-none');
      tbody.innerHTML = '';
      return;
    }
    $('#no-employees').classList.add('d-none');
    tbody.innerHTML = list.map((e, i) => `
      <tr class="employee-row">
        <td>${i + 1}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img class="employee-img" src="${e.img || 'https://via.placeholder.com/45'}" alt="">
            <div>
              <div class="fw-bold">${e.firstName} ${e.lastName}</div>
              <div class="text-muted small">${e.email}</div>
            </div>
          </div>
        </td>
        <td>${e.phone}</td>
        <td>${e.job}</td>
        <td>${e.department}</td>
        <td><span class="badge ${e.status === 'نشط' ? 'bg-success' : e.status === 'إجازة' ? 'bg-warning' : 'bg-danger'}">${e.status}</span></td>
        <td class="action-buttons">
          <button type="button" class="btn btn-sm btn-outline-primary me-1" data-action="view" data-id="${e.id}"><i class="bi bi-eye"></i> عرض</button>
          <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-action="edit" data-id="${e.id}"><i class="bi bi-pencil"></i> تعديل</button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${e.id}"><i class="bi bi-trash"></i> حذف</button>
        </td>
      </tr>
    `).join('');

    // Row actions
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const id = Number(ev.currentTarget.getAttribute('data-id'));
        const action = ev.currentTarget.getAttribute('data-action');
        if (action === 'view') viewEmployee(id);
        if (action === 'edit') showEmployeeForm(id);
        if (action === 'delete') confirmDelete('employee', id);
      });
    });
  }

  function showEmployeeForm(id = null) {
    $('#employee-form').reset();
    $('#employee-id').value = id || '';
    $('#employee-photo-preview').src = 'https://via.placeholder.com/150';
    $('#form-title').textContent = id ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد';

    if (id) {
      const e = employees.find(x => x.id === id);
      if (e) {
        $('#first-name').value = e.firstName || '';
        $('#last-name').value = e.lastName || '';
        $('#email').value = e.email || '';
        $('#phone').value = e.phone || '';
        $('#family-phone').value = e.familyPhone || '';
        $('#nationality').value = e.nationality || '';
        $('#job').value = e.job || '';
        $('#department').value = e.department || '';
        $('#hire-date').value = e.hireDate || '';
        $('#salary').value = e.salary || 0;
        if (e.status === 'نشط') $('#active-status').checked = true;
        else if (e.status === 'إجازة') $('#vacation-status').checked = true;
        else $('#inactive-status').checked = true;
        $('#employee-photo-preview').src = e.img || 'https://via.placeholder.com/150';
      }
    }
    openModal('#employee-form-modal');
  }

  function hideEmployeeForm() { closeModal('#employee-form-modal'); }

  function saveEmployee() {
    const id = Number($('#employee-id').value);
    const data = {
      firstName: $('#first-name').value.trim(),
      lastName: $('#last-name').value.trim(),
      email: $('#email').value.trim(),
      phone: $('#phone').value.trim(),
      familyPhone: $('#family-phone').value.trim(),
      nationality: $('#nationality').value,
      job: $('#job').value,
      department: $('#department').value,
      hireDate: $('#hire-date').value,
      salary: Number($('#salary').value || 0),
      status: document.querySelector('input[name="status"]:checked').value,
      img: $('#employee-photo-preview').src
    };
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.hireDate) {
      alert('الرجاء إكمال الحقول المطلوبة.');
      return;
    }
    if (id) {
      const idx = employees.findIndex(x => x.id === id);
      if (idx > -1) employees[idx] = { ...employees[idx], ...data };
      alert('تم تحديث بيانات الموظف بنجاح ✅');
    } else {
      employees.push({ id: nextId(employees), ...data });
      alert('تم حفظ الموظف بنجاح ✅');
    }
    saveData();
    renderEmployees();
    hideEmployeeForm();
  }

  function viewEmployee(id) {
    const e = employees.find(x => x.id === id);
    if (!e) return;
    $('#view-photo').src = e.img || 'https://via.placeholder.com/150';
    $('#view-name').textContent = `${e.firstName} ${e.lastName}`;
    $('#view-id').textContent = `#${e.id}`;
    $('#view-email').textContent = e.email;
    $('#view-phone').textContent = e.phone;
    $('#view-family-phone').textContent = e.familyPhone;
    $('#view-nationality').textContent = e.nationality;
    $('#view-job').textContent = e.job;
    $('#view-department').textContent = e.department;
    $('#view-hire-date').textContent = e.hireDate;
    $('#view-salary').textContent = fmt.format(e.salary) + ' د.ع';
    const badge = $('#view-status');
    badge.textContent = e.status;
    badge.className = 'badge ' + (e.status === 'نشط' ? 'bg-success' : e.status === 'إجازة' ? 'bg-warning' : 'bg-danger');

    // related contracts/evaluations/fines
    const ec = contracts.filter(c => c.employeeId === id).map(c => `
      <div class="p-2 border rounded mb-2">
        <div><strong>${c.number}</strong> — ${c.type}</div>
        <div class="text-muted small">${c.startDate} → ${c.endDate} | الحالة: ${c.status}</div>
        ${c.notes ? `<div class="small">${c.notes}</div>` : ''}
      </div>`).join('') || '<div class="text-muted">لا توجد عقود</div>';
    $('#employee-contracts-container').innerHTML = ec;

    const ee = evaluations.filter(v => v.employeeId === id).map(v => `
      <div class="p-2 border rounded mb-2">
        <div><strong>${v.period}</strong> — المقيّم: ${v.evaluator}</div>
        <div class="text-muted small">العمليات: ${v.operationsEvaluation} | الكلي: ${v.overallEvaluation} | الأيام: ${v.evaluationDays}</div>
        ${v.notes ? `<div class="small">${v.notes}</div>` : ''}
      </div>`).join('') || '<div class="text-muted">لا توجد تقييمات</div>';
    $('#employee-evaluations-container').innerHTML = ee;

    const ef = fines.filter(f => f.employeeId === id).map(f => `
      <div class="p-2 border rounded mb-2">
        <div><strong>${fmt.format(f.amount)} د.ع</strong> — ${f.date} — ${f.status}</div>
        <div class="small">${f.reason}</div>
      </div>`).join('') || '<div class="text-muted">لا توجد غرامات</div>';
    $('#employee-fines-container').innerHTML = ef;

    openModal('#view-employee-modal');
  }

  // ---------- Contracts ----------
  function renderContracts(list = contracts) {
    const tbody = $('#contracts-table-body');
    tbody.innerHTML = list.map(c => `
      <tr>
        <td>${c.number}</td>
        <td>${findEmployeeName(c.employeeId)}</td>
        <td>${c.type}</td>
        <td>${c.startDate}</td>
        <td>${c.endDate}</td>
        <td>${c.status}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-action="edit-contract" data-id="${c.id}"><i class="bi bi-pencil"></i> تعديل</button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete-contract" data-id="${c.id}"><i class="bi bi-trash"></i> حذف</button>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const id = Number(ev.currentTarget.getAttribute('data-id'));
        const action = ev.currentTarget.getAttribute('data-action');
        if (action === 'edit-contract') showContractForm(id);
        if (action === 'delete-contract') confirmDelete('contract', id);
      });
    });
  }

  function showContractForm(id = null) {
    $('#contract-form').reset();
    $('#contract-id').value = id || '';
    $('#contract-form-title').textContent = id ? 'تعديل عقد' : 'إضافة عقد جديد';
    populateEmployeeDropdowns();

    if (id) {
      const c = contracts.find(x => x.id === id);
      if (c) {
        $('#contract-employee').value = String(c.employeeId);
        $('#contract-type').value = c.type;
        $('#contract-number').value = c.number;
        $('#contract-start').value = c.startDate;
        $('#contract-end').value = c.endDate;
        $('#contract-notes').value = c.notes || '';
      }
    }
    openModal('#contract-form-modal');
  }
  function hideContractForm() { closeModal('#contract-form-modal'); }
  function saveContract() {
    const id = Number($('#contract-id').value);
    const data = {
      employeeId: Number($('#contract-employee').value),
      type: $('#contract-type').value,
      number: $('#contract-number').value.trim(),
      startDate: $('#contract-start').value,
      endDate: $('#contract-end').value,
      notes: $('#contract-notes').value.trim(),
      status: 'نشط'
    };
    if (!data.employeeId || !data.type || !data.number || !data.startDate || !data.endDate) {
      alert('الرجاء إكمال الحقول المطلوبة.');
      return;
    }
    if (new Date(data.endDate) < new Date(data.startDate)) {
      alert('تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء.');
      return;
    }
    if (id) {
      const idx = contracts.findIndex(x => x.id === id);
      if (idx > -1) contracts[idx] = { ...contracts[idx], ...data };
      alert('تم تحديث العقد بنجاح ✅');
    } else {
      contracts.push({ id: nextId(contracts), status: 'نشط', ...data });
      alert('تم حفظ العقد بنجاح ✅');
    }
    saveData();
    renderContracts();
    hideContractForm();
  }

  // ---------- Evaluations ----------
  function renderEvaluations(list = evaluations) {
    const tbody = $('#evaluations-table-body');
    tbody.innerHTML = list.map(v => `
      <tr>
        <td>${findEmployeeName(v.employeeId)}</td>
        <td>${v.operationsEvaluation}</td>
        <td>${v.overallEvaluation}</td>
        <td>${v.evaluationDays}</td>
        <td>${v.notes || ''}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-action="edit-eval" data-id="${v.id}"><i class="bi bi-pencil"></i> تعديل</button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete-eval" data-id="${v.id}"><i class="bi bi-trash"></i> حذف</button>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const id = Number(ev.currentTarget.getAttribute('data-id'));
        const action = ev.currentTarget.getAttribute('data-action');
        if (action === 'edit-eval') showEvaluationForm(id);
        if (action === 'delete-eval') confirmDelete('evaluation', id);
      });
    });
  }

  function showEvaluationForm(id = null) {
    $('#evaluation-form').reset();
    $('#evaluation-id').value = id || '';
    $('#evaluation-form-title').textContent = id ? 'تعديل تقييم' : 'إضافة تقييم جديد';
    populateEmployeeDropdowns();

    if (id) {
      const v = evaluations.find(x => x.id === id);
      if (v) {
        $('#evaluation-employee').value = String(v.employeeId);
        $('#operations-evaluation').value = v.operationsEvaluation;
        $('#overall-evaluation').value = v.overallEvaluation;
        $('#evaluation-days').value = v.evaluationDays;
        $('#evaluation-notes').value = v.notes || '';
      }
    }
    openModal('#evaluation-form-modal');
  }
  function hideEvaluationForm() { closeModal('#evaluation-form-modal'); }
  function saveEvaluation() {
    const id = Number($('#evaluation-id').value);
    const data = {
      employeeId: Number($('#evaluation-employee').value),
      operationsEvaluation: Number($('#operations-evaluation').value || 0),
      overallEvaluation: Number($('#overall-evaluation').value || 0),
      evaluationDays: Number($('#evaluation-days').value || 0),
      notes: $('#evaluation-notes').value.trim(),
      period: $('#evaluation-period') ? $('#evaluation-period').value : '',
      evaluator: $('#evaluation-evaluator') ? $('#evaluation-evaluator').value : '—'
    };
    if (!data.employeeId || data.evaluationDays < 1) {
      alert('الرجاء إكمال الحقول المطلوبة.');
      return;
    }
    if (id) {
      const idx = evaluations.findIndex(x => x.id === id);
      if (idx > -1) evaluations[idx] = { ...evaluations[idx], ...data };
      alert('تم تحديث التقييم بنجاح ✅');
    } else {
      evaluations.push({ id: nextId(evaluations), ...data });
      alert('تم حفظ التقييم بنجاح ✅');
    }
    saveData();
    renderEvaluations();
    hideEvaluationForm();
  }

  // ---------- Fines ----------
  function renderFines(list = fines) {
    const tbody = $('#fines-table-body');
    tbody.innerHTML = list.map(f => `
      <tr>
        <td>${findEmployeeName(f.employeeId)}</td>
        <td>${fmt.format(Number(f.amount) || 0)}</td>
        <td>${f.date}</td>
        <td>${f.reason}</td>
        <td>${f.status}</td>
        <td>
          <button type="button" class="btn btn-sm btn-outline-secondary me-1" data-action="edit-fine" data-id="${f.id}"><i class="bi bi-pencil"></i> تعديل</button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete-fine" data-id="${f.id}"><i class="bi bi-trash"></i> حذف</button>
        </td>
      </tr>
    `).join('');
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const id = Number(ev.currentTarget.getAttribute('data-id'));
        const action = ev.currentTarget.getAttribute('data-action');
        if (action === 'edit-fine') showFineForm(id);
        if (action === 'delete-fine') confirmDelete('fine', id);
      });
    });
  }

  function showFineForm(id = null) {
    $('#fine-form').reset();
    $('#fine-id').value = id || '';
    $('#fine-form-title').textContent = id ? 'تعديل غرامة' : 'إضافة غرامة جديدة';
    populateEmployeeDropdowns();

    if (id) {
      const f = fines.find(x => x.id === id);
      if (f) {
        $('#fine-employee').value = String(f.employeeId);
        $('#fine-amount').value = f.amount;
        $('#fine-date').value = f.date;
        $('#fine-reason').value = f.reason;
        if (f.status === 'مدفوعة') $('#paid-status').checked = true; else $('#pending-status').checked = true;
      }
    }
    openModal('#fine-form-modal');
  }
  function hideFineForm() { closeModal('#fine-form-modal'); }
  function saveFine() {
    const id = Number($('#fine-id').value);
    const data = {
      employeeId: Number($('#fine-employee').value),
      amount: Number($('#fine-amount').value || 0),
      date: $('#fine-date').value,
      reason: $('#fine-reason').value.trim(),
      status: document.querySelector('input[name="fine-status"]:checked').value
    };
    if (!data.employeeId || !data.date || !data.reason) {
      alert('الرجاء إكمال الحقول المطلوبة.');
      return;
    }
    if (id) {
      const idx = fines.findIndex(x => x.id === id);
      if (idx > -1) fines[idx] = { ...fines[idx], ...data };
      alert('تم تحديث الغرامة بنجاح ✅');
    } else {
      fines.push({ id: nextId(fines), ...data });
      alert('تم حفظ الغرامة بنجاح ✅');
    }
    saveData();
    renderFines();
    hideFineForm();
  }

  // ---------- Common ----------
  function populateEmployeeDropdowns() {
    const selects = ['#contract-employee', '#evaluation-employee', '#fine-employee'];
    selects.forEach(sel => {
      const el = $(sel);
      if (!el) return;
      const current = el.value; // keep selection if possible
      el.innerHTML = '<option value="" class="lang-ar">اختر الموظف</option>' + employees.map(e =>
        `<option value="${e.id}">${e.firstName} ${e.lastName}</option>`
      ).join('');
      if (current) el.value = current;
    });
  }

  function confirmDelete(kind, id) {
    const title = { employee: 'تأكيد حذف الموظف', contract: 'تأكيد حذف العقد', evaluation: 'تأكيد حذف التقييم', fine: 'تأكيد حذف الغرامة' }[kind] || 'تأكيد الحذف';
    $('#confirmation-title').textContent = title;
    $('#confirmation-message').textContent = 'هل أنت متأكد من أنك تريد حذف هذا السجل؟';
    $('#confirm-delete').onclick = function() {
      if (kind === 'employee') {
        employees = employees.filter(e => e.id !== id);
        contracts = contracts.filter(c => c.employeeId !== id);
        evaluations = evaluations.filter(v => v.employeeId !== id);
        fines = fines.filter(f => f.employeeId !== id);
        renderEmployees(); renderContracts(); renderEvaluations(); renderFines();
      }
      if (kind === 'contract') { contracts = contracts.filter(c => c.id !== id); renderContracts(); }
      if (kind === 'evaluation') { evaluations = evaluations.filter(v => v.id !== id); renderEvaluations(); }
      if (kind === 'fine') { fines = fines.filter(f => f.id !== id); renderFines(); }
      saveData();
      closeModal('#confirmation-modal');
    };
    $('#cancel-delete').onclick = function(){ closeModal('#confirmation-modal'); };
    openModal('#confirmation-modal');
  }

  // Filters
  function filterEmployees() {
    const q = ($('#search-input').value || '').trim();
    const st = $('#status-filter').value;
    const list = employees.filter(e => {
      const inTxt = !q || (e.firstName + ' ' + e.lastName + ' ' + e.email + ' ' + e.phone + ' ' + e.job + ' ' + e.department).includes(q);
      const inSt = st === 'all' || e.status === st;
      return inTxt && inSt;
    });
    renderEmployees(list);
  }
  function filterContracts() {
    const q = ($('#contract-search-input').value || '').trim();
    const list = contracts.filter(c => {
      const emp = findEmployeeName(c.employeeId);
      return !q || (c.number + ' ' + c.type + ' ' + emp).includes(q);
    });
    renderContracts(list);
  }
  function filterFines() {
    const q = ($('#fines-search-input').value || '').trim();
    const list = fines.filter(f => {
      const emp = findEmployeeName(f.employeeId);
      return !q || (emp + ' ' + f.reason + ' ' + f.status).includes(q);
    });
    renderFines(list);
  }

  // Export
  function exportData() {
    const data = { employees, contracts, evaluations, fines };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'smartnet-data.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // ---------- Events ----------
  function setupEventListeners() {
    // Tabs
    $$('#mainTabs .nav-link').forEach(tab => {
      tab.addEventListener('click', function(e) {
        e.preventDefault();
        const tabName = this.getAttribute('data-tab');
        switchTab(tabName);
      });
    });

    // Employee
    $('#add-employee-btn').addEventListener('click', () => showEmployeeForm());
    const firstAdd = $('#add-first-employee');
    if (firstAdd) firstAdd.addEventListener('click', () => showEmployeeForm());
    $('#save-employee').addEventListener('click', saveEmployee);
    $('#close-form').addEventListener('click', hideEmployeeForm);
    $('#cancel-form').addEventListener('click', hideEmployeeForm);
    $('#photo-upload-btn').addEventListener('click', () => $('#photo-upload').click());
    $('#photo-upload').addEventListener('change', function(e){
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt){ $('#employee-photo-preview').src = evt.target.result; };
        reader.readAsDataURL(file);
      }
    });

    // View
    $('#close-view').addEventListener('click', () => closeModal('#view-employee-modal'));
    $('#close-view-btn').addEventListener('click', () => closeModal('#view-employee-modal'));

    // Contract
    $('#add-contract-btn').addEventListener('click', () => showContractForm());
    $('#save-contract').addEventListener('click', saveContract);
    $('#close-contract-form').addEventListener('click', hideContractForm);
    $('#cancel-contract-form').addEventListener('click', hideContractForm);
    $('#contract-search-btn').addEventListener('click', filterContracts);
    $('#contract-search-input').addEventListener('keyup', filterContracts);

    // Evaluation
    $('#add-evaluation-btn').addEventListener('click', () => showEvaluationForm());
    $('#save-evaluation').addEventListener('click', saveEvaluation);
    $('#close-evaluation-form').addEventListener('click', hideEvaluationForm);
    $('#cancel-evaluation-form').addEventListener('click', hideEvaluationForm);

    // Fine
    $('#add-fine-btn').addEventListener('click', () => showFineForm());
    $('#save-fine').addEventListener('click', saveFine);
    $('#close-fine-form').addEventListener('click', hideFineForm);
    $('#cancel-fine-form').addEventListener('click', hideFineForm);
    $('#fines-search-btn').addEventListener('click', filterFines);
    $('#fines-search-input').addEventListener('keyup', filterFines);

    // Employees search/filter
    $('#search-btn').addEventListener('click', filterEmployees);
    $('#search-input').addEventListener('keyup', filterEmployees);
    $('#status-filter').addEventListener('change', filterEmployees);

    // Export
    $('#export-btn').addEventListener('click', exportData);

    // Floating help
    $('#floating-btn').addEventListener('click', () => {
      alert('نظام Smart Net لإدارة الموظفين: \n- إضافة/تعديل/حذف الموظفين.\n- إدارة العقود والتقييمات والغرامات.\n- البحث والتصفية والتصدير.\n- يتم حفظ البيانات محلياً في المتصفح (localStorage).');
    });
  }

  // ---------- Init ----------
  function initApp() {
    renderEmployees();
    renderContracts();
    renderEvaluations();
    renderFines();
    updateDashboard();
    populateEmployeeDropdowns();
    setupEventListeners();
  }

  document.addEventListener('DOMContentLoaded', initApp);
})();
