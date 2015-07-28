angular.module('day')
	.controller('day', [
		'$scope',
		'$stateParams',
		'dropbox',
		'transactions',
		function ($scope, $stateParams, dropbox, transactions) {
			'use strict';

			var day = $stateParams.year + '/' + $stateParams.month + '/' + $stateParams.day;

			$scope.transactions = transactions;

			$scope.sum = function sum() {
				var total = 0;

				$scope.transactions.forEach(function (transaction) {
					total += parseInt(transaction.amount);
				});

				return total;
			};

			$scope.addTransaction = function addTransaction() {
				var transaction = {
					amount: $scope.amount,
					description: $scope.description,
					timestamp: new Date()
				};

				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function (location) {
						transaction.location = {
							longitude: location.coords.longitude,
							latitude: location.coords.latitude
						};

						actuallyAddTransaction(transaction)
					});
				} else {
					actuallyAddTransaction(transaction);
				}
			};

			function actuallyAddTransaction(transaction) {
				$scope.transactions.push(transaction);
				dropbox.saveDay($scope.transactions, day);
				$scope.amount = null;
				$scope.description = null;
				$scope.time = new Date();
			}

			$scope.removeTransaction = function removeTransaction(index) {
				$scope.transactions.splice(index, 1);
				dropbox.saveDay($scope.transactions);
			};

			$scope.addRecurringTransactions = function addRecurringTransactions() {
				dropbox
					.getRecurring()
					.then(function (transactions) {
						var now = new Date();
						var year = now.getFullYear();
						// get the number of days in this month
						var daysInMonth = new Date(year, now.getMonth(), 0).getDate();
						// get the number of days in this year
						var daysInYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0) ? 366 : 365;

						transactions.forEach(function (transaction) {
							var divisor;
							switch (transaction.frequency) {
								case 'weekly':
									divisor = 7;
									break;
								case 'monthly':
									divisor = daysInMonth;
									break;
								case 'yearly':
									divisor = daysInYear;
									break;
								default:
									divisor = 1;
									break;
							}

							transaction.amount = Math.round((transaction.amount / divisor) * 100) / 100;
							$scope.transactions.push(transaction);
						});

						dropbox.saveDay($scope.transactions, day);
					});
			}
		}
	]);
