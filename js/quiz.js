(function(){ 

  angular.module('myQuiz', []).run(function() {
      FastClick.attach(document.body);
});

	var app = angular.module('myQuiz',['smoothScroll']);

  app.filter('html', ['$sce', function ($sce) { 
    return function (text) {
        return $sce.trustAsHtml(text);
    };    
}])

	app.controller('QuizController', ['$scope','$http','$sce',function($scope,$http,$sce){
    
        $scope.score = 0;
        $scope.activeQuestion = -1;
        $scope.activeQuestionAnswered = 0;
        $scope.percentage = 0;
        $scope.result = '测试结果';

        $http.get('quiz_data.json').then(function(quizData){
          $scope.myQuestions = quizData.data;
          $scope.totalQuestions = $scope.myQuestions.length;
        });
        
        $scope.selectAnswer = function(qIndex,aIndex) {
          
          var questionState = $scope.myQuestions[qIndex].questionState;
          
          if( questionState != 'answered' ){
              $scope.myQuestions[qIndex].selectedAnswer = aIndex;
              var correctAnswer = $scope.myQuestions[qIndex].correct;
              $scope.myQuestions[qIndex].correctAnswer = correctAnswer;
              if ( aIndex === correctAnswer){
                 $scope.myQuestions[qIndex].correctness = 'correct';
                 $scope.score += 1;
              } else {
                 $scope.myQuestions[qIndex].correctness = 'incorrect';
              }        
              $scope.myQuestions[qIndex].questionState = 'answered'
          } 
          $scope.percentage = (($scope.score / $scope.totalQuestions)*100).toFixed(0);
          if($scope.score > 6) {
            $scope.result = '信用卡经理人';
          } else if($scope.score <= 6 && $scope.score > 4) { 
            $scope.result = '信用卡高级玩家';
          } else if($scope.score <= 4 && $scope.score > 2) { 
            $scope.result = '信用卡普通玩家';
          } else if($scope.score <= 4 && $scope.score > 2) { 
            $scope.result = '信用卡低端玩家';
          } else if($scope.score <= 4 && $scope.score > 2) { 
            $scope.result = '信用卡小白';
          }
          document.title = '我对信用卡的了解程度有' + $scope.percentage + '%，达到' + $scope.result + '水平';
        }

       $scope.isSelected = function(qIndex,aIndex){
          return $scope.myQuestions[qIndex].selectedAnswer === aIndex;
       }
       $scope.isCorrect = function(qIndex,aIndex){
          return $scope.myQuestions[qIndex].correctAnswer === aIndex;
       }

       $scope.selectContinue = function(){ 
          return $scope.activeQuestion += 1;
       }

       $scope.createShareLinks = function(percentage){
          
          var url = 'http://aquiz.cn/quiz2'

          var mqLink = ''

          var wechatLink = '';    
           
          var newMarkup = wechatLink + mqLink;

          return $sce.trustAsHtml(newMarkup); 
       }

       $scope.resizeHeight = function(){
          document.getElementById('myQuiz').style.height = 1150 + 'px'; 
       }
       
       $scope.addOverlay = function(){  
        var myOverlay = document.createElement('div');
        myOverlay.id = 'overlay'; 
        document.body.appendChild(myOverlay); 
        myOverlay.style.position = 'absolute';
        myOverlay.style.top = 0;  
        myOverlay.style.opacity = 0.8;  
        myOverlay.style.width = window.innerWidth + 'px';
        myOverlay.style.height = document.body.clientHeight + 'px';
        myOverlay.style.top = window.pageYOffset + 'px';
        myOverlay.style.left = window.pageXOffset + 'px';
        myOverlay.style.zIndex = 999;
        myOverlay.style.backgroundColor = '#000';  
        document.getElementById('developer').style.visibility = 'visible';
        myOverlay.addEventListener('click', removeSelf, false);
       }
       
       function removeSelf() {
           document.getElementById('overlay').remove();
           document.getElementById('developer').style.visibility = 'hidden';
       }

	}]);

    

})();