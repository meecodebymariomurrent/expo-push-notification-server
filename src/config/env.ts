import { config, DotenvConfigOutput } from 'dotenv';
import { join } from 'path';

export class ConfigLoader {
    public static load(envRelativePath: string): Promise<Error | undefined> {
        return new Promise<Error>((resolve, reject) => {
            const currentPath: string = process.cwd();
            const path: string = join(currentPath, envRelativePath);
            const result: DotenvConfigOutput = config({path});
            if (result.error) {
                reject(result.error);
            }
            resolve(undefined);
        })
    }
}
