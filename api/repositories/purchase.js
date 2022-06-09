const config = require('../infrastructure/database/connectionSqlServer')
const sql = require('mssql');

class Purchase {

  async getAllPurchaseOrder() {
    try {
      let query = `SELECT [oc].[NR_ORDEMCOMPRA] as nr_oc
      ,ipf.ID_COTACAOPRECO as nr_quotation
      ,[oc].[DT_EMISSAO] as dt_emission 
      ,[co].[DESCRICAO] as cond_faturamento
      ,[ve].[PLACA] as placa
      ,[ca].[DESCRICAO] as categoria
      ,[mo].[DESCRICAO] as modelo
      ,LEFT([pe].[PES_RAZAOSOCIAL], 11)  as proveedor
      ,LEFT([na].[DESCRICAO], 11) as naturaleza
      ,SUM([oi].[VR_TOTAL]) as vlr_total
      ,[ed].[MDA_SIMBOL] as coin
      ,pc.[PESCONTATO_TELEFONE] as phone
      ,pc.[PESCONTATO_NOME] as name
      ,CASE [oc].[FG_STATUS]
      WHEN 3 THEN 'En processo'
      WHEN 5 THEN 'Concluido'
      WHEN 6 THEN 'Cancelado'
      ELSE 'Emitido'
      END as status_oc
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
      LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
      LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[MOEDA] as ed on oc.ID_MOEDA = ed.[MDA_CODIGO]
      WHERE [oc].[NR_ORDEMCOMPRA] > 330 and [oc].[FG_STATUS] <> 6
      GROUP BY [oc].[NR_ORDEMCOMPRA], [oc].[DT_ENTREGA], [ipf].ID_COTACAOPRECO, [oc].[DT_EMISSAO], [co].[DESCRICAO], [ve].[PLACA], [ca].[DESCRICAO], [mo].[DESCRICAO], [pe].[PES_RAZAOSOCIAL]
      ,[na].[DESCRICAO], [ed].[MDA_SIMBOL], pc.[PESCONTATO_TELEFONE], pc.[PESCONTATO_NOME], [oc].[FG_STATUS]
      ORDER BY [oc].[NR_ORDEMCOMPRA] DESC `

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async getOrders(search) {

    try {

      let query = `SELECT [oc].[NR_ORDEMCOMPRA] as nr_oc
            ,ipf.ID_COTACAOPRECO as nr_quotation
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
            ,[cc].[DESCRICAO] as centro_custo
            ,[ed].[MDA_SIMBOL] as coin
            ,fa.DESCRICAO as model_product
            ,pc.[PESCONTATO_TELEFONE] as phone
            ,pc.[PESCONTATO_NOME] as name
            ,CASE [oc].[FG_STATUS]
            WHEN 3 THEN 'En processo'
            WHEN 5 THEN 'Concluido'
            WHEN 6 THEN 'Cancelado'
            ELSE 'Emitido'
            END as status_oc
            FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
            INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
            LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
            LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
            LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
            LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
            LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
            LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
            LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
            LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
            LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
            LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
            LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
            LEFT JOIN [G8BD].[dbo].[MOEDA] as ed on oc.ID_MOEDA = ed.[MDA_CODIGO]
            WHERE CONVERT(date,[oc].[DT_EMISSAO] ) BETWEEN '${search.datestart}' AND '${search.dateend}' `

      if (search.purchaseorders && search.purchaseorders[0] !== '' && search.purchaseorders.length > 0) query += ` AND [oc].[NR_ORDEMCOMPRA] IN (${search.purchaseorders}) `

      if (search.status && search.status[0] !== '' && search.status.length > 0) query += ` AND [oc].[FG_STATUS] IN (${search.status})`

      if (search.model) query += ` AND [mo].[DESCRICAO] = '${search.model}' `

      if (search.category) query += ` AND [ca].[DESCRICAO] = '${search.category}'`

      if (search.provider) query += ` AND pe.PES_CODIGO = '${search.provider}'`

      if (search.nature) query += ` AND [na].SEQNATTRANSACAO IN (${search.nature}) `

      if (search.centerCost) query += ` AND [oi].[ID_CENTROCUSTO] = ${search.centerCost} `

      if (search.truck) query += ` AND ip.ID_VEICULO IN (${search.truck}) `

      query += ` ORDER BY [oc].[NR_ORDEMCOMPRA] DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderGestran(oc) {
    try {

      let query = `SELECT [oc].[NR_ORDEMCOMPRA] as nr_oc
      ,ipf.ID_COTACAOPRECO as nr_quotation
      ,[oc].[DT_ENTREGA] as dt_delivery
      ,lo.BAIRRO as delivery_district
      ,lo.DESCRICAO as delivery_name
      ,lo.FONE as delivery_phone
      ,lo.ENDERECO as delivery_address
      ,lo.NUMERO_ENDERECO as delivery_number
      ,[oc].[DT_EMISSAO] as dt_emission 
      ,[co].[DESCRICAO] as cond_faturamento
      ,[ve].[PLACA] as plate
      ,UPPER([ca].[DESCRICAO]) as category
      ,UPPER([mo].[DESCRICAO]) as model
      ,[pec].PES_RAZAOSOCIAL as buyer
      ,[ca].[DESCRICAO] as categoria
      ,[mo].[DESCRICAO] as modelo
      ,[pe].[PES_RAZAOSOCIAL]  as provider
      ,[pe].PES_LOGRADOURO as provider_address
      ,[pe].PES_CNPJCPF_LISO as provider_cnpj
      ,[pe].PES_TELEFONE as provider_phone
      ,[pe].PES_BAIRRO as provider_district
      ,[pe].DS_NUM_ENDERECO as provider_number
      ,LEFT([na].[DESCRICAO], 11) as naturality
      ,[ps].SEQPRODUTOSERVICO as cod_art
      ,[ps].[DESCRICAO] as product
      ,[oi].[QT_PRODUTO] as qt_product
      ,[oi].[VR_UNITARIO] as vlr_unitario
	    ,ed.[MDA_SIMBOL] as coin
      ,[oi].[VR_TOTAL] as vlr_total
      ,[oc].[ID_OPER_CANCELAMENTO] as status
      ,[oc].[DT_CANCELAMENTO]
      ,[oc].[DS_MOTIVO_CANCELAMENTO]
      ,[cc].[DESCRICAO] as centro_custo
,pc.[PESCONTATO_TELEFONE] as phone
,pc.[PESCONTATO_NOME] as salesman
,oc.[DS_OBSERVACAO] as description
      ,CASE [oc].[FG_STATUS]
      WHEN 3 THEN 'En processo'
      WHEN 5 THEN 'Concluido'
      WHEN 6 THEN 'Cancelado'
      ELSE 'Emitido'
      END as status_oc
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB] 
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
      LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
      LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pec] on [oc].ID_COMPRADOR = [pec].[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
LEFT JOIN [G8BD].[dbo].[LOCAL] as lo on oc.ID_LOCALENTREGA = lo.SEQLOCAL
LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
LEFT JOIN [G8BD].[dbo].[MOEDA] as ed on oc.ID_MOEDA = ed.[MDA_CODIGO]
LEFT JOIN [G8BD].[dbo].[EMPRESAS] as em on oc.ID_EMPRESA = em.EMP_CODIGO WHERE [oc].[NR_ORDEMCOMPRA] = '${oc}'`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }


  async getQuotation(search) {

    try {

      let query = `SELECT cp.SEQ_COTACAOPRECOCOMPRA as id_cotacao
      ,ip.SEQ_ITENSCOTACAOPRECOCOMPRA as id_itenscotacao
      ,MAX([ab].KM) AS lastkm
      ,cp.[DT_EMISSAO] as dt_emissao
      ,[pe].[PES_RAZAOSOCIAL]  as proveedor
      ,[pe].[PES_CODIGO]  as provider_code
      ,UPPER(LEFT([na].[DESCRICAO], 12)) as naturaleza
      ,ps.SEQPRODUTOSERVICO as codproduct
      ,ps.DESCRICAO as product
	    ,fa.DESCRICAO as model_product
      ,ip.QT_PRODUTO as qtd_product
      ,ve.PLACA as truck
      ,UPPER([ca].[DESCRICAO]) as category
      ,UPPER([mo].[DESCRICAO]) as model
      ,ipf.[VR_PRODUTO] as valor_unit
      ,oi.[QT_PRODUTO] as qt_productoc
      ,oi.[VR_UNITARIO] as vlr_unitariooc
      ,oi.[VR_TOTAL] as vlr_totaloc
      ,ipf.VR_UNITARIO_ORIG as desconto
      ,ipf.[PC_DESCONTO] as descu
      ,ipf.ID_OPER_APROVACAO as stt_aprov
      ,ipf.ID_OPER_REPROVACAO as stt_reprov
	    ,oc.NR_ORDEMCOMPRA as nr_oc
      ,pc.[PESCONTATO_TELEFONE] as phone
      ,pc.[PESCONTATO_NOME] as name
      ,pg.[DESCRICAO] as grupo
      ,CASE   
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'S' THEN 'SERVICIO'
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'P' THEN 'PRODUCTO'
      END as type
      , CASE   
      WHEN ipf.ID_OPER_APROVACAO IS NULL AND ipf.ID_OPER_REPROVACAO IS NULL THEN 'PENDIENTE'
      WHEN ipf.ID_OPER_APROVACAO IS NOT NULL AND ipf.ID_OPER_REPROVACAO IS NULL THEN 'APROBADO'
	    WHEN ipf.ID_OPER_APROVACAO IS NULL AND ipf.ID_OPER_REPROVACAO IS NOT NULL THEN 'DESAPROB'
      END as status_desc
      FROM [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp
      LEFT JOIN [G8BD].[dbo].[ITENSCOTACAOPRECOCOMPRAS] as ip ON cp.SEQ_COTACAOPRECOCOMPRA =  ip.ID_COTACAOPRECO 
      LEFT JOIN [G8BD].[dbo].[COTPRECOMPRAS_FORNEC] as cf ON cp.SEQ_COTACAOPRECOCOMPRA = cf.ID_COTACAOPRECO
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA and ipf.ID_COTPRECOCOMPRAS_FORNEC = cf.SEQ_COTPRECOMPRAS_FORNEC and ipf.ID_ITENSCOTACAOPRECOCOMPRA = ip.SEQ_ITENSCOTACAOPRECOCOMPRA
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON ip.[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO_GRUPO] as pg ON ps.IDT_PRODSERVGRUPO = pg.SEQ_PRODSERVGRUPO
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on cp.[ID_NATUREZA] = [na].SEQNATTRANSACAO
  	  LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on cf.[ID_FORNECEDOR] = [pe].[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON ip.ID_VEICULO =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB] 
	    LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as oi ON ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC = oi.ID_ITEM_COTACAOPRECO
	    LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA] as [oc] ON [oi].[ID_ORDEMCOMPRA] = [oc].[SEQ_ORDEMCOMPRA] 
      LEFT JOIN [G8BD].[dbo].[ABASTECIMENTO] as [ab] ON [ve].PLACA = [ab].PLACA_VEI
      WHERE cp.SEQ_COTACAOPRECOCOMPRA > 0 AND cp.SEQ_COTACAOPRECOCOMPRA != 4 
      AND [na].SEQNATTRANSACAO NOT IN (101, 196) `

      if (search.datestart && search.dateend) query += ` AND CONVERT(date,cp.[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}' `

      if (search.provider) query += ` AND cf.[ID_FORNECEDOR] IN (${search.provider}) `

      if (search.nature) query += ` AND [na].SEQNATTRANSACAO IN (${search.nature}) `

      if (search.purchaseorders && search.purchaseorders[0] !== '' && search.purchaseorders.length > 0) query += ` AND [oc].NR_ORDEMCOMPRA IN (${search.purchaseorders}) `

      if (search.centerCost) query += ` AND [oi].[ID_CENTROCUSTO] = ${search.centerCost} `

      if (search.product) query += ` AND ip.[ID_PRODUTOSERVICO] IN (${search.product}) `

      if (search.truck) query += ` AND ip.ID_VEICULO IN (${search.truck}) `

      if (search.quotation && search.quotation.length > 0) query += ` AND cp.SEQ_COTACAOPRECOCOMPRA IN (${search.quotation}) `

      switch (search.status) {
        case '1':
          query += ` AND ipf.ID_OPER_APROVACAO IS NULL AND ipf.ID_OPER_REPROVACAO IS NULL AND cp.[DT_CANCELAMENTO] IS NULL AND cp.SEQ_COTACAOPRECOCOMPRA NOT IN (
            SELECT cp.SEQ_COTACAOPRECOCOMPRA
            FROM [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp
            LEFT JOIN [G8BD].[dbo].[ITENSCOTACAOPRECOCOMPRAS] as ip ON cp.SEQ_COTACAOPRECOCOMPRA =  ip.ID_COTACAOPRECO 
              LEFT JOIN [G8BD].[dbo].[COTPRECOMPRAS_FORNEC] as cf ON cp.SEQ_COTACAOPRECOCOMPRA = cf.ID_COTACAOPRECO
              LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA and ipf.ID_COTPRECOCOMPRAS_FORNEC = cf.SEQ_COTPRECOMPRAS_FORNEC and ipf.ID_ITENSCOTACAOPRECOCOMPRA = ip.SEQ_ITENSCOTACAOPRECOCOMPRA
            WHERE cp.SEQ_COTACAOPRECOCOMPRA > 0 AND cp.SEQ_COTACAOPRECOCOMPRA != 4  AND CONVERT(date,cp.[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}'  
            AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL
            ) `
          break;
        case '2':
          query += ` AND oc.FG_STATUS = 3 AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '3':
          query += ` AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '4':
          query += ` AND ipf.ID_OPER_REPROVACAO IS NOT NULL `
          break;
      };

      query += `  GROUP BY cp.SEQ_COTACAOPRECOCOMPRA,ip.SEQ_ITENSCOTACAOPRECOCOMPRA,cp.[DT_EMISSAO],[pe].[PES_CODIGO],ps.SEQPRODUTOSERVICO,ps.DESCRICAO, [oc].[NR_ORDEMCOMPRA], [oc].[DT_ENTREGA], [ipf].ID_COTACAOPRECO, [oc].[DT_EMISSAO], [ve].[PLACA], [ca].[DESCRICAO], [mo].[DESCRICAO], [pe].[PES_RAZAOSOCIAL]
      ,fa.DESCRICAO,ip.QT_PRODUTO,ipf.[VR_PRODUTO],oi.[QT_PRODUTO],oi.[VR_UNITARIO],oi.[VR_TOTAL],ipf.VR_UNITARIO_ORIG,ipf.[PC_DESCONTO]
	  ,ipf.ID_OPER_APROVACAO,ipf.ID_OPER_REPROVACAO,pg.[DESCRICAO],[ps].[TIPO_PRODUTOSERVICO],[na].[DESCRICAO], pc.[PESCONTATO_TELEFONE], pc.[PESCONTATO_NOME], [oc].[FG_STATUS]
	  ORDER BY SEQ_COTACAOPRECOCOMPRA DESC, pg.DESCRICAO `

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getQuotationSellers(search) {
    try {
      let query = `SELECT 
      [pe].[PES_RAZAOSOCIAL]  as proveedor
      ,pc.[PESCONTATO_NOME] as name
      ,pc.[PESCONTATO_TELEFONE] as phone
    FROM [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp
    LEFT JOIN [G8BD].[dbo].[ITENSCOTACAOPRECOCOMPRAS] as ip ON cp.SEQ_COTACAOPRECOCOMPRA =  ip.ID_COTACAOPRECO 
    LEFT JOIN [G8BD].[dbo].[COTPRECOMPRAS_FORNEC] as cf ON cp.SEQ_COTACAOPRECOCOMPRA = cf.ID_COTACAOPRECO
    LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA and ipf.ID_COTPRECOCOMPRAS_FORNEC = cf.SEQ_COTPRECOMPRAS_FORNEC and ipf.ID_ITENSCOTACAOPRECOCOMPRA = ip.SEQ_ITENSCOTACAOPRECOCOMPRA 
    LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON ip.[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
    LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO_GRUPO] as pg ON ps.IDT_PRODSERVGRUPO = pg.SEQ_PRODSERVGRUPO
    LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on cp.[ID_NATUREZA] = [na].SEQNATTRANSACAO
        LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
    LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on cf.[ID_FORNECEDOR] = [pe].[PES_CODIGO]
    LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
    LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON ip.ID_VEICULO =  [ve].[SEQVEICULOS]
    LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
    LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
          LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as oi ON ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC = oi.ID_ITEM_COTACAOPRECO  
          LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA] as [oc] ON [oi].[ID_ORDEMCOMPRA] = [oc].[SEQ_ORDEMCOMPRA]
    WHERE cp.SEQ_COTACAOPRECOCOMPRA > 0 AND cp.SEQ_COTACAOPRECOCOMPRA != 4 `

      if (search.datestart && search.dateend) query += ` AND CONVERT(date,cp.[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}' `

      if (search.provider) query += ` AND cf.[ID_FORNECEDOR] IN (${search.provider}) `

      if (search.product) query += ` AND ip.[ID_PRODUTOSERVICO] IN (${search.product}) `

      if (search.truck) query += ` AND ip.ID_VEICULO IN (${search.truck}) `

      if (search.quotation && search.quotation.length > 0) query += ` AND cp.SEQ_COTACAOPRECOCOMPRA IN (${search.quotation}) `

      if (search.purchaseorder) query += ` AND oc.SEQ_ORDEMCOMPRA IN (${search.purchaseorder}) `

      switch (search.status) {
        case '1':
          query += ` AND ipf.ID_OPER_APROVACAO IS NULL AND ipf.ID_OPER_REPROVACAO IS NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '2':
          query += ` AND oc.FG_STATUS = 3 AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '3':
          query += ` AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '4':
          query += ` AND ipf.ID_OPER_REPROVACAO IS NOT NULL `
          break;
      };

      query += ` GROUP BY [pe].[PES_RAZAOSOCIAL], pc.[PESCONTATO_NOME], pc.[PESCONTATO_TELEFONE]`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getQuotationNatures(search) {
    try {
      let query = `SELECT 
      UPPER(LEFT([na].[DESCRICAO], 12)) as naturaleza
      ,[na].[DESCRICAO] as naturalezadesc
    FROM [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp
    LEFT JOIN [G8BD].[dbo].[ITENSCOTACAOPRECOCOMPRAS] as ip ON cp.SEQ_COTACAOPRECOCOMPRA =  ip.ID_COTACAOPRECO 
    LEFT JOIN [G8BD].[dbo].[COTPRECOMPRAS_FORNEC] as cf ON cp.SEQ_COTACAOPRECOCOMPRA = cf.ID_COTACAOPRECO
    LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA and ipf.ID_COTPRECOCOMPRAS_FORNEC = cf.SEQ_COTPRECOMPRAS_FORNEC and ipf.ID_ITENSCOTACAOPRECOCOMPRA = ip.SEQ_ITENSCOTACAOPRECOCOMPRA 
    LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON ip.[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
    LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO_GRUPO] as pg ON ps.IDT_PRODSERVGRUPO = pg.SEQ_PRODSERVGRUPO
    LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on cp.[ID_NATUREZA] = [na].SEQNATTRANSACAO
        LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
    LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on cf.[ID_FORNECEDOR] = [pe].[PES_CODIGO]
    LEFT JOIN [G8BD].[dbo].[PESSOAS_CONTATOS] as pc on pe.[PES_CODIGO] = pc.[PES_CODIGO]
    LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON ip.ID_VEICULO =  [ve].[SEQVEICULOS]
    LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
    LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
          LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as oi ON ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC = oi.ID_ITEM_COTACAOPRECO  
          LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA] as [oc] ON [oi].[ID_ORDEMCOMPRA] = [oc].[SEQ_ORDEMCOMPRA]
    WHERE cp.SEQ_COTACAOPRECOCOMPRA > 0 AND cp.SEQ_COTACAOPRECOCOMPRA != 4 `

      if (search.datestart && search.dateend) query += ` AND CONVERT(date,cp.[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}' `

      if (search.provider) query += ` AND cf.[ID_FORNECEDOR] IN (${search.provider}) `

      if (search.product) query += ` AND ip.[ID_PRODUTOSERVICO] IN (${search.product}) `

      if (search.truck) query += ` AND ip.ID_VEICULO IN (${search.truck}) `

      if (search.quotation && search.quotation.length > 0) query += ` AND cp.SEQ_COTACAOPRECOCOMPRA IN (${search.quotation}) `

      if (search.purchaseorder) query += ` AND oc.SEQ_ORDEMCOMPRA IN (${search.purchaseorder}) `

      switch (search.status) {
        case '1':
          query += ` AND ipf.ID_OPER_APROVACAO IS NULL AND ipf.ID_OPER_REPROVACAO IS NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '2':
          query += ` AND oc.FG_STATUS = 3 AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '3':
          query += ` AND ipf.ID_OPER_APROVACAO IS NOT NULL AND cp.[DT_CANCELAMENTO] IS NULL`
          break;
        case '4':
          query += ` AND ipf.ID_OPER_REPROVACAO IS NOT NULL `
          break;
      };

      query += ` GROUP BY [na].[DESCRICAO]`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }


  async getProviders() {
    try {

      let query = `SELECT DISTINCT(PES_FANTASIA),
      pe.PES_CODIGO as code,
      pe.PES_FANTASIA as name
      FROM [G8BD].[dbo].[PESSOAS] as pe
      order by PES_FANTASIA asc`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getCars() {
    try {

      let query = `SELECT DISTINCT ve.PLACA,
      ve.SEQVEICULOS as code
        ,CONCAT(ve.PLACA, ' - ' ,ca.DESCRICAO, ' - ', mo.DESCRICAO) as name
        FROM [G8BD].[dbo].[VEICULOS] as ve
        LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
        LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      order by ve.PLACA asc`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }


  async getProducts() {
    try {

      let query = `SELECT DISTINCT(ps.DESCRICAO),
      ps.SEQPRODUTOSERVICO as code,
      case 
      when fa.DESCRICAO IS NOT NULL then  CONCAT(ps.DESCRICAO, ' - ',fa.DESCRICAO)
      when fa.DESCRICAO IS NULL then ps.DESCRICAO
      end as name
      FROM [G8BD].[dbo].[PRODUTOSERVICO] as [ps] 
      LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
      order by ps.DESCRICAO asc`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchaseOrders() {
    try {

      let query = `SELECT DISTINCT(oc.NR_ORDEMCOMPRA) as code, oc.NR_ORDEMCOMPRA as name 
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc] 
      ORDER BY oc.NR_ORDEMCOMPRA DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getNatures() {
    try {

      let query = `SELECT DISTINCT([na].SEQNATTRANSACAO) as code, [na].[DESCRICAO] as name 
      FROM [G8BD].[dbo].[NATTRANSACAO] as [na]
      ORDER BY [na].[DESCRICAO] ASC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getCenterCosts() {
    try {

      let query = `SELECT DISTINCT([cc].SEQCENTRORECDES) as code, [cc].[DESCRICAO] as name 
      FROM [G8BD].[dbo].[CENTRORECDES] as [cc]
      ORDER BY [cc].[DESCRICAO] ASC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getQuotationOrders() {
    try {

      let query = `SELECT DISTINCT(cp.SEQ_COTACAOPRECOCOMPRA) as code, cp.SEQ_COTACAOPRECOCOMPRA as name 
      FROM [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp 
      ORDER BY cp.SEQ_COTACAOPRECOCOMPRA DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getHistoryAuto(plate) {
    try {
      let query = `SELECT 
      ROW_NUMBER() OVER ( ORDER BY [oc].[DT_ENTREGA] ASC) as id,
      [oc].[NR_ORDEMCOMPRA] as nr_oc
      ,[oc].[DT_ENTREGA] as date
      ,[ps].[DESCRICAO] as product
      ,[cp].SEQ_COTACAOPRECOCOMPRA as id_quotation
      ,CASE   
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'S' THEN 'SERVICIO'
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'P' THEN 'PRODUCTO'
      END as type 
      ,[oi].[VR_TOTAL] as vlr_total
      ,MAX(ab.KM) as km
      ,ve.PLACA as plate
      ,UPPER([ca].[DESCRICAO]) as category
      ,pg.[DESCRICAO] as grupo
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC = oi.ID_ITEM_COTACAOPRECO
      LEFT JOIN [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO_GRUPO] as pg ON ps.IDT_PRODSERVGRUPO = pg.SEQ_PRODSERVGRUPO
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      LEFT JOIN [G8BD].[dbo].[ABASTECIMENTO] as ab ON ve.PLACA = ab.PLACA_VEI AND ( IIF(cp.[DT_EMISSAO] IS NOT NULL , CAST(cp.[DT_EMISSAO] AS DATE) , CAST([oc].[DT_ENTREGA] AS DATE)) >= CAST(ab.DATA_AFERICAO AS DATE))
      WHERE [oc].[FG_STATUS] = 5 AND ve.placa = '${plate}'
      GROUP BY [oc].[NR_ORDEMCOMPRA], [oc].[DT_ENTREGA],pg.[DESCRICAO], [ps].[DESCRICAO], [cp].SEQ_COTACAOPRECOCOMPRA, ca.DESCRICAO, [ps].[TIPO_PRODUTOSERVICO] ,[oi].[VR_TOTAL], ve.PLACA 
      ORDER BY ROW_NUMBER() OVER ( ORDER BY [oc].[DT_ENTREGA] ASC) DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getHistoryGroup(plate) {
    try {

      let query = `SELECT SUM([oi].[VR_TOTAL]) as vlr_total
      ,pg.[DESCRICAO] as grupo
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      INNER JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO_GRUPO] as pg ON ps.IDT_PRODSERVGRUPO = pg.SEQ_PRODSERVGRUPO
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      WHERE [oc].[FG_STATUS] = 5
      AND ve.placa = '${plate}'
      GROUP BY pg.[DESCRICAO]
      ORDER BY SUM([oi].[VR_TOTAL]) DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }


  async getHistory(plate) {

    try {

      let query = `SELECT 
      ROW_NUMBER() OVER ( ORDER BY [oc].[DT_ENTREGA] ASC) as id,
      [oc].[NR_ORDEMCOMPRA] as nr_oc
      ,[oc].[DT_ENTREGA] as date
      ,[ps].[DESCRICAO] as product
      ,UPPER([ca].[DESCRICAO]) as category
      ,UPPER([mo].[DESCRICAO]) as model
      ,[pe].[PES_RAZAOSOCIAL]  as proveedor
      ,CASE   
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'S' THEN 'SERVICIO'
      WHEN [ps].[TIPO_PRODUTOSERVICO] = 'P' THEN 'PRODUCTO'
      END as type 
      ,[oi].[VR_UNITARIO] as vlr_unit
      ,[oi].[QT_PRODUTO] as qtd 
      ,[oi].[VR_TOTAL] as vlr_total
	  ,fa.DESCRICAO as model_product
      ,MAX(ab.KM) as km
      ,ve.PLACA as plate
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      LEFT JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
	  LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC = oi.ID_ITEM_COTACAOPRECO
      LEFT JOIN [G8BD].[dbo].[COTACAOPRECOCOMPRAS] as cp ON ipf.ID_COTACAOPRECO = cp.SEQ_COTACAOPRECOCOMPRA 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
	  LEFT JOIN [G8BD].[dbo].[FABRICANTES] as fa on ps.IDT_FABRICANTE =  fa.SEQFABRICANTES
    LEFT JOIN [G8BD].[dbo].[COTPRECOMPRAS_FORNEC] as cf ON cp.SEQ_COTACAOPRECOCOMPRA = cf.ID_COTACAOPRECO
    LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on oc.ID_FORNECEDOR = [pe].[PES_CODIGO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB] 
	  LEFT JOIN [G8BD].[dbo].[ABASTECIMENTO] as ab ON ve.PLACA = ab.PLACA_VEI AND ( IIF(cp.[DT_EMISSAO] IS NOT NULL , CAST(cp.[DT_EMISSAO] AS DATE) , CAST([oc].[DT_ENTREGA] AS DATE)) >= CAST(ab.DATA_AFERICAO AS DATE))
      WHERE [oc].[FG_STATUS] = 5`

      if (plate) query += ` AND ve.[SEQVEICULOS] = '${plate}' `

      query += ` GROUP BY [oi].SEQ_ORDEMCOMPRA_ITENS, [VR_UNITARIO], fa.DESCRICAO, [QT_PRODUTO], [oc].[NR_ORDEMCOMPRA], [ca].[DESCRICAO], [mo].[DESCRICAO], [pe].[PES_RAZAOSOCIAL], [oc].[DT_ENTREGA], [ps].[DESCRICAO], [ps].[TIPO_PRODUTOSERVICO] ,[oi].[VR_TOTAL], ve.PLACA 
      ORDER BY ROW_NUMBER() OVER ( ORDER BY [oc].[DT_ENTREGA] ASC) DESC `

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderCategory(search) {
    try {
      let query = `SELECT CASE WHEN [ca].[DESCRICAO] IS NULL THEN 'ADM o TALLER'
      ELSE UPPER([ca].[DESCRICAO])
      END as category
      ,COUNT(DISTINCT ve.SEQVEICULOS) as cars
      ,SUM([oi].[VR_TOTAL]) as amount
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
      LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
      LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
      WHERE CONVERT(date,[oc].[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}'
      AND [oc].[FG_STATUS] != 6
      GROUP BY [ca].[DESCRICAO] 
      ORDER BY SUM([oi].[VR_TOTAL]) DESC `

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderModel(search) {
    try {
      let query = `SELECT CASE WHEN [mo].[DESCRICAO] IS NULL THEN 'ADM o TALLER'
      ELSE UPPER([mo].[DESCRICAO])
      END as model
      ,COUNT(DISTINCT ve.SEQVEICULOS) as cars
      ,SUM([oi].[VR_TOTAL]) as amount
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
      LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
      LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
      WHERE CONVERT(date,[oc].[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}' 
      AND [ca].[DESCRICAO] = '${search.category}'
      AND [oc].[FG_STATUS] != 6
      GROUP BY [mo].[DESCRICAO]
      ORDER BY SUM([oi].[VR_TOTAL]) DESC `

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  async getOrderPlate(search) {
    try {
      let query = `SELECT CASE WHEN [ve].PLACA IS NULL THEN 'ADM o TALLER'
      ELSE UPPER([ve].PLACA)
      END as plate
      ,COUNT(DISTINCT ve.SEQVEICULOS) as cars
      ,SUM([oi].[VR_TOTAL]) as amount
      FROM [G8BD].[dbo].[ORDEMCOMPRA] as [oc]
      INNER JOIN [G8BD].[dbo].[ORDEMCOMPRA_ITENS] as [oi] ON [oc].[SEQ_ORDEMCOMPRA] = [oi].[ID_ORDEMCOMPRA]
      LEFT JOIN [G8BD].[dbo].[ITENSPRECOCOMPRAS_FORNEC] as ipf ON oi.ID_ITEM_COTACAOPRECO = ipf.SEQ_ITENSPRECOCOMPRAS_FORNEC 
      LEFT JOIN [G8BD].[dbo].[PRODUTOSERVICO] as [ps] ON [oi].[ID_PRODUTOSERVICO] = [ps].[SEQPRODUTOSERVICO]
      LEFT JOIN [G8BD].[dbo].[VEICULOS] as [ve] ON [oi].ID_VEICULOS =  [ve].[SEQVEICULOS]
      LEFT JOIN [G8BD].[dbo].[CATEGORIASVEI] as [ca] ON [ve].[IDTCATEGORIASVEI] = [ca].[SEQCATEGORIASVEI]
      LEFT JOIN [G8BD].[dbo].[MODELOSFAB] as [mo] ON [ve].[IDTMODELOSFAB] = [mo].[SEQMODELOSFAB]
      LEFT JOIN [G8BD].[dbo].[NATTRANSACAO] as [na] on [oc].[ID_NATUREZA] = [na].SEQNATTRANSACAO
      LEFT JOIN [G8BD].[dbo].[CONDICAO_FATURAMENTO] as [co] on [oc].[ID_CONDICAOFATURAMENTO] = [co].SEQ_CONDFATURAMENTO
      LEFT JOIN [G8BD].[dbo].[CENTRORECDES] as [cc] on [oi].[ID_CENTROCUSTO] = [cc].SEQCENTRORECDES
      LEFT JOIN [G8BD].[dbo].[PESSOAS] as [pe] on [oc].[ID_FORNECEDOR] = [pe].[PES_CODIGO]
      WHERE CONVERT(date,[oc].[DT_EMISSAO]) BETWEEN '${search.datestart}' AND '${search.dateend}' 
      AND [mo].[DESCRICAO] = '${search.model}'
      AND [oc].[FG_STATUS] != 6
      GROUP BY [ve].PLACA
      ORDER BY SUM([oi].[VR_TOTAL]) DESC`

      await sql.connect(config);

      let request = new sql.Request();

      const obj = await request.query(query);

      return obj.recordset;
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = new Purchase()