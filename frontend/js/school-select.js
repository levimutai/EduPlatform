// Mock school data
const MOCK_SCHOOLS = [
    { id: 1, name: "Harvard University", code: "HARV2024" },
    { id: 2, name: "Stanford University", code: "STAN2024" },
    { id: 3, name: "MIT", code: "MIT2024" },
    { id: 4, name: "University of California Berkeley", code: "UCB2024" },
    { id: 5, name: "Yale University", code: "YALE2024" },
    { id: 6, name: "Princeton University", code: "PRIN2024" },
    { id: 7, name: "Columbia University", code: "COLU2024" },
    { id: 8, name: "University of Chicago", code: "UCHI2024" },
    { id: 9, name: "Cornell University", code: "CORN2024" },
    { id: 10, name: "University of Pennsylvania", code: "PENN2024" }
];

class SchoolSelector {
    constructor() {
        this.searchInput = document.getElementById('schoolSearch');
        this.searchResults = document.getElementById('searchResults');
        this.codeInput = document.getElementById('schoolCode');
        this.codeSubmit = document.getElementById('codeSubmit');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Search input
        this.searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Hide results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.hideResults();
            }
        });

        // Code input
        this.codeInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.toUpperCase();
        });

        this.codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleCodeSubmit();
            }
        });

        // Code submit button
        this.codeSubmit.addEventListener('click', () => {
            this.handleCodeSubmit();
        });
    }

    handleSearch(query) {
        if (query.length < 2) {
            this.hideResults();
            return;
        }

        const results = MOCK_SCHOOLS.filter(school => 
            school.name.toLowerCase().includes(query.toLowerCase())
        );

        this.showResults(results);
    }

    showResults(schools) {
        if (schools.length === 0) {
            this.searchResults.innerHTML = '<div class="search-result">No schools found</div>';
        } else {
            this.searchResults.innerHTML = schools.map(school => `
                <div class="search-result" onclick="schoolSelector.selectSchool(${school.id})">
                    <div class="school-name">${school.name}</div>
                    <div class="school-code">Code: ${school.code}</div>
                </div>
            `).join('');
        }
        
        this.searchResults.style.display = 'block';
    }

    hideResults() {
        this.searchResults.style.display = 'none';
    }

    selectSchool(schoolId) {
        const school = MOCK_SCHOOLS.find(s => s.id === schoolId);
        if (school) {
            this.storeSchoolAndRedirect(school);
        }
    }

    handleCodeSubmit() {
        const code = this.codeInput.value.trim();
        if (!code) return;

        const school = MOCK_SCHOOLS.find(s => s.code === code);
        if (school) {
            this.storeSchoolAndRedirect(school);
        } else {
            alert('School code not found. Please check and try again.');
        }
    }

    storeSchoolAndRedirect(school) {
        // Store selected school in localStorage
        localStorage.setItem('selectedSchool', JSON.stringify({
            id: school.id,
            name: school.name,
            code: school.code,
            selectedAt: new Date().toISOString()
        }));

        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.schoolSelector = new SchoolSelector();
});