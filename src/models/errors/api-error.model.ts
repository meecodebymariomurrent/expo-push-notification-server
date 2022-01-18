/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */
export class ApiErrorModel {
    /**
     * Constructor
     *
     * @param message the error message
     * @param statusCode the http status code
     * @param error the detailed error
     */
    constructor(readonly message: string, readonly statusCode: number, readonly error?: any) {
    }
}
