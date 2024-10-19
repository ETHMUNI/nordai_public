const express = require('express');
const openai = require('../middlewares/openai');

let app = express.Router()

app.post('/youtubescripts', async (req, res, next) => {
	try {
		let { content } = req.body
  
	let prompt = `Lav et Youtube manusckript som svarer med relevant indhold på dansk. Lav et Youtube manuskript fra TEXT:\n###\n`+ 
    `TEXT: Intro:\nAt tabe sig kan være en svær proces, men det behøver ikke at være kompliceret. I denne video vil vi dele nogle af de bedste tips og teknikker, der vil hjælpe dig med at opnå vægttab på en sund og holdbar måde.\nTip 1: Sæt realistiske mål\nDet er vigtigt at sætte realistiske mål for vægttabet. At sætte sig for høje mål kan føre til skuffelse og kan være demotiverende. Sæt konkrete og holdbare mål, og hold dig fast ved dem.\nTip 2: Spis en balanceret kost\nEn balanceret kost er vigtigt for vægttab. Det er vigtigt at spise fødevarer, der er rige på næringsstoffer og lavt i kalorier. Spis masser af frugt og grønt, magre proteiner, og undgå overforbrug af sukker og fedt.\nTip 3: Motion regelmæssigt\nRegelmæssig motion er afgørende for vægttab. Det hjælper med at øge stofskiftet og forbrænde kalorier. Det er vigtigt at finde en type motion, man nyder, for at holde motivationen oppe.\nTip 4: Sov ordentligt\nSøvn er vigtig for vægttab. Det hjælper med at regulere hormonerne, der er ansvarlige for vægtregulering. Sørg for at få mindst 7-8 timer søvn hver nat.\nAfslutning:\nVægttab kan være en svær proces, men ved at følge disse tips og teknikker, kan du opnå det på en sund og holdbar måde. Husk at være tålmodig med dig selv og at fejltagelser er en del af processen. Hold dig fast ved dine mål og fortsæt med at arbejde på dem, så vil du se resultaterne. Husk at like, subscribe og vi ses!\n###\n` +
	`TEXT: Intro:\nHej og velkommen til vores video om dyreste vs billigste hotel. Når man skal vælge et hotel, kan det være svært at vurdere, om det er det værd at betale mere for et dyrere hotel, eller om man kan få lige så god en oplevelse ved at vælge et billigere hotel. I denne video vil vi undersøge, hvad man kan forvente af de dyreste og billigste hoteller, og hjælpe dig med at træffe den bedste beslutning.\nDyreste hoteller:\nDe dyreste hoteller er ofte kendt for deres luksuriøse faciliteter og service. Du kan forvente store værelser med fine møbler, elegante badeværelser, og ofte en fantastisk udsigt. De har også ofte en række førsteklasses faciliteter som spa, fitnesscenter, og gourmetrestauranter. Men det kommer også med en høj pris.\nBilligste hoteller:\nBilligste hoteller kan tilbyde en mere grundlæggende oplevelse. Værelserne er ofte mindre og mere enkle, og faciliteterne er begrænsede. Men det betyder ikke, at de er dårlige hoteller. De kan stadig være rene og komfortable, og tilbyde gode placeringer. Prisen er ofte meget lavere end på de dyreste hoteller.\nAfslutning:\nNår det kommer til at vælge et hotel, er det vigtigt at overveje dine prioriteter og budget. Hvis du ønsker en luksuriøs oplevelse med alle faciliteter, er et dyrere hotel måske det rigtige valg for dig. Men hvis du er mere interesseret i en god placering og et godt pris/kvalitet forhold, kan et billigere hotel være det bedste valg. Det er vigtigt at undersøge hotellerne og læse anmeldelser, inden du træffer en beslutning. Tak fordi du så med!\n###\n` +
	// `TEXT: Indledning:\nVelkommen til min kanal, hvor jeg bringer dig de seneste nyheder og anmeldelser inden for underholdning. I dag skal vi tage et kig på nogle af de mest spændende film og tv-shows, der er ude lige nu.\nTip 1: Binge-værdige shows\nEr du på udkig efter noget at binge-watch? Prøv "Stranger Things" på Netflix, en science fiction-serie med en god blanding af humor og spænding. Eller hvad med "The Crown", som giver et indblik i det britiske kongehus gennem årene.\nTip 2: Komedier\nTrænger du til et godt grin? Prøv "Parks and Recreation" på Netflix, en politisk satirekomedie med et stærkt cast. Eller hvad med "Brooklyn Nine-Nine" en klassisk politserie med et væld af humor.\nTip 3: Dramafilm\nEr du på udkig efter noget mere alvorligt? Prøv "The Social Network" en film om opstarten af Facebook og dens skaber Mark Zuckerberg. Eller hvad med "The Shawshank Redemption" en film om håb og venskab i fængslet.\nTip 4: Actionfilm\nEr du mere til action? Prøv "John Wick" en film om en tidligere lejemorder, der søger hævn. Eller hvad med "Mad Max: Fury Road" en visuelt imponerende film om overlevelse i en post-apokalyptisk verden.\nAfslutning:\nTak fordi du så med. Jeg håber, at disse anbefalinger har givet dig nogle idéer til, hvad du skal se næste gang. Husk at abonnere på min kanal for flere anmeldelser og nyheder om underholdning.\n###\n` +
	`TEXT: Indledning:\n"Baggrundsmusikken begynder."\nVelkommen til min kanal, hvor jeg bringer dig de seneste nyheder og anmeldelser inden for underholdning. I dag skal vi tage et kig på nogle af de mest eftertragtede film og tv-shows, der er på vej i den kommende tid\nBiografpremierer\n"Kameraet skifter til en liste over kommende biografpremierer"\nLad os starte med biografpremiererne. Der er mange spændende film på vej i den kommende tid, fra storfilm som "Avengers: Endgame" til indie-favoritter som "Moonlight"\nMusiknyheder:\n"Kameraet skifter til en liste over kommende albumudgivelser."\nMusikverdenen er også spækket med spændende nyheder. Der er nye album på vej fra kunstnere som Taylor Swift og Ed Sheeran. Fortæl mig i kommentarfeltet, hvilke album du glæder dig mest til at høre.\nAfslutning:\n"Baggrundsmusikken stopper"\nTak fordi du så med. Jeg håber, at du har fået nogle idéer til, hvad du skal se, høre og streame i den kommende tid. Husk at dele dine forventninger i kommentarfeltet, og tjek tilbage for flere underholdningnyheder. Og ikke mindst husk at like, subscribe og vi ses!\n###\n`

	let inputRaw = `TEXT: ${ content }` // here is where people enter stuff
	prompt += inputRaw

	const gptResponse = await openai.complete({
		engine: 'text-davinci-003',
		prompt,
		maxTokens: 2350,
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