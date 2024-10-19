
const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/emailfollowup', async (req, res, next) => {
	try {
		let { tone, audience, followUp, productName, productInfo } = req.body

		// if(desc){
		// 	if (desc.length > 600) {
		// 		desc = desc.substring(desc.length - 600)
		// 	}
		// }

		let prompt = `Følgende værktøj skaber en opfølgnings email som baseret på de metadata, der er angivet:\n"""\n` +

	
		// Example 1 
		`${tone ? `Tone: Professionel\n` : ``}` + 
		`${audience ? `Målgruppe: Freelancers\n` : ``}` + 
		`${followUp ? `Opfølgning efter: Gratis prøveperiode\n` : ``}` + 
		`${productName ? `Produkt navn: Nord AI\n` : ``}` + 
		`${productInfo ? `Produkt info: En helt ny AI-drevet software, der skriver ubegrænset tekster til opslag til sociale medier, e-mails, annoncer og videomanuskripter.\n` : ``}` + 
		`email: Hej,\n jeg kontakter dig for at høre, om du er interesseret i at opgradere din konto og blive medlem af NordAI. Ved at vælge denne mulighed vil du altid have den seneste version af softwaren, så du ikke behøver bekymre dig om at køre flere versioner. Du vil også få adgang til 10+ ekstra funktioner, der ikke er tilgængelige med vores gratis prøveperiode. Gå ikke glip af muligheden for at opgradere i dag!\n` 
		`"""\n` +

		// Example 2
		`${tone ? `Tone: Venlig\n` : ``}` + 
		`${audience ? `Målgruppe: Forældre\n` : ``}` + 
		`${followUp ? `Opfølgning efter: Efterladt kurv\n` : ``}` + 
		`${productName ? `Produkt navn: City Mini GT2.1 - stone grey\n` : ``}` + 
		`${productInfo ? `Produkt info: ity Mini GT 2.1 klapvognen som følger med på alle dine eventyrer. Nem at klappe sammen med én hånd, kompakt så den kan være i selv de mindste biler, og mange andre features\n` : ``}` + 
		`email: Vi bemærkede, at du efterlod City Mini GT2.1 i din indkøbskurv, og vi ville bare lige minde dig om, hvor meget denne klapvogn kan tilbyde på dine eventyr. Med dens nemme og kompakte design er den perfekt til at tage med på enhver tur, og den har også masser af funktioner, som du og din lille vil elske. Så hvorfor ikke fuldføre dit køb i dag og give din familie den bedste oplevelse på jeres næste udflugt?\n`  
		`"""\n` +

		// Example 3
		`${tone ? `Tone: Selvsikker\n` : ``}` + 
		`${audience ? `Målgruppe: Iværksættere / Entrepreneur\n` : ``}` + 
		`${followUp ? `Opfølgning efter: Møde\n` : ``}` + 
		`${productName ? `Produkt navn: Social medier annoncer \n` : ``}` + 
		`${productInfo ? `Produkt info: ervice som omhandler at lave social medie annoncer, såsom facebook/instagram, tiktok og snapchat annoncer.\n` : ``}` + 
		`email: Huskede du at tage noter, da vi mødtes i sidste uge? Vi gjorde! Og vi kunne ikke lade være med at tænke på, hvordan vores sociale medie annoncer kunne få din virksomhed til at eksplodere. Forestil dig at gå viral på Facebook, Instagram, TikTok og Snapchat, og nå ud til millioner af mennesker i hele verden! Med vores ekspertise og erfaring kan vi hjælpe dig med at nå dette mål og tage din virksomhed til nye højder.\nVores sociale medie annoncer er skræddersyet til at skille sig ud og fange opmærksomheden fra potentielle kunder. Så lad os ikke spilde mere tid. Kontakt os i dag, så vi kan hjælpe dig med at tage din virksomhed til det næste niveau!`  
		`"""\n`

		let inputRaw = 
		`${tone ? `Tone: ${tone}\n` : ``}` + 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${followUp ? `Opfølgning efter: ${followUp}\n` : ``}` + 
		`${productName ? `Produkt navn: ${productName}\n` : ``}` + 
		`${productInfo ? `Produkt info: ${productInfo}\n` : ``}` + 
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