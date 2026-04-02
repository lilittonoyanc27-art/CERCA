import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  RefreshCw, 
  Trophy, 
  Info,
  MoveHorizontal,
  Maximize,
  Minimize,
  Square,
  BookOpen
} from 'lucide-react';

// --- Data ---
interface Preposition {
  word: string;
  armenian: string;
  description: string;
  example: string;
}

const PREPOSITIONS: Preposition[] = [
  { 
    word: 'Cerca (de)', 
    armenian: 'Մոտ', 
    description: 'Օգտագործվում է, երբ առարկաները գտնվում են միմյանց մոտ տարածության վրա:',
    example: 'La casa está cerca del parque.'
  },
  { 
    word: 'Lejos (de)', 
    armenian: 'Հեռու', 
    description: 'Օգտագործվում է, երբ առարկաները գտնվում են միմյանցից մեծ տարածության վրա:',
    example: 'El cine está lejos de aquí.'
  },
  { 
    word: 'En frente de', 
    armenian: 'Դիմացը', 
    description: 'Օգտագործվում է, երբ մի առարկան գտնվում է մյուսի ուղիղ դիմացը:',
    example: 'El banco está en frente de la escuela.'
  },
];

interface Question {
  sentence: string;
  translation: string;
  correctWord: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  { sentence: "La casa está ___ del parque.", translation: "Տունը այգու մոտ է:", correctWord: "cerca", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "El cine está ___ de aquí.", translation: "Կինոթատրոնը այստեղից հեռու է:", correctWord: "lejos", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "El banco está ___ de la escuela.", translation: "Բանկը դպրոցի դիմացն է:", correctWord: "en frente de", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "Mi amigo vive ___ de mi casa.", translation: "Իմ ընկերը իմ տան մոտ է ապրում:", correctWord: "cerca", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "La montaña está ___ de la city.", translation: "Սարը քաղաքից հեռու է:", correctWord: "lejos", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "El coche está ___ del garaje.", translation: "Մեքենան ավտոտնակի դիմացն է:", correctWord: "en frente de", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "El restaurante está ___ del hotel.", translation: "Ռեստորանը հյուրանոցի մոտ է:", correctWord: "cerca", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "La playa está ___ de la montaña.", translation: "Լողափը սարից հեռու է:", correctWord: "lejos", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "La farmacia está ___ del hospital.", translation: "Դեղատունը հիվանդանոցի դիմացն է:", correctWord: "en frente de", options: ["cerca", "lejos", "en frente de"] },
  { sentence: "El perro está ___ de su comida.", translation: "Շունը իր ուտելիքի մոտ է:", correctWord: "cerca", options: ["cerca", "lejos", "en frente de"] },
];

export default function PrepositionsGame() {
  const [view, setView] = useState<'theory' | 'practice' | 'result'>('theory');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const startPractice = () => {
    setShuffledQuestions([...QUESTIONS].sort(() => Math.random() - 0.5));
    setCurrentQuestion(0);
    setScore(0);
    setFeedback(null);
    setView('practice');
  };

  const handleAnswer = (word: string) => {
    if (feedback) return;

    const correct = shuffledQuestions[currentQuestion].correctWord;
    if (word === correct) {
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      if (currentQuestion < shuffledQuestions.length - 1) {
        setCurrentQuestion(q => q + 1);
        setFeedback(null);
      } else {
        setView('result');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 flex flex-col items-center py-12">
      <header className="text-center mb-12 max-w-2xl">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">
          Տարածական <br /> <span className="text-indigo-600">Կողմնորոշում</span>
        </h1>
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={() => setView('theory')}
            className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${view === 'theory' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border-2 border-slate-100'}`}
          >
            <BookOpen className="w-4 h-4" /> Տեսություն
          </button>
          <button 
            onClick={startPractice}
            className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${view !== 'theory' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 border-2 border-slate-100'}`}
          >
            <Navigation className="w-4 h-4" /> Վարժություն
          </button>
        </div>
      </header>

      <main className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {view === 'theory' && (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-2xl">
                <h2 className="text-3xl font-black italic uppercase mb-4">Ինչպե՞ս նկարագրել դիրքը</h2>
                <p className="text-lg font-medium opacity-90">
                  Իսպաներենում առարկաների հեռավորությունը կամ դիրքը նկարագրելու համար օգտագործում ենք հետևյալ հիմնական բառերը:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PREPOSITIONS.map((prep, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white p-8 rounded-[2.5rem] shadow-xl border-4 border-slate-100 flex flex-col h-full"
                  >
                    <div className="mb-4 bg-indigo-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                      {idx === 0 && <Minimize className="text-indigo-600" />}
                      {idx === 1 && <Maximize className="text-indigo-600" />}
                      {idx === 2 && <MoveHorizontal className="text-indigo-600" />}
                    </div>
                    <h3 className="text-2xl font-black text-indigo-600 mb-2">{prep.word}</h3>
                    <p className="text-lg font-bold text-slate-800 mb-4">{prep.armenian}</p>
                    <p className="text-sm text-slate-500 mb-6 flex-grow">{prep.description}</p>
                    <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 italic text-sm text-indigo-900">
                      "{prep.example}"
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'practice' && (
            <motion.div 
              key="practice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-indigo-100 text-center relative overflow-hidden"
            >
              <div className="mb-8">
                <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                  Հարց {currentQuestion + 1} / {shuffledQuestions.length}
                </span>
              </div>

              <div className="mb-12">
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm mb-4">
                  {shuffledQuestions[currentQuestion].translation}
                </p>
                <h2 className="text-4xl font-black text-slate-900 mb-8 italic">
                  {shuffledQuestions[currentQuestion].sentence.split('___').map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-8 mx-2">
                          {feedback === 'correct' ? shuffledQuestions[currentQuestion].correctWord : '___'}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {shuffledQuestions[currentQuestion].options.map((word) => (
                  <button 
                    key={word}
                    onClick={() => handleAnswer(word)}
                    disabled={!!feedback}
                    className={`py-6 rounded-[2rem] font-black text-xl transition-all border-b-8 active:border-b-0 active:translate-y-2 ${feedback === 'correct' && word === shuffledQuestions[currentQuestion].correctWord ? 'bg-emerald-500 border-emerald-700 text-white' : feedback === 'wrong' && word !== shuffledQuestions[currentQuestion].correctWord ? 'bg-slate-100 border-slate-200 text-slate-400' : feedback === 'wrong' && word === shuffledQuestions[currentQuestion].correctWord ? 'bg-red-500 border-red-700 text-white' : 'bg-indigo-600 border-indigo-800 text-white hover:bg-indigo-700'}`}
                  >
                    {word}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-8 flex items-center justify-center gap-2 font-black uppercase tracking-widest ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {feedback === 'correct' ? <><CheckCircle2 /> Ճիշտ է:</> : <><XCircle /> Սխալ է:</>}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white p-16 rounded-[4rem] shadow-2xl border-8 border-indigo-200 max-w-2xl mx-auto"
            >
              <Trophy className="w-40 h-40 text-yellow-400 mx-auto mb-8 drop-shadow-lg" />
              <h2 className="text-6xl font-black italic uppercase mb-4 text-indigo-900">Ապրե՜ս:</h2>
              <p className="text-2xl text-slate-500 mb-12 font-medium">
                Դու հավաքեցիր <span className="text-indigo-600 font-black">{score}</span> միավոր {shuffledQuestions.length}-ից:
              </p>
              <button 
                onClick={startPractice}
                className="px-16 py-6 bg-indigo-600 text-white rounded-full font-black text-2xl uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-2xl flex items-center gap-4 mx-auto"
              >
                <RefreshCw className="w-6 h-6" /> Նորից
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-12 text-slate-400 font-black uppercase text-[10px] tracking-widest">
        Cerca • Lejos • En frente de • Location Academy
      </footer>
    </div>
  );
}
