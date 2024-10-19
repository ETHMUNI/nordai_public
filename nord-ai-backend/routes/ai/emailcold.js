 

const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/emailcold', async (req, res, next) => {
	try {
		let { tone, goal, sendersName, gettersName, sendersInfo, gettersInfo  } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber en kold kanvas email som baseret på de metadata, der er angivet:\n"""\n` +

	
		// Example 1 
		`${tone ? `Tone: Selvsikker\n` : ``}` + 
		`${goal ? `Mål: Et møde\n` : ``}` +
		`${sendersName ? `Senderens navn: Jørgen\n` : ``}` + 
		`${gettersName ? `Modtagers navn: Klaus\n` : ``}` + 
		`${sendersInfo ? `Senderens info: Social medie konsulent, laver social medie annoncer for virksomheder.\n ` : ``}` + 
		`${gettersInfo ? `Modtagerens info: Baby Sam, e-commerce butik, sælger babytøj online\n` : ``}` + 
		`email: Hej Klaus,\nJeg håber, du har det godt. Mit navn er Jørgen, og jeg er en social medie konsulent, der er på mission for at gøre virksomheder synlige på sociale medier.\nDa jeg tjekkede din e-commerce butik, var jeg så imponeret over den charmerende babytøjskollektion, du har.\nJeg kunne ikke lade være med at forestille mig, hvordan jeg kunne få endnu flere forældre til at opdage og elske din butik med mine social medie færdigheder.\nHvad siger du til at sætte os sammen over en kop kaffe og brainstorme nye idéer?\nDe bedste hilsener,\n Jørgen` +
		 `"""\n` +

		 // Example 2
		`${tone ? `Tone: Begejstret\n` : ``}` + 
		`${goal ? `Mål: Starte gratis prøveperiode\n` : ``}` +
		`${sendersName ? `Senderens navn: Ali\n` : ``}` + 
		`${gettersName ? `Modtagers navn: Karen \n` : ``}` + 
		`${sendersInfo ? `Senderens info: NordAI, baseret på forskellige AI værktøjer\n` : ``}` + 
		`${gettersInfo ? `Modtagerens info: Marketings konsulent, laver video content og markedsføring baseret på SEO og organisk vækst\n` : ``}` + 
		`email: Kære Karen,\nJeg håber, at denne email finder dig i godt humør! Mit navn er Ali, og jeg er stolt repræsentant for en NordAI.\n Vi hjælper vores kunder med at spare tid og generere content på få sekunder ved hjælp af vores AI-værktøjer. Jeg er nødt til at sige, at jeg blev helt overvældet af begejstring, da jeg så dit fantastiske arbejde inden for dit video content og SEO-baseret markedsføring.\nJeg er sikker på, at du vil elske vores AI-værktøjer, og jeg vil gerne tilbyde dig en gratis prøveperiode, så du kan opleve vores magi selv!\nEr du klar til at tage dit marketing-game til det næste niveau?\nBedste hilsener,\nAli`  + 
		`"""\n` +

		// Example 3
		`${tone ? `Tone: Venlig\n` : ``}` + 
		`${goal ? `Mål: Jobtilbud\n` : ``}` +
		`${sendersName ? `Senderens navn: Emma\n` : ``}` + 
		`${gettersName ? `Modtagers navn: Birgitte\n` : ``}` + 
		`${sendersInfo ? `Senderens info: Arbejder for Deloitte, revision og finansiel rådgivning\n` : ``}` + 
		`${gettersInfo ? `Modtagerens info: Revisor\n` : ``}` + 
	 `	email: Kære Birgitte,\nJeg håber, at du nyder din dag. Mit navn er Emma, og jeg arbejder for Deloitte, hvor vi hjælper vores kunder med revision og finansiel rådgivning.\nDa jeg læste din imponerende profil som revisor, vidste jeg, at jeg var nødt til at nå ud til dig. Vi søger efter en talentfuld revisor til at slutte sig til vores team, og jeg kan ikke tænke på nogen bedre end dig!\n Jeg tror, at du ville trives i vores kreative og udfordrende miljø, og jeg ville elske at tale med dig om muligheden for at blive en del af Deloitte-familien.\nLad os tage en snak og udforske denne mulighed sammen.\nDe bedste hilsner,\nEmma`  + 
		`"""\n`

		let inputRaw = 
		`${tone ? `Tone: ${tone}\n` : ``}` + 
		`${goal ? `Mål: ${goal}\n` : ``}` + 
		`${sendersName ? `Senderens navn: ${sendersName}\n` : ``}` + 
		`${gettersName ? `Modtagers navn: ${gettersName}\n` : ``}` + 
		`${sendersInfo ? `Senderens info: ${sendersInfo}\n` : ``}` + 
		`${gettersInfo ? `Modtagerens info: ${gettersInfo}\n` : ``}` + 
		`email:` 

		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 2500,
			temperature: 0.88,
			frequencyPenalty: 0.7,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "email:"],
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