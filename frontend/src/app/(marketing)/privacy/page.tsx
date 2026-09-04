export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 max-w-4xl">
      <div className="space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: September 4, 2026</p>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground/80">
          <p>
            At Inkviz, we take your privacy seriously. This policy describes what personal information we collect and how we use it.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">1. Information we collect</h2>
          <p>We collect information you provide directly to us when you create an account, such as your name, email address, and business details.</p>
          <p>We also store the data you input to generate invoices, including your clients' contact information and financial details.</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">2. How we use your information</h2>
          <p>We use the information we collect primarily to provide, maintain, and improve our services. Specifically, we use it to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate and host your invoices.</li>
            <li>Send you technical notices and support messages.</li>
            <li>Respond to your comments and questions.</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">3. Data Sharing</h2>
          <p>We do not sell your personal information. We do not share your information with third parties except as necessary to provide our services (e.g., cloud hosting providers).</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">4. Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
        </div>
      </div>
    </div>
  )
}
