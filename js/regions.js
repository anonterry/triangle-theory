// Regions are the nearest of these centres (Voronoi) in the triangle. center = [romance, sexuality, friendship] shares.
window.REGIONS = [
  { id: "hookup", name: "Casual Connection Seeker", color: [220, 80, 80], center: [.08, .78, .14],
    desc: "Chemistry comes first for you. You enjoy attraction, novelty and physical connection without it needing to become a love story. Honesty about expectations is your superpower, and you thrive with partners who want the same freedom." },
  { id: "swinger", name: "Open Explorer", color: [160, 80, 190], center: [.28, .62, .10],
    desc: "You like romance and you like adventure, and you don't see them as enemies. Swinging, key parties and other consensual play can sit comfortably alongside a loving bond, ideally with a partner who shares the curiosity and clear rules." },
  { id: "fwb", name: "Friends-with-Benefits Type", color: [230, 140, 60], center: [.05, .45, .50],
    desc: "Your best intimacy happens with people you trust and genuinely like. You want physical closeness and real friendship, without the weight of romantic expectations. Communication keeps this arrangement healthy." },
  { id: "friend", name: "Platonic Connector", color: [60, 120, 220], center: [.06, .10, .84],
    desc: "Friendship is your main love language. Deep loyalty, shared humour and showing up for people matter more to you than romance or sex. Your close friends are your chosen family." },
  { id: "devoted", name: "Devoted Companion", color: [40, 170, 150], center: [.33, .04, .63],
    desc: "You want a committed partner who is also your closest friend, and physical intimacy is optional or low-key. This is common among people on the asexual spectrum, and plenty of others who value emotional closeness above all." },
  { id: "acelife", name: "Ace Life Partner", color: [60, 175, 90], center: [.78, .04, .18],
    desc: "Romance is the heart of what you seek: devotion, partnership and a shared life, with sex a minor note or none at all. You're looking for someone who loves you for you and builds a home with you on those terms." },
  { id: "romantic", name: "Hopeless Romantic", color: [230, 90, 150], center: [.80, .15, .05],
    desc: "You love love. Grand gestures, deep devotion and being someone's one-and-only are what you crave, with attraction as part of the package. You commit with your whole heart." },
  { id: "passion", name: "Passionate Lover", color: [200, 60, 120], center: [.55, .40, .05],
    desc: "Romance and desire intertwine for you. You want to be swept off your feet and kept there, and your relationships burn bright. Friendship is welcome, but heat and heart come first." },
  { id: "companion", name: "Companionate Partner", color: [90, 140, 200], center: [.40, .20, .40],
    desc: "A warm, steady romance built on friendship and trust. You value a partner you can laugh with, and a relationship where passion is present but comfort is the real foundation." },
  { id: "whole", name: "Whole-Package Partner", color: [250, 160, 40], center: [.34, .33, .33],
    desc: "You want it all in balance: romance, great chemistry and a true best friend in one person. This is the classic ideal-marriage zone, and you're happiest in a relationship that feeds every part of connection." }
];
window.classify = function (sh) {
  let best = null, bd = Infinity;
  for (const r of window.REGIONS) {
    const d = Math.hypot(sh[0] - r.center[0], sh[1] - r.center[1], sh[2] - r.center[2]);
    if (d < bd) { bd = d; best = r; }
  }
  return best;
};
