const Repositorie = require('../repositories/file')
const fs = require('fs')
const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const aws = require('aws-sdk')
const s3 = new aws.S3()
const path = require('path')
const { promisify } = require('util')
/**
 * 
 */
class File {

    async insert(files, details, id_login) {
        try {

            if (details.typeFile == 1) {
                let file = files[0];
                
                if (file.name) file.key = file.name
                if (!file.location) file.location = `${process.env.BASE_URL}/files/${file.key}`

                file.size = file.size / 1024 / 1024

                await Repositorie.insertArchive(file, details, id_login)
            } else {
                for (let file of files) {
                    if (file.name) file.key = file.name
                    if (!file.location) file.location = `${process.env.BASE_URL}/files/${file.key}`

                    file.size = file.size / 1024 / 1024

                    await Repositorie.insert(file, details, id_login)
                }
            }

            return true
        } catch (error) {
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }


    async save(file, details, id_login) {
        try {
            const id_file = await Repositorie.insert(file, details, id_login)

            return id_file
        } catch (error) {
            throw new InvalidArgumentError('No se pudo guardar el archivo.')
        }
    }

    async view(key) {
        try {
            return Repositorie.view(key)
        } catch (error) {
            throw new NotFound('Archivo no encontrado')
        }
    }

    list(type, id) {
        try {
            return Repositorie.list(type, id)
        } catch (error) {
            throw new NotFound('No és possible listar los archivos.')
        }
    }

    async update(file, id) {
        try {
            return Repositorie.update(file, id)
        } catch (error) {
            throw new NotFound('No és possible listar los archivos.')
        }
    }

    async delete(key) {
        try {

            if (process.env.STORAGE_TYPE === 's3') {
                s3.deleteObject({
                    Bucket: 'logisticrepositorie',
                    Key: key
                }).promise()
            } else {
                return promisify(fs.unlink)(path.resolve(__dirname, "..", "..", "tmp", "uploads", req.params.key))
            }

            Repositorie.delete(key)

            return true

        } catch (error) {
            if (error && error.code == 'ENOENT') {
                throw new NotFound('No se encontró el archivo, por lo que se puede eliminar.')
            } else {
                throw new InvalidArgumentError('Se produjo un error al intentar eliminar el archivo.')
            }
        }
    }
}

module.exports = new File