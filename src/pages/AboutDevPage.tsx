import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Instagram, Send, Facebook } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './AboutDevPage.css';

const AboutDevPage = () => {
    const navigate = useNavigate();
    const { translate } = useApp();
    const [toastOut, setToastOut] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleToasterClick = () => {
        if (toastOut) {
            setExpanded(false);
            setToastOut(false);
        } else {
            setToastOut(true);
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 text-white relative flex overflow-y-auto overflow-x-hidden font-sans">


            {/* ---- MAIN CONTENT (centered) ---- */}
            <div className="relative z-10 w-full flex flex-col items-center justify-end" style={{ minHeight: '100vh', paddingBottom: '10px' }}>

                {/* ---- TOASTER SECTION ---- */}
                <div className="relative" style={{ minHeight: '140px' }}>

                    {/* Toast / Bread — absolute above the toaster */}
                    <div
                        className="absolute left-1/2 transition-all duration-700 ease-out"
                        style={{
                            bottom: 'calc(100% - 22px)', // Overlap with toaster to look like it's inside
                            transform: 'translateX(-50%)',
                            width: expanded ? 'min(90vw, 400px)' : '280px', // Wider when expanded
                            maxHeight: toastOut ? (expanded ? '600px' : '160px') : '0px', // Taller when expanded
                            opacity: toastOut ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.6s ease-out, opacity 0.4s ease, width 0.5s ease',
                            pointerEvents: toastOut ? 'auto' : 'none',
                        }}
                    >
                        <div
                            className="px-5 py-5 border-[6px] shadow-2xl relative flex flex-col gap-4"
                            style={{
                                backgroundColor: '#fdf3e6', // Creamy base
                                backgroundImage: `
                                    radial-gradient(rgba(211, 140, 70, 0.15) 1.5px, transparent 1.5px), 
                                    radial-gradient(rgba(211, 140, 70, 0.1) 1.5px, transparent 1.5px),
                                    linear-gradient(to top, rgba(160, 90, 30, 0.3) 0%, transparent 20%)
                                `, // Pores + Burned bottom
                                backgroundSize: '16px 16px, 16px 16px, 100% 100%',
                                backgroundPosition: '0 0, 8px 8px, 0 0',
                                borderColor: '#d38c46',
                                borderRadius: '3rem 3rem 0.6rem 0.6rem',
                                boxShadow: 'inset 0 0 30px rgba(184, 115, 51, 0.5), inset 0 -10px 20px rgba(139, 69, 19, 0.2), 0 5px 15px rgba(0,0,0,0.1)',
                                borderBottom: 'none',
                            }}
                        >
                            <div className="flex items-start gap-4">
                                {/* Profile Image - Left Side */}
                                <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-amber-900/30 shadow-inner bg-amber-100">
                                    <img src="/FBprofile.png" alt="Developer" className="w-full h-full object-cover" />
                                </div>

                                {/* Content - Right Side */}
                                <div className="flex-1 pt-1">
                                    <h3 className="font-bold text-amber-900 text-sm mb-1 leading-tight">
                                        {translate('about_dev_title')}
                                    </h3>

                                    {!expanded && (
                                        <p className="text-[11px] text-amber-800/80 leading-snug">
                                            🧑‍💻 Full Stack Developer & UI/UX Enthusiast.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {expanded && (
                                <div className="animate-fadeIn">
                                    <p className="text-xs text-amber-900 leading-relaxed whitespace-pre-line mb-4 border-t border-amber-900/10 pt-3">
                                        {translate('about_dev_bio_full')}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex items-center justify-center gap-4 mb-2">
                                        <a href="https://www.facebook.com/islem.azaizia.7/" target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600/10 rounded-full text-blue-700 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110" title="Facebook">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                        <a href="https://t.me/ISLAMAZAIZIA" target="_blank" rel="noopener noreferrer" className="p-2 bg-sky-500/10 rounded-full text-sky-600 hover:bg-sky-500 hover:text-white transition-all transform hover:scale-110" title="Telegram">
                                            <Send className="w-5 h-5" />
                                        </a>
                                        <a href="https://www.instagram.com/islem_azaizia/" target="_blank" rel="noopener noreferrer" className="p-2 bg-pink-600/10 rounded-full text-pink-600 hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110" title="Instagram">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className="flex items-center justify-center gap-1 mx-auto w-full mt-auto px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all hover:bg-amber-900/5 active:bg-amber-900/10"
                                style={{
                                    color: '#8c5e2f',
                                }}
                            >
                                {expanded ? (
                                    <span className="flex items-center gap-1 text-amber-900/70">{translate('about_dev_show_less')} <ChevronUp className="w-3 h-3" /></span>
                                ) : (
                                    <span className="flex items-center gap-1">{translate('about_dev_show_more')} <ChevronDown className="w-3 h-3" /></span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Toaster SVG — FIXED in place */}
                    <div
                        className={`tooltip-container-toaster cursor-pointer relative z-20 ${toastOut ? 'active' : ''}`}
                        style={{ fontSize: '1.2em' }}
                        onClick={handleToasterClick}
                    >
                        <span className="toasterGroup">
                            <svg className="toaster" width="180" height="100" viewBox="0 0 88 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="toasterBodyMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#d9d9d9" />
                                        <stop offset="40%" stopColor="#ffffff" />
                                        <stop offset="49%" stopColor="#b3b3b3" />
                                        <stop offset="50%" stopColor="#737373" />
                                        <stop offset="51%" stopColor="#ffffff" />
                                        <stop offset="60%" stopColor="#d9d9d9" />
                                        <stop offset="100%" stopColor="#8c8c8c" />
                                    </linearGradient>
                                    <linearGradient id="toasterBodyHot" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ffcdcd" />
                                        <stop offset="40%" stopColor="#ffe6e6" />
                                        <stop offset="49%" stopColor="#e8b0b0" />
                                        <stop offset="50%" stopColor="#c48a8a" />
                                        <stop offset="51%" stopColor="#ffe6e6" />
                                        <stop offset="60%" stopColor="#ffcdcd" />
                                        <stop offset="100%" stopColor="#d19d9d" />
                                    </linearGradient>
                                    <linearGradient id="toasterBottomMetal" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#555" />
                                        <stop offset="100%" stopColor="#333" />
                                    </linearGradient>
                                </defs>
                                <rect width="88" height="50"></rect>
                                <path
                                    className="block"
                                    d="M13.9561 1.74707H67.7607C73.9513 1.74707 78.9695 6.76558 78.9697 12.9561V48.0791H2.74707V12.9561C2.74733 6.76574 7.76574 1.74732 13.9561 1.74707Z"
                                    fill={toastOut ? "url(#toasterBodyHot)" : "url(#toasterBodyMetal)"}
                                    stroke="none"
                                ></path>
                                <rect x="2.5" y="43.3478" width="76.7174" height="4.97826" fill="url(#toasterBottomMetal)" stroke="none"></rect>
                                <path className="lever" d="M84.2008 13.3305C84.8197 13.3305 85.3217 13.8318 85.3219 14.4507V17.4399C85.3219 18.059 84.8199 18.561 84.2008 18.561H80.0914V13.3305H84.2008Z" fill="#A6A4A4" stroke="#C0BABA" strokeWidth="0.747283"></path>
                                <path d="M8.22558 18.9348C8.22558 18.9348 6.95407 11.7886 10.1771 8.8166C12.9835 6.22883 19.9348 7.13024 19.9348 7.13024" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"></path>
                                <circle className="timer" cx="67.7609" cy="24.913" r="2.98913" fill="#444"></circle>
                                <circle cx="67.7609" cy="24.913" r="3.36277" stroke="white" strokeOpacity="0.5" strokeWidth="0.75" strokeLinecap="square"></circle>
                                <circle cx="67.7609" cy="33.8804" r="2.98913" fill="#444"></circle>
                                <circle cx="67.7609" cy="33.8804" r="3.36277" stroke="white" strokeOpacity="0.5" strokeWidth="0.75" strokeLinecap="square"></circle>
                            </svg>
                        </span>
                        <p className="text-center text-gray-500 text-xs mt-2">
                            {toastOut ? translate('about_dev_click_hide') : translate('about_dev_click_toaster')}
                        </p>
                    </div>
                </div>

                <div className="text-gray-500 text-sm mt-8 pb-4">
                    © 2026 iPlan. Created with ❤️ by Islam Azaizia.
                </div>
            </div>
        </div>
    );
};

export default AboutDevPage;
