export type Company = {
  name: string;
  dpoEmail: string;
};

/** Official KVKK/DPO contact addresses for major Turkish companies. */
export const COMPANIES: Company[] = [
  { name: "Trendyol", dpoEmail: "kvkk@trendyol.com" },
  { name: "Hepsiburada", dpoEmail: "kvkk@hepsiburada.com" },
  { name: "Getir", dpoEmail: "privacy@getir.com" },
  { name: "Yemeksepeti", dpoEmail: "kvkk@yemeksepeti.com" },
  { name: "Sahibinden", dpoEmail: "kvkk@sahibinden.com" },
  { name: "N11", dpoEmail: "kvkk@n11.com" },
  { name: "Boyner", dpoEmail: "kvkk@boyner.com.tr" },
  { name: "Zara TR", dpoEmail: "privacy@zara.com.tr" },
  { name: "LC Waikiki", dpoEmail: "kvkk@lcw.com" },
  { name: "MediaMarkt TR", dpoEmail: "kvkk@mediamarkt.com.tr" },
];
