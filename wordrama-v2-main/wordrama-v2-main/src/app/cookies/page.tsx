"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function CookiePolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Cookie Policy</h1>
        <p className="text-sm text-gray-500">Last updated February 24, 2026</p>

        <section className="my-8">
          <p className="mt-2">This Cookie Policy explains how Wordrama ("Company," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at <a href="https://wordrama.io" className='text-blue-500 hover:underline'>https://wordrama.io</a> ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
          <p className="mt-4">In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">What are cookies?</h2>
          <p className="mt-2">Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
          <p className="mt-2">Cookies set by the website owner (in this case, Wordrama) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Why do we use cookies?</h2>
          <p className="mt-2">We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Do you deliver internationally?</h2>
          <p className="mt-2">We offer worldwide shipping. Free Digital Delivery shipping is valid on international orders.</p>
          <p className="mt-4">Please note, we may be subject to various rules and restrictions in relation to some international deliveries and you may be subject to additional taxes and duties over which we have no control. If such cases apply, you are responsible for complying with the laws applicable to the country where you live and will be responsible for any such additional costs or taxes.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">How can I control cookies?</h2>
          <p className="mt-2">You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.</p>
          <p className="mt-4">The Cookie Consent Manager can be found in the notification banner and on our Website. If you choose to reject cookies, you may still use our Website though your access to some functionality and areas of our Website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.</p>
          <p className="mt-4">The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table below (please note that the specific cookies served may vary depending on the specific Online Properties you visit):</p>

          <h3 className="mt-8 text-xl font-semibold underline">Essential website cookies:</h3>
          <p className="mt-4">These cookies are strictly necessary to provide you with services available through our Website and to use some of its features, such as access to secure areas.</p>
          <ul className='list-none ml-8 list-inside mt-2'>
            <li>Name: sb-qflfxxbnhwaxkxsygjqu-auth-token.0</li>
            <li>Purpose: This is used to authenticate with the Backend</li>
            <li>Provider: wordrama.io</li>
            <li>Service: Supabase <a href="https://supabase.com/privacy" target='_blank' className='text-blue-200 hover:underline'>View Service Privacy Policy</a></li>
            <li>Type: http_cookie</li>
            <li>Expires in: 1 year from creation</li>
            <br/>
            <li>Name: sb-qflfxxbnhwaxkxsygjqu-auth-token.1</li>
            <li>Purpose: This is used to authenticate with the Backend</li>
            <li>Provider: wordrama.io</li>
            <li>Service: Supabase <a href="https://supabase.com/privacy" target='_blank' className='text-blue-200 hover:underline'>View Service Privacy Policy</a></li>
            <li>Type: http_cookie</li>
            <li>Expires in: 1 year from creation</li>
          </ul>

          <h3 className="mt-8 text-xl font-semibold underline">Performance and functionality cookies:</h3>
          <p className="mt-4">These cookies are used to enhance the performance and functionality of our Website but are non-essential to their use. However, without these cookies, certain functionality (like videos) may become unavailable.</p>
          <ul className='list-none ml-8 list-inside mt-2'>
            <li>Name: ai_user</li>
            <li>Purpose: Collects telemetry information and statistical usage for the Microsoft Application Insights software. It is able to recognize users on return visits by storing unique identifiers.</li>
            <li>Provider: wordrama.io/Azure</li>
            <li>Service: Azure <a href="https://www.microsoft.com/en-gb/privacy/" target='_blank' className='text-blue-200 hover:underline'>View Service Privacy Policy</a></li>
            <li>Type: http_cookie</li>
            <li>Expires in: 1 year from creation</li>
            <br/>
            <li>Name: ai_session</li>
            <li>Purpose: Monitors the performance of the iperceptions portal of applications running on Azure</li>
            <li>Provider: wordrama.io</li>
            <li>Service: Azure <a href="https://www.microsoft.com/en-gb/privacy/" target='_blank' className='text-blue-200 hover:underline'>View Service Privacy Policy</a></li>
            <li>Type: http_cookie</li>
            <li>Expires in: 30 minutes from creation</li>
          </ul>

          <h3 className="mt-8 text-xl font-semibold underline">Analytics and customization cookies:</h3>
          <p className="mt-4">These cookies collect information that is used either in aggregate form to help us understand how our Website is being used or how effective our marketing campaigns are, or to help us customize our Website for you.</p>
          <ul className='list-none ml-8 list-inside mt-2'>
          </ul>

          <h3 className="mt-8 text-xl font-semibold underline">Unclassified cookies:</h3>
          <p className="mt-4">These are cookies that have not yet been categorized. We are in the process of classifying these cookies with the help of their providers.</p>
          <ul className='list-none ml-8 list-inside mt-2'>
            <li>Name: AI_buffer_1</li>
            <li>Provider: wordrama.io</li>
            <li>Service: Azure <a href="https://www.microsoft.com/en-gb/privacy/" target='_blank' className='text-blue-200 hover:underline'>View Service Privacy Policy</a></li>
            <li>Type: html_session_storage</li>
            <li>Expires in: session</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">How can I control cookies on my browser?</h2>
          <p className="mt-4">As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:</p>
          <ul className='list-disc ml-8 list-inside mt-2'>
            <li><a className="text-blue-200 hover:underline" href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies">Chrome</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d">Microsoft Edge</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US">Firefox</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac">Safari</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://help.opera.com/en/latest/web-preferences/">Opera</a></li>
          </ul>
          <p className="mt-4">In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:</p>
          <ul className='list-disc ml-8 list-inside mt-2'>
            <li><a className="text-blue-200 hover:underline" href="https://optout.aboutads.info/?c=2&lang=EN">Digital Advertising Alliance</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://youradchoices.ca/">Digital Advertising Alliance of Canada</a></li>
            <li><a className="text-blue-200 hover:underline" href="https://www.youronlinechoices.com/">European Interactive Digital Advertising Alliance</a></li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">What about other tracking technologies, like web beacons?</h2>
          <p className="mt-4">Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Do you use Flash cookies or Local Shared Objects?</h2>
          <p className="mt-2">Websites may also use so-called "Flash Cookies" (also known as Local Shared Objects or "LSOs") to, among other things, collect and store information about your use of our services, fraud prevention, and for other site operations.</p>
          <p className="mt-4">If you do not want Flash Cookies stored on your computer, you can adjust the settings of your Flash player to block Flash Cookies storage using the tools contained in the <a className="text-blue-200 hover:underline" target='_blank' href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager07.html">Website Storage Settings Panel</a>. You can also control Flash Cookies by going to the <a className="text-blue-200 hover:underline" target='_blank' href="https://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager03.html">Global Storage Settings Panel</a> and following the instructions (which may include instructions that explain, for example, how to delete existing Flash Cookies (referred to "information" on the Macromedia site), how to prevent Flash LSOs from being placed on your computer without your being asked, and (for Flash Player 8 and later) how to block Flash Cookies that are not being delivered by the operator of the page you are on at the time).</p>
          <p className="mt-4">Please note that setting the Flash Player to restrict or limit acceptance of Flash Cookies may reduce or impede the functionality of some Flash applications, including, potentially, Flash applications used in connection with our services or online content.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Do you serve targeted advertising?</h2>
          <p className="mt-4">Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">How often will you update this Cookie Policy?</h2>
          <p className="mt-4">We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>
          <p className="mt-4">The date at the top of this Cookie Policy indicates when it was last updated.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Where can I get further information?</h2>
          <p className="mt-4">If you have any questions about our use of cookies or other technologies, please contact us at: <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a></p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
