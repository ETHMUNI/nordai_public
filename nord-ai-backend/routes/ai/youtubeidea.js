const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/youtubeidea', async (req, res, next) => {
	try {
		let { topic, tone } = req.body
  
	let prompt = `Lav ideer til Youtube videoer med et bestemt emne og tone. Du skal svarer med treding og relevant indhold. Når et input er Random, bestemmer du emnet. Lav Youtube ideer fra YOUTUBE-IDEER:\n###\n`+ 
    `TOPIC: Random\nTONE: Kreativ\nYOUTUBE-IDEER: 1. En "day in the life" vlog\n 2. En "top 10" liste over dit foretrukne emne\n 3. En DIY-guide til en livsstilsændring\n	4. En samtale med en interessant person om deres karriere eller livserfaring\n 5. En "field trip" til et interessant sted, der er relateret til dit emne.\n###\n` +
    `TOPIC: Fitness\nTONE: Professionel\nYOUTUBE-IDEER: 1. En udfordring, der tester din fysiske styrke\n 2. En introduktion til en ny form for træning, såsom yoga eller HIIT\n 3.En "day in the life" vlog, der viser din daglige træningsrutine\n 4. En vejledning i hjemmetræning, med fokus på effektive øvelser med lavt udstyr.\n 5. En samtale med en ekspert inden for et specielt område i fitness, om deres råd og tips\n###\n` +
    `TOPIC: Gaming\nTONE: Fængende\nYOUTUBE-IDEER: 1. En "speedrun" video, hvor du prøver at gennemføre et spil så hurtigt som muligt\n 2. "Choices and Consequences" video, hvor du viser de beslutninger og konsekvenser, du træffer i et valgbaseret spil.\n 3. En video, hvor du spiller som en undervurderet karakter og viser deres styrker.\n 4. "Glitch Hunting" video, hvor du udforsker og viser sjove eller underlige fejl i et spil.\n 5. "One Shot Challenge" video, hvor du udfordrer dig selv eller andre til at klare et bestemt mål i et spil på en enkelt chance.\n###\n`

	let inputRaw = `TOPIC: ${topic}\n TONE: ${tone}\nYOUTUBE-IDEER:\n` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2000,
		temperature: 0.9,
		topP: 1,
		frequencyPenalty: 1,
		presencePenalty: 0,
		bestOf: 1,
		n: 1,
		user: req.user._id,
		stream: false,
		stop: ["###", "<|endoftext|>", ],
	});

	let output = `${gptResponse.data.choices[0].text}`

	// remove the first character from output
	// output = output.substring(1, output.length)

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// If the output string ends with one or more hashtags, remove all of them
	if (output.endsWith('"')) {
		output = output.substring(0, output.length - 1)
	}

	// remove a single new line at the end of output if there is one
	if (output.endsWith('\n')) {
		output = output.substring(0, output.length - 1)
	}

	req.locals.input = prompt
	req.locals.inputRaw = inputRaw
	req.locals.output = output

	next()

	} catch (err){
		console.log(err.response)
		console.log(err.data)
		console.log(err.message)
	}
	
  })

module.exports = app