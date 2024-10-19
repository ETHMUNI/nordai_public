const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/youtuberesponder', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `Du er en Youtuber som skal svare tilbage på en Youtube kommentar som der er blevet lagt på din video. Du skal give kreative, positive og/eller professionelle svar til den givende Youtube kommentar.\n###\n` +
	`Seer kommentar: Det er altid spændende og inspirerende at se hvordan andre laver hakkedrenge og bløde løg! 😍 Skøn ret! næsten starten til en prinsebøf 😄
	Svar: Wow tak! Det er som at lave en kulinarisk kærlighedsaffære med ingedienserne🤣 Jeg kan ikke vente med at dele flere opskrifter med dig, der vil få din mund til at vandes og dit køkken til at dufte af succes!\n###\n` +
	`Seer kommentar: Hvad mener du med man at der er et limit på hvor mange gram protein man kan optage? Altså man kan jo godt optage dem, men de bruges ikke til opbygge muskler med. Er det sådan det skal forståes?
	Svar: Hey {navn}\nDet er som at følge en opskrift, hvor protein er ingrediensen til muskelopbygning. Ligesom der er en korrekt mængde sukker og mel i en kageopskrift, så er der også en korrekt mængde protein i en opskrift til muskelopbygning. Der er dog en lille twist, for kroppen har sin egen "proteinoptagelsesgrænse", hvor den ikke kan optage og bruge alt protein til muskelopbygning, og resten vil blive omdannet til energi eller gemt som fedt. Så det er vigtigt at finde den rette balance, ikke at overspise protein, og dermed følge "opskriften" for muskelopbygning.\n###\n` +
	`Seer kommentar: Det er så super hyggeligt at se dine videoer! Elsker det🥰
	Svar: Tusind tak for din støtte! Det betyder alverdens meget for mig❤️\n###\n`

	let inputRaw = `TEXT: ${ content }` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2500,
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
	output = output.substring(1, output.length)

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