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
          $scope.percentage = (($scope.score / $scope.totalQuestions)*100).toFixed(1);
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

          var emailLink = '<a class="btn email">联系开发者</a>'

          var wechatLink = '<a class="btn wechat">联系开发者</a>';    
           
          var newMarkup = emailLink + wechatLink;

          return $sce.trustAsHtml(newMarkup); 
       }

       $scope.resizeHeight = function(){
          document.getElementById('myQuiz').style.height = 1000 + 'px'; 
       }
       
       $scope.addOverlay = function(){  
        var myOverlay = document.createElement('div');
        myOverlay.id = 'overlay'; 
        document.body.appendChild(myOverlay); 
        myOverlay.style.position = 'absolute';
        myOverlay.style.top = 0;  
        myOverlay.style.opacity = 0.8;  
        myOverlay.style.width = window.innerWidth + 'px';
        myOverlay.style.height = window.innerHeight + 'px';
        myOverlay.style.top = window.pageYOffset + 'px';
        myOverlay.style.left = window.pageXOffset + 'px';
        myOverlay.style.zIndex = 999;
        myOverlay.style.backgroundColor = '#000';  
       }
       
          

	}]);

    

})();