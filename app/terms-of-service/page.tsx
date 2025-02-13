export const metadata = {
  title: "Terms of Service | Dime",
  description:
    "Terms of service and usage guidelines for Dime budgeting application",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Terms of Service</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">1. Service Description</h2>
        <p className="mb-4">
          Dime is a budgeting application that provides manual budget tracking
          and AI-powered financial insights. The service is provided &quot;as
          is&quot; without any guarantees of continuous availability.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">2. User Responsibilities</h2>
        <p className="mb-4">
          Users are responsible for: - Maintaining account security - Providing
          accurate information - Using the service legally and appropriately -
          Keeping backup copies of their financial data
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">3. Account Rules</h2>
        <p className="mb-4">
          - One account per user - Users must be 18 or older - Accounts cannot
          be shared - Users are responsible for all activity under their account
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">4. AI Assistant Usage</h2>
        <p className="mb-4">
          - AI insights are provided for informational purposes only - No
          guarantee of accuracy for AI-generated advice - Users should verify AI
          suggestions before acting on them
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          5. Limitations of Liability
        </h2>
        <p className="mb-4">
          Dime is not responsible for: - Financial losses from using the service
          - Accuracy of manually entered data - Service interruptions - Data
          loss
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">6. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify these terms at any time. Users will be
          notified of significant changes.
        </p>
      </section>

      <footer className="mt-12 text-sm text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
