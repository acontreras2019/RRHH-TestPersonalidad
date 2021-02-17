import { Option } from './option';

export class Question {
    id: number;
    name: string;
    questionTypeId: number;
    options: Option[];
    answered: boolean;
    letraSeleccionada: string;

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.name = data.name;
        this.questionTypeId = data.questionTypeId;
        this.letraSeleccionada = "";
        this.options = [];
        data.options.forEach(o => {
            this.options.push(new Option(o));
        });
    }
}
