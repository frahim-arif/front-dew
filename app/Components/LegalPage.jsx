
const hospital = {
  name: "Dew Care Hospital & Research Centre",
  location: "Nagaon, Assam",
  phone: "7086803380",
  email: "amberhealth2014@gmail.com",
  website: "https://dewcarehospital.com/",
  effectiveDate: "23 November 2026",
};

const content = {
  services: {
    title: "Our Services",
    eyebrow: "Healthcare Services",
    intro: "Dew Care Hospital & Research Centre is committed to providing healthcare services, medical consultations, diagnostic facilities and specialized treatment through healthcare professionals and hospital infrastructure. This page describes categories of services that may be available. Please contact the hospital to confirm specific availability, preparation requirements and charges before booking.",
    sections: [
      ["1. Outpatient Department (OPD) Consultation", "Our OPD provides medical consultation and assessment across available specialties. Services may include general medical consultation, specialist consultation, follow-up visits, medical evaluation and preventive healthcare guidance. Consultation charges may vary by doctor and specialty."],
      ["2. Advanced Surgical Services", "Subject to clinical assessment and availability, surgical services may include advanced laparoscopic surgery, mini laparoscopic surgery, general surgical procedures, Holmium laser therapy and other eligible procedures. Treatment is provided following appropriate medical evaluation."],
      ["3. Diagnostic Imaging Services", "Diagnostic facilities may include 32-slice CT scan, MRI services, AI-assisted MRI technology, digital X-ray, ultrasonography, echocardiography and Holter monitoring. Availability, charges and preparation requirements depend on the investigation."],
      ["4. Endoscopy and Gastroenterology Procedures", "Specialized diagnostic and therapeutic procedures may include upper gastrointestinal endoscopy, colonoscopy, ERCP and other clinically indicated gastrointestinal procedures. These procedures require medical assessment and are subject to specialist and facility availability."],
      ["5. Laboratory and Investigation Services", "Laboratory and medical investigation services support diagnosis, monitoring and treatment. Patients may need to follow specific preparation instructions before certain tests. Charges depend on the test requested."],
      ["6. Emergency and Critical Care Services", "Emergency medical assistance and critical care facilities are subject to available infrastructure and medical personnel. Emergency medical needs should not be delayed for online appointment booking or payment."],
      ["7. Other Hospital Facilities", "Additional facilities may include pharmacy services, licensed blood centre services, medical support services, patient assistance, admission services and other facilities offered by the hospital."],
      ["8. Online Appointment Booking", "Patients can select the required doctor or department, choose an available appointment date and time, provide the requested contact details, review applicable consultation charges, complete online payment where required and receive confirmation after successful verification. Appointment availability is subject to the doctor’s schedule and hospital confirmation."],
      ["9. Pricing and Payment", "The applicable price or consultation fee will be displayed or communicated before payment. Payments are processed in Indian Rupees (INR). The website may use Razorpay as its payment gateway. Available methods may include UPI, debit cards, credit cards, net banking and other methods displayed at checkout."],
      ["10. Service Delivery", "Healthcare services are delivered at the hospital’s designated premises or through applicable hospital arrangements. An online payment is an advance payment for an eligible consultation or healthcare service; it is not itself the delivery of medical treatment. The patient must attend the hospital and complete required registration and medical assessment."],
      ["11. Cancellation and Refunds", "Patients may request cancellation before the scheduled appointment. Eligible refunds are processed according to the hospital’s Refund and Cancellation Policy. Services already provided or completed are generally not eligible for refunds."],
      ["12. Service Availability", "Availability of doctors, diagnostic investigations, surgical procedures and other facilities may change based on staffing, medical requirements, equipment availability and operational conditions. Contact the hospital to confirm a specific service before booking."]
    ]
  },

  privacy: {
    title: "Privacy Policy",
    eyebrow: "Patient Privacy & Data Protection",
    intro: "Dew Care Hospital & Research Centre (“Hospital”, “we”, “our” or “us”) respects the privacy and confidentiality of visitors, patients and users of our website. This Privacy Policy explains how we collect, use, store, process and protect personal information when you visit our website, book appointments, make online payments or use our healthcare services.",
    sections: [
      ["1. Information We Collect", "Personal information may include patient name, mobile number, email address, age, gender, date of birth and address where required. Appointment information may include selected doctor or department, appointment date and time, booking reference and information submitted during booking. Medical information may include relevant medical history, diagnostic reports, investigation details, prescriptions and treatment-related information where applicable. Payment information may include transaction ID, payment amount, transaction status, payment date and booking reference. We do not ask for or store your UPI PIN, card PIN, CVV or banking password on our website."],
      ["2. How We Use Your Information", "We use information to process and confirm appointments; provide healthcare and hospital services; communicate appointment confirmations and reminders; process payments, cancellations and refunds; respond to patient enquiries; maintain hospital records; improve website functionality; and meet applicable legal requirements."],
      ["3. Online Payment Security", "Our website may use Razorpay as a third-party payment gateway. Payment information is processed through the payment provider’s secure interface and is subject to its applicable terms and privacy policy. Dew Care Hospital does not request or store your UPI PIN, card PIN, CVV or internet banking password."],
      ["4. Sharing of Information", "We do not sell, rent or trade patients’ personal information. Information may be shared with authorized hospital personnel involved in patient care, payment service providers, website technology providers, or government and regulatory authorities where legally required."],
      ["5. Confidentiality of Medical Records", "Medical information and patient records are handled confidentially. Access is restricted to authorized personnel and others who require the information for legitimate healthcare, administrative or legal purposes."],
      ["6. Data Security", "We use reasonable technical and organizational safeguards to protect information against unauthorized access, disclosure, alteration, loss or misuse. However, no internet transmission or electronic storage system can be guaranteed completely secure."],
      ["7. Cookies and Website Analytics", "Our website may use cookies and similar technologies to support website functionality, understand visitor activity and improve user experience. You may manage cookies through your browser settings."],
      ["8. Data Retention", "We retain personal and medical information for as long as reasonably necessary for healthcare delivery, administration and applicable legal or regulatory requirements."],
      ["9. Your Privacy Rights", "Subject to applicable law, you may request access to or correction of your personal information, ask how it is used, or request deletion where legally permissible. You may contact us using the details below."],
      ["10. Third-Party Websites", "Our website may link to third-party services, including payment gateways. We are not responsible for the privacy practices or security policies of external websites. Please review their policies separately."],
      ["11. Children’s Information", "Where services involve minors, information may be provided by a parent or legally authorized guardian, as appropriate and in accordance with applicable law."],
      ["12. Changes to This Policy", "We may update this Privacy Policy to reflect changes in our services, technology or applicable laws. Updates will be published on this page with a revised effective date."]
    ]
  },

  refund: {
    title: "Refund and Cancellation Policy",
    eyebrow: "Appointments, Payments & Refunds",
    intro: "Dew Care Hospital & Research Centre aims to provide a transparent appointment booking and payment experience. This policy explains appointment cancellations, rescheduling, failed transactions, duplicate payments and refunds made through our website.",
    sections: [
      ["1. Appointment Booking", "Patients may book available doctor consultations and other eligible services through our website. A booking is treated as confirmed after the hospital verifies the appointment and, where applicable, successful payment."],
      ["2. Cancellation by Patients", "Patients may request cancellation before the scheduled appointment date and time. Cancellation requests must be submitted using the hospital’s official phone number or email. Refund eligibility applies to cancellation requests received before the scheduled appointment. The hospital will verify the appointment and payment details before approving a refund. Refunds are not applicable for consultations or services already provided. Requests received after the scheduled appointment time may not be eligible for a refund."],
      ["3. Refund Eligibility", "Subject to verification, refunds may be approved for eligible pre-appointment cancellations, appointments cancelled by the hospital, duplicate payments, verified payment errors, or successful payment deductions where the booking was not confirmed."],
      ["4. Non-Refundable Situations", "Refunds will generally not be provided where a consultation or service has been completed, a diagnostic investigation or procedure has been performed, or the patient does not attend the appointment without cancelling beforehand. Exceptions may be considered by hospital management where appropriate."],
      ["5. Cancellation by the Hospital", "If the hospital cancels a confirmed appointment or cannot provide the booked service, the patient may request a refund of the amount paid for the affected service or request rescheduling, subject to availability."],
      ["6. How to Request a Refund", "Please contact the hospital and provide your name, registered mobile number, appointment ID or booking reference, transaction ID and reason for the request. The hospital will review the request and communicate its decision."],
      ["7. Refund Processing Time", "Approved refunds will generally be initiated within 5–7 business days after verification and approval. The time taken for the amount to appear in your account depends on the bank, card issuer, UPI provider or original payment method."],
      ["8. Failed or Pending Transactions", "If money is debited but the appointment is not confirmed, contact the hospital with the transaction reference. We will verify the payment status with the payment provider. If the transaction failed and funds were received by the hospital, the amount will be refunded. If the payment was not settled to the hospital, reversal is handled by the payment provider or bank."],
      ["9. Duplicate Payments", "Where multiple payments are made for the same appointment, the hospital will verify the transactions and refund any confirmed duplicate payment received by it to the original payment method."],
      ["10. Refund Method and Safety", "Refunds will normally be processed to the original payment method. We will never ask you to disclose your UPI PIN, OTP, card PIN or banking password to initiate a refund."]
    ]
  },

  terms: {
    title: "Terms and Conditions",
    eyebrow: "Website Use & Appointment Terms",
    intro: "Welcome to the official website of Dew Care Hospital & Research Centre. By accessing or using this website, submitting information, booking appointments or making online payments, you agree to these Terms and Conditions. Please read them carefully.",
    sections: [
      ["1. About Our Services", "The hospital provides healthcare services through its available departments and facilities. Services may include outpatient consultations, specialist consultations, surgical services, diagnostic imaging, laboratory investigations, emergency medical services and other healthcare facilities offered by the hospital."],
      ["2. Appointment Booking", "Users may book appointments for available doctors and departments. You must provide accurate and complete information. The hospital may contact you for verification or scheduling. Online booking is subject to availability and hospital confirmation."],
      ["3. Doctor Availability", "Doctor schedules and OPD timings may change due to professional commitments, emergencies or operational requirements. The hospital will make reasonable efforts to communicate relevant changes and may offer an alternative appointment, subject to availability."],
      ["4. Online Payments", "Eligible payments may be processed through Razorpay or another authorized payment service provider. Before paying, users should verify the selected service, appointment details and applicable charges. Payment options are those displayed by the payment provider at checkout. Prices are in Indian Rupees (INR), unless otherwise stated."],
      ["5. Payment Confirmation", "An appointment requiring online payment is treated as paid only after successful payment verification. A debit notification from a bank or payment application alone does not necessarily confirm a booking. Please retain your transaction reference and appointment confirmation."],
      ["6. Cancellation and Refunds", "Cancellations and refund requests are governed by our separate Refund and Cancellation Policy, which forms part of these Terms and Conditions. Please review it before making an online payment."],
      ["7. Medical Disclaimer", "Information on this website is for general informational purposes and is not a substitute for professional medical consultation, diagnosis or treatment. Always seek advice from a qualified healthcare professional regarding a medical condition. Do not disregard professional medical advice or delay seeking treatment because of information on this website."],
      ["8. Emergency Medical Situations", "Online appointment booking is not intended for medical emergencies. If you require immediate medical attention, contact the hospital directly or visit the nearest appropriate emergency medical facility. Emergency services are subject to available facilities and medical assessment."],
      ["9. Patient Responsibilities", "Provide accurate and complete information; do not submit false or misleading details; keep any login credentials confidential; do not attempt unauthorized access to the website; and use the website only for lawful purposes while following hospital rules and medical instructions."],
      ["10. Privacy and Confidentiality", "Personal information submitted through the website is handled in accordance with our Privacy Policy and applicable laws."],
      ["11. Intellectual Property", "Website text, graphics, logos, images, design elements and other materials belong to the hospital or their respective rights holders unless otherwise stated. Unauthorized copying, reproduction, distribution or commercial use is prohibited without prior written permission."],
      ["12. Website Availability", "We aim to maintain website availability but do not guarantee uninterrupted access. The website may be temporarily unavailable due to maintenance, technical issues, security updates or circumstances beyond our reasonable control."],
      ["13. Third-Party Services", "The website may integrate with third-party services, including payment gateways. Those services may have their own terms and privacy policies. Users should review the applicable terms when using them."],
      ["14. Limitation of Liability", "To the extent permitted by applicable law, the hospital is not responsible for losses arising solely from temporary website unavailability, third-party payment or banking interruptions, or inaccurate information submitted by users. Nothing in these terms excludes liability that cannot legally be excluded."],
      ["15. Changes to These Terms", "We may revise these Terms and Conditions when necessary. Updated terms will be published on this website with a revised effective date."],
      ["16. Governing Law and Jurisdiction", "These Terms and Conditions are governed by the laws of India. Subject to applicable law, disputes will be subject to the jurisdiction of competent courts having jurisdiction over the hospital’s registered establishment."]
    ]
  }
};

const nav = [
  ["/privacy-policy", "Privacy Policy", "privacy"],
  ["/refund-and-cancellation-policy", "Refund & Cancellation", "refund"],
  ["/terms-and-conditions", "Terms & Conditions", "terms"],
  ["/our-services", "Our Services", "services"]
];

export default function LegalPage({ type }) {
  const page = content[type];
  if (!page) return null;

  return (
    <main className="dc-legal">
      <style>{`
        .dc-legal{--green:#16834b;--blue:#075985;--ink:#243247;--muted:#64748b;--line:#e2e8f0;min-height:100vh;background:#f5faf7;color:var(--ink);font:16px/1.75 Arial,Helvetica,sans-serif;padding-bottom:28px}
        .dc-legal *{box-sizing:border-box}
        .dc-legal a{overflow-wrap:anywhere}
        .dc-head{background:#fff;border-bottom:4px solid var(--green);box-shadow:0 4px 18px #0f172a0a}
        .dc-wrap{width:min(100% - 36px,1060px);margin:auto}
        .dc-head-inner{padding:22px 0 17px}
        .dc-brand{display:flex;align-items:center;gap:12px;color:var(--green);font-size:clamp(18px,2.5vw,23px);font-weight:800;line-height:1.25;text-decoration:none}
        .dc-mark{width:42px;height:42px;display:grid;place-items:center;flex:none;border-radius:13px;background:#eaf7ef;font-size:23px}
        .dc-sub{margin:5px 0 0 54px;color:var(--muted);font-size:13px}
        .dc-nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:17px}
        .dc-nav a{padding:7px 12px;border:1px solid var(--line);border-radius:999px;color:var(--blue);font-size:13px;font-weight:700;text-decoration:none;transition:.2s}
        .dc-nav a:hover,.dc-nav a[aria-current=page]{background:#eaf7ef;border-color:#b7e2c7;color:#11683c}
        .dc-main{width:min(100% - 36px,1060px);margin:34px auto 0}
        .dc-card{overflow:hidden;background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 12px 36px #0f172a0e}
        .dc-hero{padding:clamp(24px,5vw,46px);background:linear-gradient(135deg,#f0fbf4,#f2f8fc);border-bottom:1px solid var(--line)}
        .dc-eyebrow{display:inline-flex;margin:0 0 12px;padding:5px 11px;border-radius:999px;background:#e0f3e7;color:#12683c;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
        .dc-legal h1{margin:0;color:#123b54;font-size:clamp(27px,4vw,38px);line-height:1.2;letter-spacing:-.025em}
        .dc-date{margin:12px 0 0;color:var(--muted);font-size:13px}
        .dc-body{padding:clamp(22px,4.5vw,44px)}
        .dc-intro{margin:0 0 28px;padding:18px 20px;border-left:4px solid var(--green);border-radius:0 10px 10px 0;background:#f5fbf7;color:#34465a}
        .dc-section{padding:0 0 20px;margin:0 0 20px;border-bottom:1px solid #edf1f4}
        .dc-section:last-of-type{padding-bottom:0;margin-bottom:0;border:0}
        .dc-legal h2{margin:0 0 8px;color:var(--blue);font-size:18px;line-height:1.4}
        .dc-section p{margin:0;color:#465569}
        .dc-contact{margin-top:30px;padding:20px;border:1px solid #ccebd7;border-radius:13px;background:#f0fdf4}
        .dc-contact h2{margin:0 0 9px;color:#12683c}
        .dc-contact p{margin:4px 0;color:#365344}
        .dc-contact a{color:#075985;text-decoration:none;font-weight:700}
        .dc-footer{padding:24px 18px 0;text-align:center;color:var(--muted);font-size:12px}
        @media(max-width:600px){
          .dc-wrap,.dc-main{width:min(100% - 24px,1060px)}
          .dc-head-inner{padding:17px 0 13px}
          .dc-sub{margin-left:0}
          .dc-nav{gap:6px}
          .dc-nav a{padding:7px 10px;font-size:12px}
          .dc-main{margin-top:18px}
          .dc-card{border-radius:13px}
          .dc-intro{padding:15px}
          .dc-legal h2{font-size:17px}
        }
        @media print{
          .dc-legal{background:#fff}
          .dc-nav{display:none}
          .dc-card{box-shadow:none;border:0}
          .dc-main{width:100%;margin:0}
          .dc-head{border-bottom:1px solid #999}
        }
      `}</style>

      <header className="dc-head">
        <div className="dc-wrap dc-head-inner">
          <a className="dc-brand" href="/">
            <span className="dc-mark" aria-hidden="true">✚</span>
            <span>{hospital.name}</span>
          </a>

          <p className="dc-sub">
            Healthcare Services · {hospital.location}
          </p>

          <nav className="dc-nav" aria-label="Legal and service pages">
            {nav.map(([href, label, key]) => (
              <a
                key={href}
                href={href}
                aria-current={type === key ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="dc-main">
        <article className="dc-card">
          <div className="dc-hero">
            <p className="dc-eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p className="dc-date">
              Effective date: {hospital.effectiveDate}
            </p>
          </div>

          <div className="dc-body">
            <p className="dc-intro">{page.intro}</p>

            {page.sections.map(([heading, text]) => (
              <section className="dc-section" key={heading}>
                <h2>{heading}</h2>
                <p>{text}</p>
              </section>
            ))}

            <section className="dc-contact">
              <h2>Contact Us</h2>
              <p><strong>{hospital.name}</strong></p>
              <p>
                Phone: <a href={`tel:${hospital.phone}`}>{hospital.phone}</a>
              </p>
              <p>
                Email: <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
              </p>
              <p>
                Website: <a href={hospital.website}>dewcarehospital.com</a>
              </p>
              <p>Legal business entity: To be confirmed.</p>
            </section>
          </div>
        </article>
      </div>

      <footer className="dc-footer">
        © {new Date().getFullYear()} {hospital.name}. All rights reserved.
      </footer>
    </main>
  );
}
