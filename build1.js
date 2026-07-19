const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const learningDir = path.join(rootDir, 'learning');

// --- 1. NAVBAR SYNC ---
function getNavbar(prefix) {
    return `<nav class="navbar navbar-expand-lg">
    <div class="nav-container-custom container">
        <a class="navbar-brand cs-logo-wrap" href="${prefix}index.html">
            <div class="cs-visual-orb">
                <div class="orb-layer-anim"></div>
                <div class="orb-layer-static"></div>
                <div class="orb-icon-box"><span class="orb-icon">{ }</span></div>
            </div>
            <div class="cs-text-content">
                <span class="cs-main-brand">CODE<span class="cs-gradient-text">SPHERE</span></span>
                <div class="cs-tag-line"><div class="tag-line-dash"></div><span>WELCOME TO CODESPHERE</span></div>
            </div>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <i class="fas fa-bars" style="color:white;"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav mx-auto">
                <li class="nav-item"><a class="nav-link" href="${prefix}index.html">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="${prefix}roadmap/index.html">Roadmap</a></li>
                <li class="nav-item"><a class="nav-link" href="${prefix}website/index.html">Technologies</a></li>
                <li class="nav-item"><a class="nav-link active-hub" href="${prefix}learning/index.html">Learning Hub <span class="nav-dot"></span></a></li>
                <li class="nav-item"><a class="nav-link" href="${prefix}project/index.html">Projects</a></li>
                <li class="nav-item"><a class="nav-link" href="${prefix}contact/index.html">Contact</a></li>
            </ul>
            <div class="d-flex align-items-center gap-3">
                <a href="${prefix}thankyou.html" class="nav-link login-btn-nav" style="color:var(--primary)!important; font-weight:800;">Thank You</a>
                <div class="theme-switcher" id="themeToggle"><div class="toggle-ball"><i class="fas fa-moon"></i></div></div>
            </div>
        </div>
    </div>
</nav>`;
}

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const isRoot = path.dirname(filePath) === rootDir;
    const prefix = isRoot ? '' : '../';
    
    // Replace navbar
    content = content.replace(/<nav class="navbar[\s\S]*?<\/nav>/i, getNavbar(prefix));
    
    // For project/index.html where it might still be <header class="navbar"> 
    // Actually in the last run we replaced it with <nav class="navbar navbar-expand-lg"> 
    // so the above regex should catch it now.
    
    // General Responsive Fixes (Adding CSS if missing)
    if (!content.includes('/* Responsive Fixes injected */')) {
        const responsiveCss = `
        /* Responsive Fixes injected */
        @media (max-width: 1200px) {
            .container { max-width: 95%; }
            .grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
            .card { padding: 20px; }
            .row { flex-direction: column; }
        }
        @media (max-width: 768px) {
            .hero { padding-top: 120px; flex-direction: column; text-align: center; }
            .hero-img img { width: 100%; max-width: 300px; }
            .categories-grid, .footer-grid { grid-template-columns: 1fr; }
            .roadmap-container { flex-direction: column; gap: 40px; }
            .hub-dual-grid { grid-template-columns: 1fr !important; }
            .hub-col-right { position: relative !important; margin-top: 30px; }
            body { font-size: 15px; }
        }
        `;
        content = content.replace('</style>', responsiveCss + '\n</style>');
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html') && file !== 'login.html') {
            processHtmlFile(fullPath);
        }
    }
}
walk(rootDir);

// --- 2. DELETE LOGIN PAGE ---
const loginPath = path.join(rootDir, 'login.html');
if (fs.existsSync(loginPath)) {
    fs.unlinkSync(loginPath);
}

// --- 3. CREATE THANK YOU PAGE ---
const thankYouHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You | CodeSphere</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
    <!-- Inline styles from index for consistency -->
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
        :root { --bg: #030712; --text: #fff; --primary: #00f2ff; --secondary: #7c3aed; }
        body { background: var(--bg); color: var(--text); overflow-x: hidden; min-height: 100vh; display: flex; flex-direction: column; }
        .thankyou-container { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; }
        .thankyou-container h1 { font-size: 4rem; font-weight: 900; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: popIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); margin-bottom: 20px; }
        .thankyou-container p { font-size: 1.5rem; color: #cbd5e1; animation: fadeIn 1.5s ease; margin-bottom: 30px; }
        .creator-badge { padding: 15px 30px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 50px; font-size: 1.2rem; animation: slideUp 1s ease 0.5s both; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .creator-badge span { color: var(--primary); font-weight: 800; }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slideUp { 0% { transform: translateY(50px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .confetti { position: absolute; width: 10px; height: 10px; background-color: var(--primary); animation: fall linear infinite; opacity: 0; }
        @keyframes fall { 0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
    </style>
</head>
<body>
    ${getNavbar('')}
    
    <div class="thankyou-container">
        <h1>🎉 Thank You</h1>
        <p>Thank you for visiting CodeSphere.</p>
        <div class="creator-badge">Created by <span>Kiran Goswami</span></div>
    </div>
    
    <script>
        // Simple Confetti
        for(let i=0; i<50; i++) {
            let conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = Math.random() > 0.5 ? '#00f2ff' : '#7c3aed';
            conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
            conf.style.animationDelay = (Math.random() * 2) + 's';
            document.body.appendChild(conf);
        }
    </script>
</body>
</html>`;
fs.writeFileSync(path.join(rootDir, 'thankyou.html'), thankYouHtml, 'utf8');

// --- 4. REFACTOR LEARNING HUB (learning/index.html) ---
let learningIndex = fs.readFileSync(path.join(learningDir, 'index.html'), 'utf8');
// Remove Modal HTML completely
learningIndex = learningIndex.replace(/<!-- MODAL OVERLAY -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i, '');
// Remove the learningData JS block
learningIndex = learningIndex.replace(/<script>\s*const learningData[\s\S]*?<\/script>/i, '');
// Remove AJAX & Java cards (from the bottom rows we added earlier)
learningIndex = learningIndex.replace(/<div class="row">[\s\S]*?AJAX \(Concept\)[\s\S]*?<\/div>\s*<\/div>/i, '');
learningIndex = learningIndex.replace(/<div class="row">[\s\S]*?Java \(Concept\)[\s\S]*?<\/div>\s*<\/div>/i, '');

// Update triggers to link to specific pages instead of `#` and data-tech
const pageMap = {
    'html': 'html.html',
    'css': 'css.html',
    'js': 'javascript.html',
    'bootstrap': 'bootstrap.html',
    'php': 'php.html',
    'mysql': 'sql.html',
    'jquery': 'jquery.html'
};

for (const [key, page] of Object.entries(pageMap)) {
    const regex = new RegExp(`href="#" class="btn-neon tech-trigger" data-tech="${key}"`, 'g');
    learningIndex = learningIndex.replace(regex, `href="${page}" class="btn-neon"`);
    
    // Remove tech-trigger from image-block
    const imgRegex = new RegExp(`class="image-block tech-trigger" data-tech="${key}"`, 'g');
    learningIndex = learningIndex.replace(imgRegex, `class="image-block"`);
}

// Adjust card layout (smaller and balanced)
const cardCss = `
<style>
.row { max-width: 900px; margin: 0 auto 40px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 30px; border-radius: 20px; align-items: center; }
.text-block h2 { font-size: 2rem; }
.image-block img { max-width: 250px; }
</style>
`;
learningIndex = learningIndex.replace('</head>', cardCss + '\n</head>');
fs.writeFileSync(path.join(learningDir, 'index.html'), learningIndex, 'utf8');

console.log("Built Base and learning/index.html");
