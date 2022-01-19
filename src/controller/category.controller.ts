import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../models/errors/api-error.model';
import { inject } from 'inversify';
import logger from '../utils/logger';
import { CategoryService } from '../services/category.service';
import { JwtMiddleware } from '../middleware/jwt.middleware';
import { DatabaseCreationError } from '../models/errors/database-creation-error.model';
import { CategoryRequest } from '../models/request/category-request.model';
import { transformAndValidate } from 'class-transformer-validator';
import { CategoryResponse } from '../models/response/category-response.model';

@controller('/category', JwtMiddleware.name)
export class CategoryController implements interfaces.Controller {
    constructor(@inject(CategoryService.name) private categoryService: CategoryService,) {
    }

    @httpPost('')
    public async getAll(request: Request, response: Response): Promise<void> {
        try {
            const categories = await this.categoryService.getAll();
            response.json(categories);
        } catch (error) {
            logger.error('Error retrieving all categories', [error]);
            response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
        }
    }

    @httpPost('/create')
    public async create(request: Request, response: Response): Promise<void> {
        try {
            const categoryData = await transformAndValidate<CategoryRequest>(CategoryRequest, request.body) as CategoryRequest;
            const categoryResponse = await this.categoryService.create(categoryData) as CategoryResponse;
            response.send(StatusCodes.CREATED).json(categoryResponse);
        } catch (error) {
            logger.error('Error while creating user', [error]);
            if (error instanceof DatabaseCreationError) {
                response.status(StatusCodes.CONFLICT)
                    .send(new ApiError(error.message, StatusCodes.CONFLICT, error));
            } else {
                response.status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .send(new ApiError('Internal server error', StatusCodes.INTERNAL_SERVER_ERROR, error));
            }
        }
    }
}
