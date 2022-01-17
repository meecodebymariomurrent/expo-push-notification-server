/*
 * Copyright (c) 2021 | All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 *  Written by MeeCode by Mario Murrent
 *
 */
import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@ApiModel({
    description: 'Login response model',
    name: 'LoginResponseModel',
})
export class LoginResponseModel {
    @ApiModelProperty({
        description: 'Login status',
        required: true,
    })
    public loggedIn: boolean = false;

    @ApiModelProperty({
        description: 'The authentication token',
        required: true,
    })
    public token: string;
}
