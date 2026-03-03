import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // Check if user is already logged in to customize the "Enter Portal" button
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center bg-white">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                Official SIMS Portal • Rubavu Branch
              </span>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
                SmartPark <br />
                <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-8">SIMS 2026</span>
              </h1>
              <p className="mt-8 text-lg text-slate-500 max-w-lg leading-relaxed mx-auto lg:mx-0 font-medium">
                Precision inventory management for modern automotive hubs. Streamline your stock, automate your sales, and secure your warehouse data with Guillaume's custom architecture.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* Logic: Redirect to Dashboard if already logged in, otherwise to Login */}
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/login"} 
                  className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 text-center"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Enter Portal"}
                </Link>
                
                {!isAuthenticated && (
                  <Link to="/register" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-xl text-center">
                    Staff Registration
                  </Link>
                )}
              </div>
            </div>

            {/* Decorative System Status Card */}
            <div className="hidden lg:block">
               <div className="w-full h-[450px] bg-slate-900 rounded-[3.5rem] shadow-2xl rotate-2 flex items-center justify-center relative overflow-hidden group hover:rotate-0 transition-transform duration-700">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  <div className="text-center relative z-10">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                       <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                    </div>
                    <p className="text-blue-500 font-mono text-xs tracking-[0.5em] uppercase mb-2">System Status</p>
                    <div className="text-6xl font-black text-white tracking-tighter">ONLINE</div>
                    <p className="text-slate-500 text-[10px] font-bold mt-4 uppercase tracking-[0.2em]">Secure Encryption Active</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT US SECTION */}
      <section id="about" className="py-32 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">System Features</h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Inventory Logic</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Sophisticated tracking system for every nut, bolt, and engine part in the Rubavu warehouse.</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">🔐</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Secure Access</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Multi-layer authentication ensuring that only authorized staff manage your branch assets.</p>
            </div>
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">📈</div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Real-time Reports</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Instant analytics for stock-in and stock-out trends to keep the business profitable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT SECTION */}
      <section id="contact" className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Get In Touch</h2>
          <p className="text-slate-400 mt-4 mb-16 uppercase text-[10px] font-black tracking-[0.3em]">SmartPark Rubavu Branch Assistance</p>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="group p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-blue-600 transition-all duration-500">
              <p className="text-[10px] font-black text-blue-600 group-hover:text-blue-200 uppercase mb-4 tracking-widest">Email Support</p>
              <p className="text-xl font-bold text-slate-800 group-hover:text-white transition-colors">support@smartpark.rw</p>
            </div>
            <div className="group p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:bg-slate-900 transition-all duration-500">
              <p className="text-[10px] font-black text-blue-600 group-hover:text-blue-400 uppercase mb-4 tracking-widest">Phone Branch</p>
              <p className="text-xl font-bold text-slate-800 group-hover:text-white transition-colors">+250 788 000 000</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BRANDED FOOTER */}
      <footer className="bg-slate-950 py-20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-2xl mx-auto mb-8 shadow-2xl shadow-blue-500/20">S</div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">
            &copy; {new Date().getFullYear()} SmartPark SIMS Rubavu Branch
          </p>
          <div className="max-w-xs mx-auto pt-8 border-t border-slate-900">
            <p className="text-slate-600 text-[11px] font-bold uppercase tracking-widest leading-loose">
              Enterprise Solution <br />
              Developed by <span className="text-blue-500">Guillaume</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;