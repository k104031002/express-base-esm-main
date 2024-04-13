-- 單選: 找出品牌為Apple的商品(查詢字串qs:brand_id=1)
SELECT * 
FROM my_product 
WHERE brand_id = 1;

--複選: 找出品牌為Apple或Google的商品(查詢字串qs:brand_ids=1,2)
SELECT * 
FROM my_product 
WHERE brand_id IN (1,2);

-- 關鍵字: 找出名稱中有Pixel的商品(查詢字串qs: name_like=pixel)
-- LIKE條件英文大小寫無差異
SELECT * 
FROM my_product 
WHERE name LIKE '%pixel%';

-- 價格: 介於10000~15000的商品 (查詢字串qs: price_gte=10000&price_lte=15000)
-- 參考: json的restful參數設計-https://github.com/typicode/json-server?tab=readme-ov-file#conditions
-- 第一種語法: 用AND加>= 和 <=
SELECT * 
FROM my_product 
WHERE price >= 10000 AND price <= 15000;

-- 第二種語法: 用BETWEEN
SELECT * 
FROM my_product 
WHERE price BETWEEN 10000 AND 15000;


-- 排序: 價格依低到高(ASC) 或高到低(DESC) (查詢字串qs: sort=price&order=asc)
SELECT *
FROM my_product
ORDER BY price ASC;
-- ORDER BY price DESC;

-- 分頁: 目前是第page頁，每頁perpage個( (查詢字串qs: page=1&perpage=5)
-- 套用公式:
-- limit = perpage
-- page = 1 offset = 0 ; page=2 offset=perpage*1 ===> offset=(page-1)*perpage
-- 依查詢條件查出目前頁數的資料
SELECT *
FROM my_product
WHERE brand_id IN(1,2)
LIMIT 2 OFFSET 0;

-- 計算目前的條件下有多少結果(註:回應total筆數和pageCount總頁數)
SELECT COUNT(*)
FROM my_product
WHERE brand_id IN (1,2)