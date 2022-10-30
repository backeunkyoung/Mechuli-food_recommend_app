### SGD 방식
import sys
import recommend
import pandas as pd
import numpy as np
import warnings
import time
import json
from collections import OrderedDict
import recommend as rc
# import pymysql

warnings.filterwarnings("ignore")
np.set_printoptions(threshold=sys.maxsize)
np.set_printoptions(linewidth=sys.maxsize)
pd.set_option('display.max_columns',None)
pd.set_option('display.max_rows',None)

getData = sys.argv
getUserId = getData[1]

############# 입력파일 지정
if __name__ == "__main__":
    # df_menu = pd.read_csv('./csv/cvs_food_name.csv')
    # df_ratings  = pd.read_csv('./csv/rating_rand.csv') # userId, foodId, rating
    # df_userinfo = pd.read_csv('./csv/user_random_data_export.csv')

    df_menu = pd.read_csv('D:/GitHub/food_recommend_app/SERVER/python/csv/menu_table_utf8.csv') # menu_id, menu_name, cvs_name, type_1, menu_image
    df_ratings  = pd.read_csv('D:/GitHub/food_recommend_app/SERVER/python/csv/menu_rating_table_utf8.csv')  # user_id, menu_id, score
    df_userinfo = pd.read_csv('D:/GitHub/food_recommend_app/SERVER/python/csv/userinfo_table_utf8.csv') # user_id, user_pw, user_nickname

    ###### 입력받을 곳
    # userid = 50  ## 추천을 받을 userID 정보 입력
    userid = int(getUserId)  # 추천을 받을 userID 정보 입력
    user_index = df_userinfo[df_userinfo['user_id'] == userid].index[0]
    # print(user_index)

    np.random.seed(37)  ## 난수 seed값 특정값으로 만들어서 동일 결과 도출

    st = time.time()
    
    # ratingName = ['user_id', 'menu_id', 'score']
    df_user_food_ratings = df_ratings.pivot(
        index='user_id',
        columns='menu_id',
        values='score'
    ).fillna(0)
    #print(df_userinfo)
    df_user_food_ratings = df_user_food_ratings.drop([0])
    #print(df_user_food_ratings)

    matrix = df_user_food_ratings.values
    # user_ratings_mean은 사용자의 평균 평점
    user_ratings_mean = np.mean(matrix, axis=1)
    matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)


    factorizer = recommend.MatrixFactorization(matrix, k=16, learning_rate=0.1, reg_param=0.1, epochs=100, verbose=True, print=True)
    factorizer.fit()
    factorizer.print_results()

    resultM = factorizer.print_results()
    #print(resultM.shape)
    ## df_menu = df_menu.drop(['image'], axis=1)
    #print(resultM[userid-1, :])
    df_menu['score'] = resultM[userid-1, :]
    # print("MF 결과 출력")
    # print(df_menu.head())
    rank = df_menu.sort_values('score', ascending=False)
    # print(rank.head())

    # json_data = OrderedDict()
    # for i in range(10):
    #     json_data[str(i+1)] = {'menu_id':str(rank.iloc[i, 0]),'menu_type':str(rank.iloc[i,3]) ,'store_name':str(rank.iloc[i,2]),
    #     'menu_name': rank.iloc[i, 1], 'menu_img': rank.iloc[i, 4], 'menu_rate': str(round(rank.iloc[i, 5], 1))}
    # print(json.dumps(json_data, ensure_ascii=False, indent="\t"))

    a = []
    for i in range(10):
        a.append(rank.iloc[i, 0])

    print(a)

    # et = time.time()
    ## print("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
    # print(et - st)
