import { readFile, promises } from "fs";

type CountMap = { [key: string]: number };

class WordGame {
    private randomStringLength: number = 5;
    private wordList: string[] | null = null;
    public randomString: string | null = null;
    public formableWordsList: string[] = [];
    public formableWordsCount: number = 0;
    public foundWordsList: string[] = [];
    public score: number = 0;

    constructor() {
        this.init();
    }

    private async init() {
        try {
            this.wordList = await this.readLinesFromFile('./wordlist.txt');
            this.generateRandomString();
            this.generateformableWordsList();
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

    private generateRandomString(): void {
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

    private generateformableWordsList(): void {
        const randomStringCountMap: CountMap = this.countOccurrences(this.randomString || "");

        if (this.wordList) {
            this.formableWordsList = this.wordList.filter((word: string) => {
                return this.canFormWord(word, randomStringCountMap);
            });
            this.formableWordsCount = this.formableWordsList.length;            
        }
    }

    private async readLinesFromFile(filePath: string): Promise<string[]> {
        try {
            const data: string = await promises.readFile(filePath, 'utf8');
            return data.split('\n');
        } catch (err) {
            console.error('Error reading file:', err);
            throw err;
        }
    }
}

if (require.main === module) {
    const wordGame = new WordGame();
}

export default WordGame;