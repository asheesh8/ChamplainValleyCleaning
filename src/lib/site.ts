/**
 * Canonical business facts.
 *
 * Sourced from the client's Facebook page (facebook.com/p/Champlain-Valley-Cleaning-100065015740132)
 * on 2026-07-29. Anything marked TODO is a placeholder that the client
 * needs to confirm before launch — it is NOT verified fact.
 */

export const site = {
  name: "Champlain Valley Cleaning",
  shortName: "CVC",
  tagline: "Vermont's detail-obsessed cleaning crew",
  category: "Janitorial Service",

  /** Verbatim from the Facebook page bio. */
  bio: "Champlain Valley Cleaning provides our local community with all their cleaning needs. We are always willing to get creative. Our passion for a detailed cleaning will catch your attention. We are always aiming for perfection. Ask how we can save you money.",

  phone: "(802) 777-3824",
  phoneHref: "tel:+18027773824",
  email: "champlainvalleycleaning@gmail.com",
  emailHref: "mailto:champlainvalleycleaning@gmail.com",

  address: {
    locality: "Chittenden",
    region: "VT",
    country: "US",
  },

  /** Towns the client has said they serve or are expanding into. */
  serviceArea: [
    "Burlington",
    "South Burlington",
    "Winooski",
    "Essex Junction",
    "Colchester",
    "Williston",
    "Shelburne",
    "Rutland",
    "Chittenden",
  ],

  social: {
    facebook:
      "https://www.facebook.com/p/Champlain-Valley-Cleaning-100065015740132/",
  },

  domain: "champlainvalleycleaning.com",
  url: "https://www.champlainvalleycleaning.com",

  /** TODO: confirm with client — these are placeholders, not verified. */
  hours: [
    { day: "Monday – Friday", open: "7:00 AM", close: "6:00 PM" },
    { day: "Saturday", open: "8:00 AM", close: "2:00 PM" },
    { day: "Sunday", open: "Closed", close: "" },
  ],

  founded: 2020,
} as const;

export type Site = typeof site;
