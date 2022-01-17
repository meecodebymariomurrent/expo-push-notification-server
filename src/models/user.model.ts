import { ApiModel, ApiModelProperty } from 'swagger-express-ts';
import { UserModel } from 'wedding-app-core/dist/models/user.model';
import { UserRole } from 'wedding-app-core/dist/constants/user-role.enum';

@ApiModel({
    description: 'User model',
    name: 'UserApiModel',
})
export class UserApiModel implements UserModel {
    @ApiModelProperty({
        description: 'Id of users',
        example: ['123456789', '12345'],
        required: true,
    })
    public id: string;

    @ApiModelProperty({
        description: 'Name of users',
        required: true,
    })
    public username: string;

    @ApiModelProperty({
        description: 'Password of users',
        required: true,
    })
    public password: string;

    @ApiModelProperty({
        description: 'Role of users',
        required: true,
    })
    public role: UserRole;

    @ApiModelProperty({
        description: 'Name of users',
        required: true,
    })
    public name: string;

    @ApiModelProperty({
        description: 'Family name of users',
        required: true,
    })
    public familyName: string;
}
