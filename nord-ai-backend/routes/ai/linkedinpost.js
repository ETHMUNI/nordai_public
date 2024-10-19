
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/linkedinpost', async (req, res, next) => {
	try {
		let { audience, desc, } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber et opslag til LinkedIn baseret på de metadata, der er angivet:\n"""\n` +

		// Example 1 
		`${audience ? `Målgruppe: Iværksættere, CEO's\n` : ``}` + 
		`${desc ? `Beskrivelse: Tanker omkring udviklingen af arbejdskultur og arbejdshjemmeforhold\n` : ``}` + 
		`LinkedIn Opslag: Som ledere i en stadigt forandrende verden er det vores ansvar at tilpasse vores arbejdskultur til den digitale tidsalder. Med remote arbejde, fleksible arbejdstider og en ændring i måden vi samarbejder på, er det tid til at reflektere over, hvordan vi kan skabe en arbejdskultur, der understøtter vores medarbejderes velvære og produktivitet.\n Som iværksættere og CEO'er har vi muligheden for at påvirke denne udvikling og forme fremtidens arbejdskultur. Lad os arbejde sammen for at skabe en arbejdskultur, der understøtter vores medarbejderes trivsel og faglige udvikling, mens vi stadig opnår vores forretningsmål. #arbejdskultur #remotearbejde #ledelse.\n` + 
		`"""\n` +

		// Example 2
		`${audience ? `Målgruppe: Studerende\n` : ``}` + 
		`${desc ? `Beskrivelse: De seneste tendenser i forsikringsbranchen og få et indblik i, hvad det vil sige at arbejde i forsikringsbranchen\n` : ``}` + 
		`LinkedIn Opslag: Som studerende kan det være svært at vide, hvilken branche der vil passe til ens karrieremål. Derfor vil jeg gerne invitere dig til at lære mere om udviklingen i forsikringsbranchen og hvad det vil sige at arbejde inden for dette felt.\nForsikringsbranchen er i en konstant forandring og teknologi spiller en stadigt større rolle i denne udvikling. Fra kunstig intelligens til digitale løsninger, er der mange spændende muligheder for at blive en del af en branche, der hjælper mennesker med at beskytte deres ejendele og fremtid.\nSå hvis du er nysgerrig efter at lære mere om branchen og hvordan du kan kickstarte din karriere inden for forsikring, så hold øje med vores opslag!\n` + 
		`"""\n` +

		// Example 3
		`${audience ? `Målgruppe: Iværksættere, CEO's\n` : ``}` + 
		`${desc ? `Beskrivelse: Tanker omkring udviklingen af arbejdskultur og arbejdshjemmeforhold\n` : ``}` + 
		`LinkedIn Opslag: Attention marketingsfolk! Ønsker du at udnytte dit potentiel på LinkedIn og vokse din kundebase? Tag med i samtalen, når vi undersøger, hvordan du effektivt kan bruge LinkedIn som markedsføringskonsulent for at opnå flere kunder.\n 1. Skab værdi med indholdsmarkedsføring: Del relevant indhold, der engagerer din målgruppe og demonstrerer din ekspertise inden for dit felt.\n 2. Byg relationer: Deltag i relevante grupper, kommenter på andres opslag og opbyg et stærkt netværk med personer, der har en interesse i dit område.\n 3. Målrettet kommunikation: Anvend LinkedIn's målrettede annonceværktøjer til at nå ud til dine ideelle kunder med personlige beskeder og relevante tilbud.\n Følg disse trin og udnyt det fulde potentiale af LinkedIn! #LinkedInMarketing #KundeOpbygning #MarketingStrategi\n` + 
		`"""\n`

		

		let inputRaw = 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`LinkedIn Opslag:` 

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
			stop: [`"""`,"Målgruppe:", "Beskrivelse", "LinkedIn Opslag:" ],
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