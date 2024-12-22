import React from "react";

export const metadata = {
  title: "Privacy Policy | Dime",
  description:
    "Privacy policy and data handling practices for Dime budgeting application",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">
          Data Collection and Storage
        </h2>
        <p className="mb-4">
          Dime is committed to protecting your privacy. Our application: -
          Stores only manually entered financial data - Does not sync or collect
          bank account information - Requires basic account information (email)
          for authentication
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">AI Assistant Features</h2>
        <p className="mb-4">
          Our AI assistant: - Processes user-provided financial data to generate
          insights - Does not store conversation history permanently - Uses
          OpenAI's API with standard privacy protections
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Data Usage</h2>
        <p className="mb-4">
          Your data is used to: - Provide budgeting and financial tracking
          features - Generate AI-powered financial insights - Improve
          application functionality
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">User Rights</h2>
        <p className="mb-4">
          You have the right to: - Access your stored data - Request data
          deletion - Export your financial data - Close your account at any time
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
        <p className="mb-4">
          For privacy-related inquiries, contact us at: [Your Contact Email]
        </p>
      </section>

      <footer className="mt-12 text-sm text-gray-600">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
}
