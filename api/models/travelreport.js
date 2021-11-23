const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/travelreport')
const docx = require('docx');
const { AlignmentType, Document, BorderStyle, SectionType, Footer, Header, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType, Table, TableCell, TableRow } = docx;

class TravelReport {

    async list(travel) {
        try {
            let data = await Repositorie.list(travel)

            if (data) {
                let details = await Repositorie.listDetail(data.id)
                data.details = details
            }

            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    listDetail(id) {
        try {
            return Repositorie.listDetail(id)

        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async insert(travel) {

        try {
            const obj = await Repositorie.check(travel)

            if (obj && obj.id) {
                travel.id_travelreport = obj.id
            } else {
                const id = await Repositorie.insert(travel)
                travel.id_travelreport = id
            }

            for (let index = 0; index < travel.description.length; index++) {
                const detail = {
                    id: travel.ids[index],
                    description: travel.description[index],
                    value: travel.value[index],
                    refnro: travel.refnro[index],
                    contnro: travel.contnro[index],
                    id_travelreport: travel.id_travelreport
                }

                if (detail.id == 0) {
                    await Repositorie.insertDetail(detail)
                } else {
                    await Repositorie.update(detail)
                }

                travel.details = detail
            }

            const b64string = await this.generate(travel)

            return b64string
        } catch (error) {
            console.log(error);
            throw new InvalidArgumentError('Error.')
        }
    }

    update(travel, id) {
        try {
            return Repositorie.update(travel, id)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    delete(id) {
        try {
            return Repositorie.delete(id)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

   async generate(travel) {

        const doc = new Document({
            creator: "Logistica",
            description: `Informe ${travel.name}`,
            title: `Informe ${travel.name}`,
            sections: [{
                margins: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
                properties: {
                    type: SectionType.CONTINUOUS
                },
                children: [
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [],
                                        borders: {
                                            bottom: {
                                                style: BorderStyle.NIL,
                                                size: 2,
                                                color: "00000F",
                                            },
                                            right: {
                                                style: BorderStyle.NIL,
                                                size: 2,
                                                color: "00000F",
                                            },
                                        },
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("Hello")],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                    new TableCell({
                                        children: [],
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]
            }]
        })

        const b64string = await Packer.toBase64String(doc);

        return b64string
    }
}

module.exports = new TravelReport