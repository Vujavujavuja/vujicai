'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const { language } = useLanguage();

  const aboutContent = {
    en: {
      title: "About Me",
      intro: "My name is Nemanja Vujić, and I am a passionate and driven Data Scientist, AI Engineer, and AI Consultant - yes, I wear quite a few hats, but they all stem from one deep-rooted interest: using artificial intelligence to solve real-world problems. I come from a small but vibrant town in Serbia called Pančevo, located just across the river from the capital city, Belgrade. I earned my Bachelor's degree in Computer Science at the Faculty of Computing, and I'm currently pursuing a Master's degree - still deciding between specializing in Data Science or Artificial Intelligence, though both fields continue to fascinate me.",
      aiJourney: "My journey into the world of AI began in a rather unexpected and relatable way. Like many students, I was struggling to complete a project for class and turned to ChatGPT in search of help. What started as a shortcut quickly became an obsession. I was amazed: how could a model that \"just predicts the next word\" be so effective at writing code, answering questions, and holding conversations? That moment sparked a deep curiosity in me. I wanted to understand what was happening under the hood - how language models work, what makes them so powerful, and how they can be improved or applied in new ways. Since then, I've been on an immersive journey through machine learning, deep learning, NLP, and beyond. Whether it's building AI-powered tools, exploring ethical implications, or discussing the future of general intelligence, I'm always eager to learn more and share knowledge with others. AI isn't just a career path for me - it's a lens through which I view the world, a toolkit for innovation, and a source of endless inspiration.",
      earlyCareer: "My journey into the world of AI began in a humble yet impactful way - as a Data Annotator for an AI company. My job was to evaluate the performance of Large Language Models (LLMs), specifically reviewing their code generation capabilities. I would meticulously examine outputs, identify flaws, and correct coding errors. Over time, this hands-on experience naturally transitioned into more advanced tasks - most notably, Prompt Engineering. Prompt Engineering quickly became one of my favorite aspects of AI development. There's something incredibly powerful - almost artistic - about guiding a model's behavior through carefully crafted language. It felt like conducting an orchestra using nothing but words and the raw intelligence of generative models. That role helped me develop a deep appreciation for the subtle dynamics between human intent and machine response. Despite my growing interest, I eventually left that position and took a brief detour from the AI world. I joined Luxoft as a Software Delivery Specialist - a title that, in practice, meant I was something of a \"benched\" programmer. During this time, I explored a wide range of technical disciplines: from Software Engineering to Quality Assurance, DevOps, and more. It was a period of exploration, flexibility, and learning - but I knew my true passion still lay in AI. Then came a turning point. I was offered the opportunity to take any Microsoft Azure certification of my choice - and for me, the answer was obvious: Azure AI Engineer Associate. I committed a month to studying and passed the exam with ease. More importantly, it reignited the spark I had for AI - reminding me that this is where I belong and what I want to keep pursuing, professionally and personally.",
      vegaIT: "After my time at Luxoft, I felt a strong pull to return to the world of AI - and that's when Vega IT entered the picture. They offered me a role as a Data Scientist & AI Engineer, and I accepted almost without hesitation. It felt like the right move - and it absolutely was. My experience at Vega IT has been incredibly rewarding. The projects I've worked on are modern, impactful, and aligned with cutting-edge AI trends. I've had the chance to contribute to several Generative AI initiatives, as well as one standout consulting project, which has been my personal favorite so far. Beyond the technical work, one of the most fulfilling parts of my role has been mentoring new interns in the field of Data Science. Guiding and supporting the next generation of AI talent is something I genuinely enjoy, and it's helped me grow not just as an engineer, but also as a communicator and leader.",
      powerlifting: "You might also know me from my time as a powerlifter, a passion I still pursue whenever time allows. I competed semi-professionally as part of IPF Serbia, and it was an incredible chapter of my life that taught me discipline, resilience, and the importance of consistent progress - values that carry over into my work in tech and AI. My proudest achievement in the sport was securing 4th place nationally in the Junior -105kg category."
    },
    sr: {
      title: "O meni",
      intro: "Moje ime je Nemanja Vujić, i ja sam strastan i motivisan naučnik podataka, AI inženjer i AI konsultant - da, nosim prilično puno šešira, ali oni svi proističu iz jednog duboko ukorenjenog interesa: korišćenje veštačke inteligencije za rešavanje problema iz stvarnog sveta. Dolazim iz malog ali živahnog grada u Srbiji koji se zove Pančevo, smeštenog preko reke od glavnog grada, Beograda. Diplomirao sam Računarske nauke na Fakultetu računarstva, i trenutno studiram magistarske studije - još uvek se odlučujem između specijalizacije u oblasti nauke o podacima ili veštačke inteligencije, iako me obe oblasti i dalje fasciniraju.",
      aiJourney: "Moj put u svet AI-ja je počeo na prilično neočekivan i prepoznatljiv način. Kao i mnogi studenti, borio sam se da završim projekat za čas i okrenuo se ChatGPT-u u potrazi za pomoći. Ono što je počelo kao prečica brzo je postalo opsednutost. Bio sam zadivljen: kako model koji \"samo predviđa sledeću reč\" može biti toliko efikasan u pisanju koda, odgovaranju na pitanja i vođenju razgovora? Taj trenutak je izazvao duboku radoznalost u meni. Želeo sam da razumem šta se dešava iza kulisa - kako jezički modeli funkcionišu, šta ih čini tako moćnim, i kako mogu biti poboljšani ili primenjeni na nove načine. Od tada sam na potapajućem putovanju kroz mašinsko učenje, duboko učenje, NLP i dalje. Bilo da gradim AI-pokretane alate, istražujem etičke implikacije, ili diskutujem o budućnosti opšte inteligencije, uvek sam željan da naučim više i podelim znanje sa drugima. AI nije samo karijerni put za mene - to je sočivo kroz koje posmatram svet, alatka za inovacije, i izvor beskonačne inspiracije.",
      earlyCareer: "Moj put u svet AI-ja je počeo na skroman ali uticajan način - kao anotator podataka za AI kompaniju. Moj posao je bio da ocenim performanse velikih jezičkih modela (LLM), specifično pregledam njihove sposobnosti generisanja koda. Pedantno sam pregledao izlaze, identifikovao greške, i ispravljao kodirne greške. Vremenom, ovo praktično iskustvo je prirodno prešlo u naprednije zadatke - najpoznatije, Prompt Engineering. Prompt Engineering je brzo postao jedan od mojih omiljenih aspekata AI razvoja. Nešto je neverovatno moćno - skoro umetničko - o vođenju ponašanja modela kroz pažljivo osmišljen jezik. Osećao sam se kao da dirigujem orkestar koristeći ništa osim reči i sirovu inteligenciju generativnih modela. Ta uloga mi je pomogla da razvijam duboko razumevanje suptilnih dinamika između ljudske namere i mašinskog odgovora. Uprkos rastućem interesu, na kraju sam napustio tu poziciju i napravio kratki zaobilazak iz AI sveta. Pridružio sam se Luxoft-u kao Software Delivery Specialist - titula koja je, u praksi, značila da sam nešto kao \"rezervni\" programer. Tokom ovog vremena, istražio sam širok spektar tehničkih disciplina: od softverskog inženjerstva do osiguranja kvaliteta, DevOps-a, i još više. To je bio period istraživanja, fleksibilnosti i učenja - ali znao sam da moja prava strast i dalje leži u AI-ju. Zatim je došao prelomni trenutak. Ponudili su mi priliku da uzmem bilo koju Microsoft Azure sertifikaciju po mom izboru - i za mene je odgovor bio očigledan: Azure AI Engineer Associate. Posvetio sam mesec dana učenju i prošao ispit sa lakoćom. Što je još važnije, to je ponovo upalilo varnicu koju sam imao za AI - podsetivši me da je to mesto gde pripadam i ono što želim da nastavim da se bavim, profesionalno i lično.",
      vegaIT: "Posle mog vremena u Luxoft-u, osetio sam snažnu privlačnost da se vratim u svet AI-ja - i tada je Vega IT ušla u priču. Ponudili su mi ulogu kao naučnik podataka i AI inženjer, i prihvatio sam skoro bez oklevanja. Osećao sam da je to pravi potez - i apsolutno je bio. Moje iskustvo u Vega IT-u je bilo neverovatno nagradna. Projekti na kojima sam radio su moderni, uticajni, i usklađeni sa najnovijim AI trendovima. Imao sam priliku da doprinesem nekoliko generativnih AI inicijativa, kao i jedan izuzetan konsultantski projekat, koji je do sada bio moj lični favorit. Pored tehničkog rada, jedan od najispunjavaćih delova moje uloge je bilo mentorstvo novih pripravnika u oblasti nauke o podacima. Vođenje i podrška sledeće generacije AI talenata je nešto što iskreno uživam, i pomoglo mi je da rastem ne samo kao inženjer, već i kao komunikator i lider.",
      powerlifting: "Možda me takođe znate iz mog vremena kao powerlifter, strast kojom se i dalje bavim kad god vreme dozvoli. Takmičio sam se poluprofesionalno kao deo IPF Srbije, i to je bilo neverovatno poglavlje mog života koje me je naučilo disciplini, otpornosti, i važnosti doslednog napretka - vrednosti koje se prenose u moj rad u tehnologiji i AI-ju. Moje najponosniji uspeh u sportu je bilo osvajanje 4. mesta na nacionalnom nivou u Junior -105kg kategoriji."
    }
  };

  const content = aboutContent[language];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-8 heading-enhanced">
              {content.title}
            </h1>
            <div className="relative mb-8 inline-block">
              <Image
                src="/placeholder-about.png"
                alt="Nemanja Vujić"
                width={300}
                height={300}
                className="rounded-lg shadow-xl"
              />
            </div>
          </motion.div>

          <div className="prose prose-lg max-w-none">
            <motion.div variants={itemVariants} className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {content.intro}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                {language === 'en' ? 'My AI Journey' : 'Moj AI put'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {content.aiJourney}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                {language === 'en' ? 'Early Career' : 'Rana karijera'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {content.earlyCareer}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                {language === 'en' ? 'Vega IT Experience' : 'Iskustvo u Vega IT-u'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {content.vegaIT}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground heading-enhanced">
                {language === 'en' ? 'Powerlifting Background' : 'Powerlifting iskustvo'}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-enhanced">
                {content.powerlifting}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}