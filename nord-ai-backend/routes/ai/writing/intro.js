
const express = require('express');
const openai = require('../../middlewares/openai');

let app = express.Router()

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post('/writing/intro', async (req, res, next) => {
	try {
		let { title, audience, desc, keywords } = req.body

		if(desc){
			if (desc.length > 600) {
				desc = desc.substring(desc.length - 600)
			}
		}

		let prompt = `Følgende værktøj skaber en introduktionsafsnit til en artikel baseret på de metadata, der er angivet:\n"""\n` +

		// Example 1
		`Titel: Fuld Introduktion til de 30 Mest Essentielle Datastrukturer & Algoritmer\n` + 
		`${audience ? `Målgruppe: Programmører, Developers\n` : ``}` + 
		`${desc ? `Beskrivelse: En artikel, der dækker, hvorfor det er vigtigt at kende data strukturer og algoritmer som emne, og hvordan de anvendes i teknologi, arbejde og liv..\n` : ``}` + 
		`${keywords ? `Keywords: Algoritmer, Data, Strukturer, Kodning, Læring\n` : ``}` + 
		`Introduktion:  Data Strukturer & Algoritmer (DSA) anses ofte for at være et skræmmende emne - en almindelig misforståelse. Som grundlaget for de mest innovative koncepter inden for teknologi, er de essentielle både for jobs-/praktikansøgere og erfarne programmører i deres rejse. At mestre DSA betyder, at du er i stand til at bruge din algoritmiske og komputationelle tænkning til at løse aldrig-set-før problemer og bidrage til ethvert tech-selskabs værdi (inklusiv dit eget!). Ved at forstå dem kan du forbedre vedligeholdbarheden, udvidbarheden og effektiviteten af ​​din kode.\n` + 
		`"""\n` +

		// Example 2
		`Titel: Den ultimative guide til at brande dig selv: Sådan gør du indtryk uden at bruge en formue\n` + 
		`${audience ? `Målgruppe: Marketing\n` : ``}` + 
		`${desc ? `Beskrivelse: En artikel, der dækker måder at brande sig selv på, så du kan skille dig ud i en allerede fyldt marked. Det gør processen mulig uden at bruge for mange penge, samtidig med at du bygger din egen brand.\n` : ``}` + 
		`${keywords ? `Keywords: branding, marketing\n` : ``}` + 
		`Introduktion: At skabe en personlig brand er den ultimative måde at få opmærksomhed i en konkurrencepræget branche. Men det behøver ikke at koste en formue. I denne artikel vil jeg dele tips og tricks til hvordan du kan skabe en stærk personlig brand uden at gå fallit.\n` + 
		`"""\n` +

		// Example 3
		`Titel: Vigtigheden af kunstig intelligens: Hvordan det vil påvirke verden om 10 år.\n` + 
		`${audience ? `Målgruppe: AI-entusiaster\n` : ``}` + 
		`${desc ? `Beskrivelse: Udforsk hvordan verden ændrer sig med vækst og brugen af ​​AI, der vil have en større påvirkning på dag til dag livet nu og i fremtiden.\n` : ``}` + 
		`${keywords ? `Keywords: AI, Verdenen, Teknologi\n` : ``}` + 
		`Introduktion: Kunstig intelligens ændrer verden.\nDet vil snart få en effekt på hvert aspekt af vores liv, fra måden vi kører på til måden vi arbejder på. Det er en kraftfuld og hurtigt fremadskridende teknologisk kraft, som vi ikke kan tåle at ignorere. Her er det, du skal vide om dette hurtigt fremadskridende område og hvordan det vil påvirke verden i 10 år.\n` + 
		`"""\n`

		

		let inputRaw = `Titel ${title}\n` + 
		`${audience ? `Målgruppe: ${audience}\n` : ``}` + 
		`${desc ? `Beskrivelse: ${desc}\n` : ``}` + 
		`${keywords ? `Keywords: ${keywords}\n` : ``}` + 
		`Introduktion:` 


		prompt += inputRaw


		const gptResponse = await openai.complete({
			engine: 'text-davinci-003',
			prompt,
			maxTokens: 300,
			temperature: 0.8,
			frequencyPenalty: 0.5,
			presencePenalty: 0,
			bestOf: 1,
			topP: 1,
			n: 1,
			user: req.user._id,
			stream: false,
			stop: [`"""`, "Titel:","Målgruppe:", "Introduktion:" ],
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