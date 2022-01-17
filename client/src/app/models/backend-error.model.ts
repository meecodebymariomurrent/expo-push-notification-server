export class BackendError {
    public message = '';
    public error = '';

    constructor(readonly status: number, readonly name: string, readonly url: string | null) {
    }
}
