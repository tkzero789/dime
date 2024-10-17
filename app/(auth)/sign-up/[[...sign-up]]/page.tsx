import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="flex h-dvh w-full flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-emerald-400">
      <div className="mt-4">
        <SignUp
          forceRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
        />
      </div>
    </section>
  );
}
