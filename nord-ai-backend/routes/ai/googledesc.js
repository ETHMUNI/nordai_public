const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/googledesc', async (req, res, next) => {
	try {
		let { title, audience, desc, } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Lav en kreativ og fængende Google Ads Beskrivelse på maks 300 tegn. Brug følgende metadata der er angivet:\n"""\n` +

		// Example 1 
		`${title ? `Produkt navn: Nord AI\n` : ``}` +
		`${audience ? `Målgruppe: Content creators.\n` : ``}` + 
		`${desc ? `Beskrivelse: Nord AI er en SaaS med forskellige AI tools til at hjælpe content creators til at skrive og få ideer til content på få sekunder. Så de netop kan spare tid samt have fokus på det de er bedst til!\n` : ``}` + 
		`Google Beskrivelse: Nord AI - Effektiviser dit indholdsskrivning med vores AI-drevne SaaS. Opdag nem og hurtig adgang til en verden af kreative ideer og skriveværktøjer, specielt designet til content creators. Spar tid og fokuser på at udtrykke din kreativitet med Nord AI.\n` + 
		`"""\n` +

		// Example 2
		`${title ? `Produkt navn: Pilgrim\n` : ``}` +
		`${audience ? `Målgruppe: Modeinteresseret kvinder \n` : ``}` + 
		`${desc ? `Beskrivelse: Håndlavet smykker med dansk design. Med fokus på hver eneste (lille) nuance og detalje.\n` : ``}` + 
		`Google Beskrivelse: Lad dit outfit skinne med unikke smykker fra Pilgrim! Håndlavet med dansk design, der fokuserer på hver eneste nuance og detalje. Opgrader din stil og bliv en modeikon med Pilgrim!\n` + 
		`"""\n` +

		// Example 3
		`${title ? `Produkt navn: Fartkontrol.nu\n` : ``}` +
		`${audience ? `Målgruppe: Bilister \n` : ``}` + 
		`${desc ? `Beskrivelse: Fartkontrol.nu er en mobil-app som giver dig besked hvis du nærmer dig fartkontroller, uheld eller køer.\n` : ``}` + 
		`Google Beskrivelse: Sig farvel til overraskelser på vejen! Fartkontrol.nu's mobil-app giver dig besked om fartkontroller, uheld og køer i realtid. Kør sikkert og roligt med Fartkontrol.nu - til bilister der prioriterer deres sikkerhed.\n` + 
		`"""\n` 

		

		let inputRaw = 
		`${title ? `Produkt navn: ${title}\n` : ``}` +
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`Google Beskrivelse:` 

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 300,
			temperature: 0.8,
			frequencyPenalty: 0.7,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`,"Målgruppe:", "Beskrivelse", "Google Beskrivelse:" ],
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