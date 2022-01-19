import { inject, injectable } from 'inversify';
import { DatabaseTable } from '../constants/database-table.enum';
import { DatabaseService } from './database.service';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import { CategoryRequest } from '../models/request/category-request.model';
import { Category } from '../models/category.model';

@injectable()
export class CategoryService {
    private readonly databaseTable = DatabaseTable.Category;

    constructor(@inject(DatabaseService.name) private databaseService: DatabaseService) {
    }

    public getAll(): Promise<Array<Category>> {
        return this.databaseService.getAll<Category>(this.databaseTable);
    }

    public create(category: CategoryRequest): Promise<Category> {
        return new Promise((resolve, reject) => {
            this.databaseService.add<Category>(this.mapCategory(category), this.databaseTable)
                .then((response: Category) => {
                    resolve(response);
                }).catch((error) => {
                reject(new DatabaseCreationError('Error while creating a category', error));
            });
        })
    }

    private mapCategory(category: CategoryRequest): Category {
        const categoryModel = new Category();
        categoryModel.name = category.name;
        return categoryModel;
    }
}
