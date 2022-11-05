//these three solve the difficult problem of converting a csv which reads right to left top to bottom 
//into a 2d array which is x,y accessible such that the element at x+1,y is the element to the right of the element at x,y
// and the element at x,y+1 is the element below the element at x,y
//1, 2, 3
//4, 5, 6
//=>
//[[1,4],[2,5],[3,6]]
//such that array[0][0] is 1, array[1][0] is 2 and array[2][0] is 3, etc.


//strips special characters except for newline from the csv string
function stripSpecialCharacters(csv){
    //define list of special characters
    let specialCharacters = ['\r'];
    //replace those characters using regex
    for(let i = 0; i < specialCharacters.length; i++){
        csv = csv.replace(new RegExp(specialCharacters[i], 'g'), '');
    }
    return csv;
}
    

//1,2,3
//4,5,6
//=>
//[[1,2,3],[4,5,6]]
//converts a csv string into a 2d array
function convertCSVToArray(csv){
    //strip special characters
    csv = stripSpecialCharacters(csv);
    let array = csv.split('\n');
    for(let i = 0; i < array.length; i++){
        array[i] = array[i].split(',');
    }
    return array;
}

//[[1,2,3],[4,5,6]] => [[1,4], [2,5], [3,6]]
//flips a 2d array on the diagonal
//careful to not access the array out of bounds
function flip2dArrayDiagonally(array){
    let newArray = [];
    //for each column make a new array
    for(let i = 0; i < array[0].length; i++){
        newArray.push([]);
        //for each row, add the element to the new array
        for(let j = 0; j < array.length; j++){
            //if the element is out of bounds, skip it
            if(array[j][i] === undefined){
                continue;
            }
            newArray[i].push(array[j][i]);
        }
    }
    return newArray;
}


//converts a csv into a 2d array, and then flips it so it is x,y accessible
function convertCSVToArrayAndFlip(csv){
    return flip2dArrayDiagonally(convertCSVToArray(csv));
}

module.exports = { stripSpecialCharacters, convertCSVToArray, flip2dArrayDiagonally, convertCSVToArrayAndFlip };