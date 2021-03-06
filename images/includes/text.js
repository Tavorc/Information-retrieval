var start = function(){
	var documentArray = [],filePathInput,fileName,lines,nameDoc,nameAuthor,arrayName=[],arrayAuthor=[],file,string,stopListArray=[];
	var arraySummery=[],countDocResult=0,counterAddDoc=0,arrayDownloadName=[], uniqueWords = [],idCounter=1,flagShow=0;
	var paraShow = document.getElementById('allDocument');
	var wrapper = document.getElementById('page-wrapper');
	var fileDisplayArea1 = document.getElementById('fileDisplayArea');
window.onload = function() {
		initDatabase();
		var fileInput = document.getElementById('fileInput'),buzzWord=document.getElementById('searchLine');
		var search = document.getElementById('searchButton');
		fileInput.addEventListener('change', function(e) {
		file = fileInput.files[0];
		var textType = /text.*/;
		if (file.type.match(textType)) {
			var reader = new FileReader();
			reader.onload = function(e) {
				string=reader.result;
				filePathInput=$("#fileInput").val();
				fileName = filePathInput.substring(12);
				//get the stop list from file
				if(fileName == "StopList.txt")
				{
					lines =string.split(',');
					stopListArray=lines;
					downloadFile(fileName,string)
				}
				if(fileName !="StopList.txt")
				{
				lines =string.split('\n');
				nameDoc=lines[0].substring(1);
	  			nameAuthor=lines[1].substring(1);
	  			//add name of doc to name array
	  			arrayName.push(nameDoc);
	  			//add author of doc to author array
	  			arrayAuthor.push(nameAuthor);
	  			//add description to description array
	  			arraySummery.push(lines[3] + "\n" + lines[4] + "\n" + lines[5] + "\n");
	  			arrayDownloadName.push(fileName);
	  			//add the document to array
				documentArray.push(string);
				//add to the list Attached documents
				var divAdd = document.getElementById('documentAdded'),nameItem=nameDoc,addedDoc,nameDocument;
				addedDoc = document.createElement("LI");               
				nameDocument = document.createTextNode((counterAddDoc+1) + ". " +nameItem +" ");
				var buttonDelete = document.createElement("input");
   				buttonDelete.type = "button";
   				buttonDelete.value = "delete";
   				buttonDelete.setAttribute("id",counterAddDoc+1);
   				//delete the document from Db
   				buttonDelete.onclick = function()
    			  { 
    			  	    getRowDelete1 = function(val)
    					{
        				PROJINFORET.transaction(function(transaction) {
              			transaction.executeSql('DELETE FROM Document WHERE idDoc = ?;', [val], printRowDocDetails, errorHandler);
              			transaction.executeSql('DELETE FROM IndexFile WHERE idDoc = ?;', [val], printRowDocDetails, errorHandler);
       				 	});
   			 			};
   						var printRowDocDetails = function(transaction,results)
   						{
    			  		};
    			  		getRowDelete1(this.id);
    			  		this.style.visibility="hidden";
    			  		addedDoc.style.visibility="hidden";
    			  };
				addedDoc.appendChild(nameDocument);
				addedDoc.appendChild(buttonDelete);
				divAdd.appendChild(addedDoc);
				counterAddDoc++;
				}
			}
			reader.readAsText(file);	
			} else {
				fileDisplayArea.innerText = "File not supported!";
			}
	});
	//split the words
	function  splitToWord(str)
	{
	 stringWithoutDelimiter = str.replace(/\s\s+/g, ' ');
	 var words=stringWithoutDelimiter.split(/[.,():;""# ]+/);
	 return words;
	}
	//get array and return the array with the words without duplicate
	function  uniqueWordFunc(str)
	{	
		for (var i = 0, j = str.length; i < j; i++) 
		{
			if(str[i][0]!=null)
			{
				if(str[i][0] == str[i][0].toUpperCase())
				{
					str[i] = str[i].toLowerCase();		
				}
			}
		}
			$.each(str, function(i, el){
   			if($.inArray(el,uniqueWords) === -1) uniqueWords.push(el);
			});
	 	return uniqueWords;
	}
	//the hit per word
	function  performances(words)
		{
		var performances = { };
		for (var i = 0, j = words.length; i < j; i++) {
   			performances[words[i]] = (performances[words[i]] || 0) + 1;
		}
		return performances;
	}
	function downloadFile(nameF,stringDoc)
	{
	//download the file to storage
	var element = document.createElement('a');
  	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringDoc));
 	element.setAttribute('download', nameF);
	element.style.display = 'none';
 	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
	}
	//help button
	document.getElementById("help").addEventListener("click",function(){
		   $('#liteBoxDiv').append('<div id="liteboxInfo"> <button id="exitInfoDetails" href="#">X</button> <pre id = "helpPre"><h4>Explanation About The Application:</h4>Before adding using you have to delete the Data base,you doing this by pressing on button "Delete DB",<br>in addition you need to add the stopList File by select the file(and that it) now you can add files(documents). <br>Before adding Documents,you need to select them by pressing on button "בחר קובץ",<br>if you want to select more documents you doing the same.<br>When you select all documents that you want to add,press on button "Add Documents"<br>to add documents to data base.<br>If you want to delete document you need to press on button "delete" near the name <br>of the document under "Attached Documents" window.<br>To add add one more file,select file and press on button "Add one file".<br>To search documents,write one from the list of option in the textbox and press "search".<br>Option to search:<br> - one word<br> - word1 || word2 - or operator <br> - word1 && word2 - and operator<br> - ! word <br> - (w1 && w2) || w3 - you can change the operator and the brackets<br>like this - w1 ||(w2 || w3)<br> - ! (w1 && w2)<br>It is better to write space before and after operator<br>There is a several words in a stop list.<br>To see the documents with the highlighting word press on button "show".<br>If you want the document press on the link "link to document".</pre> </div>');
                    $('#liteboxInfo').fadeIn();
                        $('#exitInfoDetails').click(function(){
                            $('#liteboxInfo').fadeOut(function(){ 
                                $(this).remove(); });
                        });
		});
		// add all the documents to DB
	 document.getElementById("addFiles").addEventListener("click",function(){
	 	for(var i=0;i<documentArray.length;i++)
	 	{
	 			//splite the string  to word
	  			var words=splitToWord(documentArray[i]);
	  			//array with unique word not duplicate
				 var uniqueArr= uniqueWordFunc(words);
				//the number of performances
	  			var perf=performances(words);	
	  			 for (j=0; j<uniqueArr.length; j++) 
   				 {
   				 	var uWord=uniqueArr[j];
					if(perf[uniqueArr[j]]!=null && uWord!='') 
					{
						addIndexFile(idCounter,uWord,perf[uniqueArr[j]]);
					}			 
   				 }
			addDocument(idCounter,arrayName[i],arrayAuthor[i],arraySummery[i],("http://127.0.0.1:8020/Information%20retrieval/storage/" + arrayDownloadName[i]));
			idCounter++;
	 		downloadFile(arrayDownloadName[i],documentArray[i]);
	 	}
	 	sortAll();
	 });
	 //add one documents to Db
	 document.getElementById("addOneFile").addEventListener("click",function(){
	 		//splite the string  to word
	  			var words=splitToWord(string);
	  			//array with unique word not duplicate
				 var uniqueArr= uniqueWordFunc(words);
				//the number of performances
	  			var perf=performances(words); 	
	  			 for (j=0; j<uniqueArr.length; j++) 
   				 {
					if(perf[uniqueArr[j]]!=null && uniqueArr[j]!='') 
					{
					addIndexFile(idCounter,uniqueArr[j],perf[uniqueArr[j]]);
					}			 
   				 }
				addDocument(idCounter,nameDoc,nameAuthor,lines[3] + "\n" + lines[4] + "\n" + lines[5] + "\n",("http://127.0.0.1:8020/Information%20retrieval/storage/" + fileName));
	 			sortAll();
	 			downloadFile(fileName,string);
	 			idCounter++;
	 });
	 //delete the data in DB
	  document.getElementById("deleteDB").addEventListener("click",function(){
	 	dropTables();
	 });
	 //the search button action
   document.getElementById("searchButton").addEventListener("click",function()
	  	  {
	  	  	deleteTheResults();
	  	  	var wordSearch,numberDoc=[],wordBuzz=[],checkWord=[],arrQueue=[],wordBuzzNew=[],flagBrackets=0;
			wordSearch =buzzWord.value;
			var flagCheckStopList=checkIfInStopList(wordSearch);
			wordSearch = wordSearch.replace(/"/g, '');
			checkWord=wordSearch.split(/[&&||! ]+/);
			if(flagCheckStopList==1)
			{
				printNoResults();
			}
		if(flagCheckStopList ==0)
		{
			if(wordSearch.includes("&&") && (checkWord.length == 2) && (!wordSearch.includes("!")) )
			{	
				andQuery();
			}
			if(wordSearch.includes("||") && (checkWord.length == 2) && (!wordSearch.includes("!")) )
			{
				orQuery();
			}
			if(wordSearch.includes("!") && checkWord[0]=='' && (checkWord.length == 2) )
			{
				alert(notQuery());	
			}
			if( ( (wordSearch.includes("&&") && wordSearch.includes("||") ) || 
			(wordSearch.includes("&&") && wordSearch.includes("&&")) || 
			(wordSearch.includes("||") && wordSearch.includes("||")) ) && (checkWord.length > 2) )
			{
				//check the location of brackets
				wordBuzzNew=wordSearch.split(/[)&&||!( ]+/);
				if(wordBuzzNew[0]=='')
				{
					flagBrackets=1;
				}
					if(wordBuzzNew[3]=='')
				{
					flagBrackets=2;
				}
				//for decide the order of the operator
				for(var j=0; j<wordSearch.length;j++)
				{
					if(wordSearch[j]=='&')
					{
						arrQueue.push(wordSearch[j]);
					}
					if(wordSearch[j]=='|')
					{
						arrQueue.push(wordSearch[j]);
					}
						if(wordSearch[j]=='!')
					{
						arrQueue.push(wordSearch[j]);
					}	
				}
				if(flagBrackets == 1)
				{
					bracketsQueryFour(wordBuzzNew[1],wordBuzzNew[2],wordBuzzNew[3],arrQueue[0],arrQueue[2],flagBrackets);
				}
				if(flagBrackets== 2)
				{
					bracketsQueryFour(wordBuzzNew[0],wordBuzzNew[1],wordBuzzNew[2],arrQueue[0],arrQueue[2],flagBrackets);
				}
			}
			if((wordSearch.includes("!") && wordSearch.includes("||") ) 
			|| (wordSearch.includes("!") && wordSearch.includes("&&")) )
			{
				if(arrQueue[0] == '!')
				{
					if(arrQueue[2]== '|')
					{
						orQuery();
					}
				}
				if(arrQueue[0] == '!')
				{
					if(arrQueue[2]== '&')
					{
						andQuery();
					}
				}
			}	//one word search
			else if(checkWord[1]==null){
				wordBuzz[0]=wordSearch;
				oneWordQuery(wordSearch);	
        }
      }
      //check if the input from user is one of the word  of stop list 
      function checkIfInStopList(wordSrc) 
        {
			var wordsApostrophes=[],wordWithoutApoArr=[],flagStopList=0;
     		wordsApostrophes=wordSrc.split(/[&&()!|| ]+/);
     		var stopList = stopListArray;
     		for(var i=0;i<wordsApostrophes.length;i++)
     		{
     			if(!(wordsApostrophes[i].includes('"')) && wordsApostrophes[i]!='')
     			{
     				wordWithoutApoArr.push(wordsApostrophes[i]);
     			}
     		}
     		for(var j=0;j<wordWithoutApoArr.length;j++)
     		{
     			for(var k=0;k<stopList.length;k++)
     			{
     				if(wordWithoutApoArr[j]==stopList[k])
     				{
     					var reg = new RegExp(stopList[k], "g");
 						wordSearch =  wordSearch.replace(reg, " ");
 						flagStopList=1;
     				}
     			}
     		}
     		return flagStopList;
     	}
     	//function that return array without duplicate array
        var noDuplicate = function(numbers)
        {
        	var uniqueNumbers= [];
			$.each(numbers, function(i, el){
   			 if($.inArray(el, uniqueNumbers) === -1) uniqueNumbers.push(el);
			});
			return uniqueNumbers;
        }
        //all the option that have  two operator (without NOT operator)
      function bracketsQueryFour(word1,word2,word3,opr1,opr2,flagBrackets)
        {
        if(opr1 == '&' && opr2== '|')
		{
			if(flagBrackets == 1)
			{
				andFirstBracketFirst(word1,word2,word3);
			}
			if(flagBrackets == 2)
			{
				andFirstBraketsSecond(word1,word2,word3);
			}
		}
		if(opr1 == '|' && opr2== '&')
		{
			if(flagBrackets == 1)
			{
				andFirstBraketsSecond(word3,word1,word2);		
			}
			if(flagBrackets == 2)
			{
				andFirstBracketFirst(word2,word3,word1);			
			}
		}
		if(opr1 == '&' && opr2== '&')
		{
			if(flagBrackets == 1 || flagBrackets == 2)
			{
				sameOperator(word1,word2,word3,1);			
			}
		}
		if(opr1 == '|' && opr2== '|')
		{
			if(flagBrackets == 1 || flagBrackets == 2 )
			{
				sameOperator(word1,word2,word3,2);			
			}
		}
    } 
    //treat the option that have the same operator for example (word1 && word2) && word3 
    function sameOperator(word1,word2,word3,flag)
    {
    	PROJINFORET.transaction(function (tx) {
				var newBuzzWord=[];
				newBuzzWord=wordSearch.split(/[&&()|| ]+/);
				if(flagBrackets==1)
				{
					for(var i=1; i< newBuzzWord.length;i++)
					{
					wordBuzz[i-1]=newBuzzWord[i];
					}
				}
				if(flagBrackets==2)
				{
					for(var i=0; i<3;i++)
					{
						wordBuzz[i]=newBuzzWord[i];
					}
				}
            	tx.executeSql('SELECT * FROM IndexFile WHERE word = ? OR word = ? ', [word1, word2], function (tx, results) {
            	if (results.rows.length == 0 || results == null || results.rows == null)
             		{
             		printNoResults();
             		}
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
    	   				var numberDocNew=[];
    	   				 if(flag==1)
	         			 {
	         			 	numberDocNew = findDuplicate(numberDoc);
	         			 }
	         			 if(flag==2)
	         			 {
	         			 	numberDocNew = noDuplicate(numberDoc);
	         			 }
	    	   			var getSameOp = function(val)
	    				{
	        			PROJINFORET.transaction(function(transaction) {
	              		transaction.executeSql('SELECT * FROM IndexFile WHERE word = ?;', [val], printSameOp, errorHandler);
	       				});
	   			 		};
	   					var printSameOp = function(transaction,resu)
	   					{
	   					 var numberFromQuery=[], uniqueNumbers= [];;
	        			 for(var i = 0; i < resu.rows.length; i++)
	        			 {
	             		 var rowDocument = resu.rows.item(i);
	             		 numberFromQuery.push(rowDocument['idDoc']);            
	         			 }
	         			 for(var j = 0; j < numberDocNew.length ; j++)
	        			 {
	             		 numberFromQuery.push(numberDocNew[j]);            
	         			 }
	         			 if(flag==1)
	         			 {
	         			 	uniqueNumbers = findDuplicate(numberFromQuery);
	         			 }
	         			  if(flag==2)
	         			 {
	         			 	uniqueNumbers = noDuplicate(numberFromQuery);
	         			 }
	         			 if ( uniqueNumbers[0] == null)
             				{
             				 printNoResults();
             				 }
	         			 for(var k=0;k<uniqueNumbers.length;k++)
    	   				 {
    	   			 		getAndRow(uniqueNumbers[k]);
       			 		 } 
	   					};
	   					getSameOp(word3);
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});	
    }
    //AND first
    function andFirstBracketFirst(word1,word2,word3)
    {
    	PROJINFORET.transaction(function (tx) {
				var newBuzzWord=[];
				newBuzzWord=wordSearch.split(/[&&()|| ]+/);
				if(flagBrackets==1)
				{
					for(var i=1; i<newBuzzWord.length;i++)
					{
						wordBuzz[i-1]=newBuzzWord[i];
					}
				}
				if(flagBrackets==2)
				{
					for(var i=0; i<3;i++)
					{
						wordBuzz[i]=newBuzzWord[i];
					}
				}
            	tx.executeSql('SELECT * FROM IndexFile WHERE word = ? OR word = ? ', [word1, word2], function (tx, results) {
            	if (results.rows.length == 0 || results == null || results.rows == null)
             		{
             		printNoResults();
             		}
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
    	   				var numberDocNew=[];
    	   				numberDocNew = findDuplicate(numberDoc);
	    	   			var getFirstFirst = function(val)
	    				{
	        			PROJINFORET.transaction(function(transaction) {
	              		transaction.executeSql('SELECT * FROM IndexFile WHERE word = ?;', [val], printFirstFirst, errorHandler);
	       				});
	   			 		};
	   					var printFirstFirst = function(transaction,resu)
	   					{
	   					 var numberFromQuery=[],uniqueNumbers=[];
	        			 for(var i = 0; i < resu.rows.length; i++)
	        			 {
	             		 var rowDocument = resu.rows.item(i);
	             		 numberFromQuery.push(rowDocument['idDoc']);            
	         			 }
	         			 for(var j = 0; j < numberDocNew.length ; j++)
	        			 {
	             		 numberFromQuery.push(numberDocNew[j]);            
	         			 }
						 uniqueNumbers = noDuplicate(numberFromQuery);
	         			 for(var k=0;k<uniqueNumbers.length;k++)
    	   				 {
    	   			 		getAndRow(uniqueNumbers[k]);
       			 		 } 
	   					};
	   					getFirstFirst(word3);
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});				
    }
    //or first
    function andFirstBraketsSecond(word1,word2,word3)
    {
    	PROJINFORET.transaction(function (tx) {
				var newBuzzWord=[];
				newBuzzWord=wordSearch.split(/[&&()|| ]+/);
				if(flagBrackets==2)
				{
					for(var i=0; i<3;i++)
					{
						wordBuzz[i]=newBuzzWord[i];
					}	
				}
				if(flagBrackets==1)
				{
					for(var i=1; i<newBuzzWord.length;i++)
					{
						wordBuzz[i-1]=newBuzzWord[i];
					}
				}
            	tx.executeSql('SELECT * FROM IndexFile WHERE word = ? OR word = ? ', [word2, word3], function (tx, results) {
            	if (results.rows.length == 0)
             		{
             		printNoResults();
             		}
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
    	   				var numberDocNew=[];
    	   				numberDocNew = noDuplicate(numberDoc);
	    	   			var getFirstSecond = function(val)
	    				{
	        			PROJINFORET.transaction(function(transaction) {
	              		transaction.executeSql('SELECT * FROM IndexFile WHERE word = ?;', [val], printFirstSecond, errorHandler);
	       				});
	   			 		};
	   					var printFirstSecond = function(transaction,resu)
	   					{
	   					 var numberFromQuery=[], uniqueNumbers= [];
	        			 for(var i = 0; i < resu.rows.length; i++)
	        			 {
	             		 var rowDocument = resu.rows.item(i);
	             		 numberFromQuery.push(rowDocument['idDoc']);            
	         			 }
	         			 for(var j = 0; j < numberDocNew.length ; j++)
	        			 {
	             		 numberFromQuery.push(numberDocNew[j]);            
	         			 }
						 uniqueNumbers = findDuplicate(numberFromQuery);
	         			 for(var k=0;k<uniqueNumbers.length;k++)
    	   				 {
    	   			 		getAndRow(uniqueNumbers[k]);
       			 		 } 
	   					};
	   					getFirstSecond(word1); 
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});				
    } 
    //one word searching
        function  oneWordQuery(wordBuzz)
        {
        		PROJINFORET.transaction(function (tx) {
            		tx.executeSql('SELECT * FROM IndexFile WHERE word = ?;', [wordBuzz], function (tx, results) {
            		if (results.rows.length == 0)
             			{
             				printNoResults();
             			}
            		if (results != null && results.rows != null)
             		{
             			 for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				 }
    	   			for(var k=0;k<numberDoc.length;k++)
    	   				 {
    	   			 		getAndRow(numberDoc[k]);
       			 		 }  	   				 
    	   			 }
    	   		 else
    	   		 {
    	   		 	alert("nulll");
    	   		 }
            }, null);    
         });
        }
        //or operator
        function  orQuery()
        {
        	PROJINFORET.transaction(function (tx) {
			var firstParse=[];
			firstParse=wordSearch.split(/[||)(! ]+/);
			if(arrQueue[0] != '!')
			{
				wordBuzz=firstParse;
			}
			if(arrQueue[2]== '|' && arrQueue[0] == '!' )
        	{
        		wordBuzz[0]=firstParse[1];
        		wordBuzz[1]=firstParse[2];
        	}
            tx.executeSql('SELECT * FROM IndexFile WHERE ( word = ? OR word = ? ) ', [firstParse[0], firstParse[1]], function (tx, results) {	
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
    	   				var numberDocNew=[];		
    	   				numberDocNew = noDuplicate(numberDoc);
    	   				if (numberDocNew[0]==null)
             			{
             			printNoResults();
             			}
             			if(arrQueue[2]== '|' && arrQueue[0] == '!' )
        				{
        				printNot(numberDocNew);	
        				}
        				else
        				{
        					for(var k=0;k<numberDocNew.length;k++)
    	   					{
    	   					 getAndRow(numberDocNew[k]);
       			 			}  	
        				}   		   				 
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});
        }
        //not operator
        function  notQuery()
        {
        	PROJINFORET.transaction(function (tx) {
			for(var i=1; i<checkWord.length;i++)
					{
						wordBuzz[i-1]=checkWord[i];
					}
            tx.executeSql('SELECT * FROM IndexFile WHERE  word = ? ', [wordBuzz[0]], function (tx, results) {	
            	if (results.rows.length == 0)
             		{
             		printNoResults();
             		}
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
	    	   			printNot(numberDoc);	 
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});
        } 
        var printNot = function(numberDoc)
        {
        	  	 var getNotRow = function()
	    				{
	        			PROJINFORET.transaction(function(transaction) {
	              		transaction.executeSql('SELECT * FROM Document', [], printNotDetails, errorHandler);
	       				});
	   			 		};
	   					var printNotDetails = function(transaction,resultsData)
	   					{
	   					var newNotArray=[],finalNotArray=[];
	        			 for(var i = 0; i < resultsData.rows.length; i++)
	        			 {
	             		 var rowDocNot = resultsData.rows.item(i);
	             		 newNotArray.push(rowDocNot['idDoc']);  
	         				}
	         			finalNotArray=checkThediferentTwoArr(newNotArray,numberDoc);
	         			for(var j=0; j< finalNotArray .length;j++ )
	         			{
	         				getAndRow(finalNotArray[j]);
	         			}
	   					};
	    	   			getNotRow();	
        } 
        //check which number is not in the second array
       var checkThediferentTwoArr = function(arr1,arr2)
       {
       	var resultNotArray=[],flagAppear=0;
       		for(var j=0; j< arr1.length;j++ )
         			{
         				for(var k=0; k< arr2.length;k++ )
         				{
         					if(arr1 [j] == arr2[k])
         					{
         						flagAppear=1;
         					}
         				}
         				if(flagAppear==0)
         				{
         					resultNotArray.push(arr1[j]);
         				}
         				 if(flagAppear==1)
         				{
         					flagAppear=0;
         				}
         			}
         			return resultNotArray;
       } 
       //find the duplicate value in array    
        function findDuplicate(numberDoc)
        {
        	var sorted_arr = numberDoc.slice().sort(),results = [];
			for (var i = 0; i < numberDoc.length - 1; i++)
			 {
    			if (sorted_arr[i + 1] == sorted_arr[i])
    		 	{
       		 	results.push(sorted_arr[i]);
    			}	
			 }
			 return results;
        }
        //and operator   
        function andQuery()
        {
        	PROJINFORET.transaction(function (tx) {
        	var firstParse=[];
			firstParse=wordSearch.split(/[&&)(! ]+/);
			if(arrQueue[0] != '!')
			{
				wordBuzz=firstParse;
			}
			if(arrQueue[2]== '&' && arrQueue[0] == '!' )
        	{
        		wordBuzz[0]=firstParse[1];
        		wordBuzz[1]=firstParse[2];
        	}
            tx.executeSql('SELECT * FROM IndexFile WHERE ( word = ? OR word = ? ) ', [wordBuzz[0], wordBuzz[1]], function (tx, results) {	
                if (results != null && results.rows != null)
             		{
             		for (var i=0; i<results.rows.length; i++)
   			 			{
        				var row = results.rows.item(i);
        				numberDoc[i]=row['idDoc'];
    	   				}
    	   				var numberDocNew=[];
    	   				numberDocNew = findDuplicate(numberDoc);
             	 if (numberDocNew[0]==null)
             		{
             		printNoResults();
             		}
             		if(arrQueue[2]== '&' && arrQueue[0] == '!' )
        			{
        				printNot(numberDocNew);	
        			}
        			else{
        				for(var k=0;k<numberDocNew.length;k++)
    	   				{
    	   			 	getAndRow(numberDocNew[k]);
       			 		} 
        			}   				 
    	   			}
    	   			 else
    	   		 	{
    	   		 	alert("null");
    	   			}
           			}, null);    
         			});	
        } 
        //print the  result of the querys
        var getAndRow = function(val)
    	{
        	PROJINFORET.transaction(function(transaction) {
            transaction.executeSql('SELECT * FROM Document WHERE idDoc = ?;', [val], printAndDetails, errorHandler);
       		});
   		};
   		var printAndDetails = function(transaction,results)
   		{
        	for(var i = 0; i < results.rows.length; i++)
        	{
             var rowDoc = results.rows.item(i);
            printLinks(rowDoc['idDoc'],rowDoc['name'],rowDoc['author'],rowDoc['summery'],rowDoc['link']);             
         	}
   		};  
   		//print the result to ui
	  		function printLinks(idDoc,name,author,summery,link) 
 			{ 
   				 	var fileDisplayArea2 = document.createElement('PRE');
   				 	fileDisplayArea2.setAttribute("id","fileDisplayArea");
   				 	//link to document
   				 	var a = document.createElement('a');
					var linkText = document.createTextNode( "\n" + "Link To Document" + "\n" + "\n");
					a.href = link;
					a.target= "_blank";
					a.setAttribute("id",countDocResult);
					//attach to element
					a.appendChild(linkText);
					//create element for name of the doc
					var nameB = document.createElement("B");               
					var title = document.createTextNode(name +"\n"); 
					//create element for author of the doc
					var authorB = document.createElement("B");               
					var authorText = document.createTextNode(author +"\n");
					//summery of the doc and attach it to paragraph
					var details = document.createTextNode(summery);
					//create button
					var button = document.createElement("input");
   					button.type = "button";
   					button.value = "Show";
   					button.setAttribute("id",countDocResult);
    			 button.onclick = function()
    			  { 
    			  	if(flagShow==1)
    			  	{
    			  		$("#docPre").remove();
    			  		flagShow=0;
    			  	}
    			  	if(flagShow==0)
					{
    			  	var newIdDoc=idDoc-1;
					var idBtn=this.id;
					var showDocument = document.createElement('PRE');
   				 	showDocument.setAttribute("id","docPre");
					var allDoc = document.createTextNode(documentArray[newIdDoc]);
					showDocument.appendChild(allDoc);
					paraShow.appendChild(showDocument);
					var srcString = $("#allDocument").html();
					for(var index=0;index<wordBuzz.length;index++)
					{
					var term = wordBuzz[index];
					if(term!=" ")
					{
					term = term.replace(/\s\s+/g,"(<[^>]+>)*$1(<[^>]+>)*");
					var pattern = new RegExp("("+term+")", "gi");
					srcString = srcString.replace(pattern, "<mark>$1</mark>");
					srcString = srcString.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/,"$1</mark>$2<mark>$4");
					$("#allDocument").html(srcString);
					}
					}
					//print the document
					printDocument($(allDocument).html());
					flagShow=1;	
					}
 				  };
					nameB.appendChild(title);
					fileDisplayArea2.appendChild(nameB);
					authorB.appendChild(authorText);
					fileDisplayArea2.appendChild(authorB);
					fileDisplayArea2.appendChild(details);
   					fileDisplayArea2.appendChild(button);
   					fileDisplayArea2.appendChild(a);
   				 	wrapper.appendChild(fileDisplayArea2);
   				 	countDocResult++;			  
   				 	window.onload = function() {
   				 	document.getElementById(this.id).onclick = function() {}
   				 };	
  		}
	});	
	//print that there is no results
	function printNoResults() 
	{
		var fileDisplayArea3 = document.createElement('PRE');
		var noResult = document.createElement("B");
		var title = document.createTextNode("There is no results." +"\n"); 
		noResult.appendChild(title);
		fileDisplayArea3.appendChild(noResult); 
		wrapper.appendChild(fileDisplayArea3); 
	}	
	function printDocument(st)
	{
		var mywindow = window.open('', 'my div', 'height=500,width=800');
        mywindow.document.write('<html><head><title>Information retrieval project</title>');
       	mywindow.document.write('</head><body >');
       	mywindow.document.write('<pre>');
        mywindow.document.write(st);
        mywindow.document.write('</pre>');
        mywindow.document.write('</body></html>');
	    mywindow.document.close(); 
		mywindow.focus(); 
        mywindow.print();
        mywindow.close();
	}
	//delete the results in the ui
	  	  function deleteTheResults()
	  	  {
	  	  	$("#fileDisplayArea").remove();
	  	  	$("#docPre").remove();
	  	  	$("#fileDisplayArea").remove();
	  	  	$("b").remove();
	  	  	$("a").remove();
	  	  	$("pre").remove();
	  	  	countDocResult=0;
	  	  }
	function initDatabase() {
		try {
	 	   if (!window.openDatabase) {
	        alert('Databases are not supported in this browser.');
	 	   } else {
	        var shortName = 'PROJINFORET';
	        var version = '1.0';
	        var displayName = 'PROJINFORET Database';
	        var maxSize = 100000; //  bytes
	        PROJINFORET= openDatabase(shortName, version, displayName, maxSize);
			createTables();
	 	   }
		} catch(e) {
	    	if (e == 2) {
	   	     // Version number mismatch.
	        console.log("Invalid database version.");
	    } else {
	        console.log("Unknown error "+e+".");
	    }
	    return;
	}
}
	function createTables(){
			PROJINFORET.transaction(
       		 function (transaction)
       		  {
        		transaction.executeSql('CREATE TABLE IF NOT EXISTS IndexFile(idDoc INTEGER NOT NULL,word TEXT NOT NULL,hits INTEGER NOT NULL);', [], this.nullDataHandler, this.errorHandler);
        		transaction.executeSql('CREATE TABLE IF NOT EXISTS Document(idDoc INTEGER NOT NULL,name TEXT NOT NULL,author TEXT NOT NULL,summery TEXT NOT NULL,link TEXT NOT NULL);', [], this.nullDataHandler, this.errorHandler);
       		 }
   			);
	}
	  function addIndexFile(idDoc,word,hits){
	PROJINFORET.transaction(
	    function (transaction) {
				transaction.executeSql('INSERT INTO IndexFile (idDoc, word, hits) VALUES (?, ?, ?)', [idDoc, word, hits]);	
	    }
	);
}
	  function addDocument(idDoc,name,author,summery,link){
	PROJINFORET.transaction(
	    function (transaction) {
				transaction.executeSql('INSERT INTO Document (idDoc, name, author, summery, link) VALUES (?, ?, ?, ?, ?)', [idDoc, name, author, summery, link]);	
	    }
	);
}	
	function sortAll(){
	PROJINFORET.transaction(
	    function (transaction) {
	  transaction.executeSql('CREATE TABLE IF NOT EXISTS IndexFile2(idDoc INTEGER NOT NULL,word TEXT NOT NULL,hits INTEGER NOT NULL);', [], this.nullDataHandler, this.errorHandler);
	        transaction.executeSql("INSERT INTO IndexFile2 (idDoc, word, hits) SELECT * FROM IndexFile ORDER BY lower(word);", [],this.nullDataHandler, this.errorHandler);
	        transaction.executeSql("DROP TABLE IndexFile;", [], this.nullDataHandler, this.errorHandler);
	        sortAll2();
	    }
	);
}
	function sortAll2(){
	PROJINFORET.transaction(
	    function (transaction) {
	  transaction.executeSql('CREATE TABLE IndexFile(idDoc INTEGER NOT NULL,word TEXT NOT NULL,hits INTEGER NOT NULL);', [], this.nullDataHandler, this.errorHandler);
	        transaction.executeSql("INSERT INTO IndexFile (idDoc, word, hits) SELECT * FROM IndexFile2 ORDER BY lower(word);", [],this.nullDataHandler, this.errorHandler);
	        transaction.executeSql("DROP TABLE IndexFile2;", [], this.nullDataHandler, this.errorHandler);
	    }
	);
}
	function dropTables(){
	PROJINFORET.transaction(
	    function (transaction) {
	    	transaction.executeSql("DROP TABLE IndexFile;", [], this.nullDataHandler, this.errorHandler);
	    	transaction.executeSql("DROP TABLE Document;", [], this.nullDataHandler, this.errorHandler);
	    }
	);
	location.reload();
	}
	function errorHandler(transaction, error) {
	console.log('Oops. Error was '+error.message+' (Code '+error.code+')');
	return true;
	}
 }
};

