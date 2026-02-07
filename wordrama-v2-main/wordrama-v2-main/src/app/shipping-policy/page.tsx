"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function ShippingPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Shipping & Delivery Policy</h1>
        <p className="text-sm text-gray-500">Last updated October 26, 2024</p>

        <section className="my-8">
          <p className="mt-2">This Shipping & Delivery Policy is part of our Terms of Use ("Terms") and should be therefore read alongside our main Terms: <a href="https://wordrama.io/terms-of-use" className='text-blue-500 hover:underline'>https://wordrama.io/terms-of-use.</a></p>
          <p className="mt-4">Please carefully review our Shipping & Delivery Policy when purchasing our products. This policy will apply to any order you place with us.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">What are my shipping & delivery options?</h2>
          <p className="mt-2">We offer free Digital Delivery shipping on all orders.</p>
          <p className="mt-2">Shipping of digital items is usually instantaneous but on some occasions can take up to a couple of hours.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">How is my subscription fulfilled?</h2>
          <p className="mt-2">If you are buying a subscription then we will deliver on: Subscriptions are digitally delivered on a monthly basis</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Do you deliver internationally?</h2>
          <p className="mt-2">We offer worldwide shipping. Free Digital Delivery shipping is valid on international orders.</p>
          <p className="mt-4">Please note, we may be subject to various rules and restrictions in relation to some international deliveries and you may be subject to additional taxes and duties over which we have no control. If such cases apply, you are responsible for complying with the laws applicable to the country where you live and will be responsible for any such additional costs or taxes.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">What happens if my order is delayed?</h2>
          <p className="mt-2">If delivery is delayed for any reason we will let you know as soon as possible and will advise you of a revised estimated date for delivery.</p>
          <p className="mt-4">For EU and UK consumers: This does not affect your statutory rights. For more information please refer to our Terms.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Questions about returns?</h2>
          <p className="mt-2">If you have questions about returns, please review our Return Policy: <a href="https://wordrama.io/returns-policy" className='text-blue-500 hover:underline'>https://wordrama.io/returns-policy</a>.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Have questions about this policy?</h2>
          <p className="mt-2">If you have any further questions or comments, you may contact us by:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Email: <a href="mailto:support@wordrama.io" className='text-blue-500 hover:underline'>support@wordrama.io</a></li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}
