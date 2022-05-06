### SGD 방식
import sys

from sklearn.decomposition import TruncatedSVD
from scipy.sparse.linalg import svds

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import warnings
#import pymysql
warnings.filterwarnings("ignore")
##np.set_printoptions(threshold=sys.maxsize, linewidth=sys.maxsize)
##pd.set_option('display.max_columns',None)
##pd.set_option('display.max_rows',None)

df_ratings  = pd.read_csv('./DB/datas/food_rating.csv') # userId, foodId, rating
df_movies  = pd.read_csv('./DB/datas/food_name.csv')    # foodid, foodname, type_1, image

df_user_movie_ratings = df_ratings.pivot(   # 행, 렬, 값 설정
    index='userId',
    columns='foodId',
    values='rating'
).fillna(0) # 모든 NaN 값을 0으로 바꿈
print(df_user_movie_ratings.head()) # .head 옵션으로 데이터의 상단 부분(head)출력, 기본값은 n = 5

# matrix는 pivot_table 값을 numpy matrix로 만든 것 ( 값 value만 저장 )
matrix = df_user_movie_ratings.values
# print(matrix)
# print(matrix.shape) # 차원 확인 (행, 열)

# user_ratings_mean은 사용자의 평균 평점-=> axis = 1 : 열 방향으로 동작
user_ratings_mean = np.mean(matrix, axis = 1)
# print(user_ratings_mean)

# R_user_mean : 사용자-영화 평점(value)에 대해 사용자 평균 평점을 뺀 것. 사용자 평균 평점은 (원본 행 개수, 1)의 행렬로 재구조화 후 계산
matrix_user_mean = matrix - user_ratings_mean.reshape(-1, 1)
# print(matrix_user_mean)

class MatrixFactorization():
    # MatrixFactorization(matrix, k=3, learning_rate=0.01, reg_param=0.01, epochs=300, verbose=True)
    def __init__(self, R, k, learning_rate, reg_param, epochs, verbose=False):
        """
        :param R: rating matrix
        :param k: latent parameter ( 잠재 행렬 크기 )
        :param learning_rate: alpha on weight update
        :param reg_param: beta on weight update
        :param epochs: training epochs  ( 학습 횟수 )
        :param verbose: print status
        """

        self._R = R
        self._num_users, self._num_items = R.shape
        self._k = k
        self._learning_rate = learning_rate
        self._reg_param = reg_param
        self._epochs = epochs
        self._verbose = verbose


    def fit(self):
        """
        training Matrix Factorization : Update matrix latent weight and bias

        참고: self._b에 대한 설명
        - global bias: input R에서 평가가 매겨진 rating의 평균값을 global bias로 사용
        - 정규화 기능. 최종 rating에 음수가 들어가는 것 대신 latent feature에 음수가 포함되도록 해줌.

        :return: training_process
        """

        # init latent features => 원본 data 행렬을 2개의 하위 행렬(P, Q)로 분해
        self._P = np.random.normal(size=(self._num_users, self._k))
        self._Q = np.random.normal(size=(self._num_items, self._k))

        # init biases => 
        self._b_P = np.zeros(self._num_users)
        self._b_Q = np.zeros(self._num_items)
        self._b = np.mean(self._R[np.where(self._R != 0)])

        # train while epochs
        self._training_process = []
        for epoch in range(self._epochs):

            # rating이 존재하는 index를 기준으로 training
            for i in range(self._num_users):
                for j in range(self._num_items):
                    if self._R[i, j] > 0:
                        self.gradient_descent(i, j, self._R[i, j])
            cost = self.cost()
            self._training_process.append((epoch, cost))

            # print status
            if self._verbose == True and ((epoch + 1) % 10 == 0):
                print("Iteration: %d ; cost = %.4f" % (epoch + 1, cost))


    # 예측 오차(실제값 - 예측값) 구하기 
    def cost(self):
        """
        compute root mean square error
        :return: rmse cost
        """
        # xi, yi : R[xi, yi]는 nonzero인 value를 의미한다. => nonzero 함수 : 요소들 중 0이 아닌 값들의 index들을 반환해 주는 함수
        # 참고: http://codepractice.tistory.com/90
        xi, yi = self._R.nonzero()
        predicted = self.get_complete_matrix()
        cost = 0

        # RMSE(Root Mean Square Error) : 평균 제곱근 오차
        # => 정확도 지표 RMSE를 향상시키기 위해서 오차의 제곱을 최소화 해야 하기 때문에 오차의 제곱식 반환(gd방식 사용)
        for x, y in zip(xi, yi):
            cost += pow(self._R[x, y] - predicted[x, y], 2)

        return np.sqrt(cost) / len(xi)

    # 하위 행렬 (latent feature) 값 갱신
    def gradient(self, error, i, j):
        """
        gradient of latent feature for GD

        :param error: rating - prediction error
        :param i: user index
        :param j: item index
        :return: gradient of latent feature tuple
        """
        dp = (error * self._Q[j, :]) - (self._reg_param * self._P[i, :])
        dq = (error * self._P[i, :]) - (self._reg_param * self._Q[j, :])
        return dp, dq

    # sgd = > gd의 개념 : 미분을 통해 기울기를 알아내서 기울기의 +-값에 따라 조정을 한다.
    def gradient_descent(self, i, j, rating):
        """
        graident descent function

        :param i: user index of matrix
        :param j: item index of matrix
        :param rating: rating of (i,j)
        """

        # get error
        prediction = self.get_prediction(i, j)
        error = rating - prediction

        # update biases ( 편향 업데이트 )
        self._b_P[i] += self._learning_rate * (error - self._reg_param * self._b_P[i])
        self._b_Q[j] += self._learning_rate * (error - self._reg_param * self._b_Q[j])

        # update latent feature ( 가중치 없데이트 )
        dp, dq = self.gradient(error, i, j)
        self._P[i, :] += self._learning_rate * dp
        self._Q[j, :] += self._learning_rate * dq


    def get_prediction(self, i, j):
        """
        get predicted rating: user_i, item_j
        :return: prediction of r_ij
        """
        return self._b + self._b_P[i] + self._b_Q[j] + self._P[i, :].dot(self._Q[j, :].T)


    def get_complete_matrix(self):
        """
        computer complete matrix PXQ + P.bias + Q.bias + global bias

        - PXQ 행렬에 b_P[:, np.newaxis]를 더하는 것은 각 열마다 bias를 더해주는 것
        - b_Q[np.newaxis:, ]를 더하는 것은 각 행마다 bias를 더해주는 것
        - b를 더하는 것은 각 element마다 bias를 더해주는 것

        - newaxis: 차원을 추가해줌. 1차원인 Latent들로 2차원의 R에 행/열 단위 연산을 해주기위해 차원을 추가하는 것.

        :return: complete matrix R^
        """
        return self._b + self._b_P[:, np.newaxis] + self._b_Q[np.newaxis:, ] + self._P.dot(self._Q.T)


    def print_results(self):
        """
        print fit results
        """

        print("User Latent P:")
        print(self._P)
        print("Item Latent Q:")
        print(self._Q.T)
        print("P x Q:")
        print(self._P.dot(self._Q.T))
        print("bias:")
        print(self._b)
        print("User Latent bias:")
        print(self._b_P)
        print("Item Latent bias:")
        print(self._b_Q)
        print("Final R matrix:")
        print(self.get_complete_matrix())
        print("Final RMSE:")
        print(self._training_process[self._epochs-1][1])

# run example => 메인 함수 실행
if __name__ == "__main__":
    # rating matrix - User X Item : (7 X 5)
    # R = np.array([
    #     [1, 0, 0, 1, 3],
    #     [2, 0, 3, 1, 1],
    #     [1, 2, 0, 5, 0],
    #     [1, 0, 0, 4, 4],
    #     [2, 1, 5, 4, 0],
    #     [5, 1, 5, 4, 0],
    #     [0, 0, 0, 1, 0],
    # ])

    # P, Q is (7 X k), (k X 5) matrix
    factorizer = MatrixFactorization(matrix, k=3, learning_rate=0.01, reg_param=0.01, epochs=300, verbose=True)
    # factorizer.fit()
    # factorizer.print_results()
