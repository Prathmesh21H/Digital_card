// app/page.tsx
import Link from 'next/link';
import { CreditCard, QrCode, Edit, Share2, Sparkles, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Bharat Valley Connects
            </div>
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-gray-700 hover:text-orange-600 font-semibold transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full hover:from-orange-600 hover:to-orange-700 font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 via-transparent to-green-100/20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 rounded-full mb-6 border border-orange-200">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
              Connect Bharat, Digitally
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Digital Identity,
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 bg-clip-text text-transparent">
              Forever Connected
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Create a stunning digital visiting card with QR technology. Update instantly,
            share effortlessly, and never lose a connection again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/signup"
              className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-lg rounded-full hover:from-orange-600 hover:to-green-600 font-bold transition-all shadow-2xl hover:shadow-orange-300 transform hover:scale-105 flex items-center gap-2"
            >
              Create Your Card Now
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="px-10 py-5 bg-white text-orange-600 text-lg rounded-full font-bold border-2 border-orange-500 hover:bg-orange-50 transition-all shadow-lg"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple. Powerful. <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">Beautiful.</span>
          </h2>
          <p className="text-xl text-gray-600">Four steps to transform your networking game</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Create Profile
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Design your digital identity with contact details, social links, and personal bio
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-lg">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Get QR Code
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Receive your unique, permanent QR code that links to your live digital card
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-200">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-lg">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Share Everywhere
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Print on cards, add to signatures, share on social media - unlimited possibilities
            </p>
          </div>

          <div className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-green-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-lg">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Update Anytime
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Change details instantly - your QR code remains forever the same
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-green-50 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Go <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">Digital</span>?
            </h2>
            <p className="text-xl text-gray-600">Join the future of professional networking</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-6">🌱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Eco-Friendly</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Save trees, save money. No more printing and reprinting paper cards
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-6">🔄</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Always Current</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                New job? New number? Update once, and it reflects everywhere instantly
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-6">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">One-Tap Magic</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Contacts save you instantly to their phone - no typing, no mistakes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-orange-500 to-green-600 rounded-3xl p-12 md:p-16 shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Network?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals across Bharat using smart digital cards
          </p>
          <Link
            href="/signup"
            className="inline-block px-12 py-5 bg-white text-orange-600 text-lg rounded-full hover:bg-gray-50 font-bold transition-all shadow-2xl transform hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="text-xl font-bold">Bharat Valley Connects</div>
            </div>
            <p className="text-gray-400">
              © 2024 Bharat Valley Connects. Connecting Bharat, One Card at a Time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}