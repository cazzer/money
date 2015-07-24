angular.module('home')
	.controller('home', [
		'$scope',
		'data',
		'transactions',
		function ($scope, data, transactions) {
			'use strict';

			$scope.date = Date.now();
			$scope.time = Date.now();

			$scope.transactions = transactions || [];

			$scope.sum = function sum() {
				var total = 0;

				$scope.transactions.forEach(function (transaction) {
					total += parseInt(transaction.amount);
				});

				return total;
			};

			$scope.addTransaction = function addTransaction() {
				$scope.transactions.push({
					type: 'expense',
					amount: $scope.amount,
					description: $scope.description,
					location: null,
					timestamp: Date.now()
				});

				localStorage.setItem('transactions', JSON.stringify($scope.transactions));

				$scope.amount = null;
				$scope.description = null;
			};
		}
	]);
