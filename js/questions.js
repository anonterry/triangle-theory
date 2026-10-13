// Each answer: [label, [romance, sexuality, friendship]] weights. Totals are summed then normalised.
window.QUESTIONS = [
  { q: "Your ideal evening with someone you're close to looks like…", a: [
    ["A candlelit dinner for two", [1, .3, 0]],
    ["Game night with the whole friend group", [0, 0, 1]],
    ["A night that ends at their place (or mine)", [.2, 1, 0]],
    ["Sweatpants, snacks, zero pressure", [.3, 0, .8]] ]},
  { q: "In a long-term relationship, what's the 'glue' for you?", a: [
    ["Deep romantic devotion", [1, 0, 0]],
    ["Physical chemistry and great sex", [0, 1, 0]],
    ["Being best friends who trust each other completely", [0, 0, 1]],
    ["An even balance of all three", [.4, .3, .4]] ]},
  { q: "A close friend confesses feelings for you. You…", a: [
    ["Date them. This could be the real thing", [1, .3, .2]],
    ["Sleep with them but keep it casual", [0, 1, .4]],
    ["Value the friendship too much to risk it", [0, 0, 1]],
    ["Feel flattered, but don't feel that way", [.1, 0, .9]] ]},
  { q: "How much does sex matter in a relationship for you?", a: [
    ["It's central", [0, 1, 0]],
    ["Important, among other things", [.3, .6, .2]],
    ["Pleasant but optional", [.4, .1, .3]],
    ["Barely or not at all", [.5, 0, .5]] ]},
  { q: "Which getaway sounds best?", a: [
    ["A weekend away, just me and my partner", [1, .2, 0]],
    ["A hotel night with someone new and exciting", [0, 1, 0]],
    ["A road trip with my closest friends", [0, 0, 1]],
    ["A couples' resort where everyone mingles", [.3, .8, 0]] ]},
  { q: "Sex with someone you're not in love with is…", a: [
    ["Not for me. It needs romance", [1, 0, 0]],
    ["Great, if we're friends and trust each other", [0, .6, .6]],
    ["Great, no strings at all", [0, 1, 0]],
    ["Not interesting, with anyone", [.3, 0, .5]] ]},
  { q: "How do you feel about (consensual, ethical) sexual play with others alongside a partner?", a: [
    ["Hard no", [1, 0, .2]],
    ["Curious, with lots of rules", [.4, .4, .2]],
    ["Exciting. It'd be fun together", [.3, 1, 0]],
    ["Doesn't matter much; sex isn't my focus", [.3, 0, .6]] ]},
  { q: "What do you miss most when you're single?", a: [
    ["Being someone's number one", [1, 0, 0]],
    ["Physical intimacy", [0, 1, 0]],
    ["A confidant and companion", [0, 0, 1]],
    ["Not much, honestly", [.1, .1, .1]] ]},
  { q: "At a party, you're most likely to…", a: [
    ["Flirt with whoever catches my eye", [.3, 1, 0]],
    ["Chat with everyone and make new friends", [0, .1, 1]],
    ["Find one person for a deep conversation", [1, .1, .3]] ]},
  { q: "What would end a romantic relationship fastest?", a: [
    ["Losing the spark and passion", [.3, 1, 0]],
    ["Losing the friendship and trust", [0, 0, 1]],
    ["Losing the 'in love' feeling", [1, 0, 0]],
    ["Incompatible life goals", [.3, .1, .3]] ]},
  { q: "Which statement is closest to you?", a: [
    ["I fall in love deeply and easily", [1, .2, 0]],
    ["I'm attracted to many people but rarely fall in love", [0, 1, 0]],
    ["Love grows slowly out of friendship", [.3, .1, 1]],
    ["I rarely feel romantic or sexual attraction", [.1, 0, .6]] ]},
  { q: "Cuddling and non-sexual affection with a close friend is…", a: [
    ["Wonderful, and I'd like more of it", [.3, .1, 1]],
    ["Fine, but really a partner thing", [.8, .3, 0]],
    ["Only if it can lead somewhere", [.1, 1, 0]],
    ["Not my thing", [0, 0, .2]] ]},
  { q: "Your ideal relationship structure", a: [
    ["One partner for life", [1, .2, .2]],
    ["A partner, plus freedom to play with others", [.4, .8, .2]],
    ["No formal partner. A few close lovers and friends", [.1, .7, .6]],
    ["A close friend circle, no partner", [0, 0, 1]],
    ["A life partner with little or no sex", [.9, 0, .4]] ]},
  { q: "How often does sex cross your mind, honestly?", a: [
    ["A lot", [0, 1, 0]],
    ["Sometimes", [.2, .5, .2]],
    ["Rarely", [.4, .1, .4]],
    ["Almost never", [.4, 0, .6]] ]},
  { q: "Which compliment lands best?", a: [
    ["“You're the love of my life.”", [1, 0, 0]],
    ["“You're so hot.”", [0, 1, 0]],
    ["“You're my best friend.”", [0, 0, 1]],
    ["“I trust you with anything.”", [.3, 0, .8]] ]},
  { q: "A relationship works best when…", a: [
    ["The passion stays high", [.2, 1, 0]],
    ["We're deeply emotionally bonded", [1, 0, .3]],
    ["We laugh together and always have each other's back", [.1, 0, 1]],
    ["Everyone's needs are openly negotiated", [.2, .5, .4]] ]},
  { q: "It's 2am. You and a close friend are both single and lonely. You…", a: [
    ["Text them for comfort", [.1, 0, 1]],
    ["Text them to hook up", [0, 1, .4]],
    ["Text: “we should just date”", [1, .2, .5]],
    ["Sit with it alone", [.1, .1, .1]] ]},
  { q: "Your anniversary plan is…", a: [
    ["A romantic gesture: flowers, a letter, a toast", [1, 0, 0]],
    ["A steamy night in", [.2, 1, 0]],
    ["A quiet day doing our favourite things together", [.2, 0, 1]],
    ["I don't really care for anniversaries", [0, .3, .3]] ]},
  { q: "Hookups and no-strings encounters are…", a: [
    ["Not for me", [.8, 0, .6]],
    ["Occasionally fun", [.1, .7, .3]],
    ["My preferred mode", [0, 1, 0]],
    ["Only with close friends", [0, .6, 1]] ]},
  { q: "Which regret would sting most?", a: [
    ["Never finding true love", [1, 0, 0]],
    ["Not having enough adventure and passion", [0, 1, 0]],
    ["Losing a close friend", [0, 0, 1]],
    ["Not being true to what I actually want", [.3, .3, .3]] ]},
  { q: "Romantic jealousy hits you…", a: [
    ["Strongly. I want exclusivity", [1, .2, 0]],
    ["Moderately", [.5, .3, .3]],
    ["Rarely", [.2, .5, .5]],
    ["Almost never. I'm just not wired that way", [0, .4, .6]] ]},
  { q: "In ten years, you hope your closest relationship is…", a: [
    ["Marriage to my soulmate", [1, .3, .3]],
    ["Still thrilling, still exploring", [.2, 1, .1]],
    ["My best friend, whether or not we're a couple", [.1, 0, 1]],
    ["A primary partner plus deep friendships", [.5, .2, .8]] ]},
  { q: "Which word hits home?", a: [
    ["Devotion", [1, 0, 0]],
    ["Desire", [0, 1, 0]],
    ["Loyalty", [.1, 0, 1]],
    ["Freedom", [0, .7, .4]] ]}
];
