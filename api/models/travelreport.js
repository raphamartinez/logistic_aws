const { InvalidArgumentError, InternalServerError, NotFound } = require('./error')
const Repositorie = require('../repositories/travelreport')
const RepositorieTravel = require('../repositories/travel')
const docx = require('docx');
const { AlignmentType, Document, ShadingType, WidthType, VerticalAlign, BorderStyle, SectionType, Footer, Header, HeadingLevel, Packer, Paragraph, TextRun, UnderlineType, Table, TableCell, TableRow } = docx;
const xl = require('excel4node');
const { writeFile } = require('fs');
const puppeteer = require('puppeteer')

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
                            spacing: { line: 200 },
                        }
                    },
                    heading3: {
                        run: {
                            font: "Calibri",
                            size: 40,
                            bold: true,
                            color: "000000"
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 180 },
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
                            text: `Orden de Trabajo`,
                            color: "000",
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 200,
                            },
                        }),
                        new Paragraph({
                            text: `Informe de Viaje`,
                            color: "000",
                            heading: HeadingLevel.HEADING_3,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 100,
                            },
                        }),
                        new Paragraph({
                            text: `${travel.typedesc}`,
                            color: "000",
                            heading: HeadingLevel.HEADING_3,
                            alignment: AlignmentType.CENTER,
                            spacing: {
                                after: 100,
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
                                                            text: `Chof??r: `,
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
                                                new Paragraph(travel.companion_name ? {
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Acompa??ante: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.companion_name,
                                                            font: "Calibri",
                                                            allCaps: true,
                                                            size: "5mm"
                                                        })
                                                    ]
                                                } : {}),
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Cami??n: `,
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
                                                            text: `Salida: `,
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
                                                            text: `Punto de Retiro: `,
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
                                                    ]
                                                }),
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
                                                    children: [
                                                        new TextRun({
                                                            text: `Punto de Entrega: `,
                                                            font: "Calibri",
                                                            bold: true,
                                                            allCaps: true,
                                                            size: "5mm"
                                                        }),
                                                        new TextRun({
                                                            text: travel.deliverydesc,
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
                                after: 300,
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
                                before: 500,
                                after: 300,
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
                                before: 300,
                            },
                        }),
                        new Paragraph(travel.companion_name ? {
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: `ACOMPA??ANTE: `,
                                    bold: true,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                }),
                                new TextRun({
                                    text: travel.companion_name,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                })
                            ],
                            spacing: {
                                before: 400,
                            },
                        } : {}),
                        new Paragraph(travel.companion_idcard ? {
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
                                    text: travel.companion_idcard,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                })
                            ]
                        } : {}),
                        new Paragraph(travel.companion_name ? {
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
                                before: 400,
                            },
                        } : {}),
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new TextRun({
                                    text: travel.period,
                                    bold: true,
                                    font: "Calibri",
                                    allCaps: true,
                                    size: "5mm"
                                }),
                            ],
                            spacing: {
                                before: 200,
                            },
                        })
                    ]
                }]

        })

        const b64string = await Packer.toBase64String(doc);

        return b64string
    }


    async printFile(url) {
        const browser = await puppeteer.launch({
            headless: false,
            slowMo: 2000,
            args: ['--no-sandbox'],
        })
        const page = await browser.newPage()

        await page.goto(url, {
            waitUntil: 'networkidle0'
        })
        await page.waitForTimeout(4000)

        const pdf = await page.pdf({
            printBackground: true,
            format: 'A4'
        })

        const b64string = await Packer.toBase64String(pdf);


        return b64string
    }

    async reportStrategic(day, dateend) {
        try {

            const dayD = new Date(day)
            const monthIn = dayD.getMonth() + 1 > 9 ? dayD.getMonth() + 1 : `0${dayD.getMonth() + 1}`
            const dayIn = dayD.getDate() > 9 ? dayD.getDate() : `0${dayD.getDate()}`
            const dayInit = `${dayD.getFullYear()}-${monthIn}-${dayIn}`

            let dayEnd = false
            if (dateend) {
                const dt = new Date(dateend)
                const monthEn = dt.getMonth() + 1 > 9 ? dt.getMonth() + 1 : `0${dt.getMonth() + 1}`
                const dayEn = dt.getDate() > 9 ? dt.getDate() : `0${dt.getDate()}`
    
                dayEnd = `${dt.getFullYear()}-${monthEn}-${dayEn}`
            }

            let data = await RepositorieTravel.reportStrategic(dayInit, dayEnd)
            if (data.length === 0) return null

            return data
        } catch (error) {
            console.log(error);
            throw new InternalServerError('Error.')
        }
    }
}

module.exports = new TravelReport