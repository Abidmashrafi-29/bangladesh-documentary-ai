// This is placeholder data standing in for a real database/CMS later.
// Each entry mirrors a transcript in backend/data/transcripts/ so the
// chatbot's answers line up with what's shown on the site.
// LEARNING NOTE: exporting typed data like this is a common Next.js pattern -
// components import from here instead of hardcoding content inline.

export type Documentary = {
  slug: string;
  title: string;
  episode: string;
  description: string;
  body: string;
};

export const documentaries: Documentary[] = [
  {
    slug: "sundarbans",
    title: "The Sundarbans - Guardians of the Mangrove",
    episode: "Episode 01",
    description:
      "Inside the world's largest mangrove forest, home to the Royal Bengal Tiger and the mawalis who harvest wild honey from its canopy.",
    body: "The Sundarbans is the largest mangrove forest in the world, spanning the delta of the Ganges, Brahmaputra, and Meghna rivers across Bangladesh and India. On the Bangladesh side alone, it covers roughly 6,000 square kilometers of dense mangrove forest, tidal waterways, and mudflats. This documentary follows a local boatman named Karim who has navigated these waterways for over twenty years. Karim explains how the forest floods twice a day with the tides, and how the trees here - species like Sundari, Gewa, and Keora - have adapted root systems that let them breathe air even when partially submerged in saltwater. The Sundarbans is home to the Royal Bengal Tiger, one of the last strongholds of the species in the wild. Unlike tigers elsewhere, Sundarbans tigers are known to swim between islands and have adapted to a semi-aquatic lifestyle, hunting fish and even monkeys in addition to deer. Local honey collectors, known as \"mawalis,\" risk their lives each spring entering tiger territory to harvest wild honey from hives built high in the mangrove canopy. They follow rituals and prayers before entering the forest, seeking protection from Bonbibi, the guardian spirit of the forest worshipped by both Hindu and Muslim communities in the region. Climate change and rising sea levels pose a serious threat to the Sundarbans, with saltwater intrusion slowly changing the ecosystem. Local conservationists are working with international groups to monitor tiger populations and protect the mangrove ecosystem for future generations.",
  },
  
  {
    slug: "old-dhaka-food",
    title: "Old Dhaka - A Taste of History",
    episode: "Episode 02",
    description: 
    "A walk through Chawkbazar and Shakharibazar, tracing four generations of biriyani, Ramadan iftar traditions, and centuries-old craft.",
    body: "Old Dhaka, the historic core of the capital founded over 400 years ago under Mughal rule, is famous across Bangladesh for its street food culture. This episode walks through the narrow lanes of Chawkbazar and Shakharibazar, tracing food traditions that have survived for generations. The episode opens at Haji Biriyani in Nazira Bazar, a shop that has been serving its signature mutton biriyani since 1939. The recipe, passed down through four generations, uses a specific blend of spices and slow-cooking technique that the family has never written down - it is taught only by demonstration. During Ramadan, Chawkbazar transforms into one of the largest iftar markets in the world. Vendors sell 'Bou Jhi Bhorta,' a mashed dish whose curious name ('mother-in-law daughter-in-lawmash') comes from a local legend about two rival cooks. Other Ramadan specialties includejilapi (a giant coiled sweet), haleem, and various kebabs. The documentary also visits Shakharibazar, known as 'Hindu Street,' home to artisans who have crafted conch-shell bangles (shakha) for centuries, worn traditionally by married Hindu women in Bengal. The street itself is one of the oldest continuously inhabited areas in Dhaka. The episode closes with a visit to a traditional 'lassi' shop near Sadarghat, where the old port area still buzzes with river traffic, echoing Dhaka's centuries-old role as ariver-trade hub connecting Bengal to the wider world.",
  },

  {
    slug: "coxs-bazar",
    title: "Cox's Bazar - The Longest Shore",
    episode: "Episode 03",
    description:
      "The world's longest natural beach, traditional fishing communities, and the tension between tourism growth and coastal life.",
    body: "Cox's Bazar is home to the world's longest natural sea beach, stretching approximately 120 kilometers along the Bay of Bengal. This episode explores both the tourism boom transforming the area and the traditional fishing communities that have lived alongthis coast for generations. The documentary begins at dawn with a fishing crew launching wooden boats before sunrise, following practices passed down through families for generations. The crew explains how they read the sky and the tides, a skill increasingly supplemented today by mobile weatherapps, blending old knowledge with new tools. Inland from the beach, the episode visits a small Rakhine community, one of the indigenousgroups of the Chittagong Hill Tracts region, known for traditional weaving using backstrap looms to produce distinctive textiles sold in local markets. The episode also covers Himchari National Park, just south of the main beach, known for its waterfalls and hill forest, and Saint Martin's Island, Bangladesh's only coral island, a few hours further by boat, now facing pressure from unregulated tourism development. The film closes on the tension between rapid hotel and resort construction along the coastline and the fishing villages, some of which are being displaced. Local activists featured in the episode call for zoning that protects both the environment and the livelihoods of traditional coastal communities.",
  },
];
