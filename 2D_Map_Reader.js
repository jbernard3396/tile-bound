var converter = require('./csv_Converter.js');
var mapEnum = require('./mapObjectEnum.js');
var objectDictionary = mapEnum.objectDictionary;

var fs = require('fs');


//returns element if not out of bounds, otherwise returns null
function getElement(array, x, y, defaultValue = null){
    if(x < 0 || x >= array.length || y < 0 || y >= array[0].length){
        return defaultValue;
    }
    return array[x][y];
}

//takes a 2d array and an x,y coordinate, 
//returns an object that uses plain text like "get_left" and "get_right" to get the surrounding elements
// and the elements surrounding the x,y coordinate as keys
//todo:J I think we can rip this out?
function getSurroundingElements(array, x, y){
    let surrounding = {};
    surrounding['get_left'] = getElement(array, x - 1, y);
    surrounding['get_right'] = getElement(array, x + 1, y);
    surrounding['get_up'] = getElement(array, x, y - 1);
    surrounding['get_down'] = getElement(array, x, y + 1);
    surrounding['get_up_left'] = getElement(array, x - 1, y - 1);
    surrounding['get_up_right'] = getElement(array, x + 1, y - 1);
    surrounding['get_down_left'] = getElement(array, x - 1, y + 1);
    surrounding['get_down_right'] = getElement(array, x + 1, y + 1);
    return surrounding;
}


function whichTile(mapArray, x, y){
  
    //get the object representation of the element at this x,y coordinate
    //TODO: pull this into function 
    let object = "" + getElement(mapArray, x, y) + "";
    //return the tile            
    return determineContextSensitiveTile(object, mapWithAt(mapArray, i, j));     
}

//mapWithAt returns the map array with the specified element changed to an '@'
function mapWithAt(array, x, y){
    let newArray = [];
    for(let i = 0; i < array.length; i++){
        newArray.push([]);
        for(let j = 0; j < array[i].length; j++){
            if(i === x && j === y){
                newArray[i].push('@');
            }
            else{
                newArray[i].push(array[i][j]);
            }
        }
    }
    return newArray;
}

//creates a context sensitive tile at the specified x,y coordinate
//for now just creates a tile
function determineContextSensitiveTile(object, map){
    //create a tile with the specified type at the specified x,y coordinate
    let tiles = determineTile(object, map);
    //return a random tile from the list
    let tile = tiles[0];
    if(tiles.length > 0){
        tile = tiles[randomInt(0, tiles.length-1)];
    }

    return tile;
}


function randomInt(lo, hi){
    if(hi < lo){
        throw new Error("High must be greater than low");
    }
    let rand = Math.random()
    let range = (hi - lo)+1; // there are 11 values between 0 and 10
    let int = Math.floor(rand * range);
    return int + lo;
}

//determine tile based on type and surroundings and variation code
function determineTile(object, map){
    //get variations for the given type
    let variationList = getVariations(object, objectDictionary);
    //iterate through the variations
    for(let i = 0; i < variationList.length; i++){
    //for each code, get the surroundings object
    //todo:J loop through the requirements list
        let csv = variationList[i].requirements[0];
        //convert to requirements
        let requirement = getRequirementsFromCsv(csv);
        let relevantMapSection = getRelevantMapSection(requirement, map);
        //check if the surroundings match the surroundings object
        if(checkIfRequirementsMatch(requirement, relevantMapSection)){
            //if they match, return the tile
            return variationList[i].tiles;
        }
    }
    return '';
}


//imports a csv file and converts it to an array
function getRequirementsFromCsv(csv){
    //get the csv file
    let csvFile = fs.readFileSync(csv, 'utf8');
    //convert the csv file to an array
    let array = converter.convertCSVToArrayAndFlip(csvFile);
    return array;
}

//find the '@' character in the map array
//find the '@' character in the requirement array
//for each element in the requirement array, find the element in the map array that is the same difference from the @ character
function getRelevantMapSection(requirements, map){
    let x = -1;
    let y = -1;
    for(let i = 0; i < map.length; i++){
        for(let j = 0; j < map[i].length; j++){
            if(map[i][j] === '@'){
                x = i;
                y = j;
            }
        }
    }
    //if the @ character is not found, throw an error
    if(x === -1 || y === -1){
        throw new Error("@ character not found in map");
    }
    //find the '@' character in the requirement array
    let requirementX = -1;
    let requirementY = -1;
    for(let i = 0; i < requirements.length; i++){
        for(let j = 0; j < requirements[i].length; j++){
            if(requirements[i][j] === '@'){
                requirementX = i;
                requirementY = j;
            }
        }
    }
    //if the @ character is not found, throw an error
    if(requirementX === -1 || requirementY === -1){
        throw new Error("@ character not found in requirements");
    }
    //for each element in the requirement array, find the element in the map array that is the same difference from the @ character
    let relevantMapSection = [];
    for(let i = 0; i < requirements.length; i++){
        relevantMapSection.push([]);
        for(let j = 0; j < requirements[i].length; j++){
            //find difference between @ and current element
            let differenceX = i - requirementX;
            let differenceY = j - requirementY;
            //find the element in the map array that is the same difference from the @ character
            let element = getElement(map, x + differenceX, y + differenceY, '.');
            relevantMapSection[i].push(element);
        }
    }
    return relevantMapSection;
}
//[[1]
//[@]]
//[[1,2,3][4,@,6]]

//mx = 1, my = 1
//rx = 1, ry = 0
//differenceX = -1, differenceY = 0
//desired = 0, 1 


//TODO:J move the rest of this to a new file

//takes a string of 9 characters and preps for CSV transformation
//012345678
//=>
//0,1,2\n3,4,5\n6,7,8
function prepCodeForCsvTransformation(string){
    //if string is not nine charaters, throw error
    if(string.length !== 9){
        throw new Error("String must be nine characters long");
    }
    let newString = '';
    //loop through the string
    for(let i = 0; i < string.length; i++){
        //add the current character to the new string
        newString += string[i];
        //if the current character is not the last character and the index is not a multiple of three, add a comma
        if(i !== string.length - 1 && i % 3 !== 2){
            newString += ',';
        }
        //if the current character is not the last character and the index is a multiple of three, add a new line
        if(i !== string.length - 1 && i % 3 === 2){
            newString += '\n';
        }
    }
    return newString;
}

//return code transformed to a 3 by 3 array
function transformCodeToArray(code){
    // prep the code
    let codeArray = prepCodeForCsvTransformation(code);
    //convert and flip the array
    codeArray = converter.convertCSVToArrayAndFlip(codeArray);
    return codeArray;
}


//for each element in the requirement 2d array, check if the corresponding element in the map csv matches
//the '0' symbol indicates a wildcard
//returns false if lengths of both arrays are not the same
//returns true if all requirements are met
function checkIfRequirementsMatch(requirement, mapRequirements){
    //iterate through the requirement array
    for(let i = 0; i < requirement.length; i++){
        //iterate through the requirement array
        for(let j = 0; j < requirement[i].length; j++){
            //if the index does not exist in the mapRequirements array, return false
            if(mapRequirements[i] === undefined || mapRequirements[i][j] === undefined){
                return false;
            }
            //if the requirement is not a wildcard, check if the requirement matches the map requirement
            if(requirement[i][j] !== '0'){
                if(requirement[i][j] !== mapRequirements[i][j]){
                    return false;
                }
            }
        }
    }
    return true;
}


//todo:J these next two functions suck
//getType from object dictionary
function getType(object){
    //check if the object is in the dictionary
    if(object in objectDictionary){
        return objectDictionary[object].type;
    }
    //if not, return null
    return null;
}

function getVariations(object, dictionary){
    //check if the object is in the dictionary
    if(object in dictionary){
        return dictionary[object].variations;
    }
    //if not, return null
    return null;
}

module.exports = { getRequirementsFromCsv, getElement, getSurroundingElements, whichTile, determineTile, getType, getVariations, transformCodeToArray, prepCodeForCsvTransformation, checkIfRequirementsMatch, randomInt, getRelevantMapSection, converter, mapEnum};