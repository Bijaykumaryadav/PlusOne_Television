import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="text-xl font-bold">SidhaReporting</div>
          <div className="text-sm text-slate-500">Trusted news from Nepal and around the world.</div>
        </div>
        <div className="flex gap-6">
          <div className="text-sm text-slate-600">Terms</div>
          <div className="text-sm text-slate-600">Privacy</div>
          <div className="text-sm text-slate-600">Contact</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
