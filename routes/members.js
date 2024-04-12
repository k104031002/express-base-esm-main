import express from 'express'
const router = express.Router()

// 資料庫使用
import sequelize from '#configs/db.js'
const { Member } = sequelize.models

import db from '#configs/mysql.js'

router.post('/raw-sql', async function (req, res, next) {
  console.log(req.body)

  // 要新增的會員資料
  const newUser = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newUser.username ||
    !newUser.email ||
    !newUser.name ||
    !newUser.password
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }
  // 檢查資料表中有沒有此email或username
  const [rows] = await db.query(
    'SELECT * FROM member WHERE username=? OR email=?',
    [newUser.username, newUser.email]
  )
  console.log(rows)

  if (rows.length > 0) {
    return res.json({ status: 'error', message: '會員帳號或Email重覆' })
  }

  // INSERT INTO `member`(`name`,`email`,`username`,`password`) VALUES('nnn','eee','uuu','ppp');
  const [rows2] = await db.query(
    'INSERT INTO `member`(`name`,`email`,`username`,`password`) VALUES(?,?,?,?)',
    [newUser.name, newUser.email, newUser.username, newUser.password]
  )

  console.log(rows2)
  // 新增失敗 !rows2.insertId 代表沒新增
  if (!rows2.insertId) {
    return res.json({ status: 'error', message: '建立會員失敗' })
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})

router.post('/', async function (req, res, next) {
  console.log(req.body)

  // 要新增的會員資料
  const newUser = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newUser.username ||
    !newUser.email ||
    !newUser.name ||
    !newUser.password
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 執行後user是建立的會員資料，created為布林值
  // where指的是不可以有相同的資料，如username與email不能有相同的
  // defaults用於建立新資料用
  const [user, created] = await Member.findOrCreate({
    where: { username: newUser.username, email: newUser.email },
    defaults: {
      name: newUser.name,
      password: newUser.password,
    },
  })
  // 新增失敗 created=false 代表沒新增
  if (!created) {
    return res.json({ status: 'error', message: '建立會員失敗' })
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'memebers' })
})

export default router
