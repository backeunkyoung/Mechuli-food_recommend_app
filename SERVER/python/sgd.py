

### SGD 방식
import sys
import recommend
#from sklearn.decomposition import TruncatedSVD
#from scipy.sparse.linalg import svds

import matplotlib.pyplot as plt
import seaborn as snspip
import pandas as pd
import numpy as np
import warnings

import recommend as rc
# import pymysql

print("python code 실행중")
getData = sys.argv

result = [{'foodname' : '떡볶이', 'image_1' : '이미지1.jpg', 'image_2' : '이미지2.jpg', 'rating' : '3.5'}]
print(result)

# df_ratings  = pd.read_csv('../DB/datas/food_rating.csv') # userId, foodId, rating
# df_movies  = pd.read_csv('../DB/datas/food_name.csv')    # foodid, foodname, type_1, image

# print(" -- len -- ")
# print(len(getData))

# print("-- [0] --")
# print(getData[0])

# print("-- [1] --")
# print(getData[1])

# print("-- [2] --")
# print(dir(getData[2]))
# print(JSON.stringify(getData))
# for i in range(1, len(getData)) :
#     for j in getData[i] :
#         print(JSON.stringify(j))

# warnings.filterwarnings("ignore")
# np.set_printoptions(threshold=sys.maxsize)
# np.set_printoptions(linewidth=sys.maxsize)
# pd.set_option('display.max_columns',None)
# pd.set_option('display.max_rows',None)

# # run example
# if __name__ == "__main__":

#     df_food = pd.read_csv('./foood.csv')
#     # df_ratings  = pd.read_csv('./rating_rand.csv') # userId, foodId, rating
#     df_ratings  = pd.read_csv('./rating_export.csv') # userId, foodId, rating
#     df_userinfo = pd.read_csv('./user_random_data_export.csv')
#     df_age_sex_weight = pd.read_csv('./age_sex_weight_export.csv')
#     df_individual_weight = pd.read_csv('./individual_weight_export.csv')
#     df_food_tag = pd.read_csv('./food_tag.csv')

#     ###### 입력받을 곳
#     userid = 49  ## 추천을 받을 userID 정보 입력
#     user_index = df_userinfo[df_userinfo['user_ID'] == userid].index[0]
#     # print(user_index)
#     user_sex = df_userinfo.iloc[user_index, 1]
#     user_age = df_userinfo.iloc[user_index, 2] - df_userinfo.iloc[user_index, 2] % 10

#     sex_weight_index = df_age_sex_weight[df_age_sex_weight['weight_group'] == ("sex_" + str(user_sex))].index[0]
#     age_weight_index = df_age_sex_weight[df_age_sex_weight['weight_group'] == ("age_" + str(user_age))].index[0]
#     indi_weight_index = df_individual_weight[df_individual_weight['user_ID'] == userid].index[0]
#     # print(sex_weight_index)
#     # print(age_weight)
#     # print(indi_weight)

#     sex_per = 0.3
#     age_per = 0.3
#     indi_per = 0.4

#     np.random.seed(37)  ## 난수 seed값 특정값으로 만들어서 동일 결과 도출

#     print("---------------------------------")
#     #print(df_age_sex_weight.values)

#     #ratingname = ['userid', 'foodid', 'rating']
#     df_user_food_ratings = df_ratings.pivot(
#         index='userId',
#         columns='foodId',
#         values='rating'
#     ).fillna(0)
#     #print(df_userinfo)
#     df_user_food_ratings = df_user_food_ratings.drop([0])
#     #print(df_user_food_ratings)

#     matrix = df_user_food_ratings.values
#     # user_ratings_mean은 사용자의 평균 평점
#     user_ratings_mean = np.mean(matrix, axis=1)
#     matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)

#     factorizer = recommand.MatrixFactorization(matrix, k=16, learning_rate=0.1, reg_param=0.1, epochs=200, verbose=True)
#     factorizer.fit()

#     resultM = factorizer.print_results()
#     #print(resultM.shape)
#     df_food = df_food.drop(['image_1', 'image_2'], axis=1)
#     #print(resultM[userid-1, :])
#     df_food['rating'] = resultM[userid-1, :]
#     print("MF 결과 출력")
#     print(df_food.head())
#     rank = df_food.sort_values('rating', ascending=False)
#     print(rank.head())
#     #print(len(df_food))
#     for n in range(len(df_food)):
#         food_tag_index = df_food_tag[df_food_tag['food_tag'] == df_food.iloc[n, 3]].index[0]
#         #print(food_tag_index)
#         df_food.iloc[n, 4] += sex_per * df_age_sex_weight.iloc[sex_weight_index, food_tag_index+1] / 5.0 \
#                               + age_per * df_age_sex_weight.iloc[age_weight_index,food_tag_index+1] / 5.0 \
#                               + indi_per * df_individual_weight.iloc[indi_weight_index, food_tag_index+1]/ 5.0
#     print("가중치 부여 결과 출력")
#     print(df_food.head())
#     rank = df_food.sort_values('rating', ascending=False)
#     print(rank.head())
#     a = []
#     for i in range(10):
#         a.append(rank.iloc[i, 0])

#     print(a)