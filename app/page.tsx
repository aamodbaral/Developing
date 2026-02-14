import Link from 'next/link';

export default function Home() {
  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      {/* 1. Navigation */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <i className="fa-solid fa-check-double"></i> SecureVote.io
          </h1>
          <div className="space-x-4 flex items-center">
            <Link href="/login?role=admin" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
              Admin Portal
            </Link>
            <Link href="/login?role=voter" className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition shadow-md">
              Voter Login
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <header className="py-20 px-4 text-center bg-white border-b">
        <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">Your Vote, Your Voice.</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Welcome to the digital election portal. Follow the guide below to cast your ballot securely in under 2 minutes.
        </p>
        <div className="flex justify-center gap-4">
             <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
               Start Voting
             </Link>
             <a href="#guide" className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition">
               Learn More
             </a>
        </div>
      </header>

      {/* 3. Guide Section */}
      <section id="guide" className="max-w-6xl mx-auto py-20 px-4">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-blue-300 transition group">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition">1</div>
                <i className="fa-solid fa-user-check text-4xl text-blue-500 mb-4"></i>
                <h4 className="text-xl font-bold mb-2 text-gray-800">Authentication</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Login using your unique Voter ID and Password. The system verifies your identity.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-blue-300 transition group">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition">2</div>
                <i className="fa-solid fa-check-to-slot text-4xl text-blue-500 mb-4"></i>
                <h4 className="text-xl font-bold mb-2 text-gray-800">Select Candidate</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Browse the list of candidates. Click on the radio button next to your preferred choice.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:border-blue-300 transition group">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:bg-blue-600 group-hover:text-white transition">3</div>
                <i className="fa-solid fa-shield-halved text-4xl text-blue-500 mb-4"></i>
                <h4 className="text-xl font-bold mb-2 text-gray-800">Secure Submission</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Once you click 'Submit', your vote is recorded. You cannot vote twice in the same election.</p>
            </div>

        </div>
      </section>

      {/* 4. Footer */}
      <footer className="py-8 text-center text-gray-500 text-xs border-t bg-white">
        &copy; 2026 SecureVote Digital Systems. All Rights Reserved.
      </footer>
    </div>
  );
}