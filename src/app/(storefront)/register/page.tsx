import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Create Account</p>
        <h1 className="text-5xl font-semibold text-white">Join the storefront</h1>
        <p className="text-stone-300">Register as a customer to shop, save addresses, and view your order history.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
