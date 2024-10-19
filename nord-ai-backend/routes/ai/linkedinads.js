
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/linkedinads', async (req, res, next) => {
	try {
		let { title, audience, desc, } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber en annonce til LinkedIn baseret på de metadata, der er angivet:\n"""\n` +

		// Example 1 
		`${title ? `Produkt navn: Shopify\n` : ``}` + 
		`${audience ? `Målgruppe: Iværksættere, webshop ejere.\n` : ``}` + 
		`${desc ? `Beskrivelse: Shopify er en e-handelsplatform til oprettelse og vedligeholdelse af online butikker.\n` : ``}` + 
		`LinkedIn Annonce: Start din webshop drøm i dag med Shopify. Let, intuitiv og kraftfuld platform for iværksættere og webshop ejere.\n Bliv en del af vores 200.000+ succesfulde butikker og start din rejse med Shopify i dag.\n` + 
		`"""\n` +

		// Example 2
		`${title ? `Produkt navn: Dedia\n` : ``}` + 
		`${audience ? `Målgruppe: Advokater\n` : ``}` + 
		`${desc ? `Beskrivelse: Hjælper advokater med online markedsføring\n` : ``}` + 
		`LinkedIn Annonce: Advokater, er du klar til at tage din praksis til næste niveau? Lad Dedia hjælpe dig med at få flere leads og en højere konverteringsrate. Vores innovative løsninger vil øge din synlighed og give dig en konkurrencefordel. Skil dig ud fra mængden og bliv en stærkere spiller i branchen med Dedia.\n` + 
		`"""\n` +

		// Example 3
		`${title ? `Produkt navn: Dinero\n` : ``}` + 
		`${audience ? `Målgruppe: Selvstændige, revisorer\n` : ``}` + 
		`${desc ? `Beskrivelse: Dinero er en dansk regnskabsplatform som gør det nemt at lave og opretholde bogføring\n` : ``}` + 
		`LinkedIn Annonce: Lad Dinero være din superhelt! Vores brugervenlige platform gør det nemt og enkelt at lave og opretholde din bogføring. Slut med tidsrøveri og bekymringer om at følge med i dine regnskaber. Lad Dinero give dig mere tid til at fokusere på det, du gør bedst. Opret din gratis konto nu og oplev en ny verden af regnskabshåndtering.\n` + 
		`"""\n`

		let inputRaw = 
		`${title ? `Produkt navn: ${title}\n` : ``}` + 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`LinkedIn Annonce:` 

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 2500,
			temperature: 0.8,
			frequencyPenalty: 0.7,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "Målgruppe:", "Beskrivelse", "LinkedIn Annonce:" ],
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

	} catch (err) {
		console.log(err)
	}
  })

  module.exports = app