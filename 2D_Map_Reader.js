var converter = require('./csv_Converter.js');
var objectDictionary = require('./mapObjectEnum.js').objectDictionary;

var requirementsList = [];


//returns element if not out of bounds, otherwise returns null
function getElement(array, x, y){
    if(x < 0 || x >= array.length || y < 0 || y >= array[0].length){
        return null;
    }
    return array[x][y];
}

//takes a 2d array and an x,y coordinate, 
//returns an object that uses plain text like "get_left" and "get_right" to get the surrounding elements
// and the elements surrounding the x,y coordinate as keys
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

//TODO:J write a single function that writes all of these functions at compile time???????
//eight functions that check if the surrounding element in a specfific direction is of a given type from the object dictionary
//first function checks left
function checkLeft(surroundings, type){
    let object = getType([surroundings['get_left']]);
    return object === type;
}
//second function checks right
function checkRight(surroundings, type){
    let object = getType([surroundings['get_right']]);
    return object === type;
}
//third function checks up
function checkUp(surroundings, type){
    let object = getType([surroundings['get_up']]);
    return object === type;
}
//fourth function checks down
function checkDown(surroundings, type){
    let object = getType([surroundings['get_down']]);
    return object === type;
}

//TODO:J write the other four

//populates the requirements list with the requirements for each variation
// function populateRequirementsList(){
//     for(let key in objectDictionary){
//         for(let i = 0; i < objectDictionary[key].variations.length; i++){
//             let variation = objectDictionary[key].variations[i];
//             let requirements = variation.requirements;
//             for(let j = 0; j < requirements.length; j++){
//                 let requirement = requirements[j];
//                 if(requirementsList.indexOf(requirement) === -1){
//                     //load in the requirement from the csv
//                     this.make.tilemap({ key: 'Isolated_Floating_Grass_csv', tileWidth: 32, tileHeight: 32 });
//                     var mapData = this.cache.tilemap.get('Isolated_Floating_Grass_csv').data;
//                     let requirementArray = converter.csvToArray(mapData);
//                     requirementsList.push(requirementArray);
//                 }
//             }
//         }
//     }
// }

function parseRegionPage(mapArray, game, platforms){
    //converts a layer of tiles into a 2d array
    let array = mapArray;
   //for each element in the array, creates a context sensitive tile at that x,y coordinate
    for(let i = 0; i < array.length; i++){
        for(let j = 0; j < array[i].length; j++){
            //get the object representation of the element at this x,y coordinate
            //TODO: pull this into function 
            let object = "" + getElement(array, i, j) + "";
            //create the tile            
            createContextSensitiveTile(i, j, object, mapWithAt(array, i, j), game, platforms);
        }
    }       
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
function createContextSensitiveTile(x, y, object, map, game, platforms){
    //create a tile with the specified type at the specified x,y coordinate
    let tiles = determineTile(object, map, game);
    //return a random tile from the list
    let tile = tiles[0];
    if(tiles.length > 0){
        tile = tiles[randomInt(0, tiles.length-1)];
    }

    createTile(x, y, tile, game, platforms);
}


//todo:J check if random can return 1, if it can't, then this is right
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
function determineTile(object, map, game){
    //get variations for the given type
    let variationList = getVariations(object, objectDictionary);
    //iterate through the variations
    for(let i = 0; i < variationList.length; i++){
    //for each code, get the surroundings object
    //todo:J loop through the requirements list
        let csv = variationList[i].requirements[0];
        //convert to requirements
        let requirement = getRequirementsFromCsv(csv, game);
        let relevantMapSection = getRelevantMapSection(requirement, map);
        //check if the surroundings match the surroundings object
        if(checkIfRequirementsMatch(requirement, relevantMapSection)){
            //if they match, return the tile
            return variationList[i].tiles;
        }
    }
    return '';
}

//creates the specified tile at the specified x,y coordinate
function createTile(x, y, type, game, platforms){
    if(type === '' || type === null || type === undefined){
        return;
    }

    platforms.create(16+x*32, 16+y*32, type);
    
}


//imports a csv file and converts it to an array
function getRequirementsFromCsv(csv, game){
    game.make.tilemap({ key: csv, tileWidth: 32, tileHeight: 32 });
    var mapData = game.cache.tilemap.get(csv).data;
    let array = converter.convertCSVToArrayAndFlip(mapData);
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
            relevantMapSection[i].push(map[x+differenceX][y+differenceY]);
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


//TODO:J don't need surroundings, just need all of the csv
// //get required surroundings from code
// function getRequiredSurroundings(code){
//     //get the code array
//     let codeArray = transformCodeToArray(code);
//     //get elements surrounding the center
//     let surroundings = getSurroundingElements(codeArray, 1, 1);
//     return surroundings;
// }   

//given surroundings from the map and surroundings derived from variation code, check if the types in each direction match
//ignore directions for which code surroundings is 0
//todo:J check if relevant csv matches 
// function checkIfSurroundingsMatch(surroundings, codeSurroundings){
//     //iterate through the keys
//     for(let key in surroundings){
//         //if the code surroundings is 0, ignore this direction
//         if(codeSurroundings[key] === '0'){
//             continue;
//         }
//         //if the code surroundings is not 0, check if the types match
//         if(getType([surroundings[key]]) !== getType(codeSurroundings[key])){
//             return false;
//         }
//     }
//     return true;
// }

//for each element in the requirement 2d array, check if the corresponding element in the map csv matches
//the '0' symbol indicates a wildcard
//returns false if lengths of both arrays are not the same
//returns true if all requirements are met
function checkIfRequirementsMatch(requirement, mapRequirements){
    //if the lengths of the arrays are not the same, return false
    if(requirement.length !== mapRequirements.length){
        return false;
    }
    //iterate through the requirement array
    for(let i = 0; i < requirement.length; i++){
        //if the length of the current requirement is not the same as the length of the map requirement, return false
        if(requirement[i].length !== mapRequirements[i].length){
            return false;
        }
        //iterate through the requirement array
        for(let j = 0; j < requirement[i].length; j++){
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

module.exports = { getElement, getSurroundingElements, parseRegionPage, createContextSensitiveTile, createTile, determineTile, getType, getVariations, transformCodeToArray, prepCodeForCsvTransformation, checkIfRequirementsMatch, randomInt, getRelevantMapSection, converter, objectDictionary};