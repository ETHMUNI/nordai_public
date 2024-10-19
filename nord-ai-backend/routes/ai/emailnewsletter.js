const express = require("express");
const openai = require("../middlewares/openai");

let app = express.Router();

// input tokens: 150
// input characters: 600
// output tokens: 50
// output characters: 200

// Personal Tools
app.post("/emailnewsletter", async (req, res, next) => {
  try {
    let { topic, tone, companyName, companyDesc } = req.body;

    // if(desc){
    // 	if (desc.length > 600) {
    // 		desc = desc.substring(desc.length - 600)
    // 	}
    // }

    let prompt =
      `Følgende værktøj skaber en kold kanvas email som baseret på de metadata, der er angivet:\n"""\n` +
      // Example 1
      `${topic ? `Emne: Udgivelse af vores nye AI software Nord AI\n` : ``}` +
      `${tone ? `Tone: Professionel\n` : ``}` +
      `${companyName ? `Virksomhedens navn: Nord AI\n` : ``}` +
      `${companyDesc ? `Virksomhedsbeskrivelse: En helt ny AI-drevet software, der skriver ubegrænset tekster til opslag til sociale medier, e-mails, annoncer og videomanuskripter.\n` : ``}` +
      `email: Hej alle!\n\nVi er glade for at annoncere udgivelsen af vores nye AI-software - Nord AI!\nDenne software skriver ubegrænset tekst til opslag på sociale medier, e-mails, annoncer og videomanuskripter.\nVi har arbejdet hårdt på denne software, og vi er sikre på, at I vil elske den.\n\nPrøv den gratis idag!\n` +
      `"""\n` +

      // Example 2
      `${topic ? `Emne: Hvad er dit bedste råd til at holde fokus og produktivitet i en travl arbejdsuge?\n` : `` }` +
      `${tone ? `Tone: Motiverende\n` : ``}` +
      `${companyName ? `Virksomhedens navn: Momentum Solutions\n`: `` }` +
      `${companyDesc ? `Virksomhedsbeskrivelse: Momentum Solutions er en virksomhed, der specialiserer sig i at hjælpe individer og virksomheder med at opnå deres fulde potentiale gennem personlig udvikling og træning.\n` : ``  }` +
      `email: Hvordan holder man fokus og produktivitet i en travl arbejds uge?\n\nDet er det spørgsmål vi bliver spurgt om mest af vores klienter.\n\nHer er vores 4 bedste råd:\n1. Sæt realistiske mål for hver dag. At forsøge at opnå for meget på en enkelt dag kan føre til frustration og udbrændthed. Opdel dine opgaver i håndterbare bidder og fokuser på en ting ad gangen.\n\n2. Bliv organiseret. Brug et par minutter hver dag på at planlægge dine opgaver og prioriteter. Dette vil hjælpe dig med at holde dig på rette spor og undgå at spilde tid på aktiviteter, der ikke er vigtige.\n\n3. Tag pauser. Det er vigtigt at træde væk fra dit arbejde med jævne mellemrum for at opfriske dit sind og krop. Gå en tur, tag en lur, eller træd bare væk fra dit skrivebord i et par minutter. Du vil være mere produktiv, når du vender tilbage, hvis du har taget lidt tid til at hvile.\n\n4. Eliminer distraheringer. Slå dine email-meddelelser fra, luk sociale medier faner og alt andet, der måtte trække din opmærksomhed væk fra dit arbejde. Hvis du har brug for det, så afsæt specifikke tidspunkter på dagen til at tjekke beskeder og besvare dem, så du ikke bliver konstant afbrudt.\n\n` +
      `"""\n` +

      // Example 3
      `${topic ? `Emne: Her er mine tips til at tjene penge i et bear marked\n` : `` }` +
      `${tone ? `Tone: Selvsikker\n` : ``}` +
      `${companyName ? `Virksomhedens navn: Jesper Jensen\n` : ``}` +
      `${companyDesc ? `Virksomhedsbeskrivelse: Jeg (Jesper Jensen) er en trader, der fokuserer på at opnå overskud på aktie- og kryptomarkedet.\n`: ``}` +
      `email: Som du måske ved, kan aktie- og kryptomarkedet være uforudsigeligt, og når markedet er nede, kan det være udfordrende at tjene penge. Men med de rette strategier kan du stadig have succes i et bear marked.\n\nHer er mine bedste tips til at tjene penge i et bear marked:\n\nVær tålmodig og panik ikke - Et bear marked kan være skræmmende, men det er vigtigt at forblive rolig og ikke træffe impulsbeslutninger. Hold fokus på dine langsigtede mål og bevare hovedet koldt.\n\nKig efter undervurderede aktier og kryptokurver - Under et bear marked bliver mange aktier og kryptokurver undervurderede, hvilket giver en glimrende mulighed for investorer. Gør din research og kig efter kvalitetsaktiver, der handles til en rabat.\n\nDiversificer din portefølje - Diversificering er altid vigtigt inden for investering, men endnu mere så under et bjørnemarked. Spred dine investeringer på tværs af forskellige aktiver og sektorer for at minimere risikoen.\n\nHold øje med markedstendenser - Hold dig opdateret om markedstendenser og nyheder. Dette vil hjælpe dig med at træffe informerede beslutninger om, hvornår du skal købe og sælge.\n\nMed disse tips i tankerne kan du stadig tjene penge i et bear marked. Husk, tålmodighed, research og diversificering er nøgleord.\n\n` +
      `"""\n`

    let inputRaw =
      `${topic ? `Emne: ${topic}\n` : ``}` +
      `${tone ? `Tone: ${tone}\n` : ``}` +
      `${companyName ? `Virksomhedens navn: ${companyName}\n` : ``}` +
      `${companyDesc ? `Virksomhedsbeskrivelse: ${companyDesc}\n` : ``}` +
      `email:`

    prompt += inputRaw;

    const gptResponse = await openai.complete({
      engine: "text-davinci-003",
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
      stop: [`"""`, "email:", ],
    });

    let output = `${gptResponse.data.choices[0].text}`;

    // remove the first character from output
    // output = output.substring(1, output.length)

    // If the output string ends with one or more hashtags, remove all of them
    if (output.endsWith('"')) {
      output = output.substring(0, output.length - 1);
    }

    // If the output string ends with one or more hashtags, remove all of them
    if (output.endsWith('"')) {
      output = output.substring(0, output.length - 1);
    }

    // remove a single new line at the end of output if there is one
    if (output.endsWith("\n")) {
      output = output.substring(0, output.length - 1);
    }

    req.locals.input = prompt;
    req.locals.inputRaw = inputRaw;
    req.locals.output = output;

    next();
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
