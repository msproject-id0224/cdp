import{j as e,H as o,L as i,a as c}from"./app-DLq9cqYW.js";import{_ as t}from"./lang-CeFqNnu1.js";import{D as a}from"./Dropdown-BVUclz3f.js";import{P as l}from"./ProfilePhoto-Qt-YaELb.js";import{F as m}from"./Footer-BYoz_4d2.js";import"./transition-bdeyPoMv.js";function h(){const r=t("Child Development Program"),s=n=>{c.post(route("language.switch",n),{},{preserveScroll:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:t("Get Started")}),e.jsx("style",{children:`
                @keyframes kenburns {
                    0%   { transform: scale(1)    translateX(0)    translateY(0); }
                    25%  { transform: scale(1.08) translateX(-1%)  translateY(-1%); }
                    50%  { transform: scale(1.12) translateX(1%)   translateY(-2%); }
                    75%  { transform: scale(1.08) translateX(-1%)  translateY(1%); }
                    100% { transform: scale(1)    translateX(0)    translateY(0); }
                }
                @keyframes fadeInUp {
                    0%   { opacity: 0; transform: translateY(30px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes titleGlow {
                    0%, 100% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 4px 24px rgba(0,0,0,0.4); }
                    50%      { text-shadow: 0 0 40px rgba(255,255,255,1),   0 4px 32px rgba(0,0,0,0.5); }
                }
                @keyframes floatLogo {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(-10px); }
                }
                .bg-kenburns {
                    animation: kenburns 20s ease-in-out infinite;
                    will-change: transform;
                }
                .title-glow {
                    animation: titleGlow 3s ease-in-out infinite, fadeInUp 0.8s ease-out both;
                }
                .logo-float {
                    animation: floatLogo 4s ease-in-out infinite, fadeInUp 0.6s ease-out both;
                }
                .btn-fade {
                    animation: fadeInUp 1s ease-out 0.4s both;
                }
            `}),e.jsxs("div",{className:"relative min-h-screen overflow-hidden flex flex-col",children:[e.jsx("div",{className:"absolute inset-0 bg-kenburns bg-cover bg-center",style:{backgroundImage:"url('/assets/img/background.webp')"}}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none"}),e.jsx("div",{className:"absolute top-4 right-4 z-20",children:e.jsxs(a,{children:[e.jsx(a.Trigger,{children:e.jsx("button",{className:"flex items-center justify-center p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none",children:e.jsx(l,{src:"/assets/img/globe.png",alt:t("Language"),className:"h-8 w-8 object-contain drop-shadow-md hover:scale-110 transition-transform duration-200",fallbackClassName:"h-8 w-8 bg-white/50 rounded-full flex items-center justify-center text-xs",fallback:"🌐"})})}),e.jsxs(a.Content,{children:[e.jsx("button",{onClick:()=>s("id"),className:"block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition",children:t("Bahasa")}),e.jsx("button",{onClick:()=>s("en"),className:"block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition",children:t("English")})]})]})}),e.jsxs("div",{className:"flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-16 pb-6",children:[e.jsx(l,{src:"/assets/img/logo-rmd.png",alt:t("Logo RMD"),className:"h-28 sm:h-36 w-auto mb-6 object-contain drop-shadow-2xl logo-float",fallbackClassName:"h-28 sm:h-36 w-28 sm:w-36 mb-6 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 font-bold text-2xl rounded-lg shadow-lg logo-float",fallback:"RMD"}),e.jsx("div",{className:"w-20 h-1 bg-white/70 rounded-full mb-5",style:{animation:"fadeInUp 0.7s ease-out 0.2s both"}}),e.jsx("h1",{className:"title-glow text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white text-center uppercase leading-tight w-full max-w-sm sm:max-w-xl",style:{letterSpacing:"0.07em"},children:r}),e.jsx("div",{className:"w-20 h-1 bg-white/70 rounded-full mt-5 mb-8",style:{animation:"fadeInUp 0.7s ease-out 0.3s both"}}),e.jsx("div",{className:"btn-fade",children:e.jsx(i,{href:route("login"),className:"inline-block bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 px-10 sm:px-12 rounded-full transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105 text-base sm:text-lg tracking-wide",children:t("Get Started")})})]}),e.jsx("div",{className:"relative z-10",children:e.jsx(m,{transparent:!0})})]})]})}export{h as default};
