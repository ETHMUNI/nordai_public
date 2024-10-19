const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/facebookretargeting', async (req, res, next) => {
	try {
		let { title, audience, desc, } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber en annonce til Facebook baseret på de metadata, der er angivet:\n"""\n` +

		// Example 1 
		`${title ? `Produkt navn: Wispy Zero Sauce \n` : ``}` + 
		`${audience ? `Målgruppe: Fitness interesserede\n` : ``}` + 
		`${desc ? `Beskrivelse: Wispy Zero Sauce er den perfekte erstatning til kaloriefyldte dressinger, dog uden at gå på kompromis med den gode smag. Wispy Zero Suace er en lav kalorie dressing.\n` : ``}` + 
		`Facebook Annonce: Dine favoritter fra ${title} er her stadig - lidt endnu i hvert fald 💪🏆\n✅Hurtig levering\n✅Prisgaranti på alt\n✅Fri fragt på køb over 499,-\n` + 
		`"""\n` +

		// Example 2
		`${title ? `Produkt navn: Fitness-shoppen.dk\n` : ``}` + 
		`${audience ? `Målgruppe: Fitness\n` : ``}` + 
		`${desc ? `Beskrivelse: Fitness-shoppen er en online e-commerce butik som sælger fitness og yoga udstyr, samt fitness tøj\n` : ``}` + 
		`Facebook Annonce: Kan vi friste med andet? 🏆\n👉 Prisgaranti på alt!\n👉 Hurtig levering\n👉 Fri fragt på køb over 499,\n` + 
		`"""\n` +

		// Example 3
		`${title ? `Produkt navn: Geekd\n` : ``}` + 
		`${audience ? `Målgruppe: Gamere, gaming\n` : ``}` + 
		`${desc ? `Beskrivelse: Geekd er en online e-commerce butik som sælger gamer ustyr og computerer\n` : ``}` + 
		`Facebook Annonce: Undskyld vi forstyrrer dig, men vi tror du har glemt noget👀👇\n🥊 Altid lave priser\n🚀 4.7 ud af 5 stjerner\n📦 Gratis fragt på ordre over 899 kr.\n` + 
		`"""\n`

		let inputRaw = 
		`${title ? `Produkt navn: ${title}\n` : ``}` + 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`Facebook Annonce:` 

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
			stop: [`"""`, "Målgruppe:", "Beskrivelse", "Facebook Annonce:" ],
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