export class DatabaseCreationError {
    constructor(readonly message: string, readonly error?: unknown) {
    }
}
