import sys
sys.path.insert(0,"C:/Users/eun20/AppData/Local/Programs/Python/Python39/Lib/site-packages")

import warnings

import pandas as pd
import sys
import pymysql
from datetime import datetime

warnings.filterwarnings("ignore")

# 판다스 라이브러리를 활용한 데이터 추출 코드

# DB 접속 정보
conn = pymysql.connect(host='13.209.81.127', user='user', password='user', db='mechuli_schema', charset='utf8')

# query문 csv 파일로 저장
query = 'SELECT * FROM mechuli_schema.userinfo_table;'
df = pd.read_sql_query(query, conn)
df.to_csv(r'D:/GitHub/food_recommend_app/SERVER/python/csv/userinfo_table_utf8_2.csv', index=False)

query = 'SELECT * FROM mechuli_schema.menu_rating_table;'
df = pd.read_sql_query(query, conn)
df.to_csv(r'D:/GitHub/food_recommend_app/SERVER/python/csv/menu_rating_table_utf8_2.csv', index=False)

query = 'SELECT * FROM mechuli_schema.menu_table;'
df = pd.read_sql_query(query, conn)
df.to_csv(r'D:/GitHub/food_recommend_app/SERVER/python/csv/menu_table_utf8_2.csv', index=False)
