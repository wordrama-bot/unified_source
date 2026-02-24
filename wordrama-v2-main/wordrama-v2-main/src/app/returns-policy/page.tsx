"use client"
import NavBar from '@/components/navbar/h-nav';
import Footer from '@/sections/footer';

export default function ReturnPolicyPage() {
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
        <h1 className="text-4xl font-bold mb-6">Returns Policy</h1>
        <p className="text-sm text-gray-500">Last updated February 24, 2026</p>

        <section className="my-8">
          <p className="mt-2">Thank you for your purchase. We hope you are happy with your purchase. However, if you are not completely satisfied with your purchase for any reason, you may return it to us for a full refund or store credit (in-game credit). Please see below for more information on our return policy.</p>
        </section>

        <section className="my-8">
          <h2 className="text-2xl font-semibold">Returns</h2>
          <p className="mt-2">All returns must be postmarked within ninety (90) days of the purchase date. All returned items must be in new and unused condition, with all original tags and labels attached.</p>
        </section>

        <section id="process" className="my-8">
          <h2 className="text-2xl font-semibold">Return Process</h2>
          <p className="mt-2">
            To return an item, please email customer service at <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">support@wordrama.io</a> to obtain a Return Merchandise Authorisation (RMA) number. After receiving a RMA number, please send an email with the RMA number in the subject to confirm the return
          </p>
        </section>

        <section id="refunds" className="my-8">
          <h2 className="text-2xl font-semibold">Refunds</h2>
          <p className="mt-2">
            After receiving your return and inspecting the condition of your item, we will process your return. Please allow at least seven (7) days from the receipt of your item to process your return. Refunds may take 1-2 billing cycles to appear on your credit card statement, depending on your credit card company. We will notify you by email when your return has been processed.
          </p>
        </section>

        <section id="exceptions" className="my-8">
          <h2 className="text-2xl font-semibold">Exceptions</h2>
          <p className="mt-4">
            The following items cannot be returned:
          </p>
          <ul className="list-disc list-inside">
            <li>Consumable items (e.g. in-game upgrades/power-ups)</li>
            <li>Items that have been used</li>
          </ul>
          <p className="mt-4">
            For defective or damaged products, please contact us at the contact details below to arrange a refund or exchange.
          </p>
          <p className="mt-4"><strong>Please Note</strong></p>
          <ul className="list-disc list-inside">
            <li>A 10% restocking fee will be charged for all returns.</li>
            <li> Sale items are FINAL SALE and cannot be returned.</li>
          </ul>
        </section>

        <section id="questions" className="my-8">
          <h2 className="text-2xl font-semibold">Questions</h2>
          <p className="mt-2">
            If you have any questions concerning our return policy, please contact us at: <a href="mailto:support@wordrama.io" className="text-blue-500 hover:underline">support@wordrama.io</a>.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
