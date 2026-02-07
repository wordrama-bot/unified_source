"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function AcceptableUsePolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Acceptable Use</h1>
        <p className="text-sm text-gray-500">Last updated October 26, 2024</p>

        <section className="my-8">
          <p className="mt-2">This Acceptable Use Policy ('Policy') is part of our Terms of Use ('Legal Terms') and should therefore be read alongside our main Legal Terms: <a href="https://wordrama.io/terms-of-use" className="text-blue-500 hover:underline">Terms of Use</a>. When you use the AI-powered services provided by Wordrama.io ('AI Products'), you warrant that you will comply with this document, our Legal Terms and all applicable laws and regulations governing AI. Your usage of our AI Products signifies your agreement to engage with our platform in a lawful, ethical, and responsible manner that respects the rights and dignity of all individuals. If you do not agree with these Legal Terms, please refrain from using our Services. Your continued use of our Services implies acceptance of these Legal Terms.</p>
          <p className="mt-4">Please carefully review this Policy which applies to any and all:</p>
          <ul className="list-none ml-8 list-inside mt-2">
            <li>(a) uses of our Services (as defined in 'Legal Terms')</li>
            <li>(b) forms, materials, consent tools, comments, post, and all other content available on the Services ('Content')</li>
            <li>(c) material which you contribute to the Services including any upload, post, review, disclosure, ratings, comments, chat etc. in any forum, chatrooms, reviews, and to any interactive services associated with it ('Contribution')</li>
            <li>(d) responsible implementation and management of AI Products within our Services</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Who we are</h2>
          <p className="mt-2 ml-8">We are Wordrama.io ('Company', 'we', 'us', or 'our'), a part of DEVVY LTD a company registered in England at 128 City Road, London EC1V 2NX.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Use of the services</h2>
          <p className="mt-2 ml-8">When you use the Services, you warrant that you will comply with this Policy and with all applicable laws.</p>
          <p className="mt-4 ml-8">You also acknowledge that you may not:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Make any unauthorised use of the Services, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretences.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the Services, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Services and/or the Content contained therein.</li>
            <li>Engage in unauthorised framing of or linking to the Services.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Make improper use of our Services, including our support services or submit false reports of abuse or misconduct.</li>
            <li>Engage in any automated use of the Services, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
            <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or the Services connected.</li>
            <li>Attempt to impersonate another user or person or use the username of another user.</li>
            <li>Use any information obtained from the Services in order to harass, abuse, or harm another person.</li>
            <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavour or commercial enterprise.</li>
            <li>Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Services, except as expressly permitted by applicable law.</li>
            <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services.</li>
            <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you.</li>
            <li>Delete the copyright or other proprietary rights notice from any Content.</li>
            <li>Copy or adapt the Services’ software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
            <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Services or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Services.</li>
            <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats ('gifs'), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as 'spyware' or 'passive collection mechanisms' or 'pcms').</li>
            <li>Except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Services, or using or launching any unauthorised script or other software.</li>
            <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</li>
            <li>Use the Services in a manner inconsistent with any applicable laws or regulations.</li>
            <li>Use a buying agent or purchasing agent to make purchases on the Services.</li>
            <li>Sell or otherwise transfer your profile.</li>
          </ul>

          <h3 className="text-xl font-semibold ml-8 mt-4">Subscriptions</h3>
          <p className='mt-2 ml-8'>If you subscribe to our Services, you understand, acknowledge, and agree that you may not, except if expressly permitted:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>Engage in any use, including modification, copying, redistribution, publication, display, performance, or retransmission, of any portions of any Services, other than as expressly permitted by this Policy, without the prior written consent of Wordrama.io, which consent Wordrama.io may grant or refuse in its sole and absolute discretion.</li>
            <li>Reconstruct or attempt to discover any source code or algorithms of the Services, or any portion thereof, by any means whatsoever.</li>
            <li>Provide, or otherwise make available, the Services to any third party.</li>
            <li>Intercept any data not intended for you.</li>
            <li>Damage, reveal, or alter any user's data, or any other hardware, software, or information relating to another person or entity.</li>
          </ul>

          <h3 className="text-xl font-semibold ml-8 mt-4">AI Products</h3>
          <p className='mt-2 ml-8'>When you use the AI Products provided by Wordrama.io, you warrant that you will not:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>Deploy AI techniques that utilise subliminal, manipulative, or deceptive methods designed to distort behaviour and impair informed decision-making, particularly when such actions cause significant harm to individuals.</li>
            <li>Exploit vulnerabilities related to age, disability, or socio-economic circumstances through AI in a way that distorts behaviour or decision-making, especially if this results in significant harm to the individual.</li>
            <li>Use AI systems for biometric categorization that infer sensitive attributes such as race, political opinions, trade union membership, religious or philosophical beliefs, sex life, or sexual orientation, except in limited cases, such as labelling or filtering lawfully acquired datasets, or specific law enforcement activities.</li>
            <li>Implement AI-based social scoring systems that evaluate or classify individuals or groups based on their social behaviour or personal traits in a manner that causes harm, discrimination, or unfair treatment.</li>
            <li>Assess the risk of an individual committing criminal offenses based solely on profiling, personality traits, or other non-behavioural factors, except in narrowly defined circumstances where legal safeguards are in place.</li>
            <li>Not compile facial recognition databases through untargeted scraping of facial images from the internet, social media, or CCTV footage, unless it is part of a legally compliant and narrowly defined purpose.</li>
            <li>Use AI to infer emotions in sensitive environments such as workplaces, educational institutions, or any other context where such analysis could lead to discrimination, unfair treatment, or privacy violations.</li>
            <li>Engage in real-time remote biometric identification in public places for law enforcement purposes, except in specific situations where there are strong legal justifications and oversight mechanisms.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Community/Forum Guidelines (Discord)</h2>
          <ol className="list-decimal ml-8 list-inside mt-2">
            <li>Be nice, treat all members and staff with respect.</li>
            <li>No spamming.</li>
            <li>Discriminatory jokes and language related to one’s race, age, gender, disability, etc. are prohibited.</li>
            <li>No doxxing or harassment (especially threats on someone’s life/property) or encouraging self harm.</li>
            <li>All NSFW related subjects are prohibited.</li>
            <li>No attempting to bypass the chat filter.</li>
            <li>No promoting any content including channel's, extraneous servers, dm Advertising, etc. Unless through parthership or content creator role.</li>
            <li>You're not allowed to attempt evade punishment, such as using an alternate account to bypass restrictions.</li>
            <li>Please stick to English in all channels</li>
          </ol>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Artificial Intelligence</h2>
          <p className="mt-2 ml-8">We recognise the significant impact AI can have on our users and society, and we are dedicated to ensuring that our AI Products are designed and operated in a manner that aligns with comprehensive ethical standards. We aim to use AI to enhance user experiences while upholding fairness, transparency, and accountability principles.</p>
          <p className="mt-2 ml-8">This Policy applies to all AI-powered features, services, and systems in our Services. It governs the development, deployment, and use of AI technologies to protect users' rights and maintain transparency in all AI operations. This Policy applies to all stakeholders, including employees, third-party vendors, and partners who contribute to or interact with our AI Products.</p>

          <h3 className="text-xl font-semibold ml-8 mt-4">Enforcement</h3>
          <p className="mt-2 ml-8">Any misuse of our AI Products or failure to adhere to the standards outlined in this Policy will result in appropriate actions to ensure the integrity of our platform and the protection of our users. The specific consequences for misuse of AI may vary depending on the nature and severity of the violation and the user's history with our Services. </p>
          <p className="mt-4 ml-8">Violations may include, but are not limited to:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>Engaging the AI Products in ways that violate user privacy, manipulate data, disregard ethical guidelines, or are against AI Service Providers’ terms of use.</li>
            <li>Deploying AI in a manner that introduces or causes bias, leading to unfair treatment of users or groups.</li>
            <li>Improper handling, storage, or use of data by AI Products, leading to breaches of user trust and legal compliance.</li>
            <li>Using AI in a way that compromises the privacy and security of our systems, data, or users.</li>
          </ul>
          <p className="mt-4 ml-8">Depending on the violation, Wordrama.io may take one or more of the following actions:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>Warnings: The responsible party may receive a formal warning and be required to cease violating practices.</li>
            <li>Temporary Suspension: In cases of repeated or more severe violations, the responsible individual's access to AI Products or certain features of our platform may be temporarily suspended while the issue is investigated.</li>
            <li>Termination of Access: Serious violations, particularly those that result in harm to users or breach privacy or other regulations, may lead to the permanent termination of access to our AI Products and Services.</li>
            <li>Legal Action: In cases where the misuse of AI leads to significant harm, data breaches, or legal violations, we may pursue legal action against the party responsible. This could include reporting the incident to law enforcement or regulatory bodies.</li>
            <li>Public Disclosure: For incidents that impact public trust or involve severe ethical breaches, we reserve the right to publicly disclose the violation and the actions taken in response to maintain transparency and accountability.</li>
          </ul>

          <h3 className="text-xl font-semibold ml-8 mt-4">Commitment to Responsible AI</h3>
          <p className="mt-2 ml-8">In addition to the consequences outlined above, we are deeply committed to repairing any harm caused by the misuse of AI. This commitment is a testament to our dedication to our users and our responsibility as a company. We will correct biased outcomes and implement additional safeguards to prevent future violations.</p>
          <p className="mt-4 ml-8">At Wordrama.io, we are committed to the ongoing refinement and enhancement of our Policy. As technology evolves and regulatory environments shift, we recognise the importance of keeping our policies up to date to ensure that they remain relevant, effective, and aligned with best practices in AI ethics. We will regularly review and update our Policy to reflect technological advancements and legal changes in local, national, and international regulations related to AI. Our Policy will be updated as needed to comply with new laws and guidelines, ensuring that our practices remain legally sound and socially responsible.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Contributions</h2>
          <p className="mt-2 ml-8">In this Policy, the term 'Contribution' means:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>any data, information, software, text, code, music, scripts, sound, graphics, photos, videos, tags, messages, interactive features, or other materials that you post, share, upload, submit, or otherwise provide in any manner on or through to the Services; or</li>
            <li>any other content, materials, or data you provide to Wordrama.io or use with the Services.</li>
          </ul>
          <p className="mt-4 ml-8">Some areas of the Services may allow users to upload, transmit, or post Contributions. We may but are under no obligation to review or moderate the Contributions made on the Services, and we expressly exclude our liability for any loss or damage resulting from any of our users' breach of this Policy. Please report any Contribution that you believe breaches this Policy; however, we will determine, in our sole discretion, whether a Contribution is indeed in breach of this Policy.</p>
          <p className="mt-4 ml-8">You warrant that:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>you are the creator and owner of or have the necessary licences, rights, consents, releases, and permissions to use and to authorise us, the Services, and other users of the Services to use your Contributions in any manner contemplated by the Services and this Policy;</li>
            <li>all your Contributions comply with applicable laws and are original and true (if they represent your opinion or facts);</li>
            <li>the creation, distribution, transmission, public display, or performance, and the accessing, downloading, or copying of your Contributions do not and will not infringe the proprietary rights, including but not limited to the copyright, patent, trademark, trade secret, or moral rights of any third party; and</li>
            <li>you have the verifiable consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Services and this Policy.</li>
          </ul>
          <p className="mt-4 ml-8">You also agree that you will not post, transmit, or upload any (or any part of a) Contribution that:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>is in breach of applicable laws, regulation, court order, contractual obligation, this Policy, our Legal Terms, a legal duty, or that promotes or facilitates fraud or illegal activities;</li>
            <li>is defamatory, obscene, offensive, hateful, insulting, intimidating, bullying, abusive, or threatening, to any person or group;</li>
            <li>is false, inaccurate, or misleading;</li>
            <li>includes child sexual abuse material, or violates any applicable law concerning child pornography or otherwise intended to protect minors;</li>
            <li>contains any material that solicits personal information from anyone under the age of 18 or exploits people under the age of 18 in a sexual or violent manner;</li>
            <li>promotes violence, advocates the violent overthrow of any government, or incites, encourages, or threatens physical harm against another;</li>
            <li>is obscene, lewd, lascivious, filthy, violent, harassing, libellous, slanderous, contains sexually explicit material, or is otherwise objectionable (as determined by us);</li>
            <li>is discriminatory based on race, sex, religion, nationality, disability, sexual orientation, or age;</li>
            <li>bullies, intimidates, humiliates, or insults any person;</li>
            <li>promotes, facilitates, or assists anyone in promoting and facilitating acts of terrorism;</li>
            <li>infringes, or assists anyone in infringing, a third party's intellectual property rights or publicity or privacy rights;</li>
            <li>is deceitful, misrepresents your identity or affiliation with any person and/or misleads anyone as to your relationship with us or implies that the Contribution was made by someone else than you;</li>
            <li>contains unsolicited or unauthorised advertising, promotional materials, pyramid schemes, chain letters, spam, mass mailings, or other forms of solicitation that has been 'paid for', whether with monetary compensation or in kind; or</li>
            <li>misrepresents your identity or who the Contribution is from.</li>
          </ul>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Reporting a breach of this policy</h2>
          <p className="mt-2 ml-8">We may but are under no obligation to review or moderate the Contributions made on the Services and we expressly exclude our liability for any loss or damage resulting from any of our users' breach of this Policy.</p>
          <p className="mt-4 ml-8">If you consider that any Service, Content, or Contribution:</p>
          <ul className="list-disc ml-16 list-inside mt-2">
            <li>breach this Policy, please email us at <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a>, or refer to the contact details at the bottom of this document to let us know which Service, Content, or Contribution is in breach of this Policy and why</li>
            <li>infringe any third-party intellectual property rights, please email us at <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a></li>
            <li>users can also send detailed feedback on their interactions with our AI Products by emailing <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a>, or referring to the contact details at the bottom of this document. You should include specific details about the AI interaction, such as the context, the nature of the concern, and any relevant screenshots or documentation</li>
          </ul>
          <p className="mt-4 ml-8">We will reasonably determine whether a Service, Content, or Contribution breaches this Policy.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Consequences of breaching this policy</h2>
          <p className="mt-2 ml-8">The consequences for violating our Policy will vary depending on the severity of the breach and the user's history on the Services, by way of example:</p>
          <p className="mt-4 ml-8">We may, in some cases, give you a warning and/or remove the infringing Contribution, however, if your breach is serious or if you continue to breach our Legal Terms and this Policy, we have the right to suspend or terminate your access to and use of our Services and, if applicable, disable your account. We may also notify law enforcement or issue legal proceedings against you when we believe that there is a genuine risk to an individual or a threat to public safety.</p>
          <p className="mt-4 ml-8">We exclude our liability for all action we may take in response to any of your breaches of this Policy.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Complaints and removal of legitimate content</h2>
          <p className="mt-2 ml-8">If you consider that some Content or Contribution have been mistakenly removed or blocked from the Services, please refer to the contact details at the bottom of this document and we will promptly review our decision to remove such Content or Contribution. The Content or Contribution may stay 'down' whilst we conduct the review process.</p>
          <p className="mt-4 ml-8">We periodically review content on the platform and remove content that doesn't follow the rules. Depending on the severity we will consider issuing a platform wide ban.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Disclaimer</h2>
          <p className="mt-2 ml-8">Wordrama.io is under no obligation to monitor users’ activities, and we disclaim any responsibility for any user’s misuse of the Services. Wordrama.io has no responsibility for any user or other Content or Contribution created, maintained, stored, transmitted, or accessible on or through the Services, and is not obligated to monitor or exercise any editorial control over such material. If Wordrama.io becomes aware that any such Content or Contribution violates this Policy, Wordrama.io may, in addition to removing such Content or Contribution and blocking your account, report such breach to the police or appropriate regulatory authority. Unless otherwise stated in this Policy, Wordrama.io disclaims any obligation to any person who has not entered into an agreement with Wordrama.io for the use of the Services.</p>
        </section>

        <section id="contact" className="my-8">
          <h2 className="text-2xl font-semibold">How can you contact us about this policy?</h2>
          <p className="mt-4 ml-8">If you have any further questions or comments or wish to report any problematic Content or Contribution, you may contact us by: <br/>Email: <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a></p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
