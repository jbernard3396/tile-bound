const mapReader = require('../2D_Map_Reader');

//function to create an object dictionary
function createObjectDictionary() {
    var objectDictionary = {
        '.': {
            type: '',
        },
        '#': {
            type: 'ground',
            variations: [
                {
                    requirements: ['000.0#0#0'],
                    images: ['left_standing_grass']
                },
                {
                    requirements: ['000#0#0#0'],
                    images: ['middle_standing_grass']
                },
                {
                    requirements: ['000#0.0#0'],
                    images: ['right_standing_grass'],
                }
            ]
        },
        '@': 'player',
        '$': 'treasure',
    }
    return objectDictionary;
}

describe('2D_Map_Reader', function() {

    describe('getElement', () => {
        let array = [['a', 'b', 'c', ], ['d', 'e', 'f']];
        test('out of bounds', () => {
            expect(mapReader.getElement(array, -1, 0)).toBe(null);
            expect(mapReader.getElement(array, 0, -1)).toBe(null);
            expect(mapReader.getElement(array, 2, 0)).toBe(null);
            expect(mapReader.getElement(array, 0, 2)).toBe('c');
        }
        );
        test('in bounds', () => {
            expect(mapReader.getElement(array, 0, 0)).toBe('a');
            expect(mapReader.getElement(array, 1, 1)).toBe('e');
        }
        );
    });

    describe('getSurroundingElements', () => {
        let array = [['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']];
        test('in bounds', () => {
            expect(mapReader.getSurroundingElements(array, 1, 1)).toEqual({
                'get_up': '2',
                'get_up_right': '3',
                'get_right': '6',
                'get_down_right': '9',
                'get_down': '8',
                'get_down_left': '7',
                'get_left': '4',
                'get_up_left': '1'
            });
        });
        test('out of bounds', () => {
            expect(mapReader.getSurroundingElements(array, -1, 0)).toEqual({
                'get_up': null,
                'get_up_right': null,
                'get_right': '1',
                'get_down_right': '4',
                'get_down': null,
                'get_down_left': null,
                'get_left': null,
                'get_up_left': null
            });
        });  
    });

    describe('getType', () => {
        let objectDictionary = createObjectDictionary();
        test('in bounds', () => {
            expect(mapReader.getType('#')).toBe('ground');
            expect(mapReader.getType('.')).toBe('');
        });
        test('out of bounds', () => {
            expect(mapReader.getType('a')).toBe(null);
        }
        );
    });

    describe('getVariation', () => {
        let objectDictionary = createObjectDictionary();
        test('in bounds', () => {
            expect(mapReader.getVariations('#', objectDictionary)).toStrictEqual([{"images": ["left_standing_grass"], "requirements": ["000.0#0#0"]}, {"images": ["middle_standing_grass"], "requirements": ["000#0#0#0"]}, {"images": ["right_standing_grass"], "requirements": ["000#0.0#0"]}]);
        }
        );
        test('out of bounds', () => {
            expect(mapReader.getVariations('a', objectDictionary)).toBe(null);
        });
    });

    describe('prepCodeForCsvTransformation', () => {
        //takes a string of 9 characters and preps for CSV transformation
        //012345678
        //=>
        //0,1,2\n3,4,5\n6,7,8
        test('in bounds', () => {
            expect(mapReader.prepCodeForCsvTransformation('012345678')).toBe('0,1,2\n3,4,5\n6,7,8');
        });
        test('out of bounds', () => {
            //if the string is not nine characters, should throw an error
            expect(() => { mapReader.prepCodeForCsvTransformation('01234567') }
            ).toThrowError('String must be nine characters long');
        });
    });

    describe('transformCodeToArray', () => {
        //takes a string of 9 characters and preps for CSV transformation
        //012345678
        //=>
        //[['0','3','6'],['1','4','7'],['2','5','8']]
        test('in bounds', () => {
            expect(mapReader.transformCodeToArray('012345678')).toEqual([['0', '3', '6'], ['1', '4', '7'], ['2', '5', '8']]);
        }
        );
        test('out of bounds', () => {
            //if the string is not nine characters, should throw an error
            expect(() => { mapReader.transformCodeToArray('01234567') }
            ).toThrowError('String must be nine characters long');
        }
        );
    });

    describe('checkIfRequirementsMatch', () => {
        let objectDictionary = createObjectDictionary();
        test('ShouldReturnTrue_When_RequirementExactlyMatchesMapSection', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']], [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']])).toBe(true);
        });
        test('ShouldReturnFalse_When_RequirementIsDifferentLengthThanMapSection_AndMismatchedRequirementIsNotZero', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']], [['1', '2', '3'], ['4', '5', '6'], ['7', '8']])).toBe(false);
        });
        test('ShouldReturnTrue_When_RequirementIsDifferentLengthThanMapSection_AndMismatchedRequirementIsZero', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '0']], [['1', '2', '3'], ['4', '5', '6'], ['7', '8']])).toBe(true);
        });
        test('ShouldReturnFalse_When_RequirementIsDifferentLengthThanMapSection_AndMismatchedRequirementIsNotZero2', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'],['7','8','9']], [['1', '2', '3'], ['4', '5', '6']])).toBe(false);
        });
        test('ShouldReturnTrue_When_RequirementIsDifferentLengthThanMapSection_AndMismatchedRequirementIsZero2', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'],['0','0','0']], [['1', '2', '3'], ['4', '5', '6']])).toBe(true);
        });
        test('ShouldReturnTrue_When_OnlyDifferenceIs0', () => {
            expect(mapReader.checkIfRequirementsMatch([['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0']],[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']])).toBe(true);
        });
        test('ShouldReturnFalse_When_DifferencesExist', () => {
            expect(mapReader.checkIfRequirementsMatch([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']], [['0', '0', '0'], ['0', '0', '0'], ['0', '0', '0']])).toBe(false);
        });
    });

    // describe('determineTile', () => {
    //     let objectDictionary = createObjectDictionary();
    //     test('Returns correct tile', () => {
    //         expect(mapReader.determineTile('#', {
    //             'get_up': '.',
    //             'get_up_right': '.',
    //             'get_right': '#',
    //             'get_down_right': '.',
    //             'get_down': '#',
    //             'get_down_left': '.',
    //             'get_left': '#',
    //             'get_up_left': '.'
    //             })).toStrictEqual(["middle_standing_grass"]);
    //     }
    //     );
    // });

    describe('randomInt', () => {
        test('returns a number in normal range with no low', () => {
            let int = mapReader.randomInt(0,10);
            //expect it to be greater than or equal to 0 and also less than or equal to 10
        });
        test('returns a number in normal range with a low', () => {
            let int = mapReader.randomInt(5,15);
            //expect it to be greater than or equal 5 and also less than or equal to 15
        });
        test('returns a number in small range with a low', () => {
            let int = mapReader.randomInt(5,6);
            //expect it to be greater than or equal 5 and also less than or equal 15
        });
        test('returns low when high equals low', () => {
            let int = mapReader.randomInt(5,5);
            expect(int).toBe(5);
        });
        test('throws error when high less than low', () => {
            //expect(mapReader.randomInt(5, 4)).toThrowError();
        });
    })

    describe('getRelevantMapSection', () => {
        // test('returns correct map section', () => {
        //     expect(mapReader.getRelevantMapSection([['0', '13', '7'], ['4', '@', '6']], [['1', '2', '3'], ['4', '@', '6'], ['7', '8', '9']]).toEqual([['1', '2', '3'], ['4', '@', '6']]));
        //     expect(mapReader.getRelevantMapSection([['0', '13', '7'], ['4', '@', '6']], [['1', '2', '3'], ['4', '5', '6'], ['7', '@', '9']]).toEqual([['4', '5', '6'], ['7', '@', '9']]));
        // });
        // test('returns correct map section when size is wierd', () => {
        //     expect(mapReader.getRelevantMapSection([['0', '13', '7'], ['4', '@']], [['1', '2', '3'], ['4', '@', '6'], ['7', '8', '9']]).toEqual([['1', '2', '3'], ['4', '@']]));
        // });
        
        test('returns just the above map element when correct', () => {
            expect(mapReader.getRelevantMapSection([['13'], ['@']], [['1', '2', '3'], ['4', '@', '6'], ['7', '8', '9']])).toStrictEqual([["2"], ["@"]]);
            // expect(mapReader.getRelevantMapSection([['13'], ['@']], [['1', '2', '3'], ['@', '5', '6'], ['7', '8', '9']]).toEqual([['1']['@']]));
            // expect(mapReader.getRelevantMapSection([['13'], ['@']], [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '@']]).toEqual([['6']['@']]));
        }
        );
    }
);

});

// parseRegionPage(layer), createContextSensitiveTile(x, y, type, surroundings), createTile(x, y, type) can't be unit tested effectively because they are functional
// consider using a mock object for the map