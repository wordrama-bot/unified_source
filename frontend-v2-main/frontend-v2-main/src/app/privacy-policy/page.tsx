"use client"
import NavBar from '@/components/navbar/h-nav';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Footer from '@/sections/footer';

const usLawData = [
    { category: "A. Identifiers", examples: "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name", collected: "YES" },
    { category: "B. Personal information as defined in the California Customer Records statute", examples: "Name, contact information, education, employment, employment history, and financial information", collected: "" },
    { category: "C. Protected classification characteristics under state or federal law", examples: "Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data", collected: "" },
    { category: "D. Commercial information", examples: "Transaction information, purchase history, financial details, and payment information", collected: "" },
    { category: "E. Biometric information", examples: "Fingerprints and voiceprints", collected: "" },
    { category: "F. Internet or other similar network activity", examples: "Browsing history, search history, online behaviour, interest data, and interactions with our and other websites, applications, systems, and advertisements", collected: "" },
    { category: "G. Geolocation data", examples: "Device location", collected: "" },
    { category: "H. Audio, electronic, sensory, or similar information", examples: "Images and audio, video or call recordings created in connection with our business activities", collected: "" },
    { category: "I. Professional or employment-related information", examples: "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us", collected: "" },
    { category: "J. Education Information", examples: "Student records and directory information", collected: "" },
    { category: "K. Inferences drawn from collected personal information", examples: "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics", collected: "YES" },
    { category: "L. Sensitive personal Information", examples: "", collected: "NO" },
  ];

export default function PrivacyPolicy() {
  return (
    <div className="flex min-h-screen w-full flex-col border:border dark:border-darkBorder bg-bg dark:bg-darkBg text-text dark:text-darkText">
      <NavBar
        links={[
          { href: "/about", text: "About" },
          { href: "/free-play", text: "Wordle" },
          { href: "/signup", text: "SignUp" },
        ]}
      />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated October 30, 2024</p>

        {/* Introduction Section */}
        <section className="my-8">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p className="mt-2">
            This privacy notice for <strong>Wordrama</strong> ('<strong>we</strong>', '<strong>us</strong>', or '<strong>our</strong>'), describes how and why we might collect, store, use, and/or share ("<strong>process</strong>") your information when you use our services ("<strong>Services</strong>"), such as when you:
          </p>
          <ul className="list-disc ml-8 mt-4">
            <li>
              Visit our website at{' '}
              <a href="https://wordrama.io" className="text-blue-500 hover:underline">
                https://wordrama.io
              </a>
              , or any website of ours that links to this privacy notice
            </li>
            <li>Engage with us in other related ways, including any sales, marketing, or events</li>
          </ul>
          <p className="mt-4">
            <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
            <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">
              support@wordrama.io
            </a>
            .
          </p>
        </section>

        {/* Summary of Key Points */}
        <section className="my-8">
          <h2 className="text-2xl font-semibold">Summary of key points</h2>
          <p className="mt-2">
            <strong>This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.</strong>
          </p>
          <ul className="list-disc ml-8 mt-4">
            <p><strong>What personal information do we process?</strong><br/>When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. Learn more about <a href="#personal-info" className="text-blue-500 hover:underline">personal information you disclose to us</a>.</p>
            <p className='mt-4'><strong>Do we process any sensitive personal information?</strong><br/>Some of the information may be considered 'special' or 'sensitive' in certain jurisdictions, for example your racial or ethnic origins, sexual orientation, and religious beliefs. We do not process sensitive personal information.</p>
            <p className='mt-4'><strong>Do we collect any information from third parties?</strong><br/>We do NOT collect any information from third parties.</p>
            <p className='mt-4'><strong>How do we process your information?</strong><br/>We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. Learn more about <a href="#info-use" className="text-blue-500 hover:underline">how we process your information</a>.</p>
            <p className='mt-4'><strong>In what situations and with which parties do we share personal information?</strong><br/>We may share information in specific situations and with specific third parties. Learn more about <a href="#who-share" className="text-blue-500 hover:underline">when and with whom we share your personal information</a>.</p>
            <p className='mt-4'><strong>How do we keep your information safe?</strong><br/>We have adequate organisational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Learn more about <a href="#info-safe" className="text-blue-500 hover:underline">how we keep your information safe</a>.</p>
            <p className='mt-4'><strong>What are your rights?</strong><br/>Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. Learn more about <a href="#privacy-rights" className="text-blue-500 hover:underline">your privacy rights</a>.</p>
            <p className='mt-4'><strong>How do you exercise your rights?</strong><br/>The easiest way to exercise your rights is by visiting <a href="https://forms.office.com/e/jemPRTFjmU" className="text-blue-200 hover:underline">Data Request Form</a>, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.</p>
          </ul>
          <ul className="list-disc mt-4">
            <p className='mt-4'>Want to learn more about what we do with any information we collect? <a href="#toc" className="text-blue-500 hover:underline">Review the Privacy Notice in full</a>.</p>
          </ul>
        </section>

        {/* Table of Contents */}
        <section id="toc" className="my-8">
          <h2 className="text-2xl font-semibold">Table of Contents</h2>
          <ul className="list-decimal ml-8 mt-4">
            <li>
              <a href="#information-we-collect" className="text-blue-500 hover:underline">
                What Information Do We Collect?
              </a>
            </li>
            <li>
              <a href="#how-we-process" className="text-blue-500 hover:underline">
                How Do We Process Your Information?
              </a>
            </li>
            <li>
              <a href="#legal-bases" className="text-blue-500 hover:underline">
                What Legal Bases Do We Rely On?
              </a>
            </li>
            <li>
              <a href="#share-information" className="text-blue-500 hover:underline">
                When and With Whom Do We Share Your Information?
              </a>
            </li>
            <li>
              <a href="#data-retention" className="text-blue-500 hover:underline">
                How Long Do We Keep Your Information?
              </a>
            </li>
            <li>
              <a href="#privacy-rights" className="text-blue-500 hover:underline">
                What Are Your Privacy Rights?
              </a>
            </li>
            <li>
              <a href="#updates" className="text-blue-500 hover:underline">
                Do We Make Updates to This Notice?
              </a>
            </li>
            <li>
              <a href="#contact" className="text-blue-500 hover:underline">
                How Can You Contact Us About This Notice?
              </a>
            </li>
          </ul>
        </section>

        {/* WHAT INFORMATION DO WE COLLECT? */}
        <section className="my-8">
          <h2 id="information-we-collect" className="text-2xl font-semibold">1. What Information Do We Collect?</h2>
          <h3><strong>Personal Information You Disclose to Us</strong></h3>
          <p className="mt-4">
            <i><strong>In Short</strong>: We collect personal information that you provide to us.</i>
          </p>
          <p className='mt-8'>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
          <p className='mt-4'><strong>Personal Information Provided by You</strong>. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>names</li>
            <li>email addresses</li>
            <li>usernames</li>
            <li>passwords</li>
            <li>contact preferences</li>
          </ul>
          <p className='mt-4'><strong>Sensitive Information</strong>. We do not process sensitive information.</p>
          <p className='mt-4'><strong>Payment Data</strong>. We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by Stripe. You may find their privacy notice link(s) here: <a className="text-blue-500 hover:underline" href="https://stripe.com/gb/privacy">https://stripe.com/gb/privacy</a>.</p>
          <p className='mt-4'><strong>Social Media Login Data</strong>. We may provide you with the option to register with us using your existing social media account details, like your Facebook, X, or other social media account. If you choose to register in this way, we will collect certain profile information about you from the social media provider, as described in the section called '<a className='text-blue-500 hover:underline' href="https://wordrama.io/privacy-policy#social-logins">How do we handle your social logins?</a>' below.</p>
          <p className='mt-8'>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>

          <h3 className='mt-8'><strong>Personal Information You Disclose to Us</strong></h3>
          <p className="mt-4">
            <i><strong>In Short</strong>: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</i>
          </p>
          <p className='mt-8'>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
          <p className='mt-8'>Like many businesses, we also collect information through cookies and similar technologies. You can find out more about this in our Cookie Notice: <a className="text-blue-500 hover:underline" href="https://wordrama.io/cookies">https://wordrama.io/cookies</a>.</p>
          <p className='mt-8'>The information we collect includes:</p>
          <ul className="list-disc ml-8 mt-2">
            <li><strong>Log and Usage Data</strong>. Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services and which we record in log files. Depending on how you interact with us, this log data may include your IP address, device information, browser type, and settings and information about your activity in the Services (such as the date/time stamps associated with your usage, pages and files viewed, searches, and other actions you take such as which features you use), device event information (such as system activity, error reports (sometimes called 'crash dumps'), and hardware settings).</li>
            <li><strong>Device Data</strong>. We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. Depending on the device used, this device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider and/or mobile carrier, operating system, and system configuration information.</li>
            <li><strong>Location Data</strong>. We collect location data such as information about your device's location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services.</li>
          </ul>
        </section>

        {/* HOW DO WE PROCESS YOUR INFORMATION? */}
        <section className="my-8">
          <h2 id="how-we-process" className="text-2xl font-semibold">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</i>
          </p>
          <p className='mt-4'><strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong></p>
          <ul className="list-disc ml-8 mt-2">
            <li><strong>To facilitate account creation and authentication and otherwise manage user accounts</strong>. We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
            <li><strong>To deliver and facilitate delivery of services to the user</strong>. We may process your information to provide you with the requested service.</li>
            <li><strong>To respond to user inquiries/offer support to users</strong>. We may process your information to respond to your inquiries and solve any potential issues you might have with the requested service.</li>
            <li><strong>To send administrative information to you</strong>. We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
            <li><strong>To fulfil and manage your orders</strong>. We may process your information to fulfil and manage your orders, payments, returns, and exchanges made through the Services.</li>
            <li><strong>To enable user-to-user communications</strong>. We may process your information if you choose to use any of our offerings that allow for communication with another user.</li>
            <li><strong>To request feedback</strong>. We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
            <li><strong>To send you marketing and promotional communications</strong>. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see '<a className="text-blue-500 hover:underline" href="#privacy-rights">What are your privacy rights?</a>' below.</li>
            <li><strong>To deliver targeted advertising to you</strong>. We may process your information to develop and display personalised content and advertising tailored to your interests, location, and more. For more information see our Cookie Notice: <a className="text-blue-500 hover:underline" href="https://wordrama.io/cookies">https://wordrama.io/cookies</a>'.</li>
            <li><strong>To protect our Services</strong>. We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</li>
            <li><strong>To identify usage trends</strong>. We may process information about how you use our Services to better understand how they are being used so we can improve them.</li>
            <li><strong>To determine the effectiveness of our marketing and promotional campaigns</strong>. We may process your information to better understand how to provide marketing and promotional campaigns that are most relevant to you.</li>
            <li><strong>To save or protect an individual's vital interest</strong>. We may process your information when necessary to save or protect an individual’s vital interest, such as to prevent harm.</li>
          </ul>
        </section>

        {/* WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION? */}
        <section className="my-8">
          <h2 id="legal-bases" className="text-2xl font-semibold">3. What legal bases do we rely on to process your information?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e. legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfil our contractual obligations, to protect your rights, or to fulfil our legitimate business interests.</i>
          </p>

          <h3 className="mt-4"><i><u>If you are located in the EU or UK, this section applies to you.</u></i></h3>
          <p className='mt-4'>The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:</p>
          <ul className="list-disc ml-8 mt-2">
            <li><strong>Consent</strong>. We may process your information if you have given us permission (i.e. consent) to use your personal information for a specific purpose. You can withdraw your consent at any time. Learn more about <a href="#withdraw-consent" className='text-blue-500 hover:underline'>withdrawing your consent</a>.</li>
            <li><strong>Performance of a Contract</strong>. We may process your information to provide you with the requested service.</li>
            <li><strong>Legitimate Interests</strong>. We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests and those interests do not outweigh your interests and fundamental rights and freedoms. For example, we may process your personal information for some of the purposes described in order to:</li>
            <ul className="list-disc ml-8">
              <li>Send users information about special offers and discounts on our products and services</li>
              <li>Develop and display personalised and relevant advertising content for our users</li>
              <li>Analyse how our Services are used so we can improve them to engage and retain users</li>
              <li>Support our marketing activities</li>
              <li>Diagnose problems and/or prevent fraudulent activities</li>
              <li>Understand how our users use our products and services so we can improve user experience</li>
            </ul>
            <li><strong>Legal Obligations</strong>. We may process your information where we believe it is necessary for compliance with our legal obligations, such as to cooperate with a law enforcement body or regulatory agency, exercise or defend our legal rights, or disclose your information as evidence in litigation in which we are involved.</li>
            <li><strong>Vital Interests</strong>. We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party, such as situations involving potential threats to the safety of any person.</li>
          </ul>

          <h3 className="mt-4"><i><u>If you are located in Canada, this section applies to you.</u></i></h3>
          <p className='mt-4'>We may process your information if you have given us specific permission (i.e. express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e. implied consent). You can <a className='text-blue-500 hover:underline' href="#withdraw-consent">withdraw your consent</a> at any time.</p>
          <p className='mt-4'>In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way</li>
            <li>For investigations and fraud detection and prevention</li>
            <li>For business transactions provided certain conditions are met</li>
            <li>If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim</li>
            <li>For identifying injured, ill, or deceased persons and communicating with next of kin</li>
            <li>If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse</li>
            <li>If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province</li>
            <li>If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records</li>
            <li>If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced</li>
            <li>If the collection is solely for journalistic, artistic, or literary purposes</li>
            <li>If the information is publicly available and is specified by the regulations</li>
          </ul>
        </section>

        {/* WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION? */}
        <section className="my-8">
          <h2 id="who-share" className="text-2xl font-semibold">4. When and with whom do we share your personal information?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We may share information in specific situations described in this section and/or with the following third parties.</i>
          </p>

          <p className='mt-4'><strong>Vendors, Consultants, and Other Third-Party Service Providers</strong>. We may share your data with third-party vendors, service providers, contractors, or agents ('third parties') who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organisation apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct.</p>

          <p className='mt-4'>The third parties we may share personal information with are as follows:</p>
          <ul className="list-disc ml-8 mt-2">
            <li><strong>Advertising, Direct Marketing, and Lead Generation</strong></li>
            Google AdSense
            <li><strong>AI Service Providers</strong></li>
            Microsoft Azure AI
            <li><strong>Allow Users to Connect to Their Third-Party Accounts</strong></li>
            Discord account
            <li><strong>Cloud Computing Services</strong></li>
            Microsoft Azure, Amazon Web Services (AWS) and Vercel
            <li><strong>Communicate and Chat with Users</strong></li>
            Discord and Email
            <li><strong>Functionality and Infrastructure Optimisation</strong></li>
            Supabase, Microsoft Azure and Amazon Web Services
            <li><strong>Invoice and Billing</strong></li>
            Stripe
            <li><strong>User Account Registration and Authentication</strong></li>
            Supabase and Discord OAuth
            <li><strong>Web and Mobile Analytics</strong></li>
            Azure Application Insights
            <li><strong>Website Hosting</strong></li>
            Vercel and Microsoft Azure
            <li><strong>Website Performance Monitoring</strong></li>
            Azure Application Insights
            <li><strong>Website Testing</strong></li>
            Azure Application Insights
          </ul>

          <p className='mt-4'>We also may need to share your personal information in the following situations:</p>
          <ul className="list-disc ml-8 mt-2">
            <li><strong>Business Transfers</strong>. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
          </ul>
        </section>

        {/* WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES? */}
        <section className="my-8">
          <h2 id="3p-websites" className="text-2xl font-semibold">5. What is our stance on third-party websites?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services.</i>
          </p>

          <p className='mt-4'><strong>Vendors, Consultants, and Other Third-Party Service Providers</strong>. We may share your data with third-party vendors, service providers, contractors, or agents ('third parties') who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information. This means that they cannot do anything with your personal information unless we have instructed them to do it. They will also not share your personal information with any organisation apart from us. They also commit to protect the data they hold on our behalf and to retain it for the period we instruct.</p>

          <p className='mt-4'>The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third-party websites. Any data collected by third parties is not covered by this Privacy Notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions.</p>
        </section>

        {/* DO WE USE COOKIES AND OTHER TRACKING TECHNOLOGIES? */}
        <section className="my-8">
          <h2 id="cookies" className="text-2xl font-semibold">6. Do we use cookies and other tracking technologies?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We may use cookies and other tracking technologies to collect and store your information.</i>
          </p>

          <p className='mt-4'>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services and your account, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>

          <p className='mt-4'>We also permit third parties and service providers to use online tracking technologies on our Services for analytics and advertising, including to help manage and display advertisements, to tailor advertisements to your interests, or to send abandoned shopping cart reminders (depending on your communication preferences). The third parties and service providers use their technology to provide advertising about products and services tailored to your interests which may appear either on our Services or on other websites.</p>

          <p className='mt-4'>To the extent these online tracking technologies are deemed to be a 'sale'/'sharing' (which includes targeted advertising, as defined under the applicable laws) under applicable US state laws, you can opt out of these online tracking technologies by submitting a request as described below under section '<a href="#us-laws" className='text-blue-500 hover:underline'>Do united states residents have specific privacy rights?</a>'</p>

          <p className='mt-4'>Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice: <a href="https://wordrama.io/cookies" className='text-blue-500 hover:underline'>https://wordrama.io/cookies</a>.</p>
        </section>

        {/* HOW DO WE HANDLE YOUR SOCIAL LOGINS? */}
        <section className="my-8">
          <h2 id="social-logins" className="text-2xl font-semibold">7. How do we handle your social logins?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</i>
          </p>

          <p className='mt-4'>Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or X logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.</p>

          <p className='mt-4'>We will use the information we receive only for the purposes that are described in this Privacy Notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.</p>
        </section>

        {/* HOW LONG DO WE KEEP YOUR INFORMATION? */}
        <section className="my-8">
          <h2 id="info-retain" className="text-2xl font-semibold">8. How long do we keep your information?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We keep your information for as long as necessary to fulfil the purposes outlined in this Privacy Notice unless otherwise required by law.</i>
          </p>

          <p className='mt-4'>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.</p>

          <p className='mt-4'>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymise such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.</p>
        </section>

        {/* HOW LONG DO WE KEEP YOUR INFORMATION? */}
        <section className="my-8">
          <h2 id="info-safe" className="text-2xl font-semibold">9. How do we keep your information safe?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We aim to protect your personal information through a system of organisational and technical security measures.</i>
          </p>

          <p className='mt-4'>We have implemented appropriate and reasonable technical and organisational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorised third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.</p>
        </section>

        {/* DO WE COLLECT INFORMATION FROM MINORS? */}
        <section className="my-8">
          <h2 id="info-minors" className="text-2xl font-semibold">10. Do we collect information from minors?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: We do not knowingly collect data from or market to children under 18 years of age.</i>
          </p>

          <p className='mt-4'>We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">support@wordrama.io</a>.</p>
        </section>

        {/* WHAT ARE YOUR PRIVACY RIGHTS? */}
        <section className="my-8">
          <h2 id="privacy-rights" className="text-2xl font-semibold">11. What are your privacy right?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</i>
          </p>

          <p className='mt-4'>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (iv) if applicable, to data portability; and (v) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section '<a href="#contact" className="text-blue-500 hover:underline">How can you contact us about this notice?</a>' below.</p>

          <p className='mt-4'>We will consider and act upon any request in accordance with applicable data protection laws.</p>

          <p className='mt-4'>If you are located in the EEA or UK and you believe we are unlawfully processing your personal information, you also have the right to complain to your <a href="https://ec.europa.eu/newsroom/article29/items/612080" target='_blank' className='text-blue-200  hover:underline'>Member State data protection authority</a> or <a href="https://ico.org.uk/make-a-complaint/data-protection-complaints/" target='_blank' className='text-blue-200 hover:underline'>UK data protection authority</a>.</p>

          <p className='mt-4'>If you are located in Switzerland, you may contact the <a href="https://www.edoeb.admin.ch/edoeb/en/home.html" target='_blank' className='text-blue-200  hover:underline'>Federal Data Protection and Information Commissioner</a>.</p>

          <p className='mt-4'><b>Withdrawing your consent</b>: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section '<a href="#contact">How can you contact us about this notice?</a>' below or updating your preferences.</p>

          <p className='mt-4'>However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.</p>

          <p className='mt-4'><b>Opting out of marketing and promotional communications</b>: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, replying 'STOP' or 'UNSUBSCRIBE' to the SMS messages that we send, or by contacting us using the details provided in the section '<a href="#contact" className='text-blue-500 hover:underline'>How can you contact us about this notice?</a>' below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes.</p>

          <h3 className="text-xl font-semibold mt-4">Account Information</h3>
          <p className='mt-4'>If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Log in to your account settings and update your user account.</li>
            <li>Contact us using the contact information provided.</li>
          </ul>
          <p className='mt-4'>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
          <p className='mt-4'><strong>Cookies and similar technologies</strong>: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services. You may also <a href="http://www.aboutads.info/choices/" target='_blank' className='text-blue-200 hover:underline'>opt out of interest-based advertising by advertisers</a> on our Services. For further information, please see our Cookie Notice: <a href="https://wordrama.io/cookies" className='text-blue-500 hover:underline'>https://wordrama.io/cookies</a>.</p>

          <p className='mt-4'>If you have questions or comments about your privacy rights, you may email us at <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a>.</p>
        </section>

        {/* CONTROLS FOR DO-NOT-TRACK FEATURES */}
        <section className="my-8">
          <h2 id="dnt" className="text-2xl font-semibold">12. Controls for do-not-track features</h2>
          <p className="mt-4">Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ('DNT') feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognising and implementing DNT signals has been finalised. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</p>

          <p className='mt-4'>California law requires us to let you know how we respond to web browser DNT signals. Because there currently is not an industry or legal standard for recognising or honouring DNT signals, we do not respond to them at this time.</p>
        </section>

        {/* DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS? */}
        <section className="my-8">
          <h2 id="us-laws" className="text-2xl font-semibold">13. Do United States residents have specific privacy rights?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. More information is provided below.</i>
          </p>

          <h3 className="text-xl font-semibold mt-4">Categories of Personal Information We Collect</h3>
          <p className='mt-4'>We have collected the following categories of personal information in the past twelve (12) months:</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Examples</TableHead>
                <TableHead>Collected</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usLawData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.examples}</TableCell>
                  <TableCell>{row.collected}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className='mt-4'>We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Receiving help through our customer support channels;</li>
            <li>Participation in customer surveys or contests; and</li>
            <li>Facilitation in the delivery of our Services and to respond to your inquiries.</li>
          </ul>
          <p className='mt-4'>We will use and retain the collected personal information as needed to provide the Services or for:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Category A - As long as the user has an account with us</li>
            <li>Category B - As long as the user has an account with us</li>
            <li>Category C - As long as the user has an account with us</li>
            <li>Category D - As long as the user has an account with us</li>
            <li>Category E - As long as the user has an account with us</li>
            <li>Category F - As long as the user has an account with us</li>
            <li>Category G - As long as the user has an account with us</li>
            <li>Category H - As long as the user has an account with us</li>
            <li>Category I - As long as the user has an account with us</li>
            <li>Category J - As long as the user has an account with us</li>
            <li>Category K - As long as the user has an account with us</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4">Sources of Personal Information</h3>
          <p className='mt-4'>Learn more about the sources of personal information we collect in '<a href="#info-collect" className='text-blue-500 hover:underline'>What information do we collect?</a>'</p>

          <h3 className="text-xl font-semibold mt-4">How We Use and Share Personal Information</h3>
          <p className='mt-4'>Learn more about how we use your personal information in the section, '<a href="#info-use" className='text-blue-500 hover:underline'>How do we process your information?</a>'</p>
          <p className='mt-4'>We collect and share your personal information through:</p>
          <ul className="list-disc ml-8 mt-2">
            <li>Targeting cookies/Marketing cookies</li>
          </ul>
          <p className='mt-4'><b>Will your information be shared with anyone else?</b></p>
          <p className='mt-4'>We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Learn more about how we disclose personal information to in the section, '<a href='#who-share' className="text-blue-500 hover:underline">When and with whom do we share your personal information?</a>'</p>
          <p className='mt-4'>We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be 'selling' of your personal information.</p>

          <p className='mt-4'>We have disclosed the following categories of personal information to third parties for a business or commercial purpose in the preceding twelve (12) months:</p>
          <ul className='list-disc ml-8 mt-2'>
            <li>Category A - Identifiers</li>
            <li>Category B - Personal information as defined in the California Customer Records law</li>
            <li>Category C - Characteristics of protected classifications under state or federal law</li>
            <li>Category D - Commercial information</li>
            <li>Category E - Biometric information</li>
            <li>Category F - Internet or other electronic network activity information</li>
            <li>Category G - Geolocation data</li>
            <li>Category H - Audio, electronic, visual, and similar information</li>
            <li>Category I - Professional or employment-related information</li>
            <li>Category J - Education information</li>
            <li>Category K - Inferences drawn from collected personal information</li>
          </ul>

          <p className='mt-4'>The categories of third parties to whom we disclosed personal information for a business or commercial purpose can be found under '<a href="#who-share" className='text-blue-500 hover:underline'>When and with whom do we share your personal information?</a>'</p>
          <p className='mt-4'>We have sold or shared the following categories of personal information to third parties in the preceding twelve (12) months:</p>
          <p className='mt-4'>The categories of third parties to whom we sold personal information are:</p>
          <p className='mt-4'>The categories of third parties to whom we shared personal information with are:</p>
          <ul className='list-disc ml-8 mt-2'>
            <li>Advertising, Direct Marketing, and Lead Generation</li>
            Google AdSense
          </ul>

          <h3 className="text-xl font-semibold mt-4">Your Rights</h3>
          <p className='mt-4'>You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:</p>
          <ul className='list-disc ml-8 mt-2'>
            <li><b>Right to know</b> whether or not we are processing your personal data</li>
            <li><b>Right to access</b> your personal data</li>
            <li><b>Right to correct</b> inaccuracies in your personal data</li>
            <li><b>Right to request</b> the deletion of your personal data</li>
            <li><b>Right to obtain</b> a copy of the personal data you previously shared with us</li>
            <li><b>Right to non-discrimination</b> for exercising your rights</li>
            <li><b>Right to opt out</b> of the processing of your personal data if it is used for targeted advertising (or sharing as defined under California’s privacy law), the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects ('profiling')</li>
          </ul>
          <p className='mt-4'>Depending upon the state where you live, you may also have the following rights:</p>
          <ul className='list-disc ml-8 mt-2'>
            <li>Right to access the categories of personal data being processed (as permitted by applicable law, including Minnesota’s privacy law)</li>
            <li>Right to obtain a list of the categories of third parties to which we have disclosed personal data (as permitted by applicable law, including California's and Delaware's privacy law)</li>
            <li>Right to obtain a list of specific third parties to which we have disclosed personal data (as permitted by applicable law, including Minnesota's and Oregon's privacy law)</li>
            <li>Right to review, understand, question, and correct how personal data has been profiled (as permitted by applicable law, including Minnesota’s privacy law)</li>
            <li>Right to limit use and disclosure of sensitive personal data (as permitted by applicable law, including California’s privacy law)</li>
            <li>Right to opt out of the collection of sensitive data and personal data collected through the operation of a voice or facial recognition feature (as permitted by applicable law, including Florida’s privacy law)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4">How to Exercise Your Rights</h3>
          <p className='mt-4'>To exercise these rights, you can contact us by visiting <a href="https://forms.office.com/e/jemPRTFjmU" className="text-blue-200 hover:underline">Data Request Form</a>, by emailing us at <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a>, by visiting <a href="https://forms.office.com/e/WCW3FcsDgW" className='text-blue-200 hover:underline'>Contact Form</a>, or by referring to the contact details at the bottom of this document.</p>
          <p className='mt-4'>You can opt out from the selling of your personal information, targeted advertising, or profiling by disabling cookies in Cookie Preference Settings.</p>
          <p className='mt-4'>Under certain US state data protection laws, you can designate an authorised agent to make a request on your behalf. We may deny a request from an authorised agent that does not submit proof that they have been validly authorised to act on your behalf in accordance with applicable laws.</p>

          <h3 className="text-xl font-semibold mt-4">Request Verification</h3>
          <p className='mt-4'>Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. We will only use personal information provided in your request to verify your identity or authority to make the request. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes.</p>
          <p className='mt-4'>If you submit the request through an authorised agent, we may need to collect additional information to verify your identity before processing your request and the agent will need to provide a written and signed permission from you to submit such request on your behalf.</p>

          <h3 className="text-xl font-semibold mt-4">Appeals</h3>
          <p className='mt-4'>Under certain US state data protection laws, if we decline to take action regarding your request, you may appeal our decision by emailing us at <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a>. We will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal is denied, you may submit a complaint to your state attorney general.</p>

          <h3 className="text-xl font-semibold mt-4">California 'Shine The Light' Law</h3>
          <p className='mt-4'>California Civil Code Section 1798.83, also known as the 'Shine The Light' law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us by using the contact details provided in the section '<a href="#contact" className='text-blue-500 hover:underline'>How can you contact us about this notice?</a>'</p>
        </section>

        {/* DO OTHER REGIONS HAVE SPECIFIC PRIVACY RIGHTS? */}
        <section className="my-8">
          <h2 id="info-minors" className="text-2xl font-semibold">14. Do other regions have specific privacy rights?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: You may have additional rights based on the country you reside in.</i>
          </p>

          <h3 className='text-xl font-semibold mt-4'>Australia and New Zealand</h3>
          <p className='mt-4'>We collect and process your personal information under the obligations and conditions set by Australia's Privacy Act 1988 and New Zealand's Privacy Act 2020 (Privacy Act).</p>
          <p className='mt-4'>This Privacy Notice satisfies the notice requirements defined in both Privacy Acts, in particular: what personal information we collect from you, from which sources, for which purposes, and other recipients of your personal information.</p>
          <p className='mt-4'>If you do not wish to provide the personal information necessary to fulfil their applicable purpose, it may affect our ability to provide our services, in particular:</p>
          <ul className='list-disc ml-8 mt-2'>
            <li>offer you the products or services that you want</li>
            <li>respond to or help with your requests</li>
            <li>manage your account with us</li>
            <li>confirm your identity and protect your account</li>
          </ul>
          <p className='mt-4'>At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section '<a href="#request" className='text-name-500 hover:underline'>How can you review, update, or delete the data we collect from you?</a>'</p>
          <p className='mt-4'>If you believe we are unlawfully processing your personal information, you have the right to submit a complaint about a breach of the Australian Privacy Principles to the <a href="https://www.oaic.gov.au/privacy/privacy-complaints/lodge-a-privacy-complaint-with-us" target="_blank" className='text-blue-200 hover:underline'>Office of the Australian Information Commissioner</a> and a breach of New Zealand's Privacy Principles to the <a target="_blank" className='text-blue-200 hover:underline' href="https://www.privacy.org.nz/your-rights/making-a-complaint-to-the-privacy-commissioner/">Office of New Zealand Privacy Commissioner</a>.</p>

          <h3 className='text-xl font-semibold mt-4'>Republic of South Africa</h3>
          <p className='mt-4'>At any time, you have the right to request access to or correction of your personal information. You can make such a request by contacting us by using the contact details provided in the section '<a href="#request" className='text-name-500 hover:underline'>How can you review, update, or delete the data we collect from you?</a>'</p>
          <p className='mt-4'>If you are unsatisfied with the manner in which we address any complaint with regard to our processing of personal information, you can contact the office of the regulator, the details of which are:</p>

          <p className='mt-4'><a href="https://inforegulator.org.za/" rel="noopener noreferrer" target="_blank" className='text-blue-200 hover:underline'>The Information Regulator (South Africa)</a></p>
          <p className='mt-4'>General enquiries: <a href="mailto:enquiries@inforegulator.org.za" rel="noopener noreferrer" target="_blank" className='text-blue-200 hover:underline'>enquiries@inforegulator.org.za</a></p>
          <p className='mt-4'>Complaints (complete POPIA/PAIA form 5)</p>
          <p className='mt-4'><a href="mailto:PAIAComplaints@inforegulator.org.za" rel="noopener noreferrer" target="_blank" className='text-blue-200 hover:underline'>PAIAComplaints@inforegulator.org.za</a> & <a href="mailto:POPIAComplaints@inforegulator.org.za" rel="noopener noreferrer" target="_blank" className='text-blue-200 hover:underline'>POPIAComplaints@inforegulator.org.za</a></p>
        </section>

        {/* DO WE MAKE UPDATES TO THIS NOTICE? */}
        <section className="my-8">
          <h2 id="policy-updates" className="text-2xl font-semibold">15. Do we make updates to this notice?</h2>
          <p className="mt-4">
            <i><strong>In Short</strong>: Yes, we will update this notice as necessary to stay compliant with relevant laws.</i>
          </p>

          <p className='mt-4'>We may update this Privacy Notice from time to time. The updated version will be indicated by an updated 'Revised' date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</p>
        </section>

        {/* HOW CAN YOU CONTACT US ABOUT THIS NOTICE? */}
        <section className="my-8">
          <h2 id="contact" className="text-2xl font-semibold">16. How can you contact us about this notice?</h2>

          <p className='mt-4'>If you have questions or comments about this notice, you may contact our Data Protection Officer (DPO) by email at <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">support@wordrama.io</a></p>
        </section>

        {/* HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU? */}
        <section className="my-8">
          <h2 id="request" className="text-2xl font-semibold">17. How can you review, update, or delete the data we collect from you?</h2>

          <p className='mt-4'>Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law. To request to review, update, or delete your personal information, please email us at: <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">support.wordrama.io</a>.</p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
