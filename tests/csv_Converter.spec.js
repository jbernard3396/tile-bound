const csv_Converter = require('../csv_Converter');

describe('csv_Converter', () => {
    describe('stripSpecialCharacters', () => {
        it('should remove special characters', () => {
            let csv = '1,2,3\r4,5,6';
            let expected = '1,2,34,5,6';
            expect(csv_Converter.stripSpecialCharacters(csv)).toEqual(expected);
        });
    });

    describe('convertCSVToArray', () => {
        it('converts a csv string into a 2d array', () => {
            let csv = '1,2,3\n4,5,6\n7,8,9';
            let array = csv_Converter.convertCSVToArray(csv);
            expect(array).toEqual([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]);
        });
        it('strips special characters from the csv string', () => {
            let csv = '1,2,3\r\n4,5,6\r\n7,8,9';
            let array = csv_Converter.convertCSVToArray(csv);
            expect(array).toEqual([['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]);
        });
    });

    describe('flip2dArrayDiagonally', () => {
        it('flips an x by x 2d array horizontally', () => {
            let array = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']];
            let newArray = csv_Converter.flip2dArrayDiagonally(array);
            expect(newArray).toEqual([['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]);
        });
        it('flips an x by y 2d array horizontally', () => {
            let array = [['1', '2', '3', '4'], ['5', '6', '7', '8'], ['9', '10', '11', '12']];
            let newArray = csv_Converter.flip2dArrayDiagonally(array);
            expect(newArray).toEqual([['1', '5', '9'], ['2', '6', '10'], ['3', '7', '11'], ['4', '8', '12']]);
        });
    });

    describe('convertCSVToArrayAndFlip', () => {
        it('converts an x by x csv string into a 2d array, and then flips it so it is x,y accessible', () => {
            let csv = '1,2,3\n4,5,6\n7,8,9';
            let array = csv_Converter.convertCSVToArrayAndFlip(csv);
            expect(array).toEqual([['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9']]);
        });
        it('converts an x by y csv string into a 2d array, and then flips it so it is x,y accessible', () => {
            let csv = '1,2,3,4\n5,6,7,8\n9,10,11,12';
            let array = csv_Converter.convertCSVToArrayAndFlip(csv);
            expect(array).toEqual([['1', '5', '9'], ['2', '6', '10'], ['3', '7', '11'], ['4', '8', '12']]);
        });
    });
});