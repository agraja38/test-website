export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="space-y-6">
        <p className="text-sm uppercase tracking-[0.25em] text-[#f1d3a0]">Contact</p>
        <h1 className="text-5xl font-semibold text-white">Let customers reach you with confidence</h1>
        <p className="text-stone-300">This page is ready for your real contact details or a transactional email integration.</p>
      </div>
      <form className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-8">
        <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Name" />
        <input className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Email" type="email" />
        <textarea className="min-h-40 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Message" />
        <button className="rounded-full bg-[#c6a56f] px-5 py-3 font-medium text-black" type="submit">Send Message</button>
      </form>
    </div>
  );
}
