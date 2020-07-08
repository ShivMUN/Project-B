export class User {
    // tslint:disable-next-line: variable-name
    _id: string;
    userName: string;
    name: string;
    picture?: string;
}


export class UserVm {
    constructor(public userName: string = '', public password: string = '') {
    }
}
