const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/travelreport')
const docx = require('docx');
const { AlignmentType, Document, ShadingType, WidthType, VerticalAlign, BorderStyle, SectionType, Footer, Header, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType, Table, TableCell, TableRow } = docx;

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

            for (let concept of travel.concepts) {
                if (concept.id == 0) {
                    await Repositorie.insertDetail(concept, travel.id_travelreport)
                } else {
                    await Repositorie.drop(concept.id)
                    await Repositorie.update(concept)
                }
            }

            for (let description of travel.descriptions) {
                if (description.id == 0) {
                    await Repositorie.insertDetail(description, travel.id_travelreport)
                } else {
                    await Repositorie.update(description)
                }
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
        console.log(id);
        try {
            return Repositorie.delete(id)
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }

    async generate(travel) {

        let headerDesc
        let tableDesc
        let chest

        if (travel.chest) {
            chest = new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                    new TextRun({
                        text: `Chapa del Acoplado: `,
                        font: "Calibri",
                        bold: true,
                        allCaps: true,
                        size: "5mm"
                    }),
                    new TextRun({
                        text: travel.chest,
                        font: "Calibri",
                        allCaps: true,
                        size: "5mm"
                    })
                ]
            })
        }

        if (travel.descriptions && travel.descriptions.length > 0) {
            headerDesc = new Table({
                verticalAlign: VerticalAlign.CENTER,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                color: "000",
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: `OBS`,
                                                bold: true,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "5mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                                shading: {
                                    fill: "42c5f4",
                                    type: ShadingType.PERCENT_95,
                                    color: "BFBFBF",
                                },
                            }), new TableCell({
                                color: "000",
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: `REFERENCIA NRO`,
                                                bold: true,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "5mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                                shading: {
                                    fill: "42c5f4",
                                    type: ShadingType.PERCENT_95,
                                    color: "BFBFBF",
                                },
                            }), new TableCell({
                                color: "000",
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: `CONTENEDOR NRO`,
                                                bold: true,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "5mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                                shading: {
                                    fill: "42c5f4",
                                    type: ShadingType.PERCENT_95,
                                    color: "BFBFBF",
                                },
                            })
                        ]
                    })
                ],
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
            })

            tableDesc = new Table({
                verticalAlign: VerticalAlign.CENTER,
                rows: travel.descriptions.map((description) => {
                    return new TableRow({
                        children: [
                            new TableCell({
                                width: { size: 40, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: description.comment,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "4mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                            }), new TableCell({
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: description.refnro,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "4mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                            }), new TableCell({
                                width: { size: 30, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            new TextRun({
                                                text: description.contnro,
                                                font: "Calibri",
                                                allCaps: true,
                                                size: "4mm"
                                            }),
                                        ]
                                    })
                                ],
                                verticalAlign: VerticalAlign.CENTER,
                            })
                        ]
                    })
                }),
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
            })
        }

        const doc = new Document({
            styles: {
                default: {
                    heading1: {
                        run: {
                            font: "Calibri",
                            size: 50,
                            bold: true,
                            color: "000000",
                            underline: {
                                type: UnderlineType.SINGLE,
                                color: "000000",
                            },
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 340 },
                        }
                    }
                }
            },
            background: {
                color: "#e5eaf4",
            },
            creator: "Logistica",
            description: `Informe de Viaje - ${travel.name}`,
            title: `Informe de Viaje -  ${travel.name}`,
            sections: [
                {
                    headers: {
                        default: new Header({
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        new TextRun({
                                            text: `Logistica`,
                                            font: "Calibri",
                                            bold: true,
                                            superScript: true,
                                            allCaps: true,
                                            size: "5mm"
                                        })
                                    ]
                                })
                            ]
                        }),
                    },
                    footers: {
                        default: new Footer({ // The standard default footer on every page or footer on odd pages when the 'Different Odd & Even Pages' option is activated
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.RIGHT,
                                    children: [
                                        new TextRun({
                                            text: `Fecha de impresion: `,
                                            font: "Calibri",
                                            bold: true,
                                            allCaps: true,
                                            size: "3mm"
                                        }),
                                        new TextRun({
                                            text: travel.datereg,
                                            font: "Calibri",
                                            allCaps: true,
                                            size: "3mm"
                                        })
                                    ]
                                })
                            ]
                        })
                    },
                    properties: {
                        type: SectionType.CONTINUOUS,
                    },
                    children: [
                        new Paragraph({
                            text: `Informe de Viaje - ${travel.name}`,
                            color: "000",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 400,
                            },
                        })
                    ]
                },
                {
                    properties: {
                        type: SectionType.CONTINUOUS
                    },
                    children: [
                        new Table({
                            verticalAlign: VerticalAlign.CENTER,
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            color: "BFBFBF",
                                            width: { size: 200, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Chofér: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.driver,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ],
                                                    spacing: {
                                                        before: 400,
                                                    },
                                                }),
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Camión: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.truck,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ]
                                                }),
                                                chest,
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Fecha de Salida: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.dateTravel,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ]
                                                }),
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Origen: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.origindesc,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ]
                                                }),
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Destino: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.routedesc,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ],
                                                    spacing: {
                                                        after: 400,
                                                    }
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                            margins: {
                                                left: 500
                                            }
                                        })
                                    ]
                                })
                            ],
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ]
                },
                {
                    properties: {
                        type: SectionType.CONTINUOUS,
                    },
                    children: [
                        new Paragraph({
                            spacing: {
                                after: 400,
                            },
                        }),
                        new Table({
                            verticalAlign: VerticalAlign.CENTER,
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            color: "BFBFBF",
                                            width: { size: 80, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: `CONCEPTO`,
                                                            bold: true,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                            shading: {
                                                fill: "42c5f4",
                                                type: ShadingType.PERCENT_95,
                                                color: "BFBFBF",
                                            },
                                        }), new TableCell({
                                            color: "BFBFBF",
                                            width: { size: 20, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: `TOTAL`,
                                                            bold: true,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                            shading: {
                                                fill: "42c5f4",
                                                type: ShadingType.PERCENT_95,
                                                color: "BFBFBF",
                                            },
                                        })
                                    ]
                                })
                            ],
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                        new Table({
                            verticalAlign: VerticalAlign.CENTER,
                            rows: travel.concepts.map((concept) => {
                                return new TableRow({
                                    children: [
                                        new TableCell({
                                            width: { size: 80, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: concept.comment,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "4mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                        }), new TableCell({
                                            width: { size: 20, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: concept.value,
                                                            font: "Arial",
                                                            allCaps: true,
                                                            size: "4mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                        })
                                    ]
                                })
                            }),
                        }),
                        new Table({
                            verticalAlign: VerticalAlign.CENTER,
                            rows: [
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            color: "BFBFBF",
                                            width: { size: 80, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: `COSTO TOTAL`,
                                                            bold: true,
                                                            font: "Algerian",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                        }), new TableCell({
                                            color: "BFBFBF",
                                            width: { size: 20, type: WidthType.PERCENTAGE },
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.CENTER,
                                                    children: [
                                                        new TextRun({
                                                            text: travel.amount,
                                                            bold: true,
                                                            font: "Algerian",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                    ]
                                                })
                                            ],
                                            verticalAlign: VerticalAlign.CENTER,
                                        })
                                    ]
                                })
                            ],
                            width: {
                                size: 100,
                                type: WidthType.PERCENTAGE,
                            },
                        }),
                    ],
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                },
                {
                    properties: {
                        type: SectionType.CONTINUOUS
                    },
                    children: [
                        new Paragraph({
                            spacing: {
                                after: 400,
                            },
                        }),
                        headerDesc,
                        tableDesc
                    ]
                },
                {
                    properties: {
                        type: SectionType.CONTINUOUS
                    },
                    children: [
                        new Paragraph({
                            text: `Datos del responsable de la carga`,
                            color: "000",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                before: 1000,
                                after: 400,
                            },
                        }),
                    ]
                },
                {
                    properties: {
                        type: SectionType.CONTINUOUS
                    },
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `NOMBRE: `,
                                    bold: true,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                }),
                                new TextRun({
                                    text: travel.driver,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `CI: `,
                                    bold: true,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                }),
                                new TextRun({
                                    text: travel.idcard,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                })
                            ]
                        }),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `Firma: .................................................................`,
                                    bold: true,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                }),
                            ],
                            spacing: {
                                before: 500,
                            },
                        }),
                    ]
                }]

        })

        const b64string = await Packer.toBase64String(doc);

        return b64string
    }
}

module.exports = new TravelReport