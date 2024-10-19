const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/youtubedescription', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `Lav kreative og relevante Youtube beskrivelser ud fra den givende Youtube titel. Lav Youtube beskrivelser fra TEXT:\n###\n`+ 
    `TEXT: Er du træt af at bruge timer på at skrive indhold, der ikke får den trafik, du ønsker? Så er dette videoen for dig! Vi viser dig, hvordan du kan øge din online tilstedeværelse ved hjælp af det seneste inden for AI-teknologi. Lær om, hvordan et AI-drevet indholds skriveværktøj kan hjælpe dig med at skrive mere effektivt og målrettet indhold, der vil øge din trafik og forbedre din online synlighed. Så hvis du vil have flere besøgende på din hjemmeside og øge din online tilstedeværelse, skal du se denne video nu!\n###\n` +
    `TEXT: Er du klar til at tage din stil til næste niveau? I denne video viser vi dig, hvordan du kan kombinere high-end og high-street beklædning for at skabe et unikt og moderigtigt look. Vi viser dig, hvordan du kan mixe og matche forskellige stykker for at skabe kontraster og harmoni i din garderobe. Lær om, hvordan du kan bruge high-end accessories til at give dit high-street tøj et løft, og omvendt. Glem ikke at tjekke vores video for at se vores favorit kombinationer og få inspiration til at skabe dit eget unikke look. Hit play now!\n###\n` +
    `TEXT: Træt af at prøve forskellige diæter og træningsplaner uden at se de ønskede resultater? I denne video viser vi dig en effektiv træningsplan, der er designet specifikt til at hjælpe dig med at tabe mavefedt. Du vil lære om, hvordan du kan øge din forbrænding og styrke din kerne med en kombination af cardio og styrketræning. Vi giver dig også tips til, hvordan du kan ændre din kost for at understøtte din træning og opnå de bedste resultater. Følg træningsplanen og se resultaterne selv!\n###\n`

	let inputRaw = `TEXT: ${ content }` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2000,
		temperature: 0.82,
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