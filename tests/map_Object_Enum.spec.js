const mapObject = require('../mapObjectEnum.js');

describe('map_Object_Enum', () => {
    describe('objectDictionary', () => {
        it('should have an objectDictionary', () => {
            expect(mapObject.objectDictionary).toBeDefined();
        });
    });
    describe('addObject', () => {
        it('should add an object to the dictionary', () => {
            mapObject.addObject('+', 'test', '[]');
            expect(mapObject.objectDictionary['+']).toEqual({type: 'test', variations: '[]'});
        });
    });
    describe('updateObject', () => {
        it('should update an object in the dictionary', () => {
            mapObject.addObject('+', 'test', '[]');
            mapObject.updateObject('+', 'variations', '[{requirements: ["test"], tiles: ["test.png"]}]');
            expect(mapObject.objectDictionary['+']).toEqual({type: 'test', variations: '[{requirements: ["test"], tiles: ["test.png"]}]'});
        });
    });
    describe('getObject', () => {
        it('should get an object from the dictionary', () => {
            mapObject.addObject('+', 'test', '[]');
            expect(mapObject.getObject('+')).toEqual({type: 'test', variations: '[]'});
        });
    });
});
