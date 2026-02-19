import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="loader-bg-mesh"></div>
            <div className="loader">
                {/* Global Definitions for Gradients */}
                <svg width="0" height="0" className="absolute">
                    <defs>
                        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#475569" />
                            <stop offset="100%" stopColor="#1e293b" />
                        </linearGradient>
                        <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#e2e8f0" />
                        </linearGradient>
                        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fb923c" />
                            <stop offset="100%" stopColor="#c2410c" />
                        </linearGradient>
                        {/* Scarf Gradient */}
                        <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="50%" stopColor="#dc2626" />
                            <stop offset="100%" stopColor="#b91c1c" />
                        </linearGradient>
                        {/* Headphones Gradient */}
                        <linearGradient id="phoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                </svg>

                {/* Left Leg (Webbed Flipper - Pushing) */}
                <svg
                    className="legl"
                    width="60"
                    height="70"
                    viewBox="0 0 60 70"
                    style={{ overflow: 'visible', zIndex: 0 }}
                >
                    <g transform="translate(10, 10)">
                        <path
                            d="M20,0 Q10,25 0,50 L15,60 L25,52 L35,60 L45,15 Z"
                            fill="url(#orangeGrad)"
                            stroke="#c2410c"
                            strokeWidth="1"
                            style={{ animation: 'waddle 1s infinite ease-in-out', transformOrigin: '20px 0px' }}
                        />
                    </g>
                </svg>

                {/* Right Leg (Webbed Flipper - Pushing) */}
                <svg
                    className="legr"
                    width="60"
                    height="70"
                    viewBox="0 0 60 70"
                    style={{ overflow: 'visible', zIndex: 0 }}
                >
                    <g transform="translate(10, 10)">
                        <path
                            d="M20,0 Q10,25 0,50 L15,60 L25,52 L35,60 L45,15 Z"
                            fill="url(#orangeGrad)"
                            stroke="#c2410c"
                            strokeWidth="1"
                            style={{ animation: 'waddle 1s infinite ease-in-out', animationDelay: '0.5s', transformOrigin: '20px 0px' }}
                        />
                    </g>
                </svg>

                <div className="bod">
                    {/* Body */}
                    <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="144.10576"
                        height="144.91623"
                        viewBox="0,0,144.10576,144.91623"
                    >
                        <g transform="translate(-164.41679,-112.94712)">
                            <g strokeMiterlimit="10">
                                {/* Main Body Shape */}
                                <path
                                    d="M166.9168,184.02633c0,-36.49454 35.0206,-66.07921 72.05288,-66.07921c37.03228,0 67.05288,29.58467 67.05288,66.07921c0,6.94489 -1.08716,13.63956 -3.10292,19.92772c-2.71464,8.46831 -7.1134,16.19939 -12.809,22.81158c-2.31017,2.68194 -7.54471,12.91599 -7.54471,12.91599c0,0 -5.46714,-1.18309 -8.44434,0.6266c-3.86867,2.35159 -10.95356,10.86714 -10.95356,10.86714c0,0 -6.96906,-3.20396 -9.87477,-2.58085c-2.64748,0.56773 -6.72538,5.77072 -6.72538,5.77072c0,0 -5.5023,-4.25969 -7.5982,-4.25969c-3.08622,0 -9.09924,3.48259 -9.09924,3.48259c0,0 -6.0782,-5.11244 -9.00348,-5.91884c-4.26461,-1.17561 -12.23343,0.75049 -12.23343,0.75049c0,0 -5.18164,-8.26065 -7.60688,-9.90388c-3.50443,-2.37445 -8.8271,-3.95414 -8.8271,-3.95414c0,0 -5.33472,-8.81718 -7.27019,-11.40895c-4.81099,-6.44239 -13.46422,-9.83437 -15.65729,-17.76175c-1.53558,-5.55073 -2.35527,-21.36472 -2.35527,-21.36472z"
                                    fill="url(#bodyGrad)"
                                    stroke="#ffffff"
                                    strokeWidth="3"
                                    strokeLinecap="butt"
                                ></path>
                                {/* Belly */}
                                <path
                                    d="M167.94713,180c0,-37.03228 35.0206,-67.05288 72.05288,-67.05288c37.03228,0 67.05288,30.0206 67.05288,67.05288c0,7.04722 -1.08716,13.84053 -3.10292,20.22135c-2.71464,8.59309 -7.1134,16.43809 -12.809,23.14771c-2.31017,2.72146 -7.54471,13.1063 -7.54471,13.1063c0,0 -5.46714,-1.20052 -8.44434,0.63584c-3.86867,2.38624 -10.95356,11.02726 -10.95356,11.02726c0,0 -6.96906,-3.25117 -9.87477,-2.61888c-2.64748,0.5761 -6.72538,5.85575 -6.72538,5.85575c0,0 -5.5023,-4.32246 -7.5982,-4.32246c-3.08622,0 -9.09924,3.5339 -9.09924,3.5339c0,0 -6.0782,-5.18777 -9.00348,-6.00605c-4.26461,-1.19293 -12.23343,0.76155 -12.23343,0.76155c0,0 -5.18164,-8.38236 -7.60688,-10.04981c-3.50443,-2.40943 -8.8271,-4.0124 -8.8271,-4.0124c0,0 -5.33472,-8.9471 -7.27019,-11.57706c-4.81099,-6.53732 -13.46422,-9.97928 -15.65729,-18.02347c-1.53558,-5.63252 -2.35527,-21.67953 -2.35527,-21.67953z"
                                    fill="url(#bellyGrad)"
                                    stroke="none"
                                ></path>
                                {/* Arms holding Large Orb (Heavy Object) */}
                                <g className="orb-holder" style={{ animation: 'struggle 3s infinite ease-in-out' }}>
                                    <defs>
                                        <clipPath id="orbClip">
                                            <circle cx="250" cy="200" r="45" />
                                        </clipPath>
                                        <radialGradient id="orbGlass" cx="30%" cy="30%" r="70%">
                                            <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
                                        </radialGradient>
                                    </defs>

                                    {/* Rotating Orb Container */}
                                    <g style={{ transformOrigin: '250px 200px' }}>
                                        {/* Outer Rim */}
                                        <circle cx="250" cy="200" r="47" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />

                                        {/* Photo - Centered in Orb */}
                                        <image href="/FBprofile.png" x="205" y="155" width="90" height="90" preserveAspectRatio="xMidYMid slice" clipPath="url(#orbClip)" />

                                        {/* Glass Overlay */}
                                        <circle cx="250" cy="200" r="45" fill="url(#orbGlass)" />

                                        {/* Highlight */}
                                        <ellipse cx="235" cy="180" rx="15" ry="8" fill="#fff" opacity="0.4" transform="rotate(-45 235 180)" />
                                    </g>

                                    {/* Left Arm (Pushing) */}
                                    <path
                                        d="M208,185 Q190,210 215,245 L230,235 Q205,200 208,185 Z"
                                        fill="url(#bodyGrad)"
                                        stroke="#ffffff"
                                        strokeWidth="1"
                                    />
                                    {/* Right Arm (Pushing) */}
                                    <path
                                        d="M292,185 Q310,210 285,245 L270,235 Q295,200 292,185 Z"
                                        fill="url(#bodyGrad)"
                                        stroke="#ffffff"
                                        strokeWidth="1"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>

                    {/* Head */}
                    <svg
                        className="head"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="115.68559"
                        height="95"
                        viewBox="0,0,115.68559,95"
                    >
                        <g transform="translate(-191.87889,-70)">
                            <g strokeMiterlimit="10">
                                {/* Headphones Band */}
                                <path
                                    d="M210,110 Q250,65 290,110"
                                    fill="none"
                                    stroke="url(#phoneGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />

                                {/* Face Shape */}
                                <path
                                    d="M195.12889,128.77752c0,-26.96048 21.33334,-48.81626 47.64934,-48.81626c26.316,0 47.64935,21.85578 47.64935,48.81626c0,0.60102 -9.22352,20.49284 -9.22352,20.49284l-7.75885,0.35623l-7.59417,6.15039l-8.64295,-1.74822l-11.70703,6.06119l-6.38599,-4.79382l-6.45999,2.36133l-7.01451,-7.38888l-8.11916,1.29382l-6.19237,-6.07265l-7.6263,-1.37795l-4.19835,-7.87062l-4.24236,-4.16907c0,0 -0.13314,-2.0999 -0.13314,-3.29458z"
                                    fill="url(#bodyGrad)"
                                    stroke="#ffffff"
                                    strokeWidth="4"
                                    strokeLinecap="butt"
                                ></path>
                                {/* Inner Face (White) */}
                                <path
                                    d="M195.31785,124.43649c0,-26.96048 21.33334,-48.81626 47.64934,-48.81626c26.316,0 47.64935,21.85578 47.64935,48.81626c0,1.03481 -0.08666,2.8866 -0.08666,2.8866c0,0 16.8538,15.99287 16.21847,17.23929c-0.66726,1.30905 -23.05667,-4.14265 -23.05667,-4.14265l-2.29866,4.5096l-7.75885,0.35623l-7.59417,6.15039l-8.64295,-1.74822l-11.70703,6.06119l-6.38599,-4.79382l-6.45999,2.36133l-7.01451,-7.38888l-8.11916,1.29382l-6.19237,-6.07265l-7.6263,-1.37795l-4.19835,-7.87062l-4.24236,-4.16907c0,0 -0.13314,-2.0999 -0.13314,-3.29458z"
                                    fill="url(#bellyGrad)"
                                    stroke="none"
                                ></path>

                                {/* Beak */}
                                <path
                                    d="M271.10348,122.46768l10.06374,-3.28166l24.06547,24.28424"
                                    fill="none"
                                    stroke="url(#orangeGrad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                ></path>

                                {/* Eyes Container for Blinking */}
                                <g className="eyes">
                                    {/* Left Eye */}
                                    <ellipse cx="282" cy="115" rx="4" ry="7" fill="#000" />
                                    {/* Right Eye */}
                                    <ellipse cx="250" cy="120" rx="4" ry="7" fill="#000" />

                                    {/* Highlights */}
                                    <circle cx="284" cy="113" r="1.5" fill="white" opacity="0.9" />
                                    <circle cx="252" cy="118" r="1.5" fill="white" opacity="0.9" />
                                </g>

                                {/* Cheeks */}
                                <ellipse cx="288" cy="128" rx="6" ry="4" fill="#f43f5e" opacity="0.3" filter="url(#glow)" />
                                <ellipse cx="238" cy="138" rx="6" ry="4" fill="#f43f5e" opacity="0.3" filter="url(#glow)" />

                                {/* Sound Waves (Left) */}
                                <circle cx="194" cy="120" r="10" fill="none" stroke="#a855f7" strokeWidth="2" className="wave" style={{ animationDelay: '0s' }} />
                                <circle cx="194" cy="120" r="10" fill="none" stroke="#6366f1" strokeWidth="2" className="wave" style={{ animationDelay: '0.5s' }} />

                                {/* Sound Waves (Right) */}
                                <circle cx="296" cy="120" r="10" fill="none" stroke="#a855f7" strokeWidth="2" className="wave" style={{ animationDelay: '0s' }} />
                                <circle cx="296" cy="120" r="10" fill="none" stroke="#6366f1" strokeWidth="2" className="wave" style={{ animationDelay: '0.5s' }} />

                                {/* Headphones Cups (Over ears) */}
                                <rect x="188" y="105" width="12" height="30" rx="6" fill="url(#phoneGrad)" stroke="#fff" strokeWidth="1" />
                                <rect x="290" y="105" width="12" height="30" rx="6" fill="url(#phoneGrad)" stroke="#fff" strokeWidth="1" />

                                {/* Red Scarf */}
                                <path
                                    d="M205,145 Q250,165 295,145 L295,155 Q250,175 205,155 Z"
                                    fill="url(#scarfGrad)"
                                    stroke="#991b1b"
                                    strokeWidth="1"
                                />
                                {/* Scarf Tail */}
                                <path
                                    d="M280,150 L285,180 L305,175 L295,145 Z"
                                    fill="url(#scarfGrad)"
                                    stroke="#991b1b"
                                    strokeWidth="1"
                                />

                            </g>
                        </g>
                    </svg>
                </div>

                {/* Music Notes */}
                <div className="note" style={{ left: '170px', top: '70px', animationDelay: '0s' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#c084fc">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
                <div className="note" style={{ left: '230px', top: '50px', animationDelay: '0.6s' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#818cf8">
                        <path d="M20 3h-9c-1.1 0-2 .9-2 2v10c0 .9-.6 1.7-1.4 1.9-.9.2-1.8-.4-1.8-1.4v-5h4V5h-6v10.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V6h6v4.5c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5V5c0-1.1-.9-2-2-2z" />
                    </svg>
                </div>
                <div className="note" style={{ left: '140px', top: '90px', animationDelay: '1.2s' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#a855f7">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>

                <svg
                    id="gnd"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="475"
                    height="530"
                    viewBox="0,0,163.40011,85.20095"
                >
                    <g transform="translate(-176.25,-207.64957)">
                        <g
                            stroke="#ffffff"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeMiterlimit="10"
                        >
                            <path
                                d="M295.5,273.1829c0,0 -57.38915,6.69521 -76.94095,-9.01465c-13.65063,-10.50609 15.70098,-20.69467 -2.5451,-19.94465c-30.31027,2.05753 -38.51396,-26.84135 -38.51396,-26.84135c0,0 6.50084,13.30023 18.93224,19.17888c9.53286,4.50796 26.23632,-1.02541 32.09529,4.95137c3.62417,3.69704 2.8012,6.33005 0.66517,8.49452c-3.79415,3.84467 -11.7312,6.21103 -6.24682,10.43645c22.01082,16.95812 72.55412,12.73944 72.55412,12.73944z"
                                fill="#ffffff"
                                fillOpacity="0.1"
                            ></path>
                            <path
                                d="M338.92138,217.76285c0,0 -17.49626,12.55408 -45.36424,10.00353c-8.39872,-0.76867 -17.29557,-6.23066 -17.29557,-6.23066c0,0 3.06461,-2.23972 15.41857,0.72484c26.30467,6.31228 47.24124,-4.49771 47.24124,-4.49771z"
                                fill="#ffffff"
                                fillOpacity="0.1"
                            ></path>
                            <path
                                d="M209.14443,223.00182l1.34223,15.4356l-10.0667,-15.4356"
                                fill="none"
                            ></path>
                            <path
                                d="M198.20391,230.41806l12.95386,7.34824l6.71113,-12.08004"
                                fill="none"
                            ></path>
                            <path d="M211.19621,238.53825l8.5262,-6.09014" fill="none"></path>
                            <path
                                d="M317.57068,215.80173l5.27812,6.49615l0.40601,-13.39831"
                                fill="none"
                            ></path>
                            <path d="M323.66082,222.70389l6.09014,-9.33822" fill="none"></path>
                        </g>
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default Loader;
