import res from '../../constants/res';

const FeaturesData = [
    {
        id: '1',
        title: res.strings.prayerTimes,
        description: res.strings.prayerTimesDesc,
        category: res.strings.daily,
        navigation: "PrayerTimeScreen",
        icon: require('../../assets/images/Homescreen/praying-time.png')
    },
    {
        id: '2',
        title: res.strings.hijrahCalendar,
        description: res.strings.hijrahCalendarDesc,
        category: res.strings.daily,
        navigation: "HijrahCalendar",
        icon: require('../../assets/images/Homescreen/hijrah-calendar.png')
    },
    {
        id: '3',
        title: res.strings.qiblaCompass,
        description: res.strings.qiblaCompassDesc,
        category: res.strings.daily,
        navigation: "QiblaCompassScreen",
        icon: require('../../assets/images/Homescreen/qibla_direction.png')
    },
    {
        id: '4',
        title: res.strings.worshipPlaces,
        description: res.strings.worshipPlacesDesc,
        category: res.strings.daily,
        navigation: "WorshipPlaces",
        icon: require('../../assets/images/Homescreen/worship_place.png')
    },
    {
        id: '5',
        title: res.strings.quran,
        description: res.strings.quranDesc,
        category: res.strings.daily,
        navigation: "Quran",
        icon: require('../../assets/images/Homescreen/quran-icon.png')
    },
    {
        id: '6',
        title: res.strings.dua,
        description: res.strings.duaDesc,
        category: res.strings.daily,
        navigation: "DuaScreen",
        icon: require('../../assets/images/Homescreen/dua.png')
    },
    {
        id: '7',
        title: res.strings.tasbihDhikir,
        description: res.strings.tasbihAndDhikirDesc,
        category: res.strings.daily,
        navigation: "TasbihDhikir",
        icon: require('../../assets/images/Homescreen/tasbih_icon.png')
    },

    // Guidance section
    {
        id: '8',
        title: res.strings.asatizahAI,
        description: res.strings.asatizahAIDesc,
        category: res.strings.guidance,
        navigation: "Asatizah AI",
        icon: require('../../assets/images/Homescreen/asatizah-ai.png')
    },
    {
        id: '9',
        title: res.strings.muslimBusinessList,
        description: res.strings.muslimBusinessListDesc,
        category: res.strings.guidance,
        navigation:"MuslimBusinessesScreen",
        icon: require('../../assets/images/Homescreen/muslim-business-list.png')
    },
    {
        id: '10',
        title: res.strings.klinikWaqafAnNur,
        description: res.strings.klinikWaqafAnNurDesc,
        category: res.strings.guidance,
        navigation: "ClinicsScreen",
        icon: require('../../assets/images/Homescreen/first-aid-kit-an-nur.png')
    },
    {
        id: '11',
        title: 'Larkin Ticket Booking',
        description: 'Book bus tickets',
        category: 'Guidance',
        navigation:"WebViewScreen",
        navigationParams: { receiptLink: "https://www.larkinsentral.my/", headerShow: true },
        icon: require('../../assets/images/Homescreen/larkin-ticket-booking.png')
    },
    {
        id: '12',
        title: res.strings.anNurProperties,
        description: res.strings.anNurPropertiesDesc,
        category: res.strings.guidance,
        navigation: "",
        icon: require('../../assets/images/Homescreen/an-nur-properties.png')
    },
    {
        id: '20',
        title: res.strings.anNurGold,
        description: res.strings.anNurGoldDesc,
        category: res.strings.guidance,
        navigation: "",
        icon: require('../../assets/images/Homescreen/gold_bar.png')
    },

    // Community section
    {
        id: '13',
        title: res.strings.khutbah,
        description: res.strings.khutbahDesc,
        category: res.strings.community,
        navigation: "KhutbahScreen",
        icon: require('../../assets/images/Homescreen/khutbah-holy-quran.png')
    },
    {
        id: '14',
        title: res.strings.donations,
        description: res.strings.donationsDesc,
        category: res.strings.community,
        navigation: "Donation",
        icon: require('../../assets/images/Homescreen/donate-donations.png')
    },
    {
        id: '15',
        title: res.strings.events,
        description: res.strings.eventsDesc,
        category: res.strings.community,
        navigation: "EventsList",
        icon: require('../../assets/images/Homescreen/event.png')
    },
    {
        id: '19',
        title: res.strings.announcements,
        description: res.strings.announcementsDesc,
        category: res.strings.community,
        navigation: "Announcements",
        icon: require('../../assets/images/Homescreen/marketing-event.png')
    },

    // Personal Growth section
    {
        id: '16',
        title: res.strings.edutainment,
        description: res.strings.edutainmentDesc,
        category: res.strings.personalGrowth,
        navigation: "Edutainment",
        icon: require('../../assets/images/Homescreen/education-edutainment.png')
    },
    {
        id: '17',
        title: res.strings.newsAndBlogs,
        description: res.strings.newsAndBlogsDesc,
        category: res.strings.personalGrowth,
        navigation: "NewsAndBlogs",
        icon: require('../../assets/images/Homescreen/news-blogs.png')
    },
    {
        id: '18',
        title: res.strings.games,
        description: res.strings.gamesDesc,
        category: res.strings.personalGrowth,
        navigation: "GamesScreen",
        icon: require('../../assets/images/Homescreen/puzzle-games.png')
    },
];

export { FeaturesData };

