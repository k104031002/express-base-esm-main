import express from 'express'
const router = express.Router()

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 資料庫使用
import sequelize from '#configs/db.js'
const { My_Product } = sequelize.models

// 一般sql
import db from '#configs/mysql.js'

// 列表頁
// my-products?brand_ids=1,2&name_like=pixel&price_gte=10000&price_lte=15000&sort=price&order=asc&page=1&perpage=5
router.get('/', async function (req, res) {
  // 先解構獲取每個query string的值
  const {
    page = 1, // number,  用於 OFFSET =  (Number(page) - 1) * Number(perpage),
    perpage = 10, // number, 用於 LIMIT
    name_like = '', // string, 對應 name 欄位, `name LIKE '%name_like%'`
    brand_ids = '', // string, 對應 brand_id 欄位,  `brand_id IN (brand_ids)`
    sort = 'price', // string, 排序欄位 用於 ORDER BY
    order = 'asc', // string, 排序順序 用於 ORDER BY 'asc' | 'desc', 預設為'asc'
    price_gte = 5000, // number, 對應 price 欄位, `price >= 1500`
    price_lte = 100000, // number, 對應 price 欄位, `price <= 10000` } = req.query
  } = req.query

  //  測試用
  // console.log(
  //   page,
  //   perpage,
  //   name_like,
  //   brand_ids,
  //   sort,
  //   order,
  //   price_gte,
  //   price_lte
  // )

  // 處理如果沒找到資料

  // 建立資料庫搜尋條件(where從句用)，每個條件用陣列存放，串接時用join(' AND ')
  const conditions = []

  // 名稱  LIKE is not case sensitive(英文大小寫無關)
  conditions[0] = name_like ? `name LIKE '%${name_like}%'` : ''

  // 品牌，brand_ids 使用 `brand_id IN (1,2,3)`
  conditions[1] = brand_ids ? `brand_id IN (${brand_ids})` : ''

  // 價格大於，price_gte 使用 `price >= 5000`
  conditions[2] = price_gte ? `price >= ${price_gte}` : ''

  // 價格小於，price_lte 使用 `price <= 10000`
  conditions[3] = price_lte ? `price <= ${price_lte}` : ''

  // 去除空字串
  const conditionsValues = conditions.filter((v) => v)

  // 各條件需要先包含在`()`中，因各自內查詢是OR, 與其它的是AND
  const where =
    conditionsValues.length > 0
      ? `WHERE ` + conditionsValues.map((v) => `( ${v} )`).join(` AND `)
      : ''

  // 排序用
  const orderby = `ORDER BY ${sort} ${order}`

  // 分頁用
  // page預設為1，perpage預設為3
  const perpageNow = Number(perpage) || 3
  const pageNow = Number(page) || 1
  const limit = perpageNow
  // page=1 offset=0; page=2 offset= perpage * 1; ...
  const offset = (pageNow - 1) * perpageNow

  // 最終組合的sql語法
  const sqlProducts = `SELECT * FROM my_product ${where} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  // 最終組合的sql語法(計數用)
  const sqlCount = `SELECT COUNT(*) AS count FROM my_product ${where}`

  // 顯示sql語法
  console.log(sqlProducts)
  console.log(sqlCount)

  //const products = await My_Product.findAll({ logging: console.log })

  // 使用原本的mysql2+sql的查詢方式
  const [rows, fields] = await db.query(sqlProducts)

  console.log(rows)

  const [rows2] = await db.query(sqlCount)
  // 回傳總筆數
  const total = rows2[0].count

  // 計算頁數
  const pageCount = Math.ceil(total / Number(perpage)) || 0

  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total,
      pageCount,
      products: rows,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = getIdParam(req)

  const product = await My_Product.findByPk(id, {
    raw: true, // 只需要資料表中資料
  })

  return res.json({ status: 'success', data: { product } })
})

export default router
