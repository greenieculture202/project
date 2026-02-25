import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FaqEntry {
    question: string;
    answer: string;
}

interface CategoryGroup {
    name: string;
    icon: string;
    faqs: FaqEntry[];
}

@Component({
    selector: 'app-faq-all',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './faq-all.html',
    styleUrl: './faq-all.css'
})
export class FaqAllComponent {
    openKey = signal<string | null>(null);
    activeCategory = signal<string>('All');

    categories = ['All', 'Orders', 'Payment', 'Delivery', 'Plants', 'Returns', 'Account'];

    categoryGroups: CategoryGroup[] = [
        {
            name: 'Orders',
            icon: 'fas fa-box-open',
            faqs: [
                { question: 'How do I track my order?', answer: 'Once your order is shipped, you will receive a tracking link via email and SMS. You can also track it from your User Dashboard under "My Orders".' },
                { question: 'Can I cancel my order after placing it?', answer: 'Orders can be cancelled within 2 hours of placement. After that, the order is prepared for shipping and cannot be cancelled. Please contact support immediately.' },
                { question: 'How do I change my delivery address after placing an order?', answer: 'Address changes are possible only if the order has not been dispatched yet. Contact our support team within 1 hour of placing the order.' },
                { question: 'Can I place a bulk or wholesale order?', answer: 'Yes! We offer special discounts for bulk orders of 10 or more items. Please contact us via email at bulk@greenieculture.com.' },
                { question: 'Will I get an invoice for my order?', answer: 'Yes, a digital invoice is automatically sent to your registered email after your order is confirmed. You can also download it from your User Dashboard.' }
            ]
        },
        {
            name: 'Payment',
            icon: 'fas fa-credit-card',
            faqs: [
                { question: 'What payment methods do you accept?', answer: 'We accept UPI (Google Pay, PhonePe, Paytm) and Cash on Delivery. All transactions are 100% secure.' },
                { question: 'Is my payment information secure?', answer: 'Yes, absolutely. We use industry-standard SSL encryption. We never store your payment details on our servers.' },
                { question: 'My payment failed but amount was deducted. What do I do?', answer: 'If your order was not placed but the amount was deducted, it will be automatically refunded within 5–7 business days. If not, please contact support with your transaction ID.' },
                { question: 'Do you offer EMI options?', answer: 'Currently we do not offer EMI, but we are working on it. Stay tuned for future updates!' },
                { question: 'Can I pay partially and the rest on delivery?', answer: 'Currently we do not support split payments. You can choose either full UPI payment or full Cash on Delivery.' }
            ]
        },
        {
            name: 'Delivery',
            icon: 'fas fa-truck',
            faqs: [
                { question: 'How long does delivery take?', answer: 'We deliver within 3–7 business days depending on your location. Metro cities usually receive orders within 2–3 days.' },
                { question: 'Do you deliver pan India?', answer: 'Yes, we deliver to 500+ cities across India. Enter your pincode on the product page to check delivery availability.' },
                { question: 'Is there a delivery charge?', answer: 'Delivery is FREE on all orders above ₹499. For orders below ₹499, a flat ₹49 delivery fee applies.' },
                { question: 'What happens if no one is home during delivery?', answer: 'The delivery partner will attempt 2 more deliveries on subsequent days. If all attempts fail, the order will be returned and a refund will be processed.' },
                { question: 'Do you offer same-day delivery?', answer: 'Same-day delivery is available in select metro cities for orders placed before 10 AM. Check the product page for same-day availability for your pincode.' }
            ]
        },
        {
            name: 'Plants',
            icon: 'fas fa-leaf',
            faqs: [
                { question: 'Are the plants safe for pets?', answer: 'Some plants are pet-friendly and some are not. Check the individual product page for a "Pet Safe" badge. Commonly safe plants include Spider Plant, Boston Fern, and Areca Palm.' },
                { question: 'How are the plants packaged to survive shipping?', answer: 'All plants are carefully wrapped with eco-friendly packaging, padded with coco coir for shock absorption, and the soil is secured to prevent spillage.' },
                { question: 'What should I do immediately after receiving my plant?', answer: 'Remove all packaging, place the plant in indirect sunlight for 2–3 days to help it adjust (called acclimatization), and water it lightly.' },
                { question: 'My plant arrived with yellow leaves. Is it damaged?', answer: 'A few yellow leaves after transit are completely normal due to shipping stress. Remove them and give the plant 1–2 weeks to recover. If the entire plant is yellow, please contact us.' },
                { question: 'Do your plants come with pots?', answer: 'Unless specifically mentioned on the product page, plants are shipped in nursery pots. You can browse our Accessories section for premium pots and planters.' }
            ]
        },
        {
            name: 'Returns',
            icon: 'fas fa-undo',
            faqs: [
                { question: 'What is your return policy?', answer: 'We have a 7-day return/replacement policy. If the plant arrives damaged or dead, send us a photo within 7 days and we will send a free replacement.' },
                { question: 'How do I initiate a return?', answer: 'Go to your User Dashboard → My Orders → Select the order → Click "Report Issue". Upload a photo, and our team will respond within 24 hours.' },
                { question: 'How long does a refund take?', answer: 'Once your return is approved, refunds are processed within 5–7 business days to your original payment method.' },
                { question: 'Can I exchange a plant for a different one?', answer: 'Yes, exchanges are allowed within 7 days of delivery for items of equal or higher value (you pay the difference). Contact support to initiate an exchange.' }
            ]
        },
        {
            name: 'Account',
            icon: 'fas fa-user-circle',
            faqs: [
                { question: 'How do I create an account?', answer: 'Click the person icon on the top right of the navbar and select "Register". Fill in your name, email, and password to create your account.' },
                { question: 'I forgot my password. How do I reset it?', answer: 'On the login page, click "Forgot Password" and enter your registered email. You will receive a password reset link within a few minutes.' },
                { question: 'Can I use Google to log in?', answer: 'Yes! You can use "Continue with Google" on the login page. An OTP will be sent to your Gmail for verification.' },
                { question: 'How do I update my profile or address?', answer: 'Go to your User Dashboard (click the profile icon after logging in). From there you can update your name, email, and saved addresses.' }
            ]
        }
    ];

    setCategory(cat: string) {
        this.activeCategory.set(cat);
        this.openKey.set(null);
    }

    toggle(key: string) {
        this.openKey.set(this.openKey() === key ? null : key);
    }
}
