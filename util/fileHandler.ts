import formidable from 'formidable';
import { tokenGenerator } from './tokenGenerator';
import path from 'path';
import fs from 'fs';

export const  uploadFile = async (req: Request, uploadPath: string, filename: string, isRequired: boolean = true) => {
    try {
        return new Promise((resolve, reject) => {
            let options = {
                allowEmptyFiles: false,
                maxFileSize: 5 * 1024 * 1024,
                uploadDir: path.join(__dirname, '../../uploads'),
                fileName: tokenGenerator(9),
                keepExtensions: true,
                filter: function ({mimetype}: any) {
                    // keep only images
                    return mimetype && mimetype.includes("image");
                }
            }

            const form = new formidable({ ...options });

            form.parse(req, async (err, fields, files: any) => {
                if(err) {
                    console.log(err); // log error
                    return reject({status: false, message: 'Unable to parse uploaded file'});
                }
    
                if(!files[filename] && !isRequired) {
                    return resolve({status: false, fields, message: 'No file was uploaded'})
                }
    
                if(!files[filename] && isRequired) {
                    return reject({status: false, message: 'No file was uploaded'});
                }
    
                let localFilePath = path.join(__dirname, '../../uploads', files[filename].newFilename);

                let image = fs.readFileSync(localFilePath, 'utf8');

                // let image = `${uploadPath}/${files[filename].newFilename}`
    
                unlinkFile(localFilePath);
    
                return resolve({status: true, fields, image});
            })
        })
    } catch (error) {
        
    }
}

export const unlinkFile = (path: string) => {
    try {
        fs.unlink(path, (err) => {
            if (err) return false; // unable to delete file

            return true; // delete file successfully
        })
    } catch (error) {
        return false;
    }
}