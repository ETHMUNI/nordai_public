
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/emailsubjectline', async (req, res, next) => {
	try {
		let { tone, audience, productName, productInfo } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber emnelinjer til emails som baseret på de metadata, der er angivet:\n"""\n` +

	
		// Example 1 
		`${tone ? `Tone: Professionel\n` : ``}` + 
		`${audience ? `Målgruppe: Freelancers\n` : ``}` + 
		`${productName ? `Produkt navn: Nord AI\n` : ``}` + 
		`${productInfo ? `Produkt info: En helt ny AI-drevet software, der skriver ubegrænset tekster til opslag til sociale medier, e-mails, annoncer og videomanuskripter.\n` : ``}` + 
		`subjectlines: 🤯 Nord AI: Den helt nye software, der skriver ubegrænsede tekster til sociale medier\n\nSådan skriver du ubegrænset indhold til din virksomhed.\n\n🤯 Nord AI Den eneste AI-drevne indholdsforfatter, du nogensinde vil få brug for.\n\nFREELANCE SKRIVNING GJORT LET!` 
		`"""\n` +

		// Example 2
		`${tone ? `Tone: Venlig\n` : ``}` + 
		`${audience ? `Målgruppe: Forældre\n` : ``}` + 
		`${productName ? `Produkt navn: City Mini GT2.1 - stone grey\n` : ``}` + 
		`${productInfo ? `Produkt info: ity Mini GT 2.1 klapvognen som følger med på alle dine eventyrer. Nem at klappe sammen med én hånd, kompakt så den kan være i selv de mindste biler, og mange andre features\n` : ``}` + 
		`subjectlines:🌟 Klar til at udforske verden med din baby? Prøv vores prisvindende City Mini GT2.1 - stone grey klapvogn!\n\nEventyret venter! Opgrader til City Mini GT2.1 - stone grey klapvognen i dag\n\n🧳 Rejser med børn kan være en udfordring. Gør det nemmere med City Mini GT2.1 - stone grey\n\nSmidig, let og klar til alt! Få din City Mini GT2.1 - stone grey klapvogn nu!`
		`"""\n` +

		// Example 3
		`${tone ? `Tone: Selvsikker\n` : ``}` + 
		`${audience ? `Målgruppe: Iværksættere / Entrepreneur\n` : ``}` + 
		`${followUp ? `Opfølgning efter: Møde\n` : ``}` + 
		`${productName ? `Produkt navn: Social medier annoncer\n` : ``}` + 
		`${productInfo ? `Produkt info: Service som omhandler at lave social medie annoncer, såsom facebook/instagram, tiktok og snapchat annoncer.\n` : ``}` + 
		`subjectlines:🚀 Boost din forretning til nye højder med vores top-notch social media annoncer\n\nGør dit brand synligt med vores effektive social media annoncer\n\nBliv en leder i dit felt med vores skræddersyede social media annoncer\n\n🎯 Gå viral og øg dit salg med vores banebrydende social media annoncer`
		`"""\n`

		let inputRaw = 
		`${tone ? `Tone: ${tone}\n` : ``}` + 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${productName ? `Produkt navn: ${productName}\n` : ``}` + 
		`${productInfo ? `Produkt info: ${productInfo}\n` : ``}` + 
		`subjectlines:` 

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 2500,
			temperature: 0.85,
			frequencyPenalty: 0.7,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "subjectlines:"],
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

	} catch (err) {
		console.log(err)
	}
  })

  module.exports = app