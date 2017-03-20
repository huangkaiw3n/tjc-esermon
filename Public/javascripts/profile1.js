var app = angular.module('StarterApp', ['ngMaterial','ngRoute'])

//----------------- Controller for generating discover cards-----------------//
app.controller('CardGen', function($scope,$http, $mdDialog, $window, $sce, $timeout){


    $scope.query = "";
    $scope.words = [];

    $scope.sermons = [{title:'The story of Genesis', chineseTitle: '创世纪', speaker: 'Pr Simon Chin', speakerChinese: '英漢字典', date: '12-01-2017', venue: 'Adam Road', link:'www.google.com', serial:'1001'},
    {title:'The story of Genesis', chineseTitle: '创世纪', speaker: 'Pr Simon Chin', speakerChinese: '英漢字典', date: '12-01-2017', venue: 'Adam Road', link:'www.google.com', serial:'1002'},
    {title:'The story of Genesis', chineseTitle: '创世纪', speaker: 'Pr Simon Chin', speakerChinese: '英漢字典', date: '12-01-2017', venue: 'Adam Road', link:'www.google.com', serial:'1003'}

    ]

    $scope.show = function(){
      console.log($scope.query);
    }

    $scope.split = function(){
      $scope.words = $scope.cards;
    }

    $scope.search = function(){
        $scope.words = $scope.query.split(" ");
        var query = "http://localhost:8983/solr/stacks/query?&q=title:";
        for (var i=0; i< $scope.words.length; i++){
            query = query + '*"'+$scope.words[i]+'"*';
        }
        query = query+"&fl=*,score";
        $http({
            method: 'POST',
            url: query,
            data: {}
        }).then(function successCallback(res) {
            $scope.words = ranking(res.data.response.docs);
        });
    }

    $scope.nav = function(path){
        // window.location.assign(path);
        window.location.href = "//" + path;
    };

    $scope.tutgo = function() {
        console.log($scope.query);
        $http({
            method: 'POST',
            url: "http://localhost:8983/solr/stacks/query",
            data: {query:'title:*"java"*'}
        }).then(function successCallback(res) {
            console.log(res);
            $scope.words = res.data.response.docs;
        });
    };

    $scope.getpic = function(url) {
        if (url.indexOf("chemistry")>0){
            return "https://lh6.ggpht.com/eOJyq2oN2c2EyfzKEZnFOe8cmhKkenRJJ8y637-fZRQKccLqTA4RyFbMqNf0MXeflQ=w300";
        }
        else if(url.indexOf("mathoverflow")>0){
            return "http://cdn.sstatic.net/Sites/mathoverflow/img/apple-touch-icon@2.png?v=791790e97b5c&a";
        }
        else{
            return "http://www.skrenta.com/images/stackoverflow.jpg";
        }
    };

    function ranking(results){
        var score = [];
        var votes = [];
        for(var i=0; i<results.length; i++){
            score[i]= results[i].score;
            votes[i]= results[i].votes[0];
        }

        var maxScore = Math.max.apply(Math, score);
        var maxVotes = Math.max.apply(Math, votes);
        var minVotes = Math.min.apply(Math, votes);

        for(var i=0; i<results.length; i++){
            var nScore = normScore(results[i].score,maxScore);
            var nVotes = normVotes(results[i].votes[0],maxVotes,minVotes);
            var nRank = nScore+nVotes;
            results[i].score = nRank;
        }
        results.sort(function(a, b) {
            return parseFloat(b.score) - parseFloat(a.score);
        });
        console.log(results);
        return results;
    }

    //normalising the score
        function normScore(score, maxScore){
            return (score/maxScore);
        }

    //normalising the votes
        function normVotes(votes, maxVotes, minVotes){
            votes = Math.log(votes);
            maxVotes = Math.log(maxVotes);
            minVotes = Math.log(minVotes);
            return (1/(maxVotes-minVotes))*(votes-maxVotes)+1;
        }

});







