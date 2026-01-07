/**
 * Main Application Logic (Enhanced)
 * Strict Database Alignment & Realistic Demo Data
 */

// ==========================================
// 1. Mock Database (Strict Schema Alignment)
// ==========================================
// ==========================================
// 1. Mock Database
// ==========================================
// Loaded from js/mock-data.js

// ==========================================
// 2. Auth & RBAC Logic
// ==========================================
const ROLES = {
    super_admin: { name: "المدير العام", perms: ["all"] },
    support: { name: "الدعم الفني", perms: ["view_users", "view_providers", "view_requests", "manage_requests", "view_logs"] }, // No category/form edit
    content: { name: "مدير المحتوى", perms: ["view_categories", "manage_categories", "view_forms", "manage_forms"] }
};

function login(role) {
    const userUser = { name: "Admin User", role: role, token: "mock_token_" + Date.now() };
    sessionStorage.setItem("db_user", JSON.stringify(userUser));
    window.location.href = "index.html";
}

function logout() {
    sessionStorage.removeItem("db_user");
    window.location.href = "login.html";
}

function checkAuth() {
    const u = JSON.parse(sessionStorage.getItem("db_user"));
    const path = window.location.pathname;
    if (!u && !path.includes("login.html")) window.location.href = "login.html";
    if (u && path.includes("login.html")) window.location.href = "index.html";
}

function hasPerm(action) {
    const u = JSON.parse(sessionStorage.getItem("db_user"));
    if (!u) return false;
    const rules = ROLES[u.role].perms;
    return rules.includes("all") || rules.includes(action);
}

// ==========================================
// 2. Data & Table Helpers (Export/Filter)
// ==========================================

// Client-side CSV Export
function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++) {
            // Clean inner text: remove newlines, comma, extra spaces
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/,/g, " ").trim();
            row.push(data);
        }
        csv.push(row.join(","));
    }

    // Download Link
    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Client-side Filter
function filterTable(tableId, query) {
    const filter = query.toLowerCase();
    const table = document.getElementById(tableId);
    const tr = table.getElementsByTagName("tr");

    for (let i = 1; i < tr.length; i++) { // Skip header
        let visible = false;
        const tds = tr[i].getElementsByTagName("td");
        for (let j = 0; j < tds.length; j++) {
            if (tds[j]) {
                const txtValue = tds[j].textContent || tds[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    visible = true;
                    break;
                }
            }
        }
        tr[i].style.display = visible ? "" : "none";
    }
}

// ==========================================
// 3. UI Helpers
// ==========================================
function getBasePath() {
    // إذا الصفحة داخل /pages
    if (window.location.pathname.includes("/pages/")) {
        return "..";
    }
    // إذا الصفحة من الجذر
    return ".";
}

async function loadLayout() {
    const isDashboard = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    const isLogin = window.location.pathname.includes("login.html");

    // Inject Global Loader (Skip for Dashboard)
    if (!document.getElementById('global-loader') && !isDashboard) {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.prepend(loader);
    }

    // Login page handling
    if (isLogin) {
        // Just hide loader after a short delay for smoothness
        setTimeout(() => {
            const l = document.getElementById('global-loader');
            if (l) l.classList.add('hidden');
        }, 500);
        return;
    }

    try {
        const basePath = getBasePath();

        // Load Sidebar
        const sidebarRes = await fetch(`${basePath}/layouts/sidebar.html`);
        const sidebarHtml = await sidebarRes.text();
        document.getElementById("sidebar-container").innerHTML = sidebarHtml;

        // Load Header
        const headerRes = await fetch(`${basePath}/layouts/header.html`);
        const headerHtml = await headerRes.text();
        document.getElementById("header-container").innerHTML = headerHtml;

        // Set Active Link
        const page = window.location.pathname.split("/").pop();
        document.querySelectorAll('#sidebar a').forEach(a => {
            if (a.getAttribute('href') === page) {
                a.classList.add('active');
                const parent = a.closest('.collapse');
                if (parent) parent.classList.add('show');
            }
        });

        // Hide Unauthorized Items
        document.querySelectorAll("[data-perm]").forEach(el => {
            if (!hasPerm(el.dataset.perm)) el.remove();
        });

        // Mobile Toggle & Overlay
        // Mobile Toggle & Overlay
        document.addEventListener("click", e => {
            const sidebar = document.getElementById("sidebar");
            const btn = e.target.closest("#sidebarCollapse");

            // Toggle Button Click
            if (btn) {
                sidebar.classList.toggle("active");

                // Overlay Logic for Mobile
                if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                    let overlay = document.getElementById('sidebar-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'sidebar-overlay';
                        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9998;';
                        overlay.onclick = () => {
                            sidebar.classList.remove('active');
                            overlay.remove();
                        };
                        document.body.appendChild(overlay);
                    }
                } else {
                    document.getElementById('sidebar-overlay')?.remove();
                }
            }
        });

        // Set User Name
        const u = JSON.parse(sessionStorage.getItem("db_user"));
        if (u && document.getElementById("user-name-display")) {
            document.getElementById("user-name-display").innerText =
                `${u.name} (${ROLES[u.role].name})`;
        }

        // Apply Content Animation
        const contentBody = document.querySelector('.content-body');
        if (contentBody) contentBody.classList.add('animate-fade-in');

        // Hide Loader
        setTimeout(() => {
            const l = document.getElementById('global-loader');
            if (l) l.classList.add('hidden');
        }, 500); // Quick check then hide

    } catch (error) {
        console.error("Layout loading failed: ", error);
    }
}



// ==========================================
// 4. Language & Translation
// ==========================================
const DICTIONARY = {
    ar: {
        dir: "rtl",
        // Sidebar
        "dashboard": "لوحة القيادة",
        "core_data": "البيانات الأساسية",
        "users": "المستخدمين",
        "providers": "مزودي الخدمة",
        "services_menu": "الخدمات والنماذج",
        "categories": "التصنيفات الرئيسية",
        "sub_categories": "التصنيفات الفرعية",
        "forms": "بناء النماذج",
        "car_data": "بيانات السيارات",
        "operations": "العمليات",
        "requests": "الطلبات",
        "cancelled_req": "الطلبات الملغاة",
        "waiting_req": "الطلبات بدون عروض",
        "support": "الدعم الفني",
        "logs": "سجل النظام",
        "settings": "الإعدادات",
        "cities": "المناطق والمدن",
        "logout": "تسجيل خروج",
        // Header
        "profile": "الملف الشخصي",
        "lang_btn": "English",
        "app_name_short": "Dabbirly",
        // Forms
        "forms_title": "إدارة النماذج",
        "forms_desc": "تصميم وتعديل نماذج الخدمات للمستخدمين والمزودين",
        "new_form": "نموذج جديد",
        "all_forms": "كل النماذج",
        "form_name": "اسم النموذج",
        "form_type": "النوع",
        "fields_count": "عدد الحقول",
        "creation_date": "تاريخ الإنشاء",
        "form_details": "تفاصيل النموذج",
        "dynamic_form_builder": "بناء النماذج الديناميكية",

        // Support Dashboard
        "support_dashboard": "لوحة عمليات الدعم",
        "active_reqs": "طلبات نشطة",
        "needs_approval": "بحاجة لتعميد",
        "connected_providers": "مزودين متصلين",
        "response_time": "وقت الاستجابة",
        "ongoing_requests": "الطلبات الجارية والتواصل",
        "provider_assigned": "المزود المخصص",
        "contact_info": "بيانات التواصل",

        // Locations
        "locations_title": "إدارة المناطق والمدن",
        "add_city": "إضافة مدينة",
        "neighborhood": "حي",
        "neighborhoods": "أحياء",

        // Subcategories
        "subcategories_title": "الخدمات الفرعية",
        "new_service": "خدمة جديدة",
        "service_name": "الخدمة",
        "main_category": "التصنيف الرئيسي",
        "linked_forms": "النماذج المرتبطة",
        "acceptance_score": "نسبة القبول",
        "matching_factors": "عوامل المطابقة",

        // Form Builder
        "form_builder_title": "بناء النماذج الديناميكية",
        "back_to_list": "العودة للقائمة",
        "field_types": "أنواع الحقول",
        "field_text": "نص قصير",
        "field_textarea": "نص طويل",
        "field_number": "رقم",
        "field_select": "قائمة منسدلة",
        "field_radio": "خيار متعدد (Radio)",
        "field_checkbox": "مربع اختيار (Checkbox)",
        "field_image": "رفع صورة",
        "field_date": "تاريخ",
        "field_car": "اختر سيارة",
        "field_location": "موقع جغرافي",
        "canvas_empty": "اختر حقولاً من القائمة لبناء النموذج",
        "save_form": "حفظ النموذج",
        "prop_selected_field": "خصائص الحقل المحدد",
        "prop_select_msg": "حدد حقلاً لتعديل خصائصه",
        "prop_label_ar": "عنوان الحقل (AR)",
        "prop_db_key": "اسم المتغير (DB Key)",
        "prop_required": "مطلوب (Mandatory)",
        "prop_options": "الخيارات (فاصلة ,)",
        "delete_field": "حذف الحقل",

        // Request Details
        "request_details_title": "تفاصيل الطلب",
        "all_requests_link": "كل الطلبات",
        "cancel_request": "إلغاء الطلب",
        "req_new": "الطلب جديد",
        "req_offered": "وصول عروض",
        "req_accepted": "قبول عرض",
        "req_completed": "إكمال الخدمة",
        "req_user_data": "بيانات الطلب والعميل",
        "service_details": "تفاصيل الخدمة",
        "offers_title": "العروض المقدمة",
        "offer_price": "السعر",
        "offer_notes": "ملاحظات",
        "offer_action": "الإجراء",
        "accept_offer": "قبول",
        "accepted": "تم القبول",
        "no_offers": "لا توجد عروض بعد",
        "offer_pending": "بانتظار العروض",

        // Common
        "search": "بحث...",
        "export": "تصدير",
        "filter": "تصفية",
        "details": "التفاصيل",
        "actions": "خيارات",
        "active": "نشط",
        "blocked": "محظور",
        "pending": "معلق",
        "approved": "معتمد",
        "rejected": "مرفوض",
        "all": "الكل",
        "cancelled": "ملغي",
        // Dashboard
        "total_users": "إجمالي المستخدمين",
        "active_providers": "مزودي الخدمة النشطين",
        "open_requests": "الطلبات المفتوحة",
        "unanswered_requests": "طلبات بدون عروض",
        "requests_growth": "نمو الطلبات",
        "top_providers": "أفضل المزودين",
        "cats_dist": "توزيع التصنيفات",
        "recent_requests": "آخر الطلبات",
        "view_all": "عرض الكل",
        // Users Page
        "users_title": "إدارة المستخدمين",
        "th_id": "ID",
        "th_user": "المستخدم",
        "th_contact": "معلومات الاتصال",
        "th_locations": "المواقع",
        "th_verification": "التوثيق",
        // Categories/Car Data
        "categories_title": "إدارة التصنيفات",
        "new_category": "تصنيف جديد",
        "th_image": "الصورة",
        "th_name_ar": "الاسم (عربي)",
        "th_name_en": "الاسم (إنجليزي)",
        "th_active": "الحالة",
        "th_actions": "الإجراءات",
        "active_status": "نشط",
        "inactive_status": "غير نشط",
        "car_db": "قاعدة بيانات السيارات",
        "add_brand": "إضافة ماركة",
        "manage_models": "إدارة الموديلات",
        "car_parts": "قطع الغيار",
        "add_part": "إضافة قطعة",
        "export_csv": "تصدير CSV",
        "part_name": "اسم القطعة",
        "part_num": "رقم القطعة",
        "ref_price": "السعر المرجعي",
        // System Logs
        "logs_title": "سجل نشاطات النظام",
        "th_actor": "المسؤول (Actor)",
        "th_action": "الإجراء",
        "th_target": "الهدف (Target)",
        "th_date": "التاريخ",
        // Cancelled Requests
        "cancelled_title": "الطلبات الملغاة",
        "th_cancel_reason": "سبب الإلغاء",
        "th_cancel_date": "تاريخ الإلغاء",
        "th_status": "الحالة",
        "th_join_date": "تاريخ الانضمام",
        // Providers Page
        "providers_title": "مزودي الخدمة",
        "create_provider_btn": "تسجيل مزود",
        "pending_providers_stat": "بانتظار الموافقة",
        "tab_pending": "طلبات الانضمام",
        "tab_active": "النشطين",
        "th_business_name": "اسم النشاط",
        "th_category": "التصنيف",
        "th_wallet": "المحفظة",
        "th_subscription": "الاشتراك",
        "th_approval": "حالة الاعتماد",
        "th_activity": "حالة النشاط",

        // Dashboard
        "total_users": "إجمالي المستخدمين",
        "active_providers": "مزودي الخدمة النشطين",
        "open_requests": "الطلبات المفتوحة",
        "unanswered_requests": "طلبات بدون عروض",
        "requests_growth": "نمو الطلبات",
        "top_providers": "أفضل المزودين",
        "cats_dist": "توزيع التصنيفات",
        "recent_requests": "آخر الطلبات",
        "view_all": "عرض الكل",
        "req_num": "رقم الطلب",
        "user": "المستخدم",
        "service": "الخدمة",
        "status": "الحالة",
        "date": "التاريخ",
        "unknown": "غير معروف",
        "best_provider": "المزود الأفضل"
    },
    en: {
        dir: "ltr",
        // Sidebar
        "dashboard": "Dashboard",
        "core_data": "Core Data",
        "users": "Users",
        "providers": "Service Providers",
        "services_menu": "Services & Forms",
        "categories": "Main Categories",
        "sub_categories": "Sub Categories",
        "forms": "Form Builder",
        "car_data": "Car Data",
        "operations": "Operations",
        "requests": "Requests",
        "cancelled_req": "Cancelled Requests",
        "waiting_req": "Waiting Requests",
        "support": "Support Dashboard",
        "logs": "System Logs",
        "settings": "Settings",
        "cities": "Regions & Cities",
        "logout": "Logout",
        // Header
        "profile": "Profile",
        "lang_btn": "العربية",
        "app_name_short": "Dabbirly",
        // Forms
        "forms_title": "Forms Management",
        "forms_desc": "Design/edit service forms for users and providers",
        "new_form": "New Form",
        "all_forms": "All Forms",
        "form_name": "Form Name",
        "form_type": "Type",
        "fields_count": "Fields Count",
        "creation_date": "Creation Date",
        "form_details": "Form Details",
        "dynamic_form_builder": "Dynamic Form Builder",

        // Support Dashboard
        "support_dashboard": "Support Operations Dashboard",
        "active_reqs": "Active Requests",
        "needs_approval": "Needs Approval",
        "connected_providers": "Connected Providers",
        "response_time": "Response Time",
        "ongoing_requests": "Ongoing Requests & Communication",
        "provider_assigned": "Assigned Provider",
        "contact_info": "Contact Info",

        // Locations
        "locations_title": "Regions & Cities Management",
        "add_city": "Add City",
        "neighborhood": "District",
        "neighborhoods": "Districts",

        // Subcategories
        "subcategories_title": "Sub-Services",
        "new_service": "New Service",
        "service_name": "Service",
        "main_category": "Main Category",
        "linked_forms": "Linked Forms",
        "acceptance_score": "Acceptance Score",
        "matching_factors": "Matching Factors",

        // Form Builder
        "form_builder_title": "Dynamic Form Builder",
        "back_to_list": "Back to List",
        "field_types": "Field Types",
        "field_text": "Short Text",
        "field_textarea": "Long Text",
        "field_number": "Number",
        "field_select": "Dropdown",
        "field_radio": "Radio Button",
        "field_checkbox": "Checkbox",
        "field_image": "Upload Image",
        "field_date": "Date",
        "field_car": "Car Selector",
        "field_location": "Geo Location",
        "canvas_empty": "Select fields from toolbox to build form",
        "save_form": "Save Form",
        "prop_selected_field": "Selected Field Properties",
        "prop_select_msg": "Select a field to edit properties",
        "prop_label_ar": "Label (AR)",
        "prop_db_key": "Variable Name (DB Key)",
        "prop_required": "Required",
        "prop_options": "Options (comma separated)",
        "delete_field": "Delete Field",

        // Request Details
        "request_details_title": "Request Details",
        "all_requests_link": "All Requests",
        "cancel_request": "Cancel Request",
        "req_new": "New Request",
        "req_offered": "Offers Received",
        "req_accepted": "Offer Accepted",
        "req_completed": "Service Completed",
        "req_user_data": "Request & User Data",
        "service_details": "Service Details",
        "offers_title": "Submitted Offers",
        "offer_price": "Price",
        "offer_notes": "Notes",
        "offer_action": "Action",
        "accept_offer": "Accept",
        "accepted": "Accepted",
        "no_offers": "No offers yet",
        "offer_pending": "Waiting for offers",

        // Common
        "search": "Search...",
        "export": "Export",
        "filter": "Filter",
        "details": "Details",
        "actions": "Actions",
        "active": "Active",
        "blocked": "Blocked",
        "pending": "Pending",
        "approved": "Approved",
        "rejected": "Rejected",
        "all": "All",
        "cancelled": "Cancelled",
        // Dashboard
        "total_users": "Total Users",
        "active_providers": "Active Providers",
        "open_requests": "Open Requests",
        "unanswered_requests": "Unanswered Requests",
        "requests_growth": "Requests Growth",
        "top_providers": "Top Providers",
        "cats_dist": "Categories Dist.",
        "recent_requests": "Recent Requests",
        "view_all": "View All",
        "req_num": "Req #",
        "user": "User",
        "service": "Service",
        "status": "Status",
        "date": "Date",
        "unknown": "Unknown",
        "best_provider": "Top Rated Provider",
        // Users Page
        "users_title": "User Management",
        "th_id": "ID",
        "th_user": "User",
        "th_contact": "Contact Info",
        "th_locations": "Locations",
        "th_verification": "Verification",
        "th_status": "Status",
        "th_join_date": "Join Date",
        // Providers Page
        "providers_title": "Service Providers",
        "create_provider_btn": "Register Provider",
        "pending_providers_stat": "Pending Approval",
        "tab_pending": "Pending Requests",
        "tab_active": "Active",
        "th_business_name": "Business Name",
        "th_category": "Category",
        "th_wallet": "Wallet",
        "th_subscription": "Subscription",
        "th_approval": "Approval",
        "th_activity": "Activity",
        // Categories/Car Data
        "categories_title": "Categories Management",
        "new_category": "New Category",
        "th_image": "Image",
        "th_name_ar": "Name (AR)",
        "th_name_en": "Name (EN)",
        "th_active": "Status",
        "th_actions": "Actions",
        "active_status": "Active",
        "inactive_status": "Inactive",
        "car_db": "Car Database",
        "add_brand": "Add Brand",
        "manage_models": "Manage Models",
        "car_parts": "Car Parts",
        "add_part": "Add Part",
        "export_csv": "Export CSV",
        "part_name": "Part Name",
        "part_num": "Part #",
        "ref_price": "Ref. Price",
        // System Logs
        "logs_title": "System Activity Logs",
        "th_actor": "Actor",
        "th_action": "Action",
        "th_target": "Target",
        "th_date": "Date",
        // Cancelled Requests
        "cancelled_title": "Cancelled Requests",
        "th_cancel_reason": "Cancellation Reason",
        "th_cancel_date": "Cancel Date"
    }
};

function toggleLang() {
    const current = sessionStorage.getItem("app_lang") || "ar";
    const next = current === "ar" ? "en" : "ar";
    sessionStorage.setItem("app_lang", next);
    applyLang();
}

function applyLang() {
    const lang = sessionStorage.getItem("app_lang") || "ar";
    const dict = DICTIONARY[lang];

    // Set Direction
    document.documentElement.dir = dict.dir;
    document.documentElement.lang = lang;

    // Switch CSS (Bootstrap RTL vs LTR)
    const bootLink = document.querySelector('link[href*="bootstrap"]');
    if (bootLink) {
        if (lang === 'en') {
            bootLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css";
            document.body.classList.add('ltr-mode');
        } else {
            bootLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.rtl.min.css";
            document.body.classList.remove('ltr-mode');
        }
    }

    // Update Text (Simple Approach)
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) el.innerText = dict[key];
    });

    // Update Lang Label
    const label = document.getElementById("lang-label");
    if (label) label.innerText = lang === 'ar' ? "العربية" : "English";
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    checkAuth();
    loadLayout().then(() => {
        applyLang();
    });
});
