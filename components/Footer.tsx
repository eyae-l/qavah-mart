import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-primary-700 mb-4">Qavah-mart</h3>
            <p className="text-neutral-600 text-sm">
              Your trusted marketplace for computers and computer accessories in Ethiopia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/laptops" className="text-neutral-600 hover:text-primary-700">
                  Laptops
                </Link>
              </li>
              <li>
                <Link href="/categories/desktop-computers" className="text-neutral-600 hover:text-primary-700">
                  Desktop Computers
                </Link>
              </li>
              <li>
                <Link href="/categories/computer-components" className="text-neutral-600 hover:text-primary-700">
                  Components
                </Link>
              </li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">For Sellers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sell/new" className="text-neutral-600 hover:text-primary-700">
                  Post a Listing
                </Link>
              </li>
              <li>
                <Link href="/user/dashboard" className="text-neutral-600 hover:text-primary-700">
                  Seller Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-neutral-600 hover:text-primary-700">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-600 hover:text-primary-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
          <p>&copy; {new Date().getFullYear()} Qavah-mart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
