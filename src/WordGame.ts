import { promises } from "fs";

type CountMap = { [key: string]: number };

class WordGame {
    /* 
    Define the length and variety of formable words.
    randomStringLength
    minWordLength
    */
    private randomStringLength: number = 7;
    private minWordLength: number = 3;
    /* 
    Define the number of formable words required for the game.
    wordCountRange
    */
    private wordCountRange: number[] = [3, 5];
    private wordList: string[] | null = null;
    /* 
    Properties that are populated by methods.
    */
    public randomString: string | null = null;
    public formableWordsList: string[] = [];
    public formableWordsCount: number = 0;
    public foundWordsList: string[] = [];
    public score: number = 0;
    private initCallback: () => void;
    private recursionLimit: number = 10;
    private recursions: number = 0;

    constructor(initCallback: () => void) {
        this.initCallback = initCallback;
        this.init();
    }

    private async init() {
        try {
            this.recursions += 1;

            await this.readLinesFromFile('./wordlist.txt');
            await this.generateRandomString();
            await this.generateFormableWordsList();

            const areEnough = this.wordCountRange[0] < this.formableWordsCount;
            const areNotTooMany = this.formableWordsCount < this.wordCountRange[1];
            const recursionLimitNotExceeded = this.recursions < this.recursionLimit;

            if ((!areEnough || !areNotTooMany) && recursionLimitNotExceeded) {
                await this.init();
                return;
            }

            this.initCallback();
        } catch (error) {
            console.error(error);
        }
    }

    public submitWord(word: string): void {
        const isCorrect: boolean = this.formableWordsList.includes(word);
        if (isCorrect) {
            this.foundWordsList.push(word);
            this.score += 1;
        }
    }

    private async generateRandomString(): Promise<void> {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';

        for (let i = 0; i < this.randomStringLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }

        this.randomString = result;
    }

    private countOccurrences(str: string): CountMap {
        const countMap: CountMap = {};

        for (const char of str) {
            countMap[char] = (countMap[char] || 0) + 1;
        }

        return countMap;
    }

    private canFormWord(word: string, randomStringCountMap: CountMap): boolean {
        /* 
        Check if a word can be formed from the random string. 
        Loop over each letter and compare the number of letters avaliable.
        */
        const wordCountMap: CountMap = this.countOccurrences(word);
        for (const letter in wordCountMap) {
            const count = wordCountMap[letter];
            const isLetterFullyAvailable = randomStringCountMap[letter] >= count;
            if (!isLetterFullyAvailable) {
                return false;
            }
        }

        return true;
    }

    private async generateFormableWordsList(): Promise<void> {
        const randomStringCountMap: CountMap = this.countOccurrences(this.randomString || "");

        if (this.wordList) {
            this.formableWordsList = this.wordList.filter((word: string) => {
                const isWordLongEnough = word.length >= this.minWordLength;
                return isWordLongEnough && this.canFormWord(word, randomStringCountMap);
            });
            this.formableWordsCount = this.formableWordsList.length;
        }
    }

    private async readLinesFromFile(filePath: string): Promise<void> {
        try {
            const data: string = await promises.readFile(filePath, 'utf8');
            this.wordList = data.split('\n');
        } catch (err) {
            console.error('Error reading file:', err);
            throw err;
        }
    }
}

if (require.main === module) {
    // const wordGame = new WordGame(() => {});
}

export default WordGame;