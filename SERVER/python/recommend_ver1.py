# import matplotlib.pyplot as plt
import seaborn as snspip
import pandas as pd
import numpy as np
import sys
import warnings

warnings.filterwarnings("ignore")
np.set_printoptions(threshold=sys.maxsize)
np.set_printoptions(linewidth=sys.maxsize)
pd.set_option('display.max_columns',None)
pd.set_option('display.max_rows',None)

class MatrixFactorization():
    def __init__(self, R, k, learning_rate, reg_param, epochs, verbose=False, print=False):
        self._R = R
        self._num_users, self._num_items = R.shape
        self._k = k
        self._learning_rate = learning_rate
        self._reg_param = reg_param
        self._epochs = epochs
        self._verbose = verbose
        self.print = print

    def fit(self):
        # init latent features
        self._P = np.random.normal(0,1 / self._k,size=(self._num_users, self._k))
        self._Q = np.random.normal(0,1 / self._k,size=(self._num_items, self._k))

        # init biases
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
            # if self._verbose == True and ((epoch + 1) % 10 == 0):
            #     print("Iteration: %d ; cost = %.4f" % (epoch + 1, cost))

    def cost(self):
        xi, yi = self._R.nonzero()
        predicted = self.get_complete_matrix()
        cost = 0
        for x, y in zip(xi, yi):
            cost += pow(self._R[x, y] - predicted[x, y], 2)
        return np.sqrt(cost) / len(xi)


    def gradient(self, error, i, j):
        dp = (error * self._Q[j, :]) - (self._reg_param * self._P[i, :])
        dq = (error * self._P[i, :]) - (self._reg_param * self._Q[j, :])
        return dp, dq


    def gradient_descent(self, i, j, rating):
        # get error
        prediction = self.get_prediction(i, j)
        error = rating - prediction

        # update biases
        self._b_P[i] += self._learning_rate * (error - self._reg_param * self._b_P[i])
        self._b_Q[j] += self._learning_rate * (error - self._reg_param * self._b_Q[j])

        # update latent feature
        dp, dq = self.gradient(error, i, j)
        self._P[i, :] += self._learning_rate * dp
        self._Q[j, :] += self._learning_rate * dq

    def get_prediction(self, i, j):

        return self._b + self._b_P[i] + self._b_Q[j] + self._P[i, :].dot(self._Q[j, :].T)


    def get_complete_matrix(self):
        return self._b + self._b_P[:, np.newaxis] + self._b_Q[np.newaxis:, ] + self._P.dot(self._Q.T)

    def print_results(self):
        if self.print:
            # print("User Latent P:")
            # print(self._P)
            # print("Item Latent Q:")
            # print(self._Q.T)
            # print("P x Q:")
            # print(self._P.dot(self._Q.T))
            # print("bias:")
            # print(self._b)
            # print("User Latent bias:")
            # print(self._b_P)
            # print("Item Latent bias:")
            # print(self._b_Q)
            print("Final R matrix:")
            print(self.get_complete_matrix())
            print("Final RMSE:")
            print(self._training_process[self._epochs-1][1])
        a = self.get_complete_matrix()
        return a
