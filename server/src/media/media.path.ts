export class MediaPath {
    static fromFile(file: Express.Multer.File) {
        const destination = file.destination.replace(/\\/g, "/");

        const uploadsIndex = destination.indexOf("/uploads/");

        const relative =
            uploadsIndex >= 0
                ? destination.slice(uploadsIndex)
                : `/uploads/${destination}`;

        return `${relative}/${file.filename}`;
    }
}