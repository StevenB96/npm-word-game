import express, { Request, Response } from 'express';
import WordGame from './WordGame';

const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    /* 
    Request a simple web page. 
    Logic handled by the Word Game object.
    */
    res.render('index', {
        randomString: wordGame.randomString,
        score: wordGame.score,
        formableWordsCount: wordGame.formableWordsCount,
        foundWordsList: wordGame.foundWordsList,
    });
});

app.post('/submit', (req: Request, res: Response) => {
    /* 
    Submit a word answer.
    Logic handled by the Word Game object.
    */
    const { word } = req.body;
    wordGame.submitWord(word);

    res.redirect('/');
});

// Define the async function to initialise the server
const initServer = () => {
    try {
        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

// In-memory array to store the wordGame
const wordGame = new WordGame(initServer);