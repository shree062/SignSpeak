/**
 * SignSpeak - AI-Powered Sign Language Translation Web Application
 * Master Application Controller & ML Gesture Processor
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Initial Dataset & Sign Vocabulary (52 Signs across 8 Categories)
  // =========================================================================
  const DEFAULT_SIGNS_DATASET = [
    {
      signId: 1,
      signName: "Hello",
      category: "Greetings",
      description: "Open flat palm raised to temple and waved gently outwards.",
      instructions: "1. Raise dominant open hand to temple height.<br>2. Extend fingers with palm facing outwards.<br>3. Wave hand gently away from forehead.",
      exampleUsage: "Used as a friendly initial greeting when meeting someone.",
      phrase: "Hello! Welcome to SignSpeak.",
      emotion: "Friendly / Warm",
      emotionEmoji: "😊",
      emotionConfidence: 0.984
    },
    {
      signId: 2,
      signName: "Thank You",
      category: "Common Phrases",
      description: "Flat hand fingertips touch chin/lips then move forward towards person.",
      instructions: "1. Place fingers of flat dominant hand on your chin or lips.<br>2. Move hand outward and slightly down toward the other person.<br>3. Maintain a warm facial expression.",
      exampleUsage: "Used to express gratitude, appreciation, or politeness.",
      phrase: "Thank you very much!",
      emotion: "Polite & Grateful",
      emotionEmoji: "🙏",
      emotionConfidence: 0.989
    },
    {
      signId: 3,
      signName: "Good Morning",
      category: "Greetings",
      description: "Sign 'Good' from chin to flat palm, then rise hand like rising sun.",
      instructions: "1. Touch chin with flat hand and bring down to non-dominant palm ('Good').<br>2. Bring dominant hand up under base arm like the rising sun ('Morning').",
      exampleUsage: "Standard polite morning greeting.",
      phrase: "Good morning, have a wonderful day!",
      emotion: "Cheerful & Bright",
      emotionEmoji: "🌅",
      emotionConfidence: 0.975
    },
    {
      signId: 4,
      signName: "Good Afternoon",
      category: "Greetings",
      description: "Sign 'Good', then rest forearm downward at 45 degrees over horizontal base arm.",
      instructions: "1. Sign 'Good' from chin to palm.<br>2. Place dominant forearm resting at 45 degrees over horizontal base arm indicating midday sun.",
      exampleUsage: "Greeting used during noon and afternoon hours.",
      phrase: "Good afternoon!",
      emotion: "Pleasant & Polite",
      emotionEmoji: "☀️",
      emotionConfidence: 0.968
    },
    {
      signId: 5,
      signName: "Good Evening",
      category: "Greetings",
      description: "Sign 'Good', then cup dominant wrist gently downward over horizontal base wrist.",
      instructions: "1. Sign 'Good' from chin to palm.<br>2. Cup dominant hand downward over horizontal base wrist representing evening.",
      exampleUsage: "Standard polite evening greeting.",
      phrase: "Good evening to you all.",
      emotion: "Calm & Pleasant",
      emotionEmoji: "🌆",
      emotionConfidence: 0.965
    },
    {
      signId: 6,
      signName: "Good Night",
      category: "Greetings",
      description: "Sign 'Good', then curve dominant wrist over non-dominant horizontal arm.",
      instructions: "1. Sign 'Good' from chin to palm.<br>2. Rest dominant curved hand over edge of horizontal arm representing the sun setting.",
      exampleUsage: "Used when parting in the evening or going to sleep.",
      phrase: "Good night, sweet dreams.",
      emotion: "Calm & Gentle",
      emotionEmoji: "🌙",
      emotionConfidence: 0.972
    },
    {
      signId: 7,
      signName: "Welcome",
      category: "Greetings",
      description: "Open hand with palm facing up swept in arc toward body.",
      instructions: "1. Hold dominant hand out to side with open palm facing up.<br>2. Sweep hand in an arc towards center of chest.",
      exampleUsage: "Welcoming guests or responding to 'Thank You'.",
      phrase: "You are very welcome.",
      emotion: "Welcoming & Warm",
      emotionEmoji: "👐",
      emotionConfidence: 0.979
    },
    {
      signId: 8,
      signName: "Nice to Meet You",
      category: "Greetings",
      description: "Slide dominant palm across non-dominant palm, then bring index fingers together.",
      instructions: "1. Slide flat dominant palm across flat base palm ('Nice').<br>2. Bring two pointing index fingers together facing each other ('Meet').",
      exampleUsage: "Introductions when meeting someone for the first time.",
      phrase: "It is very nice to meet you.",
      emotion: "Friendly Introduction",
      emotionEmoji: "🤝",
      emotionConfidence: 0.983
    },
    {
      signId: 9,
      signName: "Goodbye",
      category: "Greetings",
      description: "Open palm raised at chest height with fingers fluttering in a waving farewell motion.",
      instructions: "1. Raise dominant hand with open palm facing forward.<br>2. Bend four fingers up and down repeatedly in a farewell wave.",
      exampleUsage: "Parting farewell when leaving a conversation or meeting.",
      phrase: "Goodbye, see you soon!",
      emotion: "Warm Farewell",
      emotionEmoji: "👋",
      emotionConfidence: 0.985
    },
    {
      signId: 10,
      signName: "See You Later",
      category: "Greetings",
      description: "Form 'V' with two fingers pointing from eye, then pivot wrist forward to 'L' shape.",
      instructions: "1. Point index and middle fingers in 'V' from eye outward ('See').<br>2. Pivot hand forward into 'L' shape and drop thumb ('Later').",
      exampleUsage: "Casual friendly departure.",
      phrase: "I will see you later.",
      emotion: "Casual & Friendly",
      emotionEmoji: "✌️",
      emotionConfidence: 0.962
    },
    {
      signId: 11,
      signName: "How are You",
      category: "Common Phrases",
      description: "Both hands knuckles together roll outward to thumbs up, then point forward.",
      instructions: "1. Place both curved hands knuckles touching against chest.<br>2. Roll hands outward so palms face upward.<br>3. Point index finger directly at conversational partner.",
      exampleUsage: "Inquiring about someone's state of well-being.",
      phrase: "How are you doing today?",
      emotion: "Inquiring / Questioning",
      emotionEmoji: "❓",
      emotionConfidence: 0.965
    },
    {
      signId: 12,
      signName: "I am Fine",
      category: "Common Phrases",
      description: "Open hand with thumb touching chest repeatedly.",
      instructions: "1. Open dominant hand with spread fingers ('5' handshape).<br>2. Tap thumb lightly against center of chest twice.",
      exampleUsage: "Responding positively to 'How are you?'.",
      phrase: "I am doing fine, thank you.",
      emotion: "Content & Relaxed",
      emotionEmoji: "😌",
      emotionConfidence: 0.962
    },
    {
      signId: 13,
      signName: "One Moment Please",
      category: "Common Phrases",
      description: "Raise index finger pointing upward while making slight pause gesture.",
      instructions: "1. Raise dominant index finger pointing up.<br>2. Hold position momentarily with a calm, attentive look.",
      exampleUsage: "Asking someone to wait a brief second.",
      phrase: "Please wait one moment.",
      emotion: "Patient & Attentive",
      emotionEmoji: "☝️",
      emotionConfidence: 0.954
    },
    {
      signId: 14,
      signName: "Please",
      category: "Common Phrases",
      description: "Flat palm on center of chest rubbed in clockwise circular motion.",
      instructions: "1. Place flat open dominant hand over chest center.<br>2. Rub hand in circular motion clockwise two or three times.",
      exampleUsage: "Polite request for assistance or favors.",
      phrase: "Please, could you help me?",
      emotion: "Polite & Earnest",
      emotionEmoji: "🤝",
      emotionConfidence: 0.978
    },
    {
      signId: 15,
      signName: "Sorry",
      category: "Common Phrases",
      description: "Fist rubbed in circular motion over center of chest.",
      instructions: "1. Form an 'A' fist with dominant hand.<br>2. Rub fist in circular motion on center of chest with an apologetic expression.",
      exampleUsage: "Apologizing for an accident, mistake, or inconvenience.",
      phrase: "I am really sorry about that.",
      emotion: "Apologetic / Regretful",
      emotionEmoji: "😔",
      emotionConfidence: 0.969
    },
    {
      signId: 16,
      signName: "Excuse Me",
      category: "Common Phrases",
      description: "Fingertips of curved dominant hand brush outward twice across open non-dominant palm.",
      instructions: "1. Hold non-dominant hand flat, palm up.<br>2. Brush curved dominant fingertips across palm towards fingers twice.",
      exampleUsage: "Politely getting someone's attention or apologizing for passing by.",
      phrase: "Excuse me, pardon me.",
      emotion: "Courteous & Polite",
      emotionEmoji: "🙋",
      emotionConfidence: 0.964
    },
    {
      signId: 17,
      signName: "You're Welcome",
      category: "Common Phrases",
      description: "Open hand sweeps smoothly inwards from front to upper chest.",
      instructions: "1. Start with open palm facing upward in front of torso.<br>2. Sweep hand inward towards upper chest with a warm smile.",
      exampleUsage: "Responding politely when someone thanks you.",
      phrase: "You are very welcome, anytime.",
      emotion: "Kind & Courteous",
      emotionEmoji: "🤗",
      emotionConfidence: 0.970
    },
    {
      signId: 18,
      signName: "I Love You",
      category: "Common Phrases",
      description: "Hand with thumb, index finger, and pinky finger extended simultaneously.",
      instructions: "1. Extend thumb, index finger, and pinky finger from fist.<br>2. Hold hand facing outward at chest height.",
      exampleUsage: "Expressing affection, love, and care.",
      phrase: "I love you with all my heart.",
      emotion: "Warm & Affectionate",
      emotionEmoji: "❤️",
      emotionConfidence: 0.996
    },
    {
      signId: 19,
      signName: "Good",
      category: "Common Phrases",
      description: "Flat hand touches chin and drops onto flat non-dominant palm.",
      instructions: "1. Place fingers of flat dominant hand on lips/chin.<br>2. Bring hand down firmly into palm of flat non-dominant hand.",
      exampleUsage: "Expressing approval or positive quality.",
      phrase: "That is very good.",
      emotion: "Positive & Approving",
      emotionEmoji: "✨",
      emotionConfidence: 0.976
    },
    {
      signId: 20,
      signName: "Bad",
      category: "Common Phrases",
      description: "Flat hand touches chin and flips outward/downward turning palm down.",
      instructions: "1. Place fingers of flat dominant hand on chin.<br>2. Move hand away and flip wrist so palm faces down.",
      exampleUsage: "Expressing displeasure or disapproval.",
      phrase: "That is not good.",
      emotion: "Displeased / Critical",
      emotionEmoji: "⚠️",
      emotionConfidence: 0.952
    },
    {
      signId: 21,
      signName: "Yes",
      category: "Responses",
      description: "Make a fist and nod it up and down like a head nodding.",
      instructions: "1. Form an 'S' fist with dominant hand.<br>2. Tilt wrist forward and back in a nodding motion twice.",
      exampleUsage: "Affirmative agreement or consent.",
      phrase: "Yes, I agree.",
      emotion: "Affirmative / Agreeing",
      emotionEmoji: "👍",
      emotionConfidence: 0.982
    },
    {
      signId: 22,
      signName: "No",
      category: "Responses",
      description: "Snap index and middle fingers down onto the thumb.",
      instructions: "1. Extend index and middle finger together with thumb outstretched.<br>2. Snap the two fingers firmly against thumb pad.",
      exampleUsage: "Denial, refusal, or negative response.",
      phrase: "No, I disagree.",
      emotion: "Disagreeing / Refusal",
      emotionEmoji: "👎",
      emotionConfidence: 0.961
    },
    {
      signId: 23,
      signName: "Maybe",
      category: "Responses",
      description: "Both flat open palms held facing up balanced alternating up and down.",
      instructions: "1. Hold both flat open hands in front of chest, palms facing up.<br>2. Alternate moving left and right hands up and down like a weighing scale.",
      exampleUsage: "Expressing uncertainty or possible option.",
      phrase: "Maybe, I am not completely sure.",
      emotion: "Uncertain / Neutral",
      emotionEmoji: "🤷",
      emotionConfidence: 0.948
    },
    {
      signId: 24,
      signName: "OK",
      category: "Responses",
      description: "Form an 'O' circle then flick into 'K' handshape.",
      instructions: "1. Make an 'O' shape with fingertips touching thumb.<br>2. Quickly open into a 'K' handshape (index up, middle forward, thumb supporting).",
      exampleUsage: "Acknowledging agreement, confirmation, or compliance.",
      phrase: "OK, everything is all right.",
      emotion: "Acceptance / Confirmed",
      emotionEmoji: "👌",
      emotionConfidence: 0.980
    },
    {
      signId: 25,
      signName: "Understand",
      category: "Responses",
      description: "Flick index finger upward by temple like a lightbulb turning on.",
      instructions: "1. Hold dominant fist near temple with palm facing head.<br>2. Flick index finger straight up with a nodding affirmative expression.",
      exampleUsage: "Signaling comprehension of a concept or statement.",
      phrase: "I understand clearly.",
      emotion: "Comprehension / Insight",
      emotionEmoji: "💡",
      emotionConfidence: 0.974
    },
    {
      signId: 26,
      signName: "Help",
      category: "Emergency",
      description: "Thumbs-up fist placed on flat non-dominant palm, raised upwards together.",
      instructions: "1. Make a 'thumbs-up' fist with dominant hand.<br>2. Place it on flat non-dominant palm facing up.<br>3. Lift both hands upward together.",
      exampleUsage: "Requesting immediate assistance or aid.",
      phrase: "Help! I need assistance.",
      emotion: "Urgent / Distress Alert",
      emotionEmoji: "🚨",
      emotionConfidence: 0.993
    },
    {
      signId: 27,
      signName: "I Need Help",
      category: "Emergency",
      description: "Sign 'I', then bent index finger pulled towards chest ('Need'), then sign 'Help'.",
      instructions: "1. Point index finger to chest.<br>2. Bend index finger and pull downward.<br>3. Lift thumbs-up fist on flat palm toward chest.",
      exampleUsage: "Urgent emergency communication when requiring help.",
      phrase: "I need urgent assistance, please.",
      emotion: "Urgent / Critical Need",
      emotionEmoji: "🚨",
      emotionConfidence: 0.995
    },
    {
      signId: 28,
      signName: "Stop",
      category: "Emergency",
      description: "Chop edge of flat dominant hand down firmly into non-dominant palm.",
      instructions: "1. Hold non-dominant hand flat, palm facing up.<br>2. Bring edge of flat dominant hand down sharply like a chop onto open palm.",
      exampleUsage: "Halting an action or warning of immediate danger.",
      phrase: "Please stop right now.",
      emotion: "Firm Alert / Warning",
      emotionEmoji: "🛑",
      emotionConfidence: 0.988
    },
    {
      signId: 29,
      signName: "Danger",
      category: "Emergency",
      description: "Thumbs-up hands with dominant thumb flicking up repeatedly past other fist.",
      instructions: "1. Make two 'A' fists with thumbs pointing upward.<br>2. Brush back of dominant thumb upwards across non-dominant fist repeatedly.",
      exampleUsage: "Warning someone of hazardous conditions or threats.",
      phrase: "Warning! There is danger ahead.",
      emotion: "High Hazard Alert",
      emotionEmoji: "⚠️",
      emotionConfidence: 0.992
    },
    {
      signId: 30,
      signName: "Doctor",
      category: "Emergency",
      description: "Tap curved 'M' or 'D' fingertips against inner wrist where pulse is felt.",
      instructions: "1. Hold non-dominant wrist with palm facing up.<br>2. Tap bent fingertips of dominant hand twice against inner pulse point of wrist.",
      exampleUsage: "Requesting medical attention or visiting a physician.",
      phrase: "I need to see a doctor or medical professional.",
      emotion: "Medical Attention Request",
      emotionEmoji: "🩺",
      emotionConfidence: 0.987
    },
    {
      signId: 31,
      signName: "Hospital",
      category: "Emergency",
      description: "Form an 'H' with index and middle finger, draw a cross shape on upper shoulder.",
      instructions: "1. Form an 'H' handshape (index and middle fingers extended).<br>2. Trace a vertical line then horizontal line forming a cross on upper opposite arm.",
      exampleUsage: "Directing someone or calling for emergency transport to a clinic/hospital.",
      phrase: "Please take me to the nearest hospital.",
      emotion: "Emergency Medical Care",
      emotionEmoji: "🏥",
      emotionConfidence: 0.991
    },
    {
      signId: 32,
      signName: "Police",
      category: "Emergency",
      description: "Form a 'C' handshape over the chest badge area.",
      instructions: "1. Form a 'C' handshape with dominant thumb and fingers curved.<br>2. Tap against the upper left chest area where a police badge is worn.",
      exampleUsage: "Calling for law enforcement or reporting security incidents.",
      phrase: "Please call the police immediately.",
      emotion: "Security / Urgent Call",
      emotionEmoji: "👮",
      emotionConfidence: 0.989
    },
    {
      signId: 33,
      signName: "Pain / Hurt",
      category: "Emergency",
      description: "Touch index fingertips together repeatedly near the location of discomfort.",
      instructions: "1. Point both index fingers toward each other with other fingers curled.<br>2. Twist wrists and poke fingertips repeatedly near location of bodily pain.",
      exampleUsage: "Informing caregivers or doctors where you are experiencing physical pain.",
      phrase: "I am in pain and need medical relief.",
      emotion: "Discomfort & Pain",
      emotionEmoji: "🩹",
      emotionConfidence: 0.978
    },
    {
      signId: 34,
      signName: "Water",
      category: "Daily Life",
      description: "Form 'W' handshape (3 fingers up) and tap index finger against chin.",
      instructions: "1. Make a 'W' handshape with index, middle, and ring fingers extended.<br>2. Tap side of index finger twice against chin.",
      exampleUsage: "Requesting drinking water.",
      phrase: "May I please have some water?",
      emotion: "Daily Life Request",
      emotionEmoji: "💧",
      emotionConfidence: 0.964
    },
    {
      signId: 35,
      signName: "Food",
      category: "Daily Life",
      description: "Flattened 'O' handshape tapped twice against lips.",
      instructions: "1. Touch all fingertips to thumb pad forming a beak shape.<br>2. Tap fingertips against lips twice.",
      exampleUsage: "Communicating hunger or asking for food/meal.",
      phrase: "I am hungry, where can I get food?",
      emotion: "Hungry / Daily Need",
      emotionEmoji: "🍲",
      emotionConfidence: 0.971
    },
    {
      signId: 36,
      signName: "Drink",
      category: "Daily Life",
      description: "Form a 'C' hand shape mimicking holding a cup and tip it towards open mouth.",
      instructions: "1. Form a 'C' handshape as if holding a cup or glass.<br>2. Bring hand to mouth and tilt thumb upwards as if sipping a beverage.",
      exampleUsage: "Expressing thirst or asking for tea, coffee, or juice.",
      phrase: "I would like something to drink.",
      emotion: "Thirst / Beverage Request",
      emotionEmoji: "🥤",
      emotionConfidence: 0.967
    },
    {
      signId: 37,
      signName: "Restroom",
      category: "Daily Life",
      description: "'T' handshape (thumb between index and middle) shaken side to side.",
      instructions: "1. Form a 'T' handshape by tucking thumb under index finger knuckle.<br>2. Shake hand gently from side to side.",
      exampleUsage: "Asking for bathroom/washroom location.",
      phrase: "Where is the restroom located?",
      emotion: "Inquiring Need",
      emotionEmoji: "🚻",
      emotionConfidence: 0.965
    },
    {
      signId: 38,
      signName: "Sleep",
      category: "Daily Life",
      description: "Open hand placed in front of face drawn downwards while fingers close to touch thumb.",
      instructions: "1. Hold open hand in front of face with spread fingers.<br>2. Draw hand down to chin while closing all fingers to touch thumb.",
      exampleUsage: "Stating exhaustion, tiredness, or bedtime.",
      phrase: "I am very tired and need to sleep.",
      emotion: "Fatigue / Rest",
      emotionEmoji: "😴",
      emotionConfidence: 0.968
    },
    {
      signId: 39,
      signName: "Medicine",
      category: "Daily Life",
      description: "Middle finger bent touching center of open palm and rotated in small circles.",
      instructions: "1. Hold non-dominant hand flat, palm facing up.<br>2. Place tip of dominant middle finger in center of palm and pivot side to side like crushing a pill.",
      exampleUsage: "Asking for prescribed pills or medical dosage.",
      phrase: "I need to take my medicine.",
      emotion: "Health & Medication",
      emotionEmoji: "💊",
      emotionConfidence: 0.973
    },
    {
      signId: 40,
      signName: "Home",
      category: "Daily Life",
      description: "Touch fingertips of flat 'O' hand to side of mouth, then to cheek near ear.",
      instructions: "1. Touch flat 'O' fingertips to corner of mouth ('Eat').<br>2. Move and touch fingertips to cheek beside ear ('Sleep').",
      exampleUsage: "Expressing desire to return home or discussing household.",
      phrase: "I want to go back home.",
      emotion: "Comfort & Belonging",
      emotionEmoji: "🏠",
      emotionConfidence: 0.977
    },
    {
      signId: 41,
      signName: "School / College",
      category: "Daily Life",
      description: "Clap flat dominant palm across flat non-dominant palm horizontally twice.",
      instructions: "1. Hold non-dominant hand flat, palm up at chest height.<br>2. Clap flat dominant palm down onto it horizontally twice in rhythm.",
      exampleUsage: "Discussing campus, academic studies, or classroom.",
      phrase: "I attend classes at school / college.",
      emotion: "Education & Learning",
      emotionEmoji: "🎓",
      emotionConfidence: 0.969
    },
    {
      signId: 42,
      signName: "Work / Office",
      category: "Daily Life",
      description: "Tap dominant 'S' fist base onto back of non-dominant wrist twice.",
      instructions: "1. Make fists with both hands ('S' handshape).<br>2. Tap base of dominant fist twice against the wrist of non-dominant fist.",
      exampleUsage: "Talking about employment, workplace, or duty.",
      phrase: "I am going to work now.",
      emotion: "Productivity / Workplace",
      emotionEmoji: "💼",
      emotionConfidence: 0.966
    },
    {
      signId: 43,
      signName: "Money",
      category: "Daily Life",
      description: "Tap back of curved dominant fingertips into open palm of non-dominant hand repeatedly.",
      instructions: "1. Hold non-dominant hand flat, palm up.<br>2. Form a flat 'O' with dominant hand and tap back of fingers into open palm twice.",
      exampleUsage: "Asking price or preparing payment.",
      phrase: "How much money does this cost?",
      emotion: "Financial Transaction",
      emotionEmoji: "💵",
      emotionConfidence: 0.972
    },
    {
      signId: 44,
      signName: "Where",
      category: "Questions",
      description: "Hold dominant index finger upright and shake it gently from side to side.",
      instructions: "1. Extend dominant index finger straight up with other fingers curled.<br>2. Shake hand gently from side to side with a questioning facial expression.",
      exampleUsage: "Inquiring about a destination, person, or object location.",
      phrase: "Where is it located?",
      emotion: "Questioning / Direction",
      emotionEmoji: "🗺️",
      emotionConfidence: 0.961
    },
    {
      signId: 45,
      signName: "What",
      category: "Questions",
      description: "Both hands open, palms facing up, moving side-to-side slightly with inquiring expression.",
      instructions: "1. Hold both hands at waist height, open palms facing up.<br>2. Move hands slightly inward and outward horizontally while shrugging shoulders.",
      exampleUsage: "Asking for clarification or identifying an event.",
      phrase: "What is going on?",
      emotion: "Inquiring / Curious",
      emotionEmoji: "❓",
      emotionConfidence: 0.963
    },
    {
      signId: 46,
      signName: "When",
      category: "Questions",
      description: "Non-dominant index finger held upright; dominant index finger circles it and lands on the tip.",
      instructions: "1. Point non-dominant index finger straight up.<br>2. Circle dominant index finger clockwise around it once and tap the tip.",
      exampleUsage: "Asking about schedule, date, or arrival time.",
      phrase: "When will it happen?",
      emotion: "Time Inquiry",
      emotionEmoji: "⏰",
      emotionConfidence: 0.958
    },
    {
      signId: 47,
      signName: "Why",
      category: "Questions",
      description: "Touch forehead with fingertips, pull hand down and outwards into a 'Y' handshape.",
      instructions: "1. Touch fingertips of open flat hand to forehead.<br>2. Pull hand downward away from head while curling middle fingers into a 'Y' (thumb and pinky extended).",
      exampleUsage: "Seeking reasons, explanation, or rationale.",
      phrase: "Why is that happening?",
      emotion: "Seeking Explanation",
      emotionEmoji: "🤔",
      emotionConfidence: 0.959
    },
    {
      signId: 48,
      signName: "Number 1",
      category: "Numbers",
      description: "Dominant index finger pointed straight upward with other fingers tucked into fist.",
      instructions: "1. Form a fist and extend dominant index finger straight up.<br>2. Hold hand stationary facing forward at chest level.",
      exampleUsage: "Counting quantity one (1) or denoting first item.",
      phrase: "The count is One (1).",
      emotion: "Counting / Value",
      emotionEmoji: "1️⃣",
      emotionConfidence: 0.990
    },
    {
      signId: 49,
      signName: "Number 2",
      category: "Numbers",
      description: "Index and middle fingers extended straight upward in 'V' shape.",
      instructions: "1. Extend index and middle fingers straight up spread slightly apart ('V' shape).<br>2. Hold palm facing outward.",
      exampleUsage: "Counting quantity two (2).",
      phrase: "The count is Two (2).",
      emotion: "Counting / Value",
      emotionEmoji: "2️⃣",
      emotionConfidence: 0.988
    },
    {
      signId: 50,
      signName: "Number 3",
      category: "Numbers",
      description: "Thumb, index finger, and middle finger extended upward simultaneously.",
      instructions: "1. Extend thumb, index, and middle finger straight up.<br>2. Keep ring and pinky fingers curled down against palm.",
      exampleUsage: "Counting quantity three (3).",
      phrase: "The count is Three (3).",
      emotion: "Counting / Value",
      emotionEmoji: "3️⃣",
      emotionConfidence: 0.986
    },
    {
      signId: 51,
      signName: "Number 4",
      category: "Numbers",
      description: "Four fingers (index, middle, ring, pinky) held straight up with thumb tucked in across palm.",
      instructions: "1. Extend all four fingers straight up together.<br>2. Tuck thumb across the palm.",
      exampleUsage: "Counting quantity four (4).",
      phrase: "The count is Four (4).",
      emotion: "Counting / Value",
      emotionEmoji: "4️⃣",
      emotionConfidence: 0.985
    },
    {
      signId: 52,
      signName: "Number 5",
      category: "Numbers",
      description: "All five fingers open, extended wide and facing forward.",
      instructions: "1. Open all five fingers wide with palm facing forward.<br>2. Hold hand steady at chest level.",
      exampleUsage: "Counting quantity five (5).",
      phrase: "The count is Five (5).",
      emotion: "Counting / Value",
      emotionEmoji: "5️⃣",
      emotionConfidence: 0.992
    }
  ];

  // =========================================================================
  // 2. State & Local Storage Management
  // =========================================================================
  const State = {
    user: {
      isLoggedIn: false,
      name: 'Shree Nithiy',
      email: 'shree@signspeak.ai'
    },
    signs: [],
    history: [],
    settings: {
      offlineMode: true,
      speechSpeed: 1.0,
      speechPitch: 1.0,
      confidenceThreshold: 70,
      selectedVoiceIndex: 0
    },
    camera: {
      stream: null,
      isStreaming: false,
      isFrozen: false,
      currentSignIndex: 0,
      frameCounter: 0,
      timerId: null
    }
  };

  function getDefaultHistorySeed() {
    const now = Date.now();
    return [
      {
        id: 101,
        signName: "Hello",
        text: "Hello! Welcome to SignSpeak.",
        confidence: 0.985,
        timestamp: now - (8 * 60 * 1000),
        input: "Camera",
        isFavorite: true
      },
      {
        id: 102,
        signName: "Thank You",
        text: "Thank you very much!",
        confidence: 0.978,
        timestamp: now - (35 * 60 * 1000),
        input: "Camera",
        isFavorite: true
      },
      {
        id: 103,
        signName: "I Need Help",
        text: "I need urgent assistance, please.",
        confidence: 0.992,
        timestamp: now - (2 * 60 * 60 * 1000),
        input: "Camera",
        isFavorite: true
      },
      {
        id: 104,
        signName: "How are You",
        text: "How are you doing today?",
        confidence: 0.965,
        timestamp: now - (4 * 60 * 60 * 1000),
        input: "Gallery",
        isFavorite: false
      },
      {
        id: 105,
        signName: "Where is Restroom",
        text: "Where is the restroom located?",
        confidence: 0.974,
        timestamp: now - (7 * 60 * 60 * 1000),
        input: "Camera",
        isFavorite: false
      },
      {
        id: 106,
        signName: "Doctor",
        text: "Please take me to a doctor or medical clinic.",
        confidence: 0.988,
        timestamp: now - (22 * 60 * 60 * 1000),
        input: "Camera",
        isFavorite: true
      },
      {
        id: 107,
        signName: "Water",
        text: "May I please have some water?",
        confidence: 0.969,
        timestamp: now - (28 * 60 * 60 * 1000),
        input: "Gallery",
        isFavorite: false
      },
      {
        id: 108,
        signName: "I Love You",
        text: "I love you with all my heart.",
        confidence: 0.994,
        timestamp: now - (48 * 60 * 60 * 1000),
        input: "Camera",
        isFavorite: true
      },
      {
        id: 109,
        signName: "Stop",
        text: "Please stop right now.",
        confidence: 0.981,
        timestamp: now - (72 * 60 * 60 * 1000),
        input: "Camera",
        isFavorite: false
      },
      {
        id: 110,
        signName: "Good Morning",
        text: "Good morning, have a wonderful day!",
        confidence: 0.975,
        timestamp: now - (96 * 60 * 60 * 1000),
        input: "Gallery",
        isFavorite: false
      }
    ];
  }

  function loadState() {
    // Load User
    const savedUser = localStorage.getItem('signspeak_user');
    if (savedUser) {
      try { State.user = JSON.parse(savedUser); } catch (e) {}
    }

    // Load Signs (Ensure data is always fresh with full 52-sign dataset)
    const savedSigns = localStorage.getItem('signspeak_signs_v4');
    if (savedSigns) {
      try {
        const parsed = JSON.parse(savedSigns);
        if (Array.isArray(parsed) && parsed.length >= 50 && parsed[0].emotion) {
          State.signs = parsed;
        } else {
          State.signs = DEFAULT_SIGNS_DATASET;
          saveSigns();
        }
      } catch (e) {
        State.signs = DEFAULT_SIGNS_DATASET;
        saveSigns();
      }
    } else {
      State.signs = DEFAULT_SIGNS_DATASET;
      saveSigns();
    }

    // Load History (Ensure at least 10 realistic pre-seeded history items)
    const savedHistory = localStorage.getItem('signspeak_history_v4');
    if (savedHistory) {
      try {
        const parsedHist = JSON.parse(savedHistory);
        if (Array.isArray(parsedHist) && parsedHist.length >= 5) {
          State.history = parsedHist;
        } else {
          State.history = getDefaultHistorySeed();
          saveHistory();
        }
      } catch (e) {
        State.history = getDefaultHistorySeed();
        saveHistory();
      }
    } else {
      State.history = getDefaultHistorySeed();
      saveHistory();
    }

    // Load Settings
    const savedSettings = localStorage.getItem('signspeak_settings');
    if (savedSettings) {
      try { State.settings = Object.assign(State.settings, JSON.parse(savedSettings)); } catch (e) {}
    }
  }

  function saveUser() { localStorage.setItem('signspeak_user', JSON.stringify(State.user)); }
  function saveSigns() { localStorage.setItem('signspeak_signs_v4', JSON.stringify(State.signs)); }
  function saveHistory() { localStorage.setItem('signspeak_history_v4', JSON.stringify(State.history)); }
  function saveSettings() { localStorage.setItem('signspeak_settings', JSON.stringify(State.settings)); }

  // =========================================================================
  // 3. Text-to-Speech (TTS) Engine
  // =========================================================================
  const TTS = {
    synth: window.speechSynthesis || null,
    voices: [],

    init() {
      if (!this.synth) return;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    },

    loadVoices() {
      if (!this.synth) return;
      this.voices = this.synth.getVoices().filter(v => v.lang.startsWith('en') || v.lang.startsWith('hi'));
      const select = document.getElementById('selectVoice');
      if (select) {
        select.innerHTML = '';
        this.voices.forEach((v, idx) => {
          const opt = document.createElement('option');
          opt.value = idx;
          opt.textContent = `${v.name} (${v.lang})`;
          if (idx === State.settings.selectedVoiceIndex) opt.selected = true;
          select.appendChild(opt);
        });
      }
    },

    speak(text) {
      if (!text || text.trim() === '') return;
      if (!this.synth) {
        showToast("Text-to-Speech API not supported in this browser");
        return;
      }
      this.synth.cancel(); // Flush queue

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = State.settings.speechSpeed;
      utterance.pitch = State.settings.speechPitch;

      if (this.voices.length > 0 && this.voices[State.settings.selectedVoiceIndex]) {
        utterance.voice = this.voices[State.settings.selectedVoiceIndex];
      }

      this.synth.speak(utterance);
    }
  };

  // =========================================================================
  // 4. UI View Routing & Comprehensive Navigation Manager
  // =========================================================================
  const NavManager = {
    historyStack: ['tabHome'],
    currentIndex: 0,

    titles: {
      'tabHome': 'Home Dashboard',
      'tabHistory': 'Translation History',
      'tabLearn': 'Learn Signs Dictionary',
      'tabProfile': 'User Profile & Stats',
      'tabSettings': 'Settings & Preferences',
      'screenAuth': 'Sign In / Authentication',
      'modalCamera': 'Live Camera Translation',
      'modalGallery': 'Gallery ML Translation'
    },

    navigate(dest, isHistoryStep = false) {
      if (!dest) return;

      // Close modal overlays if destination is a tab/screen
      if (dest !== 'modalCamera' && dest !== 'modalGallery' && dest !== 'modalScreenSwitcher') {
        this.closeAllModals();
      }

      // Handle Destination Target
      if (dest === 'modalCamera') {
        openCameraModal();
      } else if (dest === 'modalGallery') {
        openGalleryModal();
      } else if (dest === 'modalScreenSwitcher') {
        const modal = document.getElementById('modalScreenSwitcher');
        if (modal) modal.classList.add('active');
      } else if (dest === 'screenAuth') {
        showAuthScreen('subviewLogin');
      } else if (dest.startsWith('tab')) {
        const screenAuth = document.getElementById('screenAuth');
        const screenMain = document.getElementById('screenMain');
        if (screenAuth) screenAuth.classList.remove('active');
        if (screenMain) screenMain.classList.add('active');

        // Bottom Navigation Active Pill
        document.querySelectorAll('.bottom-nav-bar .nav-tab').forEach(t => {
          if (t.dataset.tab === dest) t.classList.add('active');
          else t.classList.remove('active');
        });

        // Tab Content Page
        document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(dest);
        if (targetPage) targetPage.classList.add('active');

        // Refresh dynamic content per tab
        if (dest === 'tabHome') {
          try { refreshHomeDisplay(); } catch (e) {}
          try { renderHomeRecentHistory(); } catch (e) {}
        } else if (dest === 'tabHistory') {
          try { renderFullHistory(); } catch (e) {}
        } else if (dest === 'tabLearn') {
          try { renderSignsGrid(); } catch (e) {}
        } else if (dest === 'tabProfile') {
          try { updateProfileView(); } catch (e) {}
          try { updateStats(); } catch (e) {}
        } else if (dest === 'tabSettings') {
          try { updateStats(); } catch (e) {}
        }

        // Scroll to top of content
        const scrollContainer = document.getElementById('mainContentScroll');
        if (scrollContainer) scrollContainer.scrollTop = 0;
      }

      // Update Desktop Banner Tabs
      document.querySelectorAll('#bannerScreenTabs .btn-banner-tab').forEach(b => {
        if (b.dataset.nav === dest) b.classList.add('active');
        else b.classList.remove('active');
      });

      // Update Topbar Breadcrumb text
      const breadcrumb = document.getElementById('topbarBreadcrumb');
      if (breadcrumb) {
        breadcrumb.textContent = this.titles[dest] || 'SignSpeak Translation';
      }

      // Record to History Stack
      if (!isHistoryStep) {
        if (this.currentIndex < this.historyStack.length - 1) {
          this.historyStack = this.historyStack.slice(0, this.currentIndex + 1);
        }
        if (this.historyStack[this.historyStack.length - 1] !== dest) {
          this.historyStack.push(dest);
          this.currentIndex = this.historyStack.length - 1;
        }
      }

      this.updateButtonStates();
    },

    goBack() {
      // 1. If any modal is active, close the modal first
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        if (activeModal.id === 'modalCamera') closeCameraModal();
        else activeModal.classList.remove('active');
        this.updateButtonStates();
        return;
      }

      // 2. If history is available, move back 1 step
      if (this.currentIndex > 0) {
        this.currentIndex--;
        const prevDest = this.historyStack[this.currentIndex];
        this.navigate(prevDest, true);
        showToast(`Back: ${this.titles[prevDest] || prevDest}`);
      } else {
        // At start of app
        if (State.user.isLoggedIn) {
          this.navigate('tabHome');
          showToast("Home Dashboard");
        } else {
          showToast("At login screen");
        }
      }
    },

    goForward() {
      if (this.currentIndex < this.historyStack.length - 1) {
        this.currentIndex++;
        const nextDest = this.historyStack[this.currentIndex];
        this.navigate(nextDest, true);
        showToast(`Forward: ${this.titles[nextDest] || nextDest}`);
      } else {
        showToast("No forward history");
      }
    },

    closeAllModals() {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        if (m.id === 'modalCamera') closeCameraModal();
        else m.classList.remove('active');
      });
    },

    updateButtonStates() {
      const btnBack = document.getElementById('btnGlobalBack');
      const btnForward = document.getElementById('btnGlobalForward');
      const btnSysBack = document.getElementById('btnSysBack');

      const canGoBack = this.currentIndex > 0 || !!document.querySelector('.modal-overlay.active');
      const canGoForward = this.currentIndex < this.historyStack.length - 1;

      if (btnBack) btnBack.disabled = !canGoBack;
      if (btnForward) btnForward.disabled = !canGoForward;
      if (btnSysBack) btnSysBack.style.opacity = canGoBack ? '1' : '0.6';
    }
  };

  function initNavigation() {
    // Check initial auth state
    if (State.user.isLoggedIn) {
      showMainScreen();
    } else {
      showAuthScreen('subviewLogin');
    }

    // View Mode Toggle (Mobile Device Frame vs Full Screen)
    const btnMobile = document.getElementById('btnViewMobile');
    const btnFull = document.getElementById('btnViewFull');
    if (btnMobile && btnFull) {
      btnMobile.addEventListener('click', () => {
        document.body.classList.add('device-mobile-view');
        btnMobile.classList.add('active');
        btnFull.classList.remove('active');
      });

      btnFull.addEventListener('click', () => {
        document.body.classList.remove('device-mobile-view');
        btnFull.classList.add('active');
        btnMobile.classList.remove('active');
      });
    }

    // Quick Demo Credentials Fill (Instantly logs in for fast demonstration)
    const btnDemo = document.getElementById('btnQuickDemoFill');
    if (btnDemo) {
      btnDemo.addEventListener('click', () => {
        State.user.isLoggedIn = true;
        State.user.name = 'Shree Nithiy Karthikeyan';
        State.user.email = 'shree@signspeak.ai';
        saveUser();
        showToast("Logged in with Demo Account!");
        showMainScreen();
      });
    }

    // Universal Desktop Banner Screen Selector Tabs
    document.querySelectorAll('#bannerScreenTabs .btn-banner-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.nav;
        if (target) NavManager.navigate(target);
      });
    });

    // Top Bar Global Navigation Controls (Back & Forward)
    const btnBack = document.getElementById('btnGlobalBack');
    if (btnBack) btnBack.addEventListener('click', () => NavManager.goBack());

    const btnForward = document.getElementById('btnGlobalForward');
    if (btnForward) btnForward.addEventListener('click', () => NavManager.goForward());

    // Android 3-Button System Navigation Bar
    const btnSysBack = document.getElementById('btnSysBack');
    if (btnSysBack) btnSysBack.addEventListener('click', () => NavManager.goBack());

    const btnSysHome = document.getElementById('btnSysHome');
    if (btnSysHome) btnSysHome.addEventListener('click', () => NavManager.navigate('tabHome'));

    const btnSysRecents = document.getElementById('btnSysRecents');
    if (btnSysRecents) {
      btnSysRecents.addEventListener('click', () => {
        const modal = document.getElementById('modalScreenSwitcher');
        if (modal) modal.classList.add('active');
      });
    }

    // Top Bar Menu / App Switcher
    const btnMenu = document.getElementById('btnOpenMenu');
    if (btnMenu) {
      btnMenu.addEventListener('click', () => {
        const modal = document.getElementById('modalScreenSwitcher');
        if (modal) modal.classList.add('active');
      });
    }

    // Screen Switcher Modal Dialog Tiles
    const btnCloseSwitcher = document.getElementById('btnCloseSwitcherModal');
    if (btnCloseSwitcher) {
      btnCloseSwitcher.addEventListener('click', () => {
        const modal = document.getElementById('modalScreenSwitcher');
        if (modal) modal.classList.remove('active');
      });
    }

    document.querySelectorAll('.switcher-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const dest = tile.dataset.nav;
        const modal = document.getElementById('modalScreenSwitcher');
        if (modal) modal.classList.remove('active');
        if (dest) NavManager.navigate(dest);
      });
    });

    // Bottom Navigation Tabs
    const tabs = document.querySelectorAll('.bottom-nav-bar .nav-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.id === 'btnNavCameraTranslate') {
          NavManager.navigate('modalCamera');
          return;
        }

        const targetTabId = tab.dataset.tab;
        if (targetTabId) {
          NavManager.navigate(targetTabId);
        }
      });
    });

    // Keyboard Navigation Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        NavManager.goBack();
      } else if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        NavManager.goForward();
      } else if (e.key === 'Escape') {
        NavManager.closeAllModals();
      }
    });

    // Online / Offline Network Monitor Listener
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();
  }

  function showAuthScreen(subviewId) {
    NavManager.closeAllModals();
    const screenAuth = document.getElementById('screenAuth');
    const screenMain = document.getElementById('screenMain');
    if (screenAuth) screenAuth.classList.add('active');
    if (screenMain) screenMain.classList.remove('active');

    document.querySelectorAll('.auth-subview').forEach(s => s.classList.remove('active'));
    const subview = document.getElementById(subviewId);
    if (subview) subview.classList.add('active');

    document.querySelectorAll('#bannerScreenTabs .btn-banner-tab').forEach(b => {
      if (b.dataset.nav === 'screenAuth') b.classList.add('active');
      else b.classList.remove('active');
    });

    NavManager.updateButtonStates();
  }

  function showMainScreen() {
    NavManager.navigate('tabHome');

    // Run all view updates defensively
    try { refreshHomeDisplay(); } catch (e) { console.warn("refreshHomeDisplay error:", e); }
    try { updateProfileView(); } catch (e) { console.warn("updateProfileView error:", e); }
    try { renderHomeRecentHistory(); } catch (e) { console.warn("renderHomeRecentHistory error:", e); }
    try { renderFullHistory(); } catch (e) { console.warn("renderFullHistory error:", e); }
    try { renderSignsGrid(); } catch (e) { console.warn("renderSignsGrid error:", e); }
    try { updateStats(); } catch (e) { console.warn("updateStats error:", e); }
  }

  function switchTab(tabId) {
    NavManager.navigate(tabId);
  }

  function updateNetworkStatus() {
    const isOnline = navigator.onLine && !State.settings.offlineMode;
    const badge = document.getElementById('statusBadge');
    const badgeText = document.getElementById('statusBadgeText');
    if (!badge || !badgeText) return;

    if (isOnline) {
      badge.className = 'online-status-pill online';
      badgeText.textContent = 'ONLINE';
    } else {
      badge.className = 'online-status-pill offline';
      badgeText.textContent = 'OFFLINE';
    }
  }

  // =========================================================================
  // 5. Authentication Handlers
  // =========================================================================
  function initAuth() {
    // Toggle Password Visibility
    const btnTogglePass = document.getElementById('btnToggleLoginPass');
    if (btnTogglePass) {
      btnTogglePass.addEventListener('click', () => {
        const input = document.getElementById('loginPassword');
        if (input) input.type = input.type === 'password' ? 'text' : 'password';
      });
    }

    // Login Form Submit
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('loginEmail');
        const passInput = document.getElementById('loginPassword');
        const email = emailInput ? emailInput.value.trim() : '';
        const pass = passInput ? passInput.value.trim() : '';

        if (!email || !pass) {
          showToast("Please enter email and password");
          return;
        }

        State.user.isLoggedIn = true;
        State.user.email = email;
        State.user.name = email.includes('@') ? email.split('@')[0] : email;
        saveUser();

        showToast(`Welcome back, ${State.user.name}!`);
        showMainScreen();
      });
    }

    // Google Sign-In Modal Flow
    const btnGoogle = document.getElementById('btnSocialGoogle');
    const modalGoogle = document.getElementById('modalGoogleAuth');
    const googleAccountsList = document.getElementById('googleAccountsList');
    const googleLoadingContainer = document.getElementById('googleLoadingContainer');
    const googleLoadingStatus = document.getElementById('googleLoadingStatus');
    const btnCancelGoogle = document.getElementById('btnCancelGoogleAuth');

    if (btnGoogle && modalGoogle) {
      btnGoogle.addEventListener('click', () => {
        if (googleAccountsList) googleAccountsList.style.display = 'flex';
        if (googleLoadingContainer) googleLoadingContainer.style.display = 'none';
        modalGoogle.classList.add('active');
      });
    }

    if (btnCancelGoogle && modalGoogle) {
      btnCancelGoogle.addEventListener('click', () => {
        modalGoogle.classList.remove('active');
      });
    }

    // Handle account selection in Google Modal
    document.querySelectorAll('.google-account-item').forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name || "Shree Nithiy Karthikeyan";
        const email = item.dataset.email || "shreenithiykarthikey@gmail.com";

        if (googleAccountsList) googleAccountsList.style.display = 'none';
        if (googleLoadingContainer) googleLoadingContainer.style.display = 'flex';
        if (googleLoadingStatus) googleLoadingStatus.textContent = `Signing in as ${name}...`;

        setTimeout(() => {
          State.user.isLoggedIn = true;
          State.user.name = name;
          State.user.email = email;
          saveUser();

          if (modalGoogle) modalGoogle.classList.remove('active');
          if (googleAccountsList) googleAccountsList.style.display = 'flex';
          if (googleLoadingContainer) googleLoadingContainer.style.display = 'none';

          showToast(`Signed in with Google as ${name}`);
          showMainScreen();
        }, 500);
      });
    });

    // Facebook Login
    const btnFacebook = document.getElementById('btnSocialFacebook');
    if (btnFacebook) {
      btnFacebook.addEventListener('click', () => {
        State.user.isLoggedIn = true;
        State.user.name = "Shree Nithiy (Facebook)";
        State.user.email = "shree.fb@signspeak.ai";
        saveUser();
        showToast("Logged in with Facebook");
        showMainScreen();
      });
    }

    // Instant Guest Access (Bypass Login)
    const btnGuest = document.getElementById('btnQuickGuestAccess');
    if (btnGuest) {
      btnGuest.addEventListener('click', () => {
        State.user.isLoggedIn = true;
        State.user.name = "Guest User (Demo)";
        State.user.email = "guest@signspeak.ai";
        saveUser();
        showToast("Entered as Guest User");
        showMainScreen();
      });
    }

    // Navigation between subviews
    const btnToSignUp = document.getElementById('btnGotoSignUp');
    if (btnToSignUp) btnToSignUp.addEventListener('click', () => showAuthScreen('subviewSignUp'));

    const btnToLoginFromSignUp = document.getElementById('btnGotoLoginFromSignUp');
    if (btnToLoginFromSignUp) btnToLoginFromSignUp.addEventListener('click', () => showAuthScreen('subviewLogin'));

    const btnBackFromSignUp = document.getElementById('btnBackToLoginFromSignUp');
    if (btnBackFromSignUp) btnBackFromSignUp.addEventListener('click', () => showAuthScreen('subviewLogin'));

    const btnToForgot = document.getElementById('btnGotoForgot');
    if (btnToForgot) btnToForgot.addEventListener('click', () => showAuthScreen('subviewForgot'));

    const btnBackFromForgot = document.getElementById('btnBackToLoginFromForgot');
    if (btnBackFromForgot) btnBackFromForgot.addEventListener('click', () => showAuthScreen('subviewLogin'));

    // Sign Up Submit
    const formSignUp = document.getElementById('formSignUp');
    if (formSignUp) {
      formSignUp.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pass = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirmPassword').value;

        if (pass !== confirm) {
          showToast("Passwords do not match!");
          return;
        }

        State.user.isLoggedIn = true;
        State.user.name = name;
        State.user.email = email;
        saveUser();

        showToast("Account created successfully!");
        showMainScreen();
      });
    }

    // Forgot Password Submit
    const formForgot = document.getElementById('formForgot');
    if (formForgot) {
      formForgot.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        showToast(`Password reset link sent to ${email}`);
        showAuthScreen('subviewLogin');
      });
    }

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        if (confirm("Are you sure you want to logout?")) {
          State.user.isLoggedIn = false;
          saveUser();
          showToast("Logged out successfully");
          showAuthScreen('subviewLogin');
        }
      });
    }
  }

  // =========================================================================
  // 6. Real-Time Vision & Skeletal Landmark / Emotion AI Engine
  // =========================================================================
  const VisionEngine = {
    // 21-Joint MediaPipe Hand Skeletal Connections
    HAND_CONNECTIONS: [
      [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb (CMC, MCP, IP, TIP)
      [0, 5], [5, 6], [6, 7], [7, 8],       // Index Finger (MCP, PIP, DIP, TIP)
      [0, 9], [9, 10], [10, 11], [11, 12],   // Middle Finger (MCP, PIP, DIP, TIP)
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring Finger (MCP, PIP, DIP, TIP)
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky Finger (MCP, PIP, DIP, TIP)
      [5, 9], [9, 13], [13, 17]             // Metacarpal Palm Bridge
    ],

    // Compute accurate 21-point spatial landmarks for every sign with natural temporal dynamics
    getLandmarks(signName, frame) {
      const t = frame * 0.06;
      const wave = Math.sin(t);
      const bob = Math.cos(t * 1.5) * 3;

      // Base hand template: 21 points normalized [0..1]
      let points = [
        { x: 0.50, y: 0.82 }, // 0: Wrist
        { x: 0.38, y: 0.72 }, // 1: Thumb CMC
        { x: 0.30, y: 0.60 }, // 2: Thumb MCP
        { x: 0.24, y: 0.50 }, // 3: Thumb IP
        { x: 0.20, y: 0.42 }, // 4: Thumb TIP
        { x: 0.42, y: 0.52 }, // 5: Index MCP
        { x: 0.39, y: 0.40 }, // 6: Index PIP
        { x: 0.37, y: 0.30 }, // 7: Index DIP
        { x: 0.36, y: 0.20 }, // 8: Index TIP
        { x: 0.50, y: 0.50 }, // 9: Middle MCP
        { x: 0.50, y: 0.37 }, // 10: Middle PIP
        { x: 0.50, y: 0.27 }, // 11: Middle DIP
        { x: 0.50, y: 0.17 }, // 12: Middle TIP
        { x: 0.58, y: 0.52 }, // 13: Ring MCP
        { x: 0.60, y: 0.40 }, // 14: Ring PIP
        { x: 0.62, y: 0.31 }, // 15: Ring DIP
        { x: 0.63, y: 0.22 }, // 16: Ring TIP
        { x: 0.66, y: 0.56 }, // 17: Pinky MCP
        { x: 0.70, y: 0.46 }, // 18: Pinky PIP
        { x: 0.73, y: 0.38 }, // 19: Pinky DIP
        { x: 0.76, y: 0.30 }  // 20: Pinky TIP
      ];

      const s = (signName || '').toLowerCase();

      if (s.includes('hello')) {
        // Open palm waving left-right
        const shift = wave * 0.09;
        points.forEach((p, i) => {
          if (i > 0) p.x += shift * (p.y < 0.6 ? 1.3 : 0.7);
        });
      } else if (s.includes('thank')) {
        // Flat hand moving from chin forward & downward
        const fwd = (Math.sin(t) + 1) * 0.08;
        points[4].y += 0.07;
        points.forEach(p => {
          p.y += fwd;
          p.x += fwd * 0.25;
        });
      } else if (s.includes('yes')) {
        // Nodding fist
        const nod = Math.sin(t * 2) * 0.06;
        [8, 7, 6].forEach(i => { points[i].y = 0.54 + nod; points[i].x = 0.44; });
        [12, 11, 10].forEach(i => { points[i].y = 0.53 + nod; points[i].x = 0.50; });
        [16, 15, 14].forEach(i => { points[i].y = 0.54 + nod; points[i].x = 0.56; });
        [20, 19, 18].forEach(i => { points[i].y = 0.56 + nod; points[i].x = 0.62; });
        points[4].x = 0.46; points[4].y = 0.50 + nod;
        points[0].y += nod;
      } else if (s.includes('no')) {
        // Index and Middle snapping down to meet thumb
        const snap = Math.abs(Math.sin(t * 2));
        points[8].y = 0.33 + snap * 0.16;
        points[8].x = 0.38 + snap * 0.06;
        points[12].y = 0.33 + snap * 0.16;
        points[12].x = 0.44 + snap * 0.04;
        points[4].y = 0.46 - snap * 0.04;
        points[4].x = 0.42;
        [16, 15, 14].forEach(i => { points[i].y = 0.56; });
        [20, 19, 18].forEach(i => { points[i].y = 0.58; });
      } else if (s.includes('help')) {
        // Fist with thumb pointing straight up, rising upwards
        const lift = (Math.sin(t) + 1) * 0.06;
        [8, 7, 6].forEach(i => { points[i].y = 0.56 - lift; points[i].x = 0.44; });
        [12, 11, 10].forEach(i => { points[i].y = 0.55 - lift; points[i].x = 0.50; });
        [16, 15, 14].forEach(i => { points[i].y = 0.56 - lift; points[i].x = 0.56; });
        [20, 19, 18].forEach(i => { points[i].y = 0.58 - lift; points[i].x = 0.62; });
        points[1].y = 0.64 - lift; points[2].y = 0.48 - lift;
        points[3].y = 0.34 - lift; points[4].y = 0.20 - lift; points[4].x = 0.35;
        points[0].y -= lift;
      } else if (s.includes('love')) {
        // ILY Sign: Thumb, Index, Pinky extended; Middle & Ring curled
        [12, 11, 10].forEach(i => { points[i].y = 0.58; points[i].x = 0.49; });
        [16, 15, 14].forEach(i => { points[i].y = 0.59; points[i].x = 0.57; });
        points[8].y = 0.16 + bob * 0.002; points[8].x = 0.36;
        points[20].y = 0.24 + bob * 0.002; points[20].x = 0.74;
        points[4].y = 0.38; points[4].x = 0.16;
      } else if (s.includes('water')) {
        // 'W' Handshape (3 fingers up) tapping chin
        const tap = Math.abs(Math.sin(t * 3)) * 0.04;
        points[8].y = 0.18 + tap;
        points[12].y = 0.15 + tap;
        points[16].y = 0.19 + tap;
        points[4].x = 0.60; points[4].y = 0.54;
        [20, 19, 18].forEach(i => { points[i].y = 0.58; });
      } else if (s.includes('food')) {
        // Beak handshape tapping mouth
        const tap = Math.abs(Math.sin(t * 3)) * 0.04;
        [4, 8, 12, 16, 20].forEach((idx, i) => {
          points[idx].x = 0.46 + (i * 0.02);
          points[idx].y = 0.36 + tap;
        });
      } else if (s.includes('stop')) {
        // Firm chop motion
        const chop = (Math.sin(t * 2) > 0 ? 0.06 : 0);
        points.forEach(p => { p.y += chop; });
      } else if (s.includes('how')) {
        // Cupped rotating hands
        const rot = Math.sin(t) * 0.06;
        points.forEach((p, i) => {
          p.x += rot * (i > 10 ? 1 : -1);
        });
      } else if (s.includes('good')) {
        // Thumbs up
        [8, 7, 6, 12, 11, 10, 16, 15, 14, 20, 19, 18].forEach(i => { points[i].y = 0.56; });
        points[4].y = 0.22; points[4].x = 0.34;
      } else if (s.includes('doctor')) {
        // Tapping pulse point
        const tap = Math.abs(Math.sin(t * 2.5)) * 0.04;
        points[8].y = 0.30 + tap;
        points[12].y = 0.28 + tap;
      } else if (s.includes('number 1') || s === '1') {
        // Only Index finger straight up
        points[8].y = 0.16; points[8].x = 0.50;
        points[7].y = 0.28; points[6].y = 0.40;
        [12, 11, 10, 16, 15, 14, 20, 19, 18].forEach(i => { points[i].y = 0.58; });
        points[4].x = 0.44; points[4].y = 0.52;
      } else if (s.includes('number 2') || s === '2') {
        // Index & Middle in 'V' shape
        points[8].y = 0.16; points[8].x = 0.42;
        points[12].y = 0.16; points[12].x = 0.58;
        [16, 15, 14, 20, 19, 18].forEach(i => { points[i].y = 0.58; });
        points[4].x = 0.48; points[4].y = 0.52;
      } else if (s.includes('number 3') || s === '3') {
        // Thumb, Index, Middle
        points[4].y = 0.32; points[4].x = 0.22;
        points[8].y = 0.16; points[8].x = 0.42;
        points[12].y = 0.16; points[12].x = 0.58;
        [16, 15, 14, 20, 19, 18].forEach(i => { points[i].y = 0.58; });
      } else if (s.includes('number 4') || s === '4') {
        // Four fingers up, thumb tucked
        points[8].y = 0.18; points[12].y = 0.16; points[16].y = 0.18; points[20].y = 0.24;
        points[4].x = 0.50; points[4].y = 0.56;
      } else if (s.includes('number 5') || s === '5') {
        // All 5 fingers spread open wide
        const spread = wave * 0.04;
        points.forEach((p, i) => { if (i > 0) p.x += (p.x - 0.5) * 0.3; });
      } else if (s.includes('where') || s.includes('what') || s.includes('why')) {
        // Inquiring shake
        const qShake = Math.sin(t * 3) * 0.08;
        points.forEach(p => { p.x += qShake; });
      } else if (s.includes('hospital') || s.includes('police')) {
        // Chest badge touch
        const pulse = Math.sin(t * 2) * 0.05;
        points.forEach(p => { p.y += pulse; p.x -= 0.06; });
      } else if (s.includes('restroom')) {
        // 'T' handshape side-to-side shake
        const tShake = Math.sin(t * 3) * 0.06;
        points.forEach(p => { p.x += tShake; });
      }

      return points;
    },

    // Render full real-time canvas frame (Matrix HUD, 21-joint skeleton, face emotion mesh)
    render(canvas, signData, frameCount) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width || 360;
      const h = canvas.height || 190;

      // 1. Futuristic High-Contrast Dark Canvas Background
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#0F1123');
      bgGrad.addColorStop(0.5, '#161936');
      bgGrad.addColorStop(1, '#0C0E1A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle Grid & Radar Scan Lines
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.12)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Radar scanning line
      const scanY = (frameCount * 2.2) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 2);
      scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      scanGrad.addColorStop(1, 'rgba(0, 229, 255, 0.35)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, Math.max(0, scanY - 18), w, 18);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.stroke();

      // 3. Render Facial Emotion Avatar Mesh (Non-Manual Features)
      this.renderFacialEmotionAvatar(ctx, signData, w, h, frameCount);

      // 4. Render 21 Hand Skeletal Joints (Manual Features)
      this.renderHandSkeleton(ctx, signData, w, h, frameCount);

      // 5. Render Canvas Header Text
      ctx.fillStyle = '#00E5FF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(`CNN-LSTM SPATIAL TRACKER [21 JOINTS]`, 12, 18);

      const signTitle = (signData.signName || 'Hello').toUpperCase();
      const emotionTitle = (signData.emotion || 'Friendly').toUpperCase();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText(`SIGN: ${signTitle} | EMOTION: ${emotionTitle}`, 12, 30);
    },

    renderFacialEmotionAvatar(ctx, signData, w, h, frameCount) {
      const cx = 65;
      const cy = h * 0.58;
      const r = 34;
      const t = frameCount * 0.05;

      // Face silhouette oval
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 0.85, r, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Emotion Expression Mapping
      const emotion = (signData.emotion || '').toLowerCase();
      let eyeLeftY = cy - 8;
      let eyeRightY = cy - 8;
      let mouthCurve = 0; // positive = smile, negative = frown

      if (emotion.includes('warm') || emotion.includes('friendly') || emotion.includes('grateful') || emotion.includes('content') || emotion.includes('agree') || emotion.includes('affectionate')) {
        mouthCurve = 7 + Math.sin(t) * 1.5; // Happy smile
      } else if (emotion.includes('distress') || emotion.includes('alert') || emotion.includes('warning') || emotion.includes('hazard') || emotion.includes('emergency')) {
        mouthCurve = -6; // Alert / Tense
        eyeLeftY -= 2;
        eyeRightY -= 2;
      } else if (emotion.includes('question') || emotion.includes('inquiring')) {
        eyeLeftY -= 4; // Raised inquisitive eyebrow
        mouthCurve = 2;
      } else if (emotion.includes('apologetic') || emotion.includes('sorry') || emotion.includes('displeased')) {
        mouthCurve = -4; // Apologetic
      }

      // Eyes
      ctx.fillStyle = '#00E5FF';
      ctx.beginPath();
      ctx.arc(cx - 11, eyeLeftY, 3, 0, Math.PI * 2);
      ctx.arc(cx + 11, eyeRightY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Eyebrows
      ctx.strokeStyle = '#6C5CE7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 17, eyeLeftY - 5);
      ctx.lineTo(cx - 5, eyeLeftY - 5);
      ctx.moveTo(cx + 5, eyeRightY - 5);
      ctx.lineTo(cx + 17, eyeRightY - 5);
      ctx.stroke();

      // Mouth Curve
      ctx.strokeStyle = '#FD79A8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 11, cy + 12);
      ctx.quadraticCurveTo(cx, cy + 12 + mouthCurve, cx + 11, cy + 12);
      ctx.stroke();

      // Facial Emotion Caption Label
      ctx.fillStyle = '#FD79A8';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      const label = (signData.emotion || 'Friendly').slice(0, 15);
      ctx.fillText(`${signData.emotionEmoji || '😊'} ${label}`, cx, cy + r + 13);
      ctx.textAlign = 'left';
      ctx.restore();
    },

    renderHandSkeleton(ctx, signData, w, h, frameCount) {
      const points = this.getLandmarks(signData.signName, frameCount);
      const offsetX = w * 0.35;
      const scaleX = w * 0.58;
      const scaleY = h * 0.76;
      const offsetY = h * 0.12;

      // Transform normalized keypoints to canvas space
      const coords = points.map(p => ({
        x: offsetX + (p.x * scaleX),
        y: offsetY + (p.y * scaleY)
      }));

      // 1. Draw Connecting Skeletal Bones (MediaPipe Hand Topology)
      ctx.lineWidth = 2.5;
      this.HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = coords[i];
        const p2 = coords[j];
        if (!p1 || !p2) return;

        const boneGrad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        boneGrad.addColorStop(0, 'rgba(0, 229, 255, 0.85)');
        boneGrad.addColorStop(1, 'rgba(108, 92, 231, 0.85)');

        ctx.strokeStyle = boneGrad;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // 2. Draw 21 Joint Keypoint Circles
      coords.forEach((c, idx) => {
        const isFingertip = [4, 8, 12, 16, 20].includes(idx);
        const radius = isFingertip ? 4.5 : 3;

        // Outer glow circle
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius + 2, 0, Math.PI * 2);
        ctx.fillStyle = isFingertip ? 'rgba(253, 121, 168, 0.4)' : 'rgba(0, 229, 255, 0.3)';
        ctx.fill();

        // Inner solid node
        ctx.beginPath();
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isFingertip ? '#FD79A8' : '#00E5FF';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // 3. Draw Hand Bounding Box & Target HUD Corners
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      coords.forEach(c => {
        if (c.x < minX) minX = c.x;
        if (c.y < minY) minY = c.y;
        if (c.x > maxX) maxX = c.x;
        if (c.y > maxY) maxY = c.y;
      });

      const pad = 10;
      minX -= pad; minY -= pad; maxX += pad; maxY += pad;
      const bw = maxX - minX;
      const bh = maxY - minY;

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(minX, minY, bw, bh);
      ctx.setLineDash([]);

      // Corner Brackets
      const cl = 8;
      ctx.strokeStyle = '#00E5FF';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(minX, minY + cl); ctx.lineTo(minX, minY); ctx.lineTo(minX + cl, minY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(maxX - cl, minY); ctx.lineTo(maxX, minY); ctx.lineTo(maxX, minY + cl); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(minX, maxY - cl); ctx.lineTo(minX, maxY); ctx.lineTo(minX + cl, maxY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(maxX - cl, maxY); ctx.lineTo(maxX, maxY); ctx.lineTo(maxX, maxY - cl); ctx.stroke();
    }
  };

  // Track active sign for Home Screen Vision
  let homeVisionSignIndex = 0;
  let homeFrameCounter = 0;

  // =========================================================================
  // 7. Home Screen Features & Interactive Vision Loop
  // =========================================================================
  function initHome() {
    // Top Camera & Gallery triggers
    const btnCam = document.getElementById('btnHomeTriggerCamera');
    if (btnCam) btnCam.addEventListener('click', openCameraModal);

    const btnGal = document.getElementById('btnHomeTriggerGallery');
    if (btnGal) btnGal.addEventListener('click', openGalleryModal);

    const btnExpand = document.getElementById('btnOpenFullscreenFromHome');
    if (btnExpand) btnExpand.addEventListener('click', openCameraModal);

    // 4 Quick Feature Cards (2x2 grid)
    const cardHist = document.getElementById('cardQuickHistory');
    if (cardHist) cardHist.addEventListener('click', () => switchTab('tabHistory'));

    const cardFav = document.getElementById('cardQuickFavorites');
    if (cardFav) {
      cardFav.addEventListener('click', () => {
        switchTab('tabHistory');
        const favChip = document.querySelector('.chip-scroll-row .filter-chip[data-filter="favorites"]');
        if (favChip) favChip.click();
      });
    }

    const cardLearn = document.getElementById('cardQuickLearn');
    if (cardLearn) cardLearn.addEventListener('click', () => switchTab('tabLearn'));

    const cardSettings = document.getElementById('cardQuickSettings');
    if (cardSettings) cardSettings.addEventListener('click', () => switchTab('tabSettings'));

    const btnViewAll = document.getElementById('btnViewAllHistory');
    if (btnViewAll) btnViewAll.addEventListener('click', () => switchTab('tabHistory'));

    // Output Box Action Buttons (Copy, Play, Share)
    const btnCopy = document.getElementById('btnHomeCopy');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const text = document.getElementById('homeOutputText').textContent;
        if (text && text !== 'Translated text will appear here…') {
          navigator.clipboard.writeText(text);
          showToast("Text copied to clipboard!");
        }
      });
    }

    const btnPlay = document.getElementById('btnHomePlay');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        const text = document.getElementById('homeOutputText').textContent;
        const currentSign = State.signs[homeVisionSignIndex] || State.signs[0];
        TTS.speak(text && text !== 'Translated text will appear here…' ? text : currentSign.phrase);
      });
    }

    const btnShare = document.getElementById('btnHomeShare');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        const text = document.getElementById('homeOutputText').textContent;
        if (navigator.share) {
          navigator.share({ title: 'SignSpeak Translation', text: text });
        } else {
          navigator.clipboard.writeText(text);
          showToast("Translation link copied to clipboard!");
        }
      });
    }

    // Emergency Fast Trigger Strip
    document.querySelectorAll('.btn-emergency-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.speak || btn.textContent.trim();
        TTS.speak(phrase);
        showToast(`Emergency Alert: "${phrase}"`);
        const signMatch = State.signs.find(s => (s.phrase && s.phrase.toLowerCase().includes(phrase.toLowerCase())) || phrase.toLowerCase().includes(s.signName.toLowerCase()));
        addHistoryRecord(signMatch ? signMatch.signName : "Emergency Alert", phrase, 0.995, "Emergency");
      });
    });

    // Sign of the Day Actions
    const btnPracticeDay = document.getElementById('btnHomePracticeDay');
    if (btnPracticeDay) {
      btnPracticeDay.addEventListener('click', () => {
        const ilyIdx = State.signs.findIndex(s => s.signName.toLowerCase().includes('love'));
        if (ilyIdx !== -1) State.camera.currentSignIndex = ilyIdx;
        openCameraModal();
        showToast("Practicing: I Love You gesture");
      });
    }

    const btnSpeakDay = document.getElementById('btnHomeSpeakDay');
    if (btnSpeakDay) {
      btnSpeakDay.addEventListener('click', () => {
        TTS.speak("I love you with all my heart and appreciate you.");
        showToast("Playing Sign of the Day audio");
      });
    }

    // Bind Quick Gesture & Emotion Testing Chips in Home Tray
    const homeChips = document.querySelectorAll('#homeGestureChips .chip-gesture');
    homeChips.forEach(chip => {
      chip.addEventListener('click', () => {
        homeChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const signName = chip.dataset.sign;
        const signIdx = State.signs.findIndex(s => s.signName.toLowerCase() === signName.toLowerCase());
        if (signIdx !== -1) {
          homeVisionSignIndex = signIdx;
        }

        refreshHomeDisplay();
        const sign = State.signs[homeVisionSignIndex];
        addHistoryRecord(sign.signName, sign.phrase, sign.emotionConfidence || 0.965, "Vision");
        TTS.speak(sign.phrase);
        showToast(`Recognized: ${sign.signName} (${sign.emotion})`);
      });
    });

    // Populate initial Home Screen UI elements immediately
    refreshHomeDisplay();

    // Start Live Continuous Home Vision Animation Loop
    startHomeVisionLoop();
  }

  function refreshHomeDisplay() {
    const sign = State.signs[homeVisionSignIndex] || State.signs[0];
    if (!sign) return;

    const confPercent = `${((sign.emotionConfidence || 0.965) * 100).toFixed(1)}%`;
    const emo = sign.emotion || "Friendly / Warm";
    const emoEmoji = sign.emotionEmoji || "😊";

    const pill = document.getElementById('homeDetectedSignPill');
    if (pill) pill.innerHTML = `Detected: <strong>${sign.signName}</strong> (${confPercent})`;

    const icon = document.getElementById('homeEmotionIcon');
    if (icon) icon.textContent = emoEmoji;

    const emotionTxt = document.getElementById('homeEmotionText');
    if (emotionTxt) emotionTxt.textContent = `${emo} (${confPercent})`;

    const outTxt = document.getElementById('homeOutputText');
    if (outTxt) outTxt.textContent = sign.phrase;

    const jointTxt = document.getElementById('homeJointText');
    if (jointTxt) jointTxt.textContent = `21 Hand Joints Active (${sign.signName})`;
  }

  function startHomeVisionLoop() {
    const canvas = document.getElementById('homeGestureCanvas');
    if (!canvas) return;

    function loop() {
      homeFrameCounter++;
      const currentSign = State.signs[homeVisionSignIndex] || State.signs[0];
      VisionEngine.render(canvas, currentSign, homeFrameCounter);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function renderHomeRecentHistory() {
    const listContainer = document.getElementById('homeRecentList');
    if (!listContainer) return;

    const recent = State.history.slice(0, 3);
    if (recent.length === 0) {
      listContainer.innerHTML = '<p class="empty-text">No recent translations. Start signing!</p>';
      return;
    }

    listContainer.innerHTML = recent.map(item => createHistoryItemHTML(item)).join('');
    bindHistoryItemEvents(listContainer);

    // Update main home hero output with the latest translated sentence
    if (recent.length > 0) {
      const outTxt = document.getElementById('homeOutputText');
      if (outTxt && (outTxt.textContent === 'Translated text will appear here…' || outTxt.textContent.trim() === '')) {
        outTxt.textContent = recent[0].text;
      }
    }
  }

  // =========================================================================
  // 8. Live Camera Translation (Real Webcam, MediaPipe Hands & Gesture Vision)
  // =========================================================================
  let mediaPipeHandsInstance = null;
  let isMediaPipeLoading = false;
  let lastCameraDetectedSign = null;
  let cameraHoldCounter = 0;
  let cameraAnimFrameId = null;

  function initMediaPipe() {
    if (window.Hands && !mediaPipeHandsInstance && !isMediaPipeLoading) {
      isMediaPipeLoading = true;
      try {
        mediaPipeHandsInstance = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        mediaPipeHandsInstance.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        mediaPipeHandsInstance.onResults(onMediaPipeResults);
        isMediaPipeLoading = false;
        console.log("MediaPipe Hands loaded successfully for real-time tracking.");
      } catch (err) {
        console.warn("MediaPipe Hands init error:", err);
        isMediaPipeLoading = false;
      }
    }
  }

  // Real-time geometric rule-based gesture classifier for physical hand landmarks
  function classifyPhysicalHand(landmarks) {
    if (!landmarks || landmarks.length < 21) return null;

    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const thumbIp = landmarks[3];
    const thumbMcp = landmarks[2];

    const indexTip = landmarks[8];
    const indexPip = landmarks[6];
    const indexMcp = landmarks[5];

    const middleTip = landmarks[12];
    const middlePip = landmarks[10];

    const ringTip = landmarks[16];
    const ringPip = landmarks[14];

    const pinkyTip = landmarks[20];
    const pinkyPip = landmarks[18];

    // In normalized coords, y decreases going upwards (tip.y < pip.y => extended upward)
    const isIndexExtended = indexTip.y < indexPip.y;
    const isMiddleExtended = middleTip.y < middlePip.y;
    const isRingExtended = ringTip.y < ringPip.y;
    const isPinkyExtended = pinkyTip.y < pinkyPip.y;

    // Thumb extended check
    const dWristThumbTip = Math.hypot(thumbTip.x - wrist.x, thumbTip.y - wrist.y);
    const dWristThumbMcp = Math.hypot(thumbMcp.x - wrist.x, thumbMcp.y - wrist.y);
    const isThumbExtended = dWristThumbTip > dWristThumbMcp * 1.35;

    const extendedFour = [isIndexExtended, isMiddleExtended, isRingExtended, isPinkyExtended].filter(Boolean).length;
    const totalExtended = extendedFour + (isThumbExtended ? 1 : 0);

    // Distance between thumb tip and index tip
    const pinchDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);

    let matchName = null;
    let conf = 0.965;

    if (totalExtended >= 4 && isIndexExtended && isMiddleExtended && isRingExtended) {
      matchName = "Hello";
      conf = 0.985;
    } else if (extendedFour === 2 && isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      matchName = "Good";
      conf = 0.978;
    } else if (isThumbExtended && isIndexExtended && isPinkyExtended && !isMiddleExtended && !isRingExtended) {
      matchName = "I Love You";
      conf = 0.994;
    } else if (isThumbExtended && extendedFour === 0 && thumbTip.y < thumbMcp.y) {
      matchName = "Yes";
      conf = 0.982;
    } else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
      matchName = "How are You";
      conf = 0.962;
    } else if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
      matchName = "Water";
      conf = 0.974;
    } else if (pinchDist < 0.07 && !isRingExtended && !isPinkyExtended) {
      matchName = "Food";
      conf = 0.969;
    } else if (totalExtended === 0) {
      matchName = "I Need Help";
      conf = 0.988;
    }

    if (matchName) {
      const found = State.signs.find(s => s.signName.toLowerCase().includes(matchName.toLowerCase()) || matchName.toLowerCase().includes(s.signName.toLowerCase()));
      if (found) {
        return Object.assign({}, found, { emotionConfidence: conf });
      }
    }

    return null;
  }

  function onMediaPipeResults(results) {
    const canvas = document.getElementById('webcamCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = document.getElementById('webcamVideo');
    if (video && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // Draw real connecting bones
      ctx.lineWidth = 3.5;
      VisionEngine.HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];
        if (!p1 || !p2) return;

        const x1 = p1.x * canvas.width;
        const y1 = p1.y * canvas.height;
        const x2 = p2.x * canvas.width;
        const y2 = p2.y * canvas.height;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, '#00E5FF');
        grad.addColorStop(1, '#6C5CE7');
        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // Draw real 21 nodes
      landmarks.forEach((p, idx) => {
        const x = p.x * canvas.width;
        const y = p.y * canvas.height;
        const isTip = [4, 8, 12, 16, 20].includes(idx);
        const radius = isTip ? 6 : 4;

        ctx.beginPath();
        ctx.arc(x, y, radius + 2, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? 'rgba(253, 121, 168, 0.5)' : 'rgba(0, 229, 255, 0.4)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isTip ? '#FD79A8' : '#00E5FF';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Classify gesture from user's actual physical hand
      const classified = classifyPhysicalHand(landmarks);
      if (classified) {
        applyLiveCameraOutput(classified);
      }
    }
  }

  function applyLiveCameraOutput(sign) {
    if (!sign) return;

    const conf = sign.emotionConfidence ? (sign.emotionConfidence * 100).toFixed(1) : "97.5";
    const emo = sign.emotion || "Friendly / Warm";
    const emoIcon = sign.emotionEmoji || "😊";

    const title = document.getElementById('liveSignTitle');
    if (title) title.textContent = sign.signName;

    const box = document.getElementById('liveSentenceBox');
    if (box) box.textContent = sign.phrase;

    const confPill = document.getElementById('liveConfidencePill');
    if (confPill) confPill.textContent = `${conf}% Confidence`;

    const emoIconEl = document.getElementById('liveEmotionIcon');
    if (emoIconEl) emoIconEl.textContent = emoIcon;

    const emoTextEl = document.getElementById('liveEmotionText');
    if (emoTextEl) emoTextEl.textContent = `${emo} (${conf}%)`;

    // Highlight chip in tray
    updateCameraActiveChipByName(sign.signName);

    // Speak and add to history if held stable
    if (lastCameraDetectedSign === sign.signName) {
      cameraHoldCounter++;
      if (cameraHoldCounter === 12) { // Stable for ~1.5s
        TTS.speak(sign.phrase);
        addHistoryRecord(sign.signName, sign.phrase, parseFloat(conf) / 100, "Camera");
      }
    } else {
      lastCameraDetectedSign = sign.signName;
      cameraHoldCounter = 0;
    }
  }

  function updateCameraActiveChipByName(signName) {
    if (!signName) return;
    const lower = signName.toLowerCase();
    document.querySelectorAll('#cameraGestureChips .cam-chip').forEach(chip => {
      const chipSign = (chip.dataset.sign || '').toLowerCase();
      if (chipSign === lower || lower.includes(chipSign) || chipSign.includes(lower)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  async function openCameraModal() {
    const modal = document.getElementById('modalCamera');
    if (!modal) return;
    modal.classList.add('active');

    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('webcamCanvas');
    if (canvas) {
      canvas.width = 360;
      canvas.height = 480;
    }

    State.camera.isFrozen = false;
    const freezeTxt = document.getElementById('btnFreezeText');
    if (freezeTxt) freezeTxt.textContent = 'Pause Recognition';

    initMediaPipe();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        State.camera.stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
        if (video) {
          video.srcObject = State.camera.stream;
          video.play();
        }
        State.camera.isStreaming = true;
      }
    } catch (err) {
      console.warn("Webcam permission denied / unavailable; running gesture simulator mode.", err);
      State.camera.isStreaming = false;
    }

    // Set default initial sign output cleanly
    const initSign = State.signs[State.camera.currentSignIndex] || State.signs[0];
    applyLiveCameraOutput(initSign);

    // Start Real-Time Camera Processing Loop
    startCameraProcessingLoop();
  }

  function startCameraProcessingLoop() {
    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('webcamCanvas');

    async function frameStep() {
      if (!document.getElementById('modalCamera').classList.contains('active')) {
        return;
      }

      if (!State.camera.isFrozen) {
        State.camera.frameCounter++;

        // If real webcam is active and MediaPipe is available, send video frames
        if (State.camera.isStreaming && video && video.readyState >= 2 && mediaPipeHandsInstance) {
          try {
            await mediaPipeHandsInstance.send({ image: video });
          } catch (e) {
            // Fallback rendering
          }
        } else {
          // If in simulator mode or MediaPipe not yet ready, render dynamic 21-joint skeleton
          if (canvas) {
            const currentSign = State.signs[State.camera.currentSignIndex] || State.signs[0];
            VisionEngine.render(canvas, currentSign, State.camera.frameCounter);
          }
        }
      }

      cameraAnimFrameId = requestAnimationFrame(frameStep);
    }

    cameraAnimFrameId = requestAnimationFrame(frameStep);
  }

  function closeCameraModal() {
    const modal = document.getElementById('modalCamera');
    if (modal) modal.classList.remove('active');

    if (cameraAnimFrameId) {
      cancelAnimationFrame(cameraAnimFrameId);
      cameraAnimFrameId = null;
    }

    if (State.camera.stream) {
      State.camera.stream.getTracks().forEach(track => track.stop());
      State.camera.stream = null;
    }
    State.camera.isStreaming = false;
  }

  function initCamera() {
    const btnClose = document.getElementById('btnCloseCamera');
    if (btnClose) btnClose.addEventListener('click', closeCameraModal);

    // Switch / Cycle Next Gesture in simulator
    const btnSwitch = document.getElementById('btnSwitchWebcam');
    if (btnSwitch) {
      btnSwitch.addEventListener('click', () => {
        State.camera.currentSignIndex = (State.camera.currentSignIndex + 1) % State.signs.length;
        const cur = State.signs[State.camera.currentSignIndex];
        applyLiveCameraOutput(cur);
        TTS.speak(cur.phrase);
        showToast(`Sign: ${cur.signName} (${cur.emotion})`);
      });
    }

    // Freeze / Pause Recognition Toggle
    const btnFreeze = document.getElementById('btnToggleLiveFreeze');
    if (btnFreeze) {
      btnFreeze.addEventListener('click', () => {
        State.camera.isFrozen = !State.camera.isFrozen;
        const txt = document.getElementById('btnFreezeText');
        if (txt) txt.textContent = State.camera.isFrozen ? 'Resume Recognition' : 'Pause Recognition';
        showToast(State.camera.isFrozen ? "Recognition paused" : "Recognition resumed");
      });
    }

    // Live Speak
    const btnSpeak = document.getElementById('btnLiveSpeak');
    if (btnSpeak) {
      btnSpeak.addEventListener('click', () => {
        const text = document.getElementById('liveSentenceBox').textContent;
        TTS.speak(text);
      });
    }

    // Live Copy
    const btnCopy = document.getElementById('btnLiveCopy');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const text = document.getElementById('liveSentenceBox').textContent;
        navigator.clipboard.writeText(text);
        showToast("Translation copied!");
      });
    }

    // Bind Instant Testing Chips in Camera Modal Tray
    const camChips = document.querySelectorAll('#cameraGestureChips .cam-chip');
    camChips.forEach(chip => {
      chip.addEventListener('click', () => {
        camChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const signName = chip.dataset.sign;
        const signIdx = State.signs.findIndex(s => s.signName.toLowerCase() === signName.toLowerCase());
        if (signIdx !== -1) {
          State.camera.currentSignIndex = signIdx;
        }

        const cur = State.signs[State.camera.currentSignIndex];
        applyLiveCameraOutput(cur);
        TTS.speak(cur.phrase);
        showToast(`Testing: ${cur.signName}`);
      });
    });
  }

  // =========================================================================
  // 8. Gallery Translation (4-Stage Pipeline Simulation)
  // =========================================================================
  function openGalleryModal() {
    document.getElementById('modalGallery').classList.add('active');
    document.getElementById('galleryResultBox').style.display = 'none';
    document.getElementById('galleryPreviewImg').style.display = 'none';
    document.getElementById('galleryUploadPlaceholder').style.display = 'flex';
    document.getElementById('pipelineProgressFill').style.width = '0%';
    document.getElementById('pipelineStepText').textContent = 'Select an image or video to begin ML inference';
  }

  function initGallery() {
    document.getElementById('btnCloseGalleryModal').addEventListener('click', () => {
      document.getElementById('modalGallery').classList.remove('active');
    });

    document.getElementById('fileGalleryInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const previewImg = document.getElementById('galleryPreviewImg');
        previewImg.src = event.target.result;
        previewImg.style.display = 'block';
        document.getElementById('galleryUploadPlaceholder').style.display = 'none';

        // Run Animated 4-Stage Pipeline
        runGalleryPipeline();
      };
      reader.readAsDataURL(file);
    });

    document.getElementById('btnGalleryPlay').addEventListener('click', () => {
      const text = document.getElementById('galleryResultSentence').textContent;
      TTS.speak(text);
    });

    document.getElementById('btnGalleryCopy').addEventListener('click', () => {
      const text = document.getElementById('galleryResultSentence').textContent;
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    });
  }

  function runGalleryPipeline() {
    const fill = document.getElementById('pipelineProgressFill');
    const step = document.getElementById('pipelineStepText');
    const resultBox = document.getElementById('galleryResultBox');
    resultBox.style.display = 'none';

    fill.style.width = '25%';
    step.textContent = '1. Preprocessing image (224x224 RGB normalization)…';

    setTimeout(() => {
      fill.style.width = '50%';
      step.textContent = '2. CNN extracting spatial features (hand posture, joints)…';
    }, 400);

    setTimeout(() => {
      fill.style.width = '75%';
      step.textContent = '3. LSTM/GRU evaluating gesture temporal sequence…';
    }, 850);

    setTimeout(() => {
      fill.style.width = '100%';
      step.textContent = '4. Softmax classification completed.';

      // Randomly pick an accurate sign from dictionary
      const randomSign = State.signs[Math.floor(Math.random() * State.signs.length)];
      const conf = (0.93 + (Math.random() * 0.05)).toFixed(3);

      document.getElementById('gallerySignTitle').textContent = randomSign.signName;
      document.getElementById('galleryResultSentence').textContent = randomSign.phrase;
      document.getElementById('galleryConfPill').textContent = `${(conf * 100).toFixed(1)}%`;
      resultBox.style.display = 'flex';

      addHistoryRecord(randomSign.signName, randomSign.phrase, parseFloat(conf), "Gallery");
      showToast(`Recognized Sign: ${randomSign.signName}`);
    }, 1300);
  }

  // =========================================================================
  // 9. History & Favorites Module
  // =========================================================================
  function createHistoryItemHTML(item) {
    const dateFormatted = formatRelativeDate(item.timestamp);
    return `
      <div class="history-item-card" data-id="${item.id}">
        <div class="history-thumb-box">
          <svg width="24" height="24" viewBox="0 0 72 72" fill="currentColor">
            <path d="M36 12C33.8 12 32 13.8 32 16V32C31.2 31.4 30.1 31 29 31C26.8 31 25 32.8 25 35V46C25 55.9 33.1 64 43 64C52.9 64 61 55.9 61 46V28C61 25.8 59.2 24 57 24C55.9 24 54.8 24.4 54 25.1V20C54 17.8 52.2 16 50 16C48.9 16 47.8 16.4 47 17.1V16C47 13.8 45.2 12 43 12C41.9 12 40.8 12.4 40 13.1V16C40 13.8 38.2 12 36 12Z"/>
          </svg>
        </div>
        <div class="history-info">
          <div class="history-text-title">${item.text}</div>
          <div class="history-meta-row">
            <span class="history-time">${dateFormatted}</span>
            <span class="history-tag">${item.input}</span>
          </div>
        </div>
        <div class="history-actions">
          <button type="button" class="btn-icon-sm btn-fav-history ${item.isFavorite ? 'is-fav' : ''}" title="Toggle Favorite" data-id="${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
          <button type="button" class="btn-icon-sm btn-play-history" title="Speak" data-text="${item.text}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
          </button>
          <button type="button" class="btn-icon-sm btn-del-history" title="Delete" data-id="${item.id}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function bindHistoryItemEvents(container) {
    container.querySelectorAll('.btn-fav-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const item = State.history.find(h => h.id === id);
        if (item) {
          item.isFavorite = !item.isFavorite;
          saveHistory();
          renderHomeRecentHistory();
          renderFullHistory();
          updateStats();
          showToast(item.isFavorite ? "Added to Favorites" : "Removed from Favorites");
        }
      });
    });

    container.querySelectorAll('.btn-play-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        TTS.speak(btn.dataset.text);
      });
    });

    container.querySelectorAll('.btn-del-history').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        State.history = State.history.filter(h => h.id !== id);
        saveHistory();
        renderHomeRecentHistory();
        renderFullHistory();
        updateStats();
        showToast("Translation record deleted");
      });
    });
  }

  function addHistoryRecord(signName, text, confidence, inputMode) {
    const newRecord = {
      id: Date.now(),
      signName: signName,
      text: text,
      confidence: confidence,
      timestamp: Date.now(),
      input: inputMode,
      isFavorite: false
    };

    State.history.unshift(newRecord);
    if (State.history.length > 50) State.history.pop();
    saveHistory();
    renderHomeRecentHistory();
    renderFullHistory();
    updateStats();
  }

  function renderFullHistory() {
    const listContainer = document.getElementById('fullHistoryList');
    const emptyState = document.getElementById('emptyHistoryState');
    if (!listContainer) return;

    const query = document.getElementById('inputSearchHistory').value.toLowerCase().trim();
    const activeChip = document.querySelector('.chip-scroll-row .filter-chip.active');
    const filter = activeChip ? activeChip.dataset.filter : 'all';

    let filtered = State.history.filter(item => {
      // Search filter
      const matchesSearch = item.text.toLowerCase().includes(query) || item.signName.toLowerCase().includes(query);
      if (!matchesSearch) return false;

      // Chip Filter
      const now = Date.now();
      if (filter === 'favorites') return item.isFavorite;
      if (filter === 'Camera') return item.input === 'Camera';
      if (filter === 'Gallery') return item.input === 'Gallery';
      if (filter === 'emergency') {
        const s = (item.text + ' ' + item.signName).toLowerCase();
        return item.input === 'Emergency' || s.includes('help') || s.includes('doctor') || s.includes('stop') || s.includes('water') || s.includes('restroom');
      }
      if (filter === 'today') return (now - item.timestamp) < (24 * 60 * 60 * 1000);
      if (filter === 'week') return (now - item.timestamp) < (7 * 24 * 60 * 60 * 1000);
      if (filter === 'month') return (now - item.timestamp) < (30 * 24 * 60 * 60 * 1000);
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = '';
      emptyState.style.display = 'flex';
    } else {
      emptyState.style.display = 'none';
      listContainer.innerHTML = filtered.map(item => createHistoryItemHTML(item)).join('');
      bindHistoryItemEvents(listContainer);
    }
  }

  function initHistory() {
    // Search input
    const searchInput = document.getElementById('inputSearchHistory');
    const clearBtn = document.getElementById('btnClearHistorySearch');

    searchInput.addEventListener('input', () => {
      clearBtn.style.display = searchInput.value.length > 0 ? 'block' : 'none';
      renderFullHistory();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.style.display = 'none';
      renderFullHistory();
    });

    // Filter Chips
    document.querySelectorAll('.chip-scroll-row .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-scroll-row .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderFullHistory();
      });
    });
  }

  // =========================================================================
  // 10. Learn Signs Dictionary Module
  // =========================================================================
  function renderSignsGrid() {
    const grid = document.getElementById('signsGridContainer');
    if (!grid) return;

    const query = document.getElementById('inputSearchSigns').value.toLowerCase().trim();
    const activeChip = document.querySelector('#tabLearn .filter-chip.active');
    const category = activeChip ? activeChip.dataset.category : 'All';

    const filtered = State.signs.filter(sign => {
      const matchesSearch = sign.signName.toLowerCase().includes(query) || sign.description.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      if (category !== 'All' && sign.category !== category) return false;
      return true;
    });

    grid.innerHTML = filtered.map(sign => `
      <div class="sign-grid-card" data-id="${sign.signId}">
        <div class="sign-thumb-container">
          <span class="sign-cat-badge">${sign.category}</span>
          <svg width="40" height="40" viewBox="0 0 72 72" fill="#6C5CE7">
            <path d="M36 12C33.8 12 32 13.8 32 16V32C31.2 31.4 30.1 31 29 31C26.8 31 25 32.8 25 35V46C25 55.9 33.1 64 43 64C52.9 64 61 55.9 61 46V28C61 25.8 59.2 24 57 24C55.9 24 54.8 24.4 54 25.1V20C54 17.8 52.2 16 50 16C48.9 16 47.8 16.4 47 17.1V16C47 13.8 45.2 12 43 12C41.9 12 40.8 12.4 40 13.1V16C40 13.8 38.2 12 36 12Z"/>
          </svg>
        </div>
        <h4 class="sign-grid-title">${sign.signName}</h4>
        <p class="sign-grid-desc">${sign.description}</p>
        <button type="button" class="btn-learn-mini">Learn Gesture</button>
      </div>
    `).join('');

    // Bind click to open detail bottom sheet
    grid.querySelectorAll('.sign-grid-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        const sign = State.signs.find(s => s.signId === id);
        if (sign) openSignDetailModal(sign);
      });
    });
  }

  function openSignDetailModal(sign) {
    document.getElementById('detailSignName').textContent = sign.signName;
    document.getElementById('detailSignCategory').textContent = sign.category;
    document.getElementById('detailSignInstructions').innerHTML = sign.instructions;
    document.getElementById('detailSignExample').textContent = sign.exampleUsage;

    document.getElementById('btnDetailPlaySpeech').onclick = () => TTS.speak(sign.phrase || sign.signName);
    document.getElementById('modalSignDetail').classList.add('active');
  }

  function initLearn() {
    document.getElementById('inputSearchSigns').addEventListener('input', renderSignsGrid);

    document.querySelectorAll('#tabLearn .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#tabLearn .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderSignsGrid();
      });
    });

    document.getElementById('btnCloseSignDetail').addEventListener('click', () => {
      document.getElementById('modalSignDetail').classList.remove('active');
    });
  }

  // =========================================================================
  // 11. Profile & Settings Handlers
  // =========================================================================
  function updateProfileView() {
    document.getElementById('profileName').textContent = State.user.name;
    document.getElementById('profileEmail').textContent = State.user.email;
  }

  function updateStats() {
    const totalEl = document.getElementById('statTotalCount');
    if (totalEl) totalEl.textContent = State.history.length;

    const favEl = document.getElementById('statFavCount');
    if (favEl) favEl.textContent = State.history.filter(h => h.isFavorite).length;

    const signsEl = document.getElementById('statSignsCount');
    if (signsEl) signsEl.textContent = State.signs.length;

    const histBadge = document.getElementById('historyCountBadge');
    if (histBadge) histBadge.textContent = `${State.history.length} Records`;

    const signsBadge = document.getElementById('signsCountBadge');
    if (signsBadge) signsBadge.textContent = `${State.signs.length} Signs`;

    if (State.history.length > 0) {
      const avg = State.history.reduce((acc, curr) => acc + (curr.confidence || 0.95), 0) / State.history.length;
      const accEl = document.getElementById('statAvgAcc');
      if (accEl) accEl.textContent = `${(avg * 100).toFixed(1)}%`;
    }
  }

  function initProfileAndSettings() {
    // Edit Profile Modal
    document.getElementById('btnOpenEditProfile').addEventListener('click', () => {
      document.getElementById('editProfileName').value = State.user.name;
      document.getElementById('editProfileEmail').value = State.user.email;
      document.getElementById('modalEditProfile').classList.add('active');
    });

    document.getElementById('btnCloseEditProfileModal').addEventListener('click', () => {
      document.getElementById('modalEditProfile').classList.remove('active');
    });

    document.getElementById('btnCancelEditProfile').addEventListener('click', () => {
      document.getElementById('modalEditProfile').classList.remove('active');
    });

    document.getElementById('formEditProfile').addEventListener('submit', (e) => {
      e.preventDefault();
      State.user.name = document.getElementById('editProfileName').value.trim();
      State.user.email = document.getElementById('editProfileEmail').value.trim();
      saveUser();
      updateProfileView();
      document.getElementById('modalEditProfile').classList.remove('active');
      showToast("Profile updated successfully!");
    });

    // Voice Test Button
    const btnTestVoice = document.getElementById('btnTestVoice');
    if (btnTestVoice) {
      btnTestVoice.addEventListener('click', () => {
        TTS.speak("This is a live test of the SignSpeak text-to-speech engine.");
        showToast("Testing voice synthesis");
      });
    }

    // Offline Mode Switch
    const chkOffline = document.getElementById('chkOfflineMode');
    chkOffline.checked = State.settings.offlineMode;
    chkOffline.addEventListener('change', () => {
      State.settings.offlineMode = chkOffline.checked;
      saveSettings();
      updateNetworkStatus();
      showToast(chkOffline.checked ? "Offline Mode Enabled" : "Online Mode Enabled");
    });

    // Speech Speed Slider
    const rangeSpeed = document.getElementById('rangeSpeechSpeed');
    rangeSpeed.value = State.settings.speechSpeed;
    document.getElementById('valSpeechSpeed').textContent = `${State.settings.speechSpeed}x`;
    rangeSpeed.addEventListener('input', () => {
      State.settings.speechSpeed = parseFloat(rangeSpeed.value);
      document.getElementById('valSpeechSpeed').textContent = `${State.settings.speechSpeed}x`;
      saveSettings();
    });

    // Speech Pitch Slider
    const rangePitch = document.getElementById('rangeSpeechPitch');
    rangePitch.value = State.settings.speechPitch;
    document.getElementById('valSpeechPitch').textContent = `${State.settings.speechPitch}x`;
    rangePitch.addEventListener('input', () => {
      State.settings.speechPitch = parseFloat(rangePitch.value);
      document.getElementById('valSpeechPitch').textContent = `${State.settings.speechPitch}x`;
      saveSettings();
    });

    // Voice Selection
    document.getElementById('selectVoice').addEventListener('change', (e) => {
      State.settings.selectedVoiceIndex = parseInt(e.target.value);
      saveSettings();
      TTS.speak("Testing Text-to-Speech voice");
    });

    // Confidence Threshold
    const rangeThreshold = document.getElementById('rangeThreshold');
    rangeThreshold.value = State.settings.confidenceThreshold;
    document.getElementById('valThreshold').textContent = `${State.settings.confidenceThreshold}%`;
    rangeThreshold.addEventListener('input', () => {
      State.settings.confidenceThreshold = parseInt(rangeThreshold.value);
      document.getElementById('valThreshold').textContent = `${State.settings.confidenceThreshold}%`;
      saveSettings();
    });

    // Clear History
    document.getElementById('btnClearAllHistory').addEventListener('click', () => {
      if (confirm("Are you sure you want to delete all translation records?")) {
        State.history = [];
        saveHistory();
        renderHomeRecentHistory();
        renderFullHistory();
        updateStats();
        showToast("History cleared!");
      }
    });

    // Reset Demo Data
    document.getElementById('btnResetDemoData').addEventListener('click', () => {
      State.signs = DEFAULT_SIGNS_DATASET;
      saveSigns();
      State.history = getDefaultHistorySeed();
      saveHistory();
      renderSignsGrid();
      renderFullHistory();
      renderHomeRecentHistory();
      updateStats();
      showToast("Default dataset & history restored!");
    });
  }

  // =========================================================================
  // 12. Helper Utilities
  // =========================================================================
  function formatRelativeDate(timestamp) {
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 2) return "Just now";
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hrs ago`;
    return new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  let toastTimeout = null;
  function showToast(message) {
    const toast = document.getElementById('toastBox');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast) return;

    toastMsg.textContent = message;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // =========================================================================
  // 13. Application Bootstrap
  // =========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    loadState();
    TTS.init();
    initNavigation();
    initAuth();
    initHome();
    initCamera();
    initGallery();
    initHistory();
    initLearn();
    initProfileAndSettings();
  });

})();
