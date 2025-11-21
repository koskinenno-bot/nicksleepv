
import React from 'react';

interface Props {
  title: string;
  url: string;
}

const PresentationCard: React.FC<Props> = ({ title, url }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-nomad-200 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
        Investor Resources
      </h3>
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer"
        className="group block bg-nomad-800 border border-nomad-700 rounded-xl p-6 hover:border-yellow-600/50 transition-all hover:shadow-lg hover:shadow-yellow-900/10 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-nomad-900 p-4 rounded-lg border border-nomad-700 group-hover:border-yellow-600/30 group-hover:text-yellow-500 transition-colors text-nomad-400 shadow-inner">
              {/* Icon for Slideshow/Presentation */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl text-nomad-100 font-serif mb-1 group-hover:text-white transition-colors">Latest Investor Presentation</h3>
              <p className="text-sm text-nomad-400 group-hover:text-nomad-300 font-light">{title}</p>
            </div>
          </div>
          <div className="text-nomad-500 group-hover:text-yellow-500 transition-colors hidden sm:block">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide border border-transparent group-hover:border-yellow-600/30 px-4 py-2 rounded-full bg-transparent group-hover:bg-yellow-900/10">
              <span>View PDF</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default PresentationCard;