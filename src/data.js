/*
 * INSTRUCTIONS: HOW TO ADD A NEW LANGUAGE
 *
 * 1. Add your language code (e.g., "es", "fr") to `conf.main.language_switch_lang_list`.
 * 2. Add translation strings for your language in `owner` and `lang` objects below.
 * 3. Create a folder `src/posts/[lang_code]/_posts` and place markdown files there.
 *    Example: src/posts/es/_posts/my-post.md
 *    (English posts should go in src/posts/en/_posts/)
 */
export const conf = {
  main: {
    brand_replace: "$site_brand",
    greetings_replace: "$site_greetings",
    welcome_replace: "$site_welcome",
    language_switch_lang_list: ["en", "ne"],
    side_and_top_nav_buttons: [
      { key: "home", icon: "fa fa-home" },
      { key: "post-list", icon: "fa fa-pencil-square-o" },
      { key: "archives", icon: "fa fa-archive" },
      { key: "projects", icon: "fa fa-cog" },
      { key: "links", icon: "fa fa-link" },
      { key: "privacy-policy", icon: "fa fa-shield" },

      { key: "about", icon: "fa fa-user-o" },
      { key: "nepdate", icon: "fa fa-calendar", href: "https://nepdate.khumnath.com.np/" },
      { key: "aksharshala", icon: "fa fa-keyboard-o", href: "https://khumnath.com.np/aksharshala/" }
    ],
    side_nav_profile_img_path: "https://avatars.githubusercontent.com/u/50103558?v=4",
    contacts: true
  }
};

export const owner = {
  en: {
    brand: "khumnath's laboratory",
    home: {
      top_header_line1: "Never stop experiments",
      top_header_line2: "Because our knowledge is vastly imperfect"
    },
    contacts: [
      { github: "khumnath" },
      { email: "nath.khum@gmail.com" },
      { telegram: "khumnath" }
    ]
  },
  ne: {
    brand: "खुमनाथको प्रयोगशाला",
    home: {
      top_header_line1: "अनुसन्धान कहिल्यै नरोक्नुहोस", // Placeholder, need to verify
      top_header_line2: "किनभने हाम्रो ज्ञान अपूर्ण छ"
    },
    contacts: [
      { github: "khumnath" },
      { email: "nath.khum@gmail.com" },
      { telegram: "khumnath" }
    ]
  }
};

export const lang = {
  en: {
    home: {
      title: "Welcome",
      button_name: "Home",
      new_posts_title: "New Articles"
    },
    "post-list": {
      button_name: "Blog",
      title: "Blog",
      upside_down_tabs: {
        tab: {
          categories: "Categories",
          tags: "Tags",
          years: "Years",
          clear: "Clear",
          close: "Close"
        }
      }
    },
    constants: {
      greetings: "welcome to my blog",
      greetings_subtext: "I am pleased to see you here.",
      sample: "sample",
      welcome: "welcome."
    },
    navigation: {
      contact_header: "Contact",
      more: "More"
    },
    "privacy-policy": {
      button_name: "Privacy",
      title: "Privacy Policy"
    },
    about: {
      button_name: "About",
      title: "About"
    },
    archives: {
      button_name: "Archive",
      title: "Archive"
    },
    links: {
      button_name: "Links",
      title: "Links"
    },
    projects: {
      button_name: "Projects",
      title: "Projects",
      heading: "projects i am working on"
    },
    nepdate: {
      button_name: "Bikram Calendar",
      title: "Bikram Calendar"
    },
    aksharshala: {
      button_name: "Aksharshala",
      title: "Aksharshala"
    }
  },
  ne: {
    home: {
      title: "स्वागत छ",
      button_name: "गृहपृष्ठ",
      new_posts_title: "नयाँ लेखहरू"
    },
    "post-list": {
      button_name: "ब्लग",
      title: "आलेख",
      upside_down_tabs: {
        tab: {
          categories: "श्रेणीहरु",
          tags: "ट्यागहरु",
          years: "वर्षा",
          clear: "हटाउने",
          close: "बन्द"
        }
      }
    },
    constants: {
      greetings: "मेरो ब्लगमा स्वागत छ",
      greetings_subtext: "यहाँ देख्दा खुसी लाग्यो।",
      sample: "नमूना",
      welcome: "स्वागत छ।"
    },
    navigation: {
      contact_header: "सम्पर्क",
      more: "थप"
    },
    "privacy-policy": {
      button_name: "गोपनीयता",
      title: "गोपनीयता नीति"
    },
    about: {
      button_name: "मेरो बारेमा",
      title: "मेरो बारेमा"
    },
    archives: {
      button_name: "अभिलेख",
      title: "अभिलेख"
    },
    links: {
      button_name: "लिङ्क",
      title: "लिङ्कहरू"
    },
    projects: {
      button_name: "परियोजना",
      title: "परियोजनाहरु",
      heading: "परियोजनाहरू जुन म काम गरिरहेको छु"
    },
    nepdate: {
      button_name: "बिक्रम पात्रो",
      title: "बिक्रम पात्रो"
    },
    aksharshala: {
      button_name: "अक्षरशाला",
      title: "अक्षरशाला"
    }
  }
};
