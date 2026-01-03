/**
 * Mock Database (Strict Schema Alignment)
 * Separated from main.js for better organization
 */

const mockApi = {
    // ------------------------------------
    // Users Table
    // ------------------------------------
    users: [
        {
            id: 101,
            name: "عبدالله العتيبي",
            mobile: "0505123456",
            email: "abdullah@gmail.com",
            is_verified: 1,
            status: "active",
            created_at: "2025-09-15 10:30:00",
            locations: [
                { id: 1, name: "المنزل", city_id: 1, district: "حي الملقا", lat: 24.1, lng: 46.1, is_default: 1 },
                { id: 2, name: "العمل", city_id: 1, district: "العليا", lat: 24.2, lng: 46.2, is_default: 0 }
            ]
        },
        {
            id: 102,
            name: "سارة خالد",
            mobile: "0555987654",
            email: "sara.k@hotmail.com",
            is_verified: 1,
            status: "active",
            created_at: "2025-10-01 14:20:00",
            locations: [
                { id: 3, name: "المنزل", city_id: 2, district: "الروضة", lat: 21.5, lng: 39.1, is_default: 1 }
            ]
        },
        {
            id: 103,
            name: "محمد سعد",
            mobile: "0544112233",
            email: "mohammed@yahoo.com",
            is_verified: 0,
            status: "blocked",
            created_at: "2025-11-20 09:15:00",
            locations: []
        },
        {
            id: 104,
            name: "خالد التميمي",
            mobile: "0566778899",
            email: "khaled.tm@gmail.com",
            is_verified: 1,
            status: "active",
            created_at: "2025-12-10 11:45:00",
            locations: [{ id: 4, name: "الاستراحة", city_id: 1, district: "الرمال", lat: 24.9, lng: 46.8, is_default: 1 }]
        },
        {
            id: 105,
            name: "نورة القحطاني",
            mobile: "0599887766",
            email: "noura.q@outlook.com",
            is_verified: 1,
            status: "active",
            created_at: "2026-01-01 16:30:00",
            locations: [{ id: 5, name: "المنزل", city_id: 1, district: "النرجس", lat: 24.8, lng: 46.6, is_default: 1 }]
        },
        {
            id: 106,
            name: "فهد الدوسري",
            mobile: "0512341234",
            email: "fahad.d@gmail.com",
            is_verified: 0,
            status: "pending_verification",
            created_at: "2026-01-02 09:00:00",
            locations: []
        },
        {
            id: 107,
            name: "ريم العلي",
            mobile: "0551234567",
            email: "reem.ali@yahoo.com",
            is_verified: 1,
            status: "active",
            created_at: "2026-01-03 08:20:00",
            locations: []
        }
    ],

    // ------------------------------------
    // Providers Table
    // ------------------------------------
    providers: [
        {
            id: 501,
            user_id: 1001, // Linked to a user account
            business_name: "مركز الصيانة السريع",
            category_id: 1,
            is_active: 1,
            approval_status: "approved",
            balance: 520.50,
            subscription_end_date: "2026-12-31",
            documents: [
                { type: "commercial_register", file: "cr_501.pdf", status: "approved" },
                { type: "id_card", file: "id_501.jpg", status: "approved" }
            ],
            locations: [1], // City IDs
            sub_categories: [1, 2], // IDs of services they perform
            agents: [
                { id: 1, name: "علي حسن", role: "فني ميكانيكا", mobile: "0500111222" }
            ],
            previous_works: [
                { id: 1, title: "توظيب محرك كامري", image: "work1.jpg" }
            ]
        },
        {
            id: 502,
            user_id: 1002,
            business_name: "سطحات الرياض المميزة",
            category_id: 2,
            is_active: 0,
            approval_status: "pending",
            balance: 0.00,
            subscription_end_date: null,
            documents: [
                { type: "commercial_register", file: "cr_502.pdf", status: "pending" }
            ],
            locations: [1],
            sub_categories: [3],
            agents: [],
            previous_works: []
        },
        {
            id: 503,
            user_id: 1003,
            business_name: "ورشة البركة",
            category_id: 1,
            is_active: 1,
            approval_status: "approved",
            balance: 150.00,
            subscription_end_date: "2026-06-30",
            documents: [{ type: "license", file: "lic_503.pdf", status: "approved" }],
            locations: [1],
            sub_categories: [1],
            agents: [],
            previous_works: []
        },
        {
            id: 504,
            user_id: 1004,
            business_name: "أوتو كير",
            category_id: 3,
            is_active: 1,
            approval_status: "approved",
            balance: 300.25,
            subscription_end_date: "2026-08-15",
            documents: [],
            locations: [2],
            sub_categories: [],
            agents: [],
            previous_works: []
        },
        {
            id: 505,
            user_id: 1005,
            business_name: "الماهر للكهرباء",
            category_id: 1,
            is_active: 1,
            approval_status: "approved",
            balance: 80.00,
            subscription_end_date: "2026-02-28",
            documents: [],
            locations: [1, 2],
            sub_categories: [2],
            agents: [{ id: 2, name: "مصطفى", role: "كهربائي", mobile: "0511223344" }],
            previous_works: []
        }
    ],

    // ------------------------------------
    // Configuration Tables
    // ------------------------------------
    categories: [
        { id: 1, name_ar: "صيانة ميكانيكية", name_en: "Mechanical Maintenance", image: "cat_mech.png", is_active: 1 },
        { id: 2, name_ar: "خدمات الطوارئ", name_en: "Emergency Services", image: "cat_towing.png", is_active: 1 },
        { id: 3, name_ar: "زينة وتظليل", name_en: "Accessories", image: "cat_acc.png", is_active: 1 }
    ],

    sub_categories: [
        {
            id: 1,
            category_id: 1,
            name_ar: "تغيير زيت وفلتر",
            name_en: "Oil & Filter Change",
            form_id: 10,
            provider_form_id: 20,
            acceptance_score: 80,
            matching_factors: ["oil", "filter", "location"]
        },
        {
            id: 2,
            category_id: 1,
            name_ar: "فحص وبرمجة كمبيوتر",
            name_en: "Computer Check",
            form_id: 11,
            provider_form_id: 21,
            acceptance_score: 75,
            matching_factors: ["computer", "sedan"]
        },
        {
            id: 3,
            category_id: 2,
            name_ar: "سطحة هيدروليك",
            name_en: "Hydraulic Towing",
            form_id: 12,
            provider_form_id: 22,
            acceptance_score: 90,
            matching_factors: ["towing", "flatbed"]
        }
    ],

    cities: [
        { id: 1, name_ar: "الرياض", name_en: "Riyadh", regions: ["شمال", "شرق", "غرب", "جنوب"] },
        { id: 2, name_ar: "جدة", name_en: "Jeddah", regions: ["الشاطئ", "البلد"] }
    ],

    car_brands: [
        { id: 1, name_en: "Toyota", name_ar: "تويوتا" },
        { id: 2, name_en: "Hyundai", name_ar: "هيونداي" },
        { id: 3, name_en: "Ford", name_ar: "فورد" }
    ],

    // ------------------------------------
    // Ops Tables (Requests & Offers)
    // ------------------------------------
    requests: [
        {
            id: 2005,
            user_id: 101,
            sub_category_id: 1,
            status: "pending", // pending, offered, accepted, in_progress, completed, cancelled, expired
            created_at: "2026-01-03 10:00:00",
            expired_at: "2026-01-04 10:00:00",
            form_data: {
                "car_brand": "Toyota",
                "car_model": "Camry",
                "year": "2022",
                "notes": "يفضل زيت 5W30"
            },
            offers_count: 0
        },
        {
            id: 2004,
            user_id: 102,
            sub_category_id: 3,
            status: "offered",
            created_at: "2026-01-03 08:30:00",
            expired_at: "2026-01-04 08:30:00",
            form_data: {
                "location": "Point(24.71, 46.67)",
                "car_type": "SUV",
                "dropoff": "Industrial Area"
            },
            offers_count: 2
        },
        {
            id: 2001,
            user_id: 101,
            sub_category_id: 1,
            status: "completed",
            created_at: "2025-12-25 15:00:00",
            expired_at: null,
            form_data: { "car_brand": "Ford", "model": "Taurus" },
            offers_count: 3
        },
        {
            id: 2006,
            user_id: 104,
            sub_category_id: 2,
            status: "pending",
            created_at: "2026-01-03 12:15:00",
            expired_at: "2026-01-04 12:15:00",
            form_data: { "problem": "Check Engine Light", "car": "Honda Accord 2018" },
            offers_count: 1
        },
        {
            id: 2007,
            user_id: 105,
            sub_category_id: 1,
            status: "cancelled",
            created_at: "2026-01-02 14:00:00",
            expired_at: null,
            form_data: { "car_brand": "GMC", "notes": "ألغيت الطلب لعدم الحاجة" },
            offers_count: 0
        },
        {
            id: 2008,
            user_id: 102,
            sub_category_id: 3,
            status: "accepted",
            provider_id: 501,
            created_at: "2026-01-01 09:30:00",
            expired_at: null,
            form_data: { "location": "Home", "destination": "Workshop" },
            offers_count: 1
        },
        {
            id: 2009,
            user_id: 106,
            sub_category_id: 2,
            status: "pending",
            created_at: "2026-01-03 13:45:00",
            expired_at: "2026-01-04 13:45:00",
            form_data: { "problem": "Battery Dead", "car": "Mazda 6" },
            offers_count: 0
        }
    ],

    offer_request_provider: [
        {
            id: 901,
            request_id: 2004,
            provider_id: 501,
            price: 150.00,
            notes: "متاح الآن، الوصول خلال 20 دقيقة",
            is_accepted: 0,
            created_at: "2026-01-03 08:35:00"
        },
        {
            id: 902,
            request_id: 2004,
            provider_id: 502,
            price: 130.00,
            notes: "سعر خاص",
            is_accepted: 0,
            created_at: "2026-01-03 08:40:00"
        }
    ],

    reviews: [
        { id: 1, request_id: 2001, user_id: 101, provider_id: 501, rating: 5, comment: "خدمة سريعة وممتازة", created_at: "2025-12-25 18:00:00" }
    ],

    audit_logs: [
        { id: 1, actor_name: "Super Admin", action: "login", target_entity: "system", target_id: null, date: "2026-01-03 09:00:00" },
        { id: 2, actor_name: "Super Admin", action: "approve_provider", target_entity: "provider", target_id: 501, date: "2025-10-02 11:00:00" }
    ],

    // ------------------------------------
    // Forms Schema (Simulated)
    // ------------------------------------
    forms: [
        // 1. Car Oil Change (Original)
        {
            id: 10,
            name: "طلب تغيير زيت (عميل)",
            type: "user_request",
            fields: [
                { name: "car_brand", type: "select", label_ar: "ماركة السيارة", options: ["Toyota", "Ford", "Hyundai", "GMC"], required: true },
                { name: "year", type: "number", label_ar: "سنة الصنع", required: true },
                { name: "notes", type: "textarea", label_ar: "ملاحظات إضافية", required: false }
            ]
        },
        // 2. Car Parts Request (New - Detailed)
        {
            id: 30,
            name: "طلب قطع غيار (عميل)",
            type: "user_request",
            fields: [
                { name: "fuel_type", type: "radio", label_ar: "نوع الوقود", options: ["بنزين", "كهرباء", "هايبرد", "ديزل"], required: true },
                { name: "car_type", type: "select", label_ar: "نوع السيارة", options: ["تويوتا كامري", "فورد توروس", "هيونداي سوناتا", "تسلا موديل 3"], required: true },
                { name: "model_year", type: "select", label_ar: "الموديل", options: ["2020", "2021", "2022", "2023", "2024", "2025"], required: true },
                { name: "part_name", type: "text", label_ar: "اسم القطعة", required: true },
                { name: "part_condition", type: "radio", label_ar: "حالة القطعة المطلوبة", options: ["أصلي", "تجاري", "تشليح", "أي حالة"], required: true },
                { name: "with_installation", type: "radio", label_ar: "مع تركيب؟", options: ["نعم", "لا", "كلاهما"], required: true },
                { name: "images", type: "file", label_ar: "صور توضيحية (اختياري)", required: false },
                { name: "notes", type: "textarea", label_ar: "ملاحظات إضافية", required: false }
            ]
        },
        // 3. Home Cleaning (New - Detailed)
        {
            id: 40,
            name: "خدمة تنظيف (عميل)",
            type: "user_request",
            fields: [
                { name: "address_title", type: "text", label_ar: "عنوان الطلب", required: true },
                { name: "property_type", type: "radio", label_ar: "نوع العقار", options: ["منزل", "شقة", "فيلا", "مكتب"], required: true },
                { name: "area", type: "number", label_ar: "المساحة (متر مربع)", required: true },
                { name: "rooms_count", type: "number", label_ar: "عدد الغرف", required: true },
                { name: "is_recurring", type: "checkbox", label_ar: "الخدمة مكررة؟", required: false },
                { name: "floor_no", type: "number", label_ar: "رقم الطابق", required: false },
                { name: "date", type: "date", label_ar: "تاريخ تلقي الخدمة", required: true }
            ]
        },
        // 4. Electrical Service (New - Detailed)
        {
            id: 50,
            name: "خدمة كهربائية (عميل)",
            type: "user_request",
            fields: [
                { name: "address_title", type: "text", label_ar: "عنوان الطلب", required: true },
                { name: "property_type", type: "radio", label_ar: "نوع العقار", options: ["منزل", "شقة", "فيلا", "مكتب"], required: true },
                { name: "issue_desc", type: "textarea", label_ar: "وصف المشكلة", required: true },
                { name: "urgency", type: "select", label_ar: "الأهمية", options: ["عادية", "مستعجلة", "طوارئ"], required: true },
                { name: "images", type: "file", label_ar: "صور للمشكلة", required: false }
            ]
        },
        // 5. Provider Offer Form
        {
            id: 20,
            name: "تقديم عرض (مزود)",
            type: "provider_offer",
            fields: [
                { name: "price", type: "number", label_ar: "السعر المقترح (ر.س)", required: true },
                { name: "duration", type: "text", label_ar: "مدة العمل", required: true },
                { name: "notes", type: "textarea", label_ar: "ملاحظات العرض", required: false }
            ]
        }
    ]
};
