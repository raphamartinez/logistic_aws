const sql = require('mssql');

var config = {
  server: process.env.DB_SERVER_HOST,
  user: process.env.G8_CONSULTA,
  password: process.env.DB_SERVER_PASSWORD,
  database: process.env.DB_SERVER_DATABASE,
  options: {
    encrypt: false, // Use this if you're on Windows Azure 
    instanceName: process.env.DB_SERVER_NAME
  }
};


class Purchase {

  //5 Concluido
  //3 En processo
  // 6 Cancelado
  /// outros Emitido

  async getOrders(search) {
    try {

      let query = `SELECT [oc].[NR_ORDEMCOMPRA] as nr_oc
            ,[oc].[DT_ENTREGA]
            ,[oc].[DT_EMISSAO] as dt_emission 
            ,[co].[DESCRICAO] as cond_faturamento
            ,[ve].[PLACA] as placa
            ,[ca].[DESCRICAO] as categoria
            ,[mo].[DESCRICAO] as modelo
            ,LEFT([pe].[PES_RAZAOSOCIAL], 11)  as proveedor
            ,LEFT([na].[DESCRICAO], 11) as naturaleza
            ,[ps].SEQPRODUTOSERVICO as cod_art
            ,[ps].[DESCRICAO] as product
            ,[oi].[QT_PRODUTO] as qt_product
            ,[oi].[VR_UNITARIO] as vlr_unitario
            ,[oi].[VR_TOTAL] as vlr_total
            ,[oc].[ID_OPER_CANCELAMENTO] as status
            ,[oc].[DT_CANCELAMENTO]
            ,[oc].[DS_MOTIVO_CANCELAMENTO]
            ,[cc].[DESCRICAO] as centro_custo,
            CASE [oc].[FG_STATUS]
            WHEN 3 THEN 'En processo'
            WHEN 5 THEN 'Concluido'
            WHEN 6 THEN 'Cancelado'
            ELSE 'Emitido'
            END as status_oc

            `

      query += ` FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
            INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
            INNER JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
            INNER JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
            INNER JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
            INNER JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
            INNER JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
            INNER JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
            INNER JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
            INNER JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]`
            

      query += ` WHERE CONVERT(date,[oc].[DT_EMISSAO] ) BETWEEN '${search.datestart}' AND '${search.dateend}' `

      if (search.numberstart) query += ` AND [oc].[NR_ORDEMCOMPRA] BETWEEN '${search.numberstart}' AND '${search.numberend}' `

      if (search.status) query += ` AND [oc].[FG_STATUS] IN ('${search.status}')`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query)

      return obj.recordset
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Purchase()