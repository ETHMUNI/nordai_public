const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/facebookheadline', async (req, res, next) => {
	try {
		let { title, audience, desc, } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber en annonce overskrift til Facebook baseret på de metadata, der er angivet:\n"""\n` +

		// Example 1 
		`${title ? `Produkt navn: Pilgrim\n` : ``}` +
		`${audience ? `Målgruppe: Kvinder\n` : ``}` + 
		`${desc ? `Beskrivelse: Håndlavet smykker med dansk design. Med fokus på hver eneste (lille) nuance og detalje.\n` : ``}` + 
		`Facebook Overskrift: Opdag skønheden i håndlavet smykker med dansk touch💍\n` + 
		`"""\n` +

		// Example 2
		`${title ? `Produkt navn: Nordic Wellness Massage Pistol Pro\n` : ``}` +
		`${audience ? `Målgruppe: Fitness, Massage \n` : ``}` + 
		`${desc ? `Beskrivelse: Nordic-wellness massagepistol PRO version får du alt, hvad du har brug for, hvis du skal forkæle din ømme krop eller have en dejlig massage.\n` : ``}` + 
		`Facebook Overskrift: Føl dig som ny igen - den ultimative løsning til ømme muskler💆\n` + 
		`"""\n` +

		// Example 3
		`${title ? `Produkt navn: Fartkontrol.nu\n` : ``}` +
		`${audience ? `Målgruppe: Bilister \n` : ``}` + 
		`${desc ? `Beskrivelse: Fartkontrol.nu er en mobil-app som giver dig besked hvis du nærmer dig fartkontroller, uheld eller køer.\n` : ``}` + 
		`Facebook Overskrift: Din mobilassistent til at undgå fartkontroller 🚗💨❌\n` + 
		`"""\n` 

		

		let inputRaw = 
		`${title ? `Produkt navn: ${title}\n` : ``}` +
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`Facebook Overskrift:` 

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
			stop: [`"""`,"Målgruppe:", "Beskrivelse", "Facebook Overskrift:" ],
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