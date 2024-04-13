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
