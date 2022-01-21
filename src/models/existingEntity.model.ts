export class ExistingEntity<T> {

    readonly entity: T;
    readonly exists: boolean;

    constructor(exists: boolean, entity: T = null) {
        this.exists = exists;
        this.entity = entity;
    }
}
