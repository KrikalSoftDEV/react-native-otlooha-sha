const ENVIRONMENT = "UAT"; // PROD || UAT || DEV | This will decide, Where this application will be pointing. 
const BASE_URL = ENVIRONMENT === "UAT" ? 
"https://mobileapp-uat-api.giveplease.com.my/api" : 
ENVIRONMENT === "DEV" ? "https://mobileapp-dev-api.giveplease.com.my/api" 
: "https://mobileapp-uat-api.giveplease.com.my/api" // For production please change this;
const STRIPE_PUBLIC_KEY = '';
const ORG_ID = '';

const GOOGLE_API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';
const WEATHER_API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';

export {
    ENVIRONMENT, 
    BASE_URL, 
    STRIPE_PUBLIC_KEY, 
    ORG_ID,
    GOOGLE_API_KEY,
    WEATHER_API_KEY
};