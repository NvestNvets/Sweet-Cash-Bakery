const fs = require('fs');
const path = require('path');

// K9 data from the grid
const k9Groups = {
    veterans: [
        { name: "Codee", description: "Digital Product Builder", image: "k9-codee.jpg" },
        { name: "Affilia", description: "Affiliate Manager", image: "k9-affilia.jpg" },
        { name: "VetBuddy", description: "Veteran Support", image: "k9-vetbuddy.jpg" },
        { name: "SilverGuide", description: "Senior Business Guide", image: "k9-silverguide.jpg" },
        { name: "CashK9", description: "Financial Assistant", image: "k9-cashk9.jpg" },
        { name: "MarketRover", description: "Market Research", image: "k9-marketrover.jpg" },
        { name: "RentRanger", description: "Housing Assistant", image: "k9-rentranger.jpg" },
        { name: "DocuPaw", description: "Document Helper", image: "k9-docupaw.jpg" },
        { name: "BizBreed", description: "Business Planning", image: "k9-bizbreed.jpg" },
        { name: "TaskTail", description: "Task Manager", image: "k9-tasktail.jpg" },
        { name: "PromoPup", description: "Marketing Assistant", image: "k9-promopup.jpg" },
        { name: "LegalLab", description: "Legal Guide", image: "k9-legallab.jpg" },
        { name: "VetCounsel", description: "Veteran Counseling", image: "k9-vetcounsel.jpg" },
        { name: "EventPup", description: "Event Planner", image: "k9-eventpup.jpg" },
        { name: "OrderFetch", description: "Order Manager", image: "k9-orderfetch.jpg" },
        { name: "LeadRetriever", description: "Lead Generator", image: "k9-leadretriever.jpg" },
        { name: "SkillSetter", description: "Skill Development", image: "k9-skillsetter.jpg" },
        { name: "VetLink", description: "Veteran Network", image: "k9-vetlink.jpg" },
        { name: "CrisisCanine", description: "Crisis Support", image: "k9-crisiscanine.jpg" },
        { name: "PawPrint", description: "Digital Identity", image: "k9-pawprint.jpg" }
    ],
    elderly: [
        { name: "SecurePaw", description: "Safety Assistant", image: "k9-securepaw.jpg" },
        { name: "RescueRover", description: "Emergency Helper", image: "k9-rescuerover.jpg" },
        { name: "MealMate", description: "Meal Planning", image: "k9-mealmate.jpg" },
        { name: "CareCanine", description: "Care Assistant", image: "k9-carecanine.jpg" },
        { name: "HealthHound", description: "Health Monitor", image: "k9-healthhound.jpg" },
        { name: "TransitTail", description: "Transport Helper", image: "k9-transittail.jpg" },
        { name: "BarkBoost", description: "Wellness Coach", image: "k9-barkboost.jpg" },
        { name: "SafeBark", description: "Safety Monitor", image: "k9-safebark.jpg" },
        { name: "FamilyFetch", description: "Family Connect", image: "k9-familyfetch.jpg" }
    ],
    kids: [
        { name: "KiddyCodee", description: "Kids Coding", image: "k9-kiddycodee.jpg" },
        { name: "SnackTracker", description: "Healthy Snacks", image: "k9-snacktracker.jpg" },
        { name: "TalkieTails", description: "Language Learning", image: "k9-talkietails.jpg" },
        { name: "PlayPal", description: "Learning Games", image: "k9-playpal.jpg" },
        { name: "FriendFetch", description: "Social Skills", image: "k9-friendfetch.jpg" },
        { name: "BuddyMath", description: "Math Helper", image: "k9-buddymath.jpg" },
        { name: "DrawDoggo", description: "Art Assistant", image: "k9-drawdoggo.jpg" },
        { name: "SafeSteps", description: "Safety Guide", image: "k9-safesteps.jpg" },
        { name: "Readie", description: "Reading Helper", image: "k9-readie.jpg" },
        { name: "DreamPup", description: "Dream Journal", image: "k9-dreampup.jpg" }
    ],
    language: [
        { name: "LinguaPup", description: "Language Learning", image: "k9-linguapup.jpg" },
        { name: "TransTail", description: "Translation Helper", image: "k9-transtail.jpg" },
        { name: "WordWag", description: "Vocabulary Builder", image: "k9-wordwag.jpg" },
        { name: "SpeakSpot", description: "Speaking Practice", image: "k9-speakspot.jpg" }
    ]
};

// Template for K9 profile page
function generateK9ProfilePage(k9) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K9 ${k9.name} - ${k9.description}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        // Language detection and management
        const userLang = navigator.language || navigator.userLanguage;
        const defaultLang = userLang.startsWith('es') ? 'es' : 'en';
        
        // Language strings
        const translations = {
            en: {
                title: "K9 ${k9.name}",
                subtitle: "${k9.description}",
                description: "${k9.description} with AI assistance",
                startTool: "Start Tool",
                backToKennel: "Back to Kennel",
                languageToggle: "Language"
            },
            es: {
                title: "K9 ${k9.name}",
                subtitle: "${k9.description}",
                description: "${k9.description} con asistencia de IA",
                startTool: "Iniciar Herramienta",
                backToKennel: "Volver a la Perrera",
                languageToggle: "Idioma"
            }
        };
    </script>
</head>
<body class="bg-gray-100">
    <!-- Header with Language Toggle -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="/kennel/index.html" class="text-blue-500 hover:text-blue-600" data-lang="backToKennel">
                    ← Back to Kennel
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600" data-lang="languageToggle">Language:</span>
                <button onclick="toggleLanguage('en')" class="px-2 py-1 rounded hover:bg-gray-200">🇺🇸 EN</button>
                <button onclick="toggleLanguage('es')" class="px-2 py-1 rounded hover:bg-gray-200">🇪🇸 ES</button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <!-- K9 Profile -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <img src="/kennel/assets/${k9.image}" alt="K9 ${k9.name}" class="w-full h-64 object-cover">
                <div class="p-8">
                    <h1 class="text-3xl font-bold mb-2" data-lang="title">K9 ${k9.name}</h1>
                    <h2 class="text-xl text-gray-600 mb-4" data-lang="subtitle">${k9.description}</h2>
                    <p class="text-gray-700 mb-8" data-lang="description">
                        ${k9.description} with AI assistance
                    </p>
                    <a href="/kennel/apps/${k9.name.toLowerCase()}/index.html" 
                       class="block text-center bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
                       data-lang="startTool">
                        Start Tool
                    </a>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Language toggle function
        function toggleLanguage(lang) {
            document.documentElement.lang = lang;
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
        }

        // Initialize with default language
        document.addEventListener('DOMContentLoaded', () => {
            toggleLanguage(defaultLang);
        });
    </script>
</body>
</html>`;
}

// Template for K9 tool page
function generateK9ToolPage(k9) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>K9 ${k9.name} - ${k9.description}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/kennel/assets/js/shared.js"></script>
    <script>
        // Language detection and management
        const userLang = navigator.language || navigator.userLanguage;
        const defaultLang = userLang.startsWith('es') ? 'es' : 'en';
        
        // Language strings
        const translations = {
            en: {
                title: "K9 ${k9.name}",
                subtitle: "${k9.description}",
                backToProfile: "Back to Profile",
                languageToggle: "Language",
                underConstruction: "This tool is under construction",
                comingSoon: "Coming Soon",
                description: "We're working hard to bring you the best ${k9.description.toLowerCase()} experience. Check back soon!"
            },
            es: {
                title: "K9 ${k9.name}",
                subtitle: "${k9.description}",
                backToProfile: "Volver al Perfil",
                languageToggle: "Idioma",
                underConstruction: "Esta herramienta está en construcción",
                comingSoon: "Próximamente",
                description: "Estamos trabajando duro para brindarte la mejor experiencia de ${k9.description.toLowerCase()}. ¡Vuelve pronto!"
            }
        };
    </script>
</head>
<body class="bg-gray-100">
    <!-- Header with Language Toggle -->
    <header class="bg-white shadow-md">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
                <a href="/kennel/ai-k9s/${k9.name.toLowerCase()}.html" class="text-blue-500 hover:text-blue-600" data-lang="backToProfile">
                    ← Back to Profile
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <span class="text-sm text-gray-600" data-lang="languageToggle">Language:</span>
                <button onclick="toggleLanguage('en')" class="px-2 py-1 rounded hover:bg-gray-200">🇺🇸 EN</button>
                <button onclick="toggleLanguage('es')" class="px-2 py-1 rounded hover:bg-gray-200">🇪🇸 ES</button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                <h1 class="text-3xl font-bold mb-2" data-lang="title">K9 ${k9.name}</h1>
                <h2 class="text-xl text-gray-600 mb-8" data-lang="subtitle">${k9.description}</h2>

                <div class="mb-8">
                    <h3 class="text-2xl font-semibold text-blue-500 mb-4" data-lang="underConstruction">This tool is under construction</h3>
                    <p class="text-gray-600" data-lang="description">
                        We're working hard to bring you the best ${k9.description.toLowerCase()} experience. Check back soon!
                    </p>
                </div>

                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                    <div class="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // Language toggle function
        function toggleLanguage(lang) {
            document.documentElement.lang = lang;
            document.querySelectorAll('[data-lang]').forEach(element => {
                const key = element.getAttribute('data-lang');
                if (translations[lang][key]) {
                    element.textContent = translations[lang][key];
                }
            });
        }

        // Initialize with default language
        document.addEventListener('DOMContentLoaded', () => {
            toggleLanguage(defaultLang);
            // Log tool access
            window.K9Shared.logUsage('${k9.name}', 'tool_access', {
                status: 'under_construction'
            }).catch(console.error);
        });
    </script>
</body>
</html>`;
}

// Create directories if they don't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Generate all pages
function generateAllPages() {
    // Ensure directories exist
    ensureDirectoryExists('public/kennel/ai-k9s');
    ensureDirectoryExists('public/kennel/apps');

    // Generate pages for each K9
    Object.values(k9Groups).flat().forEach(k9 => {
        // Generate profile page
        const profilePath = `public/kennel/ai-k9s/${k9.name.toLowerCase()}.html`;
        fs.writeFileSync(profilePath, generateK9ProfilePage(k9));

        // Generate tool page
        const toolDir = `public/kennel/apps/${k9.name.toLowerCase()}`;
        ensureDirectoryExists(toolDir);
        const toolPath = `${toolDir}/index.html`;
        fs.writeFileSync(toolPath, generateK9ToolPage(k9));
    });
}

// Run the generator
generateAllPages(); 