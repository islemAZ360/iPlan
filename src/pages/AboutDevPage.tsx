import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

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

            {/* Back Button */}
            <button
                onClick={() => navigate('/settings')}
                className="fixed top-6 left-6 z-50 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all duration-300 group"
            >
                <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
            </button>

            {/* ---- SOCIAL LINKS — LEFT COLUMN ---- */}
            <div className="fixed left-32 top-1/2 flex flex-col gap-40 z-40" style={{ transform: 'translateY(-50%) scale(0.8)' }}>
                {/* Telegram (top) */}
                <div className="social-tooltip-container telegram">
                    <div className="tooltip">
                        <div className="profile">
                            <div className="user">
                                <div className="img" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src="/TELprofile.png" alt="Islam" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                                <div className="details">
                                    <div className="name">Islam Azaizia</div>
                                    <div className="username">@islamazaizia</div>
                                </div>
                            </div>
                            <div className="about">Contact Me</div>
                        </div>
                    </div>
                    <div className="text">
                        <span className="icon" role="button" onDoubleClick={() => window.open('https://t.me/ISLAMAZAIZIA', '_blank')}>
                            <div className="layer">
                                <span></span><span></span><span></span><span></span>
                                <span className="telegramSVG">
                                    <svg viewBox="0 0 448 512" height="1.5em" fill="#2da5e0">
                                        <path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="text text-label">Telegram</div>
                        </span>
                    </div>
                </div>

                {/* Instagram (middle) */}
                <div className="social-tooltip-container insta">
                    <div className="tooltip">
                        <div className="profile">
                            <div className="user">
                                <div className="img" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src="/INprofile.png" alt="Islam" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                                <div className="details">
                                    <div className="name">Islam Azaizia</div>
                                    <div className="username">@islam_azaizia</div>
                                </div>
                            </div>
                            <div className="about">800+ Followers</div>
                        </div>
                    </div>
                    <div className="text">
                        <span className="icon" role="button" onDoubleClick={() => window.open('https://www.instagram.com/islam_azaizia', '_blank')}>
                            <div className="layer">
                                <span></span><span></span><span></span><span></span>
                                <span className="instagramSVG">
                                    <svg fill="white" className="svgIcon" viewBox="0 0 448 512" height="1.5em" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="text text-label">Instagram</div>
                        </span>
                    </div>
                </div>

                {/* Facebook (bottom) */}
                <div className="social-tooltip-container fb">
                    <div className="tooltip">
                        <div className="profile">
                            <div className="user">
                                <div className="img" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src="/FBprofile.png" alt="Islam" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                                </div>
                                <div className="details">
                                    <div className="name">Islam Azaizia</div>
                                    <div className="username">@islam_azaizia</div>
                                </div>
                            </div>
                            <div className="about">500+ Friends</div>
                        </div>
                    </div>
                    <div className="text">
                        <span className="icon" role="button" onDoubleClick={() => window.open('https://www.facebook.com/islem.azaizia.7/', '_blank')}>
                            <div className="layer">
                                <span></span><span></span><span></span><span></span>
                                <span className="facebookSVG">
                                    <svg viewBox="0 0 40 40" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                                        <path d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z" fill="#1877f2"></path>
                                        <path d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z" fill="#fff"></path>
                                    </svg>
                                </span>
                            </div>
                            <div className="text text-label">Facebook</div>
                        </span>
                    </div>
                </div>
            </div>

            {/* ---- MAIN CONTENT (centered) ---- */}
            <div className="relative z-10 w-full flex flex-col items-center justify-end" style={{ minHeight: '100vh', paddingBottom: '40px' }}>

                {/* ---- TOASTER SECTION ---- */}
                <div className="relative" style={{ minHeight: '140px' }}>

                    {/* Toast / Bread — absolute above the toaster */}
                    <div
                        className="absolute left-1/2 transition-all duration-700 ease-out"
                        style={{
                            bottom: 'calc(100% - 22px)', // Overlap with toaster to look like it's inside
                            transform: 'translateX(-50%)',
                            width: expanded ? '350px' : '120px',
                            maxHeight: toastOut ? (expanded ? '500px' : '130px') : '0px',
                            opacity: toastOut ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'max-height 0.6s ease-out, opacity 0.4s ease, width 0.5s ease',
                            pointerEvents: toastOut ? 'auto' : 'none',
                        }}
                    >
                        <div
                            className="px-6 py-4 border-[6px] shadow-2xl relative"
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
                            <h3 className="text-center font-bold text-amber-900 text-xs mb-0.5">
                                {translate('about_dev_title')}
                            </h3>

                            {!expanded && (
                                <p className="text-[10px] text-amber-800/70 text-center">
                                    🧑‍💻
                                </p>
                            )}

                            {expanded && (
                                <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-line mt-1 text-left">
                                    {translate('about_dev_bio_full')}
                                </p>
                            )}

                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className="flex items-center gap-1 mx-auto mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all hover:scale-105"
                                style={{
                                    background: 'rgba(100,86,32,0.1)',
                                    border: '1px solid #d38c46',
                                    color: '#8c5e2f',
                                }}
                            >
                                {expanded ? (
                                    <>{translate('about_dev_show_less')} <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                    <>{translate('about_dev_show_more')} <ChevronDown className="w-3 h-3" /></>
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

                <div className="text-gray-500 text-sm mt-16 pb-8">
                    © 2026 iPlan. Created with ❤️ by Islam Azaizia.
                </div>
            </div>
        </div>
    );
};

export default AboutDevPage;
