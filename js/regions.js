// Regions are the nearest of these centers (Voronoi) in the triangle. center = [romance, sexuality, friendship] shares.
window.REGIONS = [
  { id: "hookup", name: "Casual Connection Seeker", color: [220, 80, 80], center: [.08, .78, .14],
    desc: "Chemistry comes first. You enjoy attraction, novelty and physical connection without it having to turn into a love story. You're upfront about what you want, and you do best with partners who want the same freedom." },
  { id: "swinger", name: "Open Explorer", color: [160, 80, 190], center: [.28, .62, .10],
    desc: "You want love and adventure at the same time. Swinging, play parties and other consensual play fit alongside a loving bond, as long as everyone is curious and agrees on the rules." },
  { id: "fwb", name: "Friends-with-Benefits Type", color: [230, 140, 60], center: [.05, .45, .50],
    desc: "You want sex with people you trust and like, without needing it to be romantic. You get physical closeness and real friendship together. Clear communication keeps it working." },
  { id: "friend", name: "Platonic Connector", color: [60, 120, 220], center: [.06, .10, .84],
    desc: "Friends are where you put most of your love. Loyalty, shared humor and showing up for people matter more to you than romance or sex." },
  { id: "devoted", name: "Devoted Companion", color: [40, 170, 150], center: [.33, .04, .63],
    desc: "You want a committed partner who is also your closest friend, with physical intimacy optional or low-key. That's common among people on the asexual spectrum, and among others who put emotional closeness first." },
  { id: "acelife", name: "Ace Life Partner", color: [60, 175, 90], center: [.78, .04, .18],
    desc: "You want romance, partnership and a shared life, with sex playing a small role or none at all. You want a partner who's happy to build that on your terms." },
  { id: "romantic", name: "Hopeless Romantic", color: [230, 90, 150], center: [.80, .15, .05],
    desc: "You love being in love. Grand gestures and deep devotion appeal to you, and so does being someone's one and only. Attraction is part of it, but romance leads." },
  { id: "passion", name: "Passionate Lover", color: [200, 60, 120], center: [.55, .40, .05],
    desc: "For you, romance and desire come as a pair, and you want the spark to last. Friendship is welcome, but heat and heart come first." },
  { id: "companion", name: "Companionate Partner", color: [90, 140, 200], center: [.40, .20, .40],
    desc: "You want a warm, steady romance built on friendship and trust. You value a partner you can laugh with. Passion is there, but comfort is the foundation." },
  { id: "whole", name: "Whole-Package Partner", color: [250, 160, 40], center: [.34, .33, .33],
    desc: "You want romance, chemistry and a best friend in the same relationship, in roughly equal measure. It's the classic ideal-marriage zone, and you're happiest when a relationship covers all three." }
];
window.classify = function (sh) {
  let best = null, bd = Infinity;
  for (const r of window.REGIONS) {
    const d = Math.hypot(sh[0] - r.center[0], sh[1] - r.center[1], sh[2] - r.center[2]);
    if (d < bd) { bd = d; best = r; }
  }
  return best;
};
