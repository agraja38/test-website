import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08111f]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 text-sm text-slate-400 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-white">LuxeCart</h3>
          <p className="mt-3 max-w-sm">
            A familiar online shopping experience backed by a fully custom ecommerce platform you own.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-white">Customer Care</h4>
          <div className="mt-3 space-y-2">
            <p>support@luxecart.local</p>
            <p>+94 77 123 4567</p>
            <p>Colombo, Sri Lanka</p>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-white">Shop</h4>
          <div className="mt-3 space-y-2">
            <Link href="/shop" className="block hover:text-white">All Products</Link>
            <Link href="/about" className="block hover:text-white">About Us</Link>
            <Link href="/contact" className="block hover:text-white">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-white">Policies</h4>
          <div className="mt-3 space-y-2">
            <p>Secure checkout</p>
            <p>Islandwide delivery</p>
            <p>Order tracking</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
