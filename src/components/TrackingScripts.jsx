import { useEffect } from 'react';
import { useConfig } from '../utils/ConfigContext';

const TrackingScripts = () => {
  const { cookieConsent } = useConfig();

  useEffect(() => {
    if (!cookieConsent) return;

    // Map internal consent structure to Google's Consent Mode v2 structure
    // We treat 'denied' string as all denied
    const isDenied = cookieConsent === 'denied';

    const consentUpdate = {
      'ad_storage': isDenied ? 'denied' : (cookieConsent.targeting ? 'granted' : 'denied'),
      'ad_user_data': isDenied ? 'denied' : (cookieConsent.targeting ? 'granted' : 'denied'),
      'ad_personalization': isDenied ? 'denied' : (cookieConsent.targeting ? 'granted' : 'denied'),
      'analytics_storage': isDenied ? 'denied' : (cookieConsent.performance ? 'granted' : 'denied'),
      'functionality_storage': isDenied ? 'denied' : (cookieConsent.functionality ? 'granted' : 'denied'),
      'personalization_storage': isDenied ? 'denied' : (cookieConsent.functionality ? 'granted' : 'denied'),
    };

    // Push the update to GTM
    if (window.gtag) {
      window.gtag('consent', 'update', consentUpdate);
    } else if (window.dataLayer) {
      // Fallback if gtag function isn't found (though it should be from index.html)
      window.dataLayer.push(['consent', 'update', consentUpdate]);
    }

    // Trigger a custom event to signal consent has been updated (optional but helpful)
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'consent_update' });
    }

  }, [cookieConsent]);

  return null; // This component renders nothing
};

export default TrackingScripts;
