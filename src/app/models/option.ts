export class Option {
    id: number;
    questionId: number;
    name: string;
    isAnswer: boolean;
    selected: boolean;
    valueRes:string;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.questionId = data.questionId;
        this.name = data.name;
        this.valueRes= "";
        this.isAnswer = data.isAnswer;
        this.valueRes = data.valueRes;
    }
}
