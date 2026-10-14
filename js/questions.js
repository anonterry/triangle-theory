// Each answer: [label, [romance, sexuality, friendship]] with weights 0..1.
// Scoring (js/scoring.js) compares your totals against what random answering would give,
// so the middle of the triangle is NOT the default landing spot.
window.QUESTIONS = [
  { q: "Friday night, your phone buzzes. Which text makes you drop everything?", a: [
    ["“Come over. Wear nothing under the coat.”", [0, 1, 0]],
    ["“Can't stop thinking about you. See you tonight?”", [1, 0, 0]],
    ["“We're at the bar and we saved you a seat!”", [0, 0, 1]],
    ["“Hotel is booked. Candles optional, handcuffs not.”", [1, 1, 0]] ]},
  { q: "What makes a date feel hot to you?", a: [
    ["A slow build: eye contact, a hand on my back, a kiss that means something", [1, .6, 0]],
    ["Obvious mutual lust and a short route to a bedroom", [0, 1, 0]],
    ["Laughing until my face hurts with someone who just gets me", [0, .2, 1]],
    ["A late-night walk and a secret I've never told anyone", [1, 0, .7]],
    ["Dancing close, grinding on a dance floor, seeing where it goes", [0, 1, .4]] ]},
  { q: "After really good sex, you most want…", a: [
    ["To whisper “I'm falling for you” into their neck", [1, .2, 0]],
    ["A snack, a laugh, and then round two", [0, .8, 1]],
    ["A hot shower and a friendly goodbye", [0, 1, 0]],
    ["To talk about what we want this to become", [1, 0, .3]] ]},
  { q: "A close friend proposes adding benefits to your friendship. You say…", a: [
    ["“Yes please. Fun in bed plus my favourite person? Perfect.”", [0, 1, 1]],
    ["“Only if it could turn into something romantic.”", [1, .6, .3]],
    ["“No thanks. The friendship is the whole point.”", [0, 0, 1]],
    ["“I'd rather keep sex with people I'm not friends with. Cleaner.”", [0, 1, 0]] ]},
  { q: "Casual sex (hookups, one-night stands) is…", a: [
    ["Great. Pleasure without the paperwork", [0, 1, 0]],
    ["Fun with someone I like and trust", [0, 1, .7]],
    ["Best once there's real romantic potential", [1, .5, 0]],
    ["Not really my thing. I connect in other ways", [.3, 0, 1]],
    ["Not part of my life, and I'm happy that way", [.6, 0, .8]] ]},
  { q: "A swingers or play-party invitation lands in your inbox. You…", a: [
    ["RSVP before finishing the message", [0, 1, 0]],
    ["Go with a trusted partner and keep our bond the focus", [1, 1, 0]],
    ["Go with friends to hang out, chat and people-watch", [0, .4, 1]],
    ["Pass. I prefer intimacy one-on-one", [1, 0, .4]] ]},
  { q: "Your ideal relationship setup is…", a: [
    ["One devoted partner who is lover, best friend and home", [1, .7, .7]],
    ["A devoted romantic partnership plus deep friendships", [1, 0, .8]],
    ["A romantic partner, plus adventures with others by mutual agreement", [.8, 1, 0]],
    ["A few close lovers who are also close friends, no hierarchy", [.3, 1, .8]],
    ["A web of friends and no partner needed", [0, 0, 1]] ]},
  { q: "Someone slips you their number with a note about exactly what they'd do to you.", a: [
    ["I'm already typing back", [0, 1, 0]],
    ["Intriguing. Coffee first, then we'll see", [.6, .2, .8]],
    ["I'm showing my friends and we're laughing about it", [0, .2, 1]],
    ["Flattering, but my heart is already taken", [1, 0, 0]] ]},
  { q: "Pick a fantasy.", a: [
    ["A slow, candle-lit night with someone who adores me", [1, .7, 0]],
    ["Being wanted by a stranger. No names, no strings", [0, 1, 0]],
    ["A game with my best friend that turns unexpectedly hot", [0, .8, 1]],
    ["A bonfire trip with my favourite people. No sex required", [0, 0, 1]],
    ["Exploring each other's kinks with someone I deeply trust", [.6, 1, .3]] ]},
  { q: "Kink, fetish and power play are…", a: [
    ["A core part of my sex life", [0, 1, 0]],
    ["Something to explore with a trusted partner", [.6, .9, .2]],
    ["A great topic for friends to swap stories about", [0, .3, 1]],
    ["Not really my thing", [.3, 0, .3]] ]},
  { q: "Your flirting style is…", a: [
    ["Teasing banter and lots of eye contact", [0, .8, .7]],
    ["Thoughtful compliments and old-fashioned charm", [1, .2, 0]],
    ["Direct: “I want you.”", [0, 1, 0]],
    ["Friend first. The rest happens or it doesn't", [.2, 0, 1]] ]},
  { q: "Your partner has a hot date with someone else, with everyone's consent. You feel…", a: [
    ["Thrilled. Tell me everything", [.3, 1, .3]],
    ["A little jealous but secure. We'd talk first", [1, .3, .3]],
    ["That's not our deal. We're each other's one and only", [1, 0, 0]],
    ["Totally fine. We're friends first, partners second", [.4, .3, 1]] ]},
  { q: "How do you feel about being “someone's person”?", a: [
    ["It's what I want most in the world", [1, 0, 0]],
    ["I'd rather have many warm connections than one big one", [0, .4, 1]],
    ["I want a primary partner, but I need freedom too", [.7, .7, .2]],
    ["I'd rather enjoy people freely, without labels", [0, 1, .3]] ]},
  { q: "Talking through boundaries and consent before play feels…", a: [
    ["Sexy. A clear yes is hot", [0, 1, .3]],
    ["Loving. It's how I show I care", [1, .2, .4]],
    ["Like planning a road trip with a friend", [0, .3, 1]] ]},
  { q: "Pick a weekend.", a: [
    ["A cabin, a hot tub, and nobody else for 48 hours", [1, 1, 0]],
    ["A kink convention: workshops by day, afterparty by night", [0, 1, .6]],
    ["Festival camping with the whole gang", [0, .2, 1]],
    ["Love letters and long baths with my person", [1, .3, .2]] ]},
  { q: "The gift that wins you over is…", a: [
    ["A handwritten letter about why they love me", [1, 0, 0]],
    ["Lingerie or a toy, wrapped with a bow", [0, 1, 0]],
    ["Something thoughtful that proves they really know me", [.3, 0, 1]] ]},
  { q: "In bed, what matters most?", a: [
    ["Mind-blowing physical chemistry", [0, 1, 0]],
    ["Feeling emotionally safe and adored", [1, .4, 0]],
    ["Laughing together, zero performance pressure", [0, .4, 1]],
    ["Honestly I could skip it; closeness matters more", [.6, 0, .8]] ]},
  { q: "At a party, you go home with…", a: [
    ["Whoever I've been flirting with all night", [0, 1, 0]],
    ["The person I couldn't stop talking to", [.5, .2, 1]],
    ["My partner, hand in hand", [1, .2, 0]],
    ["My friends, same as I arrived", [0, 0, 1]] ]},
  { q: "Your love language is…", a: [
    ["Words and devotion", [1, 0, 0]],
    ["Touch, skin, and a lot of it", [0, 1, .3]],
    ["Quality time and inside jokes", [0, 0, 1]],
    ["Acts of service, like cooking dinner together (naked optional)", [.8, .5, .3]] ]},
  { q: "You and a close friend both confess, a little drunk, that you've always found each other hot. Next move?", a: [
    ["Kiss them. Obviously", [0, 1, .5]],
    ["Laugh it off and order pizza", [0, 0, 1]],
    ["Take it slow and ask whether this could be real love", [1, .4, .3]],
    ["Make a plan with terms and boundaries, then jump", [0, .8, .8]] ]},
  { q: "What do sex-positive spaces (munches, workshops, play parties) mean to you?", a: [
    ["A place to explore desire out loud", [0, 1, .3]],
    ["A place to find my people", [0, .2, 1]],
    ["A place I might meet someone to fall for", [1, .3, .4]] ]},
  { q: "Which relationship moment would you hate to miss?", a: [
    ["The first “I love you”", [1, 0, 0]],
    ["The first time we really can't keep our hands off each other", [0, 1, 0]],
    ["The first time we laugh so hard we can't breathe", [0, 0, 1]],
    ["The first time we try something new and a little wicked", [.3, 1, .5]] ]},
  { q: "Your texting habits with someone you're into are…", a: [
    ["Sweet good-mornings and good-nights", [1, 0, .3]],
    ["Flirty pics and filthy promises", [0, 1, 0]],
    ["Memes, gossip and constant banter", [0, .2, 1]],
    ["Plans, plans, plans. Let's get together already", [.3, .8, .5]] ]},
  { q: "Complete the sentence: “The best part of intimacy is…”", a: [
    ["Being chosen", [1, 0, 0]],
    ["The heat", [0, 1, 0]],
    ["Being known", [.4, 0, 1]],
    ["Getting to be playful and wild with someone", [.2, .8, .7]] ]},
  { q: "If a partner told you they're asexual, you'd…", a: [
    ["Be curious. We'd find what intimacy means for us", [1, 0, .8]],
    ["Be honest about my needs and what we could negotiate", [.4, 1, .4]],
    ["Respect it, but sex is essential for me", [.2, 1, 0]],
    ["Be happy for them. I'm happy with closeness without sex too", [.7, 0, 1]] ]}
];
